/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Projectile', {
	alias: 'Projectile',
	extend: 'MW.object.Mesh',
    mixins: {
		observable: 'Ext.util.Observable',
        physics: 'MW.mixin.DynamicObject'
    },
	config: {
		pitch: 25,              // The angle to fire the projectile from
        yaw: 0,
		initialVelocity: 0,     // The initial speed of the projectile
		damage: 0,              // The damage the projectile impacts upon collision
		timeSpawned: 0          // The time that the projectile was created
	},
	constructor: function (config) {
		this.callParent(arguments);
		this.mixins.observable.constructor.call(this, config);
        this.mixins.physics.constructor.call(this, config);
		var velocity = this.getInitialVelocity();           // get the velocity of the projectile

        var pitch = this.getPitch();            			// gets the angle the projectile is fired from and converts it to radians
        var yaw = this.getYaw();
        // convert form spherical to cartesian coordinates, accounting for -Z equaling +Y
		var vx = velocity * Math.sin(pitch) * Math.cos(-yaw);               	// calculate the x component in velocity
		var vy = velocity * Math.cos(pitch);               	// calculate the y component in velocity
		var vz = velocity * Math.sin(pitch) * Math.sin(-yaw);                                        	// calculate the z component in velocity
		this.setVelocity(vec3.fromValues(vx, vy, vz));		// sets the velocity vector based on the components
	},
	/**
	 * Override the getPosition accessor method for a projectile object
	 *
	 * @returns {null}
	 */
	getPosition: function () {
        var position = this.getDynamicPosition();
		if (position[13] === 0) {
			this.fireEvent('collision');
		}
		return position;
	}
});
