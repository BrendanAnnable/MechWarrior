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
        // if A key is pressed, translate left
        if(event.keyCode == event.A){
            this.right = -1;
        }
        // if D key is pressed, translate right
        else if(event.keyCode == event.D){
            this.right = 1;
        }
        // if W key is pressed, translate forward
        else if(event.keyCode == event.W){
            this.forward = -1;
        }
        // if S key is pressed, translate backward
        else if(event.keyCode == event.S){
            this.forward = 1;
        }
		var translation = this.getTranslation();
		translation[0] = this.right;
		translation[1] = this.up;
		translation[2] = this.forward;
    },
	onKeyUp: function (event){
		// if A key is pressed, translate left
		if(event.keyCode == event.A){
			this.right = 0;
		}
		// if D key is pressed, translate right
		else if(event.keyCode == event.D){
			this.right = 0;
		}
		// if W key is pressed, translate forward
		else if(event.keyCode == event.W){
			this.forward = 0;
		}
		// if S key is pressed, translate backward
		else if(event.keyCode == event.S){
			this.forward = 0;
		}
		var translation = this.getTranslation();
		translation[0] = this.right;
		translation[1] = this.up;
		translation[2] = this.forward;
	}
});
//# sourceURL=Keyboard.js
