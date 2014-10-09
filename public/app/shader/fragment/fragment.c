/**
 * @author Brendan Annable
 */
#define MAX_DIR_LIGHTS 4

precision mediump float;

uniform vec3 uAmbientLightColor;

uniform int uNumDirectionalLights;
uniform vec3 uDirectionalLightsColor[MAX_DIR_LIGHTS];
uniform vec3 uDirectionalLightsDirection[MAX_DIR_LIGHTS];

// The position of the point light, passed in by JavaScript
uniform vec4 uLightPos;
// The color of the point light, passed in by JavaScript
uniform vec3 uLightColor;
uniform vec4 uDiffuseColor;
uniform bool useTexture;
uniform bool useLighting;
uniform bool useEnvironmentMap;
uniform float reflectivity;
uniform mat4 uWorldTransform;
uniform vec4 uWorldEyeVec;

// The linearly interpolated values from the vertex shader
varying vec4 vModelPosition;
varying vec4 vWorldPosition;
varying vec4 vModelNormal;
varying vec4 vWorldNormal;
varying vec4 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vLightDirection;

// textures
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform samplerCube uEnvironmentMap;

void main(void) {
	// normalize the normal as the interpolated value may not be of unit length
	vec3 normal = normalize(vNormal);

    // Colour the pixel based on the original colour and the various lighting factors
    if (useEnvironmentMap) {
        gl_FragColor = textureCube(uEnvironmentMap, normalize(vModelPosition.xyz));
    } else if (useTexture) {
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    } else {
    	vec3 worldViewVec = vWorldPosition.xyz - uWorldEyeVec.xyz;
		vec3 reflectVec = reflect(worldViewVec, normalize(vWorldNormal.xyz));
        gl_FragColor = textureCube(uEnvironmentMap, reflectVec);
    	gl_FragColor = mix(vColor, gl_FragColor, reflectivity);
    }

    if (useLighting) {
		vec3 lighting = vec3(0.0, 0.0, 0.0);

		for (int i = 0; i < MAX_DIR_LIGHTS; i++) {
			if (i < uNumDirectionalLights) {
				vec3 dirLightColor = uDirectionalLightsColor[i];
				vec3 dirLightVec = uDirectionalLightsDirection[i];

				vec3 viewVec = normalize(-vPosition.xyz);
				vec3 reflectVec = reflect(dirLightVec, normal);
				float specularAngle = max(dot(reflectVec, viewVec), 0.0);
				float shininess = 4.0;

				vec3 diffuseLight = dirLightColor * max(dot(normal, -dirLightVec), 0.0);
				vec3 specularLight = dirLightColor * pow(specularAngle, shininess);

				lighting += diffuseLight;
				lighting += specularLight;
			}
		}

		lighting += uAmbientLightColor;

        gl_FragColor *= vec4(lighting, 1.0);
    }

	if (false) {
		// add some fog
		float density = 0.10;
		// falloff speed
		float easing = 0.3;
		// height of fog
		float height = -5.0;
		// gives fog based on distance from camera and height from ground
		float fogFactor = exp2(-pow(density * vPosition.z, 2.0)) + (1.0 / (1.0 + exp2(-easing * vWorldPosition.y - height)));
		// clamp between 0 and 1
		fogFactor = clamp(fogFactor, 0.0, 1.0);

		// fog colour
		vec4 fogColor = vec4(0.2, 0.0, 0.3, 1.0);

		// linearly blend current color with fog
		gl_FragColor = mix(fogColor, gl_FragColor, fogFactor);
	}

	// for debugging
//	gl_FragColor = vec4(normal, 1);
//	gl_FragColor = vec4(vWorldNormal, 1);
//	gl_FragColor = vec4(vLightDirection);

}