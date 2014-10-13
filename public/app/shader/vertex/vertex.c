/**
 * @author Brendan Annable
 */
precision mediump float;

// Per-vertex variables that are passed in by JavaScript
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
//attribute vec4 aVertexColor;

// Constants that are passed in by JavaScript
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform mat4 uWorldTransform;
uniform vec4 uDiffuseColor;
uniform bool useTexture;

// Varying variables which are linearly interpolated and given to the fragment shader
//varying vec4 vColor;
varying vec4 vModelPosition;
varying vec4 vWorldPosition;
varying vec4 vModelNormal;
varying vec4 vWorldNormal;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec4 vLightDirection;

void main(void) {
 //	vColor = aVertexColor;

 	// model space
 	vModelPosition = vec4(aVertexPosition, 1.0);
 	// camera space
 	vPosition = uMVMatrix * vModelPosition;
 	// world space
 	vWorldPosition = uWorldTransform * vPosition;

 	// model space
 	vModelNormal = vec4(aVertexNormal, 0);
 	// camera space
 	vNormal = uNMatrix * vModelNormal.xyz;
 	// world space
 	vWorldNormal = uWorldTransform * vec4(vNormal, 0);

    vLightDirection = uWorldTransform * vec4(1.0, 1.0, 0.0, 0.0);

 	// Default color to white
 	vColor = uDiffuseColor;

 	// Convert position to clip-space
 	gl_Position = uPMatrix * vPosition;
    if (useTexture) {
        vTextureCoord = aTextureCoord;
    }
 }