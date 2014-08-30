Ext.define('MW.control.Mouse', {
	lastX: null,
	lastY: null,
	config: {
		element: null,
		rotation: null
	},
	constructor: function (config) {
		this.initConfig(config);
		this.setRotation(mat4.create());

		var element = this.getElement();
		element = Ext.get(element);
		element.on({
			mousemove: this.onMouseMove,
			scope: this
		});
		this.setElement(element);
	},
	onMouseMove: function (event) {
		var x = event.getX();
		var y = event.getY();

		if (this.lastX === null) {
			this.lastX = x;
		}
		if (this.lastY === null) {
			this.lastY = y;
		}

		var diffX = this.lastX - x;
		var diffY = this.lastY - y;

		var rot = this.getRotation();
		mat4.rotateY(rot, rot, diffX * 0.001);
		mat4.rotateX(rot, rot, diffY * 0.001);
	}
});