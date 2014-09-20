/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.game.MechWarrior', {
	alias: 'MechWarrior',
	requires: [
		'MW.renderer.WebGLRenderer',
		'MW.camera.ThirdPersonCamera',
		'MW.util.Scene',
		'MW.util.manager.Asset',
		'MW.control.Mouse',
		'MW.game.control.Keyboard',
		'MW.game.scene.assets.Global',
		'MW.game.manager.Level',
		'MW.game.level.genesis.Genesis',
        'MW.game.physics.PhysicsEngine',
		'MW.game.character.Player',
		'MW.util.Color',
		'MW.game.projectile.Missile'
	],
	player: null,
	renderer: null,
	camera: null,
    physics: null,
    config: {
        canvas: null,
		sound: true
    },
	/**
	 * Constructor called after the HTML5 canvas has been rendered.
	 */
	constructor: function (config) {
        this.initConfig(config);
		var sceneManager = Ext.create('MW.game.manager.Level');			// initialises the scene manager
		var name = 'Genesis';											// set the name of the first level
		var level = Ext.create('MW.game.level.genesis.Genesis', {		// create the genesis level
			name: name,
			width: 200,
			height: 200,
			depth: 50
		});
		sceneManager.addScene(name, level);								// add the level to the manager
		sceneManager.setActiveScene(level);								// set the active scene to the level
        this.physics = Ext.create('MW.game.physics.PhysicsEngine', {	// initialise the physics engine with the level
            scene: level
        });
		var keyboardControls = Ext.create('MW.game.control.Keyboard', {	// initialise the keyboard controls
			element: document,
			speed: 0.5
		});
        var canvas = this.getCanvas();									// retrieve the HTML5 canvas element
		var mouseControls = Ext.create('MW.control.Mouse', {			// initialise the mouse controls
			element: canvas
//			minPitch: Math.PI / 16
		});
		// Setup WebGL
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		this.camera = Ext.create('MW.camera.ThirdPersonCamera', {
			ratio: canvas.width / canvas.height
		});
		var backgroundColor = Ext.create('MW.util.Color', {
			r: 0,
			g: 0,
			b: 0,
			a: 1
		});
//		gl = WebGLDebugUtils.makeDebugContext(gl);
		this.renderer = Ext.create('MW.renderer.WebGLRenderer', {
			gl: gl,
			width: canvas.width,
			height: canvas.height,
			backgroundColor: backgroundColor
		}).on('loaded', function () {
			soundManager.setup({
				url: "/resources/sound/" // where to locate sound files
			});
			// create the asset manager and load all the assets for the game
			var assetManager = Ext.create('MW.util.manager.Asset');
			Ext.create('MW.game.scene.assets.Global').load(assetManager).bind(this).then(function () {
				// create the player model and add it to the scene
				var player = this.createPlayer(assetManager);
				this.camera.setTarget(player);                              // set the target of the camera to the player
				level.addPlayer(player);                                    // add the player to the level
				keyboardControls.on('jump', player.jump, player);          	// listen for space key events
				keyboardControls.on('n', function (event) {
					this.setSound(!this.getSound());
				}, this);
				mouseControls.on('click', this.createBullet, this, {     	// listen for mouse click events
					assetManager: assetManager,
					level: level,
					player: player,
					camera: this.camera
				});
				this.player = player;                                       // assign the player to the private variable
				this.update(sceneManager, keyboardControls, mouseControls); // start the animation loop
			});
		}, this);
	},
	onResize: function (width, height) {
		this.camera.setRatio(width / height);
		this.camera.update();
		this.renderer.setWidth(width);
		this.renderer.setHeight(height);
	},
	/**
	 * Animation update, uses requestAnimationFrame to run as fast as possible.
	 *
	 * @param sceneManager The scene manager that contains the scene to draw objects in
	 * @param keyboardControls
	 * @param mouseControls
	 */
	update: function (sceneManager, keyboardControls, mouseControls) {
		// rotate camera around target
		this.camera.setPitch(mouseControls.getPitch());
		this.camera.setYaw(mouseControls.getYaw());
		var position = this.player.getPosition();
		// rotate player to face camera
		mat4.copyRotation(position, mat4.createRotateY(mouseControls.getYaw()));
		// move player according to keyboard input
		mat4.translate(position, position, keyboardControls.getTranslation());

        // run the physics engine update
        this.physics.update();

		// get the active scene from the manager
		var scene = sceneManager.getActiveScene();
		// keep skybox at constant distance from player (pretty sure there is a better way than this?)
		mat4.copyTranslation(scene.getSkybox().getPosition(), this.camera.getPosition());
		// render the scene from the given camera
		this.renderer.render(scene, this.camera);

		// request to render the next frame
		requestAnimationFrame(Ext.bind(this.update, this, [sceneManager, keyboardControls, mouseControls]));
	},
    /**
     * Creates a player using the asset manager.
     *
     * @param assetManager The asset manager that loads in the models and other assets.
     * @returns {MW.game.character.Player}
     */
    createPlayer: function (assetManager) {
        var playerAsset = assetManager.getAsset('player');
        return Ext.create('MW.game.character.Player', {
            name: playerAsset.name,
            geometry: playerAsset.geometry,
            material: playerAsset.material
        });
	},
    createBullet: function (mouseControls, options) {
        var bullet = options.assetManager.getAsset('bullet');
	    var sound = options.assetManager.getAsset('bulletSound');
        var level = options.level;
        var player = options.player;
        var position = mat4.create();
        mat4.copyTranslation(position, player.getPosition());
        mat4.translate(position, position, vec3.fromValues(0, 2, 0));
        level.addProjectile(Ext.create('MW.game.projectile.Bullet', {
            name: bullet.name,
            geometry: bullet.geometry,
            material: bullet.material,
            initialVelocity: 40,
            mass: 0.5,
            position: position,
            pitch: mouseControls.getPitch() - Math.PI / 2,
            yaw: mouseControls.getYaw() - Math.PI / 2
        }));
		if (this.getSound()) {
			sound.play();
		}
    }
});