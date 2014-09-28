Ext.define('MW.level.omega.OmegaController', {
    extend: 'MW.level.LevelController',
    constructor: function (config) {
        this.callParent(arguments);
        var player = this.createPlayer(true);
        player.translate(0, 0, -20);
        //this.createThirdPersonCamera(player, true);
        //this.createThirdPersonCamera(Ext.create('FourJS.object.Object'), true);
    }
});
