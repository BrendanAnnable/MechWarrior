/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.Floor', {
	alias: 'Floor',
	extend: 'MW.object.Object',
	/**
	 * Creates a plane mesh to represent the floor in the scene.
	 *
	 * @param gl The WebGL context
	 * @param width the width of the floor
	 * @param height the height of the floor
	 */
	constructor: function (gl, width, height) {
		this.callParent(arguments);
		this.setName('floor');
		// create the plane geometry and rotate it so that it is horizontal to the ground
		var geometry = Ext.create('MW.geometry.PlaneGeometry', {
			width: width,
			height: height
		});
		geometry.rotateX(Math.PI * 0.5);
		// create the mesh containing the geometry
		var texture = Ext.create('MW.loader.Texture', gl, "/resources/image/floor.png");
		return Ext.create('MW.object.Mesh', {
			geometry: geometry,
			texture: texture
		});
	},
	/**
	 * Renders the floor model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	render: function (gl, shaderProgram, cursor, periodNominator) {
		mat4.translate(cursor, cursor, vec3.fromValues(0, -20, 0));
		this.callParent().render(gl, this, shaderProgram, cursor, periodNominator);
	}
});