/**
 * @author Monica Olejniczak
 */
Ext.define('MW.game.physics.CollisionDetector', {
    alias: 'CollisionDetector',
    lastTime: Date.now(),
    config: {
        scene: null
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    update: function () {
        this.updateObject(this.getScene());
        this.lastTime = Date.now();
    },
    updateObjectPosition: function (object) {
        if (object.isDynamicObject) {
            var position = object.getPosition();
            var force = object.getForce();
            var mass = object.getMass();
            var velocity = object.getVelocity();
            var acceleration = object.getAcceleration();

            var now = Date.now();
            var time = (now - this.lastTime) / 1000;

            var lastAcceleration = vec3.clone(acceleration);
            var a = vec3.scale(vec3.create(), lastAcceleration, (time * time) / 2);
            var b = vec3.scale(vec3.create(), velocity, time);

            vec3.add(a, a, b);
            mat4.translate(position, position, a);

            // collision detection hack - don't let the vertical position go below 0
            if (position[13] < 0) {
                position[13] = 0;
                object.fireEvent('collision');
            }

            vec3.scale(acceleration, force, mass);
            var avg = vec3.add(vec3.create(), lastAcceleration, acceleration);
            vec3.scale(avg, avg, 1 / 2);
            var c = vec3.scale(vec3.create(), avg, time);
            vec3.add(velocity, velocity, c);
        }
    },
    updateObject: function (object) {
        this.updateObjectPosition(object);
        var children = object.getChildren();
        for (var i = 0; i < children.length; i++) {
            this.updateObject(children[i]);
        }
    }
});
