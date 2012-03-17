/* This class adds the capability to Rectangle to be resizable */
L.Rectangle.Resize = L.Handler.extend({

    options: {
        // this option sets the max amount of pixels a drag can be from
        // a corner to count as a corner drag for resizing purposes
        cornerPixels: 20
    },

    initialize : function (rectangle) {
        this._rectangle = rectangle;
    },

    addHooks : function () {
        this._init();
    },

    removeHooks : function () {
        this._destroy();
    },

    _init : function () {
        if (this._border) {
            return;
        }
        
        if (!this._rectangle._map) {
            return;
        }

        this._border = new L.Polyline(this._rectangle.getLatLngs(), {
                color: this._rectangle.options.color,
                opacity: this._rectangle.options.opacity,
                weight: this._rectangle.options.weight,
                stroke: this._rectangle.options.stroke,
                clickable: true
            });
        this._rectangle._map.addLayer(this._border);

        this._draggable = new L.Layer.Drag(this._border)
                .on('dragstart', this._onDragStart, this)
                .on('drag', this._onDrag, this)
                .on('dragend', this._onDragEnd, this);
        
        this._draggable.enable();

        this._rectangle
                .on('drag', this._updateBorder, this)
                .on('dragend', this._updateBorder, this)
                .on('dragstart', this._updateBorder, this);

    },

    _destroy : function () {
        if (this._border) {
            this._border._map.removeLayer(this._border);
          
            this._rectangle
                .off('drag', this._updateBorder)
                .off('dragend', this._updateBorder)
                .off('dragstart', this._updateBorder);
            
            delete this._border;
        }
        
        if (this._draggable) {
            this._draggable
                .off('dragstart', this._onDragStart)
                .off('drag', this._onDrag)
                .off('dragend', this._onDragEnd);
            
            delete this._draggable;
        }
    },

    _onDragStart : function () {
        this._rectangle.fire('movestart');
        this._initDrag();
        this._update();
    },

    _onDrag : function () {
        this._update();
        this._rectangle.fire('move');

    },

    _onDragEnd : function () {
        this._update();
        this._rectangle.fire('moveend');

    },

    _updateBorder : function () {
        if (this._border) {
            this._border.setLatLngs(this._rectangle.getLatLngs());
        }
    },

    _initDrag : function () {
        var oLatLng = this._draggable.getOriginalLatLng();
        var bounds = this._rectangle.getBounds();

        var wLng = bounds.getSouthWest().lng;
        var sLat = bounds.getSouthWest().lat;
        var eLng = bounds.getNorthEast().lng;
        var nLat = bounds.getNorthEast().lat;

        var wLngDiff = Math.abs(oLatLng.lng - wLng);
        var eLngDiff = Math.abs(oLatLng.lng - eLng);
        var sLatDiff = Math.abs(oLatLng.lat - sLat);
        var nLatDiff = Math.abs(oLatLng.lat - nLat);

        var oPoint = this._rectangle._map.project(oLatLng);
        
        var nePointDiff = Math.abs(oPoint
                .distanceTo(this._rectangle._map.project(bounds
                        .getNorthEast())));
        
        var nwPointDiff = Math.abs(oPoint
                .distanceTo(this._rectangle._map.project(bounds
                        .getNorthWest())));
        
        var sePointDiff = Math.abs(oPoint
                .distanceTo(this._rectangle._map.project(bounds
                        .getSouthEast())));
        
        var swPointDiff = Math.abs(oPoint
                .distanceTo(this._rectangle._map.project(bounds
                        .getSouthWest())));
        
        var MAX_PIXELS = this.options.cornerPixels;

        var min = Math.min(wLngDiff, eLngDiff, sLatDiff, nLatDiff);

        // Drag Direction is where the drag direction is, and how the
        //  various lat lng of each drag event will be interpreted.
        
        // If the drag was started on the
        //  north border then all updates will cause the northwest
        //  and northeast lat lngs to update but nothing else

        if (nePointDiff < MAX_PIXELS) {
            this._dragDirection = 'ne';
        }
        else if (nwPointDiff < MAX_PIXELS) {
            this._dragDirection = 'nw';
        }
        else if (swPointDiff < MAX_PIXELS) {
            this._dragDirection = 'sw';
        }
        else if (sePointDiff < MAX_PIXELS) {
            this._dragDirection = 'se';
        }
        else if (nLatDiff === min) {
            this._dragDirection = 'n';
        }
        else if (sLatDiff === min) {
            this._dragDirection = 's';
        }
        else if (eLngDiff === min) {
            this._dragDirection = 'e';
        }
        else if (wLngDiff === min) {
            this._dragDirection = 'w';
        }
    },

    _update : function () {
        var difference = this._draggable.getDifference() || 0;

        if (!difference) {
            return;
        }

        var neLatLngOld = this._rectangle.getBounds().getNorthEast();
        var swLatLngOld = this._rectangle.getBounds().getSouthWest();
        var swLatLngNew = null, neLatLngNew = null;

        switch (this._dragDirection) {
        case 'n':
            neLatLngNew = new L.LatLng(
                    neLatLngOld.lat + difference.lat,
                    neLatLngOld.lng).clamp();
            swLatLngNew = swLatLngOld;
            break;
        case 'nw':
            neLatLngNew = new L.LatLng(
                    neLatLngOld.lat + difference.lat,
                    neLatLngOld.lng);
            swLatLngNew = new L.LatLng(
                    swLatLngOld.lat,
                    swLatLngOld.lng + difference.lng, true).clamp();
            break;
        case 'ne':
            neLatLngNew = new L.LatLng(
                    neLatLngOld.lat + difference.lat,
                    neLatLngOld.lng + difference.lng, true).clamp();
            swLatLngNew = swLatLngOld;
            break;
        case 's':
            neLatLngNew = neLatLngOld;
            swLatLngNew = new L.LatLng(
                    swLatLngOld.lat + difference.lat,
                    swLatLngOld.lng);
            break;
        case 'sw':
            neLatLngNew = neLatLngOld;
            swLatLngNew = new L.LatLng(
                    swLatLngOld.lat + difference.lat,
                    swLatLngOld.lng + difference.lng, true).clamp();
            break;
        case 'se':
            neLatLngNew = new L.LatLng(
                    neLatLngOld.lat,
                    neLatLngOld.lng + difference.lng, true).clamp();
            swLatLngNew = new L.LatLng(
                    swLatLngOld.lat + difference.lat,
                    swLatLngOld.lng);
            break;
        case 'e':
            neLatLngNew = new L.LatLng(
                    neLatLngOld.lat,
                    neLatLngOld.lng + difference.lng, true).clamp();
            swLatLngNew = swLatLngOld;
            break;
        case 'w':
            neLatLngNew = neLatLngOld;
            swLatLngNew = new L.LatLng(
                    swLatLngOld.lat,
                    swLatLngOld.lng + difference.lng, true).clamp();
            break;
        }

        
        this._rectangle.setBounds(new L.LatLngBounds(swLatLngNew, neLatLngNew));
        this._border.setLatLngs(this._rectangle.getLatLngs());

    }

});


// The following code wraps the rectangles initialize, onAdd
// and onRemove functions to call into the Rectangle.Resize Handler
L.Rectangle.prototype._preResize = {
    initialize : L.Rectangle.prototype.initialize,
    onAdd : L.Rectangle.prototype.onAdd,
    onRemove : L.Rectangle.prototype.onRemove
};

L.Rectangle.prototype.initialize = function (latlngBounds, options) {
    L.Rectangle.prototype._preResize.initialize.call(this, latlngBounds,
            options);
    this.resizing = new L.Rectangle.Resize(this);
};

L.Rectangle.prototype.onAdd = function (map) {
    L.Rectangle.prototype._preResize.onAdd.call(this, map);
    if (this.options.resizable) {
        this.resizing.enable();
    }
};

L.Rectangle.prototype.onRemove = function (map) {
    if (this.options.resizable) {
        this.resizing.disable();
    }
    L.Rectangle.prototype._preResize.onRemove.call(this, map);
};
