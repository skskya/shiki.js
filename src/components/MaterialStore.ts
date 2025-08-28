import * as THREE from 'three';

type MaterialKey = string;

export class MaterialStore {
  private materials: Map<MaterialKey,THREE.Material>;
  
  constructor() {
    this.materials = new Map<MaterialKey,THREE.Material>();
  }

  
  // 自动创建或复用已有材质
  getOrCreate<T extends THREE.Material>(
    key: MaterialKey,
    createFn: () => T
  ):T {

    if(this.materials.has(key)) {
       return this.materials.get(key) as T;
    }

    const material = createFn();
    this.materials.set(key, material);
    return material;
  }
  

  // 手动注册材质
  register(key: MaterialKey, material: THREE.Material) {
    if(this.materials.has(key)) {
      console.warn(`[MaterialManager] 重复注册material key: ${key}`);
      return;
    }

    this.materials.set(key, material);
  }

  // 根据 key 获取材质
  get<T extends THREE.Material>(key: MaterialKey): T | undefined {
    return this.materials.get(key) as T | undefined;
  }

  // 释放并清除所有材质
  disposeAll() {
    for (const material of this.materials.values()) {
      material.dispose();
    }
    this.materials.clear();
  }

  // 删除释放单个材质
  dispose(key: MaterialKey) {
    const material = this.materials.get(key);

     if (material) {
      material.dispose();
      this.materials.delete(key);
    }
  }
}