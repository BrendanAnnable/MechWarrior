/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.LevelController', {
    alias: 'LevelController',
    requires: [
        'PhysJS.PhysicsEngine',
        'MW.character.Player'
    ],
    face: null,
    physics: null,
    config: {
        level: null,
        activePlayer: null,
        players: null,
        projectiles: null,
        keyboardControls: null,
        mouseControls: null,
        assetManager: null,
        weaponManager: null
    },
    constructor: function (config) {
        this.initConfig(config);
        this.setPlayers([]);                                        // set the players to an empty array
        this.setProjectiles([]);                                    // set the projectiles to an empty array
        var level = this.getLevel();                                // retrieve the level
        var keyboardControls = this.getKeyboardControls();          // get the keyboard controls
        var mouseControls = this.getMouseControls();                // get the mouse controls
        var assetManager = this.getAssetManager();                  // get the asset manager
        var weaponManager = this.getWeaponManager();                // get the weapon manager
        this.setupManagers(assetManager, weaponManager);            // ensure the managers are created
        var player = this.createPlayer(assetManager);               // create the player model and add it to the scene
        var camera = Ext.create('FourJS.camera.ThirdPersonCamera', {
            target: player
        });
        level.addCamera(camera);
        level.setActiveCamera(camera);
        this.addPlayer(level, player);                              // add the player to the level
        this.face = this.createFace(assetManager, player);          // create a face model
        level.addObstacle(this.face);                               // add the face to the level obstacles
        this.setActivePlayer(player);                               // set the active player
        this.physics = Ext.create('PhysJS.PhysicsEngine', {	        // initialise the physics engine for the level
            scene: level
        });
        // add mouse and keyboard events to the controller
        this.addEvents(mouseControls, keyboardControls, assetManager, weaponManager, level, player);
    },
    /**
     * Creates the managers if they have not been passed in correctly.
     *
     * @param assetManager The asset manager of the game.
     * @param weaponManager The weapon manager of the game.
     */
    setupManagers: function (assetManager, weaponManager) {
        if (assetManager === null || assetManager === undefined) {
            this.setAssetManager(Ext.create('FourJS.util.manager.Asset'));
        }
        if (weaponManager === null || weaponManager === undefined) {
            this.setWeaponManager(Ext.create('MW.manager.Weapon'));
        }
    },
    /**
     * Adds events to the level.
     *
     * @param mouseControls The mouse controls for the game.
     * @param keyboardControls The keyboard controls for the game.
     * @param assetManager The asset manager for the game.
     * @param weaponManager The weapon manager for the game.
     * @param level The level being controlled.
     * @param player The player within the level.
     */
    addEvents: function (mouseControls, keyboardControls, assetManager, weaponManager, level, player) {
        // listen for mouse click and keyboard events
        mouseControls.on('click', weaponManager.createBullet, weaponManager, {
            assetManager: assetManager,
            levelController: this,
            position: player.getPosition()
        });
        keyboardControls.on('jump', player.jump, player);
    },
    /**
     * Adds a player to the specified level.
     *
     * @param level The level to add the player to.
     * @param player The player to add.
     */
    addPlayer: function (level, player) {
        this.getPlayers().push(player);
        level.addChild(player);
    },
    /**
     * Removes a player from the specified level.
     *
     * @param level The level to remove the player from.
     * @param player The player to remove
     */
    removePlayer: function (level, player) {
        Ext.Array.remove(this.getPlayers(), player);
        level.removeChild(player);
    },
    /**
     * Adds a projectile to the level when the user clicks the left mouse button.
     *
     * @param projectile The projectile to be added to the level.
     */
    addProjectile: function (projectile) {
        this.getProjectiles().push(projectile);
        this.getLevel().addChild(projectile);
        projectile.on('collision', function () {
            this.removeProjectile(projectile);
        }, this);
    },
    /**
     * Removes a projectile from the level.
     *
     * @param projectile The projectile to remove
     */
    removeProjectile: function (projectile) {
        Ext.Array.remove(this.getProjectiles(), projectile);
        this.getLevel().removeChild(projectile);
    },
    /**
     * Creates a player using the asset manager.
     *
     * @param assetManager The asset manager that loads in the models and other assets.
     * @returns {MW.character.Player}
     */
    createPlayer: function (assetManager) {
        var playerAsset = assetManager.getAsset('player');
        return Ext.create('MW.character.Player', {
            name: playerAsset.name,
            geometry: playerAsset.geometry,
            material: playerAsset.material
        });
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
    },
    /**
     * Updates the level on each render.
     */
    update: function () {
        var level = this.getLevel();
        var camera = level.getActiveCamera();
        var keyboardControls = this.getKeyboardControls();
        var mouseControls = this.getMouseControls();
        var player = this.getActivePlayer();
        // rotate camera around target
        camera.setPitch(mouseControls.getPitch());
        camera.setYaw(mouseControls.getYaw());
        var position = player.getPosition();
        // rotate player to face camera
        mat4.copyRotation(position, mat4.createRotateY(mouseControls.getYaw()));
        // move player according to keyboard input
        mat4.translate(position, position, keyboardControls.getTranslation());
        // run the physics engine update
        this.physics.update();
        // keep skybox at constant distance from player (pretty sure there is a better way than this?)
        mat4.copyTranslation(level.getSkybox().getPosition(), camera.getPosition());
    }

});
