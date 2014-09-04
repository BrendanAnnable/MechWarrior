/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.Floor', {
	alias: 'Floor',
	extend: 'MW.object.Mesh',
	/**
	 * Creates a plane mesh to represent the floor in the scene.
	 *
	 * @param gl The WebGL context
	 * @param width the width of the floor
	 * @param height the height of the floor
	 */
	constructor: function (gl, width, height) {
		this.callParent(arguments);
		// create the plane geometry and rotate it so that it is horizontal to the ground
		var geometry = Ext.create('MW.geometry.PlaneGeometry', {
			width: width,
			height: height
		});
		geometry.rotateX(Math.PI * 0.5);
		// create the mesh containing the geometry
		var texture = Ext.create('MW.loader.Texture', gl, "/resources/image/floor.png");
		this.setName('floor');
		this.setGeometry(geometry);
		this.setTexture(texture);
	}
});