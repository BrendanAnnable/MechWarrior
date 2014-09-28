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
        var face = this.createFace(assetManager, player);           // create the face model
        this.getLevel().addObstacle(face);                          // add the face as an obstacle to the level

        // creates a third person camera to the level with the player as the target
        this.createThirdPersonCamera(player, true);
        // add mouse event to the controller
        this.addMouseClickEvent(this.getMouseControls(), assetManager, this.getWeaponManager(), player);
    },
    createFace: function (assetManager, player) {
        var faceAsset = assetManager.getAsset('face');
        var spline = Ext.create('FourJS.util.math.HermiteSpline', {
            points: [
                vec3.fromValues(0, 0, -3),
                vec3.fromValues(3, 2, 0),
                vec3.fromValues(0, 0, 3),
                vec3.fromValues(-3, 2, 0),
                vec3.fromValues(0, 0, -3)
            ],
            loop: true
        });
        var face = Ext.create('FourJS.object.Mesh', {
            name: faceAsset.name,
            geometry: faceAsset.geometry,
            material: faceAsset.material
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
