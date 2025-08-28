
type KeyCode = string;



export class KeyBoard {
  keyStates: Record<KeyCode,boolean>;

  constructor() {

    this.keyStates = {};

    this.listen();
  }
  listen() {
    window.addEventListener('keydown',this.handleKeyDown);
    window.addEventListener('keyup',this.handleKeyUp);
  }


  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyStates[event.code] = true;
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyStates[event.code] = false;
    
  }

  // 查询按键是否正在按住
  isKeyDown(keyCode: KeyCode) {
    return this.keyStates[keyCode];
  }

   dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);  
    this.keyStates = {};
  }

}