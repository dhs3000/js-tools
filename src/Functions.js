/*
 * Copyright 2012-2013 Dennis Hörsch.
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
 * Utilities for meta function handling.
 */
(function(window) {
	'use strict';

	// http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
    	FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    	FN_ARG_SPLIT = /,/,
    	FN_ARG = /^\s*(.*)\s*$/,
    	
    	isFunction = function(fn) {
	  		return (typeof fn == 'function');
		};
	
	window.Functions = {
		/**
		 * Extracts the names of the parameter of the given function as String Array.
		 */
		parameterNamesOf: function(fn) {
			if (!isFunction(fn)) {
				throw "Argument must be a function!";
			}

			var parameterNames = [],
				fnText = fn.toString().replace(STRIP_COMMENTS, ''),
				argDecl = fnText.match(FN_ARGS);

			if (argDecl[1].length == 0) {
				return parameterNames;
			}

			var list = argDecl[1].split(FN_ARG_SPLIT),
				i = 0,
				l = list.length;
			
			for (; i < l; i++) {
				list[i].replace(FN_ARG, function(all, name) {
					parameterNames.push(name);
				});
			}

			return parameterNames;
		},
		
		isFunction: isFunction
	};
	
}(window));