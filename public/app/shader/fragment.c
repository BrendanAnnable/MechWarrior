precision mediump float;

//varying vec4 vColor;
varying vec3 vLighting;

void main(void) {
	gl_FragColor = vec4(vLighting, 1); //vColor;
}