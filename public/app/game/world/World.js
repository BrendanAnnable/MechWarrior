/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.World', {
	alias: 'World',
	extend: 'MW.object.Object',
	config: {
		skybox: null,
		floor: null
	},
	/**
	 * Creates the world for the scene by assigning space in the GPU for each model.
	 *
	 * @param gl The WebGL context
	 * @param width the width of the world
	 * @param height the height of the world
	 * @param depth the depth of the world
	 */
	constructor: function (gl, width, height, depth) {
		this.callParent(arguments);
		this.setName('world'); // todo fix
		var floor = Ext.create('MW.game.world.Floor', gl, width, height);
		var skybox = Ext.create('MW.game.world.Skybox', gl, width, height, depth);
		this.setChildren([floor, skybox]);
		this.setSkybox(skybox);
		this.setFloor(floor);
	},
	/**
	 * Renders the objects within the world in the scene.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 * @param periodNominator How often to update animation
	 */
	render: function (gl, shaderProgram, cursor, periodNominator) {
		this.getSkybox().render(gl, shaderProgram, cursor);
		this.getFloor().render(gl, shaderProgram, cursor);
	}
});