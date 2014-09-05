/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.world.World', {
	alias: 'World',
	extend: 'MW.object.Object',
    requires: [
        'MW.game.world.Floor',
        'MW.game.world.Skybox'
    ],
	config: {
        width: 0,
        height: 0,
        depth: 0,
		skybox: null,
		floor: null
	},
	/**
	 * Creates the world for the scene by assigning space in the GPU for each model.
	 */
	constructor: function () {
        this.callParent(arguments);
        var width = this.getWidth();
        var height = this.getHeight();
        var depth = this.getDepth();
		var floor = Ext.create('MW.game.world.Floor', {
            name: 'floor',
            width: width,
            height: height
        });
        floor.translate(0, -20, 0);
		var skybox = Ext.create('MW.game.world.Skybox', {
            name: 'skybox',
            width: width,
            height: height,
            depth: depth
        });
		this.setChildren([floor, skybox]);
		this.setSkybox(skybox);
		this.setFloor(floor);
	}
});