Ext.define('PhysJS.util.math.BoundingBox', {
	config: {
		min: null,
		max: null,
		position: null,
		center: null,
		radii: null
	},
	constructor: function (config) {
		this.initConfig(config);
		if (this.config.position === null) {
			this.setPosition(mat4.create());
		}
		if (config.points) {
			this.computeBoundingBox(config.points);
		}
	},
	computeBoundingBox: function (points) {
		var min, max, point, x, y, z;

		// set the bounds at infinity
		min = vec4.fromValues(Infinity, Infinity, Infinity, 0);
		max = vec4.fromValues(-Infinity, -Infinity, -Infinity, 0);

		// check there are points to deal with
		if (points.length > 0) {
			// set min and max to start with
			// this allows us to use an 'if/else if' block in the loop below
			point = points[0];
			min[0] = max[0] = point[0];
			min[1] = max[1] = point[1];
			min[2] = max[2] = point[2];

			// loop vertices and check if each point pushes the boundary further than it already is
			for (var i = 1; i < points.length; i++) {
				point = points[i];
				x = point[0];
				y = point[1];
				z = point[2];

				if (x < min[0]) {
					min[0] = x;
				}
				else if (x > max[0]) {
					max[0] = x;
				}

				if (y < min[1]) {
					min[1] = y;
				}
				else if (y > max[1]) {
					max[1] = y;
				}

				if (z < min[2]) {
					min[2] = z;
				}
				else if (z > max[2]) {
					max[2] = z;
				}
			}
		}

		this.setMin(min);
		this.setMax(max);

		var radii = vec4.subtract(vec4.create(), max, min);
		this.setRadii(vec4.scale(radii, radii, 0.5));

		var center = vec4.add(vec4.create(), min, max);
		vec4.scale(center, center, 0.5);
		center[3] = 1; // make it a point
		this.setCenter(center);
	},
	statics: {
		/**
		 * Checks if two given bounding boxes intersect with one another.
		 *
		 * Results an object with the following keys:
		 * @property {boolean} intersects - True if the bounding boxes intersect
		 * @property    {vec3} resolution - A vector specifying the shortest distance
		 * and magnitude to move the boxes such that they are no longer intersecting
		 *
		 * Uses the Separating Axis Theorem
		 * See http://en.wikipedia.org/wiki/Hyperplane_separation_theorem)
		 * Looks for separating planes between the bounding boxes.
		 *
		 * @param {PhysJS.util.math.BoundingBox} box1 The first bounding box
		 * @param {PhysJS.util.math.BoundingBox} box2 The second bounding box
		 * @returns {Object} Containers two properties, 'intersects' and 'resolution'
		 */
		intersects: function (box1, box2) {
			// assumes the position of each box to be an orthonormal basis
			var pos1 = box1.getPosition();
			var pos2 = box2.getPosition();
			var center1 = vec4.transformMat4(vec4.create(), box1.getCenter(), pos1);
			var center2 = vec4.transformMat4(vec4.create(), box2.getCenter(), pos2);
			var centerDifference = vec4.subtract(vec4.create(), center1, center2);

			var results = {
				intersects: true,
				resolution: null
			};

			// broad phase
			var maxDiameter1 = vec4.length(vec4.subtract(vec4.create(), box1.getMax(), box1.getMin()));
			var maxDiameter2 = vec4.length(vec4.subtract(vec4.create(), box2.getMax(), box2.getMin()));
			if (vec4.length(centerDifference) > maxDiameter1 + maxDiameter2) {
				results.intersects = false;
				return results;
			}

			// narrow phase

			// get the axis vectors of the first box
			var ax1 = mat4.col(pos1, 0);
			var ay1 = mat4.col(pos1, 1);
			var az1 = mat4.col(pos1, 2);
			// get the axis vectors of the second box
			var ax2 = mat4.col(pos2, 0);
			var ay2 = mat4.col(pos2, 1);
			var az2 = mat4.col(pos2, 2);

			// keep them in a list
			var axes = [ax1, ay1, az1, ax2, ay2, az2];

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

			var smallestDifference = Infinity;
			// there are 15 axes to check, so loop through all of them until a separation plane is found
			var zeros = vec4.create();
			for (var i = 0; i < 15; i++) {
				var axis;

				// the first 6 axes are just the axes of each bounding box
				if (i < 6) {
					axis = axes[i];
				}
				// the last 9 axes are the cross product of all combinations of the first 6 axes
				else {
					var offset = i - 6;
					var j = Math.floor(offset / 3);
					var k = offset % 3;
					axis = vec4.cross(vec4.create(), axes[j], axes[k + 3]);
					if (vec4.close(axis, zeros)) {
						// axes must be collinear, ignore
						continue;
					}
				}

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

				if (projectionDifference >= projectionBoxesSum) {
					// If the projection of the center difference onto the axis is greater
					// than the sum of the box projections, then we found a separating plane!
					// The bounding boxes therefore must not intersect
					results.intersects = false;
					break;
				}
				else {
					// keep track of the difference, the smallest gives the minimum distance
					// and direction to move the boxes such that they no longer intersect
					var difference = projectionBoxesSum - projectionDifference;
					if (difference < smallestDifference) {
						results.resolution = vec4.scale(vec4.create(), axis, difference);
						smallestDifference = difference;
					}
				}
			}

			// could not find a separating plane, they must intersect
			return results;
		}
	}
});
