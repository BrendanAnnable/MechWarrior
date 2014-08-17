/**
 * @author Brendan Annable
 */
Ext.define('MW.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
		'MW.view.ViewportController'
	],
	controller: 'ViewportController',
	layout: 'border',
	items: [{
		xtype: 'container',
		layout: 'fit',
		region: 'center',
		autoEl: 'canvas',
		reference: 'canvas',
		listeners: {
			resize: 'onResize',
			afterrender: 'onAfterRender'
		}
	}]
});
