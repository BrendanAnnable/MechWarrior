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
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying highp vec2 vTextureCoord;

void main(void) {
 //	vColor = aVertexColor;

 	// Convert position to eye-space
 	vPosition = vec3(uMVMatrix * vec4(aVertexPosition, 1.0));

 	// Convert normal to eye-space
 	vNormal = vec3(uMVMatrix * vec4(aVertexNormal, 0.0));

 	// Default color to white
 	vColor = vec4(1, 1, 1, 1);

 	// Convert position to clip-space
 	gl_Position = uPMatrix * vec4(vPosition, 1.0);
    if (useTexture) {
        vTextureCoord = aTextureCoord;
    }
 }