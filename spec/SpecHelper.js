beforeEach(function () {
	jasmine.CATCH_EXCEPTIONS = false;

	jasmine.addMatchers({

		toEqualWithoutWhitespace: function () {
			return {
				compare: function (actual, expected) {
					var removeMultipleWhitespace = function (str) {
						return str.replace(/\s{2,}/g, ' ');
					};
					return {
						pass: removeMultipleWhitespace(actual) === removeMultipleWhitespace(expected)
					};
				}
			};
		},

		toHaveMemberWithName: function () {
			return {
				compare: function (actual, expected) {
					var object = actual;
					return {
						pass: object[expected] !== undefined
					};
				}
			};
		},

		toBeInstanceOf: function () {
			return {
				compare: function (actual, expected) {
					var object = actual,
						result = (object instanceof expected);

					return {
						pass: result
					};
				}
			};
		}

	});
});
