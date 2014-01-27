beforeEach(function() {
	jasmine.CATCH_EXCEPTIONS = false;
	
	jasmine.addMatchers({

		toHaveMemberWithName: function() {
			return {
				compare: function(actual, expected) {
					var object = actual;
					return {
						pass: object[expected] !== undefined
					};
				}
			};
		}

	});
});
