/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.level.Skybox', {
	alias: 'Skybox',
	extend: 'MW.object.Mesh',
    requires: [
        'MW.geometry.CubeGeometry',
        'MW.loader.CubeMap'
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
		var material = Ext.create('MW.material.Phong', {
			environmentMap: Ext.create('MW.loader.CubeMap', {
				upUrl: "/resources/image/skybox/urban/up.png",
				rightUrl: "/resources/image/skybox/urban/right.png",
				downUrl: "/resources/image/skybox/urban/down.png",
				leftUrl: "/resources/image/skybox/urban/left.png",
				frontUrl: "/resources/image/skybox/urban/front.png",
				backUrl: "/resources/image/skybox/urban/back.png"
			}),
			useLighting: false
		});
		/*// create and load the texture from the specified source
		var material = Ext.create('MW.material.Phong', {
            texture: Ext.create('MW.loader.Texture', {
                url: "/resources/image/texture.png"
            }),
            useLighting: false
        });*/
		// create the mesh with the newly created geometry and material
		this.setGeometry(geometry);
		this.setMaterial(material);
	}
});