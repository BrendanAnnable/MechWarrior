/**
 * @author Julius Sky
 * @author Brendan Annable
 *
 * The keyboard class returns keyboard events recorded from the user.
 */
Ext.define('FourJS.control.Keyboard', {
	mixins: {
		observable: 'Ext.util.Observable'
	},
	keyMap: null,
    config: {
        element: null
    },
    constructor: function (config) {
        this.initConfig(config);
		this.mixins.observable.constructor.call(this, config);
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
    },
	onKeyUp: function (event) {
		// unregister key as down
		delete this.keyMap[event.keyCode];
	},
	isKeyDown: function (key) {
		return this.keyMap.hasOwnProperty(key);
	}
});
//# sourceURL=Keyboard.js
