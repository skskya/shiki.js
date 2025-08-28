import { AbsState } from "@/shiki/components/fsm/AbsState";
import { CharacterFSM } from "../CharacterFSM";
import { BasicCharacterControllerInput } from "../BasicCharacterControllerInput";
import { StateEnum } from "./mapping";

export class IdleState extends AbsState<CharacterFSM>  {

  constructor(fsm: CharacterFSM) {
    super(fsm);
  }

  get state() {
    return StateEnum.Idle;
  }
  enter(preState: StateEnum) {
    const idleAction = this.fsm.proxy.animations[this.state]!.action;
    if(preState in StateEnum) {
      const preAction = this.fsm.proxy.animations[preState]!.action;

      idleAction.reset();
      idleAction.crossFadeFrom(preAction,0.5,false);
    }
    idleAction.play();
  }
  update(deltaTime: number, input: BasicCharacterControllerInput) {
    const {foward,backward,left,right} = input;
    if(foward || backward || left || right) {
      this.fsm.transitionState(StateEnum.Walk);
    }
  }

  exit(){}
  
}