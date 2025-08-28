import { Constructor, injectableClasses, injectionMeta } from "./metadata";

function inject(token: string) {
  return function (target: Constructor, _key: string | symbol | undefined, index: number) {
    // 直接用type就行 target.prototype.constructor === target
    // const ctor = target.prototype.constructor as Constructor;
    const ctor = target;

    if (!injectionMeta.has(ctor)) {
      injectionMeta.set(ctor, new Map());
    }
    injectionMeta.get(ctor)!.set(index, token);
  };
}

function injectable() {
  return function <T extends Constructor>(target: T) {
    console.log(target);
    injectableClasses.add(target); // 标记它为 injectable
  };
}

export {
  inject,
  injectable
}