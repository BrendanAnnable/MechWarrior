/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.util.manager.Asset', {
	alias: 'AssetManager',
	requires: [
		'FourJS.object.Object'
	],
	assets: null,
	constructor: function (config) {
        this.initConfig(config);
		this.assets = {};
	},
	/**
	 * Adds an asset to the manager.
	 *
	 * @param key The key that refers to the asset.
	 * @param asset The asset being added to the manager.
	 */
	addAsset: function (key, asset) {
		this.assets[key] = asset;
	},
	/**
	 * Removes an asset from the manager.
	 *
	 * @param key The key that refers to the asset being removed.
	 */
	removeAsset: function (key) {
		delete this.assets[key];
	},
	/**
	 * Retrieves a particular asset from the manager.
	 *
	 * @param key The key that refers to the asset being retrieved.
	 * @param clone Whether to clone the returned asset
	 * @returns {*} The asset
	 */
	getAsset: function (key, clone) {
		var asset = this.assets[key];
		if (asset instanceof FourJS.object.Object && clone !== false) {
			asset = asset.clone();
		}
		return asset;
	}
});
