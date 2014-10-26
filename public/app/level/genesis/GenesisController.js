/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 */
Ext.define('MW.level.genesis.GenesisController', {
    extend: 'MW.level.LevelController',
    requires: [
        'FourJS.util.math.HermiteSpline',
        'FourJS.geometry.CubeGeometry'
    ],
    constructor: function (config) {
        this.callParent(arguments);
        var assetManager = this.getAssetManager();                      // get the asset manager
        var player = this.createPlayer(true);                           // create an active player
		// add a hacky gui slider

        var lev = GUI.addFolder("Level");
        var thisLevel = this.getLevel();
        var thisController = this;

        //TODO: dunno why this doesnt work
//        var playersBoundingBoxController = lev.add(thisController, '_renderPlayersBoundingBoxes');
//        playersBoundingBoxController.onChange(function() {
////            debugger;
////            if(player.getRenderBoundingBox()===false) {
////                player.addBoundingBox();
////            }
////            else if (player.getRenderBoundingBox()===true){
////                player.removeBoundingBox();
//////                player.getBoundingBox().setRenderable(false);
////            }
////            else{}
//            thisController.togglePlayersBoundingBoxesRenderable();
//            console.log(thisController);
//            debugger;
//        });

        var obstaclesBoundingBoxController = lev.add(thisLevel, '_renderObstaclesBoundingBoxes');
        obstaclesBoundingBoxController.onChange(function() {
           thisLevel.toggleObstaclesBoundingBoxesRenderable();
//            console.log(thisLevel);
        });


        //var material = player.getChild("Robot_Body").getChildren()[0].getMaterial();
		var material = player.getChild("charactermodel").getChildren()[0].getMaterial();
		var f = GUI.addFolder("Robot");
		material.setReflectivity(0.4);
		f.add(material, '_reflectivity', 0, 1).step(0.01);
		f.add(material, '_wireframe');
		f.add(material, '_useLighting');
        var face = this.createFace(assetManager, player, 7000);         // create the face model
        var anotherface = this.createFace(assetManager, player, 3000);  // create the face model

        this.getLevel().addObstacle(face);                              // add the face as an obstacle to the level
        this.getLevel().addObstacle(anotherface);                       // add the face as an obstacle to the level

		var sphere = this.createSphere(assetManager);                   // create the face model
		this.getLevel().addObstacle(sphere);                            // add the face as an obstacle to the level

		this.addCities(assetManager);

        // creates a third person camera to the level with the player as the target
        this.createThirdPersonCamera(player, true);
        // add mouse event to the controller
        this.addMouseClickEvent(this.getMouseControls(), assetManager, this.getWeaponManager(), player);
    },
	addCities: function (assetManager) {
		var simpleCity = [];

        //load buildings
//		var building1 = this.loadBuilding(assetManager, 0, 0, 30, 5, 50,5);
//		simpleCity.push(building1);

        var building2 = this.loadBuilding(assetManager, 100,0, 100, 2, 5, 2);
        simpleCity.push(building2);

		var building3 = this.loadBuilding(assetManager, -100,0, 100, 2, 5, 2);
		simpleCity.push(building3);

        var building4 = this.loadBuilding(assetManager, 100,0, -100, 2, 5, 2);
        simpleCity.push(building4);
        var building5 = this.loadBuilding(assetManager, -100,0, -100, 2, 5, 2);
        simpleCity.push(building5);

        // load crates
        var crate1 = this.loadCrate(assetManager, 30,0, -30, 1, 1,1);
        simpleCity.push(crate1);

        var crate2 = this.loadCrate(assetManager, 40,0, -30, 1, 1,1);
        simpleCity.push(crate2);

        var crate3 = this.loadCrate(assetManager, 30,0, -40, 1, 1,1);
        simpleCity.push(crate3);

        var crate0 = this.loadCrate(assetManager, 0,0, 10, 1, 1,1);
        simpleCity.push(crate0);
        var crate01 = this.loadCrate(assetManager, 0,0, 5, 1, 1,1);
        simpleCity.push(crate01);
//        var testCrate = this.createCrate(true);                       // create an active player


        // load walls
        var eastWall = this.loadWall(assetManager, 150,0,150,20,1, Math.PI/2,1);
        simpleCity.push(eastWall);

        var westWall = this.loadWall(assetManager, -150,0,150,20,1,Math.PI/2,1);
        simpleCity.push(westWall);

        var southWall = this.loadWall(assetManager, 0,150,150,20,1, Math.PI,1);
        simpleCity.push(southWall);

        var northWall = this.loadWall(assetManager, 0,-150,150,20,1, Math.PI,1);
        simpleCity.push(northWall);

        var car1 = this.createCar(assetManager, -50, 0, 0);
        simpleCity.push(car1);
        var car2 = this.createCar(assetManager, -50, 0, 10);
        simpleCity.push(car2);
        var car3 = this.createCar(assetManager, -50, 0, 20);
        simpleCity.push(car3);
        var car4 = this.createCar(assetManager, -50, 0, 30);
        simpleCity.push(car4);
        var car5 = this.createCar(assetManager, -50, 0, 40);
        simpleCity.push(car5);


        for (var i = 0; i < simpleCity.length; i++) {

			this.getLevel().addObstacle(simpleCity[i]);

		}

//       var build= Ext.create('MW.level.City.Building', {
//
////            xCoord: 10,
////            zCoord:10
//
//        });
//
//        this.getLevel().addObstacle(build);
//


        //var house = this.createHouse(assetManager);               // the folowing code adds a house to the scene
        //this.getLevel().addObstacle(house);                       // good as a reference

        var genx = 0; //the root orientation of all the cityblocks
        var geny = 0.01; //this is currently set to avoid z-fighting with the default plane - ideally this should be set to zero, and the default plane deleted
        var genz = 0; //the root oreintation of all cityblocks
        var nocityblocks=2; //the following code will generate a bunch of [worldsize] x [worldsize] cityblocks, where each block is ~75x75m (includes a 6meter wide road and 1.5m wide sidewalk)
        var blocksize=78; //if the scaling changes on cityblock, the positioning will also need to change when it's being generated

        var cityblock = [];
        for (var i = 0; i < nocityblocks; i++) {
            cityblock[i] = [];
            for(var j = 0; j < nocityblocks; j++) {
                cityblock[i][j] = this.createCityBlock(assetManager);
                cityblock[i][j].translate(genx + blocksize * i, geny, genz + blocksize * j);
                this.getLevel().addObstacle(cityblock[i][j]);
            }
        }

        var cb1 = this.createCityBlock(assetManager);
        cb1.translate(-20, 0.1, -50);
        this.getLevel().addObstacle(cb1);

        /*                                                //no support for multiple objects yet :(
         var cb2 = this.createCityBlock(assetManager);
         cb2.translate(-20, 20, -20);
         this.getLevel().addObstacle(cb2);
         */
    },

	createSphere: function (assetManager) {
		var sphere = assetManager.getAsset('sphere');
		sphere.translate(10, -3, 0);
		sphere.scale(3, 3, 3);
		sphere.getAllChildren()[1].getMaterial().setReflectivity(1);
		return sphere;
	},
    createHouse: function (assetManager) {
        var house = assetManager.getAsset('house');
        house.translate(0, 50, 0);
        return house;
    },
    createCityBlock: function (assetManager) {
        var ret = assetManager.getAsset('cityblock');
        //cityblock.translate(0, 10, 0);
        return ret;
    },
    createFace: function (assetManager, player, period) {
        var face = assetManager.getAsset('face');
        var spline = Ext.create('FourJS.util.math.HermiteSpline', {
            points: [
                vec3.fromValues(0, 2, -3),
                vec3.fromValues(3, 4, 0),
                vec3.fromValues(0, 2, 3),
                vec3.fromValues(-3, 4, 0),
                vec3.fromValues(0, 2, -3)
            ],
            loop: true
        });
        // TODO: I hacked this in for now, need moving to a generic place
        face.getPosition = function () {
            var position = this._position;
//            var period = 7000;
            var time = (Date.now() / period) % 1;

            var up = vec3.fromValues(0, 1, 0);
            var eye = spline.getPoint(time);
            vec3.add(eye, eye, player.getTranslation());
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

    createCar: function (assetManager, xLocation,yLocation, zLocation) {
        var carAsset = assetManager.getAsset('car');
        var car = Ext.create('MW.level.City.Car', {
            name: name || carAsset.getName()
        });
        car.addChild(carAsset);
        car.setPosition(mat4.create());
        car.translate(xLocation,yLocation,zLocation);
        car.rotateY(-Math.PI / 2);
        return car;
    },

    loadBuilding: function (assetManager, xLocation, yLocation, zLocation, length, height, width) {
        var buildingAsset = assetManager.getAsset('building');
        var building = Ext.create('MW.level.City.Building', {
            name: name || buildingAsset.getName()
        });
        building.addChild(buildingAsset);
        building.setPosition(mat4.create());
        FourJS.geometry.Geometry.scaleAll(building, [length, height, width]);

//        building.scale(length, height, width);
        building.translate(xLocation,yLocation,zLocation);
//        building.addBoundingBox();

        return building;

    },
    loadCrate: function (assetManager, xLocation,yLocation, zLocation, length, height, width) {
        var crateAsset = assetManager.getAsset('crate');
        var crate = Ext.create('MW.level.City.Crate', {
            name: name || crateAsset.getName()
        });
        crate.addChild(crateAsset);
        crate.setPosition(mat4.create());
        crate.scale(length, height, width);
        crate.translate(xLocation,yLocation,zLocation);
//        crate.addBoundingBox();
        return crate;

    },

    loadWall: function (assetManager, xLocation, zLocation, length, height, width, orientation, scaleMethod) {
        var wallAsset = assetManager.getAsset('wall');
        var wall = Ext.create('MW.level.City.Wall', {
            name: name || wallAsset.getName()
        });

        wall.addChild(wallAsset);
        wall.setPosition(mat4.create());

        wall.translate(xLocation,0,zLocation);
        wall.rotateY(orientation);

        if (scaleMethod == 0) {

        FourJS.geometry.Geometry.scaleAll(wall, [length, height, width]);
        }
        else {
            wall.scale(length, height, width);
        }
//        wall.addBoundingBox();
        return wall;
    },

    loadCube: function (assetManager, xLocation,yLocation, zLocation, length, height, width) {
        var crate = assetManager.getAsset('cube');
        FourJS.geometry.Geometry.scaleAll(crate, [length, height, width]);
        crate.translate(xLocation,yLocation,zLocation);
        return crate;

    }



});
