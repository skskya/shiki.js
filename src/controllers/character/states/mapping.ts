 enum StateEnum {
  Idle = 0,
  Walk = 1,
  // Run = 2,
}

const clipMap = new Map<string,StateEnum>();
clipMap.set('Armature.001|mixamo.com|Layer0',StateEnum.Idle);
clipMap.set('Armature|mixamo.com|Layer0',StateEnum.Walk);

export {
  StateEnum,
  clipMap
}