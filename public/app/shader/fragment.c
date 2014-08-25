precision mediump float;

//varying vec4 vColor;
varying vec3 vLighting;

void main(void) {
	gl_FragColor = vec4(vLighting.y, vLighting.z, 0.2, 1.0); //vColor;
}