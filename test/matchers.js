function prettyPrint(a) {
	var r = [];
	for (var i = 0; i < a.length; i++) {
		r.push(a[i]);
	}
	return '[' + r.join(',') + ']';
}
var customMatchers = {
	toBeCloseToArray: function (util, customEqualityTesters) {
		return {
			compare: function (actual, expected, precision) {

				var result = {
					pass: true
				};

				for (var i = 0; i < expected.length; i++) {
					// TODO: find another way D:
					result.pass &= jasmine.matchers.toBeCloseTo().compare(expected[i], actual[i], precision).pass;
				}
				if (!result.pass) {
					// TODO: write a pretty print for typed arrays
					result.message = 'Expected ' + prettyPrint(expected) + ' to be close to ' + prettyPrint(actual);
				}

				return result;
			}
		}
	}
};

beforeEach(function () {
	jasmine.addMatchers(customMatchers);
});
