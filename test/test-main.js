var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function (path) {
	return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base',

	paths: { },

	shim: { },

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});

var karmaLoadedFunction = window.__karma__.loaded;
window.__karma__.loaded = function() {};

Ext.Loader.setConfig({
	paths: {
		'MW': 'base/public/app',
		'FourJS': 'base/public/lib/FourJS',
		'PhysJS': 'base/public/lib/PhysJS'
	}
});

Ext.onReady(function() {
	window.__karma__.loaded =  karmaLoadedFunction;
	window.__karma__.loaded();
});

