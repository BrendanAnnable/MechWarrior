Ext.define('MW.mixin.DynamicObject', {
	alias: 'DynamicObject',
	acceleration: null,
	lastTime: 0,
	config: {
		mass: 1,
		force: null,
		velocity: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.setForce(vec3.fromValues(0, -9.8, 0));
		this.setVelocity(vec3.create());
		this.acceleration = vec3.create();
		this.lastTime = Date.now();
	},
	getDynamicPosition: function () {
		var position = this._position;
		var force = this.getForce();
		var mass = this.getMass();
		var velocity = this.getVelocity();
		var acceleration = this.acceleration;

		var now = Date.now();
		var time = (now - this.lastTime) / 1000;

		var lastAcceleration = vec3.clone(acceleration);

		var a = vec3.create();
		vec3.scale(a, lastAcceleration, (time * time) / 2);

		var b = vec3.create();
		vec3.scale(b, velocity, time);

		vec3.add(a, a, b);
		mat4.translate(position, position, a);

		// collision detection hack - don't let the vertical position go below 0
		if (position[13] <= 0) {
			position[13] = 0;
		}

		vec3.scale(acceleration, force, mass);

		var avg = vec3.create();
		vec3.add(avg, lastAcceleration, acceleration);
		vec3.scale(avg, avg, 1 / 2);

		var c = vec3.create();
		vec3.scale(c, avg, time);
		vec3.add(velocity, velocity, c);

		this.lastTime = now;

		return position;
	}
});