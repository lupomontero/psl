import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import cleaner from 'rollup-plugin-cleaner';
import { terser } from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    input: 'src/index.js',
    output: [
        {
            file: './dist/psl.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        },
        {
            file: './dist/psl.mjs',
            format: 'es',
            exports: 'named',
            sourcemap: true
        },
        {
            file: './dist/psl.umd.js',
            format: 'umd',
            name: 'psl',
            sourcemap: true
        }
    ],
    plugins: [
        cleaner({
            targets: ['./dist/']
        }),
        json(),
        nodePolyfills({ sourceMap: true, include: ['punycode'] }),
        resolve(),
        commonjs(),
		terser({
			ecma: 2018,
			// This will ensure that whenever Rollup is in watch (dev) mode, console logs will not be removed
			// eslint-disable-next-line @typescript-eslint/naming-convention
			compress: { drop_console: !Reflect.has(process.env, 'ROLLUP_WATCH') },
			output: { comments: false }
		})
    ]
};