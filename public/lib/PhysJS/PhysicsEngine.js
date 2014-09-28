/**
 * @author Monica Olejniczak
 */
Ext.define('PhysJS.PhysicsEngine', {
    alias: 'PhysicsEngine',
    lastTime: Date.now() * 1E-3, // in seconds
	count: 0,
    config: {
        scene: null
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    update: function () {
		// calculate time step in seconds
		var now = Date.now() * 1E-3;
		var timeStep = now - this.lastTime;

		// update all objects in the scene
        this.updateObject(this.getScene(), timeStep);

		// store last updated time
        this.lastTime = now;
    },
    updateObject: function (object, timeStep) {
		// update object's position
        this.updateObjectPosition(object, timeStep);

		// recursively update all children
        var children = object.getChildren();
        for (var i = 0; i < children.length; i++) {
            this.updateObject(children[i], timeStep);
        }
    },
	updateObjectPosition: function (object, timeStep) {
		// See http://en.wikipedia.org/wiki/Verlet_integration#Velocity_Verlet
		// and http://buildnewgames.com/gamephysics/
		if (object.isDynamicObject) {
			var position = object.getPosition();
			var force = object.getForce();
			var mass = object.getMass();
			var velocity = object.getVelocity();
			var acceleration = object.getAcceleration();

			if (object.getGravity()) {
				// add gravity to force vector if enabled
				force = vec3.add(vec3.create(), force, [0, -9.8, 0]);
			}

			var lastAcceleration = vec3.clone(acceleration);
			var translation = vec3.scale(vec3.create(), lastAcceleration, (timeStep * timeStep) / 2);
			var b = vec3.scale(vec3.create(), velocity, timeStep);

			vec3.add(translation, translation, b);

			// convert to world space and apply translation
			var transform = mat4.translate(mat4.create(), object.getPositionInverse(), translation);
			// convert back to local space
			mat4.multiply(transform, transform, object.getPosition());
			// apply transform to current position
			mat4.multiply(position, position, transform);

			vec3.scale(acceleration, force, mass);
			var avg = vec3.add(vec3.create(), lastAcceleration, acceleration);
			vec3.scale(avg, avg, 1 / 2);
			var c = vec3.scale(vec3.create(), avg, timeStep);
			vec3.add(velocity, velocity, c);

			// collision detection hack - don't let the vertical position go below 0
			if (position[13] < 0) {
				position[13] = 0;
				velocity[1] = 0;
				object.fireEvent('collision');
			}
		}
	}
});
