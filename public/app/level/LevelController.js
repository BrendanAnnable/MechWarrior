/**
 * @author Monica Olejniczak
 */
Ext.define('MW.level.LevelController', {
    alias: 'LevelController',
    requires: [
        'PhysJS.PhysicsEngine',
        'MW.character.Player',
		'FourJS.camera.PerspectiveCamera',
		'FourJS.camera.ThirdPersonCamera'
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
        this.setupManagers();                                       // setup the manager configs
        this.physics = Ext.create('PhysJS.PhysicsEngine', {	        // initialise the physics engine for the level
            scene: this.getLevel()
        });
        this.physics.on({
            collision: this.onCollision,
            scope: this
        });
        this.getLevel().setActiveCamera(Ext.create('FourJS.camera.PerspectiveCamera'));
    },
    /**
     * Creates the managers if they have not been passed in correctly.
     */
    setupManagers: function () {
        var assetManager = this.getAssetManager();
        var weaponManager = this.getWeaponManager();
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
     * @param [name]
     * @returns {MW.character.Player}
     */
    createPlayer: function (active, name) {
        var playerAsset = this.getAssetManager().getAsset('player');
        var player = Ext.create('MW.character.Player', {
            name: name || playerAsset.getName()
        });
		player.addChild(playerAsset);
		player.addBoundingBox();
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
        this.getPlayers().push(player);     // adds the player to the array
        level.addChild(player);             // adds the player to the level
    },
	/**
	 * Overrides the setter method for active players to handle events properly.
	 *
	 * @param player The player to make active.
	 */
	setActivePlayer: function (player) {
		// todo fix collision of new active player
		var activePlayer = this.getActivePlayer();
		// check if the active player needs to be modified
		if (player !== activePlayer) {
			var keyboardControls = this.getKeyboardControls();
			// check an active player exists
			if (activePlayer !== null) {
				// remove the current active player event listener
				keyboardControls.un('jump', activePlayer.jump, activePlayer);
			}
			// add the jump event to the new active player and set the new active player
			keyboardControls.on('jump', player.jump, player);
			// set a new target on the active camera if it is third person
			var camera = this.getLevel().getActiveCamera();
			if (camera instanceof FourJS.camera.ThirdPersonCamera) {
				camera.setTarget(player);
			}
			this._activePlayer = player;
		}
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
    onCollision: function (object1, object2) {
        //console.log('collision!', object1.getName(), object2.getName());
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
		if (player !== null) {
			var position = player.getPosition();
			mat4.copy(player.getLastPosition(), position);
		}
        if (camera instanceof FourJS.camera.ThirdPersonCamera) {
            // rotate camera around target
            camera.setPitch(mouseControls.getPitch());
            camera.setYaw(mouseControls.getYaw());
            if (player !== null) {
                var position = player.getPosition();
                // rotate player to face camera
                mat4.copyRotation(position, mat4.createRotateY(mouseControls.getYaw()));
				var head = player.getChild("Head");
				if (head !== null) {
					mat4.copyRotation(head.getPosition(), mat4.createRotateX(mouseControls.getPitch()));
				}
            }
        }
        else {
            mat4.copyRotation(camera.getPosition(), mouseControls.getPosition());
        }
        if (player !== null) {
            var position = player.getPosition();
            // move player according to keyboard input
            mat4.translate(position, position, keyboardControls.getTranslation());
        }
        // run the physics engine update
        this.physics.update();
        // keep skybox at constant distance from player (pretty sure there is a better way than this?)
        mat4.copyTranslation(level.getSkybox().getPosition(), camera.getPosition());
    }

});
