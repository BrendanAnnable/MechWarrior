/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.game.MechWarrior', {
	alias: 'MechWarrior',
    requires: [
        'MW.renderer.WebGLRenderer',
        'MW.camera.ThirdPersonCamera',
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
		var controls = Ext.create('MW.control.Mouse', {
			element: canvas,
			minPitch: Math.PI / 6
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
                level.addProjectile(Ext.create('MW.game.projectile.Missile', {
                    width: 5,
                    height: 5,
                    depth: 5
                }));
                // Start the animation loop
                this.tick(level, controls);
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
	 * @param controls The mouse controls
	 */
	tick: function (scene, controls) {

		/*var position = this.player.getPosition();
		var period = 20000;
		var x = 80 * Math.sin(2 * Math.PI * Date.now() / period);
		var translateVector = mat4.translateVector(position);
		translateVector[0] = x;*/

		this.renderer.render(scene, this.camera);
		requestAnimationFrame(Ext.bind(this.tick, this, [scene, controls]));
	}
});