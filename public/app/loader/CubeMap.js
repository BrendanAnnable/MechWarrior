/**
 * @author Monica Olejniczak
 */
Ext.define('MW.loader.CubeMap', {
    alias: 'CubeMap',
    extend: 'MW.loader.Loader',
    config: {
        topUrl: null,
        rightUrl: null,
        bottomUrl: null,
        frontUrl: null,
        backUrl: null,
        textures: null
    },
    constructor: function () {
        this.callParent(arguments);
    }
});