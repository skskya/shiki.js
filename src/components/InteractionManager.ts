import * as THREE from 'three';
import { Module } from '../core/Engine';

export type PointerEvents = 'click' | 'pointermove' | 'mouseover' | 'mouseout';

// 定义事件类型
interface InteractionEvent {
  type: PointerEvents;
  object: THREE.Object3D; // 被触发的物体 === target
  intersection: THREE.Intersection;
  // mouse 存放屏幕空间转为NDC后的坐标
  mouse: THREE.Vector2;
  originalEvent: PointerEvent | MouseEvent,
  [key: string]:any
}

export class InteractionManager implements Module {
  private raycaster = new THREE.Raycaster();
  // 默认在屏幕外
  readonly mouse = new THREE.Vector2(9999, 9999);
  private objects = new Set<THREE.Object3D>();
  // 当前指针悬停所在的物体
  private declare currentHoverOjbect: THREE.Object3D | undefined;
  private declare intersection: THREE.Intersection | undefined;

  constructor(
    private camera: THREE.Camera,
    private renderDom: HTMLCanvasElement
  ) {
    this.bindRenderDomEvents();
  }

  // 添加物体到交互列表
  add(...objs: THREE.Object3D[]) {
    objs.forEach(obj => {
      this.objects.add(obj);
    });
  }

  // 从交互列表移除物体
  remove(...objs: THREE.Object3D[]) {
    objs.forEach(obj => {
      this.objects.delete(obj);
      if (this.currentHoverOjbect === obj) this.currentHoverOjbect = undefined;
    });
  }

  // 每帧更新
  update() {
    if (!this.objects.size) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersection = this.raycaster.intersectObjects([...this.objects], true);
    this.intersection = intersection[0];

    const firstIntersectedObject = intersection[0]?.object;

    // hover状态（mouseover / mouseout）
    if (firstIntersectedObject !== this.currentHoverOjbect) {
      if (this.currentHoverOjbect) this.dispatch(this.currentHoverOjbect,'mouseout',this.intersection, undefined);
      if (firstIntersectedObject) this.dispatch(firstIntersectedObject,'mouseover',this.intersection, undefined);
      this.currentHoverOjbect = firstIntersectedObject;
    }
  }

  // canvas事件绑定
  private bindRenderDomEvents() {
    this.renderDom.addEventListener('pointermove', this.onPointerMove);
    this.renderDom.addEventListener('click', this.onClick);
  }

  // pointmove事件
  private onPointerMove = (event: PointerEvent) => {
    this.setPointerFromRenderDom(event);
    if (this.currentHoverOjbect) this.dispatch(this.currentHoverOjbect,'pointermove',this.intersection!, event);
  };

  // click事件
  private onClick = (event: MouseEvent) => {
    if (this.currentHoverOjbect) this.dispatch(this.currentHoverOjbect,'click',this.intersection!, event);
  };

  // 设置 屏幕空间转为NDC坐标[-1,1]^2后，光标所在位置。
  private setPointerFromRenderDom(ev: PointerEvent) {
    
    const rect = this.renderDom.getBoundingClientRect();
    this.mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

  }

  // 事件派发
  private dispatch(
    target: THREE.Object3D,
    type: PointerEvents,
    intersection: THREE.Intersection,
    originalEvent: Event | undefined
  ) {
    (target as THREE.EventDispatcher<InteractionEvent>).dispatchEvent({
      type,
      target,
      intersection,
      originalEvent
    });
  }
}
