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
        scene: null,
        ACC_GRAV: -9.8
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
				force = vec3.add(vec3.create(), force, [0, this.getACC_GRAV(), 0]);
			}

			var lastAcceleration = vec3.clone(acceleration);
			var translation = vec3.scale(vec3.create(), lastAcceleration, (timeStep * timeStep) / 2);
			var b = vec3.scale(vec3.create(), velocity, timeStep);

			vec3.add(translation, translation, b);

			// convert to world space and apply translation
			var transform = mat4.translate(mat4.create(), object.getPositionInverse(), translation);
			// convert back to local space
			mat4.multiply(transform, transform, object.getPosition());

            // apply transform to potential new position
            var candidatePosition = mat4.multiply(mat4.create(), position, transform);
            if (candidatePosition[13] < 0) {
                // collision detection hack - don't let the vertical position go below 0
                candidatePosition[13] = 0;
                velocity[1] = 0;
                // TODO: object.fireEvent('collision', object, the_floor);
            }

			// run collision detection twice, in case object was moved into another object
			//for (var i = 0; i < 1; i++) {
				var collidedObject = this.hasCollided(object, candidatePosition, this.getScene());
				if (collidedObject !== null) {
					// fire collision events on both objects
					object.fireEvent('collision', collidedObject);
					collidedObject.fireEvent('collision', object);
//					this.resolveCollision(candidatePosition, object, collidedObject);
				}
				mat4.copy(position, candidatePosition);
			//}

			vec3.scale(acceleration, force, mass);
			var avg = vec3.add(vec3.create(), lastAcceleration, acceleration);
			vec3.scale(avg, avg, 1 / 2);
			var c = vec3.scale(vec3.create(), avg, timeStep);
			vec3.add(velocity, velocity, c);
        }
	},
    hasCollided: function (object, position, scene) {
        var children = scene.getAllChildren(); // TODO: stop doing this every frame for every dyanmic object!!
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            // if child object moving and object is not the child
            if (child.isDynamicObject && child !== object) {
				var objectsBBox = object.getBoundingBox();
                var childsBBox = child.getBoundingBox();

				// set the bounding box positions (middle point) to be at their positions in the world
				objectsBBox.setPosition(object.getWorldPosition());
				childsBBox.setPosition(child.getWorldPosition());

				var results = PhysJS.util.math.BoundingBox.intersects(objectsBBox, childsBBox);
				if (results.intersects) {
//						object.box.setColor(1, 0, 0, 1);
					return child;
				}
				else {
//						object.box.setColor(1, 1, 1, 1);
				}
            }
        }
        return null;
    },
	/**
	 * Resolves a given collision of two objects by moving the collider object
	 * away from the collided into object such that they no longer collide.
	 *
	 * Uses the last position of object (assumed to not be colliding)
	 * and linearly interpolate its position (including rotation) with
	 * the colliding candidate position along with a binary search
	 * until a reasonably 'close' non-colliding position is found.
	 *
	 * @param candidateCollisionPosition The candidate position which has a collision
	 * @param colliderObj The object colliding, and the one to move
	 * @param collidedIntoObj The object colliding with, assumed to not move
	 */
	resolveCollision: function (candidateCollisionPosition, colliderObj, collidedIntoObj) {
		var lastPosition = colliderObj.getLastPosition();

		var colliderObjBBox = colliderObj.getBoundingBox();
		var collidedIntoObjBBox = collidedIntoObj.getBoundingBox();
		collidedIntoObjBBox.setPosition(collidedIntoObj.getWorldPosition());

		var left = 0;
		var right = 1;
		var results;
		var i = 0;
		var newPosition = mat4.create();
		var lastCloser = mat4.clone(lastPosition);
		var distanceMoved = Infinity;
		var precision = 0.01;
		do {
			// find midpoint of search
			var mid = (right + left) / 2;
			// blend between the two positions
			mat4.blend(newPosition, lastPosition, candidateCollisionPosition, mid);

			colliderObjBBox.setPosition(newPosition);
			results = PhysJS.util.math.BoundingBox.intersects(colliderObjBBox, collidedIntoObjBBox);

			// binary search, narrow in on the closest point
			if (results.intersects) {
				right = mid;
			} else {
				// get the distance between the last closest and the new position
				distanceMoved = mat4.distance(lastCloser, newPosition);
				mat4.copy(lastCloser, newPosition);
				left = mid;
			}
			i++;
			// loop until we're in the given precision, capped at 50
		} while (distanceMoved > precision && i < 50);

		// copy the last closest into the candidate position
		mat4.copy(candidateCollisionPosition, lastCloser);
		colliderObjBBox.setPosition(lastCloser);
	}
});
