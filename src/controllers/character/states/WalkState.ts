import { AbsState } from "../../../components/fsm/AbsState";
import { StateEnum } from "./mapping";
import { BasicCharacterControllerInput } from "../BasicCharacterControllerInput";
import { CharacterFSM } from "../CharacterFSM";


export class WalkState extends AbsState<CharacterFSM>  {

  
  
  constructor(fsm: CharacterFSM) {
    super(fsm);
  }

  get state() {
    return StateEnum.Walk;
  }

  enter(preState: StateEnum) {
    const walkAction = this.fsm.proxy.animations[this.state]!.action;
    if(preState in StateEnum) {
      const preAction = this.fsm.proxy.animations[preState]!.action;
      walkAction.reset();
      walkAction.crossFadeFrom(preAction,0.5,false);
    }
    walkAction.play();
  }
  update(deltaTime: number,input: BasicCharacterControllerInput) {
    const {foward,backward,left,right} = input;
    if(foward || backward || left || right) {
      return;
    }
    this.fsm.transitionState(StateEnum.Idle);
  } 
  exit() {}
  
}