L.Rectangle.Drag = L.Handler.extend({

    initialize : function (rectangle) {
        this._rectangle = rectangle;
    },

    addHooks : function () {
        if (!this._draggable) {
            this._draggable = new L.Layer.Drag(this._rectangle);
            this._draggable.on('dragstart', this._onDragStart, this).on('drag',
                    this._onDrag, this).on('dragend', this._onDragEnd, this);
        }
        this._draggable.enable();
    },

    removeHooks : function () {

        this._draggable.disable();
    },

    hasMoved : function () {
        return this._draggable && this._draggable.hasMoved();
    },

    _onDragStart : function (latlng) {

        this._rectangle.fire('dragstart').fire('movestart');

    },

    _onDrag : function (latlng) {
        this._updateBounds();
        this._rectangle.fire('drag').fire('move');

    },

    _onDragEnd : function (latlng) {
        this._updateBounds();
        this._rectangle.fire('dragend').fire('moveend');
    },

    _updateBounds : function () {
        var difference = this._draggable.getDifference();

        var boundsOld = this._rectangle.getBounds();

        var boundsNew = new L.LatLngBounds(
                new L.LatLng(boundsOld.getSouthWest().lat + difference.lat,
                        boundsOld.getSouthWest().lng + difference.lng, true).clamp(),
                new L.LatLng(boundsOld.getNorthEast().lat + difference.lat,
                        boundsOld.getNorthEast().lng + difference.lng, true).clamp());

        this._rectangle.setBounds(boundsNew);

    }

});

L.Rectangle.prototype._preDrag = {
    initialize : L.Rectangle.prototype.initialize,
    onAdd : L.Rectangle.prototype.onAdd,
    onRemove : L.Rectangle.prototype.onRemove
};

L.Rectangle.prototype.initialize = function (latLngBounds, options) {
    L.Rectangle.prototype._preDrag.initialize.call(this, latLngBounds, options);

    this.dragging = new L.Rectangle.Drag(this);
};

L.Rectangle.prototype.onAdd = function (map) {
    L.Rectangle.prototype._preDrag.onAdd.call(this, map);
    if (this.options.draggable) {
        this.dragging.enable();
    }

};

L.Rectangle.prototype.onRemove = function (map) {
    if (this.options.draggable) {
        this.dragging.disable();
    }
    L.Rectange.prototype._preDrag.onRemove.call(this, map);
};
