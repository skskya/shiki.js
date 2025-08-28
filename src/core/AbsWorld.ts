import Context from './Context';
import * as THREE from 'three';
import { Module } from './Engine';

export abstract class AbsWorld implements Module {
  context: Context;
  // context的clock是引擎层的，即整个项目启动后开始计时，引擎不停止一直计时。该localTime为世界的本地时间，可以用来控制运行停止/继续。
  // 如果单独物体要控制停止/继续，在实体类上自己再设置个物体的本地时间。
  localTime: number; 

  constructor(context: Context) {
    this.context = context;
    this.localTime = 0;
  }

  addToScene(...objs: THREE.Object3D[]) {
    this.context.scene.add(...objs);
  }

  abstract update(deltaTime: number, elapsedTime: number): void;

  disposeAll() {
    // 释放GPU资源
    this.context.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });

    // 移除所有子对象引用
    this.context.scene.clear();

    // 释放其他资源（如纹理、后期处理）
    // this.customDisposables.forEach(res => res.dispose());
  }
}
