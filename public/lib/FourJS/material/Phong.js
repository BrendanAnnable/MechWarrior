/**
 * @author Monica Olejniczak
 */
Ext.define('FourJS.material.Phong', {
    alias: 'PhongMaterial',
    extend: 'FourJS.material.Material',
    config: {
        texture: null,
        environmentMap: null,
        ambient: null,          // todo support
        specular: null,         // todo support
        shininess: null,        // todo support
        opacity: 1,             // todo support
        transparent: false      // todo support
    }
});