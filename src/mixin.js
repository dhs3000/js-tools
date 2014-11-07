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

/** Mixes all given Objects or Functions (their protoype) together to one Object.
 * Methods in 'base objects' / traits can be marked as abstract vio mixin.abstract.
 * Use options.isCheckAbstractImplementations to enable
 */
var mixin = (function (options) {
	"use strict";

	var defaultOptions = {
			isCheckAbstractImplementations: false
		},

		map = function (args, fn) {
			return Array.prototype.map.call(args, fn);
		},

		asArray = function (args) {
			return Array.prototype.slice.call(args);
		},

		mergeInto = function (result, obj) {
			Object.keys(obj)
				.forEach(function (key) {
					result[key] = obj[key];
				});
			return result;
		},

		objOrPrototype = function (objOrClass) {
			return objOrClass.prototype ? objOrClass.prototype : objOrClass;
		},

		justMixin = function mixin() {
			return map(arguments, objOrPrototype)
				.reduce(mergeInto, {});
		},

		mixinWithAbstractMethodCheck = function mixinWithAbstractMethodCheck() {
			var result = justMixin.apply(null, asArray(arguments));

			Object.keys(result)
				.forEach(function (key) {
					if (result[key] === mixin.abstract) {
						throw Error("Method '" + key + "' needs to be overridden!");
					}
				});
			return result;
		},

		options_ = [defaultOptions, options].reduce(mergeInto, {}),

		mixin = options_.isCheckAbstractImplementations ?
		mixinWithAbstractMethodCheck :
		justMixin;

	/** Marks a method as abstract.
	 * This means it must be implemented at creation
	 * time (as prototype property).
	 */
	mixin.abstract = function () {
		throw new Error("Abstract method called!");
	};

	/** Marks a method as to be implemented, but possible
	 * at runtime, not creation time. */
	mixin.expectRuntimeImplementation = function () {
		throw new Error("Method not implemented!");
	};

	/** Placeholder for a hook method that might be overridden. */
	mixin.noop = function () {};

	return mixin;
}(mixinOptions));
