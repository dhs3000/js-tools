describe("The 'mixin' function", function () {

	it("mixes an array of objects together", function () {
		var a = {
				a: 23
			},
			b = {
				b: 24
			},
			result = mixin(a, b);

		expect(a.a)
			.toBeDefined();
		expect(a.b)
			.toBeUndefined();
		expect(b.a)
			.toBeUndefined();
		expect(b.b)
			.toBeDefined();

		expect(result.a)
			.toBeDefined();
		expect(result.b)
			.toBeDefined();
	});

	it("mixes a class and an object togethger", function () {
		function A(name) {
			this.name;
		}
		A.prototype.describe = function () {
			return "I am " + this.name;
		};

		var withAge = {
				age: 24
			},
			result = mixin(A, withAge);

		expect(result.describe)
			.toBeDefined();
		expect(result.name)
			.toBeUndefined();

		expect(result.age)
			.toBeDefined();
	});

	it("mixes an object that can be used as prototype for a class", function () {

		var describable = {
			describe: function () {
				return "I am " + this.name;
			}
		};

		function Person(name) {
			this.name = name;
		}
		Person.prototype = mixin(describable);

		expect(Person.prototype.describe)
			.toBeDefined();

		var person = new Person("Hans");

		expect(person.describe)
			.toBeDefined();
		expect(person.describe())
			.toEqual("I am Hans");

	});

	it("mixes in another class that can be used as prototype for a class", function () {

		function Describable() {}
		Describable.prototype = {
			describe: function () {
				return "I am " + this.name;
			}
		};

		function Person(name) {
			this.name = name;
		}
		Person.prototype = mixin(Describable);

		expect(Person.prototype.describe)
			.toBeDefined();

		var person = new Person("Hans");

		expect(person.describe)
			.toBeDefined();
		expect(person.describe())
			.toEqual("I am Hans");

	});

	it("mixes in another class that can be used as prototype for a class and that can call the 'super' constructor", function () {

		function Person(name) {
			this.name = name;
		}

		Person.prototype = {
			describe: function () {
				return "I am " + this.name;
			}
		};

		function Employee(name, department) {
			Person.call(this, name);
			this.department = department;
		}

		Employee.prototype = mixin(Person, {
			work: function () {
				return "I do my work at " + this.department;
			}
		});

		var employee = new Employee("Hans", "IT office");

		expect(employee.describe())
			.toEqual("I am Hans");
		expect(employee.work())
			.toEqual("I do my work at IT office");

	});

	it("can check if an abstract method is implemented", function () {
		var describable = {
			name: mixin.abstract,

			describe: function () {
				return "I am " + this.name;
			}
		};

		function Person(name) {
			this._name = name;
		}

		function mixinWithImplementedMethod() {
			Person.prototype = mixin(describable, {
				name: function () {
					return this._name;
				}
			});
		}

		expect(mixinWithImplementedMethod)
			.not.toThrow();

		function mixinWithNotImplementedMethod() {
			Person.prototype = mixin(describable, {
				fullname: function () {
					return this._name;
				}
			});
		}

		expect(mixinWithNotImplementedMethod)
			.toThrow();
	});

	describe("allows to mark a method as 'expectRuntimeImplementation'", function () {

		var describable = {
			getName: mixin.expectRuntimeImplementation,

			describe: function () {
				return "I am " + this.getName();
			}
		};

		it("which throws an error if it is called and not implemented ", function () {
			function Person(firstname) {
				this.firstname = firstname;
			}
			Person.prototype = mixin(describable);

			function callMixinMethod() {
				new Person("Hans")
					.describe();
			}

			expect(callMixinMethod)
				.toThrow(Error("Method not implemented!"));
		});

		it("which does not throws an error if it is called and implemented ", function () {
			function Person(firstname) {
				this.getName = function() {
					return firstname;
				}
			}
			Person.prototype = mixin(describable);

			function callMixinMethod() {
				new Person("Hans")
					.describe();
			}

			expect(callMixinMethod)
				.not.toThrow();
		});
	});

	it("does not check if a method marked as 'expectRuntimeImplementation' is implemented", function () {
		var describable = {
			name: mixin.expectRuntimeImplementation,

			describe: function () {
				return "I am " + this.name;
			}
		};

		function mixinWithImplementedMethod() {
			function Person(name) {
				this.name = name;
			}
			Person.prototype = mixin(describable);
		}

		expect(mixinWithImplementedMethod)
			.not.toThrow();

		function mixinWithNotImplementedMethod() {
			function Person(fullname) {
				this.fullname = fullname;
			}
			Person.prototype = mixin(describable);
		}

		expect(mixinWithNotImplementedMethod)
			.not.toThrow();
	});
});
