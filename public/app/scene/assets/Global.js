/**
 * @author Monica Olejniczak
 */
Ext.define('MW.scene.assets.Global', {
	alias: 'GlobalAssets',
	extend: 'MW.scene.assets.Assets',
	/**
	 * Loads the models and other assets required for the game to begin.
	 *
	 * @param assetManager The asset manager to add assets to.
	 * @returns {*}
	 */
	load: function (assetManager) {
		return Promise.all([

        //load models
            this.loadModelAsset(this.getModelPath('mech.json')).then(function (player) {
			    assetManager.addAsset('player', player); // addAsset(key,Asset)
                player.name = 'player';
                player.material.getColor().setR(0);
                player.material.getColor().setG(1);
                player.material.getColor().setB(0);
		    }),
		    this.loadModelAsset(this.getModelPath('bullet.json')).then(function (bullet) {
			    assetManager.addAsset('bullet', bullet);
                bullet.name = 'bullet';
                bullet.geometry.scale(vec3.fromValues(5, 5, 5));
		    }),

            this.loadModelAsset(this.getModelPath('face.json')).then(function (face) {
                assetManager.addAsset('face', face);
                face.name = 'face';
                face.geometry.scale([0.05, 0.05, 0.05]);
				face.geometry.translate([0, 2, 0]);
				face.geometry.rotateY(Math.PI);
            }),

//            this.loadModelAsset(this.getModelPath('destroyedCar.json')).then(function (face) {
//                assetManager.addAsset('destroyedCar', destroyedCar);
//                destroyedCar.name = 'destroyedCar';
//                destroyedCar.geometry.scale([0.05, 0.05, 0.05]);
//                destroyedCar.geometry.translate([0, 2, 0]);
//                destroyedCar.geometry.rotateY(Math.PI);
//            }),

        // load sounds
	        this.loadSoundAsset(this.getSoundPath('bullet.mp3')).then(function (sound) {
		        assetManager.addAsset('bulletSound', sound);
	        })

        ]);
	},

	/**
	 * Loads a model asset and returns it as a promise once it has finished loading.
	 *
	 * @param url The path of the model to load.
	 * @returns {Promise}
	 */
	loadModelAsset: function (url) {
		return new Promise(function (resolve) {
			Ext.create('FourJS.loader.Model').load(url).then(function (geometry) {
				resolve ({
					name: 'name',
					geometry: geometry,
					material: Ext.create('FourJS.material.Phong', {
						color: Ext.create('FourJS.util.Color', {
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
