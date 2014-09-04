/**
 * @autbor Brendan Annable
 */
Ext.define('MW.util.Scene', {
	alias: 'Scene',
	config: {
		objects: null,          // A map of objects that have been loaded, keyed by their name
		cursor: null,           // The current model-view project matrix (where to draw)
		pMatrix: null,          // The perspective projection matrix
		playerPosition: null,   // The players current position in the level
		lastTime: 0             // Used by the animate function, to keep track of the time between animation frames
	},
	constructor: function (config) {
        this.initConfig(config);
		this.setObjects({});
		this.setCursor(mat4.create());
		this.setPMatrix(mat4.create());
		this.setPlayerPosition(mat4.create());
	},
    /**
     * Adds an object to the scene through the game.
     *
     * @param object The object to add to the scene
     * @param name The name of the object to be added to the object map
     */
	addObject: function (object, name) {
		this.getObjects()[name] = object;
	},
	/**
	 * Draws the WebGL scene, must be called continuously to produce animations
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param controls The mouse controls
	 */
	renderScene: function (gl, shaderProgram, controls) {
		var now = Date.now();
		var lastTime = this.getLastTime();

		if (lastTime != 0) {
			var elapsed = now - lastTime;
			var periodNominator = 2 * Math.PI * now;

			// Set the viewport size
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

			// Clear the color buffer and depth buffer bits
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			var cursor = this.getCursor();
			var pMatrix = this.getPMatrix();

			// Create a perspective projection matrix
			mat4.perspective(pMatrix, 45 * Math.PI / 180 , gl.viewportWidth / gl.viewportHeight, 0.1, 2000);
			mat4.identity(cursor);

			var cameraPosition = controls.getPosition();
			var cameraPositionInvert = mat4.create();
			mat4.othoNormalInvert(cameraPositionInvert, cameraPosition);

			// Translate away from the camera
			mat4.translate(cursor, cursor, [0, 0, -40]);

			mat4.multiply(cursor, cursor, cameraPositionInvert);

			/*
			this.saveCursor();
			/*var axis = vec4.fromValues(0, 1, 0, 0);
			vec4.transformMat4(axis, axis, controls.getPitchRotation());
			mat4.rotate(cursor, cursor, Math.PI, vec4.vec3(axis));*/
//			mat4.rotateY(cursor, cursor, Math.PI);
			  /*
			this.renderPlayer(gl, shaderProgram, cursor, periodNominator);
			cursor = this.restoreCursor();

			// Apply yaw from camera
			mat4.multiply(cursor, cursor, controls.getYawRotation());

			// player position
			// Simulate player moving backwards and forwards
			var position = this.getPlayerPosition();
			var period = 20000;
			var x = 80 * Math.sin(2 * Math.PI * Date.now() / period);
			var translateVector = mat4.translateVector(position);
			translateVector[0] = x;
			mat4.multiply(cursor, cursor, position);   */
			var objects = this.getObjects();
			for (var key in objects) {
				objects[key].render(gl, shaderProgram, cursor);
			}
		}
		this.setLastTime(now);
	}
});
