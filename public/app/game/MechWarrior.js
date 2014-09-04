/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.game.MechWarrior', {
	alias: 'MechWarrior',
	config: {
		gl: null,               // The WebGL context
		shaderProgram: null,    // The shader program containing the vertex and fragment shader
		scene: null,            // The scene object to hold models
		zenithAngle: 0,         // Spherical coordinates angle for pitch
		azimuthAngle: 0,        // Spherical coordinates angle for yaw
		controls: null          // The mouse controls
	},
	/**
	 * Constructor called after the HTML5 canvas has been rendered.
	 *
	 * @param canvas the HTML5 canvas
	 */
	constructor: function (canvas) {
		// Initialize the scene and the mouse controls
		this.setScene(Ext.create('MW.util.Scene'));
		var controls = Ext.create('MW.control.Mouse', {
			element: canvas,
			minPitch: Math.PI / 6
		});
		this.setControls(controls);
		// Setup WebGL
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
//		gl = WebGLDebugUtils.makeDebugContext(gl);
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		this.setGl(gl);
		this.setGl(gl);
		// Initialize the shaderProgram
		this.initShaderProgram(gl, function (shaderProgram) {
			this.setShaderProgram(shaderProgram);
			// get the scene
			var scene = this.getScene();
			// load the player model and add it to the scene
			var player = Ext.create('MW.game.character.Player');
            player.load('face.json', function () {
				this.createObject(gl, scene, player, player.getName());
				// Set the background color
				gl.clearColor(0, 0, 0, 1);
				// Enable depth testing
				gl.enable(gl.DEPTH_TEST);
				var world = Ext.create('MW.game.world.World', gl, 300, 300, 300);
				this.createObject(gl, scene, world, world.getName());
				// Start the animation loop
				this.tick(gl, shaderProgram, scene, controls);
			}, this);
		});
	},
	/**
	 * Creates an object for the scene.
	 *
	 * @param gl The WebGL context
	 * @param scene The scene being rendered to
	 * @param object The object being added to the scene
	 * @param name The name of the object
	 */
	createObject: function (gl, scene, object, name) {
		// create the WebGL buffers for the vertices, normals, faces and textures
        var children = object.getChildren();
        var objects = children.length === 0 ? object : children;
		Ext.each(objects, function (obj) {
			var geometry = obj.getGeometry();
			// attach the buffers to the current child object
			obj.vertexBuffer = Ext.create('MW.buffer.Vertex', gl, geometry).getBuffer();
			obj.normalBuffer = Ext.create('MW.buffer.Normal', gl, geometry).getBuffer();
			obj.faceBuffer = Ext.create('MW.buffer.Face', gl, geometry).getBuffer();
			obj.textureBuffer = Ext.create('MW.buffer.Texture', gl, obj).getBuffer();
		});
		// add a listener to the object
		object.on('updateuniforms', this.updateUniforms, this);
		// add the object to the scene
		scene.addObject(object, name);
	},
	/**
	 * Animation tick, uses requestAnimationFrame to run as fast as possible.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param scene The scene to draw objects in
	 * @param controls The mouse controls
	 */
	tick: function (gl, shaderProgram, scene, controls) {
		scene.renderScene(gl, shaderProgram, controls);
		requestAnimationFrame(Ext.bind(this.tick, this, [gl, shaderProgram, scene, controls]));
	},
	/**
	 * Initializes the WebGL shader program
	 *
	 * @param gl The WebGL context
	 * @param callback Callback once the shaderProgram have been loaded with
	 * the WebGL shader program as the first parameter
	 */
	initShaderProgram: function (gl, callback) {
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

//			shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
//			gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

			// Setup the uniforms
			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
			shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
			shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "useTexture");
			shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "useLighting");

			shaderProgram.uLightPos = gl.getUniformLocation(shaderProgram, "uLightPos");
			shaderProgram.uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");
			callback.call(this, shaderProgram);
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
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 */
	updateUniforms: function (gl, shaderProgram, cursor) {
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this.getScene().getPMatrix());
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
	}
});