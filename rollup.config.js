import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: './dist/psl.js',
    output: {
        file: './dist/psl.esm.js',
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        commonjs(),
    ]
}
