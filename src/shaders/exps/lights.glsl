// 环境光
vec3 ambientLight( vec3 lightColor, float intensity ) {
  return  lightColor * intensity;
}

// 方向光
vec3 dirctionalLight(
  vec3 lightColor,    
  float intensity, 
  vec3 lightDir,        
  vec3 normal,         
  vec3 viewDirection,
  float power  
  ) {
    float diff = max(0., dot(lightDir,normal));
    
    // 计算镜面反射可以使用半程向量，不需要计算光线反射方向（Blinn-Phong 模型） 。这里使用glsl提供的reflect，（Phong模型）。
    vec3 reflectDir = reflect(-lightDir,normal);
    float spec = max(0., dot(reflectDir,viewDirection));
    spec = pow(spec,power);

    vec3 diffuse = lightColor * intensity * diff;
    vec3 spcular = lightColor * intensity * spec;

    return diffuse + spcular;
}

// 点光源
vec3 pointLight(
  vec3 lightColor, 
  float intensity, 
  vec3 lightPosition,
  vec3 normal,
  vec3 viewDirection,
  vec3 position,
  float power,
  float lightDecay
  ) {
    vec3 delta = lightPosition - position;
    vec3 lightDir = normalize(delta);
    float lightDistance = length(delta); 

    float diff = max(0., dot(lightDir,normal));
    
    // 计算镜面反射可以使用半程向量，不需要计算光线反射方向（Blinn-Phong 模型） 。这里使用glsl提供的reflect，（Phong模型）。
    vec3 reflectDir = reflect(-lightDir,normal);
    float spec = max(0., dot(reflectDir,viewDirection));
    spec = pow(spec,power);

    vec3 diffuse = lightColor * intensity * diff;
    vec3 spcular = lightColor * intensity * spec;

    // 衰减项
    float decay = 1. - lightDistance * lightDecay;
    decay = max(0., decay);

    return (diffuse + spcular) * decay;
}
