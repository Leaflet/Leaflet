L.Map.include({
	compositeCanvases: function (format) {
		format = format || 'image/png';
		var canvas = document.createElement("canvas");
		canvas.width = this.getSize().x;
		canvas.height = this.getSize().y;
		var vpc;
		var ctx = canvas.getContext("2d");
		for (var i in this._layers) {
			if (this._layers[i] instanceof L.TileLayer.Canvas) {
				vpc = this._layers[i].toViewportCanvas();
				ctx.drawImage(vpc, 0, 0);
			}
		}
		return canvas.toDataURL();
	}
});
