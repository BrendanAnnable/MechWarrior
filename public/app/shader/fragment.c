precision mediump float;

uniform vec3 uLightPos;
uniform vec3 uLightColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main(void) {
	vec3 normal = normalize(vNormal);

	if (!gl_FrontFacing) {
		// flip the normal if we're lighting the back of the surface
		normal = -normal;
	}

	vec3 ambientLighting = vec3(0.1, 0.0, 0.0);

	// directional light
	vec3 directionalLightColor = vec3(0.8, 0.2, 0.2);
//	vec3 directionLightVector = vec3(1, 0, 0.5);
	vec3 directionLightVector = vec3(0, 0, 0);

	// point light
	vec3 pointLightDirection = normalize(uLightPos - vPosition);
	float diffuseLightWeight = max(dot(normal, pointLightDirection), 0.0);

	float distance = distance(uLightPos, vPosition);


	float directionalLightWeight = max(dot(normal, normalize(directionLightVector)), 0.0);

	//gl_FragColor = vColor * vec4(ambientLighting + directionalLightColor * directionalLightWeight, 1);
	gl_FragColor = vColor * vec4(ambientLighting + uLightColor * diffuseLightWeight + directionalLightColor * directionalLightWeight, 1);
}