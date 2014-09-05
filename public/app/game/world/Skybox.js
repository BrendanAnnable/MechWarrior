/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.Skybox', {
	alias: 'Skybox',
	extend: 'MW.object.Mesh',
    requires: [
        'MW.geometry.CubeGeometry',
        'MW.loader.Texture'
    ],
    config: {
        width: 0,
        height: 0,
        depth: 0
    },
	/**
	 * Creates a cube mesh to represent the skybox in the scene.
	 */
	constructor: function (config) {
		this.callParent(arguments);
		// create the cube mesh and negate its normals so the texture can be applied to the interior of the cube
		var geometry = Ext.create('MW.geometry.CubeGeometry', {
			width: this.getWidth(),
			height: this.getHeight(),
			depth: this.getDepth()
		});
		geometry.negateNormals();
		// create and load the texture from the specified source
		var texture = Ext.create('MW.loader.Texture', {
            url: "/resources/image/texture.png"
        });
		// create the mesh with the newly created geometry and texture
		this.setGeometry(geometry);
		this.setTexture(texture);
	}
});