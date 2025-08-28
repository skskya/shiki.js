import StatsJs from 'stats.js';
import { Module } from '../core/Engine';
export class Stats implements Module {
  stats: StatsJs;
  constructor(container: HTMLElement) {
    this.stats = new StatsJs();
    container.appendChild(this.stats.dom);
  }
  update() {
    this.stats.update();
  };
}