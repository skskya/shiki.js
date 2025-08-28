import * as THREE from "Three";
import { CharacterFSM } from "./CharacterFSM";
import { StateEnum,clipMap } from "./states/mapping";
import { BasicCharacterControllerProxy } from "./BasicCharacterControllerProxy";
import { BasicCharacterControllerInput } from "./BasicCharacterControllerInput";
import { KeyBoard } from "@/shiki/components/Keyboard";

export interface Animation {
  mixer: THREE.AnimationMixer;
  clip: THREE.AnimationClip;
  action: THREE.AnimationAction;
}

/**
 * [EXP]
 * Reference: https://www.youtube.com/watch?v=EkPfhzIbp2g
 * 原教程源码角色控制更适配 第三人称背后锁定相机，ad只负责旋转角度，不满足我的需求。
 * 修改后，需要配置称第三人称自由旋转型相机，配合ThridPersonCamera orbit，操作习惯才比较符合平时游戏的感觉。
 * 可以添加个属性，明确屏幕空间z的指向，根据这个属性调整旋转角度和方向quaternion.setFromAxisAngle(axis, xxx);
 * 就可以同时适配：
 *  1.第三人称相机（屏幕空间z朝里,因为一般模型导入时都是面向屏幕的，第三人称相机位置会调整到角色背后，并看相角色，所以最后得到的屏幕空间z会朝里）
 *  2.平时用的普通相机（屏幕空间z朝外）
 * 以后再优化吧🫠。
 */
export class BasicCharacterController {
  model:THREE.Object3D ;
  clips:THREE.AnimationClip[];
  mixer: THREE.AnimationMixer;
  keyboard: KeyBoard;
  animations: Partial<Record<StateEnum,Animation>>;
  velocity: THREE.Vector3;
  decceleration: THREE.Vector3;
  acceleration: THREE.Vector3;
  stateMachine: CharacterFSM;
  input: BasicCharacterControllerInput;
  
  constructor(
    model: THREE.Object3D,
    clips: THREE.AnimationClip[],
    keyboard: KeyBoard,
    config: {
      speed: number,
    } = {speed : 10}
  ) {
    
    this.model = model;
    this.clips = clips;
    this.mixer =  new THREE.AnimationMixer(this.model);
    this.keyboard = keyboard;
    this.animations = {};
    this.velocity = new THREE.Vector3(0); 
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(1, 0.25, config.speed * 5);

    this.setAnimations();
    
    this.stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this.animations)
    );
    this.stateMachine.transitionState(StateEnum.Idle);
    this.input = new BasicCharacterControllerInput(this.keyboard);

  }

  setAnimations() {
    this.clips.forEach((clip)=>{
      const animation =  {
        mixer: this.mixer,
        clip,
        action: this.mixer.clipAction(clip)
      }      
      const stateEnum = clipMap.get(clip.name); 
      if(stateEnum !== undefined) {
        this.animations[stateEnum] = animation;
      }
    })
  } 

  update(deltaTime:number) {
    this.stateMachine.update(deltaTime,this.input);

    const {velocity,decceleration,acceleration} = this;

    
    /**
     * 总体逻辑：
     * 每帧先对速度做阻尼/减速（不会反向超过当前速度），
     * 根据输入增加前后速度（加速），根据左右输入改变朝向（用四元数旋转），
     * 然后用速度乘以 dt 在朝向方向上累加位置，实现带惯性和平滑转向的角色移动。
     */
    // 每帧减速（阻尼）
    const frameDecceleration = new THREE.Vector3(
        velocity.x * decceleration.x,
        velocity.y * decceleration.y,
        velocity.z * decceleration.z
    );
    // 把减速按帧时间缩放（deltaTime）以适应不同帧率。
    frameDecceleration.multiplyScalar(deltaTime);
    // 对 z 分量做“夹紧”处理：防止减速度过大把 velocity.z 翻向（即防止反向超越）。
    // 实现：取减速量绝对值与当前速度绝对值的最小值，再带上原来减速方向的符号。
    frameDecceleration.z = 
      Math.sign(frameDecceleration.z) * 
      Math.min(
        Math.abs(frameDecceleration.z), 
        Math.abs(velocity.z)
      );
    // 把减速应用到速度上
    velocity.add(frameDecceleration);  
    
    // 临时变量，用来创建旋转四元数  
    const quaternion = new THREE.Quaternion();
    // 临时变量，用来创建旋转轴  
    const axis = new THREE.Vector3();
    // 是当前模型四元数的拷贝（将用于计算新旋转）
    const rotation = this.model.quaternion.clone();
    
    // 加速度
    const acc = acceleration.clone();
    if(this.input.foward ) {
      // 适合插值 方向 或 旋转，因为它会保证插值路径在球面上，并且做最短路径插值，角速度一致
      rotation.slerp(quaternion, 10 * deltaTime);
    }
  
    if(this.input.backward) {
      axis.set(0,1,0);
      // 设置旋转度数
      quaternion.setFromAxisAngle(axis, Math.PI);
      // speed * deltaTime 固定旋转速度：使其在不同帧率下也能保证相同旋转速度。
      rotation.slerp(quaternion, 10 * deltaTime);
    }

    // 左右键通过在 Y 轴上生成一个小角度的四元数（按时间与加速度的 y 组件缩放），
    // 并把它乘到 rotation（当前旋转）上，从而实现角色的旋转/转向。
    // 角度 = 4π * dt * acceleration.y  （方向取决于 left/right）
    if(this.input.left) {
      // 只进行旋转操作
      // axis.set(0,1,0);
      // quaternion.setFromAxisAngle(axis,4 * Math.PI * deltaTime * acc.y);
      // rotation.multiply(quaternion);
      axis.set(0,1,0);
      quaternion.setFromAxisAngle(axis, Math.PI*0.5);
      rotation.slerp(quaternion,10 * deltaTime);
    }
    if(this.input.right) {
      // axis.set(0, 1, 0);
      // quaternion.setFromAxisAngle(axis, 4 * -Math.PI * deltaTime * acc.y);
      // rotation.multiply(quaternion);
      axis.set(0,1,0);
      quaternion.setFromAxisAngle(axis, -Math.PI*0.5);
      rotation.slerp(quaternion,10 * deltaTime);
      // velocity.z += acc.z * deltaTime;
    }
    if(this.input.backward || this.input.foward || this.input.left || this.input.right) {
      velocity.z += acc.z * deltaTime;
    }


    // 把计算后的旋转写回角色的 quaternion（应用转向）
    this.model.quaternion.copy(rotation);

    // 记录模型当前位置
    const position = new THREE.Vector3();
    position.copy(this.model.position);

    // 计算物体朝前方向（用当前四元数将局部 (0,0,1) 转到世界空间）并归一化
    const forward = new THREE.Vector3(0,0,1);
    forward.applyQuaternion(rotation);
    forward.normalize();

    // 同理计算横向方向并归一化
    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(rotation);
    sideways.normalize();
    // 每帧的位移
    forward.multiplyScalar(velocity.z * deltaTime);
    // sideways.multiplyScalar(velocity.z * deltaTime);
    // 更新新位置
    position.add(forward);
    // position.add(sideways);

    // 应用到物体
    this.model.position.copy(position);

    if(this.mixer) {
      this.mixer.update(deltaTime);
    }

  }

  handleRotation() {

  }
}