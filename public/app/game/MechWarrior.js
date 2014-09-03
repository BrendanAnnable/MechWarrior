/**
 * @author Monica Olejniczak
 */

Ext.define('MW.game.MechWarrior', {
	alias: 'MechWarrior',
	config: {
		gl: null,               // The webGL context
		shaderProgram: null,    // The shader program containing the vertex and fragment shader
		scene: null,            // The scene object to hold models
		zenithAngle: 0,         // Spherical coordinates angle for pitch
		azimuthAngle: 0,        // Spherical coordinates angle for yaw
		controls: null
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
			minPitch: -Math.PI / 6
		});
		this.setControls(controls);
		// Setup WebGL
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
//		gl = WebGLDebugUtils.makeDebugContext(gl);
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		this.setGl(gl);
		// Initialize the shaderProgram
		this.initShaders(gl, function (shaderProgram) {
			this.setShaderProgram(shaderProgram);
			// get the scene
			var scene = this.getScene();
			// Load the face model
			scene.loadModel(gl, 'face.json', Ext.bind(function () {
				// Set the background color
				gl.clearColor(0, 0, 0, 1);
				// Enable depth testing
				gl.enable(gl.DEPTH_TEST);
				scene.createWorld(gl, 300, 300, 300);
				// Start the animation loop
				this.tick(gl, shaderProgram, controls);
			}, this));
		});
	},
	/**
	 * Animation tick, uses requestAnimationFrame to run as fast as possible.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param controls The mouse controls
	 */
	tick: function (gl, shaderProgram, controls) {
		this.getScene().render(gl, shaderProgram, controls);
		requestAnimationFrame(Ext.bind(this.tick, this, [gl, shaderProgram, controls]));
	},
	/**
	 * Initializes the WebGL shader program
	 *
	 * @param gl The WebGL context
	 * @param callback Callback once the shaderProgram have been loaded with
	 * the WebGL shader program as the first parameter
	 */
	initShaders: function (gl, callback) {
		// Initialize the shaderProgram
		this.loadShaders(gl, function (vertexShader, fragmentShader) {
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
	loadShaders: function (gl, callback) {
		// Load the vertex and fragment shader
		Ext.create('MW.shader.vertex.Vertex').load(gl, function (vertexShader) {
			Ext.create('MW.shader.fragment.Fragment').load(gl, function (fragmentShader) {
				callback.call(this, vertexShader, fragmentShader);
			}, this);
		}, this);
	}
});