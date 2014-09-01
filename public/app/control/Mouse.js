Ext.define('MW.control.Mouse', {
	lastX: null,
	lastY: null,
	config: {
		sensitivity: 0.01,
		element: null,
		rotation: null,
		pitch: 0,
		yaw: 0,
		maxPitch: Math.PI / 2 - 0.01,
		minPitch: -Math.PI / 2 + 0.01
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
	getYawRotation: function () {
		return mat4.createRotateY(this.getYaw());
	},
	getPitchRotation: function () {
		return mat4.createRotateX(this.getPitch());
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
		var pitch = this.getPitch();
		var yaw = this.getYaw();
		var sensitivity = this.getSensitivity();

		pitch -= diffY * sensitivity;
		pitch = Math.min(Math.max(pitch, this.getMinPitch()), this.getMaxPitch());
		yaw -= diffX * sensitivity;

		this.setYaw(yaw);
		this.setPitch(pitch);
		this.lastX = x;
		this.lastY = y;
	}
});