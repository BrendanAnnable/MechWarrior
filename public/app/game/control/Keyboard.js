/**
 * @author Brendan Annable
 *
 */
Ext.define('MW.game.control.Keyboard', {
	extend: 'MW.control.Keyboard',
	ctrl: false,
	shift: false,
	alt: false,
	translation: null,
	needsUpdate: true,
	config: {
		speed: 1,
		altSpeedMultiplier: 2,
		forwardKey: 'W'.charCodeAt(0),
		leftKey: 'A'.charCodeAt(0),
		backwardKey: 'S'.charCodeAt(0),
		rightKey: 'D'.charCodeAt(0),
		jumpKey: ' '.charCodeAt(0)
	},
	constructor: function () {
		this.callParent(arguments);
		this.translation = vec3.fromValues(0, 0, 0);
	},
	onKeyDown: function (event){
		this.callParent(arguments);
		this.needsUpdate = true;
		if (event.keyCode === this.getJumpKey()) {
			this.fireEvent('jump');
		}
		this.fireEvent(String.fromCharCode(event.keyCode), event);
		this.shift = event.shiftKey;
		this.ctrl = event.ctrlKey;
		this.alt = event.altKey;
	},
	onKeyUp: function (event) {
		this.callParent(arguments);
		this.needsUpdate = true;
		this.shift = event.shiftKey;
		this.ctrl = event.ctrlKey;
		this.alt = event.altKey;
	},
	getTranslation: function () {
		var translation = this.translation;
		if (this.needsUpdate) {
			var x = 0;
			var y = 0;
			var z = 0;

			if (this.isKeyDown(this.getForwardKey())) {
				z = -1;
			}
			else if (this.isKeyDown(this.getBackwardKey())) {
				z = 1;
			}

			if (this.isKeyDown(this.getRightKey())) {
				x = 1;
			}
			else if (this.isKeyDown(this.getLeftKey())) {
				x = -1;
			}

			vec3.set(translation, x, y, z);
			vec3.normalize(translation, translation);
			vec3.scale(translation, translation, (this.shift ? this.getAltSpeedMultiplier() : 1) * this.getSpeed());
			this.needsUpdate = false;
		}
		return translation;
	}
});