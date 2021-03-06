/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.Skybox', {
	alias: 'Skybox',
	extend: 'FourJS.object.Mesh',
    requires: [
        'FourJS.geometry.CubeGeometry',
        'FourJS.loader.CubeMap'
    ],
    config: {
        width: 0,
        height: 0,
        depth: 0,
        cubeMap: null
    },
	/**
	 * Creates a cube mesh to represent the skybox in the scene.
	 */
	constructor: function (config) {
		this.callParent(arguments);

		// create the cube mesh and negate its normals so the texture can be applied to the interior of the cube
		var geometry = Ext.create('FourJS.geometry.CubeGeometry', {
			width: this.getWidth(),
			height: this.getHeight(),
			depth: this.getDepth()
		});
		geometry.negateNormals();
        var cubeMap = this.getCubeMap();
		var material = Ext.create('FourJS.material.Phong', {
			environmentMap: Ext.create('FourJS.loader.CubeMap', {
				upUrl: cubeMap.upUrl,
				rightUrl: cubeMap.rightUrl,
				downUrl: cubeMap.downUrl,
				leftUrl: cubeMap.leftUrl,
				frontUrl: cubeMap.frontUrl,
				backUrl: cubeMap.backUrl
			}),
			useLighting: false
		});
		/*// create and load the texture from the specified source
		var material = Ext.create('FourJS.material.Phong', {
            texture: Ext.create('FourJS.loader.Texture', {
                url: "/resources/image/texture.png"
            }),
            useLighting: false
        });*/
		// create the mesh with the newly created geometry and material
		this.setGeometry(geometry);
		this.setMaterial(material);
	}
});