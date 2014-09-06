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
//        translation: null



    },
    constructor: function (config) {
        this.initConfig(config);
//        this.setTranslation(vec3.fromValues(0, 0, 0));

        this.transX =0;
        this.transY=0;
        this.transZ=0;
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
            this.transX = -10;
        }
        // if D key is pressed, translate right
        else if(event.keyCode == event.D){
            this.transX = 10;
        }
        // if W key is pressed, translate forward
        else if(event.keyCode == event.W){
            this.transZ = -10;
        }
        // if S key is pressed, translate backward
        else if(event.keyCode == event.S){
            this.transZ = 10;
        }
//        else if(event.keyCode == 32){
//            console.log("spacebar pressed. jump robot jump!");
//        }
        else{console.log("keypressed: "+String.fromCharCode(event.keyCode))
        }
//        this.setTranslation(vec3.fromValues(this.transX, this.transY, this.transZ));


    },

    getTransX:function(){
        return this.transX;
    },

    getTransY:function(){
        return this.transY;
    },
    getTransZ:function(){
        return this.transZ;
    }

    //TODO: fix this. i kept getting a cannot read property of undefined error, i think now that its to do with the element..?
//    getTranslation: function(){
//        /*
//        * returns a vec3 from x, y z
//        */

//        return vec3.fromValues(transX, transY, transZ);
//    }
});
