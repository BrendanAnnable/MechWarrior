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
						return child;
					}
				}
            }
        }
        return null;
    },
	resolveCollision: function (position, object1, object2, axis) {
		// TODO: this is duplicate code from BoundingBox with only 1 axis, needs refactoring

		vec3.normalize(axis, axis);

		var box1 = object1.getBoundingBox();
		var box2 = object2.getBoundingBox();

		var pos1 = box1.getPosition();
		var pos2 = box2.getPosition();

		var center1 = vec4.transformMat4(vec4.create(), box1.getCenter(), pos1);
		var center2 = vec4.transformMat4(vec4.create(), box2.getCenter(), pos2);
		var centerDifference = vec4.subtract(vec4.create(), center1, center2);

		// get the axis vectors of the first box
		var ax1 = mat4.col(pos1, 0);
		var ay1 = mat4.col(pos1, 1);
		var az1 = mat4.col(pos1, 2);
		// get the axis vectors of the second box
		var ax2 = mat4.col(pos2, 0);
		var ay2 = mat4.col(pos2, 1);
		var az2 = mat4.col(pos2, 2);

		// get the orientated radii vectors of the first box
		var radii1 = box1.getRadii();
		var radX1 = vec4.scale(vec4.create(), ax1, radii1[0]);
		var radY1 = vec4.scale(vec4.create(), ay1, radii1[1]);
		var radZ1 = vec4.scale(vec4.create(), az1, radii1[2]);

		// get the orientated radii vectors of the second box
		var radii2 = box2.getRadii();
		var radX2 = vec4.scale(vec4.create(), ax2, radii2[0]);
		var radY2 = vec4.scale(vec4.create(), ay2, radii2[1]);
		var radZ2 = vec4.scale(vec4.create(), az2, radii2[2]);

		// get the projections of the first half box onto the axis
		var projAx1 = Math.abs(vec4.dot(radX1, axis));
		var projAy1 = Math.abs(vec4.dot(radY1, axis));
		var projAz1 = Math.abs(vec4.dot(radZ1, axis));

		// get the projections of the second half box onto the axis
		var projAx2 = Math.abs(vec4.dot(radX2, axis));
		var projAy2 = Math.abs(vec4.dot(radY2, axis));
		var projAz2 = Math.abs(vec4.dot(radZ2, axis));

		// sum the projections
		var projectionBoxesSum = projAx1 + projAy1 + projAz1 + projAx2 + projAy2 + projAz2;

		// get the projection of the center difference onto the axis
		var projectionDifference = Math.abs(vec4.dot(centerDifference, axis));

		var dist = vec4.scale(vec4.create(), axis, -(projectionBoxesSum - projectionDifference));
		var worldPositionInverse = object1.getWorldPositionInverse();
		// convert translation to local coordinates
		vec4.transformMat4(dist, dist, worldPositionInverse);

		mat4.translate(position, position, dist);
	}
});
