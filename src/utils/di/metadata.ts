type Constructor<T = any> = new (...args: any[]) => T;

// [OPTIMIZE] 多个上下文环境会共享，出问题，碰到了再改吧
const injectionMeta = new Map<Constructor, Map<number, string>>();
const injectableClasses = new Set<Constructor>();

export {
  Constructor,
  injectionMeta,
  injectableClasses
}