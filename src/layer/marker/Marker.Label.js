
L.Marker.Label = L.CircleMarker.extend({

    options: {
        textColor: '#fff',
        textSize: 14,
        textValue: '',
        styleString: 'font-weight:bold; text-shadow: 1px 1px 1px #333;',
        offsets: {
            x: 0,
            y: 0
        }
    },

    initialize: function (latlng, options) {
        L.CircleMarker.prototype.initialize.call(this, latlng, options);
    },

    onAdd: function (map) {
        this._map = map;
        L.Path.prototype.onAdd.call(this, map);
        this._initLabel();
    },

    onRemove: function (map) {
        this._map = null;
        L.Path.prototype.onRemove.call(this, map);
    },

    _initLabel: function () {
        if (!this._container) {
            return;
        }
        
        this._textElement = L.Path.prototype._createElement('text');
        this._textElement.textContent = this.options.textValue;
        
        this._applyOffsets();
        this._applyStyles();
        
        this._container.appendChild(this._textElement);
    },
    
    _applyStyles: function () {
        var options =  this.options,
            text = this._textElement;
        
        text.setAttribute("fill", options.textColor);
        text.setAttribute("font-size", options.textSize);
        text.setAttribute("style", options.styleString);
    },
    
    /**
     * move the label left and up by user supplied values
     * NOTE: typeof changed to account for IE 8 failing to report typeof number properly when number = 0
     */
    _applyOffsets: function () {
        var offsets = this.options.offsets,
            numChars = this.options.textValue.length,
            xOffset = (0.25 * this._radius - numChars),
            yOffset = (0.40 * this._radius),
            point = this._map.latLngToLayerPoint(this._latlng),
            left = ("undefined" !== typeof offsets.x && 0 !== offsets.x) ?  offsets.x : 0,
            top = ("undefined" !== typeof offsets.y && 0 !== offsets.y) ?  offsets.y : 0;
        
        this._textElement.setAttribute("x", point.x + left + xOffset);
        this._textElement.setAttribute("y", point.y + top + yOffset);
	}
});
