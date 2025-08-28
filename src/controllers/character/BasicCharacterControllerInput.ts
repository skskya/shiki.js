import { KeyBoard } from "../../components/Keyboard";

export class BasicCharacterControllerInput {
  
  // keys: {[key:string]:any};
  private keyboard: KeyBoard;
  
  constructor(keyboard: KeyBoard) {
    this.keyboard = keyboard;
  }

  get foward() {
    return this.keyboard.isKeyDown('KeyW') 
        || this.keyboard.isKeyDown('ArrowUp'); 
  }

  get backward() {
    return this.keyboard.isKeyDown('KeyS') 
        || this.keyboard.isKeyDown('ArrowDown'); 
  }

  get left() { 
    return this.keyboard.isKeyDown('KeyA') 
        || this.keyboard.isKeyDown('ArrowLeft'); 

  }

  get right() {
    return this.keyboard.isKeyDown('KeyD') 
        || this.keyboard.isKeyDown('ArrowRight'); 
  }
}