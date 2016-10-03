import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/Leaflet.js',
  plugins: [ buble() ],
  format: 'umd'
};
