
L.Marker.Cluster = L.Class.extend({
    
    initialize: function (clusterer, initialLatLng) {
        this._clusterer = clusterer;
        this._id = Math.round(Math.random() * 100000) + new Date().getMilliseconds();
        this._coords = [];
        this._map = clusterer._map;
        this._marker = null;
        this._zoom = clusterer._map.getZoom();
        
        this.addPoint(initialLatLng);
	},
    
    /**
     * add a point to the cluster
     * @param latLng - L.LatLng
     * @throws Exception if passed an object that is not an instance of L.LatLng
     */
    addPoint: function (latLng) {
        if (latLng instanceof L.LatLng) {
            this._coords.push(latLng);
        } else {
            //TODO: improve upon this.  Allow Points?
            throw "Marker Clusterer can't add objects that are not an instance of L.LatLng";
        }
    },
    
    /**
     * put a cluster on the map.
     */
    redrawCluster: function () {
        this.remove();
        this._clusterer._featureGroup.addLayer(this.getMarker());
        this._clusterer._featureGroup.addLayer(this.getLabel());
    },
    
    /**
     * zoom the map to this cluster's bounds
     */
    fitViewportToCluster: function () {
        var map = this._map,
            clusterBounds = this.getBounds();
        
        if (map.getBoundsZoom(clusterBounds) > map.getZoom()) {
            map.fitBounds(clusterBounds);
        }
        else { //can't zoom in, so center on the cluster
            map.panTo(this.getCenter());
        }
    },
    
    /**
     * @return L.LatLngBounds of the cluster
     */
    getBounds: function () {
        if (this._coords.length === 1) {
            return new L.LatLngBounds(this._coords[0], this._coords[0]);
        } else {
            return new L.LatLngBounds(this._coords);
        }
    },
        
    /**
     * @return L.LatLng @cluster's center [initial point]
     * TODO: determine a way to find the center programtically / more accurately (K-Means?)
     */
    getCenter: function () {
        return this._coords[0];
    },
    
    /**
     * returns an HTML node who's text value is the number of coodinates at this cluster
     * @return L.MarkerLabel
     */
    getLabel: function () {
        var markerText = this._coords.length.toString(),
            textOffset =  1 === markerText.length ? -2 : markerText.length,
            options = {
                labelClass: 'leaflet-cluster leaflet-cluster-' + this._id,
                labelMarkup: markerText,
                offsets: {
                    x: (-1 * this.radius * 0.5) - textOffset
                },
                'zIndexOffset': 10 //FIXME: this should not be hardcoded
            },
            point = this._map.latLngToLayerPoint(this.getCenter());

        this._markerLabel = new L.Marker.Label(point, options);
        // this._markerLabel.on('click', console.log, this);
        
        return this._markerLabel;
    },
    
    /**
     * @return L.MarkerClusterer.Marker (currently L.CircleMarker - plans to augment with diff types)
     */
    getMarker: function () {
        var numDigits = this._coords.length.toString().length,
            options = this._clusterer.options.svgDefaults;
        
        this.radius = Math.max(numDigits * 5, 10);
        options = L.Util.extend(options, { 'radius': this.radius });
        
        this._marker = new L.CircleMarker(this.getCenter(), options);
        this._marker.on('click', this.fitViewportToCluster, this);
        
        return this._marker;
    },
    
    /**
     * remove this cluster from view.
     */
    remove: function () {
        if (this._marker) {
            this._clusterer._featureGroup.removeLayer(this._marker);
            this._clusterer._featureGroup.removeLayer(this._markerLabel);
        }
        this._marker = null;
        this._markerLabel = null;
    }
});
