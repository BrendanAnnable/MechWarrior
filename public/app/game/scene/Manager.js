/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.scene.Manager', {
	alias: 'SceneManager',
	extend: 'MW.util.AssetManager',
	requires: [
		'MW.game.level.genesis.Genesis'
	],
	config: {
		activeScene: null
	},
	constructor: function (config) {
		this.callParent(arguments);
		// create the first level // todo make user select one?
		var name = 'Genesis';
		var scene = Ext.create('MW.game.level.genesis.Genesis', {
			name: name,
			width: 200,
			height: 200,
			depth: 50
		});
		this.addAsset(name, scene);		// add the scene to the assets in the manager
		this.setActiveScene(scene);		// set the current scene to the one that was just created
	},
	/**
	 * Loads a specified scene.
	 *
	 * @param scene The scene to load
	 */
	loadScene: function (scene) {

	}
});
