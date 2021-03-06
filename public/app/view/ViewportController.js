/**
 * @author Brendan Annable
 */
Ext.define('MW.view.ViewportController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ViewportController',
    requires: [
        'MW.MechWarrior'
    ],
	game: null,
	config: {
		canvas: null,   // The HTML canvas used for drawing on
		menu: null      // The menu including the HUD
	},
	/**
	 * Callback that is run after the DOM has been rendered.
	 *
	 * @param container The container that has been rendered
	 */
	onAfterRender: function (container) {
		var canvas = container.getEl().dom;
		var menu = this.lookupReference('menu');
		this.setCanvas(canvas);
		this.gui = window.GUI = new dat.GUI();
		this.game = Ext.create('MW.MechWarrior', {
            canvas: canvas,
			menu: menu
        });
	},
	/**
	 * Callback that is run when the window is resized
	 *
	 * @param container The container object that was resized
	 * @param width The new width of the container
	 * @param height The new height of the container
	 */
	onResize: function (container, width, height) {
		var canvas = this.getCanvas();
		canvas.width = width;
		canvas.height = height;
		this.game.onResize(width, height);
	}
});

