/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.object.Object', {
	alias: 'Object',
	positionInverse: null,
	worldPosition: null,
	worldPositionInverse: null,
	config: {
		name: null,
		position: null,
		children: null,
		parent: null,
		renderable: false
	},
	constructor: function (config) {
		this.initConfig(config);
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
		Ext.Array.remove(this.getChildren(), object);
		object.setParent(null);
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
	}
});