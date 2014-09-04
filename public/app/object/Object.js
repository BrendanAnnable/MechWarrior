/**
 * @author Monica Olejniczak
 */
Ext.define('MW.object.Object', {
	alias: 'Object',
	mixins: {
		renderer: 'MW.mixin.Render'
	},
	config: {
		name: null,
		position: null,
		children: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.setPosition(mat4.create());
		this.setChildren([]);
	},
	/**
	 * This render method is called by any subclasses. It renders any object on the screen by calling the renderer
	 * mixin.
	 *
	 * @param gl The WebGL context
	 * @param shaderProgram The WebGL shader program
	 * @param cursor The current model-view project matrix
	 */
	render: function (gl, shaderProgram, cursor) {
		var children = this.getChildren();
		var cursorCopy = mat4.clone(cursor);
		mat4.multiply(cursorCopy, cursorCopy, this.getPosition());
		this.mixins.renderer.render(gl, this, shaderProgram, cursorCopy);
		for (var i = 0; i < children.length; i++) {
			children[i].render(gl, shaderProgram, cursor);
		}
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
	}
});