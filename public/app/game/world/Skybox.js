/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.Skybox', {
	alias: 'Skybox',
	extend: 'Object',
	/**
	 * Creates a cube mesh to represent the skybox in the scene.
	 *
	 * @param gl The WebGL context
	 * @param width the width of the skybox
	 * @param height the height of the skybox
	 * @param depth the depth of the skybox
	 */
	constructor: function (gl, width, height, depth) {
		this.callParent({
			name: 'skybox'
		});
		// create the cube mesh and negate its normals so the texture can be applied to the interior of the cube
		var geometry = Ext.create('MW.geometry.CubeGeometry', {
			width: width,
			height: height,
			depth: depth
		});
		geometry.negateNormals();
		// create and load the texture from the specified source
		var texture = Ext.create('MW.loader.Texture', gl, "/resources/image/texture.png");
		// create the mesh with the newly created geometry and texture
		return Ext.create('MW.object.Mesh', {
			geometry: geometry,
			texture: texture
		});
	},
	/**
	 * Renders the skybox model in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	render: function (gl, shaderProgram, cursor, periodNominator) {
		this.callParent.render(gl, this, shaderProgram, cursor, periodNominator);
	}
});