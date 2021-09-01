const { writeFileSync, readFileSync, unlinkSync } = require('fs')

writeFileSync('./dist/leaflet-src.esm.js', readFileSync('./dist/temp/leaflet-modern.esm.js', 'utf-8'))
writeFileSync('./dist/leaflet-src.esm.js.map', readFileSync('./dist/temp/leaflet-modern.esm.js.map', 'utf-8'))
unlinkSync('./dist/temp/leaflet-modern.esm.js')
unlinkSync('./dist/temp/leaflet-modern.esm.js.map')
