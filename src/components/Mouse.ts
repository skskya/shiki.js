import * as THREE from 'three';

export class Mouse {
  // mouse在视口的坐标 [原点在左上角]
   mouseClient: THREE.Vector2;
  // mouse在画布所在区域的ndc坐标 [-1,1]^2 [原点在中心]
   mouseScreenNDC: THREE.Vector2;

  constructor(private renderDom: HTMLCanvasElement) {
    this.mouseClient = new THREE.Vector2(9999, 9999);
    this.mouseScreenNDC = new THREE.Vector2(9999, 9999);
  }

  private getMouseClient(x: number, y: number) {
    return new THREE.Vector2(x,y);
  }

  private getMouseScreenNDC(x: number, y: number) {
    const mouse = new THREE.Vector2();
    const rect = this.renderDom.getBoundingClientRect();
    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
    return mouse;
  }

  private transform = (e: MouseEvent) => {
    this.mouseClient = this.getMouseClient(e.clientX,e.clientY);
    this.mouseScreenNDC = this.getMouseScreenNDC(e.clientX,e.clientY);
  };

  listen() {
    this.renderDom.addEventListener('mousemove', this.transform);
  }

  dispose() {
    this.renderDom.removeEventListener('mousemove', this.transform);
  }
}
