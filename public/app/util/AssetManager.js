/**
 * @author Monica Olejniczak
 */
Ext.define('MW.util.AssetManager', {
	alias: 'AssetManager',
	//singleton: true,
	assets: null,
	constructor: function () {
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
	 * @returns {*}
	 */
	getAsset: function (key) {
		return this.assets[key];
	}
});