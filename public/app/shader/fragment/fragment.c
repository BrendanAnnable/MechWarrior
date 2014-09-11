precision mediump float;

// The position of the point light, passed in by JavaScript
uniform vec4 uLightPos;
// The color of the point light, passed in by JavaScript
uniform vec3 uLightColor;
uniform vec4 uDiffuseColor;
uniform bool useTexture;
uniform bool useLighting;
uniform bool useEnvironmentMap;

// The linearly interpolated values from the vertex shader
varying vec3 vRawPosition;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

// textures
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform samplerCube uEnvironmentMap;

void main(void) {
	// normalize the normal as the interpolated value may not be of unit length
	vec3 normal = normalize(vNormal);

	/*if (!gl_FrontFacing) {
		// flip the normal if we're lighting the back of the surface
		// Note: This will likely be disabled once we get non-hollow objects
		normal = -normal;
	}*/

	// Ambient lighting colour and intensity
	vec3 ambientLighting = vec3(0.5, 0.0, 0.0);

	// Directional light color and direction
	vec3 directionalLightColor = vec3(0.5, 0.4, 0.0);
	vec3 directionLightVector = vec3(3.14 / 2.0, 3.14 / 2.0, 0);
//	vec3 directionLightVector = vec3(0, 0, 0);


	// Point light

	// Calculate the intensity of the point light per-pixel
	vec3 pointLightDirection = normalize(uLightPos.xyz - vPosition.xyz);
	// Based on the angle of the normal of the point and the direction of the light source
	float diffuseLightWeight = max(dot(normal, pointLightDirection), 0.0);

	// TODO: use the distance to attenuate the light
	//float distance = distance(uLightPos.xyz, vPosition);


	// Determine directional light weighting based on the angle between the light rays and the normal
	float directionalLightWeight = max(dot(normal, normalize(directionLightVector)), 0.0);

    // Colour the pixel based on the original colour and the various lighting factors
    if (useEnvironmentMap) {
        gl_FragColor = textureCube(uEnvironmentMap, vRawPosition);
    } else if (useTexture) {
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    } else {
    	gl_FragColor = vColor;
    }

    if (useLighting) {
        gl_FragColor = gl_FragColor * vec4(
            ambientLighting
            + uLightColor * diffuseLightWeight
            + directionalLightColor * directionalLightWeight
        , 1);
    }

//	gl_FragColor = vec4(vNormal, 1);
}