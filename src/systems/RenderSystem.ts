import { System } from "../core/SystemManager";
import * as THREE from 'three';
import { Resizer } from "../utils/Resizer";
import { EffectComposer } from "three-stdlib";

export class RenderSystem implements System {
  priority: number = Infinity;
  elementContainer: HTMLElement;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  resizer: Resizer;
  // [OPTIMIZE] 后处理做成插拔内容,根据开发需求是否要用到
  composer?: EffectComposer | undefined;

  constructor(sel: string = '#sketch', gl: THREE.WebGLRendererParameters = {}) {
    const container = document.querySelector(sel) as HTMLElement;
    if (!container) {
      throw Error(`dom has no element[${sel}]!`);
    }
    this.elementContainer = container;

    const camera = new THREE.PerspectiveCamera(
      45,
      this.elementContainer.clientWidth / this.elementContainer.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    this.camera = camera;

    const scene = new THREE.Scene();
    this.scene = scene;

    const renderer = new THREE.WebGLRenderer({ ...gl });
    renderer.setSize(this.elementContainer.clientWidth, this.elementContainer.clientHeight);
    this.renderer = renderer;

    this.elementContainer.appendChild(this.renderer.domElement);

    const resizer = new Resizer(this.elementContainer, this.camera, this.renderer,this.composer);
    resizer.listen();
    this.resizer = resizer;
  }

  onFrame() {
    if(this.composer) {
      this.composer.render();
    }else{
      this.renderer.render(this.scene,this.camera);
    }
  }
}