/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.game.character.Player', {
	alias: 'Player',
	extend: 'MW.object.Mesh',
	/**
	 * Creates a player for the game by loading a particular mesh.
	 *
	 * @param gl The WebGL context
	 * @param url The url of the model to load
	 * @param callback Callback that is called once the model has been loaded with
	 * the first parameter as the model
	 */
	constructor: function (gl, url, callback) {
		// loads the specified model
		Ext.create('MW.loader.Model', gl, url, callback);
	},
	/**
	 * Renders the player model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	render: function (gl, shaderProgram, cursor, periodNominator) {
		// This animates the face such that is rotates around a point at the given radius,
		// and 'bobs' up and down at the given height with the given periods
		var minRadius = 10;
		var maxRadius = 20;
		var radiusPeriod = 1000;
		var yawPeriod = 8000;
		var pitchPeriod = 2000;
		var height = 5;

		var radius = 0.5 * (maxRadius - minRadius) * (Math.sin(periodNominator / radiusPeriod) + 1) + minRadius;
		var yaw = periodNominator / yawPeriod;
		var pitch = Math.asin(height * Math.sin(periodNominator / pitchPeriod) / radius);

		// Rotate to the direction of where the face will be drawn
		/*mat4.rotateY(cursor, cursor, yaw);
		 mat4.rotateX(cursor, cursor, pitch);
		 // Translate forward to outer radius
		 mat4.translate(cursor, cursor, [0, 0, -radius]);
		 // Rotate back so that the face always 'faces' the camera
		 mat4.rotateX(cursor, cursor, -pitch);
		 mat4.rotateY(cursor, cursor, -yaw);
		 //		mat4.rotateZ(cursor, cursor, -yaw);*/

		this.callParent().render(gl, this, shaderProgram, cursor, periodNominator);
	}
});