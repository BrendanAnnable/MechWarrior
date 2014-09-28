Ext.define('FourJS.util.math.GUID', {
	singleton: true,
	generate: function () {
		var now = Date.now();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (now + Math.random() * 16) % 16 | 0;
			now = Math.floor(now / 16);
			return (c == 'x' ? r : (r&0x7 | 0x8)).toString(16);
		});
	}
});
