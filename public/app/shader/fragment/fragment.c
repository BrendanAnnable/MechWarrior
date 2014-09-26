/**
 * @author Brendan Annable
 */
#define MAX_DIR_LIGHTS 4

precision mediump float;

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

// The linearly interpolated values from the vertex shader
varying vec3 vRawPosition;
varying vec3 vRawNormal;
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
        gl_FragColor = textureCube(uEnvironmentMap, normalize(vRawPosition));
    } else if (useTexture) {
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    } else {
    	gl_FragColor = vColor;
    }

    vec3 dirLightColor = uDirectionalLightsColor[0];
    vec3 dirLightVec = normalize(uDirectionalLightsDirection[0]);

    vec3 viewVec = normalize(-vPosition.xyz);
    vec3 reflectVec = reflect(dirLightVec, normal);
    float specularAngle = max(dot(reflectVec, viewVec), 0.0);
    float shininess = 4.0;

    vec3 ambientLight = 0.2 * dirLightColor;
    vec3 diffuseLight = dirLightColor * max(dot(normal, -dirLightVec), 0.0);
    vec3 specularLight = dirLightColor * pow(specularAngle, shininess);

    if (useLighting) {
        gl_FragColor = gl_FragColor * vec4(
            + ambientLight
            + diffuseLight
            + specularLight
        , 1);
    }

	// add some fog
	float density = 0.008;
	// calculate fog factor
	float fogFactor = exp2(-pow(density * vPosition.z, 2.0));
	// clamp between 0 and 1
	fogFactor = clamp(fogFactor, 0.0, 1.0);

	// fog colour
	vec4 fogColor = vec4(0.2, 0.0, 0.3, 1.0);

	// linearly blend current color with fog
	gl_FragColor = mix(fogColor, gl_FragColor, fogFactor);

	// for debugging
//	gl_FragColor = vec4(normal, 1);
//	gl_FragColor = vec4(vRawNormal, 1);
//	gl_FragColor = vec4(vLightDirection);

}