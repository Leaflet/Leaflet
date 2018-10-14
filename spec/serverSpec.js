// importing Leaflet in server env shouldn't break app

try {
  require('../dist/leaflet-src.js');
  process.exit();
} catch(error) {
  console.error('Failed to import Leaflet in server environment');
  console.error(error);
  process.exit(1);
}
