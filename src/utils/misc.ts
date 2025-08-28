import * as THREE from 'three';
// 开启阴影
const enableShadow = (renderer: THREE.WebGLRenderer) => {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

// 开启sRGB颜色空间
const enableSRGBSpaceColor = (renderer: THREE.WebGLRenderer) => {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
};

// 开启真实渲染
const enableRealisticRender = (
  renderer: THREE.WebGLRenderer,
  {toneMapping,toneMappingExposure}:{toneMapping?: THREE.ToneMapping,toneMappingExposure?: number} = {}
) => {
  enableSRGBSpaceColor(renderer);
  renderer.toneMapping = toneMapping || THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = toneMappingExposure || 3;
  enableShadow(renderer);
};

export { enableShadow, enableSRGBSpaceColor, enableRealisticRender };
