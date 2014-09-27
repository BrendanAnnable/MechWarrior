/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.MechWarrior', {
	alias: 'MechWarrior',
	requires: [
		'FourJS.renderer.WebGLRenderer',
		'FourJS.camera.ThirdPersonCamera',
		'FourJS.util.Color',
		'FourJS.util.Scene',
		'FourJS.util.manager.Asset',
		'FourJS.control.Mouse',
		'FourJS.light.DirectionalLight',
		'PhysJS.PhysicsEngine',
		'MW.control.Keyboard',
		'MW.scene.assets.Global',
		'MW.manager.Level',
		'MW.level.genesis.Genesis',
		'MW.character.Player',
		'MW.projectile.Missile',
	],
	renderer: null,
	camera: null,
    config: {
        canvas: null,
		sound: true
    },
	/**
	 * Constructor called after the HTML5 canvas has been rendered.
	 */
	constructor: function (config) {
        this.initConfig(config);
        var keyboardControls = Ext.create('MW.control.Keyboard', {	    // initialise the keyboard controls
			element: document,
			speed: 0.5
		});
        var canvas = this.getCanvas();									// retrieve the HTML5 canvas element
		var mouseControls = Ext.create('FourJS.control.Mouse', {		// initialise the mouse controls
			element: canvas
//			minPitch: Math.PI / 16
		});
		// Setup WebGL
		var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		var backgroundColor = Ext.create('FourJS.util.Color', {r: 0, g: 0, b: 0, a: 1});
//		gl = WebGLDebugUtils.makeDebugContext(gl);
		this.renderer = Ext.create('FourJS.renderer.WebGLRenderer', {
			gl: gl,
			width: canvas.width,
			height: canvas.height,
			backgroundColor: backgroundColor
		}).on('loaded', function () {
			soundManager.setup({
				url: "/resources/sound/" // where to locate sound files
			});
            // create the asset manager and load all the assets for the game
            var assetManager = Ext.create('FourJS.util.manager.Asset');
            var weaponManager = Ext.create('MW.manager.Weapon');
			Ext.create('MW.scene.assets.Global').load(assetManager).bind(this).then(function () {
				keyboardControls.on('n', function (event) {
					this.setSound(!this.getSound());
				}, this);
                // initialises the level manager
                var levelManager = Ext.create('MW.manager.Level', {
                    mouseControls: mouseControls,
                    keyboardControls: keyboardControls,
                    assetManager: assetManager,
                    weaponManager: weaponManager
                });
                var name = 'Genesis';											// set the name of the first level
                var level = Ext.create('MW.level.genesis.Genesis', {		    // create the genesis level
                    name: name,
                    width: 200,
                    height: 200,
                    depth: 200
                });
                levelManager.addScene(name, level);								// add the level to the manager
                levelManager.setActiveScene(level);								// set the active scene to the level
				this.update(levelManager, keyboardControls, mouseControls); // start the animation loop
			});
		}, this);
	},
	onResize: function (width, height) {
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
		// get the active scene from the manager
		var scene = sceneManager.getActiveScene();
        var sceneController = sceneManager.getController(scene.getName());
        sceneController.update();
		// render the scene from the given camera
		this.renderer.render(scene, scene.getActiveCamera());
		// request to render the next frame
		requestAnimationFrame(Ext.bind(this.update, this, [sceneManager, keyboardControls, mouseControls]));
	}
});