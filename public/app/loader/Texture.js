/**
 * @author Monica Olejniczak
 */
Ext.define('MW.loader.Texture', {
	alias: 'TextureLoader',
	constructor: function (gl, url) {
		var texture = gl.createTexture();
		texture.image = new Image();
		texture.image.onload = Ext.bind(function () {
			this.onLoad(gl, texture);
		}, this);
		texture.image.src = url;
        return texture;
	},
	onLoad: function (gl, texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
});