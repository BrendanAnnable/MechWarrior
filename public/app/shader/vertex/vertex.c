/**
 * @author Brendan Annable
 */
// Per-vertex variables that are passed in by JavaScript
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
//attribute vec4 aVertexColor;

// Constants that are passed in by JavaScript
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;
uniform bool useTexture;

// Varying variables which are linearly interpolated and given to the fragment shader
//varying vec4 vColor;
varying vec3 vRawPosition;
varying vec3 vRawNormal;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) {
 //	vColor = aVertexColor;

 	// Convert position to camera-space
 	vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
 	vRawPosition = aVertexPosition;

 	// Convert normal to camera-space
 	vNormal = uNMatrix * aVertexNormal;
 	vRawNormal = aVertexNormal;

 	// Default color to white
 	vColor = vec4(1, 1, 1, 1);

 	// Convert position to clip-space
 	gl_Position = uPMatrix * vPosition;
    if (useTexture) {
        vTextureCoord = aTextureCoord;
    }
 }