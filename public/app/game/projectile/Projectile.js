/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.projectile.Projectile', {
	alias: 'Projectile',
	extend: 'MW.object.Mesh',
    mixins: {
        physics: 'MW.game.physics.DynamicObject'
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
        this.mixins.physics.constructor.call(this, config);     // call the physics constructor to initialise the mixin
		var velocity = this.getInitialVelocity();               // get the initial velocity of the projectile

        var pitch = this.getPitch();                            // gets the angle the projectile is fired from
        var yaw = this.getYaw();                                // get the angle the projectile is firing towards

        // convert form spherical to cartesian coordinates, accounting for -Z equaling +Y

		var vx = velocity * Math.sin(pitch) * Math.cos(-yaw);   // calculate the x component in velocity
		var vy = velocity * Math.cos(pitch);               	    // calculate the y component in velocity
		var vz = velocity * Math.sin(pitch) * Math.sin(-yaw);   // calculate the z component in velocity
		this.setVelocity(vec3.fromValues(vx, vy, vz));		    // sets the velocity vector based on the components
	}
});
