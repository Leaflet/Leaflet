export default {
  input: 'leaflet-entry:',
  output: [
    {
      file: 'dist/leaflet-src.js',
      format: 'iife',
      // name: 'L',
      sourcemap: true,
      freeze: false
    }
  ],
  plugins: [
    {
      name: 'leaflet',
      resolveId(id) {
        if (id === 'leaflet-entry:') return id
        if (id[0] === '@') return __dirname + '/..' + id.slice(1)
      },
      load(id) {
        if (id === 'leaflet-entry:') {
          return `
            import * as LL from '@/dist/leaflet-src.esm.js'
            var oldL = window.L;

            function noConflict() {
              window.L = oldL;
              return LL;
            }

            // Always export us to window global (see #2364)
            window.L = LL;
            window.L.noConflict = noConflict`;
        }
      }
    }
  ]
}
