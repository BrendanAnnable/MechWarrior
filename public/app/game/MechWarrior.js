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
		'MW.game.character.Player',
		'MW.util.Color',
		'MW.game.projectile.Missile'
	],
	player: null,
	renderer: null,
	camera: null,
	/**
	 * Constructor called after the HTML5 canvas has been rendered.
	 *
	 * @param canvas the HTML5 canvas
	 */
	constructor: function (canvas) {
		// Initialize the scene and the keyboard and mouse controls
		var level = Ext.create('MW.game.level.Level', {
			name: 'Level 1',
			width: 200,
			height: 200,
			depth: 50
		});

		var keyboardControls = Ext.create('MW.control.Keyboard', {
			element: document,
			speed: 0.5
		});

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
				var playerAsset = assetManager.getAsset('player');
				var player = Ext.create('MW.game.character.Player', {
					name: playerAsset.name,
					geometry: playerAsset.geometry,
					material: playerAsset.material
				});
				this.camera.setTarget(player);                              // set the target of the camera to the player
				level.addPlayer(player);                                    // add the player to the level
				keyboardControls.on('space', player.jump, player);          // listen for space key events
				mouseControls.on('click', level.addProjectile, level, {     // listen for mouse click events
					player: player,
					camera: this.camera
				});
				this.player = player;                                       // assign the player to the private variable
				this.tick(level, keyboardControls, mouseControls);          // start the animation loop
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
	 * Animation tick, uses requestAnimationFrame to run as fast as possible.
	 *
	 * @param scene The scene to draw objects in
	 * @param keyboardControls
	 * @param mouseControls
	 */
	tick: function (scene, keyboardControls, mouseControls) {
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

		// render the scene from the given camera
		this.renderer.render(scene, this.camera);

		// request to render the next frame
		requestAnimationFrame(Ext.bind(this.tick, this, [scene, keyboardControls, mouseControls]));
	}
});