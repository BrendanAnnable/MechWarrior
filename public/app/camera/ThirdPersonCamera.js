/**
 * @autbor Brendan Annable
 */
Ext.define('MW.camera.ThirdPersonCamera', {
	alias: 'ThirdPersonCamera',
	extend: 'MW.camera.PerspectiveCamera',
	position: null,
	config: {
		target: null,
		distance: 70
	},
	constructor: function () {
		this.callParent(arguments);
		this.position = mat4.create();
	},
	getPosition: function () {
		var position = this.position;
		mat4.identity(position);
		var target = this.getTarget();
		mat4.translate(position, position, [0, 0, -this.getDistance()]);
		mat4.multiply(position, position, target.getPosition());
		return position;
	}
});
