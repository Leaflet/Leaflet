---
layout: tutorial_v2
title: Using GeoJSON with Leaflet
---

<h2>Using GeoJSON with Leaflet</h2>

<p>GeoJSON is a very popular data format among many GIS technologies and services — it's simple, lightweight, straightforward, and Leaflet is quite good at handling it. In this example, you'll learn how to create and interact with map vectors created from <a href="https://tools.ietf.org/html/rfc7946">GeoJSON</a> objects.</p>

{% include frame.html url="example.html" %}

<h3>About GeoJSON</h3>

<p>According to <a href="https://tools.ietf.org/html/rfc7946">GeoJSON Specification (RFC 7946)</a>:</p>

<blockquote>GeoJSON is a format for encoding a variety of geographic data structures […]. A GeoJSON object may represent a region of space (a Geometry), a spatially bounded entity (a Feature), or a list of Features (a FeatureCollection). GeoJSON supports the following geometry types: Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, and GeometryCollection. Features in GeoJSON contain a Geometry object and additional properties, and a FeatureCollection contains a list of Features.</blockquote>

<p>Leaflet supports all of the GeoJSON types above, but <a href="https://tools.ietf.org/html/rfc7946#section-3.2">Features</a> and <a href="https://tools.ietf.org/html/rfc7946#section-3.3">FeatureCollections</a> work best as they allow you to describe features with a set of properties. We can even use these properties to style our Leaflet vectors. Here's an example of a simple GeoJSON feature:</p>

<pre><code>const geojsonFeature = {
	"type": "Feature",
	"properties": {
		"name": "Coors Field",
		"amenity": "Baseball Stadium",
		"popupContent": "This is where the Rockies play!"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-104.99404, 39.75621]
	}
};
</code></pre>

<h3>The GeoJSON layer</h3>

<p>GeoJSON objects are added to the map through a <a href="/reference.html#geojson">GeoJSON layer</a>. To create it and add it to a map, we can use the following code:</p>

<pre><code>new GeoJSON(geojsonFeature).addTo(map);</code></pre>

<p>GeoJSON objects may also be passed as an array of valid GeoJSON objects.</p>

<pre><code>const myLines = [{
	"type": "LineString",
	"coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
	"type": "LineString",
	"coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
</code></pre>

<p>Alternatively, we could create an empty GeoJSON layer and assign it to a variable so that we can add more features to it later.</p>

<pre><code>const myLayer = new GeoJSON().addTo(map);
myLayer.addData(geojsonFeature);
</code></pre>

<h3>Options</h3>

<h4>style</h4>

<p>The <code>style</code> option can be used to style features two different ways. First, we can pass a simple object that styles all paths (polylines and polygons) the same way:</p>

<pre><code>const myLines = [{
	"type": "LineString",
	"coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
	"type": "LineString",
	"coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

const myStyle = {
	"color": "#ff7800",
	"weight": 5,
	"opacity": 0.65
};

new GeoJSON(myLines, {
	style: myStyle
}).addTo(map);</code></pre>

<p>Alternatively, we can pass a function that styles individual features based on their properties. In the example below we check the "party" property and style our polygons accordingly:</p>

<pre><code>const states = [{
	"type": "Feature",
	"properties": {"party": "Republican"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-104.05, 48.99],
			[-97.22,  48.98],
			[-96.58,  45.94],
			[-104.03, 45.94],
			[-104.05, 48.99]
		]]
	}
}, {
	"type": "Feature",
	"properties": {"party": "Democrat"},
	"geometry": {
		"type": "Polygon",
		"coordinates": [[
			[-109.05, 41.00],
			[-102.06, 40.99],
			[-102.03, 36.99],
			[-109.04, 36.99],
			[-109.05, 41.00]
		]]
	}
}];

new GeoJSON(states, {
	style(feature) {
		switch (feature.properties.party) {
			case 'Republican': return {color: "#ff0000"};
			case 'Democrat':   return {color: "#0000ff"};
		}
	}
}).addTo(map);</code></pre>

<h4>pointToLayer</h4>

<p>Points are handled differently than polylines and polygons. By default simple markers are drawn for GeoJSON Points. We can alter this by passing a <code>pointToLayer</code> function in a <a href="/reference.html#geojson">GeoJSON options</a> object when creating the GeoJSON layer. This function is passed a <a href="/reference.html#latlng">LatLng</a> and should return an instance of ILayer, in this case likely a <a href="/reference.html#marker">Marker</a> or <a href="/reference.html#circlemarker">CircleMarker</a>.</p>

<p>Here we're using the <code>pointToLayer</code> option to create a CircleMarker:</p>

<pre><code>const geojsonMarkerOptions = {
	radius: 8,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};

new GeoJSON(someGeojsonFeature, {
	pointToLayer(feature, latlng) {
		return new CircleMarker(latlng, geojsonMarkerOptions);
	}
}).addTo(map);</code></pre>

<p>We could also set the <code>style</code> property in this example &mdash; Leaflet is smart enough to apply styles to GeoJSON points if you create a vector layer like circle inside the <code>pointToLayer</code> function.</p>

<h4>onEachFeature</h4>

<p>The <code>onEachFeature</code> option is a function that gets called on each feature before adding it to a GeoJSON layer. A common reason to use this option is to attach a popup to features when they are clicked.</p>

<pre><code>function onEachFeature(feature, layer) {
	// does this feature have a property named popupContent?
	if (feature.properties &amp;&amp; feature.properties.popupContent) {
		layer.bindPopup(feature.properties.popupContent);
	}
}

const geojsonFeature = {
	"type": "Feature",
	"properties": {
		"name": "Coors Field",
		"amenity": "Baseball Stadium",
		"popupContent": "This is where the Rockies play!"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-104.99404, 39.75621]
	}
};

new GeoJSON(geojsonFeature, {
	onEachFeature: onEachFeature
}).addTo(map);</code></pre>

<h4>filter</h4>

<p>The <code>filter</code> option can be used to control the visibility of GeoJSON features. To accomplish this we pass a function as the <code>filter</code> option. This function gets called for each feature in your GeoJSON layer, and gets passed the <code>feature</code> and the <code>layer</code>. You can then utilise the values in the feature's properties to control the visibility by returning <code>true</code> or <code>false</code>.</p>

<p>In the example below "Busch Field" will not be shown on the map.</p>

<pre><code>const someFeatures = [{
	"type": "Feature",
	"properties": {
		"name": "Coors Field",
		"show_on_map": true
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-104.99404, 39.75621]
	}
}, {
	"type": "Feature",
	"properties": {
		"name": "Busch Field",
		"show_on_map": false
	},
	"geometry": {
		"type": "Point",
		"coordinates": [-104.98404, 39.74621]
	}
}];

new GeoJSON(someFeatures, {
	filter(feature, layer) {
		return feature.properties.show_on_map;
	}
}).addTo(map);</code></pre>

<h3>Layer to GeoJSON Object</h3>

<p><code>Layer</code> can be easily converted to a GeoJSON object.</p>

<p>Suppose we have a following <code>layer</code></p>
<pre><code>var circle = L.circle([51.508, -0.11], {
    color: '#ff7800',
    fillColor: '#000',
    fillOpacity: 0.5,
    radius: 500
})</code></pre>

<p> We can make use of the <code>toGeoJSON</code> method of <code>layer</code> (<code>circle</code> in above case) to convert it to a GeoJSON object</p>

<pre><code>var geoJSONObject = circle.toGeoJSON()</code></pre>

<h4>Coords Precision</h4>

<p>We can also pass the coords precision to the <code>toGeoJSON</code> method, default value is <code>6</code>. Read more about it here <a href="https://leafletjs.com/reference-1.7.1.html#circlemarker-togeojson">toGeoJSON docs</a>.</p>

<pre><code>var geoJSONObject = circle.toGeoJSON(10)</code></pre>

<h4>Style properties</h4>
<p>When we are converting <code>layer</code> to a GeoJSON Object using <code>toGeoJSON</code>, it doesn't automatically add properties to the GeoJSON object. To get properties, we can use <code>options</code> attribute of the <code>layer</code>.</p>

<pre><code>var geoJSONObject = {
	...circle.toGeoJSON(),
	properties: circle.options,
}</code></pre>

<p>If we want to convert above geoJSONObject to a <code>layer</code>. We can refer to above <code>pointToLayer</code> section of this doc.</p>

<p>View the <a href="example.html">example page</a> to see in detail what is possible with the GeoJSON layer.</p>
