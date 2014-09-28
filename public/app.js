Ext.syncRequire('Ext.app.Application');

Ext.Loader.setConfig({
	disableCaching: false
});

Ext.application({
	name: 'MechWarrior',
	paths: {
		'MW': '/app',
		'FourJS': '/lib/FourJS',
		'PhysJS': '/lib/PhysJS'
	},
	requires: [
		'MW.view.Viewport'
	],
	stores: [
	],
	/**
	 * This method is called when the application boots
	 */
	init: function () {
		window._MW = this;
	},
	/**
	 * This method is called when the page has loaded
	 */
	launch: function () {
		Ext.create('MW.view.Viewport');
	}
});

