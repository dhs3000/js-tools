describe("The 'Functions' helper ", function () {
	var f = window.Functions;

	describe("'isFunction'", function () {
		it("recognizes a function as function", function () {
			function test() {}

			expect(f.isFunction(test))
				.toBeTruthy();
		});

		it("recognizes an object as no function", function () {
			var test = {};

			expect(f.isFunction(test))
				.toBeFalsy();
		});

		it("recognizes 'undefined' as no function", function () {
			var test = undefined;

			expect(f.isFunction(test))
				.toBeFalsy();
		});
	});

	describe("'args' gets", function () {
		it("all arguments of a function if called without start index", function () {
			function test() {
				return f.args(arguments);
			}

			expect(test('EINS', 2))
				.toEqual(["EINS", 2]);
		});

		it("all except first arguments of a function if called with a start index of '1'", function () {
			function test() {
				return f.args(arguments, 1);
			}

			expect(test('EINS', 2))
				.toEqual([2]);
		});
	});

	describe("'parameterNamesOf' returns", function () {
		it("an empty array for a parameterless function", function () {
			function test() {}

			expect(f.parameterNamesOf(test))
				.toEqual([]);
		});

		it("an array with the name of the parameter of a function with one parameter", function () {
			function test(paramA) {}

			expect(f.parameterNamesOf(test))
				.toEqual(['paramA']);
		});

		it("an array with the two names of the parameter of a function with two parameter", function () {
			function test(paramA, paramB) {}

			expect(f.parameterNamesOf(test))
				.toEqual(['paramA', 'paramB']);
		});

		it("an array with the three names of the parameter of a function with three parameter", function () {
			function test(paramA, paramB, paramC) {}

			expect(f.parameterNamesOf(test))
				.toEqual(['paramA', 'paramB', 'paramC']);
		});
	});

	describe("'body'", function () {
		it("gets the body of a function", function () {
			function test() {
				function intern() {
					return 'bla';
				}
				return intern;
			}

			expect(f.body(test))
				.toEqualWithoutWhitespace('function intern() { return \'bla\'; } return intern;');
		});

	});

});
