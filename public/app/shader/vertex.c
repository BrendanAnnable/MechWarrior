attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
//attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

//varying vec4 vColor;
varying vec3 vLighting;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
//	vColor = aVertexColor;
	vLighting = aVertexNormal;
}