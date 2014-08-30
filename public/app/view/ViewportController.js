/**
 * @author Brendan Annable
 */
Ext.define('MW.view.ViewportController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ViewportController',
	config: {
		gl: null,               // The webGL context
		shaders: null,          // The shader program containing the vertex and fragment shader
		canvas: null,           // The HTML canvas used for drawing on
		scene: null,            // The scene object to hold models
		zenithAngle: 0,         // Spherical coordinates angle for pitch
		azimuthAngle: 0,        // Spherical coordinates angle for yaw
		controls: null
	},
	/**
	 * Initialization function which runs on page load
	 */
	init: function () {
		// Initialize any needed arrays or objects
		this.setScene(Ext.create('MW.util.Scene'));
	},
	/**
	 * Callback that is run when the window is resized
	 *
	 * @param container The container object that was resized
	 * @param width The new width of the container
	 * @param height The new height of the container
	 */
	onResize: function (container, width, height) {
		// Resize the WebGL viewport based on the new size
		var canvas = this.getCanvas();
		var gl = this.getGl();
		canvas.width = width;
		canvas.height = height;
		gl.viewportWidth = width;
		gl.viewportHeight = height;
	},
	/**
	 * Callback that is run after the DOM has been rendered
	 *
	 * @param container The container that has been rendered
	 */
	onAfterRender: function (container) {
		var canvas = container.getEl().dom;
		this.setCanvas(canvas);

		this.setControls(Ext.create('MW.control.Mouse', {
			element: canvas
		}));

		// Setup WebGL
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		this.setGl(gl);

		// Initialize the shaders
		this.initShaders(gl, function (shaders) {
			this.setShaders(shaders);
			// get the scene
			var scene = this.getScene();
			// Load the face model
			scene.loadModel(gl, 'face.json', Ext.bind(function () {
				// Set the background color
				gl.clearColor(0, 0, 0, 1);
				// Enable depth testing
				gl.enable(gl.DEPTH_TEST);
				scene.createFloor(gl, 'floor');
				// Start the animation loop
				this.tick();
			}, this));
		});
	},
	/**
	 * Animation tick, uses requestAnimationFrame to run as fast as possible
	 */
	tick: function () {
		this.getScene().render(this.getGl(), this.getShaders(), Ext.bind(this.updateUniforms, this));
		requestAnimationFrame(Ext.bind(this.tick, this));
	},
	/**
	 * Initializes the WebGL shader program
	 *
	 * @param gl The WebGL context
	 * @param callback Callback once the shaders have been loaded with
	 * the WebGL shader program as the first parameter
	 */
	initShaders: function (gl, callback) {
		// Initialize the shaders
		this.loadShaders(gl, function (vertexShader, fragmentShader) {
			// Create a WebGL shader program
			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, vertexShader);
			gl.attachShader(shaderProgram, fragmentShader);
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
				console.error("Could not initialise shaders");
			}

			gl.useProgram(shaderProgram);

			// Setup the attributes
			shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

			shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
			gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

//			shaders.vertexColorAttribute = gl.getAttribLocation(shaders, "aVertexColor");
//			gl.enableVertexAttribArray(shaders.vertexColorAttribute);

			// Setup the uniforms
			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
			shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

			shaderProgram.uLightPos = gl.getUniformLocation(shaderProgram, "uLightPos");
			shaderProgram.uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor");
			callback.call(this, shaderProgram);
		});
	},
	/**
	 * Load the regular vertex and fragment shaders
	 * @param gl The WebGL context
	 * @param callback Callback that is called once the shaders have been loaded with
	 * the first parameter as the vertex shader and the second as the fragment shader
	 */
	loadShaders: function (gl, callback) {
		var me = this; //todo fix scope
		// Load the vertex and fragment shader
		Ext.create('MW.shader.vertex.Vertex').load(gl, function (vertexShader) {
			Ext.create('MW.shader.fragment.Fragment').load(gl, function (fragmentShader) {
				callback.call(me, vertexShader, fragmentShader);
			});
		});
	}
});

