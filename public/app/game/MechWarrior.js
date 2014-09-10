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
            width: 2000,
            height: 2000,
            depth: 2000
        });

		var keyboardControls = Ext.create('MW.control.Keyboard', {
			element: document,
			speed: 2
		});

		var mouseControls = Ext.create('MW.control.Mouse', {
			element: canvas,
			minPitch: Math.PI / 16
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
		this.renderer = Ext.create('MW.renderer.WebGLRenderer', {
            gl: gl,
            width: canvas.width,
            height: canvas.height,
            backgroundColor: backgroundColor
		}).on('loaded', function () {
            //gl = WebGLDebugUtils.makeDebugContext(gl);
            // load the player model and add it to the scene
            var player = Ext.create('MW.game.character.Player');
            this.camera.setTarget(player);
            player.load('face.json', function () {
                // add the player to the level
	            // listen for space key events
	            // listen for mouse click events
	            level.addPlayer(player);
				keyboardControls.on('space', this.jump, this, player);
	            mouseControls.on('click', this.addProjectile, this, {
		            level: level,
		            player: player,
		            camera: this.camera
	            });
                // Start the animation loop
                this.tick(level, keyboardControls, mouseControls);
            }, this);
            this.player = player;
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
		this.camera.setRotation(mat4.clone(mouseControls.getPosition()));
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
	},
	/**
	 * Adds velocity to the specified player when the user presses the space bar.
	 *
	 * @param player The player that jumped
	 */
	jump: function (player) {
		var velocity = player.getVelocity();
		velocity[1] = 200;
	},
	/**
	 * Adds a projectile to the scene when the user clicks the left mouse button.
	 *
	 * @param mouseControl The mouse controls that were yielded at the time of the event fire
	 * @param options The level to add the projectile to, the player that fired the projectile and the camera
	 */
	addProjectile: function (mouseControl, options) {
		var level = options.level;
		var player = options.player;
		var distance = options.camera.getDistance();
		level.addProjectile(Ext.create('MW.game.projectile.Missile', {
			width: 1,
			height: 1,
			depth: 1,
			initialVelocity: 50,
			position: mat4.translate(mat4.create(), player.getPosition(), vec3.fromValues(5, 10, 0)),
			pitch: mouseControl.getPitch()
		}));
	}
});