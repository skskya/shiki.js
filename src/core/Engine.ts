import { Mouse } from '../components/Mouse';
import { Stats } from '../components/Stats';
import Context from './Context';

// [OPTIMIZE]
// 待优化1: 新增priority属性 按照优先度先排序再更新
// 待优化2: 系统不多的情况下，可以数组排序即优化点1做法；如果系统多，考虑优先队列（最小堆）
export interface Module {
  // priority?: number;
  update: (deltaTime: number, elapsedTime: number) => void;
}

type EngineConfig = {
  openStats?: boolean,
  enableMouse?: boolean,
}

export class Engine {
  context: Context;
  private engineConfig: EngineConfig | undefined;
  private stats: Stats | undefined;
  private modules: Set<Module>;
  private isRunning: boolean;

  constructor(
    context: Context,
    engineConfig?: EngineConfig
  ) {
    this.context = context;
    this.engineConfig = engineConfig;
    this.modules = new Set<Module>();
    this.isRunning = false;

    this.init();
  }
  private init() {
    // 开启fps监控
    if(this.engineConfig?.openStats) {
      // const { Stats } = await import('../components/Stats');
      // const stats = new Stats(this.context.container);
      // this.stats = stats;
      // this.addModule(stats);

      this.stats =  new Stats(this.context.container);
      this.addModule(this.stats);
    }

    if(this.engineConfig?.enableMouse) {
      // const { Mouse } = await import('../components/Mouse');
      // const mouseController = new Mouse(this.context.renderer.domElement);
      // mouseController.listen();
      // this.context.mouse = mouseController;

      const mouseController = new Mouse(this.context.renderer.domElement);
      mouseController.listen();
      this.context.mouse = mouseController;
    }
  }
  start() {
    this.isRunning = true;
    this.loop();
  }
  stop() {
    this.isRunning = false;
    this.loop();
  }

  addModule(...modules: Module[]) {
    modules.forEach(item => {
      // item.priority = item.priority ?? 0;
      this.modules.add(item); 
    });
  }

  private loop() {
    this.context.renderer.setAnimationLoop(this.isRunning ? () => this.tick() : null);
  }

  private tick() {
    if (!this.isRunning) return;
    this.context.clock.tick();
    // 更新所有模块
    this.modules.forEach(module => {
      module.update(this.context.clock.deltaTime, this.context.clock.elapsedTime)
    });
    // 渲染
    if (this.context.composer) {
      this.context.composer.render();
    } else {
      this.render();
    }
  }

  private render() {
    this.context.renderer.render(this.context.scene, this.context.camera);
  }

  // private disposalCallbacks: (() => void)[] = [];

  // registerDisposer(callback: () => void) {
  //   this.disposalCallbacks.push(callback);
  // }

  // dispose() {
  //   this.disposalCallbacks.forEach(fn => fn());
  //   this.context.renderer.dispose();
  //   // 其他全局资源清理...
  // }
}
