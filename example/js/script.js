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

var commandData="";
commandData += "PREFIX rdf: <http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#>";
commandData += "PREFIX local: <http:\/\/localhost\/general_ontology#>";
commandData += "PREFIX rdfs: <http:\/\/www.w3.org\/2000\/01\/rdf-schema#>";
commandData += "PREFIX void: <http:\/\/rdfs.org\/ns\/void#>";
commandData += "PREFIX geo: <http:\/\/www.opengis.net\/ont\/geosparql#>";
commandData += "PREFIX geof: <http:\/\/www.opengis.net\/def\/geosparql\/function\/>";
commandData += "PREFIX spatial: <http:\/\/geovocab.org\/spatial#>";
commandData += "PREFIX strdf: <http:\/\/strdf.di.uoa.gr\/ontology#>";
commandData += " ";
commandData += "SELECT DISTINCT ?agg_ID ?eq_ID ?date ?latitude ?longitude ";
commandData += "WHERE {";
commandData += "  ?dbData void:sparqlEndpoint ?dataEndpoint .";
commandData += "  FILTER REGEX(STR(?dbData), \"agosto\")";
commandData += "  ?dbData local:hasClass ?dataClass .";
commandData += "  ?dataClass local:className ?dataClassName.";
commandData += "  FILTER REGEX(STR(?dataClassName), \"agosto\")";
commandData += "  ?dataClass local:hasField ?dataField.";
commandData += "  ?dataField local:fieldName ?dataFieldName.";
commandData += "  FILTER REGEX(STR(?dataField), \"AGG_ID\")";
commandData += "  ?dataClass local:hasField ?dataEidField.";
commandData += "  ?dataEidField local:fieldName ?dataEidFieldName.";
commandData += "  FILTER REGEX(STR(?dataEidField), \"EQUIPMENT\")";
commandData += "  ?dataClass local:hasField ?dataDateField.";
commandData += "  ?dataDateField local:fieldName ?dataDateFieldName.";
commandData += "  FILTER REGEX(STR(?dataDateField), \"AGG_PERIOD_START\")";
commandData += "  ";
commandData += "  ?dbSensors void:sparqlEndpoint ?sensorEndpoint .";
commandData += "  FILTER REGEX(STR(?dbSensors), \"sensor\")";
commandData += "  ?dbSensors local:hasClass ?sensorClass .";
commandData += "  ?sensorClass local:className ?sensorClassName.";
commandData += "  FILTER REGEX(STR(?sensorClassName), \"sensor\")";
commandData += "  ?sensorClass local:hasField ?sensorField.";
commandData += "  ?sensorField local:fieldName ?sensorFieldName.";
commandData += "  FILTER REGEX(STR(?sensorField), \"EQUIPMENTID\")";
commandData += "  ?sensorClass local:hasField ?sensorLat.";
commandData += "  ?sensorLat local:fieldName ?sensorLatName.";
commandData += "  FILTER REGEX(STR(?sensorLatName), \"latitude\")";
commandData += "  ?sensorClass local:hasField ?sensorLon.";
commandData += "  ?sensorLon local:fieldName ?sensorLonName.";
commandData += "  FILTER REGEX(STR(?sensorLonName), \"longitude\")";
commandData += "  ";
commandData += "  {";
commandData += "    SERVICE ?dataEndpoint{";
commandData += "      ?b a ?dataClassName.";
commandData += "      ?b ?dataFieldName ?agg_ID.";
commandData += "      ?b ?dataEidFieldName ?eq_ID.";
commandData += "      ?b ?dataDateFieldName ?date.";
commandData += "      FILTER REGEX(str(?date), \"2014-08-02 00:00\")";
commandData += "    }";
commandData += "    SERVICE ?sensorEndpoint{";
commandData += "      ?c a ?sensorClassName.";
commandData += "      ?c ?sensorFieldName ?eq_ID.";
commandData += "      ?c ?sensorLatName ?latitude .";
commandData += "      ?c ?sensorLonName ?longitude";
commandData += "    }";
commandData += "  }";
commandData += "}";

ajaxRequest(commandData, mapData);


function mapData(data){
  console.log(data);
  var features = [];
  for (i=0; i<data.results.bindings.length;i++){
    var agg_ID = data.results.bindings[i].agg_ID.value;
    var date = data.results.bindings[i].date.value;
    var eq_ID = data.results.bindings[i].eq_ID.value;
    var longitude = data.results.bindings[i].latitude.value.replace(",", ".");
    var latitude = data.results.bindings[i].longitude.value.replace(",", ".");
    if (isNaN(latitude) || isNaN(longitude)){
      console.log("there coords are wrong-> lat: "+latitude+" long: "+longitude);
      continue;
    }
    features.push({
            "geometry": {
                "type": "Point",
                "coordinates": [
                    latitude,
                    longitude
                ]
            },
            "type": "Feature",
            "properties": {
                "popupContent": agg_ID+" "+date
            },
            "id": i+1
        });
    console.log("lat: "+latitude+" long: "+longitude);
    console.log(i);
    if (i> 20000)
      break;
    }
    var indLoopsFeat = {
      'type': 'FeatureCollection', 
      "features": features};
      L.geoJson(indLoopsFeat,{
        onEachFeature: onEachFeature}
      ).addTo(map);
    
  }