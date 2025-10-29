import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'dist/psl.umd.cjs',
  output: {
    file: 'dist/psl.es5.cjs',
    format: 'umd',
    name: 'psl',
    exports: 'auto',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),

    commonjs(),

    // Transpile to ES5 with Babel
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: '4.0',
            },
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            loose: true,
            bugfixes: false,
          },
        ],
      ],
      comments: false,
    }),

    // Minify the output
    terser({
      ecma: 5,
      compress: {
        passes: 2,
      },
      format: {
        comments: false,
      },
    }),
  ],
};
