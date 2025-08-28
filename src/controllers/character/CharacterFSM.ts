import { AbsState } from "@/shiki/components/fsm/AbsState";
import { FiniteStateMachine } from "@/shiki/components/fsm/FiniteStateMachine";
import { StateEnum } from "./states/mapping";
import { WalkState } from "./states/WalkState";
import { BasicCharacterControllerProxy } from "./BasicCharacterControllerProxy";
import { IdleState } from "./states/IdleState";



export class CharacterFSM extends FiniteStateMachine<AbsState<CharacterFSM>> {
  
  proxy: BasicCharacterControllerProxy;
  
  constructor(proxy: BasicCharacterControllerProxy ) {
    super();
    this.proxy = proxy;
    this.init();

  }

  init() {
    this.addState(StateEnum.Idle,new IdleState(this));
    this.addState(StateEnum.Walk,new WalkState(this));
  }


}