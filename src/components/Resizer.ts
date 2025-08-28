import * as THREE from "Three";
import { EffectComposer } from 'three-stdlib';

export class Resizer {
  // base: Base;

  // constructor(base: Base) {
  //   this.base = base;
  //   this.resize = this.resize.bind(this);

  //   this.resize();
  // }
  constructor(
    private elementContainer: HTMLElement,
    private camera: THREE.Camera,
    private renderer: THREE.WebGLRenderer,
    private composer?: EffectComposer
  ) {
    // this.base = base;
    // this.resize = this.resize.bind(this);

    this.resize();
  }

  get aspect() {
    const { clientWidth, clientHeight } = this.elementContainer;
    return clientWidth / clientHeight;
  }

  listen() {
    window.addEventListener('resize', this.resize);
  }

  private resize = () => {
    this.resizeCamera(this.camera);
    this.resizeRenderer(this.renderer);
    
    if(this.composer) {
      this.resizeComposer(this.composer);
    }
  }

  resizeRenderer(renderer: THREE.WebGLRenderer) {
    const { clientWidth, clientHeight } = this.elementContainer;
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }

  resizeComposer(composer: EffectComposer) {
      const { clientWidth, clientHeight } = this.elementContainer;
      composer.setSize(clientWidth, clientHeight);

      if (composer.setPixelRatio) {
        composer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      }
    
  }

  resizeCamera(camera: THREE.Camera) {
    if (camera instanceof THREE.PerspectiveCamera) {
      (camera as THREE.PerspectiveCamera).aspect = this.aspect;
      camera.updateProjectionMatrix();
    }
  }

  dispose() {
    window.removeEventListener('resize', this.resize);
  }
}