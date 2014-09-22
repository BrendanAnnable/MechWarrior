module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '..',
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'requirejs'],
		// list of files / patterns to load in the browser
		files: [
			{pattern: 'public/resources/js/lib/gl-matrix.js', included: true},
			{pattern: 'public/resources/js/lib/gl-matrix-patch.js', included: true},
			{pattern: 'public/extjs/build/ext-all-debug.js', included: true},
			{pattern: 'public/app/**/*.js', included: false},
			{pattern: 'public/lib/**/*.js', included: false},
			{pattern: 'test/app/**/*.js', included: false},
			{pattern: 'test/FourJS/**/*.js', included: false},
			{pattern: 'test/test-main.js', included: true}
		],
		exclude: [ ],
		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: { },
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],
		// web server port
		port: 9876,
		// enable / disable colors in the output (reporters and logs)
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,
		//usePolling: true,
		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],
		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true
	});
};

