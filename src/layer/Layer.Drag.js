L.Layer = L.Layer || {};

L.Layer.Drag = L.Handler.extend({
    
    includes : L.Mixin.Events,
    
    options: {
        icon: new L.DivIcon({
            className: 'leaflet-dragging'
        })
    },
        
    initialize : function (layer) {
        this._layer = layer;
    },

    addHooks : function () {
        this._layer.on(L.Draggable.START, this._onDown, this);
        this._layer.on(L.Draggable.END, this._onUp, this);
    },

    removeHooks : function () {
        this._layer.off(L.Draggable.START, this._onDown);
        this._layer.off(L.Draggable.END, this._onUp, this);
    },

    getOriginalLatLng : function () {
        return this._originalLatLng || null;
    },

    getLastLatLng : function () {
        return this._lastLatLng || null;
    },

    getCurrentLatLng : function () {
        return this._currentLatLng || null;
    },

    getDifference : function () {
        return this._difference || null;
    },

    hasMoved : function () {
        return !!this._moved;
    },

    _onDown : function (event) {

        if (!this._layer._map) {
            return;
        }

        this._deleteMarker();

        var icon = this.options.icon;

        this._marker = new L.Marker(event.latlng, {
            icon : icon,
            draggable : true
        });

        this._layer._map.addLayer(this._marker);

        this._marker.on('dragstart', this._onDragStart, this);
        this._marker.on('drag', this._onDrag, this);
        this._marker.on('dragend', this._onDragEnd, this);
        
        this._marker.dragging._draggable._onDown(event.originalEvent);
        
    },

    _onDragStart : function (event) {
        this.fire('dragstart', event.target.getLatLng());
        
        this._currentLatLng = this._originalLatLng = event.target.getLatLng();
    },

    _onDrag : function (event) {
        this._moved = true;
        this._updateState(event.target.getLatLng());
        this.fire('drag', this._currentLatLng);
    },

    _onDragEnd : function (event) {
        this._updateState(event.target.getLatLng());
        this._layer._map.removeLayer(this._marker);
        this.fire('dragend', this._currentLatLng);
        this._deleteMarker();
    },

    _onUp : function () {
        this._deleteMarker();
    },
    _deleteMarker : function () {
        if (this._marker) {
            if (this._layer._map) {
                this._layer._map.removeLayer(this._marker);
            }
            delete this._marker;
            this._marker = null;
        }
    },

    _updateState : function (latlng) {

        this._lastLatLng = this._currentLatLng;
        this._currentLatLng = latlng;

        var latDiff = this._currentLatLng.lat - this._lastLatLng.lat;
        var lngDiff = this._currentLatLng.lng - this._lastLatLng.lng;

        this._difference = new L.LatLng(latDiff, lngDiff);
    }

});
