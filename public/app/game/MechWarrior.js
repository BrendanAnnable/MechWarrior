/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.game.MechWarrior', {
	alias: 'MechWarrior',
	requires: [
		'MW.renderer.WebGLRenderer',
		'MW.camera.ThirdPersonCamera',
		'MW.control.Keyboard',
		'MW.control.Mouse',
		'MW.util.Scene',
		'MW.util.AssetManager',
		'MW.game.scene.Assets',
		'MW.game.level.Level',
        'MW.game.physics.CollisionDetector',
		'MW.game.character.Player',
		'MW.util.Color',
		'MW.game.projectile.Missile'
	],
	player: null,
	renderer: null,
	camera: null,
    physics: null,
    config: {
        canvas: null
    },
	/**
	 * Constructor called after the HTML5 canvas has been rendered.
	 */
	constructor: function (config) {
        this.initConfig(config);
		// initialize the scene and the keyboard and mouse controls
		var level = Ext.create('MW.game.level.Level', {
			name: 'Level 1',
			width: 200,
			height: 200,
			depth: 50
		});
        this.physics = Ext.create('MW.game.physics.CollisionDetector', {
            scene: level
        });
		var keyboardControls = Ext.create('MW.control.Keyboard', {
			element: document,
			speed: 0.5
		});
        var canvas = this.getCanvas();
		var mouseControls = Ext.create('MW.control.Mouse', {
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
			// create the asset manager and load all the assets for the game
			var assetManager = Ext.create('MW.util.AssetManager');
			Ext.create('MW.game.scene.Assets').load(assetManager).bind(this).then(function () {
				// create the player model and add it to the scene
				var player = this.createPlayer(assetManager);
				this.camera.setTarget(player);                              // set the target of the camera to the player
				level.addPlayer(player);                                    // add the player to the level
				keyboardControls.on('space', player.jump, player);          // listen for space key events
				mouseControls.on('click', this.createBullet, this, {     // listen for mouse click events
					assetManager: assetManager,
                    level: level,
                    player: player,
					camera: this.camera
				});
				this.player = player;                                       // assign the player to the private variable
				this.update(level, keyboardControls, mouseControls);        // start the animation loop
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
	 * @param scene The scene to draw objects in
	 * @param keyboardControls
	 * @param mouseControls
	 */
	update: function (scene, keyboardControls, mouseControls) {
		// rotate camera around target
		this.camera.setPitch(mouseControls.getPitch());
		this.camera.setYaw(mouseControls.getYaw());
		var position = this.player.getPosition();
		// rotate player to face camera
		mat4.copyRotation(position, mat4.createRotateY(mouseControls.getYaw()));
		// move player according to keyboard input
		mat4.translate(position, position, keyboardControls.getTranslation());

		// keep skybox at constant distance from player (pretty sure there is a better way than this?)
		mat4.copyTranslation(scene.getSkybox().getPosition(), this.player.getPosition());
        // run the physics engine update
        this.physics.update();
		// render the scene from the given camera
		this.renderer.render(scene, this.camera);

		// request to render the next frame
		requestAnimationFrame(Ext.bind(this.update, this, [scene, keyboardControls, mouseControls]));
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
    }
});