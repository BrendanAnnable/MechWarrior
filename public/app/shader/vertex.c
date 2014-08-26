attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
//attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

//varying vec4 vColor;
varying vec3 vLighting;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
//	vColor = aVertexColor;

	vec3 ambientLighting = vec3(0.3, 0.0, 0.0);
	vec3 dirLightColor = vec3(0.8, 0.2, 0.2);
	//vec3 dirVect = vec3(0.85, 0.8, 0.75);
	vec3 dirVect = vec3(-1, 0, 0);

	vec3 tVertexNormal = uNMatrix * aVertexNormal;
	float dirLightWeight = max(dot(tVertexNormal, dirVect), 0.0);

	vLighting = ambientLighting + dirLightColor * dirLightWeight;
}