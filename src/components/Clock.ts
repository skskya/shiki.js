import * as THREE from 'three';

interface ClockEvent {
  tick: any;
  [key: string]: any;
}

export class Clock extends THREE.EventDispatcher<ClockEvent>  {
  deltaTime: number;
  elapsedTime: number;
  private clock: THREE.Clock;

  constructor() {
    super();

    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    this.elapsedTime = 0;
  }

  tick() {
    const newElapsedTime = this.clock.getElapsedTime();
    this.deltaTime = newElapsedTime - this.elapsedTime;
    this.elapsedTime = newElapsedTime;

    this.dispatchEvent({ type: 'tick' });
  }
}