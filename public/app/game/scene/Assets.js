/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.scene.Assets', {
	alias: 'Assets',
	/**
	 * Loads the models and other assets required for the game to begin.
	 *
	 * @param assetManager The asset manager to add assets to.
	 * @param thisArg
	 * @returns {*}
	 */
	load: function (assetManager, thisArg) {
		function getPath (modelName) {
			return Ext.String.format("{0}/game/scene/model/{1}", Ext.Loader.getPath('MW'), modelName);
		}
		var assets = [];
		assets.push(this.loadPlayerAsset(getPath('mech.json')).then(function (player) {
			assetManager.addAsset('player', player);
		}));
		assets.push(this.loadPlayerAsset(getPath('mech.json')).then(function (player) {
			assetManager.addAsset('player2', player);
		}));
		return Promise.all(assets).bind(thisArg);
	},
	/**
	 * Loads the player model and returns it as a promise once it has finished loading.
	 *
	 * @param url The path of the player model to load.
	 * @returns {Promise}
	 */
	loadPlayerAsset: function (url) {
		return new Promise(function (resolve) {
			Ext.create('MW.loader.Model').load(url).then(function (geometry) {
				resolve ({
					name: 'Player',
					geometry: geometry,
					material: Ext.create('MW.material.Phong', {
						color: Ext.create('MW.util.Color', {
							r: 0,
							g: 1,
							b: 0
						})
					})
				});
			});
		}).bind(this);
	}
});
