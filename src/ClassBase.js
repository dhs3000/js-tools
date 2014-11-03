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
 * Base object to declare classes.
 *
 *
 */
(function (window, Functions) {
	'use strict';

	var getOrCreateConstructor = function (superClass, constr) {
		if (constr) {
			return function SuperAwareConstructor() {

				// Enable call to this.superConstructor(arguments)
				this.superConstructor = function () {
					superClass.prototype.constructor.apply(this, Functions.args(arguments));
				};

				constr.apply(this, Functions.args(arguments));

				delete this.superConstructor;
			};
		}
		return function SuperConstructor() {
			var args = Functions.args(arguments);
			superClass.prototype.constructor.apply(this, args);
		};
	};

	var getMethodInPrototypeChain = function (methodName, p) {
		if (!p) {
			return undefined;
		}
		if (p[methodName]) {
			return p[methodName];
		}
		return getMethodInPrototypeChain(methodName, Object.getPrototypeOf(p));
	};

	function ClassBase() {

	}

	ClassBase.extend = function (constructorAndMethods) {
		var superClass = this;

		var subClass = getOrCreateConstructor(superClass, constructorAndMethods.init);

		// create prototype of subClass without invoking the parents constructor
		subClass.prototype = Object.create(superClass.prototype);
		subClass.prototype.constructor = subClass;

		// Enable call to super methods: this.superMethod(referenceToThisMethod, arguments)
		// So the method must be a named function and named like the super method.
		// method: function method() {
		//     this.superMethod(method, ...
		// }
		subClass.prototype.superMethod = function (thisMethod /*args*/ ) {
			var m = thisMethod.__superMethod;
			if (!m) {
				throw new Error("Can't find super method '" + thisMethod + "'!");
			}

			return m.apply(this, Functions.args(arguments, 1));
		};

		// Copy this method so that it is available in the new Class
		subClass.extend = ClassBase.extend;

		for (var methodName in constructorAndMethods) {
			if (methodName !== "init" && constructorAndMethods.hasOwnProperty(methodName)) {
				var method = constructorAndMethods[methodName];

				method.__superMethod = getMethodInPrototypeChain(methodName, superClass.prototype);
				subClass.prototype[methodName] = method;
			}
		}

		return subClass;
	};

	window.ClassBase = ClassBase;

}(window, Functions));
