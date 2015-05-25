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
command += "SELECT DISTINCT ?line ?roadReference ?highwayType ";
command += "WHERE {";
command += "  ?db void:sparqlEndpoint ?endpoint .";
command += "  ?db local:vocabularyURL ?vocab .";
command += "  ?db local:hasClass ?class .";
command += "  ?class local:className ?className.";
command += "  ?class local:hasField ?highwayField .";
command += "  ?highwayField local:fieldName ?highwayFieldName.";
command += "  ";
command += "  ?class local:hasField ?refField.";
command += "  ?refField local:fieldName ?refFieldName";

command += "  FILTER REGEX(STR(?db), \"porto\")";
command += "  FILTER REGEX(STR(?className), \"planet_osm_line$\")";
command += "  FILTER REGEX(STR(?highwayFieldName), \"planet_osm_line_highway$\")";
command += "  FILTER REGEX(STR(?refFieldName), \"planet_osm_line_ref$\")";
command += "  {";
command += "    SERVICE SILENT ?endpoint {";
command += "        ?b a ?className.";
command += "        ?b geo:asWKT ?line.";
command += "        ?b ?highwayFieldName ?highwayType.";
command += "        ?b ?refFieldName ?roadReference";
command += "    }";
command += "  }";
command += "}";

function ajaxRequest(theQuery, resultProcessingFunction) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3030/ds/query',
    dataType: 'jsonp',
    data: { query: theQuery }
  }).done(resultProcessingFunction);
}

ajaxRequest(command, mapLines);

var myLines = [];

function mapLines(data){
  for (i=0; i<data.results.bindings.length;i++){
    var rawCoordsString = data.results.bindings[i].line.value;
    console.log(data.results.bindings[i]);
    var name = data.results.bindings[i].roadReference.value;
    var roadType = data.results.bindings[i].highwayType.value;
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
      {"linetype": "road-"+roadType, "name": name, "popupContent": name}, 
      'geometry':{'type':'LineString', 'coordinates':newCoordsArray}, 
      "id":i+1};
      L.geoJson(feat, {
        style: function(feature) {
          switch (feature.properties.linetype) {
            case 'road-motorway': return {color: "#0000FF"};
            case 'road-motorway_link': return {color: "#0000FF"};
            case 'road-trunk': return {color: "#008000"};
            case 'road-primary': return {color: "#FF0000"};
            case 'road-secondary': return {color: "#FFA500"};
            case 'road-tertiary': return {color: "#FFFF00s"};
            default: return {color: "#585858"};
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