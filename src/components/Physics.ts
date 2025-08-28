import * as CANNON from 'cannon-es';

interface ContactProperties {
  friction?: number;
  restitution?: number;
  contactEquationStiffness?: number;
  contactEquationRelaxation?: number;
  frictionEquationStiffness?: number;
  frictionEquationRelaxation?: number;
}

export interface PhysicsBind {
  physicBody: CANNON.Body;
}

// 这里只是起了名的材质的空壳，并没有plastic的属性，可以随意命名，类似label的作用。
export class PhysicsMaterials {
  static default = new CANNON.Material('default');
  // static concrete = new CANNON.Material('concrete');
  // static rubber = new CANNON.Material('rubber');
  // static metal = new CANNON.Material('metal');
  // 可以扩展更多类型
}

export class Physic {
  world: CANNON.World;

  constructor(defaultContactProperties?: ContactProperties) {
    this.world = new CANNON.World();

    this.init(defaultContactProperties);
  }
  private init(defaultContactProperties?: ContactProperties) {
    // 设置broadphase 优化碰撞检测
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    // (this.world.broadphase as CANNON.SAPBroadphase).axisIndex = 1; // 切换排序轴（0=X, 1=Y, 2=Z）默认为0
    // 设置重力
    this.world.gravity.set(0, -9.8, 0);
    // 优化性能，通过减少对静止物体的不必要的物理计算。
    this.world.allowSleep = true;

    // 设置默认材质的接触特性
    if (defaultContactProperties) {      
      const contactMaterial = new CANNON.ContactMaterial(
        PhysicsMaterials.default, 
        PhysicsMaterials.default,
        defaultContactProperties
      );
      this.world.defaultContactMaterial = contactMaterial;
    }

    // this.world.addContactMaterial(contactMaterial);
  }
}
