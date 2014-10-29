/**
 * @author Brendan Annable
 */
Ext.define('MW.level.Feature', {
	alias: 'Feature',
	extend: 'FourJS.object.Object',
	// TODO: move car creation from Genesis to here
	mixins: {
		physics: 'PhysJS.DynamicObject'
	},
	constructor: function (config) {
		this.callParent(arguments);
		this.mixins.physics.constructor.call(this, config);
		this.setDynamic(false);
	}
});

