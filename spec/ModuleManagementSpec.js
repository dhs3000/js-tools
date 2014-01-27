
describe("ModuleManagement", function() {
	var f = window.Functions;
	var m = undefined;

	beforeEach(function() {
		m = new ModuleManagement(f);
	});

	// fuer @super(): ist callee dann this / init? so dass man @super global registrieren kann? wir
	// sind it() definiert? global...
	// this.@super()
	// und super am prototypen deklarieren
	// nur wenn init @super enthaelt
	// wenn kein init, dann eines kreieren, dass super aufruft

	describe("define", function() {

		function defineTestModuleWithPrivateMember(m, name) {
			m.define(name, function() {
				'use strict';

				var messages = [];

				return {
				    logThat : function(msg) {
					    messages.push(msg);
				    },

				    finish : function() {
					    console.log("All messages:\n" + messages.join('\n'));
					    messages = [];
				    }
				};
			});
		}
		
		function getGlobal(name) {
			return window[name];
		}
		
		it("Without define no modules avaliable", function() {
			expect(m.getModules()).toEqual({});
		});
		
		it("One defined module should be available", function() {
			defineTestModuleWithPrivateMember(m, 'LOGGER');
			
			expect(m.getModules()).toHaveMemberWithName('LOGGER');
			expect(m.getModule('LOGGER')).toBeDefined();
		});
		
		it("Private vars in module should no be public accessible", function() {
			defineTestModuleWithPrivateMember(m, 'LOGGER');
			
			var l = m.getModule('LOGGER');
			expect(l.logThat).toBeDefined();
			expect(l.messages).not.toBeDefined();
		});

		it("One module should be injected into another", function() {
			var a = m.define('ModuleA', {
				name: 'ModuleA'
			});
			
			var u = m.define('USE_Module', function(ModuleA) {
				return {
					getModuleA: function() {
						return ModuleA;
					},
					getModuleAName: function() {
						return ModuleA.name;
					}
				};
			});
			
			expect(getGlobal('ModuleA')).toBeUndefined();
			expect(u.getModuleA()).toEqual(a);
			expect(u.getModuleAName()).toEqual("ModuleA");
		});

		it("Calling with the right module", function(/* potential modulues this one is depending on */) {
			var c = m.defineClass('Callable', function() {
				return function() {
					this.calls = 0;
					this.call = function() {
						calls++;
					};
				};
			});
			
			var fromWithModule;
			m.withModules(function(Callable) {
				fromWithModule = Callable;
			});
			
			expect(fromWithModule).toEqual(c);
		});

		it("Inject modules and classes", function() {
			var l = m.define("LOGGER", function() {
				var messages = [];
				return {
					log: function(msg) {
						messages.push(msg);
					},
					messages: messages
				};
			});
			
			m.defineClass('Greeter', function(LOGGER) {
				'use strict';
				function G(greeting) {
					this.greeting = greeting;
				}
				G.prototype.greet = function(name) {
					LOGGER.log(this.greeting + " " + name);
				};
				return G;
			});

			m.withModules(function(Greeter) {
				'use strict';

				var g = new Greeter("Ich bin ein gescopter Grüßer, und Sie sind");

				g.greet("eine Wurst!");

			});

			expect(l.messages.length).toEqual(1);
			expect(l.messages[0]).toEqual("Ich bin ein gescopter Grüßer, und Sie sind eine Wurst!");
			
		});


	});

});

/*

mm.withModules(function($, LOGGER) {
	'use strict';
	// Scope mit Zugriff auf das Modul LOGGER.
	// Exportiert kein eigenes Modul.
	// Kann z.B. jQuery-Handler registrieren etc.
	LOGGER.logThat("Scope mit Zugriff auf LOGGER");
});

mm.define('PRINTER', function(LOGGER) {
	'use strict';

	return {
		print : function(msg) {
			LOGGER.logThat(msg);
		}
	};

});

var l = mm.getModule('LOGGER');

mm.getModule('PRINTER').print("PRINTTT");

var G = mm.getModule('Greeter');

var g = new G("Hello Sie da, ");

g.greet("Herr Hans");

l.finish();

*/