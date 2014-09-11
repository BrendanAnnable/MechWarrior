/**
 * @author Brendan Annable
 */
Ext.define('MW.control.Mouse', {
	mixins: {
		observable: 'Ext.util.Observable'
	},
	pitch: 0,
	yaw: 0,
	matrix: null,
	matrixInverse: null,
	matrixDirty: true,
	matrixInverseDirty: true,
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
		this.mixins.observable.constructor.call(this, config);
		this.setRotation(mat4.create());

		var element = this.getElement();
		element = Ext.get(element);
		var dom = element.dom;

		element.on({
			mousemove: this.onMouseMove,
			click: this.onMouseClick,
			scope: this
		});

		dom.addEventListener('click', Ext.bind(this.onMouseClick, this));
		document.addEventListener('pointerlockchange', Ext.bind(this.pointerLockChange, this), false);
		document.addEventListener('mozpointerlockchange', Ext.bind(this.pointerLockChange, this), false);
		document.addEventListener('webkitpointerlockchange', Ext.bind(this.pointerLockChange, this), false);

		this.setElement(element);
		this.matrix = mat4.create();
		this.matrixInverse = mat4.create();
	},
	pointerLockChange: function () {
		var element = this.getElement();
		var dom = element.dom;
		this.locked = (
			document.pointerLockElement === dom ||
			document.mozPointerLockElement === dom ||
			document.webkitPointerLockElement === dom
		);
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
	getPositionInverse: function () {
		var position = this.getPosition();
		if (this.matrixInverseDirty) {
			mat4.othoNormalInvert(this.matrixInverse, position);
		}
		return this.matrixInverse;
	},
	getYaw: function () {
		return this.yaw;
	},
	getPitch: function () {
		return this.pitch;
	},
	onMouseClick: function (event, dom) {
		if (!this.locked) {
			var element = this.getElement();
			var dom = element.dom;
			dom.requestPointerLock = dom.requestPointerLock || dom.mozRequestPointerLock || dom.webkitRequestPointerLock;
			dom.requestPointerLock();
		} else {
			this.fireEvent('click', this);
		}
	},
	onMouseMove: function (event) {
		if (this.locked) {
			var e = event.event;
			var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
			var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
			var sensitivity = this.getSensitivity();

			this.pitch -= movementY * sensitivity;
			this.pitch = Math.max(Math.min(this.pitch, this.getMinPitch()), this.getMaxPitch());
			this.yaw -= movementX * sensitivity;

			this.matrixDirty = true;
			this.matrixInverseDirty = true;
		}
	}
});
//# sourceURL=Mouse.js