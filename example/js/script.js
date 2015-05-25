// MapQuest OSM Tiles

// Attribution (https://gist.github.com/mourner/1804938)
var osmAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/"" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';

var command="";
command += "PREFIX rdf: <http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#>";
command += "PREFIX local: <http:\/\/localhost\/general_ontology#>";
command += "PREFIX rdfs: <http:\/\/www.w3.org\/2000\/01\/rdf-schema#>";
command += "PREFIX void: <http:\/\/rdfs.org\/ns\/void#>";
command += "PREFIX geo: <http:\/\/www.opengis.net\/ont\/geosparql#>";
command += "PREFIX geof: <http:\/\/www.opengis.net\/def\/geosparql\/function\/>";
command += "PREFIX spatial: <http:\/\/geovocab.org\/spatial#>";
command += "PREFIX strdf: <http:\/\/strdf.di.uoa.gr\/ontology#>";
command += " ";
command += "SELECT DISTINCT ?class ?className ?line ?nameValue ?db ?vocab ?field";
command += "WHERE {";
command += "  ?db void:sparqlEndpoint ?endpoint .";
command += "  ?db local:vocabularyURL ?vocab .";
command += "  ?db local:hasClass ?class .";
command += "  ?class local:className ?className.";
command += "  ?class local:hasField ?field.";
command += "  ?field local:fieldName ?fieldName.";
command += "  ?class local:hasField ?nameField .";
command += "  ?nameField local:fieldName ?nameFieldName.  ";
command += "  FILTER REGEX(STR(?db), \"porto\")";
command += "  FILTER REGEX(STR(?className), \"planet_osm_roads$\")";
command += "  FILTER REGEX(STR(?field), \"planet_osm_roads_name$\")";
command += "  FILTER REGEX(STR(?nameField), \"planet_osm_roads_name$\")";
command += "  {";
command += "    SERVICE SILENT ?endpoint {";
command += "        ?b a ?className.";
command += "        ?b geo:asWKT ?line.";
command += "        ?b ?nameFieldName ?nameValue";
command += "    }";
command += "  }";
command += "}";

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
    feat = {'type': 'Feature', "properties": {"linetype": "map", "name": name, "popupContent": "hi"}, 'geometry':{'type':'Point', 'coordinates':[lat, lon]}, onEachFeature: onEachFeature
};
    if (i<100)
      L.geoJson(feat, {
        style: function(feature) {
        switch (feature.properties.linetype) {
            case 'map': return {color: "#ff0000"};
            case 'car':   return {color: "#0000ff"};
            case 'bus':   return {color: "#0000ff"};
        }
    }
      }).addTo(map);
  }
  
}

function mapLines(data){
  for (i=0; i<data.results.bindings.length;i++){
    var rawCoordsString = data.results.bindings[i].line.value;
    var name = data.results.bindings[i].nameValue.value;
    var coordsArray = rawCoordsString.split("(")[1].split(")")[0].split(",");
    var newCoordsArray = [];
    for (j=0; j<coordsArray.length;j++){
      var lat = coordsArray[j].split(" ")[0];
      var lon = coordsArray[j].split(" ")[1];
      if (isNaN(lat) || isNaN(lon)){
        console.log("there coords are wrong-> lat: "+lat+" long: "+lon +" "+coordsArray[j]);
        continue;
      }
      newCoordsArray.push([lat, lon]);      
      console.log("lat: "+lat+" long: "+lon);
    }
    feat = {
      'type': 'Feature', 
      "properties": 
      {"linetype": "map", "name": name, "popupContent": name}, 
      'geometry':{'type':'LineString', 'coordinates':newCoordsArray}, 
      "id":i+1};
      L.geoJson(feat, {
        style: function(feature) {
          switch (feature.properties.linetype) {
              case 'map': return {color: "#010011"};
              case 'car':   return {color: "#e65d1f"};
              case 'bus':   return {color: "#509ddd"};
          }
        },
        onEachFeature: onEachFeature
      }).addTo(map);
    console.log(i);
    if (i> 20000)
      break;
  }
  
}
L.geoJson(myLines).addTo(map);