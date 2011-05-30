L.CRS = L.Class.extend({
	latLngToPoint: function(/*LatLng*/ latlng, /*Number*/ scale)/*-> Point*/ {
		var projectedPoint = this.projection.project(latlng);
		return this.transformation._transform(projectedPoint, scale);
	},
	
	pointToLatLng: function(/*Point*/ point, /*Number*/ scale, /*(optional) Boolean*/ unbounded)/*-> LatLng*/ {
		var untransformedPoint = this.transformation.untransform(point, scale);
		return this.projection.unproject(untransformedPoint, unbounded); 
		//TODO get rid of 'unbounded' everywhere
	},
	
	project: L.Projection.LonLat.project
});

L.CRS.EPSG4326 = L.CRS.extend({
	code: 'EPSG:4326',
	projection: L.Projection.LonLat,
	transformation: new L.Transformation(1/360, 0.5, -1/360, 0.5)
});

L.CRS.EPSG3857 = L.CRS.extend({
	code: 'EPSG:3857',
	projection: L.Projection.Mercator,
	transformation: new L.Transformation(0.5/Math.PI, 0.5, -0.5/Math.PI, 0.5),
	
	project: function(/*LatLng*/ latlng)/*-> Point*/ {
		var projectedPoint = this.projection.project(latlng),
			earthRadius = 6378137;
		return projectedPoint.multiplyBy(earthRadius);
	}
});

L.CRS.EPSG3395 = L.CRS.EPSG3857.extend({
	code: 'EPSG:3395'
});