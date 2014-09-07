/**
 * @author Julius Sky
 * @author Brendan Annable
 *
 * The keyboard class returns keyboard events recorded from the user.
 */
Ext.define('MW.control.Keyboard', {
	keyMap: null,
	translation: null,
	needsUpdate: true,
    config: {
		speed: 1,
        element: null,
		forwardKey: 'W'.charCodeAt(0),
		leftKey: 'A'.charCodeAt(0),
		backwardKey: 'S'.charCodeAt(0),
		rightKey: 'D'.charCodeAt(0)
    },
    constructor: function (config) {
        this.initConfig(config);
        this.translation = vec3.fromValues(0, 0, 0);
		this.keyMap = {};

        var element = this.getElement();
        element = Ext.get(element);
        element.on({
            keydown: this.onKeyDown,
			keyup: this.onKeyUp,
            scope: this
        });
        this.setElement(element);
    },
    onKeyDown: function (event){
		// register key as down
		this.keyMap[event.keyCode] = Date.now();
		this.needsUpdate = true;
    },
	onKeyUp: function (event) {
		// unregister key as down
		delete this.keyMap[event.keyCode];
		this.needsUpdate = true;
	},
	isKeyDown: function (key) {
		return this.keyMap.hasOwnProperty(key);
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
			vec3.scale(translation, translation, this.getSpeed());
			this.needsUpdate = false;
		}
		return translation;
	}
});
//# sourceURL=Keyboard.js
