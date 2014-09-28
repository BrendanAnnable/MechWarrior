/**
 * @author Monica Olejniczak
 */
Ext.define('PhysJS.PhysicsEngine', {
    alias: 'PhysicsEngine',
    mixins: {
        observable: 'Ext.util.Observable'
    },
    lastTime: Date.now() * 1E-3, // in seconds
	count: 0,
    config: {
        scene: null
    },
    constructor: function (config) {
        this.initConfig(config);
        this.mixins.observable.constructor.call(this, config);
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

			vec3.scale(acceleration, force, mass);
			var avg = vec3.add(vec3.create(), lastAcceleration, acceleration);
			vec3.scale(avg, avg, 1 / 2);
			var c = vec3.scale(vec3.create(), avg, timeStep);
			vec3.add(velocity, velocity, c);

            // apply transform to potential new position
            var candidatePosition = mat4.multiply(mat4.create(), position, transform);
            if (candidatePosition[13] < 0) {
                // collision detection hack - don't let the vertical position go below 0
                candidatePosition[13] = 0;
                velocity[1] = 0;
                // TODO: object.fireEvent('collision', object, the_floor);
            }
            var collidedObject = this.hasCollided(object, candidatePosition, this.getScene());
            if (collidedObject !== null) {
                this.fireEvent('collision', object, collidedObject);
            }
            mat4.copy(position, candidatePosition);
        }
	},
    hasCollided: function (object, position, scene) {
        var children = scene.getAllChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.isDynamicObject && child !== object) {
                var points = object.getBoundingPoints();
                var boundingBox = child.getBoundingBox();
                // check if the points intersect with the bounding box
                if (this.isColliding(points, boundingBox)) {
                    return child;
                }
            }
        }
        return null;
    },
    isColliding: function (points, boundingBox) {
        var min = boundingBox.min;
        var max = boundingBox.max;
        // check each point within the object
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var xBound = point[0] >= min[0] && point[0] <= max[0];
            var yBound = point[1] >= min[1] && point[1] <= max[1];
            var zBound = point[2] >= min[2] && point[2] <= max[2];
            if (xBound && yBound && zBound) {
                return true;
            }
        }
        return false; // the object points do not collide with the bounding box
    }
});
