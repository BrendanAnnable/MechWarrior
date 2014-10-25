/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 */
Ext.define('MW.scene.assets.Global', {
	alias: 'GlobalAssets',
	extend: 'MW.scene.assets.Assets',
	requires: [
		'FourJS.geometry.Geometry'
	],
	/**
	 * Loads the models and other assets required for the game to begin.
	 *
	 * @param assetManager The asset manager to add assets to.
	 * @returns {*}
	 */

     //TODO: needs ability to load assets with materials/textures.


	load: function (assetManager) {
		return Promise.all([

        //load models
            this.loadModelAsset(this.getModelPath('mech.json')).then(function (player) {
			    assetManager.addAsset('player', player); // addAsset(key,Asset)
				FourJS.geometry.Geometry.scaleAll(player, [1.5, 1.5, 1.5]);
                player.setName('player');
		    }),
		    this.loadModelAsset(this.getModelPath('bullet.json')).then(function (bullet) {
			    assetManager.addAsset('bullet', bullet);
                bullet.setName('bullet');
				FourJS.geometry.Geometry.scaleAll(bullet, [2, 2, 2]);
		    }),

            this.loadModelAsset(this.getModelPath('face.json')).then(function (face) {
                assetManager.addAsset('face', face);
                face.setName('face');
				FourJS.geometry.Geometry.scaleAll(face, [0.05, 0.05, -0.05]);
            }),
            this.loadModelAsset(this.getModelPath('house.json')).then(function (house) {
                assetManager.addAsset('house', house);
            }),
            this.loadModelAsset(this.getModelPath('cityblock/cityblock.json')).then(function (cityblock) {
                assetManager.addAsset('cityblock', cityblock);
            }),
			this.loadModelAsset(this.getModelPath('textured_car/5car.json')).then(function (car) {
				assetManager.addAsset('car', car);
			}),


			this.loadModelAsset(this.getModelPath('sphere.json')).then(function (sphere) {
				assetManager.addAsset('sphere', sphere);
				sphere.setName('sphere');
			}),

            this.loadModelAsset(this.getModelPath('cube.json')).then(function (cube) {
                assetManager.addAsset('cube', cube);
                cube.setName('cube');
                FourJS.geometry.Geometry.scaleAll(cube, [1, 1, 1]);
                cube.translate(0,1,0);
            }),
            this.loadModelAsset(this.getModelPath('crate/crate.json')).then(function (crate) {
                assetManager.addAsset('crate', crate);
                crate.setName('crate');
                FourJS.geometry.Geometry.scaleAll(crate, [1, 1, 1]);
                crate.translate(0,1,0);
            }),
            this.loadModelAsset(this.getModelPath('cube.json')).then(function (building) {
                assetManager.addAsset('building', building);
                building.setName('building');
                FourJS.geometry.Geometry.scaleAll(building, [1, 1, 1]);
                building.translate(0,1,0);
            }),
            this.loadModelAsset(this.getModelPath('cube.json')).then(function (wall) {
                assetManager.addAsset('wall', wall);
                wall.setName('wall');
                FourJS.geometry.Geometry.scaleAll(wall, [1, 1, 1]);
                wall.translate(0,1,0);
            }),


            this.loadModelAsset(this.getModelPath('car+materialised.json')).then(function (car) {
//            this.loadModelAsset(this.getModelPath('car.json')).then(function (car) {
                assetManager.addAsset('car', car);
                car.setName('car');
                FourJS.geometry.Geometry.scaleAll(car, [2, 2, 2]);
            }),

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
		return Ext.create('FourJS.loader.Model').load(url);
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
