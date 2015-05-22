// MapQuest OSM Tiles

// Attribution (https://gist.github.com/mourner/1804938)
var osmAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/"" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';

var command = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
"PREFIX local: <http://localhost/general_ontology#>"+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
"PREFIX void: <http://rdfs.org/ns/void#>"+
"PREFIX geo: <http://www.opengis.net/ont/geosparql#>"+
"PREFIX geof: <http://www.opengis.net/def/geosparql/function/>"+
"PREFIX spatial: <http://geovocab.org/spatial#>"+
"PREFIX strdf: <http://strdf.di.uoa.gr/ontology#>"+
"SELECT DISTINCT ?className ?line "+
"WHERE { "+
  "?db void:sparqlEndpoint ?endpoint ."+
  "?db local:vocabularyURL ?vocab ."+
  "?db local:hasClass ?class ."+
  "?class local:className ?className."+
  "{"+
    "SERVICE SILENT ?endpoint {"+
      "?b a ?className."+
      "?b geo:asWKT ?line."+
    "}"+
  "}"+
  "FILTER regex(str(?db), \"gisdb\")"+
  "FILTER REGEX(STR(?class), \"planet_osm_line$\")"+
"}" ;

$.ajax({
    type: 'POST',
    url: 'http://localhost:3030/ds/query',
    dataType: 'jsonp',
    data: { query: command }
}).done(mapLines);

var myLines = [];

function mapPoints(data){
  console.log(data.results);
  for (i=0; i<data.results.bindings.length;i++){
    var point = data.results.bindings[i].point.value;
    var lat = point.split("(")[1].split(")")[0].split(" ")[0];
    var lon = point.split("(")[1].split(")")[0].split(" ")[1];
    console.log("lat: "+lat+" long: "+lon);
    feat = {'type': 'Feature', 'geometry':{'type':'Point', 'coordinates':[lat, lon]}};
    if (i<100)
      L.geoJson(feat).addTo(map);
  }
  
}

function mapLines(data){
  for (i=0; i<data.results.bindings.length;i++){
    var rawCoordsString = data.results.bindings[i].line.value;
    var coordsArray = rawCoordsString.split("(")[1].split(")")[0].split(",");
    var newCoordsArray = [];
    for (j=0; j<coordsArray.length;j++){
      var lat = coordsArray[j].split(" ")[0];
      var lon = coordsArray[j].split(" ")[1];
      newCoordsArray.push([lat, lon]);
    }
    feat = {'type': 'Feature', 'geometry':{'type':'LineString', 'coordinates':newCoordsArray}, "id":i+1};
      L.geoJson(feat).addTo(map);
    console.log(i);
    if (i> 20000)
      break;
  }
  
}

var geojson = {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [481650, 4980105],
  },
  'properties': {
    'name': 'University of Minnesota'
  },
  'crs': {
    'type': 'name',
    'properties': {
        'name': 'urn:ogc:def:crs:EPSG::26915'
      }
    }
  };
L.geoJson(myLines).addTo(map);