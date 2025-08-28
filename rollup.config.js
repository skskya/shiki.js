import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "shiki", // 在 <script> 里直接引入，会暴露成全局变量 window.shiki
      file: "./build/shiki.umd.js", // Rollup 把所有模块打包成一个文件 shiki.umd.js
      format: "umd", // 打包成通用模块（可以在 Node.js / AMD / 浏览器里直接用）。
    },
    plugins: [
      resolve(), // 让 Rollup 能解析 node_modules 里的包。
      commonjs(), // 把 CommonJS 模块 转换成 Rollup 能理解的 ES Module。
      typescript(), //  Rollup 把 TypeScript 编译成 JavaScript。
      terser(), // 压缩代码
    ],
  },
];