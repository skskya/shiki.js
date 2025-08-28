/**
 * 使用Three.js的shader 代码模块系统，自定义ShaderChunk模块。
 * 在项目中注册着色器片段 registerShaderChunks('chunkname1','chunkname2')
 * 可通过 include <chunkKey> 引入
 */
import { ShaderChunk } from 'three';
import random2D from './customFunctionshaderChunk/random2D_function';
import linearRemap from './customFunctionshaderChunk/linearRemap_function';

const functionChunks: { [key: string]: string } = {
  random2D,
  linearRemap
};

// 导入全部自定义shader chunks
export function registerAllCustomShaderFunctionChunks() {
  const keys = Object.keys(functionChunks);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof ShaderChunk;
    
    if (ShaderChunk[key]) continue;
    
    ShaderChunk[key] = functionChunks[key];
  }
}

// const chunkLoaders: { [key: string]: () => Promise<{ default: string }> } = {
//   random2D: () => import('./customFunctionshaderChunk/random2D_function.ts'),
//   remap: () => import('./customFunctionshaderChunk/remap_function.ts')
// };

// export async function registerShaderChunksLazy(...names: string[]) {
//   await Promise.all(
//     names.map(async item=>{
//       let name = item.trim() as keyof typeof ShaderChunk;

//     if (ShaderChunk[name]) return;

//     const loader = chunkLoaders[name];
//     if (!loader) {
//       console.warn(`[ShaderChunkLoader] 未找到 ShaderChunk 模块: ${name}`);
//       return;
//     }

//     try {
//       const module = await loader();
//       console.log('1111')
//       ShaderChunk[name] = module.default;
//     } catch (err) {
//       console.error(`[ShaderChunkLoader] 加载失败: ${name}`, err);
//     }
//     })
//   )
// };
