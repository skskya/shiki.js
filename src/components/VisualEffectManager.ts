import Context from '../core/Context';
import { Module } from '../core/Engine';
import * as THREE from 'Three';

// VFX视觉特效（Visual Special Effects)
export abstract class AbsVisualEffect {
  abstract mesh: THREE.Object3D;  // 特效的3D对象
  abstract play(): Promise<void>; // 播放特效（返回Promise便于链式调用）
  abstract dispose(): void;       // 释放资源
  abstract update(deltaTime: number, elapsedTime: number): void; // 更新
}

// VFX管理器，需要管理场景中的动态对象，并且效果是临时性的
export class VisualEffectManager implements Module {
  context: Context;
  private activeEffects: Set<AbsVisualEffect> = new Set();

  constructor(context: Context) {
    this.context = context;
  }

  addEffectToScene(effect: AbsVisualEffect) {
    this.context.scene.add(effect.mesh);
    this.activeEffects.add(effect);

    effect.play().then(() => {
      effect.dispose();
      this.context.scene.remove(effect.mesh);
      this.activeEffects.delete(effect);
    });

  }

   update(deltaTime: number, elapsedTime: number) {
    this.activeEffects.forEach(effect => effect.update(deltaTime, elapsedTime));
  }
}
