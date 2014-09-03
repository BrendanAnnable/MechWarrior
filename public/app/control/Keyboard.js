/**
 * @Author Julius Sky on 3/09/2014.
 */

/*
The keyboard class returns keyboard events recorded from the user.
 */


Ext.define('MW.control.Keyboard', {
    // private vars

    transX:0,
    transY:0,
    transZ:0,
    // public vars. (getters/setters are created automatically by ext.js)
    config: {
        element: null

    },
    constructor: function (config) {
        this.initConfig(config);
        var element = this.getElement();
        element = Ext.get(element);
        element.on({
            keydown: this.onKeyDown,
            scope: this
        });
        this.setElement(element);
    },

    onKeyDown: function (event){
        // if A key is pressed, translate left
        if(event.keyCode == event.A){
            this.transX = -1;
        }
        // if D key is pressed, translate right
        else if(event.keyCode == event.D){
            this.transX = 1;
        }
        // if W key is pressed, translate forward
        else if(event.keyCode == event.W){
            this.transZ = -1;
        }
        // if S key is pressed, translate backward
        else if(event.keyCode == event.S){
            this.transZ = 1;
        }
//        else if(event.keyCode == 32){
//            console.log("spacebar pressed. jump robot jump!");
//        }
        else{console.log("keypressed: "+String.fromCharCode(event.keyCode))
        }

    },

    getTranslation: function(out, matrixToTranslate){
        /*
        * @param out is the receiving matrix
        * @param matrixToTranslate is the matrix to translate
        * returns out
        */
        return mat4.translate(out, matrixToTranslate, vec3.fromValues(transX, transY, transZ));

    }
});
