describe("The 'ModuleManagement'", function () {
	var f = window.Functions;
	var m = undefined;

	beforeEach(function () {
		m = new ModuleManagement(f);
	});

	function defineTestModuleWithPrivateMember(m, name) {
		m.define(name, function () {
			'use strict';

			var messages = [];

			return {
				logThat: function (msg) {
					messages.push(msg);
				},

				finish: function () {
					console.log("All messages:\n" + messages.join('\n'));
					messages = [];
				}
			};
		});
	}

	function getGlobal(name) {
		return window[name];
	}

	it("has no modules if nothing is defined", function () {
		expect(m.getModules())
			.toEqual({});
	});

	it("has one module if one is defined", function () {
		defineTestModuleWithPrivateMember(m, 'LOGGER');

		expect(m.getModules())
			.toHaveMemberWithName('LOGGER');
		expect(m.getModule('LOGGER'))
			.toBeDefined();
	});

	it("and nobody else ca access private variables defined inside a module", function () {
		defineTestModuleWithPrivateMember(m, 'LOGGER');

		var l = m.getModule('LOGGER');
		expect(l.logThat)
			.toBeDefined();
		expect(l.messages)
			.not.toBeDefined();
	});

	it("injects a module into another depending module", function () {
		var a = m.define('ModuleA', {
			name: 'ModuleA'
		});

		var u = m.define('USE_Module', function (ModuleA) {
			return {
				getModuleA: function () {
					return ModuleA;
				},
				getModuleAName: function () {
					return ModuleA.name;
				}
			};
		});

		expect(getGlobal('ModuleA'))
			.toBeUndefined();
		expect(u.getModuleA())
			.toEqual(a);
		expect(u.getModuleAName())
			.toEqual("ModuleA");
	});

	it("executes a function block that declares dependencies with the right dependency", function () {
		var c = m.defineClass('Callable', function () {
			return function () {
				this.calls = 0;
				this.call = function () {
					calls++;
				};
			};
		});

		var fromWithModule;
		m.withModules(function (Callable) {
			fromWithModule = Callable;
		});

		expect(fromWithModule)
			.toEqual(c);
	});

	it("injects modules and classes into other depending modules/objects", function () {
		var l = m.define("LOGGER", function () {
			var messages = [];
			return {
				log: function (msg) {
					messages.push(msg);
				},
				messages: messages
			};
		});

		m.defineClass('Greeter', function (LOGGER) {
			'use strict';

			function G(greeting) {
				this.greeting = greeting;
			}
			G.prototype.greet = function (name) {
				LOGGER.log(this.greeting + " " + name);
			};
			return G;
		});

		m.withModules(function (Greeter) {
			'use strict';

			var g = new Greeter("Ich bin ein gescopter Grüßer, und Sie sind");

			g.greet("eine Wurst!");

		});

		expect(l.messages.length)
			.toEqual(1);
		expect(l.messages[0])
			.toEqual("Ich bin ein gescopter Grüßer, und Sie sind eine Wurst!");

	});
});
