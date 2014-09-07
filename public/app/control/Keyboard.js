/**
 * @author Julius Sky
 * @author Brendan Annable
 *
 * The keyboard class returns keyboard events recorded from the user.
 */
Ext.define('MW.control.Keyboard', {
    // public vars. (getters/setters are created automatically by ext.js)
	forward: 0,
	right: 0,
	up: 0,
    config: {
        element: null,
        translation: null
    },
    constructor: function (config) {
        this.initConfig(config);
        this.setTranslation(vec3.fromValues(0, 0, 0));

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
		switch (event.keyCode) {
			case event.A:
				// if A key is pressed, translate left
				this.right = -1;
				break;
			case event.D:
				// if D key is pressed, translate right
				this.right = 1;
				break;
			case event.W:
				// if W key is pressed, translate forward
				this.forward = -1;
				break;
			case event.S:
					// if S key is pressed, translate backward
				this.forward = 1;
				break;
		}
		this.update();
    },
	onKeyUp: function (event){
		// if A key is pressed, translate left
		switch (event.keyCode) {
			case event.A:
			case event.D:
				this.right = 0;
				break;
			case event.S:
			case event.W:
				this.forward = 0;
				break;
		}
		this.update();
	},
	update: function () {
		var translation = this.getTranslation();
		vec3.set(translation, this.right, this.up, this.forward);
		vec3.normalize(translation, translation);
	}
});
//# sourceURL=Keyboard.js
