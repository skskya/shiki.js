import * as THREE from 'Three';
import Context from '../core/Context';
import { Mouse } from './Mouse';

// 使用RaycastSelector需要在Engine初始化时配置 enableMouse: true
export class RaycastSelector {
  private raycaster: THREE.Raycaster;

  constructor(
     private camera: THREE.Camera,
     private mouse: Mouse,
  ) {
    this.raycaster = new THREE.Raycaster();
  }

  // 获取所有相交
  getInterSections(targets: THREE.Object3D[]) {
    this.raycaster.setFromCamera(this.mouse.mouseScreenNDC, this.camera);
    const intersections = this.raycaster.intersectObjects(targets, true);
    return intersections;
  }

  // 获取第一个相交
  getFirstIntersection(targets: THREE.Object3D[]) {
    const intersections = this.getInterSections(targets);
    const intersection = intersections[0];
    if (!intersection) {
      return null;
    }
    return intersection;
  }
}
