/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.Floor', {
	alias: 'Floor',
	extend: 'MW.object.Mesh',
    requires: [
        'MW.geometry.PlaneGeometry',
        'MW.loader.Texture'
    ],
    config: {
        width: 0,
        height: 0
    },
	/**
	 * Creates a plane mesh to represent the floor in the scene.
	 */
	constructor: function () {
		this.callParent(arguments);
		// create the plane geometry and rotate it so that it is horizontal to the ground
		var geometry = Ext.create('MW.geometry.PlaneGeometry', {
			width: this.getWidth(),
			height: this.getHeight()
		});
		geometry.rotateX(Math.PI * 0.5);
		// create the mesh containing the geometry
		var texture = Ext.create('MW.loader.Texture', {
            url: "/resources/image/metal.jpg"
        });
		this.setGeometry(geometry);
		this.setTexture(texture);
	}
});