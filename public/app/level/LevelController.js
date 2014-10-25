/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 */
Ext.define('MW.level.LevelController', {
    alias: 'LevelController',
    requires: [
        'PhysJS.PhysicsEngine',
        'MW.character.Player',
		'MW.game.MultiPlayer',
		'FourJS.camera.PerspectiveCamera',
		'FourJS.camera.ThirdPersonCamera'
	],
    physics: null,
	mp: null,
    config: {
        level: null,
        activePlayer: null,
        players: null,
        projectiles: null,
        keyboardControls: null,
        mouseControls: null,
        assetManager: null,
        weaponManager: null,
        renderPlayersBoundingBoxes: false
    },
    constructor: function (config) {
        this.initConfig(config);
        this.setPlayers({});                                        // set the players to an empty array
        this.setProjectiles([]);                                    // set the projectiles to an empty array
        this.setupManagers();                                       // setup the manager configs
        this.physics = Ext.create('PhysJS.PhysicsEngine', {	        // initialise the physics engine for the level
            scene: this.getLevel()
        });
		this.mp = Ext.create('MW.game.MultiPlayer');
		this.mp.on({
			gameState: this.onGameState,
			playerConnect: this.onPlayerConnect,
			playerDisconnect: this.onPlayerDisconnect,
			playerUpdate: this.onPlayerUpdate,
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
	onGameState: function (message) {
		this.reset();
		var activePlayer = message.player;
		var statePlayers = message.players;
		for (var i = 0; i < statePlayers.length; i++) {
			var statePlayer = statePlayers[i];
			if (statePlayer.id !== activePlayer.id) {
				this.createPlayer(false, statePlayer.name);
			}
		}
	},
	onPlayerConnect: function (message) {
		var player = this.createPlayer(false, message.player.name);
	},
	onPlayerDisconnect: function (message) {
		var player = this.getPlayer(message.player.name);
		this.removePlayer(this.getLevel(), player);
	},
	onPlayerUpdate: function (message) {
		var player = this.getPlayer(message.player.name);
		if (player !== null) {
			mat4.copy(player.getPosition(), message.player.position);
		}
	},
	reset: function () {
		var activePlayer = this.getActivePlayer();
		var level = this.getLevel();
		var players = this.getPlayers();
		Ext.Object.each(players, function (name, player) {
			this.removePlayer(level, player);
		}, this);
		this.addPlayer(level, activePlayer);
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
            name: name || playerAsset.getName(),
        });
		player.addChild(playerAsset);
	    this.addPlayer(this.getLevel(), player);    // add the player to the level
        if (active) {
            this.setActivePlayer(player);           // set the active player
        }
//        player.addBoundingBox();
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
        this.getPlayers()[player.getName()] = player;     // adds the player to the array
        level.addChild(player);             // adds the player to the level
		player.on('collision', function (collidedObject) {
			// TODO: check if collidedObject is a bullet
			// TODO: player.fireEvent('takeDamage', 30);
		});
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
	getPlayer: function (playerName) {
		var players = this.getPlayers();
		return playerName in players ? players[playerName] : null;
	},
    /**
     * Removes a player from the specified level.
     *
     * @param level The level to remove the player from.
     * @param player The player to remove
     */
    removePlayer: function (level, player) {
		if (player !== null) {
			delete this.getPlayers()[player.getName()];
			level.removeChild(player);
		}
    },
    /**
     * Adds a projectile to the level when the user clicks the left mouse button.
     *
     * @param projectile The projectile to be added to the level.
     */
    addProjectile: function (projectile) {
        this.getProjectiles().push(projectile);
        this.getLevel().addChild(projectile);
        projectile.on('collision', function (collidedObject) {
            this.removeProjectile(projectile);
			// TODO: explosion
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
				if (head !== null) {                                                                                    // moves the head
					//mat4.copyRotation(head.getPosition(), mat4.createRotateX(mouseControls.getPitch()));


                    mat4.copyRotation(head.getPosition(), mat4.createRotateY(Date.now() / 360));

                    //var T = 5000; // period in ms
                    //var scal = 1+ Math.abs(Math.sin(2*Date.now()/T ));
                    //mat4.scale(head.getPosition(), mat4.create(), vec3.fromValues(scal, scal, scal)); //mat4.create() makes an identity trix
                        //mat4.scale = function(out, a, v) {

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
		this.mp.update(this.getActivePlayer());
    },

    togglePlayersBoundingBoxesRenderable: function(){

        if (this.renderPlayersBoundingBoxes) {

            for (var i =0; i < this.getPlayers().length; i++) {
                this.getPlayers()[i].removeBoundingBox();
            }

            this.renderPlayersBoundingBoxes = false;
        }
        else{

            for (var i =0; i < this.getPlayers().length; i++) {
                this.getPlayers()[i].addBoundingBox();
            }
            this.renderPlayersBoundingBoxes = true;
        }
    }

});
