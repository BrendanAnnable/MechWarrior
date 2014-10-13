/**
 * @author Brendan Annable
 */
Ext.define('PhysJS.DynamicObject', {
	alias: 'DynamicObject',
	requires: [
		'PhysJS.util.math.BoundingBox'
	],
	mixins: {
        observable: 'Ext.util.Observable'
    },
	isDynamicObject: true,
	config: {
		mass: 1,
		force: null,
		velocity: null,
		acceleration: null,
		dynamic: true,
		gravity: true,
		lastPosition: null,
		renderBoundingBox: false,
		boundingBox: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.mixins.observable.constructor.call(this, config);  // call the observable constructor to initialise the mixin
		if (this.config.force === null) {
			this.setForce(vec3.create());
		}
		if (this.config.velocity === null) {
			this.setVelocity(vec3.create());
		}
		this.setAcceleration(vec3.create());
		this.setLastPosition(mat4.create());
	}
});
