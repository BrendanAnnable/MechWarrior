/**
 * @author Monica Olejniczak
 * @author Brendan Annable
 */
Ext.define('FourJS.object.Object', {
	alias: 'Object',
	mixins: {
		observable: 'Ext.util.Observable'
	},
	positionInverse: null,
	worldPosition: null,
	worldPositionInverse: null,
	config: {
		name: null,
		position: null,
		children: null,
		parent: null,
        renderable: false,
        boundingBox: null,
		visualBoundingBox: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.mixins.observable.constructor.call(this, config);
        if (this.config.position === null) {
            this.setPosition(mat4.create());
        }
        if (this.config.children === null) {
            this.setChildren([]);
        }
		this.positionInverse = mat4.create();
		this.worldPosition = mat4.create();
		this.worldPositionInverse = mat4.create();
	},
	getPositionInverse: function () {
		var position = this.getPosition();
		// TODO: find out when I can use each of the below
		//mat4.othoNormalInvert(this.positionInverse, position);
		mat4.invert(this.positionInverse, position);
		return this.positionInverse;
	},
	translate: function (x, y, z) {
		var position = this.getPosition();
		mat4.translate(position, position, vec3.fromValues(x, y, z));
	},
	scale: function (x, y, z) {
		var position = this.getPosition();
		mat4.scale(position, position, vec3.fromValues(x, y, z));
	},
	rotate: function (rad, axis) {
		var position = this.getPosition();
		mat4.rotate(position, position, rad, axis);
	},
	rotateX: function (rad) {
		var position = this.getPosition();
		mat4.rotateX(position, position, rad);
	},
	rotateY: function (rad) {
		var position = this.getPosition();
		mat4.rotateY(position, position, rad);
	},
	rotateZ: function (rad) {
		var position = this.getPosition();
		mat4.rotateZ(position, position, rad);
	},
	getTranslation: function () {
		var position = this.getPosition();
		return mat4.col(position, 3, 3);
	},
	getTranslationVector: function () {
		var position = this.getPosition();
		return mat4.translateVector(position);
	},
	/**
	 * Adds a child object to the object.
	 *
	 * @param object the object to add
	 */
	addChild: function (object) {
		this.getChildren().push(object);
		object.setParent(this);
	},
	/**
	 * Removes a child from the object.
	 *
	 * @param object the object to be removed
	 */
	removeChild: function (object) {
		if (object) {
			Ext.Array.remove(this.getChildren(), object);
			object.setParent(null);
		}
	},
	/**
	 * Checks if the current object has children.
	 *
	 * @returns {boolean} whether the object contains children
	 */
	hasChildren: function () {
		return this.getChildren().length !== 0;
	},
    /**
     * Checks if the object is renderable.
     * @returns {*}
     */
    isRenderable: function () {
        return this.getRenderable();
    },
    /**
     * Updates the object's world position.
     */
	updateWorld: function () {
		var parent = this.getParent();
		if (parent === null) {
            this.worldPosition = this.getPosition();
		}
		else {
			parent.updateWorld();
			mat4.multiply(this.worldPosition, parent.getWorldPosition(), this.getPosition());
		}
	},
    /**
     * Retrieves the world position of the object.
     * @returns {null}
     */
	getWorldPosition: function () {
		this.updateWorld();
		return this.worldPosition;
	},
	getWorldPositionInverse: function () {
		var worldPosition = this.getWorldPosition();
		mat4.invert(this.worldPositionInverse, worldPosition);
		return this.worldPositionInverse;
	},
    /**
     * Recursively finds all the children of an object and returns it as a single array.
     * @returns {Array}
     */
    getAllChildren: function () {
        var result = [];
        var children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
            result.push(children[i]);
            result = result.concat(children[i].getAllChildren());
        }
        return result;
    },
	/**
	 * Searches for a child object with the given name
	 *
	 * @param name The name to search for
	 * @returns {*} The child if found, null otherwise
	 */
	getChild: function (name) {
		var children = this.getChildren();
		for (var i = 0; i < children.length; i++) {
			var child = children[i];

			if (child.getName() === name) {
				return child;
			}

			child = children[i].getChild(name);

			if (child !== null) {
				return child;
			}
		}
		return null;
	},
	/**
	 * Clones the object object into the passed in object.
	 *
	 * @param [object] The object to copy the data into, if not given it will be created
	 * @param recursive Whether to clone children
	 * @returns {*} The cloned object
	 */
	clone: function (object, recursive) {
		if (object === undefined) {
			// object not given, create one
			object = Ext.create('FourJS.object.Object', {
				name: this.getName(),
				position: mat4.clone(this.getPosition()),
				renderable: this.getRenderable()
			});
		}
		// clone children
		var children = this.getChildren();
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			if (recursive) {
				object.addChild(child.clone());
			} else {
				object.addChild(child);
			}
		}
		return object;
	},
	showVisualBoundingBox: function (enabled, renderable) {
		if (enabled) {
			this.addVisualBoundingBox(renderable || true);
		} else {
			this.removeVisualBoundingBox();
		}
	},
	addVisualBoundingBox: function (renderable) {
		// attach a visual bounding box for debugging purposes
		// TODO: make this generic and put it somewhere
		var boundingBox = this.getBoundingBox();
		var radii = boundingBox.getRadii();
		var box = Ext.create('FourJS.object.Mesh', {
			geometry: Ext.create('FourJS.geometry.CubeGeometry', {
				width: radii[0] * 2,
				height: radii[1] * 2,
				depth: radii[2] * 2
			}),
			material: Ext.create('FourJS.material.Phong', {
				color: Ext.create('FourJS.util.Color', {
					r: 1,
					g: 1,
					b: 1
				}),
				useLighting: false,
				wireframe: true
			})
		});
		var center = boundingBox.getCenter();
		box.translate(center[0], center[1], center[2]);
		box.setRenderable(renderable || false);
		this.setVisualBoundingBox(box);
		this.addChild(box);
	},
	removeVisualBoundingBox: function () {
		this.removeChild(this.getVisualBoundingBox());
	},
    getBoundingBox: function (){
        var boundingBox = this._boundingBox;
        if (boundingBox === null) {
            // TODO: uncouple from FourJS
            boundingBox = FourJS.geometry.Geometry.getBoundingBox(this);
            this.setBoundingBox(boundingBox);
        }
        return boundingBox;
    }
});