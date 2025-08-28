
/**
 * （该模块已舍弃）
 */
export interface System {

  priority?: number;

  onFrame(deltaTime: number, elapsedTime: number): void;
}

/**
 * 系统调度器
 */
export class SystemManager {
  private systems: System[] = [];

  register(...args: System[]) {
    this.systems.push(...args);
  }
  // [OPTIMIZE]
  // 待优化1： 按照优先度先排序再更新
  // 待优化2: 系统不多的情况下，可以数组排序即优化点1做法；如果系统多，考虑优先队列（最小堆）
  update(deltaTime: number, elapsedTime: number) {
    this.systems.forEach(sys => {
      sys.onFrame(deltaTime, elapsedTime);
    });
  }
}