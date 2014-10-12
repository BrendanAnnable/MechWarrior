/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.genesis.GenesisController', {
    extend: 'MW.level.LevelController',
    requires: [
        'FourJS.util.math.HermiteSpline',
        'FourJS.geometry.CubeGeometry'
    ],
    constructor: function (config) {
        this.callParent(arguments);
        var assetManager = this.getAssetManager();                  // get the asset manager
        var player = this.createPlayer(true);                       // create an active player
		// add a hacky gui slider
		var material = player.getChild("Robot_Body").getChildren()[0].getMaterial();
		var f = GUI.addFolder("Robot");
		f.add(material, '_reflectivity', 0, 1).step(0.01);
		f.add(material, '_wireframe');
		f.add(material, '_useLighting');
        var face = this.createFace(assetManager, player);           // create the face model
        this.getLevel().addObstacle(face);                          // add the face as an obstacle to the level

        var simpleCity = this.loadSimpleCity(assetManager);

      for(var object in simpleCity)this.getLevel().addObstacle(object);

//      this.getLevel().addObstacle(simpleCity)

//      var building = this.loadBuilding(assetManager, xLocation, yLocation);
//      this.getLevel().addObstacle(building);                          // add the cube as an obstacle to the level


        var player2 = this.createPlayer(false, 'player2');         // create a test player
//		mat4.rotateX(player2.getPosition(), player2.getPosition(), Math.PI/4);
        player2.translate(0, 0, -20);
        // creates a third person camera to the level with the player as the target
        this.createThirdPersonCamera(player, true);
        // add mouse event to the controller
        this.addMouseClickEvent(this.getMouseControls(), assetManager, this.getWeaponManager(), player);
    },
    createFace: function (assetManager, player) {
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
            var period = 7000;
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


    // SimpleCity
//    loadSimpleCity: function(assetManager, xCoord, zCoord){
   loadSimpleCity: function(assetManager){

       var cityObjects = [];

    // road length
        var roadWidth = 6;


        // central park
        var centralPark = this.loadBuilding(assetManager,0,0,100,100,900);
        cityObjects.push(centralPark);


       // north-west park
        //this.loadPark()
        var nwPark = this.loadBuilding(assetManager,56,-56,100,100,900);
       cityObjects.push(nwPark);

        // north-east park
        //this.loadPark()
        var nePark = this.loadBuilding(assetManager,-56,-56,100,100,900);
        cityObjects.push(nePark);

        //south-east park
        //this.loadPark()
        var sePark = this.loadBuilding(assetManager,56,-56,100,100,900);
       cityObjects.push(sePark);

        // south-west park
        //this.loadPark()
        var swPark = this.loadBuilding(assetManager,56,56,100,100,900);
       cityObjects.push(swPark);



        // building sector

        ///////////////
        //           //
        //   x xxx   //
        //   x xxx   //
        //   x x x   //
        //           //
        ///////////////

        // North Sector

        // building size limits
        // 3(building size)+2(roadLength)=100
        var smallBuildingSize = 100-(2*roadWidth);
        var mediumBuildingSize = 2*smallBuildingSize+roadWidth;


        // small 1
        var smallZOne = 56+smallBuildingSize*0.5;
        var smallXOne = 50-smallBuildingSize*0.5;
        var smallOne = this.loadBuilding(assetManager,smallZOne,smallXOne,smallBuildingSize,smallBuildingSize,100);
       cityObjects.push(smallOne);


       // small 2
        var smallZTwo = smallZOne+smallBuildingSize+roadWidth;
        var smallXTwo = smallXOne;
        var smallTwo = this.loadBuilding(assetManager,smallZTwo,smallXTwo,smallBuildingSize,smallBuildingSize,100);
       cityObjects.push(smallTwo);


       // small 3
        var smallZThree = smallZTwo+smallBuildingSize+roadWidth;
        var smallXThree = smallXOne;
        var smallThree = this.loadBuilding(assetManager,smallZThree,smallXThree,smallBuildingSize,smallBuildingSize,100);
       cityObjects.push(smallThree);


        // small 4
        var smallZFour = smallZOne;
        var smallXFour = smallXOne+smallBuildingSize+roadWidth;
        var smallFour = this.loadBuilding(assetManager,smallZFour,smallXFour,smallBuildingSize,smallBuildingSize,100);
       cityObjects.push(smallFour);


       // small 5
        var smallZFive = smallZOne;
        var smallXFive = smallXOne+smallBuildingSize+roadWidth;
        var smallFive = this.loadBuilding(assetManager,smallZFive,smallXFive,smallBuildingSize,smallBuildingSize,100);
       cityObjects.push(smallFive);



       //medium
        var mediumZ = -smallBuildingSize+2*roadWidth+0.5*mediumBuildingSize;
        var mediumX = -0.5*mediumBuildingSize;
        var medium = this.loadBuilding(assetManager,mediumZ,mediumX,smallBuildingSize,smallBuildingSize,400);
       cityObjects.push(medium);





       // South Sector
        // East Sector
        // West Sector



        return cityObjects;
    },


//    // a straight street is a row of buildings that begins at bottom left corner at (xPos, yPos) on an angle theta
//    loadStraightStreet: function(assetManager, xPos, yPos, theta, streetWidth, streetLength){
//
//        var sidewalkWidth = 2;
//
//        var minBuildingLength = 10+3;
//        var maxBuildingLength = 150;
//
////        var minBuildingWidth = 10;
////        var maxBuildingWidth = 150;
//
//        var buildingWidth = streetWidth - 2*sidewalkWidth;
//
//        var minBuildingHeight = 10;
//        var maxBuildingHeight = 1000;
//
//        var minBuildingsOnStreet = streetLength / maxBuildingLength;
//        var maxBuildingsOnStreet = streetLength / minBuildingLength;
//
//        //  while(maxBuildingsOnStreet*minBuildingLength+)
//
//
//        // this hasn't taken into account sidewalks
//
//        var numBuildings = randomIntegerInRange(minBuildingsOnStreet, maxBuildingsOnStreet);
//
//            var totalSidewalkWidth = 2*numBuildings+2;
//
//    },




    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    randomIntegerInRange: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    loadBuilding: function (assetManager, xLocation, zLocation, length, width, height) {
        var building = assetManager.getAsset('cube');
        FourJS.geometry.Geometry.scaleAll(building, [length, width, height]);
        building.translate(xLocation,0,zLocation);
        return building;

    }


//    createBuilding: function(){
//        var building = Ext.create('MW.level.City.Building');
//        return building;
//    }


});
