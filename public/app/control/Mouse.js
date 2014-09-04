Ext.define('MW.control.Mouse', {
	pitch: 0,
	yaw: 0,
	matrix: null,
	matrixDirty: true,
	locked: false,
	config: {
		sensitivity: 0.01,
		element: null,
		rotation: null,
		pitch: 0,
		yaw: 0,
		maxPitch: -Math.PI / 2 - 0.01,
		minPitch: Math.PI / 2 + 0.01
	},
	constructor: function (config) {
		this.initConfig(config);
		this.setRotation(mat4.create());

		var element = this.getElement();
		element = Ext.get(element);
		element.on({
			mousemove: this.onMouseMove,
			click: this.onMouseClick,
			//pointerlockerror: null,
			pointerlockchange: this.onPointerLockChange,
			scope: this
		});

		element.dom.addEventListener('click', function () {
			element.dom.requestPointerLock();
		});

		this.setElement(element);
		this.matrix = mat4.create();
	},
	getPosition: function () {
		var matrix = this.matrix;
		if (this.matrixDirty) {
			mat4.identity(matrix);
			mat4.rotateY(matrix, matrix, this.yaw);
			mat4.rotateX(matrix, matrix, this.pitch);
			this.matrixDirty = false;
		}
		return matrix;
	},
	getYaw: function () {
		return this.yaw;
	},
	onPointerLockChange: function (event, dom) {
		debugger;
		//this.locked ==
	},
	onMouseClick: function (event, dom) {
		if (!this.locked) {
			dom.requestPointerLock = dom.requestPointerLock || dom.mozRequestPointerLock || dom.webkitRequestPointerLock;
			dom.requestPointerLock();
			this.locked = true;
		}
	},
	onMouseMove: function (event) {
		if (this.locked) {
			var diffX = event.event.movementX;
			var diffY = event.event.movementY;
			var sensitivity = this.getSensitivity();

			this.pitch -= diffY * sensitivity;
			this.pitch = Math.max(Math.min(this.pitch, this.getMinPitch()), this.getMaxPitch());
			this.yaw -= diffX * sensitivity;

			this.matrixDirty = true;
		}
	}
});