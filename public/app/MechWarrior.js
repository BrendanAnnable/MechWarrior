/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.MechWarrior', {
	alias: 'MechWarrior',
	requires: [
		'FourJS.renderer.WebGLRenderer',
		'FourJS.util.Color',
		'FourJS.util.Scene',
        'FourJS.control.Mouse',
		'FourJS.util.manager.Asset',
        'MW.control.Keyboard',
		'MW.scene.assets.Global',
		'MW.manager.Weapon',
		'MW.manager.Level'
	],
	renderer: null,
	camera: null,
	mouseControls: null,
	keyboardControls: null,
	stats: null,
    config: {
        canvas: null,
	    menu: null,
		defaultLevel: 'Genesis'
    },
	/**
	 * Constructor called after the HTML5 canvas has been rendered.
	 */
	constructor: function (config) {
		this.initConfig(config);
		this.setup();
	},
    /**
     * Sets up the WebGL renderer, mouse and keyboard controls.
     */
	setup: function () {
		var canvas = this.getCanvas();									// retrieve the HTML5 canvas element
		var stats = this.stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.bottom = '0px';
		document.body.appendChild(stats.domElement);
		var menu = this.getMenu();                                      // get the menu component
        this.keyboardControls = Ext.create('MW.control.Keyboard', {	    // initialise the keyboard controls
			element: document,
			speed: 0.5
		});
		this.mouseControls = Ext.create('FourJS.control.Mouse', {		// initialise the mouse controls
			element: menu.getEl().dom
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
		}).on('loaded', Ext.bind(this.onLoaded, this, [menu]), this);
	},
    /**
     * An event fired when the WebGL renderer has finished loading.
     *
     * @param menu The menu for the game.
     */
	onLoaded: function (menu) {
		// create the asset manager and load all the assets for the game
		var assetManager = Ext.create('FourJS.util.manager.Asset');
		// create the audio manager
		var audioManager = Ext.create('MW.manager.Audio', {
			keyboardControls: this.keyboardControls
		});
		var radar = this.getMenu().getRadar().getController();
		radar.addCircle('something');
		Ext.create('MW.scene.assets.Global').load(assetManager).bind(this).then(function () {
			// initialises the level manager
			var levelManager = Ext.create('MW.manager.Level', {
                menu: menu,
				mouseControls: this.mouseControls,
				keyboardControls: this.keyboardControls,
				assetManager: assetManager,
				audioManager: audioManager
			});
			levelManager.loadLevel(this.getDefaultLevel());
			this.update(levelManager, this.keyboardControls, this.mouseControls); // start the animation loop
		});
	},
    /**
     * The method called when the viewport gets resized by the user.
     *
     * @param width The new window width.
     * @param height The new window height.
     */
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
		this.stats.begin();
		// get the active scene from the manager
		var scene = sceneManager.getActiveScene();
        var sceneController = sceneManager.getController(scene.getName());
        sceneController.update();
		// render the scene from the given camera
		this.renderer.render(scene, scene.getActiveCamera());
		// request to render the next frame
		this.stats.end();
		requestAnimationFrame(Ext.bind(this.update, this, [sceneManager, keyboardControls, mouseControls]));
	}
});