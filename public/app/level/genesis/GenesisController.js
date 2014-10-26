/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 * @author Julius Sky
 * @author Andrew Dabson
 */
Ext.define('MW.level.genesis.GenesisController', {
	extend: 'MW.level.LevelController',
	requires: [
		'FourJS.util.math.HermiteSpline',
		'FourJS.util.helpers.HermiteSplineHelper',
		'FourJS.geometry.CubeGeometry',
		'MW.level.city.Building',
		'MW.level.city.Crate',
		'MW.level.city.Wall',
		'MW.level.city.Car'
	],
	feature: null,
	renderPlayerBoundingBox: false,
	splineHelper: null,
	constructor: function (config) {
		this.callParent(arguments);
		var assetManager = this.getAssetManager();                  // get the asset manager
		var player = this.createPlayer(true);                       // create an active player

		var face = this.loadFace(assetManager, player, 8000);           // create the face model
		var anotherface = this.loadFace(assetManager, player, 4000);           // create the face model

		this.getLevel().addObstacle(face);                              // add the face as an obstacle to the level
		this.getLevel().addObstacle(anotherface);                       // add the face as an obstacle to the level

		var sphere = this.loadSphere(assetManager);           // create the face model
		this.getLevel().addObstacle(sphere);                          // add the face as an obstacle to the level

		this.feature = this.loadFeature(assetManager);
		this.getLevel().addObstacle(this.feature);

		this.addCities(assetManager);

		// creates a third person camera to the level with the player as the target
		this.createThirdPersonCamera(player, true);
		// add mouse event to the controller
		this.addMouseClickEvent(this.getMouseControls(), assetManager, this.getWeaponManager(), player);

		this.addGUI();

	},
	addGUI: function () {
		// add a hacky gui slider
		var levelFolder = GUI.addFolder("Level");
		var level = this.getLevel();
		var settings = {
			playerBoxes: false,
			obstacleBoxes: false,
			splinePointsHelper: false,
			splineLerpHelper: false
		};

		levelFolder.add(settings, 'playerBoxes').onChange(Ext.bind(function (value) {
			this.showPlayerVisualBoundingBoxes(value);
		}, this));

		levelFolder.add(settings, 'obstacleBoxes').onChange(Ext.bind(function (value) {
			level.showObstacleVisualBoundingBoxes(value);
		}, this));

		levelFolder.add(settings, 'splinePointsHelper').onChange(Ext.bind(function (value) {
			this.splineHelper.pointBoxes.setVisible(value);
		}, this));

		levelFolder.add(settings, 'splineLerpHelper').onChange(Ext.bind(function (value) {
			this.splineHelper.lerpBoxes.setVisible(value);
		}, this));

		var player = this.getActivePlayer();
		//var material = player.getChild("Robot_Body").getChildren()[0].getMaterial();
		var material = player.getChild("charactermodel").getChildren()[0].getMaterial();
		var f = GUI.addFolder("Robot");
		material.setReflectivity(0.4);
		f.add(material, '_reflectivity', 0, 1).step(0.01);
		f.add(material, '_wireframe');
		f.add(material, '_useLighting');
	},
	addCities: function (assetManager) {
		var simpleCity = [];
		simpleCity = simpleCity.concat(this.createBuildings());              // create the buildings
		simpleCity = simpleCity.concat(this.createCrates(assetManager));     // create the crates
		simpleCity = simpleCity.concat(this.createWalls());                  // create the walls

		var car1 = this.loadCar(assetManager, -4, 0, -50, 0);
		simpleCity.push(car1);
		var car2 = this.loadCar(assetManager, 4, 0, -30, 0);
		simpleCity.push(car2);
		var car3 = this.loadCar(assetManager, -4, 0, 30, 0);
		simpleCity.push(car3);
		var car4 = this.loadCar(assetManager, 4, 0, 50, 0);
		simpleCity.push(car4);


		for (var i = 0; i < simpleCity.length; i++) {
			this.getLevel().addObstacle(simpleCity[i]);
		}

		// init 78, 81 oneandhalf street, 84 double street, 87, doubleandhalf, 90 triple
		var blocksize = 87;
		// the root orientation of all the cityblocks
		var genx = -blocksize / 2;
		// this is currently set to avoid z-fighting with the default plane - ideally this should be set to zero, and the default plane deleted
		var geny = 0;
		// the root oreintation of all cityblocks
		var genz = -blocksize / 2;
		//the following code will generate a bunch of [worldsize] x [worldsize] cityblocks, where each block is ~75x75m (includes a 6meter wide road and 1.5m wide sidewalk)
		var nocityblocks = 2;
		// if the scaling changes on cityblock, the positioning will also need to change when it's being generated

		var largeCityblock = Ext.create('FourJS.object.Object');
		for (var i = 0; i < nocityblocks; i++) {
			for(var j = 0; j < nocityblocks; j++) {
				var cityblock = this.loadCityBlock(assetManager);
				cityblock.translate(genx + blocksize * i, geny, genz + blocksize * j);
				largeCityblock.addChild(cityblock);
			}
		}
		this.getLevel().addObstacle(largeCityblock);
	},
	createBuildings: function () {
		// create the buildings array
		var buildings = [];
		// set the common properties
		var x = 100;
		var y = 0;
		var z = 100;
		var width = 50;
		var height = 500;
		var depth = 50;
		// create the buildings
		buildings.push(this.loadBuilding(x, y, z, width, height, depth));
		buildings.push(this.loadBuilding(x, y, -z, width, height, depth));
		buildings.push(this.loadBuilding(-x, y, z, width, height, depth));
		buildings.push(this.loadBuilding(-x, y, -z, width, height, depth));
		return buildings;
	},
	loadBuilding: function (x, y, z, width, height, depth) {
		var building = Ext.create('MW.level.city.Building', {
			name: 'building',
			url: 'resources/image/city/building.png',
			width: width,
			height: height,
			depth: depth
		});
		building.translate(x, y, z);
		return building;
	},
	createCrates: function (assetManager) {
		// create the crates array
		var crates = [];
		// set the common properties
		var y = 0;
		var width = 2;
		var height = 2;
		var depth = 2;
		// create the crates
		crates.push(this.loadCrate(30, y, 5, width, height, depth));
		crates.push(this.loadCrate(10, y, -5, width, height, depth));
		crates.push(this.loadCrate(5, y, -30, width, height, depth));
		crates.push(this.loadCrate(-5, y, 10, width, height, depth));
		crates.push(this.loadCrate(-30, y, -5, width, height, depth));
		crates.push(this.loadCrate(-10, y, 5, width, height, depth));
		return crates;
	},
	loadCrate: function (x, y, z, width, height, depth) {
		var crate = Ext.create('MW.level.city.Crate', {
			name: 'crate',
			url: 'resources/image/city/crate.png',
			width: width,
			height: height,
			depth: depth
		});
		crate.translate(x, y, z);
		return crate;
	},
	createWalls: function () {
		// create the walls array
		var walls = [];
		// set the common properties
		var translate = 150;
		var y = 0;
		var width = 500;
		var height = 50;
		var depth = 5;
		// create the walls
		walls.push(this.loadWall(translate, y, 0, width, height, depth, -Math.PI / 2));    // east wall
		walls.push(this.loadWall(-translate, y, 0, width, height, depth, Math.PI / 2));    // west wall
		walls.push(this.loadWall(0, y, translate, width, height, depth, -Math.PI));        // south wall
		walls.push(this.loadWall(0, y, -translate, width, height, depth, Math.PI));        // north wall
		return walls;
	},
	loadWall: function (x, y, z, width, height, depth, orientation) {
		var wall = Ext.create('MW.level.city.Wall', {
			name: 'wall',
			url: 'resources/image/city/wall.png',
			width: width,
			height: height,
			depth: depth
		});
		wall.translate(x, y, z);
		wall.rotateY(orientation);
		return wall;
	},
	loadSphere: function (assetManager) {
		var sphere = assetManager.getAsset('sphere');
		sphere.translate(0, 15, 0);
		sphere.scale(3, 3, 3);
		sphere.getAllChildren()[1].getMaterial().setReflectivity(1);
		return sphere;
	},
	loadHouse: function (assetManager) {
		var house = assetManager.getAsset('house');
		house.translate(0, 50, 0);
		return house;
	},
	loadFeature: function (assetManager) {
		var feature = assetManager.getAsset('feature');
//      feature.getChild("Ring_Ring_Ring").getChildren()[0].getMaterial().setReflectivity(0.5);
//      feature.getChild("Sphere_Sphere_Sphere").getChildren()[0].getMaterial().setReflectivity(0.5);
		feature.getChild("Ring").getChildren()[0].getMaterial().setReflectivity(0.7); // TODO: hack
		return feature;
	},
	loadCityBlock: function (assetManager) {
		var cityblock = assetManager.getAsset('cityblock');
		return cityblock;
	},
	loadFace: function (assetManager, player, period) {
		var face = assetManager.getAsset('face');
		var spline = Ext.create('FourJS.util.math.HermiteSpline', {
			points: [
				vec3.fromValues(5, 20, -5),
				vec3.fromValues(5, 20, 5),
				vec3.fromValues(-5, 15, 5),
				vec3.fromValues(-5, 15, -5),
				vec3.fromValues(-5, 20, -5),
				vec3.fromValues(-5, 20, 5),
				vec3.fromValues(5, 15, 5),
				vec3.fromValues(5, 15, -5)
			],
			loop: true
		});

		// TODO: unhack
		this.splineHelper = Ext.create('FourJS.util.helpers.HermiteSplineHelper');
		this.splineHelper.setSpline(spline);
		this.splineHelper.pointBoxes.setVisible(false);
		this.splineHelper.lerpBoxes.setVisible(false);
		this.getLevel().addObstacle(this.splineHelper);

		// TODO: I hacked this in for now, need moving to a generic place
		face.getPosition = function () {
			var position = this._position;
//            var period = 7000;
			var time = (Date.now() / period) % 1;

			var up = vec3.fromValues(0, 1, 0);
			var eye = spline.getPoint(time);
			var center = player.getTranslation();
			center = vec3.negate(vec3.create(), center);
			vec3.add(center, center, vec3.fromValues(0, 2, 0));

			// this is a hack until I rotate the face geometry
			vec3.rotateY(center, center, vec3.create(), Math.PI);

			var transform = mat4.lookAt(mat4.create(), eye, center, up);
			mat4.invert(transform, transform);

			mat4.copy(position, transform);

			return position;
		};
		return face;
	},
	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	randomIntegerInRange: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	loadCar: function (assetManager, xLocation, yLocation, zLocation, rotation) {
		var carAsset = assetManager.getAsset('car');
		var car = Ext.create('MW.level.city.Car', {
			name: name || carAsset.getName()
		});
		car.addChild(carAsset);
		car.translate(xLocation, yLocation, zLocation);
		car.rotateY(rotation);
		return car;
	},
	loadCube: function (assetManager, xLocation,yLocation, zLocation, length, height, width) {
		var crate = assetManager.getAsset('cube');
		FourJS.geometry.Geometry.scaleAll(crate, [length, height, width]);
		crate.translate(xLocation,yLocation,zLocation);
		return crate;

	}
});
