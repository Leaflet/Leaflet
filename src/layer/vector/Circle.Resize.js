/*
 * L.Handler.CircleDrag is used internally by L.Circle to make the circles draggable.
 */

L.Handler.CircleResize = L.Handler.extend({
    options: {
        icon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon'
        })
    },
    
    initialize: function (circle, options) {
        this._circle = circle;
        L.Util.setOptions(this, options);
    },

    addHooks: function () {
        if (this._circle._map) {
            
            // display handler
            this._markerGroup = new L.LayerGroup();
            this._circle._map.addLayer(this._markerGroup);
            this._initHandler();
        }
    },
    
    removeHooks: function () {
        if (this._circle._map) {
            this._circle.off('drag', this._updateHandler, this);
            this._circle._map.removeLayer(this._markerGroup);
            delete this._markerGroup;
            delete this._origins;
        }
    },
    
    _initHandler: function () {
        // define handler (icon and position)
        var icon = this.options.icon,
            bounds = this._circle.getBounds(),
            handlerll = new L.LatLng(this._circle.getLatLng().lat, bounds.getNorthEast().lng);
            
        this._dragHandler = new L.Marker(handlerll, {
                icon: icon,
                draggable: true
            });
        
        // define handler events
        this._dragHandler
            .on('dragstart', this._onDragStart, this)
            .on('drag', this._onDrag, this)
            .on('dragend', this._onDragEnd, this);
        
        this._circle.on('drag', this._updateHandler, this);
        this._markerGroup.addLayer(this._dragHandler);
        this._setOrigins();
    },
    
    _updateHandler: function (e) {
        var originc = this._origins.circle,
            originh = this._origins.handler,
            newc = this._circle._map.project(this._circle.getLatLng()),
            delta = {
                x: newc.x - originc.x,
                y: newc.y - originc.y
            };
        
        var hpoint = new L.Point(originh.x + delta.x, originh.y + delta.y);
        this._dragHandler.setLatLng(this._circle._map.unproject(hpoint));
    },
    
    _onDragStart: function (e) {
    },
    
    _onDrag: function (e) {
        var circleCenter = this._circle.getLatLng(),
            handlerPos = e.target.getLatLng();
        this._circle.setRadius(circleCenter.distanceTo(handlerPos));
        this._circle.fire('resize');
    },
    
    _onDragEnd: function () {
        this._setOrigins();
    },
    
    _setOrigins: function () {
        // memorize circle and handler origins
        if (typeof(this._circle._map) !== 'undefined' && this._circle._map instanceof L.Map) {
            var map = this._circle._map;
            this._origins = {
                circle: map.project(this._circle.getLatLng()),
                handler: map.project(this._dragHandler.getLatLng())
            };
        }
    }
    
});
