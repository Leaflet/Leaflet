var fs = require('fs');

function makeJSON(){
//grab the two stylesheets
var main = fs.readFileSync('src/CSS/leaflet.css','utf8');
var ie = fs.readFileSync('src/CSS/leaflet.ie.css','utf8');
//clean them and put them into an object
var css = {main : clean(main), ie : clean(ie)};
//stringify them to put them into a file, don't forget the intent
var out = JSON.stringify(css, '' ,"    ");
//and write them along with the name their going to have and the trailing semi colin
fs.writeFileSync("./src/CSS/CSSfiles.js", "L.CSS = " + out+";");
}

exports.json = makeJSON;
//the cleaning function, it strips css and line breaks and tabs
function clean(t){
    return t.replace(/\/\*.*\*\//mg,"").replace(/(\r|\n|\t)/g,"");
}