/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.genesis.GenesisController', {
    extend: 'MW.level.LevelController',
    requires: [
        'FourJS.util.math.HermiteSpline'
    ],
    constructor: function (config) {
        this.callParent(arguments);
        var assetManager = this.getAssetManager();                  // get the asset manager
        var player = this.createPlayer(true);                       // create an active player
		// add a hacky gui slider
		var material = player.getChild("Robot_Body").getChildren()[0].getMaterial();
		var f = GUI.addFolder("Robot");
		material.setReflectivity(0.4);
		f.add(material, '_reflectivity', 0, 1).step(0.01);
		f.add(material, '_wireframe');
		f.add(material, '_useLighting');
        var face = this.createFace(assetManager, player);           // create the face model
        this.getLevel().addObstacle(face);                          // add the face as an obstacle to the level

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
    }
});
