/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.LevelController', {
    alias: 'LevelController',
    requires: [
        'PhysJS.PhysicsEngine',
        'MW.character.Player'
    ],
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
        var assetManager = this.getAssetManager();                  // get the asset manager
        var weaponManager = this.getWeaponManager();                // get the weapon manager
        this.setupManagers(assetManager, weaponManager);            // ensure the managers are created
        this.physics = Ext.create('PhysJS.PhysicsEngine', {	        // initialise the physics engine for the level
            scene: level
        });
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
     * Creates a player using the asset manager.
     *
     * @param active Whether the player will be set to active or not.
     * @returns {MW.character.Player}
     */
    createPlayer: function (active) {
        var playerAsset = this.getAssetManager().getAsset('player');
        var player = Ext.create('MW.character.Player', {
            name: playerAsset.name,
            geometry: playerAsset.geometry,
            material: playerAsset.material
        });
        this.addPlayer(this.getLevel(), player);    // add the player to the level
        if (active) {
            this.setActivePlayer(player);           // set the active player
        }
        return player;
    },
    /**
     * Creates a third person camera and adds it to the controller.
     *
     * @param target The target object that the camera follows.
     * @param active Whether the camera will be set to active or not.
     */
    createThirdPersonCamera: function (target, active) {
        var level = this.getLevel();
        var camera = Ext.create('FourJS.camera.ThirdPersonCamera', {
            target: target
        });
        level.addCamera(camera);
        if (active) {
            level.setActiveCamera(camera);
        }
        return camera;
    },
    /**
     * Adds events to the level.
     *
     * @param mouseControls The mouse controls for the game.
     * @param assetManager The asset manager for the game.
     * @param weaponManager The weapon manager for the game.
     * @param player The player within the level.
     */
    addMouseClickEvent: function (mouseControls, assetManager, weaponManager, player) {
        // listen for mouse click and keyboard events
        mouseControls.on('click', weaponManager.createBullet, weaponManager, {
            assetManager: assetManager,
            levelController: this,
            position: player.getPosition()
        });
    },
    /**
     * Adds a player to the specified level.
     *
     * @param level The level to add the player to.
     * @param player The player to add.
     */
    addPlayer: function (level, player) {
        this.getPlayers().push(player);                                 // adds the player to the array
        level.addChild(player);                                         // adds the player to the level
        this.getKeyboardControls().on('jump', player.jump, player);     // adds the player jump event to the player
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
