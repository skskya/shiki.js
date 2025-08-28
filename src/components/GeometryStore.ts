import * as THREE from 'three';

type GeometryKey = string;

export class GeometryStore  {
  private geometries: Map<GeometryKey,THREE.BufferGeometry>;
  
  constructor() {
    this.geometries = new Map<GeometryKey,THREE.BufferGeometry>();
  }

  
  // 自动创建或复用已有几何体
  getOrCreate<T extends THREE.BufferGeometry>(
    key: GeometryKey,
    createFn: () => T
  ):T {

    if(this.geometries.has(key)) {
       return this.geometries.get(key) as T;
    }

    const geometry  = createFn();
    this.geometries.set(key, geometry);
    return geometry;
  }
  

  // 手动注册几何体
  register(key: GeometryKey, geometry: THREE.BufferGeometry) {
    if(this.geometries.has(key)) {
      console.warn(`[GeometryManager] 重复注册geometry key: ${key}`);
      return;
    }

    this.geometries.set(key, geometry);
  }

  // 根据 key 获取几何体
  get<T extends THREE.BufferGeometry>(key: GeometryKey): T | undefined {
    return this.geometries.get(key) as T | undefined;
  }

  // 释放并清除所有材质
  disposeAll() {
    for (const geometry of this.geometries.values()) {
      geometry.dispose();
    }
    this.geometries.clear();
  }

  // 删除释放单个材质
  dispose(key: GeometryKey) {
    const geometry = this.geometries.get(key);

     if (geometry) {
      geometry.dispose();
      this.geometries.delete(key);
    }
  }
}