/**
 * @author Brendan Annable
 */
Ext.define('MW.view.ViewportController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ViewportController',
	config: {
		canvas: null,       // The HTML canvas used for drawing on
		mechWarrior: null   // The mech warrior game
	},
	/**
	 * Callback that is run when the window is resized
	 *
	 * @param container The container object that was resized
	 * @param width The new width of the container
	 * @param height The new height of the container
	 */
	onResize: function (container, width, height) {
		// Resize the WebGL viewport based on the new size
		var canvas = this.getCanvas();
		var gl = this.getMechWarrior().getGl();
		canvas.width = width;
		canvas.height = height;
		gl.viewportWidth = width;
		gl.viewportHeight = height;
	},
	/**
	 * Callback that is run after the DOM has been rendered.
	 *
	 * @param container The container that has been rendered
	 */
	onAfterRender: function (container) {
		var canvas = container.getEl().dom;
		this.setCanvas(canvas);
		this.setMechWarrior(Ext.create('MW.game.MechWarrior', canvas));
	}
});

