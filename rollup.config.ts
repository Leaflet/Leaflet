// rollup.config.js https://www.npmjs.com/package/@rollup/plugin-typescript
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'esm'
  },
  external: ["angular", "react"]
  plugins: [
    typescript({lib: ["es2015","es5", "dom"], target: "es2015"}),
    babel({ babelHelpers: 'bundled' })
  ]
};