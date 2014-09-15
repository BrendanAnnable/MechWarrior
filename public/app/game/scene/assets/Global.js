/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.scene.assets.Global', {
	alias: 'GlobalAssets',
	extend: 'MW.game.scene.assets.Assets',
	/**
	 * Loads the models and other assets required for the game to begin.
	 *
	 * @param assetManager The asset manager to add assets to.
	 * @returns {*}
	 */
	load: function (assetManager) {
		return Promise.all([
            this.loadPlayerAsset(this.getModelPath('mech.json')).then(function (player) {
			    assetManager.addAsset('player', player);
		    }),
		    this.loadBulletAsset(this.getModelPath('bullet.json')).then(function (bullet) {
			    assetManager.addAsset('bullet', bullet);
                bullet.geometry.scale(vec3.fromValues(5, 5, 5));
                bullet.geometry.rotateY(Math.PI);
		    }),
	        this.loadSoundAsset(this.getSoundPath('bullet.mp3')).then(function (sound) {
		        assetManager.addAsset('bulletSound', sound);
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
    },
	/**
	 * Loads a sound asset for the game.
	 *
	 * @param url The url to load the sound from
	 * @returns {Promise}
	 */
	loadSoundAsset: function (url) {
		return Promise.resolve(soundManager.createSound({
			url: url,
			multiShot: true
		}));
	}
});