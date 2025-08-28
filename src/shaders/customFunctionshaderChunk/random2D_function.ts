/**
 *  二维数据生成伪随机数[0,1)
 *  相同输入，相同输出
*/
export default /* glsl */ `
  float random2D(vec2 value) {
    return fract(sin(dot(value.xy,vec2(12.9898,78.233))) * 43758.5453123);
  }
`;