import * as THREE from "Three";
import { EffectComposer } from "three-stdlib";
import { Clock } from "../../shiki.js/core/Clock";
import { AssetManager } from "../components/AssetManager";
import { VisualEffectManager } from "../components/VisualEffectManager";
import { MaterialStore } from "../components/MaterialStore";
import { GeometryStore } from "../components/GeometryStore";
import { InteractionManager } from "../components/InteractionManager";
import { Mouse } from "../components/Mouse";
import { KeyBoard } from "../components/Keyboard";

export default class Context {

  readonly container: HTMLElement;
  readonly camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  readonly scene: THREE.Scene;
  readonly renderer: THREE.WebGLRenderer;
  readonly clock: Clock;

  // 全局几何体管理器
  geometryStore: GeometryStore;
  // 全局材质管理器
  materialStore: MaterialStore;
  // 后处理特效合成器
  composer?: EffectComposer ;
  // 资源管理器
  assetManager?: AssetManager;
  // VFX特效管理器 - 需维护场景内动态实体
  visualEffectManager?: VisualEffectManager;
  // 交互管理器
  interactionManager?: InteractionManager;

  // Input
  mouse?: Mouse;
  keyboard?: KeyBoard;
  


  constructor(
    sel: string = "#sketch",
    glConfig:THREE.WebGLRendererParameters = {}
  ) {

    const container: HTMLElement =  document.querySelector(sel)!;
    if(!container) {
      throw Error(`dom has no element[${sel}]`);
    }
    this.container = container;

    const camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    this.camera = camera;

    const scene = new THREE.Scene();
    this.scene = scene;

    const renderer = new THREE.WebGLRenderer({...glConfig});
    renderer.setSize(container.clientWidth,container.clientHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer = renderer;

    this.container.appendChild(this.renderer.domElement);

    const clock = new Clock();
    this.clock = clock;
    
    const materialStore = new MaterialStore();
    this.materialStore = materialStore;

    const geometryStore = new GeometryStore();
    this.geometryStore = geometryStore;

    // const interactionManager = new InteractionManager(this.camera,this.renderer.domElement);
    // this.interactionManager = interactionManager;
  }
} 