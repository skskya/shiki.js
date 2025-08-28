import { Constructor, injectableClasses, injectionMeta } from "./metadata";

/**
 * 全局依赖注入容器
 */
export default class Context {
  private services = new Map<string, any>();

  // 注册全局依赖
  register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  // 获取依赖
  get<T>(key: string): T {
    const instance = this.services.get(key);
    if (!instance) {
      throw new Error(`服务[${key}]尚未注册`);
    }
    return instance;
  }

  resolve<T>(target: Constructor<T>): T {
    if (!injectableClasses.has(target)) {
      throw new Error(`类 ${target.name} 未注册为 @injectable`);
    }

    const meta = injectionMeta.get(target) || new Map();
    const args: any[] = [];

    for (let i = 0; i < target.length; i++) {
      const token = meta.get(i);
      if (!token) {
        throw new Error(`参数[${i}]缺少 @inject 标注`);
      }
      console.log(this);
      args[i] = this.get(token);
    }

    return new target(...args);
  }

  has(key: string): boolean {
    return this.services.has(key);
  }

  getKeys(): string[] {
    return Array.from(this.services.keys());
  }
}