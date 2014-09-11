/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Projectile', {
	alias: 'Projectile',
	extend: 'MW.object.Mesh',
	velocity: null,				// The velocity component vector
	position: null,             // The initial position of the projectile
	height: null,               // The height the projectile takes off at
	config: {
		pitch: 25,              // The angle to fire the projectile from
		direction: null,        // The direction vector of the projectile
		target: null,           // The target point derived from the mouse coordinates
		acceleration: null,     // The rate at which the velocity of an object changes over time
		initialVelocity: 0,     // The initial speed of the projectile
		damage: 0,              // The damage the projectile impacts upon collision
		timeSpawned: 0          // The time that the projectile was created
	},
	constructor: function () {
		this.callParent(arguments);
		this.setTimeSpawned(Date.now());                    // set the time that the projectile was created
		var direction = vec3.fromValues(0, 0, -1);			// create a forward direction vector
		this.setDirection(direction);						// set the direction vector config
		this.setAcceleration(vec3.fromValues(0, -9.8, 0));  // set the acceleration as a vector
		var pitch = this.getPitch();            			// gets the angle the projectile is fired from and converts it to radians
		var velocity = this.getInitialVelocity();           // get the velocity of the projectile
		var position = this.config.position;                // get the original position

		var vx = velocity * Math.cos(pitch);               	// calculate the x component in velocity
		var vy = velocity * Math.sin(pitch);               	// calculate the y component in velocity
		var vz = 0;                                        	// calculate the z component in velocity
		this.velocity = vec3.fromValues(vx, vy, vz);		// sets the velocity vector based on the components

		// calculate the firing angle
		// align the axes by changing the basis such that the x-axis is in the direction you're shooting
		// apply the rotation matrix to the position
		// set the new position
		var yaw = Math.atan2(direction[2], direction[0]);
		var rotation = mat4.othoNormalInvert(mat4.create(), mat4.createRotateY(yaw));
		mat4.multiply(position, position, rotation);
		this.position = position;
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

		// translate the position using the translation that calculates each velocity component in x, y, z
		mat4.translate(position, position, this.getTranslation(time, acceleration));
		// return the new position
		return position;
	},
	/**
	 * Returns the translation vector which is calculated using the velocity components.
	 *
	 * @param time The current time since the projectile fired
	 * @param acceleration The acceleration due to gravity
	 * @returns {vec3} The translation vector
	 */
	getTranslation: function (time, acceleration) {
		var translation = vec3.clone(this.velocity);
		vec3.multiply(translation, translation, vec3.fromValues(
			time,                                                      	// get the x component of the projectile
			time,														// get the y component of the projectile
			0                                                           // get the z component of the projectile
		));
		translation[1] += 0.5 * acceleration[1] * time * time;			// apply the y component formula
	    return translation;												// return the translation
	}

});
