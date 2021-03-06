/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('FourJS.renderer.WebGLRenderer', {
	cursor: null,
    requires: [
        'FourJS.shader.vertex.Vertex',
        'FourJS.shader.fragment.Fragment',
        'FourJS.buffer.Vertex',
        'FourJS.buffer.Normal',
        'FourJS.buffer.Face',
        'FourJS.buffer.TextureCoordinate',
	    'FourJS.buffer.EnvironmentCoordinate',
		'FourJS.light.AmbientLight',
		'FourJS.light.DirectionalLight',
		'FourJS.light.PointLight',
		'FourJS.light.SpotLight'
    ],
	MAX_DIR_LIGHTS: 4,
	config: {
		gl: null,
        shaderProgram: null,
		width: 320,
		height: 240,
        backgroundColor: null
	},
    mixins: ['Ext.mixin.Observable'],
	constructor: function (config) {
		this.initConfig(config);
		this.cursor = mat4.create();
        var gl = this.getGl();
        // Set the background color
        var color = this.getBackgroundColor();
        gl.clearColor(color.getR(), color.getG(), color.getB(), color.getA());
        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        // Initialize the shaderProgram
        this.initShaderProgram(gl);
	},
    /**
     * Initializes the WebGL shader program
     *
     * @param gl The WebGL context
     */
    initShaderProgram: function (gl) {
        // Initialize the shaderProgram
        this.loadShaderProgram(gl).bind(this).spread(function (vertexShader, fragmentShader) {
            // Create a WebGL shader program
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.error("Could not initialise shaderProgram");
            }

            gl.useProgram(shaderProgram);

            // Setup the attributes
            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
            gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

            shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

			//shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
			//gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

            // Setup the uniforms
            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
            shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "useTexture");
            shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "useLighting");
			shaderProgram.useEnvironmentMapUniform = gl.getUniformLocation(shaderProgram, "useEnvironmentMap");
			shaderProgram.reflectivity = gl.getUniformLocation(shaderProgram, "reflectivity");

            shaderProgram.uAmbientLightColor = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");

			shaderProgram.uNumDirectionalLights = gl.getUniformLocation(shaderProgram, "uNumDirectionalLights");
			shaderProgram.uDirectionalLightsColor = gl.getUniformLocation(shaderProgram, "uDirectionalLightsColor");
			shaderProgram.uDirectionalLightsDirection = gl.getUniformLocation(shaderProgram, "uDirectionalLightsDirection");

			shaderProgram.uLightPos = gl.getUniformLocation(shaderProgram, "uLightPos");
            shaderProgram.uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");

            shaderProgram.uDiffuseColor = gl.getUniformLocation(shaderProgram, "uDiffuseColor");

			shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, "uSampler");
			shaderProgram.uEnvironmentMap = gl.getUniformLocation(shaderProgram, "uEnvironmentMap");

			shaderProgram.uWorldTransform = gl.getUniformLocation(shaderProgram, "uWorldTransform");
			shaderProgram.uWorldEyeVec = gl.getUniformLocation(shaderProgram, "uWorldEyeVec");

			shaderProgram.uUseFog = gl.getUniformLocation(shaderProgram, "uUseFog");
			shaderProgram.uFogColor = gl.getUniformLocation(shaderProgram, "uFogColor");
			shaderProgram.uFogDensity = gl.getUniformLocation(shaderProgram, "uFogDensity");
			shaderProgram.uFogEasing = gl.getUniformLocation(shaderProgram, "uFogEasing");
			shaderProgram.uFogHeight = gl.getUniformLocation(shaderProgram, "uFogHeight");

            this.setShaderProgram(shaderProgram);
            this.fireEvent('loaded');
        });
    },
    /**
     * Load the regular vertex and fragment shaderProgram
     * @param gl The WebGL context
     */
    loadShaderProgram: function (gl) {
        return Promise.all([
            Ext.create('FourJS.shader.vertex.Vertex').load(gl),
            Ext.create('FourJS.shader.fragment.Fragment').load(gl)
        ]);
    },
    /**
     * This method renders the scene and all of its children
     *
     * @param scene The scene to render
     * @param camera The 3D perspective camera being used
     */
	render: function (scene, camera) {
		var gl = this.getGl();

        var width = this.getWidth();
        var height = this.getHeight();
		// Set the viewport size
		gl.viewport(0, 0, width, height);
        camera.setRatio(width / height);
        camera.update();

		var cursor = this.cursor;

		// Clear the color buffer and depth buffer bits
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.identity(cursor);
		// Transform from camera space to world space
		mat4.multiply(cursor, cursor, camera.getPositionInverse());

		var shaderProgram = this.getShaderProgram();
		var cameraPosition = camera.getPosition();
		var worldTransform = mat4.clone(cameraPosition);
		gl.uniformMatrix4fv(shaderProgram.uWorldTransform, false, worldTransform);

		var worldEyeVec = mat4.translateVector(cameraPosition);
		gl.uniform4fv(shaderProgram.uWorldEyeVec, worldEyeVec);

		this.updateLighting(gl, scene, shaderProgram, cursor, camera);
		this.updateFog(gl, scene, shaderProgram, cursor, camera);

		this.renderObject(gl, scene, shaderProgram, cursor, camera);
	},
	updateFog: function (gl, scene, shaderProgram, cursor, camera) {
		var fog = scene.getFog();
		if (fog === null) {
			gl.uniform1i(shaderProgram.uUseFog, 0);
			return;
		}

		gl.uniform1i(shaderProgram.uUseFog, 1);
		gl.uniform4fv(shaderProgram.uFogColor, fog.getColor().getArray());
		gl.uniform1f(shaderProgram.uFogDensity, fog.getDensity());
		gl.uniform1f(shaderProgram.uFogEasing, fog.getEasing());
		gl.uniform1f(shaderProgram.uFogHeight, fog.getHeight());
	},
	updateLighting: function (gl, scene, shaderProgram, cursor, camera) {
		var lights = scene.getLights();
		var cameraInverse = camera.getPositionInverse();
		var directionalLights = [];
		var ambientLight = null;
		var pointLights = [];
		var spotLights = [];

		for (var i = 0 ; i < lights.length; i++) {
			var light = lights[i];
			if (light instanceof FourJS.light.DirectionalLight) {
				directionalLights.push(light);
			}
			else if (light instanceof FourJS.light.AmbientLight) {
				ambientLight = light;
			}
			else if (light instanceof FourJS.light.PointLight) {
				pointLights.push(light);
			}
			else if (light instanceof FourJS.light.SpotLight) {
				spotLights.push(light);
			}
		}

        if (ambientLight === null) {
            ambientLight = Ext.create('FourJS.light.AmbientLight', {
                color: Ext.create('FourJS.util.Color', {r: 1, g: 1, b: 1})
            });
        }

		gl.uniform3fv(shaderProgram.uAmbientLightColor, new Float32Array([
			ambientLight.getColor().getR(),
			ambientLight.getColor().getG(),
			ambientLight.getColor().getB()
		]));

		gl.uniform1i(shaderProgram.uNumDirectionalLights, directionalLights.length);
		var directionalLightsColor = new Float32Array(this.MAX_DIR_LIGHTS * 3);
		var directionalLightsDirection = new Float32Array(this.MAX_DIR_LIGHTS * 3);
		for (var i = 0 ; i < directionalLights.length; i++) {
			var light = directionalLights[i];
			// color
			directionalLightsColor[3 * i + 0] = light.getColor().getR();
			directionalLightsColor[3 * i + 1] = light.getColor().getG();
			directionalLightsColor[3 * i + 2] = light.getColor().getB();

			// direction
			var direction = vec4.subtract(vec4.create(), light.getTarget().getTranslationVector(), light.getTranslationVector());
			vec4.transformMat4(direction, direction, cameraInverse); // transform to camera-space
			vec4.normalize(direction, direction);
			directionalLightsDirection[3 * i + 0] = direction[0];
			directionalLightsDirection[3 * i + 1] = direction[1];
			directionalLightsDirection[3 * i + 2] = direction[2];
		}
		gl.uniform3fv(shaderProgram.uDirectionalLightsColor, directionalLightsColor);
		gl.uniform3fv(shaderProgram.uDirectionalLightsDirection, directionalLightsDirection);
	},
    /**
     * Renders a particular object within the scene.
     *
     * @param gl The WebGL context
     * @param object The object to render
     * @param shaderProgram The WebGL shader program
     * @param cursor This is the position where to render the object
     * @param camera The camera to render from
     */
	renderObject: function (gl, object, shaderProgram, cursor, camera) {
		var cursorCopy = mat4.clone(cursor);
		mat4.multiply(cursorCopy, cursorCopy, object.getPosition());

		if (object.isVisible()) {
			if (object.isRenderable()) {
				this.bindBuffers(gl, object, shaderProgram);
				var useTexture = object.hasMaterial() && object.getMaterial().hasTexture();
				var useEnvironmentMap = object.hasMaterial() && object.getMaterial().hasEnvironmentMap();
				var material = object.getMaterial();

				gl.uniform4fv(shaderProgram.uDiffuseColor, material.getColor().getArray());

				if (useEnvironmentMap) {
					var environmentMap = material.getEnvironmentMap();
					if (material.__webglEnvironmentMap === undefined) {
						material.__webglEnvironmentMap = this.loadEnvironmentMap(gl, object, environmentMap);
					}
					this.applyEnvironmentMap(gl, object, shaderProgram);
					gl.uniform1i(shaderProgram.useTextureUniform, 0);
					gl.uniform1i(shaderProgram.useEnvironmentMapUniform, 1);
				}
				else if (useTexture) {
					var texture = material.getTexture();
					if (texture !== null && material.__webglTexture === undefined) {
						material.__webglTexture = this.loadTexture(gl, object, texture);
					}
					this.applyTexture(gl, object, shaderProgram);
					gl.uniform1i(shaderProgram.useTextureUniform, 1);
					gl.uniform1i(shaderProgram.useEnvironmentMapUniform, 0);
				} else {
					gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
					gl.uniform1i(shaderProgram.useTextureUniform, 0);
					gl.uniform1i(shaderProgram.useEnvironmentMapUniform, 0);
				}

				gl.uniform1i(shaderProgram.useLightingUniform, material.getUseLighting());
				gl.uniform1f(shaderProgram.reflectivity, material.getReflectivity());

				// Update the WebGL uniforms and then draw the object on the screen
				this.updateUniforms(gl, shaderProgram, cursorCopy, camera);
				var wireframe = material && material.getWireframe();
				var type = wireframe ? gl.LINE_LOOP : gl.TRIANGLES;
				var numItems = object.getGeometry().__webglFaceBuffer.numItems;
				gl.drawElements(type, numItems, gl.UNSIGNED_SHORT, 0);
			}

			this.renderChildren(gl, object, shaderProgram, cursorCopy, camera);
		}
	},
    /**
     * Binds the buffers for a particular object
     *
     * @param gl The WebGL context
     * @param object The object to render
     * @param shaderProgram The WebGL shader program
     */
    bindBuffers: function (gl, object, shaderProgram) {
        this.checkBuffer(gl, object);
        // Update the object position
		var geometry = object.getGeometry();
        var vertexBuffer = geometry.__webglVertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the object normals
        var normalBuffer = geometry.__webglNormalBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the object faces
        var faceBuffer = geometry.__webglFaceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    },
    /**
     * Checks if the buffers need to be created for a particular object
     *
     * @param gl The WebGL context
     * @param object The object to render
     */
    checkBuffer: function (gl, object) {
		var geometry = object.getGeometry();
        if (geometry.__webglBuffers !== true) {
			// attach the buffers to the current child object
			geometry.__webglVertexBuffer = Ext.create('FourJS.buffer.Vertex').load(gl, geometry);
			geometry.__webglNormalBuffer = Ext.create('FourJS.buffer.Normal').load(gl, geometry);
			geometry.__webglFaceBuffer = Ext.create('FourJS.buffer.Face').load(gl, geometry);
			geometry.__webglBuffers = true;

			if (object.hasMaterial()) {
				var material = object.getMaterial();
				if (material.hasTexture()) {
					geometry.__webglTextureCoordinateBuffer = Ext.create('FourJS.buffer.TextureCoordinate').load(gl, object);
				}
				if (material.hasEnvironmentMap()) {
					geometry.__webglEnvironmentCoordinateBuffer = Ext.create('FourJS.buffer.EnvironmentCoordinate').load(gl, object);
				}
			}
		}
    },
    /**
     * Applies a texture to an object.
     *
     * @param gl The WebGL context
     * @param object The object to render
     * @param shaderProgram The WebGL shader program
     */
    applyTexture: function (gl, object, shaderProgram) {
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
        // Update the object texture
		var material = object.getMaterial();
		var geometry = object.getGeometry();
        var textureCoordinateBuffer = geometry.__webglTextureCoordinateBuffer;
		var texture = material.__webglTexture;
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, textureCoordinateBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
    },
	getDefaultTexture: function (){
		return new Uint8Array([0, 0, 0, 255]);
	},
    /**
     * Loads a texture into WebGL
     *
     * @param gl The WebGL context
     * @param object The object to load the texture for
     * @param texture The texture to be loaded
     */
    loadTexture: function (gl, object, texture) {
        var glTexture = gl.createTexture();
        glTexture.image = texture.getImage();
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
		// load default texture
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.getDefaultTexture());

		function loaded() {
			gl.bindTexture(gl.TEXTURE_2D, glTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTexture.image);
			if (texture.isRepeatable()) {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			}
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		if (texture.isLoaded()) {
			loaded();
		} else {
			texture.on('load', loaded, this);
		}

        return glTexture;
    },
	/**
	 * Applies an environment map to an object.
	 *
	 * @param gl The WebGL context
	 * @param object The object to render
	 * @param shaderProgram The WebGL shader program
	 */
	applyEnvironmentMap: function (gl, object, shaderProgram) { // todo too tired to fix dis
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		// Update the object texture
		var material = object.getMaterial();
		var geometry = object.getGeometry();
		var textureCoordinateBuffer = geometry.__webglEnvironmentCoordinateBuffer;
		var texture = material.__webglEnvironmentMap;
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinateBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, textureCoordinateBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
		gl.uniform1i(shaderProgram.uEnvironmentMap, 1);
	},
	/**
	 * Loads an environment map into WebGL.
	 *
	 * @param gl The WebGL context
	 * @param object The object to load the environment map for
	 * @param map The map to be loaded
	 */
	loadEnvironmentMap: function (gl, object, map) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		object.faces = [
			[map.getRightImage(), gl.TEXTURE_CUBE_MAP_POSITIVE_X],
			[map.getLeftImage(), gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
			[map.getUpImage(), gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
			[map.getDownImage(), gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
			[map.getBackImage(), gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
			[map.getFrontImage(), gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
		];

		var faces = object.faces;
		for (var i = 0; i < faces.length; i++) {
			var face = faces[i][1];
			gl.texImage2D(face, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.getDefaultTexture());
		}

		function loaded() {
			for (var i = 0; i < faces.length; i++) {
				var image = faces[i][0];
				var face = faces[i][1];
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			}
		}

		if (map.isLoaded()) {
			loaded();
		} else {
			map.on('load', loaded, this);
		}

		return texture;
	},
	/**
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param camera
	 */
	updateUniforms: function (gl, shaderProgram, cursor, camera) {
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camera.getPerspective());
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, cursor);

		// Send the model-view projection normal matrix to WebGL
		var normalMatrix = mat3.normalFromMat4(mat3.zeros(), cursor);
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

		// Send the light position and color to WebGL
		// TODO: make these less hardcoded and into variables
		var x = 0;//100 * Math.sin(2 * Math.PI * Date.now() / 1000);
		var lightPosition = vec4.fromValues(x, 0, 0, 1);
		gl.uniform4fv(shaderProgram.uLightPos, lightPosition);
		gl.uniform3fv(shaderProgram.uLightColor, [0.0, 0, 0.8]);
	},
    /**
     * Renders the children of an object.
     *
     * @param gl The WebGL context
     * @param object The object to render
     * @param shaderProgram The WebGL shader program
     * @param cursor This is the position where to render the object
     * @param camera The camera to render from
     */
    renderChildren: function (gl, object, shaderProgram, cursor, camera) {
        var children = object.getChildren();
        for (var i = 0; i < children.length; i++) {
            this.renderObject(gl, children[i],shaderProgram, cursor, camera);
        }
    }
});