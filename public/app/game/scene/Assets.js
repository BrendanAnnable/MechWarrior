/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.scene.Assets', {
	alias: 'Assets',
	/**
	 * Loads the models and other assets required for the game to begin.
	 *
	 * @param assetManager The asset manager to add assets to.
	 * @returns {*}
	 */
	load: function (assetManager) {
		function getPath (modelName) {
			return Ext.String.format("{0}/game/scene/model/{1}", Ext.Loader.getPath('MW'), modelName);
		}
        return Promise.all([
            this.loadPlayerAsset(getPath('mech.json')).then(function (player) {
			    assetManager.addAsset('player', player);
		    }),
		    this.loadBulletAsset(getPath('bullet.json')).then(function (bullet) {
			    assetManager.addAsset('bullet', bullet);
                bullet.geometry.scale(vec3.fromValues(5, 5, 5));
                bullet.geometry.rotateY(Math.PI);
		    })
        ]);
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
		});
	},
    /**
     * Loads the bullet model and returns it as a promise once it has finished loading.
     *
     * @param url The path of the bullet model to load.
     * @returns {Promise}
     */
    loadBulletAsset: function (url) {
        return new Promise(function (resolve) {
            Ext.create('MW.loader.Model').load(url).then(function (geometry) {
                resolve ({
                    name: 'Bullet',
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
        });
    }
});
