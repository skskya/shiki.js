import * as THREE from "three";

export interface ThridPersonCameraConfig {
  camera: THREE.Camera;
  offset?: THREE.Vector3;
  lookAt?: THREE.Vector3;
}

export enum ThridPersonCameraFllowModule {
  OverTheShoulder = 1, // 相机始终在角色背后，体验接近第一人称，但是能看到角色背影
  Orbit = 2            // 自由旋转型
}

/**
 * Reference: https://www.youtube.com/watch?v=UuNPHOJ_V5o&t=483s
 * 
 */

export class ThridPersonCamera {
  
  target: THREE.Object3D;
  camera: THREE.Camera;
  currentPosition: THREE.Vector3;
  currentLookAt: THREE.Vector3;
  offset: THREE.Vector3;
  lookAt: THREE.Vector3;
  fllowModule: ThridPersonCameraFllowModule;
  
  constructor(
    target: THREE.Object3D,
    config: ThridPersonCameraConfig,
  ) {
    
    this.target = target;

    const {
      camera,
      // 默认设置为target后上位置，z值和模型朝向有关：模型基本上都是面向+z方向，因此后方位置要设置为负。
      offset = new THREE.Vector3(0,30,-50),
      lookAt = new THREE.Vector3(0,10,0),
    } = config;
    this.camera = camera;
    this.offset = offset;
    this.lookAt = lookAt;
    this.fllowModule = ThridPersonCameraFllowModule.Orbit;

    this.currentPosition = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3();
  }

  get idealOffset() {
    const offset = this.offset.clone();
    // 应用target的四元数旋转
    if(this.fllowModule === ThridPersonCameraFllowModule.OverTheShoulder) {
      offset.applyQuaternion(this.target.quaternion);
    }
    offset.add(this.target.position);
    return offset;
  }

  get idealLookAt() {
    const lookAt = this.lookAt.clone();
    if(this.fllowModule === ThridPersonCameraFllowModule.OverTheShoulder) {
      lookAt.applyQuaternion(this.target.quaternion); 
    }
    lookAt.add(this.target.position);
    return lookAt;
  }

  update(elapsedTime:number) {
    const t = 1 - Math.pow(0.001,elapsedTime);
    this.currentPosition.lerp(this.idealOffset,t);
    this.currentLookAt.lerp(this.idealLookAt,t);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }
}