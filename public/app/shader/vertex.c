attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
//attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

//varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main(void) {
//	vColor = aVertexColor;
	vPosition = vec3(uMVMatrix * vec4(aVertexPosition, 1.0));
	vNormal = vec3(uMVMatrix * vec4(aVertexNormal, 0.0));
	vColor = vec4(1, 1, 1, 1);

	gl_Position = uPMatrix * vec4(vPosition, 1.0);
}