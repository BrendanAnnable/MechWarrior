/**
 * @author Brendan Annable
 */
Ext.define('MW.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.Fit',
		'MW.view.ViewportController',
        'MW.display.Display'
	],
	controller: 'ViewportController',
	layout: 'border',
	items: [{
		xtype: 'Display',
        reference: 'menu'
	},  {
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
