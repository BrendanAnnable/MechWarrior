/**
 * @autbor Brendan Annable
 */
Ext.define('MW.util.Scene', {
	alias: 'Scene',
	config: {
		objects: null,          // A map of objects that have been loaded, keyed by their name
		mvStack: null,          // The model-view projection stack, used to keep a history of where you draw
		cursor: null,           // The current model-view project matrix (where to draw)
		pMatrix: null,          // The perspective projection matrix
		playerPosition: null,   // The players current position in the level
		lastTime: 0             // Used by the animate function, to keep track of the time between animation frames
	},
	constructor: function () {
		this.setObjects({});
		this.setMvStack([]);
		this.setCursor(mat4.create());
		this.setPMatrix(mat4.create());
		this.setPlayerPosition(mat4.create());
	},
	addObject: function (object, name) {
		// store the object in the object map
		this.getObjects()[name] = object;
	},
	/**
	 * Draws the WebGL scene, must be called continuously to produce animations
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param controls The mouse controls
	 */
	render: function (gl, shaderProgram, controls) {
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

			// Translate away from the camera
			mat4.translate(cursor, cursor, [0, 0, -40]);
			// Apply pitch from camera
			mat4.multiply(cursor, cursor, controls.getPitchRotation());

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
				this.saveCursor();
				debugger;
				// TODO: PROBLEM LINE
				objects[key].render(gl, shaderProgram, cursor, 20000);
				cursor = this.restoreCursor();
			}
		}
		this.setLastTime(now);
	},
	/**
	 * Updates the uniform constants given to WebGL
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param pMatrix The perspective projection matrix
	 * @param cursor The current model-view project matrix
	 */
	updateUniforms: function (gl, shaderProgram, pMatrix, cursor) {
		// Send the projection and model-view matrices to WebGL
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
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
	 * Push a copy of the current model-view projection matrix on the stack
	 */
	saveCursor: function () {
		this.getMvStack().push(mat4.clone(this.getCursor()));
	},
	/**
	 * Pop the latest model-view projection matrix off the stack
	 */
	restoreCursor: function () {
		var mvStack = this.getMvStack();
		if (mvStack.length === 0) {
			throw "mvStack empty";
		}
		var cursor = mvStack.pop();
		this.setCursor(cursor);
		return cursor;
	}
});
