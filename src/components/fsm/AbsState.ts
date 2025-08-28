 import { BasicCharacterControllerInput } from "@/shiki/controllers/character/BasicCharacterControllerInput";
import { FiniteStateMachine } from "./FiniteStateMachine";


 /**
  * 状态基类
  */
// AbsState 和 FiniteStateMachine双向引用，方便在状态内部切换状态
export abstract class AbsState<TFSM extends FiniteStateMachine<any>>  {

  fsm: TFSM;

  constructor(fsm: TFSM) {
    this.fsm = fsm;
  }

  // 状态枚举值
  abstract get state(): number;
  // 进入该状态
  abstract enter(preState: number|undefined): void;
  // 执行状态
  abstract update(deltaTime: number,input: BasicCharacterControllerInput): void;
  // 离开该状态
  abstract exit(): void;
  
}
