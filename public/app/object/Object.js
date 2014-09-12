/**
 * @author Monica Olejniczak
 */
Ext.define('MW.object.Object', {
	alias: 'Object',
	positionInverse: null,
	config: {
		name: null,
		position: null,
		positionInverse: null,
		children: null,
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
	},
	getPositionInverse: function () {
		var position = this.getPosition();
		mat4.othoNormalInvert(this.positionInverse, position);
		return this.positionInverse;
	},
	translate: function (x, y, z) {
		var position = this.getPosition();
		mat4.translate(position, position, vec3.fromValues(x, y, z));
	},
	/**
	 * Adds a child object to the object.
	 *
	 * @param object the object to add
	 */
	addChild: function (object) {
		this.getChildren().push(object);
	},
	/**
	 * Removes a child from the object.
	 *
	 * @param object the object to be removed
	 */
	removeChild: function (object) {
		Ext.Array.remove(this.getChildren(), object);
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
    }
});