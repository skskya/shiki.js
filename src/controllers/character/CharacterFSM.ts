import { AbsState } from "../../components/fsm/AbsState";
import { FiniteStateMachine } from "../../components/fsm/FiniteStateMachine";
import { StateEnum } from "./states/mapping";
import { WalkState } from "./states/WalkState";
import { BasicCharacterControllerProxy } from "./BasicCharacterControllerProxy";
import { IdleState } from "./states/IdleState";



export class CharacterFSM extends FiniteStateMachine<AbsState<CharacterFSM>> {
  // 多角色、可替换资源、复用 FSM → Proxy 很有用，提供统一接口、解耦 FSM 与资源。
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