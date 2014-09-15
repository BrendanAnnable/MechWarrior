/**
 * @author Monica Olejniczak
 */
Ext.define('MW.util.manager.Scene', {
	alias: 'SceneManager',
	extend: 'MW.util.manager.Asset',
	config: {
		activeScene: null
	},
	constructor: function (config) {
		this.callParent(arguments);
	},
	/**
	 * Adds a scene to the manager.
	 *
	 * @param key The key to refer to the scene by
	 * @param scene The scene to add.
	 */
	addScene: function (key, scene) {
		this.addAsset(key, scene);
	},
	/**
	 * Loads a specified scene.
	 *
	 * @param key The key of the scene to load
	 */
	loadScene: function (key) {
		var scene = this.getAsset(key);					// get the scene to load
		if (scene === undefined) {						// check if the scene has not been loaded previously
			console.error('The scene does not exist.'); // the scene could not be loaded
		} else {
			this.setActiveScene(scene);					// set the active scene
		}
	}
});
