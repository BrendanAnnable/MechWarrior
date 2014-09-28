/**
 * @author Monica Olejniczak
 */
Ext.define('MW.manager.Audio', {
    alias: 'AudioManager',
    config: {
        sound: true,
        keyboardControls: null
    },
    constructor: function (config) {
        this.initConfig(config);
        soundManager.setup({
            url: "/resources/sound/" // where to locate sound files
        });
        // add the keyboard event for sound
        this.getKeyboardControls().on('n', function (event) {
            this.setSound(!this.getSound());
        }, this);
    }
});
