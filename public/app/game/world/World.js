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
        floor.translate(0, -20, 0);
		var skybox = Ext.create('MW.game.world.Skybox', gl, width, height, depth);
		this.setChildren([floor, skybox]);
		this.setSkybox(skybox);
		this.setFloor(floor);
	}
});