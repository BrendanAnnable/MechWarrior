/**
 * @author Brendan Annable
 */
Ext.define('MW.mixin.DynamicObject', {
	alias: 'DynamicObject',
    mixins: {
        observable: 'Ext.util.Observable'
    },
    isDynamicObject: true,
	config: {
		mass: 1,
		force: null,
		velocity: null,
        acceleration: null,
        dynamic: true
	},
	constructor: function (config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this, config);  // call the observable constructor to initialise the mixin
		if (this.config.force === null) {
            this.setForce(vec3.fromValues(0, -9.8, 0));
        }
        if (this.config.velocity === null) {
            this.setVelocity(vec3.create());
        }
		this.setAcceleration(vec3.create());
	}
});
