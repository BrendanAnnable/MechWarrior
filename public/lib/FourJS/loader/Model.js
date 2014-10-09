/**
 * @author Brendan Annable
 * @author Monica Olejniczak
 */
Ext.define('FourJS.loader.Model', {
	alias: 'ModelLoader',
    extend: 'FourJS.loader.Json',
    /**
     * Loads a model asynchronously
     *
     * @param url The path of the model file
     */
    load: function (url) {
		var me = this;
	    return new Promise(function (resolve) {
		    Ext.Ajax.request({
			    url: url,
			    scope: this,
			    success: function (response) {
				    // Decode the JSON response
					resolve(me.superclass.load(response.responseText));
			    }
		    });
	    });
    }
});