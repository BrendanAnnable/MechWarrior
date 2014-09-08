/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Projectile', {
	alias: 'Projectile',
	extend: 'MW.object.Mesh',
	vx: 0,                      // The x component of the initial velocity
	vy: 0,                      // The y component of the initial velocity
	vz: 0,                      // The z component of the initial velocity
	position: null,             // The initial position of the projectile
	direction: null,            // The direction vector of the projectile
	config: {
		target: null,           // The target point derived from the mouse coordinates
		acceleration: null,     // The rate at which the velocity of an object changes over time
		velocity: 0,            // The speed of the projectile
		height: 0,              // The height the projectile was fired from,
		damage: 0,              // The damage the projectile impacts upon collision
		timeSpawned: 0          // The time that the projectile was created
	},
	constructor: function () {
		this.callParent(arguments);
		this.setTimeSpawned(Date.now());                                // set the time that the projectile was created
		this.setAcceleration(vec3.fromValues(0, -9.8, 0));              // set the acceleration as a vector
		var velocity = this.getVelocity();                              // get the velocity of the projectile
		var position = this.config.position;                            // get the position from the config
		var a = this.getTarget();                                       // get the target point for the projectile
		var b = mat4.getTranslationSubMatrix(vec3.create(), position);  // get the translation from the position

		this.vx = velocity * Math.cos(45 * Math.PI / 180);                          // calculate the x component in velocity
		this.vy = velocity * Math.sin(45 * Math.PI / 180);                          // calculate the y component in velocity
		this.vz = 0;//velocity * directionCosineZ;                          // calculate the z component in velocity

		this.position = position;                                       // assign the private position variable
		var direction = vec3.fromValues(-1, 0, -1);
		var angle = Math.atan2(direction[2], direction[0]);
		var rot = mat4.othoNormalInvert(mat4.create(), mat4.createRotateY(angle));
		mat4.multiply(this.position, this.position, rot);
	},
	/**
	 * Override the getPosition accessor method for a projectile object
	 *
	 * @returns {null}
	 */
	getPosition: function () {
		var position = this.position;                                   // retrieve current position of the projectile
		var acceleration = this.getAcceleration();                      // retrieve the acceleration vector
		var time = (Date.now() - this.getTimeSpawned()) * 0.0001;       // get the time passed in seconds // todo fix speed
		var x = this.getXComponent(time);                               // get the x component of the projectile
		var y = this.getYComponent(time, acceleration[1]);              // get the y component of the projectile
		var z = this.getZComponent(time);                               // get the z component of the projectile
		mat4.translate(position, position, vec3.fromValues(x, y, z));   // translate the position based on the components
		return position;                                                // return the new position
	},
	/**
	 * Calculates and returns the x component of the projectile at time t.
	 *
	 * @param t The time to retrieve the x component at
	 * @returns {number}
	 */
	getXComponent: function (t) {
		return this.vx * t;
	},
	/**
	 * Calculates and returns the y component of the projectile at time t.
	 *
	 * @param t The time to retrieve the x component at
	 * @param g The acceleration the projectile is under
	 * @returns {number}
	 */
	getYComponent: function (t, g) {
		debugger;
		return this.vy * t + 0.5 * g * t * t;
	},
	/**
	 * Calculates and returns the z component of the projectile at time t.
	 *
	 * @param t The time to retrieve the x component at
	 * @returns {number}
	 */
	getZComponent: function (t) {
		return -this.vz * t;
	},
	/**
	 * This function returns the range of the projectile. Using Range = (v^2 * sin2(x)) / g, we also get:
	 *
	 *    Range = sin2(x) = 2 * sin(x) * cos(x)
	 *          = vx * T
	 *
	 * @param v0 The initial velocity vector of the projectile
	 * @param g The rate at which the velocity of an object changes over time
	 * @param theta The angle the projectile is taking
	 * @returns {number}
	 */
	getRange: function (v0, g, theta) {
	},
	/**
	 * This function returns the time of flight. Using t = (2 * v * sin(x)) / g, we also get t = sqrt(2 * h / g)
	 *
	 * @param acceleration The rate at which the velocity of an object changes over time
	 * @param velocity The speed of the projectile
	 * @param theta The angle the projectile is taking
	 * @param height The height the projectile was fired from
	 * @returns {number}
	 */
	timeOfFlight: function (acceleration, velocity, theta, height) {
	},
	/**
	 * This function calculates and returns the maximum height of the projectile.
	 *
	 * @param v0 The initial velocity vector of the projectile
	 * @param g The rate at which the velocity of an object changes over time
	 * @returns {h|*}
	 */
	maximum: function (v0, g) {
	}
});
