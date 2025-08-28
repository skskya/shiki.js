/**
 * 	 值域线性映射函数（linearRemap）
 * 	 @params {value} - 属性value	
 * 	 @params {originMin，originMax} - 属性value的原始区间[originMin,originMax]
 * 	 @params {destinationMin，destinationMax} - 属性value经过线性转换映射到新范围	
 */

export default /* glsl */ `
	float linearRemap(
		float value, 
		float originMin, 
		float originMax, 
		float destinationMin, 
		float destinationMax
	)
		{
			return destinationMin + (value - originMin) / (originMax - originMin) * (destinationMax - destinationMin) ;
		}
	`;
