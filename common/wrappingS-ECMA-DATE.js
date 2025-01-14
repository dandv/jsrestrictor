/** \file
 * \brief Wrappers for the Date object
 *
 *  \author Copyright (C) 2019  Libor Polcak
 *  \author Copyright (C) 2020  Peter Hornak
 *
 *  \license SPDX-License-Identifier: GPL-3.0-or-later
 */
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//

/*
 * Create private namespace
 */
(function() {
	var wrappers = [
		{
			parent_object: "window",
			parent_object_property: "Date",
			wrapped_objects: [
				{
					original_name: "Date",
					wrapped_name: "originalDateConstructor",
				},
			],
			helping_code: rounding_function + noise_function +
				`
				var precision = args[0];
				var doNoise = args[1];
				var func = rounding_function;
				if (doNoise) {
					func = noise_function;
				}
				`,
			wrapping_function_args: "",
			wrapping_function_body: `
				var wrapped = new originalDateConstructor(...arguments);
				let cachedValue;
				if (arguments[0] !== undefined) {
					// Don't change lastValue if custom arguments are passed
					 cachedValue = lastValue;
				}
				var changedValue = func(wrapped.getTime(), precision);
				if (cachedValue) {
					// Don't change lastValue if custom arguments are passed
					 lastValue = cachedValue;
				}
				wrapped.setTime(changedValue);
				return wrapped;
				`,
			wrapper_prototype: "originalDateConstructor",
			post_wrapping_code: [
				{
					code_type: "function_define",
					original_function: "originalDateConstructor.now",
					parent_object: "window.Date",
					parent_object_property: "now",
					wrapping_function_args: "",
					wrapping_function_body: "return func(originalF.call(Date), precision);",
				},
				{
					code_type: "function_export",
					parent_object: "window.Date",
					parent_object_property: "parse",
					export_function_name: "originalDateConstructor.parse",
				},
				{
					code_type: "function_export",
					parent_object: "window.Date",
					parent_object_property: "UTC",
					export_function_name: "originalDateConstructor.UTC",
				},
				{
					code_type: "assign",
					parent_object: "window.Date",
					parent_object_property: "prototype",
					value: "originalDateConstructor.prototype",
				},
				{
					code_type: "assign",
					parent_object: "window.Date.prototype",
					parent_object_property: "constructor",
					value: "window.Date",
				},
			]
		},
	]
	add_wrappers(wrappers);
})()
