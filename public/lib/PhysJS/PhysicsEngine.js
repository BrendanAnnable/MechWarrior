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
				var axis = vec4.subtract(vec4.create(), mat4.translateVector(candidatePosition), mat4.translateVector(object.getLastPosition()));
				this.resolveCollision(candidatePosition, object, collidedObject, axis);
            }
			mat4.copy(position, candidatePosition);

			vec3.scale(acceleration, force, mass);
			var avg = vec3.add(vec3.create(), lastAcceleration, acceleration);
			vec3.scale(avg, avg, 1 / 2);
			var c = vec3.scale(vec3.create(), avg, timeStep);
			vec3.add(velocity, velocity, c);
        }
	},
    hasCollided: function (object, position, scene) {
        var children = scene.getAllChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.isDynamicObject && child !== object) {
				var box1 = object.getBoundingBox();
                var box2 = child.getBoundingBox();
				if (box1 && box2 && object.getName() === 'player') {
					box1.setPosition(object.getWorldPosition());
					box2.setPosition(child.getWorldPosition());
					var results = PhysJS.util.math.BoundingBox.intersects(box1, box2);
					if (results.intersects) {
						object.box.setColor(1, 0, 0, 1);
						return child;
					}
					else {
						object.box.setColor(1, 1, 1, 1);
					}
				}
            }
        }
        return null;
    },
	resolveCollision: function (candidatePosition, object1, object2, axis) {
		var position1 = object1.getLastPosition();

		var startPoint = mat4.translateVector(position1);
		var startAngle = mat4.col(position1, 2);
		var startUp = mat4.col(position1, 1);
		var endPoint = mat4.translateVector(candidatePosition);
		var endAngle = mat4.col(candidatePosition, 2);
		var endUp = mat4.col(candidatePosition, 1);

		var box1 = object1.getBoundingBox();
		var box2 = object2.getBoundingBox();
		box2.setPosition(object2.getWorldPosition());

		var left = 0;
		var right = 1;
		var results;
		var i = 0;
		var newPoint = vec4.create();
		var newAngle = vec4.create();
		var newUp = vec4.create();
		var newPosition = mat4.create();
		do {
			var mid = (right + left) / 2;
			vec4.blend(newPoint, startPoint, endPoint, mid);
			vec4.blend(newAngle, startAngle, endAngle, mid);
			vec4.blend(newUp, startUp, endUp, mid);

			var z = newAngle;
			vec4.normalize(z, z);
			var x = vec4.cross(vec4.create(), newUp, z);
			vec4.normalize(x, x);
			var y = vec4.cross(vec4.create(), z, x);

			mat4.fromVec4Cols(newPosition, x, y, z, newPoint);
			box1.setPosition(newPosition);
			results = PhysJS.util.math.BoundingBox.intersects(box1, box2);
			if (results.intersects) {
				right = mid;
			} else {
				left = mid;
			}
			i++;
		} while ((i < 4 || results.intersects) && i < 5);
		if (!results.intersects) {
			mat4.copy(candidatePosition, newPosition);
		} else {
			mat4.copy(candidatePosition, position1);
		}
	}
});
