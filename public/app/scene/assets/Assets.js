/**
 * @author Monica Olejniczak
 */
Ext.define('MW.scene.assets.Assets', {
	alias: 'Assets',
	/**
	 * Retrieves the full model path for an asset.
	 *
	 * @param url The name of the model file
	 * @returns {*}
	 */
	getModelPath: function (url) {
		return Ext.String.format("{0}/scene/model/{1}", Ext.Loader.getPath('MW'), url);
	},
	/**
	 * Retrieves the full sound path for an asset.
	 *
	 * @param url The name of the sound file
	 * @returns {*}
	 */
	getSoundPath: function (url) {
		return Ext.String.format("/resources/sound/{1}", Ext.Loader.getPath('MW'), url);
	}
});
