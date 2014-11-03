/*!
 * Copyright 2013-2014 Dennis Hörsch.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Helper to declare modules to be used in a specific 'scope' with their dependencies.
 *
 * @param window
 * @param Functions
 */
(function (window, Functions, Debug) {
	'use strict';

	var assert = Debug.assert;

	function ModuleManagement(Functions) {
		var isFunction = Functions.isFunction,
			parameterNamesOf = Functions.parameterNamesOf,
			modules = {},
			getModules = function () {
				return modules;
			},
			getModule = function (name) {
				var module = modules[name];

				if (!module) {
					module = window[name];
				}

				if (!module) {
					throw "Can not find module or global variable with name '" + name + "'!";
				}

				return module;
			},
			injectModulesIfNecessary = function (fnOrObj) {
				return isFunction(fnOrObj) ? withModules(fnOrObj) : fnOrObj;
			},
			withModules = function (fn) {
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
		this.module = function (name, module) {
			assert(!modules[name], "Module '" + name + "' already exists");

			return modules[name] = module ? (isFunction(module) ? module() : module) : {};
		};

		/**
		 * Erstellt eine benannte Klasse (Modul). Wertet im Gegensatz zu module() keine Objekte/Funktionen aus.
		 */
		this.moduleClass = function (name, moduleClass) {
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
		this.define = function (name, module) {
			return this.module(name, injectModulesIfNecessary(module));
		};

		/**
		 * Definiert eine Klasse im Modulsystem.
		 */
		this.defineClass = function (name, moduleClass) {
			return this.moduleClass(name, injectModulesIfNecessary(moduleClass));
		};
	}

	window.ModuleManagement = ModuleManagement;

}(window, Functions, Debug));
