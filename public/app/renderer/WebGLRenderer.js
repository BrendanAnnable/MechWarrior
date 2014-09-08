/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.renderer.WebGLRenderer', {
	cursor: null,
    requires: [
        'MW.shader.vertex.Vertex',
        'MW.shader.fragment.Fragment',
        'MW.buffer.Vertex',
        'MW.buffer.Normal',
        'MW.buffer.Face',
        'MW.buffer.Texture'
    ],
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
        this.loadShaderProgram(gl, function (vertexShader, fragmentShader) {
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

            shaderProgram.uLightPos = gl.getUniformLocation(shaderProgram, "uLightPos");
            shaderProgram.uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");

            shaderProgram.uDiffuseColor = gl.getUniformLocation(shaderProgram, "uDiffuseColor");
            this.setShaderProgram(shaderProgram);
            this.fireEvent('loaded');
        });
    },
    /**
     * Load the regular vertex and fragment shaderProgram
     * @param gl The WebGL context
     * @param callback Callback that is called once the shaderProgram have been loaded with
     * the first parameter as the vertex shader and the second as the fragment shader
     */
    loadShaderProgram: function (gl, callback) {
        // Load the vertex and fragment shader
        Ext.create('MW.shader.vertex.Vertex').load(gl, function (vertexShader) {
            Ext.create('MW.shader.fragment.Fragment').load(gl, function (fragmentShader) {
                callback.call(this, vertexShader, fragmentShader);
            }, this);
        }, this);
    },
    /**
     * This method renders the scene and all of its children
     *
     * @param scene The scene to render
     * @param camera The 3D perspective camera being used
     */
	render: function (scene, camera) {
		var gl = this.getGl();

		// Set the viewport size
		gl.viewport(0, 0, this.getWidth(), this.getHeight());

		var cursor = this.cursor;

		// Clear the color buffer and depth buffer bits
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.identity(cursor);
		// Transform from camera space to world space
		mat4.multiply(cursor, cursor, camera.getPositionInverse());

		this.renderObject(gl, scene, this.getShaderProgram(), cursor, camera);
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

		if (object.isRenderable()) {
			this.bindBuffers(gl, object, shaderProgram);
			var useTexture = object.textureBuffer !== null;
            var material = object.getMaterial();

            gl.uniform4fv(shaderProgram.uDiffuseColor, material.getColor().getArray());

            if (useTexture) {
                var texture = material.getTexture();
                if (texture !== null && texture.isLoaded() && object.textureBuffer.texture === undefined) {
                    this.loadTexture(gl, object, texture);
                }
            }

			if (material.hasEnvironmentMap()) {
				var environmentMap = material.getEnvironmentMap();
				if (!environmentMap.isLoaded()) {
					this.loadEnvironmentMap(gl, object, environmentMap);
					environmentMap.setLoaded(true);
				}
				this.applyEnvironmentMap(gl, object, shaderProgram);
				gl.uniform1i(shaderProgram.useTextureUniform, 1);
			}

			if (useTexture && texture !== null && texture.isLoaded()) {
                this.applyTexture(gl, object, shaderProgram);
                gl.uniform1i(shaderProgram.useTextureUniform, 1);
			} else {
                gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
                gl.uniform1i(shaderProgram.useTextureUniform, 0);
			}

            gl.uniform1i(shaderProgram.useLightingUniform, material.getUseLighting());

			// Update the WebGL uniforms and then draw the object on the screen
			this.updateUniforms(gl, shaderProgram, cursorCopy, camera);
			gl.drawElements(gl.TRIANGLES, object.faceBuffer.numItems * object.faceBuffer.itemSize, gl.UNSIGNED_SHORT, 0);
		}

		this.renderChildren(gl, object, shaderProgram, cursorCopy, camera);
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
        var vertexBuffer = object.vertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the object normals
        var normalBuffer = object.normalBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Update the object faces
        var faceBuffer = object.faceBuffer;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    },
    /**
     * Checks if the buffers need to be created for a particular object
     *
     * @param gl The WebGL context
     * @param object The object to render
     */
    checkBuffer: function (gl, object) {
        if (object.vertexBuffer === undefined) {
            // attach the buffers to the current child object
            var geometry = object.getGeometry();
            object.vertexBuffer = Ext.create('MW.buffer.Vertex', gl, geometry).getBuffer();
            object.normalBuffer = Ext.create('MW.buffer.Normal', gl, geometry).getBuffer();
            object.faceBuffer = Ext.create('MW.buffer.Face', gl, geometry).getBuffer();
            object.textureBuffer = Ext.create('MW.buffer.Texture', gl, object).getBuffer();
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
        var textureBuffer = object.textureBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureBuffer.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
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
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTexture.image);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    if (texture.isRepeatable()) {
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	    } else {
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    }
	    gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        object.textureBuffer.texture = glTexture;
    },
	/**
	 * Applies an environment map to an object.
	 *
	 * @param gl The WebGL context
	 * @param object The object to render
	 * @param shaderProgram The WebGL shader program
	 */
	applyEnvironmentMap: function (gl, object, shaderProgram) { // todo too tired to fix dis
		var texture = object.texture;
		var faces = object.faces;
		for (var i = 0; i < faces.length; i++) {
			var face = faces[i][1];
			var image = new Image();
			image.onload = function (texture, face, image) {
				return function () {
					gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
					gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
					gl.uniform1i(shaderProgram.samplerUniform, 0);
				}
			} (texture, face, image);
		}
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
		object.faces = [[map.getRightUrl(), gl.TEXTURE_CUBE_MAP_POSITIVE_X],
			[map.getLeftUrl(), gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
			[map.getTopUrl(), gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
			[map.getBottomUrl(), gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
			[map.getBackUrl(), gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
			[map.getFrontUrl(), gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
		/*for (var i = 0; i < faces.length; i++) {
			var face = faces[i][1];
			var image = new Image();
			image.onload = function (texture, face, image) {
				return function () {
					gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
					gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
				}
			} (texture, face, image);
		} */
		object.texture = texture;
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