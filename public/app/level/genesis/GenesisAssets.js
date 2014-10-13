/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.genesis.GenesisAssets', {
	/**
	 * Loads the models and other assets required for the genesis level to begin.
	 *
	 * @param assetManager The asset manager to add assets to.
	 * @returns {*}
	 */
	load: function (assetManager) {
		return Promise.all([
			this.loadPlayerAsset(this.getModelPath('tower.json')).then(function (tower) {
				assetManager.addAsset('tower', tower);
			})
		]);
	}
});
