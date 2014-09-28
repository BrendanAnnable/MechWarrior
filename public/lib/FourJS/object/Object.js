/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.object.Object', {
	alias: 'Object',
	positionInverse: null,
	worldPosition: null,
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
    isRenderable: function () {
        return this.getRenderable();
    },
	updateWorld: function (object) {
		if (object === undefined) {
			object = this;
		}
		var parent = object.getParent();
		if (parent === null) {
			object.worldPosition = object.getPosition();
		}
		else {
			this.updateWorld(parent);
			mat4.multiply(object.worldPosition, parent.getWorldPosition(), object.getPosition());
		}
	},
	getWorldPosition: function () {
		this.updateWorld(this);
		return this.worldPosition;
	}
});