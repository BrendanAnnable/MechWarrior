/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.game.character.Player', {
	alias: 'Player',
	extend: 'MW.object.Mesh',
    load: function (url, callback, thisArg) {
        Ext.create('MW.loader.Model').load(url, function (mesh) {
            this.setName(mesh.name);
            this.setGeometry(mesh.geometry);
            callback.call(thisArg);
        }, this);
    }
	/**
	 * Renders the player model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	/*render: function (gl, shaderProgram, cursor, periodNominator) {
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
		mat4.rotateY(cursor, cursor, yaw);
		mat4.rotateX(cursor, cursor, pitch);
		// Translate forward to outer radius
		mat4.translate(cursor, cursor, [0, 0, -radius]);
		// Rotate back so that the face always 'faces' the camera
		mat4.rotateX(cursor, cursor, -pitch);
		mat4.rotateY(cursor, cursor, -yaw);
		//		mat4.rotateZ(cursor, cursor, -yaw);

		this.superclass.render(gl, shaderProgram, cursor);
	}*/
});