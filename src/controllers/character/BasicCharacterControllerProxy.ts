import {Animation} from "./BasicCharacterController";
import { StateEnum } from "./states/mapping";

export class BasicCharacterControllerProxy {
  animations: Partial<Record<StateEnum,Animation>>;
  
  constructor(animations: Partial<Record<StateEnum,Animation>>) {
    this.animations = animations;
  }
}