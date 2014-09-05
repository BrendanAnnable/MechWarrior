/**
 * @autbor Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('MW.util.Scene', {
	alias: 'Scene',
	extend: 'MW.object.Object',
	config: {
		cursor: null,           // The current model-view project matrix (where to draw)
		pMatrix: null,          // The perspective projection matrix
		playerPosition: null,   // The players current position in the level
		lastTime: 0             // Used by the animate function, to keep track of the time between animation frames
	},
	constructor: function (config) {
		this.callParent(arguments);
		this.setCursor(mat4.create());
		this.setPMatrix(mat4.create());
		this.setPlayerPosition(mat4.create());
	}
});
