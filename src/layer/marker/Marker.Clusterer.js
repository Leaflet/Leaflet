
L.Marker.Clusterer = L.Class.extend({
    
    options: {
        clusterRadius: 100,
        svgDefaults: {
            stroke: true,
            color: '#4159bb',
            opacity: 0.75,
            fillOpacity: 0.5,
            fillColor: '#4159ff'
        }
    },
    
    initialize: function (options) {
        L.Util.setOptions(this, options);
        
        this._clusters = {};
        this._dirtyClusters = {};
    },
    
    onAdd: function (map, options) {
        this._map = map;
        this._featureGroup = new L.FeatureGroup();
        
        map.on('zoomend', this._resetView, this);
        map.on('dragend', this._resetView, this);
        
        this._resetView();
    },
    
    onRemove: function () {
        this.clearClusters();
        this._map.off('zoomend', this._resetView, this);
        this._map.off('dragend', this._resetView, this);
        
        this._map = null;
        this._featureGroup = null;
    },
    
    /**
     * add new markers
     * @param latLngs - Array of markers to add to the Clusterer
     */
    addMarkers: function (latLngs) {
        for (var i = latLngs.length; i--;) {
            var coord = latLngs[i];
            this.addPointToClusterer(coord, true);
        }

        this._redrawClusters();
    },
    
    /**
    * ask the controller to add a new point to the correct cluster
    * @param marker - L.LatLng
    * @param batch - boolean - used with addMarkers to prevent a redraw on each addition
    */
    addPointToClusterer: function (latLng, batch) {
        var radius = this.options.clusterRadius,
            point = this._map.latLngToLayerPoint(latLng),
            clusters = this._clusters,
            zoom = this._map.getZoom(),
            cluster, clusterCenter, targetCluster;

        for (cluster in clusters) {
            if (clusters.hasOwnProperty(cluster)) {

                clusterCenter = this._map.latLngToLayerPoint(clusters[cluster].getCenter());

                if (point.distanceTo(clusterCenter) < radius) {
                    targetCluster = clusters[cluster];
                    break;
                }
            }
        }

        if (!targetCluster) {
            targetCluster = new L.Marker.Cluster(this, latLng);
            this._clusters[targetCluster._id] = targetCluster;
        } else {
            targetCluster.addPoint(latLng);
        }

        if (batch) {
            this._dirtyClusters[targetCluster._id] = targetCluster;
        } else {
            this._redrawClusters();
        }
    },
    
    /**
     * clear the existing markers, and terminate all references to clusters, effectively resetting the board
     */
    clearClusters: function () {
        this._clearLayers();
        
        this._clusters = {};
        this._dirtyClusters = {};
        this._coords = [];
    },
    
    /*
     * convenience method to clear markers
     */
    _clearLayers: function () {
        if (this._featureGroup && "function" === typeof this._featureGroup.clearLayers) {
            this._featureGroup.clearLayers();
        }
    },

    /**
    * return the feature group for assignment / manipulation
    * @return L.FeatureGroup
    */
    getFeatureGroup: function () {
        return this._featureGroup;
    },

    /**
    * by collecting all the bounds from each cluster, we can make one huge bounds representing the area of the map with clusters
    * @return L.LatLngBounds - the computed bounds object
    */
    getClustererBounds: function () {
        var clusters = this._clusters,
           finalBounds, cluster;

        for (cluster in clusters) {
            if (clusters.hasOwnProperty(cluster)) {
                if ("undefined" === typeof finalBounds) {
                    finalBounds = clusters[cluster].getBounds();
                } else {
                    //extend allows a single latLng at present, so extend by bounds using SW / NE points
                    finalBounds.extend(clusters[cluster].getBounds().getSouthWest());
                    finalBounds.extend(clusters[cluster].getBounds().getNorthEast());
                }
            }
        }
        return finalBounds;
    },

    /**
     * @return obj. literal - subset of clusters that are in the current viewport
     * @param bounds - L.LatLngBounds - optional parameter to restrict the clusters returned to a different bounds
     */
    _getClustersInView: function (bounds) {
        var mapBounds = "undefined" === typeof bounds ? this._map.getBounds() : bounds,
            clusters = this._clusters,
            clustersInView = [],
            zoom = this._map.getZoom(),
            minZoom = this._map.getMinZoom(),
            cluster, currentCluster, clusterCenter;
            
        for (cluster in clusters) {
            if (clusters.hasOwnProperty(cluster)) {
                
                currentCluster = clusters[cluster];
                clusterCenter = currentCluster.getCenter();
    
                //if zoomed all the way out, redraw them ALL
                if ((zoom === minZoom) || mapBounds.contains(clusterCenter)) {
                    clustersInView.push(currentCluster);
                }
            }
        }
        return clustersInView;
    },
    
    /**
     * iterate over "dirty" clusters in need of redraw
     */
    _redrawClusters: function () {
        for (var cluster in this._dirtyClusters) {
            if (this._dirtyClusters.hasOwnProperty(cluster)) {
                this._dirtyClusters[cluster].redrawCluster();
            }
        }
        this._dirtyClusters = {};
    },
    
    /**
     * callback to map change
     */
    _resetView: function () {
        var clustersToRedraw = this._getClustersInView(),
            mapZoom = this._map.getZoom(),
            orphanPoints = [],
            currentCluster, i;
             
        for (i = clustersToRedraw.length; i--;) {
            currentCluster = clustersToRedraw[i];
             
            if (currentCluster._zoom !== mapZoom) {
                orphanPoints = orphanPoints.concat(currentCluster._coords);
                currentCluster.remove();
                delete this._clusters[currentCluster._id];
            }
        }
        
        this.addMarkers(orphanPoints);
        
        this._map.removeLayer(this._featureGroup);
        this._map.addLayer(this._featureGroup);
    }
    
});
