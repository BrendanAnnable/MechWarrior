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
        'MW.util.Color'
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
		// Initialize the scene and the mouse controls
        var level = Ext.create('MW.game.level.Level', {
            name: 'Level 1',
            width: 300,
            height: 300,
            depth: 300
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
                level.addPlayer(player);
	            var position = mat4.create();
	            mat4.translate(position, position, vec3.fromValues(-20, 0, 40));
                var projectile = Ext.create('MW.game.projectile.Missile', {
                    width: 1,
                    height: 1,
                    depth: 1,
	                velocity: 10,
	                position: position,
	                target: vec3.fromValues(200, 0, 50)
                });
	            level.addProjectile(projectile);
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

		// render the scene from the given camera
		this.renderer.render(scene, this.camera);

		// request to render the next frame
		requestAnimationFrame(Ext.bind(this.tick, this, [scene, keyboardControls, mouseControls]));
	}
});