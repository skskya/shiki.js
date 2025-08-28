import { BasicCharacterControllerInput } from "../../controllers/character/BasicCharacterControllerInput";
import { AbsState } from "./AbsState";

type StateEnum = number;

export class FiniteStateMachine<T extends AbsState<any>>{
  private states: Record<StateEnum,T>;
  private currentState: T | null;
  
  constructor() {
    this.states = {};
    this.currentState = null;
  }

  // 添加状态
  addState(stateEnum: StateEnum, state: T) {
    this.states[stateEnum] = state;
    return this;
  }

  // 切换状态
  transitionState(nextStateEnum: StateEnum) {
    const currentState = this.currentState;
    if( nextStateEnum === currentState?.state ) {
      return; 
    }

    currentState?.exit();
    const nextState = this.states[nextStateEnum];
    this.currentState = nextState;
    nextState?.enter(currentState?.state);
  }

  // 每帧执行
  update(elapsedTime: number, input:BasicCharacterControllerInput) {
    if(this.currentState) {
      this.currentState.update(elapsedTime,input);
    }
  }
}

