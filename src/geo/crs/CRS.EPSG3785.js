
L.CRS.EPSG3785 = L.Util.extend({}, L.CRS, {
	code: 'EPSG:3785',
	
	projection: L.Projection.Mercator, 
	transformation: new L.Transformation(0.5/(Math.PI * 6378137), 0.5, -0.5/(Math.PI * 6378137), 0.5)
});