/**
 * Hilfe um 'Module' in ihrem eigenen Scope auszuführen und ihre Abhängigkeiten zu deklarieren. Ausßerdem lassen sich Module, wenn gewünscht global
 * registrieren. Verwendung bspw.:
 * 
 * mm.define('P', function() { 'use strict';
 * 
 * var attr = "PRIVATE";
 * 
 * return { get: function() { return attr; },
 * 
 * set: function(data) { attr = data; } }; });
 * 
 * mm.define('USER', function(P) { 'use strict';
 * 
 * return { print: function() { console.log("P.get() = " + P.get()); } };
 * 
 * });
 * 
 * var o = mm.define('ONLY', { // keine Abhängigkeiten say: function(text) { console.log("I say '" + text + "'!"); } });
 * 
 * 
 * 
 * @param window
 * @param _
 */
(function(window, Functions) {
	'use strict';

	function assert(condition, msg) {
	  if (!condition) {
		throw 'Assertion error: ' + msg;
	  }
	}
	
	function ModuleManagement(Functions) {
	  	var isFunction = Functions.isFunction,
	  		parameterNamesOf = Functions.parameterNamesOf,
	  		modules = {},
	  		getModules = function() {
	  			return modules;
	  		},
	  		getModule = function(name) {
    			var module = modules[name];
    
    			if (!module) {
    				module = window[name];
    			}
    
    			if (!module) {
    				throw "Can not find module or global variable with name '" + name + "'!";
    			}
    
    			return module;
    		},
    	  	injectModulesIfNecessary = function(fnOrObj) {
    			return isFunction(fnOrObj) ? withModules(fnOrObj) : fnOrObj;
    		},
    		withModules = function(fn) {
    			var parameterNames = parameterNamesOf(fn), 
    				args = [], 
    				i = 0, 
    				l = parameterNames.length;
    			for (; i < l; i++) {
    				args.push(getModule(parameterNames[i]));
    			}
    
    			return fn.apply(null, args);
    		};
		
		/**
		 * Erstellt ein benanntes Modul.
		 * Das Modul kann eine Funktion sein, die dann ausgewertet wird oder direkt ein Objekt.
		 * Wenn kein Modul angegeben ist, wird ein leeres Objekt zurükgegeben.
		 */
    	this.module = function(name, module) {
			assert(!modules[name], "Module '" + name + "' already exists");

			return modules[name] = module ? (isFunction(module) ? module() : module) : {};
		};


		/**
		 * Erstellt eine benannte Klasse (Modul). Wertet im Gegensatz zu module() keine Objekte/Funktionen aus.
		 */
		this.moduleClass = function(name, moduleClass) {
			assert(!modules[name], "Module/Class '" + name + "' already exists");
			assert(moduleClass, "moduleClass is required!");
			
			return modules[name] = moduleClass;
		};

		this.getModule = getModule;
		this.getModules = getModules;

		/**
		 * Führt die Funktion mit ihren Abhängigkeiten (Modulen) als Parameter aus. Wirft einen Error wenn eine Abhaengigkeit nicht aufgelöst werden kann.
		 */
		this.withModules = withModules;

		/**
		 * Definiert ein Modul. Modul kann eine Funktion sein und über ihre Argumente die Abhängigkeiten zu andren Modulen oder globalen Variablen
		 * (jQuery/$) angeben. Nicht auflösbare Abhängigkeiten führen zu einem Fehler.
		 */
		this.define = function(name, module) {
			return this.module(name, injectModulesIfNecessary(module));
		};
		
		/**
		 * Definiert eine Klasse im Modulsystem. 
		 */
		this.defineClass = function(name, moduleClass) {
			return this.moduleClass(name, injectModulesIfNecessary(moduleClass));		
		};
	}

	window.ModuleManagement = ModuleManagement;
	
}(window, Functions));

