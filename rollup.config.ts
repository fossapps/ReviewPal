import type {RollupOptions} from "rollup"
import copy from 'rollup-plugin-copy'
import scss from "rollup-plugin-scss";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import replace from "@rollup/plugin-replace";
const commonPlugins = [
    nodeResolve(),
    external() as any,
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
    })
]

const options: RollupOptions[] = [
    {
        input: "src/popup.tsx",
        output: {
            file: "dist/popup.js",
            sourcemap: true,
            format: "esm"
        },
        plugins: [...commonPlugins, scss({fileName: "content.css"})]
    },
    {
        input: "src/background.ts",
        output: {
            file: "dist/background.js",
            sourcemap: true,
            format: "esm"
        },
        plugins: [...commonPlugins]
    },
    {
        input: "src/content.tsx",
        output: {
            file: "dist/content.js",
            sourcemap: true,
            format: "esm"
        },
        watch: {
            include: ["src/content.tsx", "src/components/*", "src/store/*", "./src/content.scss"]
        },
        plugins: [
            copy({
                targets: [
                    {src: "src/manifest.json", dest: "dist"},
                    {src: "src/popup.html", dest: "dist"},
                    {src: "src/content.html", dest: "dist"},
                    {src: "src/icon.svg", dest: "dist"},
                    {src: "src/icons", dest: "dist"},
                ]
            }),
            scss({fileName: "content.css"}),
            ...commonPlugins
        ]
    }
]

export default options
