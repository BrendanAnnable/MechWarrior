Ext.syncRequire('Ext.app.Application');
Ext.application({
	name: 'MW',
	paths: {
		'MW': '/app'
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

