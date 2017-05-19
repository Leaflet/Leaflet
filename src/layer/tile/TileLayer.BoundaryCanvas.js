L.TileLayer.BoundaryCanvas = L.TileLayer.Canvas.extend({
	options: {
        // all rings of boundary should be without self-intersections or intersections with other rings
        // zero-winding fill algorithm is used in canvas, so holes should have opposite direction to exterior ring
        // boundary can be
        // LatLng[] - simple polygon
        // LatLng[][] - polygon with holes
        // LatLng[][][] - multipolygon
        boundary: null
	},

	initialize: function (url, options) {
		L.Util.setOptions(this, options);
        this._url = url;
        this._boundaryCache = {}; //cache index "x:y:z"
        this._mercBoundary = null;
        this._mercBbox = null;
	},
    
    //lazy calculation of layer's boundary in map's projection. Bounding box is also calculated
    _getOriginalMercBoundary: function () {

        if (this._mercBoundary) {
            return this._mercBoundary;
        }

        this._mercBoundary = [];
        var b = this.options.boundary,
            c, r, p,
            mercComponent,
            mercRing,
            compomentBbox;

        
        if (!(b[0] instanceof Array)) {
            b = [[b]];
        } else if (!(b[0][0] instanceof Array)) {
            b = [b];
        }

        for (c = 0; c < b.length; c++) {
            mercComponent = [];
            for (r = 0; r < b[c].length; r++) {
                mercRing = [];
                for (p = 0; p < b[c][r].length; p++) {
                    mercRing.push(this._map.project(b[c][r][p], 0));
                }
                mercComponent.push(mercRing);
            }
            this._mercBoundary.push(mercComponent);
        }

        this._mercBbox = new L.Bounds();
        for (c = 0; c < this._mercBoundary.length; c++) {
            compomentBbox = new L.Bounds(this._mercBoundary[c][0]);
            this._mercBbox.extend(compomentBbox.min);
            this._mercBbox.extend(compomentBbox.max);
        }

        return this._mercBoundary;
    },

    // Calculates intersection of original boundary geometry and tile boundary.
    // Uses quadtree as cache to speed-up intersection.
    // Return 
    //   {isOut: true} if no intersection,  
    //   {isIn: true} if tile is fully inside layer's boundary
    //   {geometry: <LatLng[][][]>} otherwise
    _getTileGeometry: function (x, y, z, skipIntersectionCheck) {
        if ( !this.options.boundary) {
            return {isOut: true};
        }
    
        var cacheID = x + ":" + y + ":" + z,
            zCoeff = Math.pow(2, z),
            parentState,
            clippedGeom = [],
            iC, iR,
            clippedComponent,
            clippedExternalRing,
            clippedHoleRing,
            isRingBbox = function (ring, bbox) {
                if (ring.length !== 4) {
                    return false;
                }

                var p;
                for (p = 0; p < 4; p++) {
                    if ((ring[p].x !== bbox.min.x && ring[p].x !== bbox.max.x) ||
                        (ring[p].y !== bbox.min.y && ring[p].y !== bbox.max.y)) {
                        return false;
                    }
                }
                return true;
            };

        if (this._boundaryCache[cacheID]) {
            return this._boundaryCache[cacheID];
        }

        var mercBoundary = this._getOriginalMercBoundary(),
            ts = this.options.tileSize,
            tileBbox = new L.Bounds(new L.Point(x * ts / zCoeff, y * ts / zCoeff), new L.Point((x + 1) * ts / zCoeff, (y + 1) * ts / zCoeff));

        //fast check intersection
        if (!skipIntersectionCheck && !tileBbox.intersects(this._mercBbox)) {
            return {isOut: true};
        }

        if (z === 0) {
            this._boundaryCache[cacheID] = {geometry: mercBoundary};
            return this._boundaryCache[cacheID];
        }

        parentState = this._getTileGeometry(Math.floor(x / 2), Math.floor(y / 2), z - 1, true);

        if (parentState.isOut || parentState.isIn) {
            return parentState;
        }

        for (iC = 0; iC < parentState.geometry.length; iC++) {
            clippedComponent = [];
            clippedExternalRing = L.PolyUtil.clipPolygon(parentState.geometry[iC][0], tileBbox);
            if (clippedExternalRing.length === 0) {
                continue;
            }

            clippedComponent.push(clippedExternalRing);

            for (iR = 1; iR < parentState.geometry[iC].length; iR++) {
                clippedHoleRing = L.PolyUtil.clipPolygon(parentState.geometry[iC][iR], tileBbox);
                if (clippedHoleRing.length > 0) {
                    clippedComponent.push(clippedHoleRing);
                }
            }
            clippedGeom.push(clippedComponent);
        }

        if (clippedGeom.length === 0) { //we are outside of all multipolygon components
            this._boundaryCache[cacheID] = {isOut: true};
            return this._boundaryCache[cacheID];
        }

        for (iC = 0; iC < clippedGeom.length; iC++) {
            if (isRingBbox(clippedGeom[iC][0], tileBbox)) {
                //inside exterior rings and no holes
                if (clippedGeom[iC].length === 1) {
                    this._boundaryCache[cacheID] = {isIn: true};
                    return this._boundaryCache[cacheID];
                }
            } else { //intersect exterior ring
                this._boundaryCache[cacheID] = {geometry: clippedGeom};
                return this._boundaryCache[cacheID];
            }

            for (iR = 1; iR < clippedGeom[iC].length; iR++) {
                if (!isRingBbox(clippedGeom[iC][iR], tileBbox)) { //inside exterior ring, but have intersection with hole
                    this._boundaryCache[cacheID] = {geometry: clippedGeom};
                    return this._boundaryCache[cacheID];
                }
            }
        }

        //we are inside all holes in geometry
        this._boundaryCache[cacheID] = {isOut: true};
        return this._boundaryCache[cacheID];
    },

	drawTile: function (canvas, tilePoint, zoom) {
        var ts = this.options.tileSize,
            tileX = ts * tilePoint.x,
            tileY = ts * tilePoint.y,
            zCoeff = Math.pow(2, zoom),
            ctx = canvas.getContext('2d'),
            imageObj = new Image(),
            _this = this,
            setPattern = function () {
            
            var state = _this._getTileGeometry(tilePoint.x, tilePoint.y, zoom),
                c, r, p,
                pattern,
                geom;

            if (state.isOut) {
                return;
            }

            if (!state.isIn) {
                geom = state.geometry;
                ctx.beginPath();

                for (c = 0; c < geom.length; c++) {
                    for (r = 0; r < geom[c].length; r++) {
                        if (geom[c][r].length === 0) {
                            continue;
                        }

                        ctx.moveTo(geom[c][r][0].x * zCoeff - tileX, geom[c][r][0].y * zCoeff - tileY);
                        for (p = 1; p < geom[c][r].length; p++) {
                            ctx.lineTo(geom[c][r][p].x * zCoeff - tileX, geom[c][r][p].y * zCoeff - tileY);
                        }
                    }
                }
                ctx.clip();
            }

            pattern = ctx.createPattern(imageObj, "repeat");
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = pattern;
            ctx.fill();
        };
        
        imageObj.onload = function () {
            setTimeout(setPattern, 0); //IE9 bug - black tiles appear randomly if call setPattern() without timeout
        }
        imageObj.src = this.getTileUrl(tilePoint, zoom);
	}
});
