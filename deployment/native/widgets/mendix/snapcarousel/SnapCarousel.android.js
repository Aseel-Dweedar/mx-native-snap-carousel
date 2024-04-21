import React, { Component, PureComponent, useState, useRef, useCallback, useEffect, createElement } from 'react';
import { FlatList, Animated, ScrollView, I18nManager, View, Easing, StyleSheet, TouchableOpacity, Image, findNodeHandle, ActivityIndicator, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';

function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var normalizeColors;
var hasRequiredNormalizeColors;

function requireNormalizeColors () {
	if (hasRequiredNormalizeColors) return normalizeColors;
	hasRequiredNormalizeColors = 1;

	function normalizeColor(color) {
	  if (typeof color === 'number') {
	    if (color >>> 0 === color && color >= 0 && color <= 0xffffffff) {
	      return color;
	    }
	    return null;
	  }
	  if (typeof color !== 'string') {
	    return null;
	  }
	  const matchers = getMatchers();
	  let match;

	  // Ordered based on occurrences on Facebook codebase
	  if (match = matchers.hex6.exec(color)) {
	    return parseInt(match[1] + 'ff', 16) >>> 0;
	  }
	  const colorFromKeyword = normalizeKeyword(color);
	  if (colorFromKeyword != null) {
	    return colorFromKeyword;
	  }
	  if (match = matchers.rgb.exec(color)) {
	    return (parse255(match[1]) << 24 |
	    // r
	    parse255(match[2]) << 16 |
	    // g
	    parse255(match[3]) << 8 |
	    // b
	    0x000000ff) >>>
	    // a
	    0;
	  }
	  if (match = matchers.rgba.exec(color)) {
	    // rgba(R G B / A) notation
	    if (match[6] !== undefined) {
	      return (parse255(match[6]) << 24 |
	      // r
	      parse255(match[7]) << 16 |
	      // g
	      parse255(match[8]) << 8 |
	      // b
	      parse1(match[9])) >>>
	      // a
	      0;
	    }

	    // rgba(R, G, B, A) notation
	    return (parse255(match[2]) << 24 |
	    // r
	    parse255(match[3]) << 16 |
	    // g
	    parse255(match[4]) << 8 |
	    // b
	    parse1(match[5])) >>>
	    // a
	    0;
	  }
	  if (match = matchers.hex3.exec(color)) {
	    return parseInt(match[1] + match[1] +
	    // r
	    match[2] + match[2] +
	    // g
	    match[3] + match[3] +
	    // b
	    'ff',
	    // a
	    16) >>> 0;
	  }

	  // https://drafts.csswg.org/css-color-4/#hex-notation
	  if (match = matchers.hex8.exec(color)) {
	    return parseInt(match[1], 16) >>> 0;
	  }
	  if (match = matchers.hex4.exec(color)) {
	    return parseInt(match[1] + match[1] +
	    // r
	    match[2] + match[2] +
	    // g
	    match[3] + match[3] +
	    // b
	    match[4] + match[4],
	    // a
	    16) >>> 0;
	  }
	  if (match = matchers.hsl.exec(color)) {
	    return (hslToRgb(parse360(match[1]),
	    // h
	    parsePercentage(match[2]),
	    // s
	    parsePercentage(match[3]) // l
	    ) | 0x000000ff) >>>
	    // a
	    0;
	  }
	  if (match = matchers.hsla.exec(color)) {
	    // hsla(H S L / A) notation
	    if (match[6] !== undefined) {
	      return (hslToRgb(parse360(match[6]),
	      // h
	      parsePercentage(match[7]),
	      // s
	      parsePercentage(match[8]) // l
	      ) | parse1(match[9])) >>>
	      // a
	      0;
	    }

	    // hsla(H, S, L, A) notation
	    return (hslToRgb(parse360(match[2]),
	    // h
	    parsePercentage(match[3]),
	    // s
	    parsePercentage(match[4]) // l
	    ) | parse1(match[5])) >>>
	    // a
	    0;
	  }
	  if (match = matchers.hwb.exec(color)) {
	    return (hwbToRgb(parse360(match[1]),
	    // h
	    parsePercentage(match[2]),
	    // w
	    parsePercentage(match[3]) // b
	    ) | 0x000000ff) >>>
	    // a
	    0;
	  }
	  return null;
	}
	function hue2rgb(p, q, t) {
	  if (t < 0) {
	    t += 1;
	  }
	  if (t > 1) {
	    t -= 1;
	  }
	  if (t < 1 / 6) {
	    return p + (q - p) * 6 * t;
	  }
	  if (t < 1 / 2) {
	    return q;
	  }
	  if (t < 2 / 3) {
	    return p + (q - p) * (2 / 3 - t) * 6;
	  }
	  return p;
	}
	function hslToRgb(h, s, l) {
	  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	  const p = 2 * l - q;
	  const r = hue2rgb(p, q, h + 1 / 3);
	  const g = hue2rgb(p, q, h);
	  const b = hue2rgb(p, q, h - 1 / 3);
	  return Math.round(r * 255) << 24 | Math.round(g * 255) << 16 | Math.round(b * 255) << 8;
	}
	function hwbToRgb(h, w, b) {
	  if (w + b >= 1) {
	    const gray = Math.round(w * 255 / (w + b));
	    return gray << 24 | gray << 16 | gray << 8;
	  }
	  const red = hue2rgb(0, 1, h + 1 / 3) * (1 - w - b) + w;
	  const green = hue2rgb(0, 1, h) * (1 - w - b) + w;
	  const blue = hue2rgb(0, 1, h - 1 / 3) * (1 - w - b) + w;
	  return Math.round(red * 255) << 24 | Math.round(green * 255) << 16 | Math.round(blue * 255) << 8;
	}
	const NUMBER = '[-+]?\\d*\\.?\\d+';
	const PERCENTAGE = NUMBER + '%';
	function call(...args) {
	  return '\\(\\s*(' + args.join(')\\s*,?\\s*(') + ')\\s*\\)';
	}
	function callWithSlashSeparator(...args) {
	  return '\\(\\s*(' + args.slice(0, args.length - 1).join(')\\s*,?\\s*(') + ')\\s*/\\s*(' + args[args.length - 1] + ')\\s*\\)';
	}
	function commaSeparatedCall(...args) {
	  return '\\(\\s*(' + args.join(')\\s*,\\s*(') + ')\\s*\\)';
	}
	let cachedMatchers;
	function getMatchers() {
	  if (cachedMatchers === undefined) {
	    cachedMatchers = {
	      rgb: new RegExp('rgb' + call(NUMBER, NUMBER, NUMBER)),
	      rgba: new RegExp('rgba(' + commaSeparatedCall(NUMBER, NUMBER, NUMBER, NUMBER) + '|' + callWithSlashSeparator(NUMBER, NUMBER, NUMBER, NUMBER) + ')'),
	      hsl: new RegExp('hsl' + call(NUMBER, PERCENTAGE, PERCENTAGE)),
	      hsla: new RegExp('hsla(' + commaSeparatedCall(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER) + '|' + callWithSlashSeparator(NUMBER, PERCENTAGE, PERCENTAGE, NUMBER) + ')'),
	      hwb: new RegExp('hwb' + call(NUMBER, PERCENTAGE, PERCENTAGE)),
	      hex3: /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	      hex4: /^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	      hex6: /^#([0-9a-fA-F]{6})$/,
	      hex8: /^#([0-9a-fA-F]{8})$/
	    };
	  }
	  return cachedMatchers;
	}
	function parse255(str) {
	  const int = parseInt(str, 10);
	  if (int < 0) {
	    return 0;
	  }
	  if (int > 255) {
	    return 255;
	  }
	  return int;
	}
	function parse360(str) {
	  const int = parseFloat(str);
	  return (int % 360 + 360) % 360 / 360;
	}
	function parse1(str) {
	  const num = parseFloat(str);
	  if (num < 0) {
	    return 0;
	  }
	  if (num > 1) {
	    return 255;
	  }
	  return Math.round(num * 255);
	}
	function parsePercentage(str) {
	  // parseFloat conveniently ignores the final %
	  const int = parseFloat(str);
	  if (int < 0) {
	    return 0;
	  }
	  if (int > 100) {
	    return 1;
	  }
	  return int / 100;
	}
	function normalizeKeyword(name) {
	  // prettier-ignore
	  switch (name) {
	    case 'transparent':
	      return 0x00000000;
	    // http://www.w3.org/TR/css3-color/#svg-color
	    case 'aliceblue':
	      return 0xf0f8ffff;
	    case 'antiquewhite':
	      return 0xfaebd7ff;
	    case 'aqua':
	      return 0x00ffffff;
	    case 'aquamarine':
	      return 0x7fffd4ff;
	    case 'azure':
	      return 0xf0ffffff;
	    case 'beige':
	      return 0xf5f5dcff;
	    case 'bisque':
	      return 0xffe4c4ff;
	    case 'black':
	      return 0x000000ff;
	    case 'blanchedalmond':
	      return 0xffebcdff;
	    case 'blue':
	      return 0x0000ffff;
	    case 'blueviolet':
	      return 0x8a2be2ff;
	    case 'brown':
	      return 0xa52a2aff;
	    case 'burlywood':
	      return 0xdeb887ff;
	    case 'burntsienna':
	      return 0xea7e5dff;
	    case 'cadetblue':
	      return 0x5f9ea0ff;
	    case 'chartreuse':
	      return 0x7fff00ff;
	    case 'chocolate':
	      return 0xd2691eff;
	    case 'coral':
	      return 0xff7f50ff;
	    case 'cornflowerblue':
	      return 0x6495edff;
	    case 'cornsilk':
	      return 0xfff8dcff;
	    case 'crimson':
	      return 0xdc143cff;
	    case 'cyan':
	      return 0x00ffffff;
	    case 'darkblue':
	      return 0x00008bff;
	    case 'darkcyan':
	      return 0x008b8bff;
	    case 'darkgoldenrod':
	      return 0xb8860bff;
	    case 'darkgray':
	      return 0xa9a9a9ff;
	    case 'darkgreen':
	      return 0x006400ff;
	    case 'darkgrey':
	      return 0xa9a9a9ff;
	    case 'darkkhaki':
	      return 0xbdb76bff;
	    case 'darkmagenta':
	      return 0x8b008bff;
	    case 'darkolivegreen':
	      return 0x556b2fff;
	    case 'darkorange':
	      return 0xff8c00ff;
	    case 'darkorchid':
	      return 0x9932ccff;
	    case 'darkred':
	      return 0x8b0000ff;
	    case 'darksalmon':
	      return 0xe9967aff;
	    case 'darkseagreen':
	      return 0x8fbc8fff;
	    case 'darkslateblue':
	      return 0x483d8bff;
	    case 'darkslategray':
	      return 0x2f4f4fff;
	    case 'darkslategrey':
	      return 0x2f4f4fff;
	    case 'darkturquoise':
	      return 0x00ced1ff;
	    case 'darkviolet':
	      return 0x9400d3ff;
	    case 'deeppink':
	      return 0xff1493ff;
	    case 'deepskyblue':
	      return 0x00bfffff;
	    case 'dimgray':
	      return 0x696969ff;
	    case 'dimgrey':
	      return 0x696969ff;
	    case 'dodgerblue':
	      return 0x1e90ffff;
	    case 'firebrick':
	      return 0xb22222ff;
	    case 'floralwhite':
	      return 0xfffaf0ff;
	    case 'forestgreen':
	      return 0x228b22ff;
	    case 'fuchsia':
	      return 0xff00ffff;
	    case 'gainsboro':
	      return 0xdcdcdcff;
	    case 'ghostwhite':
	      return 0xf8f8ffff;
	    case 'gold':
	      return 0xffd700ff;
	    case 'goldenrod':
	      return 0xdaa520ff;
	    case 'gray':
	      return 0x808080ff;
	    case 'green':
	      return 0x008000ff;
	    case 'greenyellow':
	      return 0xadff2fff;
	    case 'grey':
	      return 0x808080ff;
	    case 'honeydew':
	      return 0xf0fff0ff;
	    case 'hotpink':
	      return 0xff69b4ff;
	    case 'indianred':
	      return 0xcd5c5cff;
	    case 'indigo':
	      return 0x4b0082ff;
	    case 'ivory':
	      return 0xfffff0ff;
	    case 'khaki':
	      return 0xf0e68cff;
	    case 'lavender':
	      return 0xe6e6faff;
	    case 'lavenderblush':
	      return 0xfff0f5ff;
	    case 'lawngreen':
	      return 0x7cfc00ff;
	    case 'lemonchiffon':
	      return 0xfffacdff;
	    case 'lightblue':
	      return 0xadd8e6ff;
	    case 'lightcoral':
	      return 0xf08080ff;
	    case 'lightcyan':
	      return 0xe0ffffff;
	    case 'lightgoldenrodyellow':
	      return 0xfafad2ff;
	    case 'lightgray':
	      return 0xd3d3d3ff;
	    case 'lightgreen':
	      return 0x90ee90ff;
	    case 'lightgrey':
	      return 0xd3d3d3ff;
	    case 'lightpink':
	      return 0xffb6c1ff;
	    case 'lightsalmon':
	      return 0xffa07aff;
	    case 'lightseagreen':
	      return 0x20b2aaff;
	    case 'lightskyblue':
	      return 0x87cefaff;
	    case 'lightslategray':
	      return 0x778899ff;
	    case 'lightslategrey':
	      return 0x778899ff;
	    case 'lightsteelblue':
	      return 0xb0c4deff;
	    case 'lightyellow':
	      return 0xffffe0ff;
	    case 'lime':
	      return 0x00ff00ff;
	    case 'limegreen':
	      return 0x32cd32ff;
	    case 'linen':
	      return 0xfaf0e6ff;
	    case 'magenta':
	      return 0xff00ffff;
	    case 'maroon':
	      return 0x800000ff;
	    case 'mediumaquamarine':
	      return 0x66cdaaff;
	    case 'mediumblue':
	      return 0x0000cdff;
	    case 'mediumorchid':
	      return 0xba55d3ff;
	    case 'mediumpurple':
	      return 0x9370dbff;
	    case 'mediumseagreen':
	      return 0x3cb371ff;
	    case 'mediumslateblue':
	      return 0x7b68eeff;
	    case 'mediumspringgreen':
	      return 0x00fa9aff;
	    case 'mediumturquoise':
	      return 0x48d1ccff;
	    case 'mediumvioletred':
	      return 0xc71585ff;
	    case 'midnightblue':
	      return 0x191970ff;
	    case 'mintcream':
	      return 0xf5fffaff;
	    case 'mistyrose':
	      return 0xffe4e1ff;
	    case 'moccasin':
	      return 0xffe4b5ff;
	    case 'navajowhite':
	      return 0xffdeadff;
	    case 'navy':
	      return 0x000080ff;
	    case 'oldlace':
	      return 0xfdf5e6ff;
	    case 'olive':
	      return 0x808000ff;
	    case 'olivedrab':
	      return 0x6b8e23ff;
	    case 'orange':
	      return 0xffa500ff;
	    case 'orangered':
	      return 0xff4500ff;
	    case 'orchid':
	      return 0xda70d6ff;
	    case 'palegoldenrod':
	      return 0xeee8aaff;
	    case 'palegreen':
	      return 0x98fb98ff;
	    case 'paleturquoise':
	      return 0xafeeeeff;
	    case 'palevioletred':
	      return 0xdb7093ff;
	    case 'papayawhip':
	      return 0xffefd5ff;
	    case 'peachpuff':
	      return 0xffdab9ff;
	    case 'peru':
	      return 0xcd853fff;
	    case 'pink':
	      return 0xffc0cbff;
	    case 'plum':
	      return 0xdda0ddff;
	    case 'powderblue':
	      return 0xb0e0e6ff;
	    case 'purple':
	      return 0x800080ff;
	    case 'rebeccapurple':
	      return 0x663399ff;
	    case 'red':
	      return 0xff0000ff;
	    case 'rosybrown':
	      return 0xbc8f8fff;
	    case 'royalblue':
	      return 0x4169e1ff;
	    case 'saddlebrown':
	      return 0x8b4513ff;
	    case 'salmon':
	      return 0xfa8072ff;
	    case 'sandybrown':
	      return 0xf4a460ff;
	    case 'seagreen':
	      return 0x2e8b57ff;
	    case 'seashell':
	      return 0xfff5eeff;
	    case 'sienna':
	      return 0xa0522dff;
	    case 'silver':
	      return 0xc0c0c0ff;
	    case 'skyblue':
	      return 0x87ceebff;
	    case 'slateblue':
	      return 0x6a5acdff;
	    case 'slategray':
	      return 0x708090ff;
	    case 'slategrey':
	      return 0x708090ff;
	    case 'snow':
	      return 0xfffafaff;
	    case 'springgreen':
	      return 0x00ff7fff;
	    case 'steelblue':
	      return 0x4682b4ff;
	    case 'tan':
	      return 0xd2b48cff;
	    case 'teal':
	      return 0x008080ff;
	    case 'thistle':
	      return 0xd8bfd8ff;
	    case 'tomato':
	      return 0xff6347ff;
	    case 'turquoise':
	      return 0x40e0d0ff;
	    case 'violet':
	      return 0xee82eeff;
	    case 'wheat':
	      return 0xf5deb3ff;
	    case 'white':
	      return 0xffffffff;
	    case 'whitesmoke':
	      return 0xf5f5f5ff;
	    case 'yellow':
	      return 0xffff00ff;
	    case 'yellowgreen':
	      return 0x9acd32ff;
	  }
	  return null;
	}
	normalizeColors = normalizeColor;
	return normalizeColors;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedColorPropType;
var hasRequiredDeprecatedColorPropType;

function requireDeprecatedColorPropType () {
	if (hasRequiredDeprecatedColorPropType) return DeprecatedColorPropType;
	hasRequiredDeprecatedColorPropType = 1;

	const normalizeColor = requireNormalizeColors();

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const colorPropType = function (isRequired, props, propName, componentName, location, propFullName) {
	  const color = props[propName];
	  if (color == null) {
	    if (isRequired) {
	      return new Error('Required ' + location + ' `' + (propFullName || propName) + '` was not specified in `' + componentName + '`.');
	    }
	    return;
	  }
	  if (typeof color === 'number') {
	    // Developers should not use a number, but we are using the prop type
	    // both for user provided colors and for transformed ones. This isn't ideal
	    // and should be fixed but will do for now...
	    return;
	  }
	  if (typeof color === 'string' && normalizeColor(color) === null) {
	    return new Error('Invalid ' + location + ' `' + (propFullName || propName) + '` supplied to `' + componentName + '`: ' + color + '\n' + `Valid color formats are
  - '#f0f' (#rgb)
  - '#f0fc' (#rgba)
  - '#ff00ff' (#rrggbb)
  - '#ff00ff00' (#rrggbbaa)
  - 'rgb(255, 255, 255)'
  - 'rgba(255, 255, 255, 1.0)'
  - 'hsl(360, 100%, 100%)'
  - 'hsla(360, 100%, 100%, 1.0)'
  - 'transparent'
  - 'red'
  - 0xff00ff00 (0xrrggbbaa)
`);
	  }
	};
	const ColorPropType = colorPropType.bind(null, false /* isRequired */);
	ColorPropType.isRequired = colorPropType.bind(null, true /* isRequired */);
	DeprecatedColorPropType = ColorPropType;
	return DeprecatedColorPropType;
}

var propTypes = {exports: {}};

var reactIs = {exports: {}};

var reactIs_development = {};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactIs_development;

function requireReactIs_development () {
	if (hasRequiredReactIs_development) return reactIs_development;
	hasRequiredReactIs_development = 1;

	{
	  (function () {

	    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	    // nor polyfill, then a plain number is used for performance.
	    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
	    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
	    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
	    // (unstable) APIs that have been removed. Can we remove the symbols?

	    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
	    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
	    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
	    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
	    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
	    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
	    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
	    function isValidElementType(type) {
	      return typeof type === 'string' || typeof type === 'function' ||
	      // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
	    }
	    function typeOf(object) {
	      if (typeof object === 'object' && object !== null) {
	        var $$typeof = object.$$typeof;
	        switch ($$typeof) {
	          case REACT_ELEMENT_TYPE:
	            var type = object.type;
	            switch (type) {
	              case REACT_ASYNC_MODE_TYPE:
	              case REACT_CONCURRENT_MODE_TYPE:
	              case REACT_FRAGMENT_TYPE:
	              case REACT_PROFILER_TYPE:
	              case REACT_STRICT_MODE_TYPE:
	              case REACT_SUSPENSE_TYPE:
	                return type;
	              default:
	                var $$typeofType = type && type.$$typeof;
	                switch ($$typeofType) {
	                  case REACT_CONTEXT_TYPE:
	                  case REACT_FORWARD_REF_TYPE:
	                  case REACT_LAZY_TYPE:
	                  case REACT_MEMO_TYPE:
	                  case REACT_PROVIDER_TYPE:
	                    return $$typeofType;
	                  default:
	                    return $$typeof;
	                }
	            }
	          case REACT_PORTAL_TYPE:
	            return $$typeof;
	        }
	      }
	      return undefined;
	    } // AsyncMode is deprecated along with isAsyncMode

	    var AsyncMode = REACT_ASYNC_MODE_TYPE;
	    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
	    var ContextConsumer = REACT_CONTEXT_TYPE;
	    var ContextProvider = REACT_PROVIDER_TYPE;
	    var Element = REACT_ELEMENT_TYPE;
	    var ForwardRef = REACT_FORWARD_REF_TYPE;
	    var Fragment = REACT_FRAGMENT_TYPE;
	    var Lazy = REACT_LAZY_TYPE;
	    var Memo = REACT_MEMO_TYPE;
	    var Portal = REACT_PORTAL_TYPE;
	    var Profiler = REACT_PROFILER_TYPE;
	    var StrictMode = REACT_STRICT_MODE_TYPE;
	    var Suspense = REACT_SUSPENSE_TYPE;
	    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

	    function isAsyncMode(object) {
	      {
	        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

	          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
	        }
	      }
	      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
	    }
	    function isConcurrentMode(object) {
	      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
	    }
	    function isContextConsumer(object) {
	      return typeOf(object) === REACT_CONTEXT_TYPE;
	    }
	    function isContextProvider(object) {
	      return typeOf(object) === REACT_PROVIDER_TYPE;
	    }
	    function isElement(object) {
	      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	    }
	    function isForwardRef(object) {
	      return typeOf(object) === REACT_FORWARD_REF_TYPE;
	    }
	    function isFragment(object) {
	      return typeOf(object) === REACT_FRAGMENT_TYPE;
	    }
	    function isLazy(object) {
	      return typeOf(object) === REACT_LAZY_TYPE;
	    }
	    function isMemo(object) {
	      return typeOf(object) === REACT_MEMO_TYPE;
	    }
	    function isPortal(object) {
	      return typeOf(object) === REACT_PORTAL_TYPE;
	    }
	    function isProfiler(object) {
	      return typeOf(object) === REACT_PROFILER_TYPE;
	    }
	    function isStrictMode(object) {
	      return typeOf(object) === REACT_STRICT_MODE_TYPE;
	    }
	    function isSuspense(object) {
	      return typeOf(object) === REACT_SUSPENSE_TYPE;
	    }
	    reactIs_development.AsyncMode = AsyncMode;
	    reactIs_development.ConcurrentMode = ConcurrentMode;
	    reactIs_development.ContextConsumer = ContextConsumer;
	    reactIs_development.ContextProvider = ContextProvider;
	    reactIs_development.Element = Element;
	    reactIs_development.ForwardRef = ForwardRef;
	    reactIs_development.Fragment = Fragment;
	    reactIs_development.Lazy = Lazy;
	    reactIs_development.Memo = Memo;
	    reactIs_development.Portal = Portal;
	    reactIs_development.Profiler = Profiler;
	    reactIs_development.StrictMode = StrictMode;
	    reactIs_development.Suspense = Suspense;
	    reactIs_development.isAsyncMode = isAsyncMode;
	    reactIs_development.isConcurrentMode = isConcurrentMode;
	    reactIs_development.isContextConsumer = isContextConsumer;
	    reactIs_development.isContextProvider = isContextProvider;
	    reactIs_development.isElement = isElement;
	    reactIs_development.isForwardRef = isForwardRef;
	    reactIs_development.isFragment = isFragment;
	    reactIs_development.isLazy = isLazy;
	    reactIs_development.isMemo = isMemo;
	    reactIs_development.isPortal = isPortal;
	    reactIs_development.isProfiler = isProfiler;
	    reactIs_development.isStrictMode = isStrictMode;
	    reactIs_development.isSuspense = isSuspense;
	    reactIs_development.isValidElementType = isValidElementType;
	    reactIs_development.typeOf = typeOf;
	  })();
	}
	return reactIs_development;
}

var hasRequiredReactIs;

function requireReactIs () {
	if (hasRequiredReactIs) return reactIs.exports;
	hasRequiredReactIs = 1;
	(function (module) {

		{
		  module.exports = requireReactIs_development();
		}
} (reactIs));
	return reactIs.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var objectAssign;
var hasRequiredObjectAssign;

function requireObjectAssign () {
	if (hasRequiredObjectAssign) return objectAssign;
	hasRequiredObjectAssign = 1;

	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
	  if (val === null || val === undefined) {
	    throw new TypeError('Object.assign cannot be called with null or undefined');
	  }
	  return Object(val);
	}
	function shouldUseNative() {
	  try {
	    if (!Object.assign) {
	      return false;
	    }

	    // Detect buggy property enumeration order in older V8 versions.

	    // https://bugs.chromium.org/p/v8/issues/detail?id=4118
	    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
	    test1[5] = 'de';
	    if (Object.getOwnPropertyNames(test1)[0] === '5') {
	      return false;
	    }

	    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
	    var test2 = {};
	    for (var i = 0; i < 10; i++) {
	      test2['_' + String.fromCharCode(i)] = i;
	    }
	    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
	      return test2[n];
	    });
	    if (order2.join('') !== '0123456789') {
	      return false;
	    }

	    // https://bugs.chromium.org/p/v8/issues/detail?id=3056
	    var test3 = {};
	    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
	      test3[letter] = letter;
	    });
	    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
	      return false;
	    }
	    return true;
	  } catch (err) {
	    // We don't expect any of the above to throw, but better to be safe.
	    return false;
	  }
	}
	objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	  var from;
	  var to = toObject(target);
	  var symbols;
	  for (var s = 1; s < arguments.length; s++) {
	    from = Object(arguments[s]);
	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	    if (getOwnPropertySymbols) {
	      symbols = getOwnPropertySymbols(from);
	      for (var i = 0; i < symbols.length; i++) {
	        if (propIsEnumerable.call(from, symbols[i])) {
	          to[symbols[i]] = from[symbols[i]];
	        }
	      }
	    }
	  }
	  return to;
	};
	return objectAssign;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret_1;
var hasRequiredReactPropTypesSecret;

function requireReactPropTypesSecret () {
	if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
	hasRequiredReactPropTypesSecret = 1;

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
	ReactPropTypesSecret_1 = ReactPropTypesSecret;
	return ReactPropTypesSecret_1;
}

var has;
var hasRequiredHas;

function requireHas () {
	if (hasRequiredHas) return has;
	hasRequiredHas = 1;
	has = Function.call.bind(Object.prototype.hasOwnProperty);
	return has;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var checkPropTypes_1;
var hasRequiredCheckPropTypes;

function requireCheckPropTypes () {
	if (hasRequiredCheckPropTypes) return checkPropTypes_1;
	hasRequiredCheckPropTypes = 1;

	var printWarning = function () {};
	{
	  var ReactPropTypesSecret = requireReactPropTypesSecret();
	  var loggedTypeFailures = {};
	  var has = requireHas();
	  printWarning = function (text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {/**/}
	  };
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  {
	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;
	          var stack = getStack ? getStack() : '';
	          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
	        }
	      }
	    }
	  }
	}

	/**
	 * Resets warning cache when testing.
	 *
	 * @private
	 */
	checkPropTypes.resetWarningCache = function () {
	  {
	    loggedTypeFailures = {};
	  }
	};
	checkPropTypes_1 = checkPropTypes;
	return checkPropTypes_1;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var factoryWithTypeCheckers;
var hasRequiredFactoryWithTypeCheckers;

function requireFactoryWithTypeCheckers () {
	if (hasRequiredFactoryWithTypeCheckers) return factoryWithTypeCheckers;
	hasRequiredFactoryWithTypeCheckers = 1;

	var ReactIs = requireReactIs();
	var assign = requireObjectAssign();
	var ReactPropTypesSecret = requireReactPropTypesSecret();
	var has = requireHas();
	var checkPropTypes = requireCheckPropTypes();
	var printWarning = function () {};
	{
	  printWarning = function (text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}
	function emptyFunctionThatReturnsNull() {
	  return null;
	}
	factoryWithTypeCheckers = function (isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bigint: createPrimitiveTypeChecker('bigint'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),
	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    elementType: createElementTypeTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message, data) {
	    this.message = message;
	    this.data = data && typeof data === 'object' ? data : {};
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;
	  function createChainableTypeChecker(validate) {
	    {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;
	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
	          err.name = 'Invariant Violation';
	          throw err;
	        } else if (typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (!manualPropTypeCallCache[cacheKey] &&
	          // Avoid spamming the console because they are often not actionable except for lib authors
	          manualPropTypeWarningCount < 3) {
	            printWarning('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }
	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);
	    return chainedCheckType;
	  }
	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'), {
	          expectedType: expectedType
	        });
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
	  }
	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createElementTypeTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!ReactIs.isValidElementType(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      {
	        if (arguments.length > 1) {
	          printWarning('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
	        } else {
	          printWarning('Invalid argument supplied to oneOf, expected an array.');
	        }
	      }
	      return emptyFunctionThatReturnsNull;
	    }
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }
	      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
	        var type = getPreciseType(value);
	        if (type === 'symbol') {
	          return String(value);
	        }
	        return value;
	      });
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (has(propValue, key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	      printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') ;
	      return emptyFunctionThatReturnsNull;
	    }
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        printWarning('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
	        return emptyFunctionThatReturnsNull;
	      }
	    }
	    function validate(props, propName, componentName, location, propFullName) {
	      var expectedTypes = [];
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
	        if (checkerResult == null) {
	          return null;
	        }
	        if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
	          expectedTypes.push(checkerResult.data.expectedType);
	        }
	      }
	      var expectedTypesMessage = expectedTypes.length > 0 ? ', expected one of type [' + expectedTypes.join(', ') + ']' : '';
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function invalidValidatorError(componentName, location, propFullName, key, type) {
	    return new PropTypeError((componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + type + '`.');
	  }
	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (typeof checker !== 'function') {
	          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (has(shapeTypes, key) && typeof checker !== 'function') {
	          return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
	        }
	        if (!checker) {
	          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }
	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }
	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }
	        return true;
	      default:
	        return false;
	    }
	  }
	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // falsy value can't be a Symbol
	    if (!propValue) {
	      return false;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }
	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }
	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	  return ReactPropTypes;
	};
	return factoryWithTypeCheckers;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  var ReactIs = requireReactIs();

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  propTypes.exports = requireFactoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedEdgeInsetsPropType_1;
var hasRequiredDeprecatedEdgeInsetsPropType;

function requireDeprecatedEdgeInsetsPropType () {
	if (hasRequiredDeprecatedEdgeInsetsPropType) return DeprecatedEdgeInsetsPropType_1;
	hasRequiredDeprecatedEdgeInsetsPropType = 1;

	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/Rect.js
	 */
	const DeprecatedEdgeInsetsPropType = PropTypes.shape({
	  bottom: PropTypes.number,
	  left: PropTypes.number,
	  right: PropTypes.number,
	  top: PropTypes.number
	});
	DeprecatedEdgeInsetsPropType_1 = DeprecatedEdgeInsetsPropType;
	return DeprecatedEdgeInsetsPropType_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedImageSourcePropType;
var hasRequiredDeprecatedImageSourcePropType;

function requireDeprecatedImageSourcePropType () {
	if (hasRequiredDeprecatedImageSourcePropType) return DeprecatedImageSourcePropType;
	hasRequiredDeprecatedImageSourcePropType = 1;

	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/Image/ImageSource.js
	 */
	const ImageURISourcePropType = PropTypes.shape({
	  body: PropTypes.string,
	  bundle: PropTypes.string,
	  cache: PropTypes.oneOf(['default', 'force-cache', 'only-if-cached', 'reload']),
	  headers: PropTypes.objectOf(PropTypes.string),
	  height: PropTypes.number,
	  method: PropTypes.string,
	  scale: PropTypes.number,
	  uri: PropTypes.string,
	  width: PropTypes.number
	});
	const ImageSourcePropType = PropTypes.oneOfType([ImageURISourcePropType, PropTypes.number, PropTypes.arrayOf(ImageURISourcePropType)]);
	DeprecatedImageSourcePropType = ImageSourcePropType;
	return DeprecatedImageSourcePropType;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedLayoutPropTypes_1;
var hasRequiredDeprecatedLayoutPropTypes;

function requireDeprecatedLayoutPropTypes () {
	if (hasRequiredDeprecatedLayoutPropTypes) return DeprecatedLayoutPropTypes_1;
	hasRequiredDeprecatedLayoutPropTypes = 1;

	const PropTypes = propTypes.exports;
	const DimensionValuePropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const DeprecatedLayoutPropTypes = {
	  alignContent: PropTypes.oneOf(['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'stretch']),
	  alignItems: PropTypes.oneOf(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
	  alignSelf: PropTypes.oneOf(['auto', 'baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
	  aspectRatio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	  borderBottomWidth: PropTypes.number,
	  borderEndWidth: PropTypes.number,
	  borderLeftWidth: PropTypes.number,
	  borderRightWidth: PropTypes.number,
	  borderStartWidth: PropTypes.number,
	  borderTopWidth: PropTypes.number,
	  borderWidth: PropTypes.number,
	  bottom: DimensionValuePropType,
	  columnGap: PropTypes.number,
	  direction: PropTypes.oneOf(['inherit', 'ltr', 'rtl']),
	  display: PropTypes.oneOf(['flex', 'none']),
	  end: DimensionValuePropType,
	  flex: PropTypes.number,
	  flexBasis: DimensionValuePropType,
	  flexDirection: PropTypes.oneOf(['column', 'column-reverse', 'row', 'row-reverse']),
	  flexGrow: PropTypes.number,
	  flexShrink: PropTypes.number,
	  flexWrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
	  gap: PropTypes.number,
	  height: DimensionValuePropType,
	  inset: DimensionValuePropType,
	  insetBlock: DimensionValuePropType,
	  insetBlockEnd: DimensionValuePropType,
	  insetBlockStart: DimensionValuePropType,
	  insetInline: DimensionValuePropType,
	  insetInlineEnd: DimensionValuePropType,
	  insetInlineStart: DimensionValuePropType,
	  justifyContent: PropTypes.oneOf(['center', 'flex-end', 'flex-start', 'space-around', 'space-between', 'space-evenly']),
	  left: DimensionValuePropType,
	  margin: DimensionValuePropType,
	  marginBlock: DimensionValuePropType,
	  marginBlockEnd: DimensionValuePropType,
	  marginBlockStart: DimensionValuePropType,
	  marginBottom: DimensionValuePropType,
	  marginEnd: DimensionValuePropType,
	  marginHorizontal: DimensionValuePropType,
	  marginInline: DimensionValuePropType,
	  marginInlineEnd: DimensionValuePropType,
	  marginInlineStart: DimensionValuePropType,
	  marginLeft: DimensionValuePropType,
	  marginRight: DimensionValuePropType,
	  marginStart: DimensionValuePropType,
	  marginTop: DimensionValuePropType,
	  marginVertical: DimensionValuePropType,
	  maxHeight: DimensionValuePropType,
	  maxWidth: DimensionValuePropType,
	  minHeight: DimensionValuePropType,
	  minWidth: DimensionValuePropType,
	  overflow: PropTypes.oneOf(['hidden', 'scroll', 'visible']),
	  padding: DimensionValuePropType,
	  paddingBlock: DimensionValuePropType,
	  paddingBlockEnd: DimensionValuePropType,
	  paddingBlockStart: DimensionValuePropType,
	  paddingBottom: DimensionValuePropType,
	  paddingEnd: DimensionValuePropType,
	  paddingHorizontal: DimensionValuePropType,
	  paddingInline: DimensionValuePropType,
	  paddingInlineEnd: DimensionValuePropType,
	  paddingInlineStart: DimensionValuePropType,
	  paddingLeft: DimensionValuePropType,
	  paddingRight: DimensionValuePropType,
	  paddingStart: DimensionValuePropType,
	  paddingTop: DimensionValuePropType,
	  paddingVertical: DimensionValuePropType,
	  position: PropTypes.oneOf(['absolute', 'relative']),
	  right: DimensionValuePropType,
	  rowGap: PropTypes.number,
	  start: DimensionValuePropType,
	  top: DimensionValuePropType,
	  width: DimensionValuePropType,
	  zIndex: PropTypes.number
	};
	DeprecatedLayoutPropTypes_1 = DeprecatedLayoutPropTypes;
	return DeprecatedLayoutPropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedShadowPropTypesIOS_1;
var hasRequiredDeprecatedShadowPropTypesIOS;

function requireDeprecatedShadowPropTypesIOS () {
	if (hasRequiredDeprecatedShadowPropTypesIOS) return DeprecatedShadowPropTypesIOS_1;
	hasRequiredDeprecatedShadowPropTypesIOS = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const DeprecatedShadowPropTypesIOS = {
	  shadowColor: DeprecatedColorPropType,
	  shadowOffset: PropTypes.shape({
	    height: PropTypes.number,
	    width: PropTypes.number
	  }),
	  shadowOpacity: PropTypes.number,
	  shadowRadius: PropTypes.number
	};
	DeprecatedShadowPropTypesIOS_1 = DeprecatedShadowPropTypesIOS;
	return DeprecatedShadowPropTypesIOS_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedTransformPropTypes_1;
var hasRequiredDeprecatedTransformPropTypes;

function requireDeprecatedTransformPropTypes () {
	if (hasRequiredDeprecatedTransformPropTypes) return DeprecatedTransformPropTypes_1;
	hasRequiredDeprecatedTransformPropTypes = 1;

	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/private/_TransformStyle.js
	 */
	const DeprecatedTransformPropTypes = {
	  transform: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
	    perspective: PropTypes.number
	  }), PropTypes.shape({
	    rotate: PropTypes.string
	  }), PropTypes.shape({
	    rotateX: PropTypes.string
	  }), PropTypes.shape({
	    rotateY: PropTypes.string
	  }), PropTypes.shape({
	    rotateZ: PropTypes.string
	  }), PropTypes.shape({
	    scale: PropTypes.number
	  }), PropTypes.shape({
	    scaleX: PropTypes.number
	  }), PropTypes.shape({
	    scaleY: PropTypes.number
	  }), PropTypes.shape({
	    skewX: PropTypes.string
	  }), PropTypes.shape({
	    skewY: PropTypes.string
	  }), PropTypes.shape({
	    translateX: PropTypes.number
	  }), PropTypes.shape({
	    translateY: PropTypes.number
	  })]))
	};
	DeprecatedTransformPropTypes_1 = DeprecatedTransformPropTypes;
	return DeprecatedTransformPropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedImageStylePropTypes_1;
var hasRequiredDeprecatedImageStylePropTypes;

function requireDeprecatedImageStylePropTypes () {
	if (hasRequiredDeprecatedImageStylePropTypes) return DeprecatedImageStylePropTypes_1;
	hasRequiredDeprecatedImageStylePropTypes = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const DeprecatedLayoutPropTypes = requireDeprecatedLayoutPropTypes();
	const DeprecatedShadowPropTypesIOS = requireDeprecatedShadowPropTypesIOS();
	const DeprecatedTransformPropTypes = requireDeprecatedTransformPropTypes();
	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const DeprecatedImageStylePropTypes = {
	  ...DeprecatedLayoutPropTypes,
	  ...DeprecatedShadowPropTypesIOS,
	  ...DeprecatedTransformPropTypes,
	  backfaceVisibility: PropTypes.oneOf(['hidden', 'visible']),
	  backgroundColor: DeprecatedColorPropType,
	  borderBottomLeftRadius: PropTypes.number,
	  borderBottomRightRadius: PropTypes.number,
	  borderColor: DeprecatedColorPropType,
	  borderRadius: PropTypes.number,
	  borderTopLeftRadius: PropTypes.number,
	  borderTopRightRadius: PropTypes.number,
	  borderWidth: PropTypes.number,
	  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'scale-down']),
	  opacity: PropTypes.number,
	  overflow: PropTypes.oneOf(['hidden', 'visible']),
	  overlayColor: PropTypes.string,
	  tintColor: DeprecatedColorPropType,
	  resizeMode: PropTypes.oneOf(['center', 'contain', 'cover', 'repeat', 'stretch'])
	};
	DeprecatedImageStylePropTypes_1 = DeprecatedImageStylePropTypes;
	return DeprecatedImageStylePropTypes_1;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var browser;
var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser;
	hasRequiredBrowser = 1;

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	var invariant = function (condition, format, a, b, c, d, e, f) {
	  {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	browser = invariant;
	return browser;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var deprecatedCreateStrictShapeTypeChecker_1;
var hasRequiredDeprecatedCreateStrictShapeTypeChecker;

function requireDeprecatedCreateStrictShapeTypeChecker () {
	if (hasRequiredDeprecatedCreateStrictShapeTypeChecker) return deprecatedCreateStrictShapeTypeChecker_1;
	hasRequiredDeprecatedCreateStrictShapeTypeChecker = 1;

	const invariant = requireBrowser();
	function deprecatedCreateStrictShapeTypeChecker(shapeTypes) {
	  function checkType(isRequired, props, propName, componentName, location, ...rest) {
	    if (!props[propName]) {
	      if (isRequired) {
	        invariant(false, `Required object \`${propName}\` was not specified in ` + `\`${componentName}\`.`);
	      }
	      return;
	    }
	    const propValue = props[propName];
	    const propType = typeof propValue;
	    const locationName = location || '(unknown)';
	    if (propType !== 'object') {
	      invariant(false, `Invalid ${locationName} \`${propName}\` of type \`${propType}\` ` + `supplied to \`${componentName}\`, expected \`object\`.`);
	    }
	    // We need to check all keys in case some are required but missing from
	    // props.
	    const allKeys = {
	      ...props[propName],
	      ...shapeTypes
	    };
	    for (const key in allKeys) {
	      const checker = shapeTypes[key];
	      if (!checker) {
	        invariant(false, `Invalid props.${propName} key \`${key}\` supplied to \`${componentName}\`.` + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
	      }
	      const error = checker(propValue, key, componentName, location, ...rest);
	      if (error) {
	        invariant(false, error.message + '\nBad object: ' + JSON.stringify(props[propName], null, '  '));
	      }
	    }
	  }
	  function chainedCheckType(props, propName, componentName, location, ...rest) {
	    return checkType(false, props, propName, componentName, location, ...rest);
	  }
	  chainedCheckType.isRequired = checkType.bind(null, true);
	  return chainedCheckType;
	}
	deprecatedCreateStrictShapeTypeChecker_1 = deprecatedCreateStrictShapeTypeChecker;
	return deprecatedCreateStrictShapeTypeChecker_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedStyleSheetPropType_1;
var hasRequiredDeprecatedStyleSheetPropType;

function requireDeprecatedStyleSheetPropType () {
	if (hasRequiredDeprecatedStyleSheetPropType) return DeprecatedStyleSheetPropType_1;
	hasRequiredDeprecatedStyleSheetPropType = 1;

	const deprecatedCreateStrictShapeTypeChecker = requireDeprecatedCreateStrictShapeTypeChecker();
	function DeprecatedStyleSheetPropType(shape) {
	  const shapePropType = deprecatedCreateStrictShapeTypeChecker(shape);
	  return function (props, propName, componentName, location, ...rest) {
	    let newProps = props;
	    if (props[propName]) {
	      // Just make a dummy prop object with only the flattened style
	      newProps = {};
	      newProps[propName] = flattenStyle(props[propName]);
	    }
	    return shapePropType(newProps, propName, componentName, location, ...rest);
	  };
	}
	function flattenStyle(style) {
	  if (style === null || typeof style !== 'object') {
	    return undefined;
	  }
	  if (!Array.isArray(style)) {
	    return style;
	  }
	  const result = {};
	  for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
	    const computedStyle = flattenStyle(style[i]);
	    if (computedStyle) {
	      for (const key in computedStyle) {
	        result[key] = computedStyle[key];
	      }
	    }
	  }
	  return result;
	}
	DeprecatedStyleSheetPropType_1 = DeprecatedStyleSheetPropType;
	return DeprecatedStyleSheetPropType_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedViewAccessibility_1;
var hasRequiredDeprecatedViewAccessibility;

function requireDeprecatedViewAccessibility () {
	if (hasRequiredDeprecatedViewAccessibility) return DeprecatedViewAccessibility_1;
	hasRequiredDeprecatedViewAccessibility = 1;

	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/Components/View/ViewAccessibility.js
	 */
	const DeprecatedViewAccessibility = {
	  AccessibilityRolePropType: PropTypes.oneOf(['adjustable', 'alert', 'button', 'checkbox', 'combobox', 'drawerlayout', 'dropdownlist', 'grid', 'header', 'horizontalscrollview', 'iconmenu', 'image', 'imagebutton', 'keyboardkey', 'link', 'list', 'menu', 'menubar', 'menuitem', 'none', 'pager', 'progressbar', 'radio', 'radiogroup', 'scrollbar', 'scrollview', 'search', 'slidingdrawer', 'spinbutton', 'summary', 'switch', 'tab', 'tabbar', 'tablist', 'text', 'timer', 'togglebutton', 'toolbar', 'viewgroup', 'webview']),
	  AccessibilityStatePropType: PropTypes.object,
	  AccessibilityActionInfoPropType: PropTypes.object,
	  AccessibilityValuePropType: PropTypes.object,
	  RolePropType: PropTypes.oneOf(['alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'grid', 'group', 'heading', 'img', 'link', 'list', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'meter', 'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'summary', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'])
	};
	DeprecatedViewAccessibility_1 = DeprecatedViewAccessibility;
	return DeprecatedViewAccessibility_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedViewStylePropTypes_1;
var hasRequiredDeprecatedViewStylePropTypes;

function requireDeprecatedViewStylePropTypes () {
	if (hasRequiredDeprecatedViewStylePropTypes) return DeprecatedViewStylePropTypes_1;
	hasRequiredDeprecatedViewStylePropTypes = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const DeprecatedLayoutPropTypes = requireDeprecatedLayoutPropTypes();
	const DeprecatedShadowPropTypesIOS = requireDeprecatedShadowPropTypesIOS();
	const DeprecatedTransformPropTypes = requireDeprecatedTransformPropTypes();
	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const DeprecatedViewStylePropTypes = {
	  ...DeprecatedLayoutPropTypes,
	  ...DeprecatedShadowPropTypesIOS,
	  ...DeprecatedTransformPropTypes,
	  backfaceVisibility: PropTypes.oneOf(['hidden', 'visible']),
	  backgroundColor: DeprecatedColorPropType,
	  borderBottomColor: DeprecatedColorPropType,
	  borderBottomEndRadius: PropTypes.number,
	  borderBottomLeftRadius: PropTypes.number,
	  borderBottomRightRadius: PropTypes.number,
	  borderBottomStartRadius: PropTypes.number,
	  borderBottomWidth: PropTypes.number,
	  borderColor: DeprecatedColorPropType,
	  borderCurve: PropTypes.oneOf(['circular', 'continuous']),
	  borderEndColor: DeprecatedColorPropType,
	  borderEndEndRadius: PropTypes.number,
	  borderEndStartRadius: PropTypes.number,
	  borderLeftColor: DeprecatedColorPropType,
	  borderLeftWidth: PropTypes.number,
	  borderRadius: PropTypes.number,
	  borderRightColor: DeprecatedColorPropType,
	  borderRightWidth: PropTypes.number,
	  borderStartColor: DeprecatedColorPropType,
	  borderStartEndRadius: PropTypes.number,
	  borderStartStartRadius: PropTypes.number,
	  borderStyle: PropTypes.oneOf(['dashed', 'dotted', 'solid']),
	  borderTopColor: DeprecatedColorPropType,
	  borderTopEndRadius: PropTypes.number,
	  borderTopLeftRadius: PropTypes.number,
	  borderTopRightRadius: PropTypes.number,
	  borderTopStartRadius: PropTypes.number,
	  borderTopWidth: PropTypes.number,
	  borderWidth: PropTypes.number,
	  elevation: PropTypes.number,
	  opacity: PropTypes.number,
	  pointerEvents: PropTypes.oneOf(['auto', 'box-none', 'box-only', 'none'])
	};
	DeprecatedViewStylePropTypes_1 = DeprecatedViewStylePropTypes;
	return DeprecatedViewStylePropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedViewPropTypes_1;
var hasRequiredDeprecatedViewPropTypes;

function requireDeprecatedViewPropTypes () {
	if (hasRequiredDeprecatedViewPropTypes) return DeprecatedViewPropTypes_1;
	hasRequiredDeprecatedViewPropTypes = 1;

	const DeprecatedEdgeInsetsPropType = requireDeprecatedEdgeInsetsPropType();
	const DeprecatedStyleSheetPropType = requireDeprecatedStyleSheetPropType();
	const {
	  AccessibilityActionInfoPropType,
	  AccessibilityRolePropType,
	  AccessibilityStatePropType,
	  AccessibilityValuePropType,
	  RolePropType
	} = requireDeprecatedViewAccessibility();
	const DeprecatedViewStylePropTypes = requireDeprecatedViewStylePropTypes();
	const PropTypes = propTypes.exports;
	const MouseEventPropTypes = {
	  onMouseEnter: PropTypes.func,
	  onMouseLeave: PropTypes.func
	};

	// Experimental/Work in Progress Pointer Event Callbacks (not yet ready for use)
	const PointerEventPropTypes = {
	  onPointerEnter: PropTypes.func,
	  onPointerEnterCapture: PropTypes.func,
	  onPointerLeave: PropTypes.func,
	  onPointerLeaveCapture: PropTypes.func,
	  onPointerMove: PropTypes.func,
	  onPointerMoveCapture: PropTypes.func,
	  onPointerCancel: PropTypes.func,
	  onPointerCancelCapture: PropTypes.func,
	  onPointerDown: PropTypes.func,
	  onPointerDownCapture: PropTypes.func,
	  onPointerUp: PropTypes.func,
	  onPointerUpCapture: PropTypes.func,
	  onPointerOver: PropTypes.func,
	  onPointerOverCapture: PropTypes.func,
	  onPointerOut: PropTypes.func,
	  onPointerOutCapture: PropTypes.func
	};
	const FocusEventPropTypes = {
	  onBlur: PropTypes.func,
	  onBlurCapture: PropTypes.func,
	  onFocus: PropTypes.func,
	  onFocusCapture: PropTypes.func
	};
	const TouchEventPropTypes = {
	  onTouchCancel: PropTypes.func,
	  onTouchCancelCapture: PropTypes.func,
	  onTouchEnd: PropTypes.func,
	  onTouchEndCapture: PropTypes.func,
	  onTouchMove: PropTypes.func,
	  onTouchMoveCapture: PropTypes.func,
	  onTouchStart: PropTypes.func,
	  onTouchStartCapture: PropTypes.func
	};
	const GestureResponderEventPropTypes = {
	  onMoveShouldSetResponder: PropTypes.func,
	  onMoveShouldSetResponderCapture: PropTypes.func,
	  onResponderEnd: PropTypes.func,
	  onResponderGrant: PropTypes.func,
	  onResponderMove: PropTypes.func,
	  onResponderReject: PropTypes.func,
	  onResponderRelease: PropTypes.func,
	  onResponderStart: PropTypes.func,
	  onResponderTerminate: PropTypes.func,
	  onResponderTerminationRequest: PropTypes.func,
	  onStartShouldSetResponder: PropTypes.func,
	  onStartShouldSetResponderCapture: PropTypes.func
	};

	/**
	 * @see facebook/react-native/Libraries/Components/View/ViewPropTypes.js
	 */
	const DeprecatedViewPropTypes = {
	  ...MouseEventPropTypes,
	  ...PointerEventPropTypes,
	  ...FocusEventPropTypes,
	  ...TouchEventPropTypes,
	  ...GestureResponderEventPropTypes,
	  'aria-busy': PropTypes.bool,
	  'aria-checked': PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['mixed'])]),
	  'aria-disabled': PropTypes.bool,
	  'aria-expanded': PropTypes.bool,
	  'aria-hidden': PropTypes.bool,
	  'aria-label': PropTypes.string,
	  'aria-labelledby': PropTypes.string,
	  'aria-live': PropTypes.oneOf(['polite', 'assertive', 'off']),
	  'aria-modal': PropTypes.bool,
	  'aria-selected': PropTypes.bool,
	  'aria-valuemax': PropTypes.number,
	  'aria-valuemin': PropTypes.number,
	  'aria-valuenow': PropTypes.number,
	  'aria-valuetext': PropTypes.string,
	  accessibilityActions: PropTypes.arrayOf(AccessibilityActionInfoPropType),
	  accessibilityElementsHidden: PropTypes.bool,
	  accessibilityHint: PropTypes.string,
	  accessibilityIgnoresInvertColors: PropTypes.bool,
	  accessibilityLabel: PropTypes.node,
	  accessibilityLabelledBy: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	  accessibilityLanguage: PropTypes.string,
	  accessibilityLiveRegion: PropTypes.oneOf(['assertive', 'none', 'polite']),
	  accessibilityRole: AccessibilityRolePropType,
	  accessibilityState: AccessibilityStatePropType,
	  accessibilityValue: AccessibilityValuePropType,
	  accessibilityViewIsModal: PropTypes.bool,
	  accessible: PropTypes.bool,
	  collapsable: PropTypes.bool,
	  focusable: PropTypes.bool,
	  hitSlop: PropTypes.oneOfType([DeprecatedEdgeInsetsPropType, PropTypes.number]),
	  importantForAccessibility: PropTypes.oneOf(['auto', 'no', 'no-hide-descendants', 'yes']),
	  nativeBackgroundAndroid: PropTypes.object,
	  nativeForegroundAndroid: PropTypes.object,
	  nativeID: PropTypes.string,
	  needsOffscreenAlphaCompositing: PropTypes.bool,
	  onAccessibilityAction: PropTypes.func,
	  onAccessibilityEscape: PropTypes.func,
	  onAccessibilityTap: PropTypes.func,
	  onClick: PropTypes.func,
	  onLayout: PropTypes.func,
	  onMagicTap: PropTypes.func,
	  pointerEvents: PropTypes.oneOf(['auto', 'box-none', 'box-only', 'none']),
	  removeClippedSubviews: PropTypes.bool,
	  renderToHardwareTextureAndroid: PropTypes.bool,
	  role: RolePropType,
	  shouldRasterizeIOS: PropTypes.bool,
	  style: DeprecatedStyleSheetPropType(DeprecatedViewStylePropTypes),
	  tabIndex: PropTypes.oneOf([0, -1]),
	  testID: PropTypes.string
	};
	DeprecatedViewPropTypes_1 = DeprecatedViewPropTypes;
	return DeprecatedViewPropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedImagePropType_1;
var hasRequiredDeprecatedImagePropType;

function requireDeprecatedImagePropType () {
	if (hasRequiredDeprecatedImagePropType) return DeprecatedImagePropType_1;
	hasRequiredDeprecatedImagePropType = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const DeprecatedEdgeInsetsPropType = requireDeprecatedEdgeInsetsPropType();
	const DeprecatedImageSourcePropType = requireDeprecatedImageSourcePropType();
	const DeprecatedImageStylePropTypes = requireDeprecatedImageStylePropTypes();
	const DeprecatedStyleSheetPropType = requireDeprecatedStyleSheetPropType();
	const DeprecatedViewPropTypes = requireDeprecatedViewPropTypes();
	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/Image/ImageProps.js
	 */
	const DeprecatedImagePropType = {
	  ...DeprecatedViewPropTypes,
	  alt: PropTypes.string,
	  blurRadius: PropTypes.number,
	  capInsets: DeprecatedEdgeInsetsPropType,
	  crossOrigin: PropTypes.oneOf(['anonymous', 'use-credentials']),
	  defaultSource: DeprecatedImageSourcePropType,
	  fadeDuration: PropTypes.number,
	  height: PropTypes.number,
	  internal_analyticTag: PropTypes.string,
	  loadingIndicatorSource: PropTypes.oneOfType([PropTypes.shape({
	    uri: PropTypes.string
	  }), PropTypes.number]),
	  onError: PropTypes.func,
	  onLoad: PropTypes.func,
	  onLoadEnd: PropTypes.func,
	  onLoadStart: PropTypes.func,
	  onPartialLoad: PropTypes.func,
	  onProgress: PropTypes.func,
	  progressiveRenderingEnabled: PropTypes.bool,
	  referrerPolicy: PropTypes.oneOf(['no-referrer', 'no-referrer-when-downgrade', 'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-url']),
	  resizeMethod: PropTypes.oneOf(['auto', 'resize', 'scale']),
	  resizeMode: PropTypes.oneOf(['cover', 'contain', 'stretch', 'repeat', 'center']),
	  source: DeprecatedImageSourcePropType,
	  src: PropTypes.string,
	  srcSet: PropTypes.string,
	  style: DeprecatedStyleSheetPropType(DeprecatedImageStylePropTypes),
	  testID: PropTypes.string,
	  tintColor: DeprecatedColorPropType,
	  width: PropTypes.number
	};
	DeprecatedImagePropType_1 = DeprecatedImagePropType;
	return DeprecatedImagePropType_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedPointPropType;
var hasRequiredDeprecatedPointPropType;

function requireDeprecatedPointPropType () {
	if (hasRequiredDeprecatedPointPropType) return DeprecatedPointPropType;
	hasRequiredDeprecatedPointPropType = 1;

	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const PointPropType = PropTypes.shape({
	  x: PropTypes.number,
	  y: PropTypes.number
	});
	DeprecatedPointPropType = PointPropType;
	return DeprecatedPointPropType;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedTextStylePropTypes_1;
var hasRequiredDeprecatedTextStylePropTypes;

function requireDeprecatedTextStylePropTypes () {
	if (hasRequiredDeprecatedTextStylePropTypes) return DeprecatedTextStylePropTypes_1;
	hasRequiredDeprecatedTextStylePropTypes = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const DeprecatedViewStylePropTypes = requireDeprecatedViewStylePropTypes();
	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/StyleSheet/StyleSheetTypes.js
	 */
	const DeprecatedTextStylePropTypes = {
	  ...DeprecatedViewStylePropTypes,
	  color: DeprecatedColorPropType,
	  fontFamily: PropTypes.string,
	  fontSize: PropTypes.number,
	  fontStyle: PropTypes.oneOf(['italic', 'normal']),
	  fontVariant: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOf(['lining-nums', 'oldstyle-nums', 'proportional-nums', 'small-caps', 'stylistic-eight', 'stylistic-eighteen', 'stylistic-eleven', 'stylistic-fifteen', 'stylistic-five', 'stylistic-four', 'stylistic-fourteen', 'stylistic-nine', 'stylistic-nineteen', 'stylistic-one', 'stylistic-seven', 'stylistic-seventeen', 'stylistic-six', 'stylistic-sixteen', 'stylistic-ten', 'stylistic-thirteen', 'stylistic-three', 'stylistic-twelve', 'stylistic-twenty', 'stylistic-two', 'tabular-nums'])), PropTypes.string]),
	  fontWeight: PropTypes.oneOf(['100', '200', '300', '400', '500', '600', '700', '800', '900', 'black', 'bold', 'condensed', 'condensedBold', 'heavy', 'light', 'medium', 'normal', 'regular', 'semibold', 'thin', 'ultralight', 100, 200, 300, 400, 500, 600, 700, 800, 900]),
	  includeFontPadding: PropTypes.bool,
	  letterSpacing: PropTypes.number,
	  lineHeight: PropTypes.number,
	  textAlign: PropTypes.oneOf(['auto', 'center', 'justify', 'left', 'right']),
	  textAlignVertical: PropTypes.oneOf(['auto', 'bottom', 'center', 'top']),
	  textDecorationColor: DeprecatedColorPropType,
	  textDecorationLine: PropTypes.oneOf(['line-through', 'none', 'underline line-through', 'underline']),
	  textDecorationStyle: PropTypes.oneOf(['dashed', 'dotted', 'double', 'solid']),
	  textShadowColor: DeprecatedColorPropType,
	  textShadowOffset: PropTypes.shape({
	    height: PropTypes.number,
	    width: PropTypes.number
	  }),
	  textShadowRadius: PropTypes.number,
	  textTransform: PropTypes.oneOf(['capitalize', 'lowercase', 'none', 'uppercase']),
	  userSelect: PropTypes.oneOf(['all', 'auto', 'contain', 'none', 'text']),
	  verticalAlign: PropTypes.oneOf(['auto', 'bottom', 'middle', 'top']),
	  writingDirection: PropTypes.oneOf(['auto', 'ltr', 'rtl'])
	};
	DeprecatedTextStylePropTypes_1 = DeprecatedTextStylePropTypes;
	return DeprecatedTextStylePropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedTextPropTypes_1;
var hasRequiredDeprecatedTextPropTypes;

function requireDeprecatedTextPropTypes () {
	if (hasRequiredDeprecatedTextPropTypes) return DeprecatedTextPropTypes_1;
	hasRequiredDeprecatedTextPropTypes = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const DeprecatedEdgeInsetsPropType = requireDeprecatedEdgeInsetsPropType();
	const DeprecatedStyleSheetPropType = requireDeprecatedStyleSheetPropType();
	const DeprecatedTextStylePropTypes = requireDeprecatedTextStylePropTypes();
	const {
	  AccessibilityActionInfoPropType,
	  AccessibilityRolePropType,
	  AccessibilityStatePropType,
	  AccessibilityValuePropType,
	  RolePropType
	} = requireDeprecatedViewAccessibility();
	const PropTypes = propTypes.exports;

	/**
	 * @see facebook/react-native/Libraries/Text/TextProps.js
	 */
	const DeprecatedTextPropTypes = {
	  'aria-busy': PropTypes.bool,
	  'aria-checked': PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['mixed'])]),
	  'aria-disabled': PropTypes.bool,
	  'aria-expanded': PropTypes.bool,
	  'aria-label': PropTypes.string,
	  'aria-labelledby': PropTypes.string,
	  'aria-selected': PropTypes.bool,
	  accessibilityActions: PropTypes.arrayOf(AccessibilityActionInfoPropType),
	  accessibilityHint: PropTypes.string,
	  accessibilityLabel: PropTypes.string,
	  accessibilityLanguage: PropTypes.string,
	  accessibilityRole: AccessibilityRolePropType,
	  accessibilityState: AccessibilityStatePropType,
	  accessible: PropTypes.bool,
	  adjustsFontSizeToFit: PropTypes.bool,
	  allowFontScaling: PropTypes.bool,
	  dataDetectorType: PropTypes.oneOf(['all', 'email', 'link', 'none', 'phoneNumber']),
	  disabled: PropTypes.bool,
	  dynamicTypeRamp: PropTypes.oneOf(['body', 'callout', 'caption1', 'caption2', 'footnote', 'headline', 'largeTitle', 'subheadline', 'title1', 'title2', 'title3']),
	  ellipsizeMode: PropTypes.oneOf(['clip', 'head', 'middle', 'tail']),
	  id: PropTypes.string,
	  lineBreakStrategyIOS: PropTypes.oneOf(['hangul-word', 'none', 'push-out', 'standard']),
	  maxFontSizeMultiplier: PropTypes.number,
	  minimumFontScale: PropTypes.number,
	  nativeID: PropTypes.string,
	  numberOfLines: PropTypes.number,
	  onAccessibilityAction: PropTypes.func,
	  onLayout: PropTypes.func,
	  onLongPress: PropTypes.func,
	  onMoveShouldSetResponder: PropTypes.func,
	  onPress: PropTypes.func,
	  onPressIn: PropTypes.func,
	  onPressOut: PropTypes.func,
	  onResponderGrant: PropTypes.func,
	  onResponderMove: PropTypes.func,
	  onResponderRelease: PropTypes.func,
	  onResponderTerminate: PropTypes.func,
	  onResponderTerminationRequest: PropTypes.func,
	  onStartShouldSetResponder: PropTypes.func,
	  onTextLayout: PropTypes.func,
	  pressRetentionOffset: DeprecatedEdgeInsetsPropType,
	  role: RolePropType,
	  selectable: PropTypes.bool,
	  selectionColor: DeprecatedColorPropType,
	  style: DeprecatedStyleSheetPropType(DeprecatedTextStylePropTypes),
	  suppressHighlighting: PropTypes.bool,
	  testID: PropTypes.string,
	  textBreakStrategy: PropTypes.oneOf(['balanced', 'highQuality', 'simple'])
	};
	DeprecatedTextPropTypes_1 = DeprecatedTextPropTypes;
	return DeprecatedTextPropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var DeprecatedTextInputPropTypes_1;
var hasRequiredDeprecatedTextInputPropTypes;

function requireDeprecatedTextInputPropTypes () {
	if (hasRequiredDeprecatedTextInputPropTypes) return DeprecatedTextInputPropTypes_1;
	hasRequiredDeprecatedTextInputPropTypes = 1;

	const DeprecatedColorPropType = requireDeprecatedColorPropType();
	const DeprecatedTextPropTypes = requireDeprecatedTextPropTypes();
	const DeprecatedViewPropTypes = requireDeprecatedViewPropTypes();
	const PropTypes = propTypes.exports;
	const DataDetectorTypes = ['address', 'all', 'calendarEvent', 'link', 'none', 'phoneNumber'];

	/**
	 * @see facebook/react-native/Libraries/TextInput/TextInput.js
	 */
	const DeprecatedTextInputPropTypes = {
	  ...DeprecatedViewPropTypes,
	  allowFontScaling: PropTypes.bool,
	  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
	  autoComplete: PropTypes.oneOf(['additional-name', 'address-line1', 'address-line2', 'bday', 'bday-day', 'bday-month', 'bday-year', 'birthdate-day', 'birthdate-full', 'birthdate-month', 'birthdate-year', 'cc-csc', 'cc-exp', 'cc-exp-day', 'cc-exp-month', 'cc-exp-year', 'cc-family-name', 'cc-given-name', 'cc-middle-name', 'cc-name', 'cc-number', 'cc-type', 'country', 'current-password', 'email', 'family-name', 'gender', 'given-name', 'honorific-prefix', 'honorific-suffix', 'name', 'name-family', 'name-given', 'name-middle', 'name-middle-initial', 'name-prefix', 'name-suffix', 'new-password', 'nickname', 'off', 'one-time-code', 'organization', 'organization-title', 'password', 'password-new', 'postal-address', 'postal-address-country', 'postal-address-extended', 'postal-address-extended-postal-code', 'postal-address-locality', 'postal-address-region', 'postal-code', 'sex', 'sms-otp', 'street-address', 'tel', 'tel-country-code', 'tel-device', 'tel-national', 'url', 'username', 'username-new']),
	  autoCorrect: PropTypes.bool,
	  autoFocus: PropTypes.bool,
	  blurOnSubmit: PropTypes.bool,
	  caretHidden: PropTypes.bool,
	  clearButtonMode: PropTypes.oneOf(['always', 'never', 'unless-editing', 'while-editing']),
	  clearTextOnFocus: PropTypes.bool,
	  cursorColor: DeprecatedColorPropType,
	  contextMenuHidden: PropTypes.bool,
	  dataDetectorTypes: PropTypes.oneOfType([PropTypes.oneOf(DataDetectorTypes), PropTypes.arrayOf(PropTypes.oneOf(DataDetectorTypes))]),
	  defaultValue: PropTypes.string,
	  disableFullscreenUI: PropTypes.bool,
	  editable: PropTypes.bool,
	  enablesReturnKeyAutomatically: PropTypes.bool,
	  enterKeyHint: PropTypes.oneOf(['done', 'enter', 'go', 'next', 'previous', 'search', 'send']),
	  inlineImageLeft: PropTypes.string,
	  inlineImagePadding: PropTypes.number,
	  inputAccessoryViewID: PropTypes.string,
	  inputMode: PropTypes.oneOf(['decimal', 'email', 'none', 'numeric', 'search', 'tel', 'text', 'url']),
	  keyboardAppearance: PropTypes.oneOf(['default', 'dark', 'light']),
	  keyboardType: PropTypes.oneOf(['ascii-capable', 'ascii-capable-number-pad', 'decimal-pad', 'default', 'email-address', 'name-phone-pad', 'number-pad', 'numbers-and-punctuation', 'numeric', 'phone-pad', 'twitter', 'url', 'visible-password', 'web-search']),
	  lineBreakStrategyIOS: PropTypes.oneOf(['hangul-word', 'none', 'push-out', 'standard']),
	  maxFontSizeMultiplier: PropTypes.number,
	  maxLength: PropTypes.number,
	  multiline: PropTypes.bool,
	  numberOfLines: PropTypes.number,
	  onBlur: PropTypes.func,
	  onChange: PropTypes.func,
	  onChangeText: PropTypes.func,
	  onContentSizeChange: PropTypes.func,
	  onEndEditing: PropTypes.func,
	  onFocus: PropTypes.func,
	  onKeyPress: PropTypes.func,
	  onLayout: PropTypes.func,
	  onScroll: PropTypes.func,
	  onSelectionChange: PropTypes.func,
	  onSubmitEditing: PropTypes.func,
	  onTextInput: PropTypes.func,
	  placeholder: PropTypes.string,
	  placeholderTextColor: DeprecatedColorPropType,
	  readOnly: PropTypes.bool,
	  rejectResponderTermination: PropTypes.bool,
	  returnKeyLabel: PropTypes.string,
	  returnKeyType: PropTypes.oneOf(['default', 'done', 'emergency-call', 'go', 'google', 'join', 'next', 'none', 'previous', 'route', 'search', 'send', 'yahoo']),
	  rows: PropTypes.number,
	  scrollEnabled: PropTypes.bool,
	  secureTextEntry: PropTypes.bool,
	  selection: PropTypes.shape({
	    end: PropTypes.number,
	    start: PropTypes.number.isRequired
	  }),
	  selectionColor: DeprecatedColorPropType,
	  selectTextOnFocus: PropTypes.bool,
	  showSoftInputOnFocus: PropTypes.bool,
	  spellCheck: PropTypes.bool,
	  style: DeprecatedTextPropTypes.style,
	  submitBehavior: PropTypes.oneOf(['blurAndSubmit', 'newline', 'submit']),
	  textBreakStrategy: PropTypes.oneOf(['balanced', 'highQuality', 'simple']),
	  textContentType: PropTypes.oneOf(['addressCity', 'addressCityAndState', 'addressState', 'birthdate', 'birthdateDay', 'birthdateMonth', 'birthdateYear', 'countryName', 'creditCardExpiration', 'creditCardExpirationMonth', 'creditCardExpirationYear', 'creditCardFamilyName', 'creditCardGivenName', 'creditCardMiddleName', 'creditCardName', 'creditCardNumber', 'creditCardSecurityCode', 'creditCardType', 'emailAddress', 'familyName', 'fullStreetAddress', 'givenName', 'jobTitle', 'location', 'middleName', 'name', 'namePrefix', 'nameSuffix', 'newPassword', 'nickname', 'none', 'oneTimeCode', 'organizationName', 'password', 'postalCode', 'streetAddressLine1', 'streetAddressLine2', 'sublocality', 'telephoneNumber', 'URL', 'username']),
	  underlineColorAndroid: DeprecatedColorPropType,
	  value: PropTypes.string
	};
	DeprecatedTextInputPropTypes_1 = DeprecatedTextInputPropTypes;
	return DeprecatedTextInputPropTypes_1;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

var deprecatedReactNativePropTypes = {
  get ColorPropType() {
    return requireDeprecatedColorPropType();
  },
  get EdgeInsetsPropType() {
    return requireDeprecatedEdgeInsetsPropType();
  },
  get ImagePropTypes() {
    return requireDeprecatedImagePropType();
  },
  get PointPropType() {
    return requireDeprecatedPointPropType();
  },
  get TextInputPropTypes() {
    return requireDeprecatedTextInputPropTypes();
  },
  get TextPropTypes() {
    return requireDeprecatedTextPropTypes();
  },
  get ViewPropTypes() {
    return requireDeprecatedViewPropTypes();
  }
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual$1(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
var shallowEqual_1 = shallowEqual$1;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule shallowCompare
 */

var shallowEqual = shallowEqual_1;

/**
 * Does a shallow comparison for props and state.
 * See ReactComponentWithPureRenderMixin
 * See also https://facebook.github.io/react/docs/shallow-compare.html
 */
function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}
var reactAddonsShallowCompare = shallowCompare;

// Get scroll interpolator's input range from an array of slide indexes
// Indexes are relative to the current active slide (index 0)
// For example, using [3, 2, 1, 0, -1] will return:
// [
//     (index - 3) * sizeRef, // active + 3
//     (index - 2) * sizeRef, // active + 2
//     (index - 1) * sizeRef, // active + 1
//     index * sizeRef, // active
//     (index + 1) * sizeRef // active - 1
// ]
function getInputRangeFromIndexes(range, index, carouselProps) {
  const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
  let inputRange = [];
  for (let i = 0; i < range.length; i++) {
    inputRange.push((index - range[i]) * sizeRef);
  }
  return inputRange;
}

// Default behavior
// Scale and/or opacity effect
// Based on props 'inactiveSlideOpacity' and 'inactiveSlideScale'
function defaultScrollInterpolator(index, carouselProps) {
  const range = [1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = [0, 1, 0];
  return {
    inputRange,
    outputRange
  };
}
function defaultAnimatedStyles(index, animatedValue, carouselProps) {
  let animatedOpacity = {};
  let animatedScale = {};
  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [carouselProps.inactiveSlideOpacity, 1]
      })
    };
  }
  if (carouselProps.inactiveSlideScale < 1) {
    animatedScale = {
      transform: [{
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [carouselProps.inactiveSlideScale, 1]
        })
      }]
    };
  }
  return {
    ...animatedOpacity,
    ...animatedScale
  };
}

// Shift animation
// Same as the default one, but the active slide is also shifted up or down
// Based on prop 'inactiveSlideShift'
function shiftAnimatedStyles(index, animatedValue, carouselProps) {
  let animatedOpacity = {};
  let animatedScale = {};
  let animatedTranslate = {};
  if (carouselProps.inactiveSlideOpacity < 1) {
    animatedOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [carouselProps.inactiveSlideOpacity, 1]
      })
    };
  }
  if (carouselProps.inactiveSlideScale < 1) {
    animatedScale = {
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [carouselProps.inactiveSlideScale, 1]
      })
    };
  }
  if (carouselProps.inactiveSlideShift !== 0) {
    const translateProp = carouselProps.vertical ? 'translateX' : 'translateY';
    animatedTranslate = {
      [translateProp]: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [carouselProps.inactiveSlideShift, 0]
      })
    };
  }
  return {
    ...animatedOpacity,
    transform: [{
      ...animatedScale
    }, {
      ...animatedTranslate
    }]
  };
}

// Stack animation
// Imitate a deck/stack of cards (see #195)
// WARNING: The effect had to be visually inverted on Android because this OS doesn't honor the `zIndex`property
// This means that the item with the higher zIndex (and therefore the tap receiver) remains the one AFTER the currently active item
// The `elevation` property compensates for that only visually, which is not good enough
function stackScrollInterpolator(index, carouselProps) {
  const range = [1, 0, -1, -2, -3] ;
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;
  return {
    inputRange,
    outputRange
  };
}
function stackAnimatedStyles(index, animatedValue, carouselProps, cardOffset) {
  const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
  const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';
  const card1Scale = 0.9;
  const card2Scale = 0.8;
  cardOffset = !cardOffset && cardOffset !== 0 ? 18 : cardOffset;
  const getTranslateFromScale = (cardIndex, scale) => {
    const centerFactor = 1 / scale * cardIndex;
    const centeredPosition = -Math.round(sizeRef * centerFactor);
    const edgeAlignment = Math.round((sizeRef - sizeRef * scale) / 2);
    const offset = Math.round(cardOffset * Math.abs(cardIndex) / scale);
    return centeredPosition - edgeAlignment - offset ;
  };
  const opacityOutputRange = carouselProps.inactiveSlideOpacity === 1 ? [1, 1, 1, 0] : [1, 0.75, 0.5, 0];
  return {
    // elevation: carouselProps.data.length - index, // fix zIndex bug visually, but not from a logic point of view
    opacity: animatedValue.interpolate({
      inputRange: [-3, -2, -1, 0],
      outputRange: opacityOutputRange.reverse(),
      extrapolate: 'clamp'
    }),
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [-2, -1, 0, 1],
        outputRange: [card2Scale, card1Scale, 1, card1Scale],
        extrapolate: 'clamp'
      })
    }, {
      [translateProp]: animatedValue.interpolate({
        inputRange: [-3, -2, -1, 0, 1],
        outputRange: [getTranslateFromScale(-3, card2Scale), getTranslateFromScale(-2, card2Scale), getTranslateFromScale(-1, card1Scale), 0, sizeRef * 0.5],
        extrapolate: 'clamp'
      })
    }]
  } ;
}

// Tinder animation
// Imitate the popular Tinder layout
// WARNING: The effect had to be visually inverted on Android because this OS doesn't honor the `zIndex`property
// This means that the item with the higher zIndex (and therefore the tap receiver) remains the one AFTER the currently active item
// The `elevation` property compensates for that only visually, which is not good enough
function tinderScrollInterpolator(index, carouselProps) {
  const range = [1, 0, -1, -2, -3] ;
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;
  return {
    inputRange,
    outputRange
  };
}
function tinderAnimatedStyles(index, animatedValue, carouselProps, cardOffset) {
  const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
  const mainTranslateProp = carouselProps.vertical ? 'translateY' : 'translateX';
  const secondaryTranslateProp = carouselProps.vertical ? 'translateX' : 'translateY';
  const card1Scale = 0.96;
  const card2Scale = 0.92;
  const card3Scale = 0.88;
  const peekingCardsOpacity = 0.92 ;
  cardOffset = !cardOffset && cardOffset !== 0 ? 9 : cardOffset;
  const getMainTranslateFromScale = (cardIndex, scale) => {
    const centerFactor = 1 / scale * cardIndex;
    return -Math.round(sizeRef * centerFactor);
  };
  const getSecondaryTranslateFromScale = (cardIndex, scale) => {
    return Math.round(cardOffset * Math.abs(cardIndex) / scale);
  };
  return {
    // elevation: carouselProps.data.length - index, // fix zIndex bug visually, but not from a logic point of view
    opacity: animatedValue.interpolate({
      inputRange: [-3, -2, -1, 0, 1],
      outputRange: [0, peekingCardsOpacity, peekingCardsOpacity, 1, 0],
      extrapolate: 'clamp'
    }),
    transform: [{
      scale: animatedValue.interpolate({
        inputRange: [-3, -2, -1, 0],
        outputRange: [card3Scale, card2Scale, card1Scale, 1],
        extrapolate: 'clamp'
      })
    }, {
      rotate: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '22deg'],
        extrapolate: 'clamp'
      })
    }, {
      [mainTranslateProp]: animatedValue.interpolate({
        inputRange: [-3, -2, -1, 0, 1],
        outputRange: [getMainTranslateFromScale(-3, card3Scale), getMainTranslateFromScale(-2, card2Scale), getMainTranslateFromScale(-1, card1Scale), 0, sizeRef * 1.1],
        extrapolate: 'clamp'
      })
    }, {
      [secondaryTranslateProp]: animatedValue.interpolate({
        inputRange: [-3, -2, -1, 0],
        outputRange: [getSecondaryTranslateFromScale(-3, card3Scale), getSecondaryTranslateFromScale(-2, card2Scale), getSecondaryTranslateFromScale(-1, card1Scale), 0],
        extrapolate: 'clamp'
      })
    }]
  } ;
}

const IS_IOS$1 = "android" === 'ios';

// Native driver for scroll events
// See: https://facebook.github.io/react-native/blog/2017/02/14/using-native-driver-for-animated.html
const AnimatedFlatList = FlatList ? Animated.createAnimatedComponent(FlatList) : null;
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// React Native automatically handles RTL layouts; unfortunately, it's buggy with horizontal ScrollView
// See https://github.com/facebook/react-native/issues/11960
// NOTE: the following variable is not declared in the constructor
// otherwise it is undefined at init, which messes with custom indexes
const IS_RTL$1 = I18nManager.isRTL;
class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCarousel: true,
      interpolators: []
    };

    // The following values are not stored in the state because 'setState()' is asynchronous
    // and this results in an absolutely crappy behavior on Android while swiping (see #156)
    const initialActiveItem = this._getFirstItem(props.firstItem);
    this._activeItem = initialActiveItem;
    this._previousActiveItem = initialActiveItem;
    this._previousFirstItem = initialActiveItem;
    this._previousItemsLength = initialActiveItem;
    this._mounted = false;
    this._positions = [];
    this._currentContentOffset = 0; // store ScrollView's scroll position
    this._canFireBeforeCallback = false;
    this._canFireCallback = false;
    this._scrollOffsetRef = null;
    this._onScrollTriggered = true; // used when momentum is enabled to prevent an issue with edges items
    this._lastScrollDate = 0; // used to work around a FlatList bug
    this._scrollEnabled = props.scrollEnabled !== false;
    this._initPositionsAndInterpolators = this._initPositionsAndInterpolators.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._onSnap = this._onSnap.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onScrollBeginDrag = props.enableSnap ? this._onScrollBeginDrag.bind(this) : undefined;
    this._onScrollEnd = props.enableSnap || props.autoplay ? this._onScrollEnd.bind(this) : undefined;
    this._onScrollEndDrag = !props.enableMomentum ? this._onScrollEndDrag.bind(this) : undefined;
    this._onMomentumScrollEnd = props.enableMomentum ? this._onMomentumScrollEnd.bind(this) : undefined;
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onTouchRelease = this._onTouchRelease.bind(this);
    this._getKeyExtractor = this._getKeyExtractor.bind(this);
    this._setScrollHandler(props);

    // This bool aims at fixing an iOS bug due to scrollTo that triggers onMomentumScrollEnd.
    // onMomentumScrollEnd fires this._snapScroll, thus creating an infinite loop.
    this._ignoreNextMomentum = false;

    // Warnings
    if (!deprecatedReactNativePropTypes.ViewPropTypes) {
      console.warn('react-native-snap-carousel: It is recommended to use at least version 0.44 of React Native with the plugin');
    }
    if (!props.vertical && (!props.sliderWidth || !props.itemWidth)) {
      console.error('react-native-snap-carousel: You need to specify both `sliderWidth` and `itemWidth` for horizontal carousels');
    }
    if (props.vertical && (!props.sliderHeight || !props.itemHeight)) {
      console.error('react-native-snap-carousel: You need to specify both `sliderHeight` and `itemHeight` for vertical carousels');
    }
    if (props.apparitionDelay && !IS_IOS$1 && !props.useScrollView) {
      console.warn('react-native-snap-carousel: Using `apparitionDelay` on Android is not recommended since it can lead to rendering issues');
    }
    if (props.customAnimationType || props.customAnimationOptions) {
      console.warn('react-native-snap-carousel: Props `customAnimationType` and `customAnimationOptions` have been renamed to `activeAnimationType` and `activeAnimationOptions`');
    }
    if (props.onScrollViewScroll) {
      console.error('react-native-snap-carousel: Prop `onScrollViewScroll` has been removed. Use `onScroll` instead');
    }
  }
  componentDidMount() {
    const {
      apparitionDelay,
      autoplay,
      firstItem
    } = this.props;
    const _firstItem = this._getFirstItem(firstItem);
    const apparitionCallback = () => {
      this.setState({
        hideCarousel: false
      });
      if (autoplay) {
        this.startAutoplay();
      }
    };
    this._mounted = true;
    this._initPositionsAndInterpolators();

    // Without 'requestAnimationFrame' or a `0` timeout, images will randomly not be rendered on Android...
    requestAnimationFrame(() => {
      if (!this._mounted) {
        return;
      }
      this._snapToItem(_firstItem, false, false, true, false);
      this._hackActiveSlideAnimation(_firstItem, 'start', true);
      if (apparitionDelay) {
        this._apparitionTimeout = setTimeout(() => {
          apparitionCallback();
        }, apparitionDelay);
      } else {
        apparitionCallback();
      }
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shouldOptimizeUpdates === false) {
      return true;
    } else {
      return reactAddonsShallowCompare(this, nextProps, nextState);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      interpolators
    } = this.state;
    const {
      firstItem,
      itemHeight,
      itemWidth,
      scrollEnabled,
      sliderHeight,
      sliderWidth
    } = this.props;
    const itemsLength = this._getCustomDataLength(this.props);
    if (!itemsLength) {
      return;
    }
    const nextFirstItem = this._getFirstItem(firstItem, this.props);
    let nextActiveItem = this._activeItem || this._activeItem === 0 ? this._activeItem : nextFirstItem;
    const hasNewSliderWidth = sliderWidth && sliderWidth !== prevProps.sliderWidth;
    const hasNewSliderHeight = sliderHeight && sliderHeight !== prevProps.sliderHeight;
    const hasNewItemWidth = itemWidth && itemWidth !== prevProps.itemWidth;
    const hasNewItemHeight = itemHeight && itemHeight !== prevProps.itemHeight;
    const hasNewScrollEnabled = scrollEnabled !== prevProps.scrollEnabled;

    // Prevent issues with dynamically removed items
    if (nextActiveItem > itemsLength - 1) {
      nextActiveItem = itemsLength - 1;
    }

    // Handle changing scrollEnabled independent of user -> carousel interaction
    if (hasNewScrollEnabled) {
      this._setScrollEnabled(scrollEnabled);
    }
    if (interpolators.length !== itemsLength || hasNewSliderWidth || hasNewSliderHeight || hasNewItemWidth || hasNewItemHeight) {
      this._activeItem = nextActiveItem;
      this._previousItemsLength = itemsLength;
      this._initPositionsAndInterpolators(this.props);

      // Handle scroll issue when dynamically removing items (see #133)
      // This also fixes first item's active state on Android
      // Because 'initialScrollIndex' apparently doesn't trigger scroll
      if (this._previousItemsLength > itemsLength) {
        this._hackActiveSlideAnimation(nextActiveItem, null, true);
      }
      if (hasNewSliderWidth || hasNewSliderHeight || hasNewItemWidth || hasNewItemHeight) {
        this._snapToItem(nextActiveItem, false, false, false, false);
      }
    } else if (nextFirstItem !== this._previousFirstItem && nextFirstItem !== this._activeItem) {
      this._activeItem = nextFirstItem;
      this._previousFirstItem = nextFirstItem;
      this._snapToItem(nextFirstItem, false, true, false, false);
    }
    if (this.props.onScroll !== prevProps.onScroll) {
      this._setScrollHandler(this.props);
    }
  }
  componentWillUnmount() {
    this._mounted = false;
    this.stopAutoplay();
    clearTimeout(this._apparitionTimeout);
    clearTimeout(this._hackSlideAnimationTimeout);
    clearTimeout(this._enableAutoplayTimeout);
    clearTimeout(this._autoplayTimeout);
    clearTimeout(this._snapNoMomentumTimeout);
    clearTimeout(this._edgeItemTimeout);
    clearTimeout(this._lockScrollTimeout);
  }
  get realIndex() {
    return this._activeItem;
  }
  get currentIndex() {
    return this._getDataIndex(this._activeItem);
  }
  get currentScrollPosition() {
    return this._currentContentOffset;
  }
  _setScrollHandler(props) {
    // Native driver for scroll events
    const scrollEventConfig = {
      listener: this._onScroll,
      useNativeDriver: true
    };
    this._scrollPos = new Animated.Value(0);
    const argMapping = props.vertical ? [{
      nativeEvent: {
        contentOffset: {
          y: this._scrollPos
        }
      }
    }] : [{
      nativeEvent: {
        contentOffset: {
          x: this._scrollPos
        }
      }
    }];
    if (props.onScroll && Array.isArray(props.onScroll._argMapping)) {
      // Because of a react-native issue https://github.com/facebook/react-native/issues/13294
      argMapping.pop();
      const [argMap] = props.onScroll._argMapping;
      if (argMap && argMap.nativeEvent && argMap.nativeEvent.contentOffset) {
        // Shares the same animated value passed in props
        this._scrollPos = argMap.nativeEvent.contentOffset.x || argMap.nativeEvent.contentOffset.y || this._scrollPos;
      }
      argMapping.push(...props.onScroll._argMapping);
    }
    this._onScrollHandler = Animated.event(argMapping, scrollEventConfig);
  }
  _needsScrollView() {
    const {
      useScrollView
    } = this.props;
    return useScrollView || !AnimatedFlatList || this._shouldUseStackLayout() || this._shouldUseTinderLayout();
  }
  _needsRTLAdaptations() {
    const {
      vertical
    } = this.props;
    return IS_RTL$1 && !IS_IOS$1 && !vertical;
  }
  _canLockScroll() {
    const {
      scrollEnabled,
      enableMomentum,
      lockScrollWhileSnapping
    } = this.props;
    return scrollEnabled && !enableMomentum && lockScrollWhileSnapping;
  }
  _enableLoop() {
    const {
      data,
      enableSnap,
      loop
    } = this.props;
    return enableSnap && loop && data && data.length && data.length > 1;
  }
  _shouldAnimateSlides(props = this.props) {
    const {
      inactiveSlideOpacity,
      inactiveSlideScale,
      scrollInterpolator,
      slideInterpolatedStyle
    } = props;
    return inactiveSlideOpacity < 1 || inactiveSlideScale < 1 || !!scrollInterpolator || !!slideInterpolatedStyle || this._shouldUseShiftLayout() || this._shouldUseStackLayout() || this._shouldUseTinderLayout();
  }
  _shouldUseCustomAnimation() {
    const {
      activeAnimationOptions
    } = this.props;
    return !!activeAnimationOptions && !this._shouldUseStackLayout() && !this._shouldUseTinderLayout();
  }
  _shouldUseShiftLayout() {
    const {
      inactiveSlideShift,
      layout
    } = this.props;
    return layout === 'default' && inactiveSlideShift !== 0;
  }
  _shouldUseStackLayout() {
    return this.props.layout === 'stack';
  }
  _shouldUseTinderLayout() {
    return this.props.layout === 'tinder';
  }
  _getCustomData(props = this.props) {
    const {
      data,
      loopClonesPerSide
    } = props;
    const dataLength = data && data.length;
    if (!dataLength) {
      return [];
    }
    if (!this._enableLoop()) {
      return data;
    }
    let previousItems = [];
    let nextItems = [];
    if (loopClonesPerSide > dataLength) {
      const dataMultiplier = Math.floor(loopClonesPerSide / dataLength);
      const remainder = loopClonesPerSide % dataLength;
      for (let i = 0; i < dataMultiplier; i++) {
        previousItems.push(...data);
        nextItems.push(...data);
      }
      previousItems.unshift(...data.slice(-remainder));
      nextItems.push(...data.slice(0, remainder));
    } else {
      previousItems = data.slice(-loopClonesPerSide);
      nextItems = data.slice(0, loopClonesPerSide);
    }
    return previousItems.concat(data, nextItems);
  }
  _getCustomDataLength(props = this.props) {
    const {
      data,
      loopClonesPerSide
    } = props;
    const dataLength = data && data.length;
    if (!dataLength) {
      return 0;
    }
    return this._enableLoop() ? dataLength + 2 * loopClonesPerSide : dataLength;
  }
  _getCustomIndex(index, props = this.props) {
    const itemsLength = this._getCustomDataLength(props);
    if (!itemsLength || !index && index !== 0) {
      return 0;
    }
    return this._needsRTLAdaptations() ? itemsLength - index - 1 : index;
  }
  _getDataIndex(index) {
    const {
      data,
      loopClonesPerSide
    } = this.props;
    const dataLength = data && data.length;
    if (!this._enableLoop() || !dataLength) {
      return index;
    }
    if (index >= dataLength + loopClonesPerSide) {
      return loopClonesPerSide > dataLength ? (index - loopClonesPerSide) % dataLength : index - dataLength - loopClonesPerSide;
    } else if (index < loopClonesPerSide) {
      // TODO: is there a simpler way of determining the interpolated index?
      if (loopClonesPerSide > dataLength) {
        const baseDataIndexes = [];
        const dataIndexes = [];
        const dataMultiplier = Math.floor(loopClonesPerSide / dataLength);
        const remainder = loopClonesPerSide % dataLength;
        for (let i = 0; i < dataLength; i++) {
          baseDataIndexes.push(i);
        }
        for (let j = 0; j < dataMultiplier; j++) {
          dataIndexes.push(...baseDataIndexes);
        }
        dataIndexes.unshift(...baseDataIndexes.slice(-remainder));
        return dataIndexes[index];
      } else {
        return index + dataLength - loopClonesPerSide;
      }
    } else {
      return index - loopClonesPerSide;
    }
  }

  // Used with `snapToItem()` and 'PaginationDot'
  _getPositionIndex(index) {
    const {
      loop,
      loopClonesPerSide
    } = this.props;
    return loop ? index + loopClonesPerSide : index;
  }
  _getFirstItem(index, props = this.props) {
    const {
      loopClonesPerSide
    } = props;
    const itemsLength = this._getCustomDataLength(props);
    if (!itemsLength || index > itemsLength - 1 || index < 0) {
      return 0;
    }
    return this._enableLoop() ? index + loopClonesPerSide : index;
  }
  _getWrappedRef() {
    if (this._carouselRef && (this._needsScrollView() && this._carouselRef.scrollTo || !this._needsScrollView() && this._carouselRef.scrollToOffset)) {
      return this._carouselRef;
    }
    // https://github.com/facebook/react-native/issues/10635
    // https://stackoverflow.com/a/48786374/8412141
    return this._carouselRef && this._carouselRef.getNode && this._carouselRef.getNode();
  }
  _getScrollEnabled() {
    return this._scrollEnabled;
  }
  _setScrollEnabled(scrollEnabled = true) {
    const wrappedRef = this._getWrappedRef();
    if (!wrappedRef || !wrappedRef.setNativeProps) {
      return;
    }

    // 'setNativeProps()' is used instead of 'setState()' because the latter
    // really takes a toll on Android behavior when momentum is disabled
    wrappedRef.setNativeProps({
      scrollEnabled
    });
    this._scrollEnabled = scrollEnabled;
  }
  _getKeyExtractor(item, index) {
    return this._needsScrollView() ? `scrollview-item-${index}` : `flatlist-item-${index}`;
  }
  _getScrollOffset(event) {
    const {
      vertical
    } = this.props;
    return event && event.nativeEvent && event.nativeEvent.contentOffset && event.nativeEvent.contentOffset[vertical ? 'y' : 'x'] || 0;
  }
  _getContainerInnerMargin(opposite = false) {
    const {
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight,
      vertical,
      activeSlideAlignment
    } = this.props;
    if (activeSlideAlignment === 'start' && !opposite || activeSlideAlignment === 'end' && opposite) {
      return 0;
    } else if (activeSlideAlignment === 'end' && !opposite || activeSlideAlignment === 'start' && opposite) {
      return vertical ? sliderHeight - itemHeight : sliderWidth - itemWidth;
    } else {
      return vertical ? (sliderHeight - itemHeight) / 2 : (sliderWidth - itemWidth) / 2;
    }
  }
  _getViewportOffset() {
    const {
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight,
      vertical,
      activeSlideAlignment
    } = this.props;
    if (activeSlideAlignment === 'start') {
      return vertical ? itemHeight / 2 : itemWidth / 2;
    } else if (activeSlideAlignment === 'end') {
      return vertical ? sliderHeight - itemHeight / 2 : sliderWidth - itemWidth / 2;
    } else {
      return vertical ? sliderHeight / 2 : sliderWidth / 2;
    }
  }
  _getCenter(offset) {
    return offset + this._getViewportOffset() - this._getContainerInnerMargin();
  }
  _getActiveItem(offset) {
    const {
      activeSlideOffset,
      swipeThreshold
    } = this.props;
    const center = this._getCenter(offset);
    const centerOffset = activeSlideOffset || swipeThreshold;
    for (let i = 0; i < this._positions.length; i++) {
      const {
        start,
        end
      } = this._positions[i];
      if (center + centerOffset >= start && center - centerOffset <= end) {
        return i;
      }
    }
    const lastIndex = this._positions.length - 1;
    if (this._positions[lastIndex] && center - centerOffset > this._positions[lastIndex].end) {
      return lastIndex;
    }
    return 0;
  }
  _initPositionsAndInterpolators(props = this.props) {
    const {
      data,
      itemWidth,
      itemHeight,
      scrollInterpolator,
      vertical
    } = props;
    const sizeRef = vertical ? itemHeight : itemWidth;
    if (!data || !data.length) {
      return;
    }
    let interpolators = [];
    this._positions = [];
    this._getCustomData(props).forEach((itemData, index) => {
      const _index = this._getCustomIndex(index, props);
      let animatedValue;
      this._positions[index] = {
        start: index * sizeRef,
        end: index * sizeRef + sizeRef
      };
      if (!this._shouldAnimateSlides(props)) {
        animatedValue = new Animated.Value(1);
      } else if (this._shouldUseCustomAnimation()) {
        animatedValue = new Animated.Value(_index === this._activeItem ? 1 : 0);
      } else {
        let interpolator;
        if (scrollInterpolator) {
          interpolator = scrollInterpolator(_index, props);
        } else if (this._shouldUseStackLayout()) {
          interpolator = stackScrollInterpolator(_index, props);
        } else if (this._shouldUseTinderLayout()) {
          interpolator = tinderScrollInterpolator(_index, props);
        }
        if (!interpolator || !interpolator.inputRange || !interpolator.outputRange) {
          interpolator = defaultScrollInterpolator(_index, props);
        }
        animatedValue = this._scrollPos.interpolate({
          ...interpolator,
          extrapolate: 'clamp'
        });
      }
      interpolators.push(animatedValue);
    });
    this.setState({
      interpolators
    });
  }
  _getSlideAnimation(index, toValue) {
    const {
      interpolators
    } = this.state;
    const {
      activeAnimationType,
      activeAnimationOptions
    } = this.props;
    const animatedValue = interpolators && interpolators[index];
    if (!animatedValue && animatedValue !== 0) {
      return null;
    }
    const animationCommonOptions = {
      isInteraction: false,
      useNativeDriver: true,
      ...activeAnimationOptions,
      toValue: toValue
    };
    return Animated.parallel([Animated['timing'](animatedValue, {
      ...animationCommonOptions,
      easing: Easing.linear
    }), Animated[activeAnimationType](animatedValue, {
      ...animationCommonOptions
    })]);
  }
  _playCustomSlideAnimation(current, next) {
    const {
      interpolators
    } = this.state;
    const itemsLength = this._getCustomDataLength();
    const _currentIndex = this._getCustomIndex(current);
    const _currentDataIndex = this._getDataIndex(_currentIndex);
    const _nextIndex = this._getCustomIndex(next);
    const _nextDataIndex = this._getDataIndex(_nextIndex);
    let animations = [];

    // Keep animations in sync when looping
    if (this._enableLoop()) {
      for (let i = 0; i < itemsLength; i++) {
        if (this._getDataIndex(i) === _currentDataIndex && interpolators[i]) {
          animations.push(this._getSlideAnimation(i, 0));
        } else if (this._getDataIndex(i) === _nextDataIndex && interpolators[i]) {
          animations.push(this._getSlideAnimation(i, 1));
        }
      }
    } else {
      if (interpolators[current]) {
        animations.push(this._getSlideAnimation(current, 0));
      }
      if (interpolators[next]) {
        animations.push(this._getSlideAnimation(next, 1));
      }
    }
    Animated.parallel(animations, {
      stopTogether: false
    }).start();
  }
  _hackActiveSlideAnimation(index, goTo, force = false) {
    const {
      data
    } = this.props;
    if (!this._mounted || !this._carouselRef || !this._positions[index] || !force && this._enableLoop()) {
      return;
    }
    const offset = this._positions[index] && this._positions[index].start;
    if (!offset && offset !== 0) {
      return;
    }
    const itemsLength = data && data.length;
    const direction = goTo || itemsLength === 1 ? 'start' : 'end';
    this._scrollTo(offset + (direction === 'start' ? -1 : 1), false);
    clearTimeout(this._hackSlideAnimationTimeout);
    this._hackSlideAnimationTimeout = setTimeout(() => {
      this._scrollTo(offset, false);
    }, 50); // works randomly when set to '0'
  }
  _lockScroll() {
    const {
      lockScrollTimeoutDuration
    } = this.props;
    clearTimeout(this._lockScrollTimeout);
    this._lockScrollTimeout = setTimeout(() => {
      this._releaseScroll();
    }, lockScrollTimeoutDuration);
    this._setScrollEnabled(false);
  }
  _releaseScroll() {
    clearTimeout(this._lockScrollTimeout);
    this._setScrollEnabled(true);
  }
  _repositionScroll(index) {
    const {
      data,
      loopClonesPerSide
    } = this.props;
    const dataLength = data && data.length;
    if (!this._enableLoop() || !dataLength || index >= loopClonesPerSide && index < dataLength + loopClonesPerSide) {
      return;
    }
    let repositionTo = index;
    if (index >= dataLength + loopClonesPerSide) {
      repositionTo = index - dataLength;
    } else if (index < loopClonesPerSide) {
      repositionTo = index + dataLength;
    }
    this._snapToItem(repositionTo, false, false, false, false);
  }
  _scrollTo(offset, animated = true) {
    const {
      vertical
    } = this.props;
    const wrappedRef = this._getWrappedRef();
    if (!this._mounted || !wrappedRef) {
      return;
    }
    const specificOptions = this._needsScrollView() ? {
      x: vertical ? 0 : offset,
      y: vertical ? offset : 0
    } : {
      offset
    };
    const options = {
      ...specificOptions,
      animated
    };
    if (this._needsScrollView()) {
      wrappedRef.scrollTo(options);
    } else {
      wrappedRef.scrollToOffset(options);
    }
  }
  _onScroll(event) {
    const {
      callbackOffsetMargin,
      enableMomentum,
      onScroll
    } = this.props;
    const scrollOffset = event ? this._getScrollOffset(event) : this._currentContentOffset;
    const nextActiveItem = this._getActiveItem(scrollOffset);
    const itemReached = nextActiveItem === this._itemToSnapTo;
    const scrollConditions = scrollOffset >= this._scrollOffsetRef - callbackOffsetMargin && scrollOffset <= this._scrollOffsetRef + callbackOffsetMargin;
    this._currentContentOffset = scrollOffset;
    this._onScrollTriggered = true;
    this._lastScrollDate = Date.now();
    if (this._activeItem !== nextActiveItem && this._shouldUseCustomAnimation()) {
      this._playCustomSlideAnimation(this._activeItem, nextActiveItem);
    }
    if (enableMomentum) {
      clearTimeout(this._snapNoMomentumTimeout);
      if (this._activeItem !== nextActiveItem) {
        this._activeItem = nextActiveItem;
      }
      if (itemReached) {
        if (this._canFireBeforeCallback) {
          this._onBeforeSnap(this._getDataIndex(nextActiveItem));
        }
        if (scrollConditions && this._canFireCallback) {
          this._onSnap(this._getDataIndex(nextActiveItem));
        }
      }
    } else if (this._activeItem !== nextActiveItem && itemReached) {
      if (this._canFireBeforeCallback) {
        this._onBeforeSnap(this._getDataIndex(nextActiveItem));
      }
      if (scrollConditions) {
        this._activeItem = nextActiveItem;
        if (this._canLockScroll()) {
          this._releaseScroll();
        }
        if (this._canFireCallback) {
          this._onSnap(this._getDataIndex(nextActiveItem));
        }
      }
    }
    if (nextActiveItem === this._itemToSnapTo && scrollOffset === this._scrollOffsetRef) {
      this._repositionScroll(nextActiveItem);
    }
    if (typeof onScroll === "function" && event) {
      onScroll(event);
    }
  }
  _onStartShouldSetResponderCapture(event) {
    const {
      onStartShouldSetResponderCapture
    } = this.props;
    if (onStartShouldSetResponderCapture) {
      onStartShouldSetResponderCapture(event);
    }
    return this._getScrollEnabled();
  }
  _onTouchStart() {
    const {
      onTouchStart
    } = this.props;

    // `onTouchStart` is fired even when `scrollEnabled` is set to `false`
    if (this._getScrollEnabled() !== false && this._autoplaying) {
      this.pauseAutoPlay();
    }
    if (onTouchStart) {
      onTouchStart();
    }
  }
  _onTouchEnd() {
    const {
      onTouchEnd
    } = this.props;
    if (this._getScrollEnabled() !== false && this._autoplay && !this._autoplaying) {
      // This event is buggy on Android, so a fallback is provided in _onScrollEnd()
      this.startAutoplay();
    }
    if (onTouchEnd) {
      onTouchEnd();
    }
  }

  // Used when `enableSnap` is ENABLED
  _onScrollBeginDrag(event) {
    const {
      onScrollBeginDrag
    } = this.props;
    if (!this._getScrollEnabled()) {
      return;
    }
    this._scrollStartOffset = this._getScrollOffset(event);
    this._scrollStartActive = this._getActiveItem(this._scrollStartOffset);
    this._ignoreNextMomentum = false;
    // this._canFireCallback = false;

    if (onScrollBeginDrag) {
      onScrollBeginDrag(event);
    }
  }

  // Used when `enableMomentum` is DISABLED
  _onScrollEndDrag(event) {
    const {
      onScrollEndDrag
    } = this.props;
    if (this._carouselRef) {
      this._onScrollEnd && this._onScrollEnd();
    }
    if (onScrollEndDrag) {
      onScrollEndDrag(event);
    }
  }

  // Used when `enableMomentum` is ENABLED
  _onMomentumScrollEnd(event) {
    const {
      onMomentumScrollEnd
    } = this.props;
    if (this._carouselRef) {
      this._onScrollEnd && this._onScrollEnd();
    }
    if (onMomentumScrollEnd) {
      onMomentumScrollEnd(event);
    }
  }
  _onScrollEnd(event) {
    const {
      autoplayDelay,
      enableSnap
    } = this.props;
    if (this._ignoreNextMomentum) {
      // iOS fix
      this._ignoreNextMomentum = false;
      return;
    }
    if (this._currentContentOffset === this._scrollEndOffset) {
      return;
    }
    this._scrollEndOffset = this._currentContentOffset;
    this._scrollEndActive = this._getActiveItem(this._scrollEndOffset);
    if (enableSnap) {
      this._snapScroll(this._scrollEndOffset - this._scrollStartOffset);
    }

    // The touchEnd event is buggy on Android, so this will serve as a fallback whenever needed
    // https://github.com/facebook/react-native/issues/9439
    if (this._autoplay && !this._autoplaying) {
      clearTimeout(this._enableAutoplayTimeout);
      this._enableAutoplayTimeout = setTimeout(() => {
        this.startAutoplay();
      }, autoplayDelay + 50);
    }
  }

  // Due to a bug, this event is only fired on iOS
  // https://github.com/facebook/react-native/issues/6791
  // it's fine since we're only fixing an iOS bug in it, so ...
  _onTouchRelease(event) {
    const {
      enableMomentum
    } = this.props;
    if (enableMomentum && IS_IOS$1) {
      clearTimeout(this._snapNoMomentumTimeout);
      this._snapNoMomentumTimeout = setTimeout(() => {
        this._snapToItem(this._activeItem);
      }, 100);
    }
  }
  _onLayout(event) {
    const {
      onLayout
    } = this.props;

    // Prevent unneeded actions during the first 'onLayout' (triggered on init)
    if (this._onLayoutInitDone) {
      this._initPositionsAndInterpolators();
      this._snapToItem(this._activeItem, false, false, false, false);
    } else {
      this._onLayoutInitDone = true;
    }
    if (onLayout) {
      onLayout(event);
    }
  }
  _snapScroll(delta) {
    const {
      swipeThreshold
    } = this.props;

    // When using momentum and releasing the touch with
    // no velocity, scrollEndActive will be undefined (iOS)
    if (!this._scrollEndActive && this._scrollEndActive !== 0 && IS_IOS$1) {
      this._scrollEndActive = this._scrollStartActive;
    }
    if (this._scrollStartActive !== this._scrollEndActive) {
      // Snap to the new active item
      this._snapToItem(this._scrollEndActive);
    } else {
      // Snap depending on delta
      if (delta > 0) {
        if (delta > swipeThreshold) {
          this._snapToItem(this._scrollStartActive + 1);
        } else {
          this._snapToItem(this._scrollEndActive);
        }
      } else if (delta < 0) {
        if (delta < -swipeThreshold) {
          this._snapToItem(this._scrollStartActive - 1);
        } else {
          this._snapToItem(this._scrollEndActive);
        }
      } else {
        // Snap to current
        this._snapToItem(this._scrollEndActive);
      }
    }
  }
  _snapToItem(index, animated = true, fireCallback = true, initial = false, lockScroll = true) {
    const {
      enableMomentum,
      onSnapToItem,
      onBeforeSnapToItem
    } = this.props;
    const itemsLength = this._getCustomDataLength();
    const wrappedRef = this._getWrappedRef();
    if (!itemsLength || !wrappedRef) {
      return;
    }
    if (!index || index < 0) {
      index = 0;
    } else if (itemsLength > 0 && index >= itemsLength) {
      index = itemsLength - 1;
    }
    if (index !== this._previousActiveItem) {
      this._previousActiveItem = index;

      // Placed here to allow overscrolling for edges items
      if (lockScroll && this._canLockScroll()) {
        this._lockScroll();
      }
      if (fireCallback) {
        if (onBeforeSnapToItem) {
          this._canFireBeforeCallback = true;
        }
        if (onSnapToItem) {
          this._canFireCallback = true;
        }
      }
    }
    this._itemToSnapTo = index;
    this._scrollOffsetRef = this._positions[index] && this._positions[index].start;
    this._onScrollTriggered = false;
    if (!this._scrollOffsetRef && this._scrollOffsetRef !== 0) {
      return;
    }
    this._scrollTo(this._scrollOffsetRef, animated);
    this._scrollEndOffset = this._currentContentOffset;
    if (enableMomentum) {
      // iOS fix, check the note in the constructor
      if (!initial) {
        this._ignoreNextMomentum = true;
      }

      // When momentum is enabled and the user is overscrolling or swiping very quickly,
      // 'onScroll' is not going to be triggered for edge items. Then callback won't be
      // fired and loop won't work since the scrollview is not going to be repositioned.
      // As a workaround, '_onScroll()' will be called manually for these items if a given
      // condition hasn't been met after a small delay.
      // WARNING: this is ok only when relying on 'momentumScrollEnd', not with 'scrollEndDrag'
      if (index === 0 || index === itemsLength - 1) {
        clearTimeout(this._edgeItemTimeout);
        this._edgeItemTimeout = setTimeout(() => {
          if (!initial && index === this._activeItem && !this._onScrollTriggered) {
            this._onScroll();
          }
        }, 250);
      }
    }
  }
  _onBeforeSnap(index) {
    const {
      onBeforeSnapToItem
    } = this.props;
    if (!this._carouselRef) {
      return;
    }
    this._canFireBeforeCallback = false;
    onBeforeSnapToItem && onBeforeSnapToItem(index);
  }
  _onSnap(index) {
    const {
      onSnapToItem
    } = this.props;
    if (!this._carouselRef) {
      return;
    }
    this._canFireCallback = false;
    onSnapToItem && onSnapToItem(index);
  }
  startAutoplay() {
    const {
      autoplayInterval,
      autoplayDelay
    } = this.props;
    this._autoplay = true;
    if (this._autoplaying) {
      return;
    }
    clearTimeout(this._autoplayTimeout);
    this._autoplayTimeout = setTimeout(() => {
      this._autoplaying = true;
      this._autoplayInterval = setInterval(() => {
        if (this._autoplaying) {
          this.snapToNext();
        }
      }, autoplayInterval);
    }, autoplayDelay);
  }
  pauseAutoPlay() {
    this._autoplaying = false;
    clearTimeout(this._autoplayTimeout);
    clearTimeout(this._enableAutoplayTimeout);
    clearInterval(this._autoplayInterval);
  }
  stopAutoplay() {
    this._autoplay = false;
    this.pauseAutoPlay();
  }
  snapToItem(index, animated = true, fireCallback = true) {
    if (!index || index < 0) {
      index = 0;
    }
    const positionIndex = this._getPositionIndex(index);
    if (positionIndex === this._activeItem) {
      return;
    }
    this._snapToItem(positionIndex, animated, fireCallback);
  }
  snapToNext(animated = true, fireCallback = true) {
    const itemsLength = this._getCustomDataLength();
    let newIndex = this._activeItem + 1;
    if (newIndex > itemsLength - 1) {
      if (!this._enableLoop()) {
        return;
      }
      newIndex = 0;
    }
    this._snapToItem(newIndex, animated, fireCallback);
  }
  snapToPrev(animated = true, fireCallback = true) {
    const itemsLength = this._getCustomDataLength();
    let newIndex = this._activeItem - 1;
    if (newIndex < 0) {
      if (!this._enableLoop()) {
        return;
      }
      newIndex = itemsLength - 1;
    }
    this._snapToItem(newIndex, animated, fireCallback);
  }

  // https://github.com/facebook/react-native/issues/1831#issuecomment-231069668
  triggerRenderingHack(offset) {
    // Avoid messing with user scroll
    if (Date.now() - this._lastScrollDate < 500) {
      return;
    }
    const scrollPosition = this._currentContentOffset;
    if (!scrollPosition && scrollPosition !== 0) {
      return;
    }
    const scrollOffset = offset || (scrollPosition === 0 ? 1 : -1);
    this._scrollTo(scrollPosition + scrollOffset, false);
  }
  _getSlideInterpolatedStyle(index, animatedValue) {
    const {
      layoutCardOffset,
      slideInterpolatedStyle
    } = this.props;
    if (slideInterpolatedStyle) {
      return slideInterpolatedStyle(index, animatedValue, this.props);
    } else if (this._shouldUseTinderLayout()) {
      return tinderAnimatedStyles(index, animatedValue, this.props, layoutCardOffset);
    } else if (this._shouldUseStackLayout()) {
      return stackAnimatedStyles(index, animatedValue, this.props, layoutCardOffset);
    } else if (this._shouldUseShiftLayout()) {
      return shiftAnimatedStyles(index, animatedValue, this.props);
    } else {
      return defaultAnimatedStyles(index, animatedValue, this.props);
    }
  }
  _renderItem({
    item,
    index
  }) {
    const {
      interpolators
    } = this.state;
    const {
      hasParallaxImages,
      itemWidth,
      itemHeight,
      keyExtractor,
      renderItem,
      sliderHeight,
      sliderWidth,
      slideStyle,
      vertical
    } = this.props;
    const animatedValue = interpolators && interpolators[index];
    if (!animatedValue && animatedValue !== 0) {
      return null;
    }
    const animate = this._shouldAnimateSlides();
    const Component = animate ? Animated.View : View;
    const animatedStyle = animate ? this._getSlideInterpolatedStyle(index, animatedValue) : {};
    const parallaxProps = hasParallaxImages ? {
      scrollPosition: this._scrollPos,
      carouselRef: this._carouselRef,
      vertical,
      sliderWidth,
      sliderHeight,
      itemWidth,
      itemHeight
    } : undefined;
    const mainDimension = vertical ? {
      height: itemHeight
    } : {
      width: itemWidth
    };
    const specificProps = this._needsScrollView() ? {
      key: keyExtractor ? keyExtractor(item, index) : this._getKeyExtractor(item, index)
    } : {};
    return /*#__PURE__*/React.createElement(Component, _extends({
      style: [mainDimension, slideStyle, animatedStyle],
      pointerEvents: 'box-none'
    }, specificProps), renderItem({
      item,
      index
    }, parallaxProps));
  }
  _getComponentOverridableProps() {
    const {
      enableMomentum,
      itemWidth,
      itemHeight,
      loopClonesPerSide,
      sliderWidth,
      sliderHeight,
      vertical
    } = this.props;
    const visibleItems = Math.ceil(vertical ? sliderHeight / itemHeight : sliderWidth / itemWidth) + 1;
    const initialNumPerSide = this._enableLoop() ? loopClonesPerSide : 2;
    const initialNumToRender = visibleItems + initialNumPerSide * 2;
    const maxToRenderPerBatch = 1 + initialNumToRender * 2;
    const windowSize = maxToRenderPerBatch;
    const specificProps = !this._needsScrollView() ? {
      initialNumToRender: initialNumToRender,
      maxToRenderPerBatch: maxToRenderPerBatch,
      windowSize: windowSize
      // updateCellsBatchingPeriod
    } : {};
    return {
      decelerationRate: enableMomentum ? 0.9 : 'fast',
      showsHorizontalScrollIndicator: false,
      showsVerticalScrollIndicator: false,
      overScrollMode: 'never',
      automaticallyAdjustContentInsets: false,
      directionalLockEnabled: true,
      pinchGestureEnabled: false,
      scrollsToTop: false,
      removeClippedSubviews: !this._needsScrollView(),
      inverted: this._needsRTLAdaptations(),
      // renderToHardwareTextureAndroid: true,
      ...specificProps
    };
  }
  _getComponentStaticProps() {
    const {
      hideCarousel
    } = this.state;
    const {
      containerCustomStyle,
      contentContainerCustomStyle,
      keyExtractor,
      sliderWidth,
      sliderHeight,
      style,
      vertical
    } = this.props;
    const containerStyle = [containerCustomStyle || style || {}, hideCarousel ? {
      opacity: 0
    } : {}, vertical ? {
      height: sliderHeight,
      flexDirection: 'column'
    } :
    // LTR hack; see https://github.com/facebook/react-native/issues/11960
    // and https://github.com/facebook/react-native/issues/13100#issuecomment-328986423
    {
      width: sliderWidth,
      flexDirection: this._needsRTLAdaptations() ? 'row-reverse' : 'row'
    }];
    const contentContainerStyle = [vertical ? {
      paddingTop: this._getContainerInnerMargin(),
      paddingBottom: this._getContainerInnerMargin(true)
    } : {
      paddingLeft: this._getContainerInnerMargin(),
      paddingRight: this._getContainerInnerMargin(true)
    }, contentContainerCustomStyle || {}];
    const specificProps = !this._needsScrollView() ? {
      // extraData: this.state,
      renderItem: this._renderItem,
      numColumns: 1,
      keyExtractor: keyExtractor || this._getKeyExtractor
    } : {};
    return {
      ref: c => this._carouselRef = c,
      data: this._getCustomData(),
      style: containerStyle,
      contentContainerStyle: contentContainerStyle,
      horizontal: !vertical,
      scrollEventThrottle: 1,
      onScroll: this._onScrollHandler,
      onScrollBeginDrag: this._onScrollBeginDrag,
      onScrollEndDrag: this._onScrollEndDrag,
      onMomentumScrollEnd: this._onMomentumScrollEnd,
      onResponderRelease: this._onTouchRelease,
      onStartShouldSetResponderCapture: this._onStartShouldSetResponderCapture,
      onTouchStart: this._onTouchStart,
      onTouchEnd: this._onScrollEnd,
      onLayout: this._onLayout,
      ...specificProps
    };
  }
  render() {
    const {
      data,
      renderItem,
      useScrollView
    } = this.props;
    if (!data || !renderItem) {
      return null;
    }
    const props = {
      ...this._getComponentOverridableProps(),
      ...this.props,
      ...this._getComponentStaticProps()
    };
    const ScrollViewComponent = typeof useScrollView === 'function' ? useScrollView : AnimatedScrollView;
    return this._needsScrollView() ? /*#__PURE__*/React.createElement(ScrollViewComponent, props, this._getCustomData().map((item, index) => {
      return this._renderItem({
        item,
        index
      });
    })) : /*#__PURE__*/React.createElement(AnimatedFlatList, props);
  }
}
_defineProperty(Carousel, "propTypes", {
  data: propTypes.exports.array.isRequired,
  renderItem: propTypes.exports.func.isRequired,
  itemWidth: propTypes.exports.number,
  // required for horizontal carousel
  itemHeight: propTypes.exports.number,
  // required for vertical carousel
  sliderWidth: propTypes.exports.number,
  // required for horizontal carousel
  sliderHeight: propTypes.exports.number,
  // required for vertical carousel
  activeAnimationType: propTypes.exports.string,
  activeAnimationOptions: propTypes.exports.object,
  activeSlideAlignment: propTypes.exports.oneOf(['center', 'end', 'start']),
  activeSlideOffset: propTypes.exports.number,
  apparitionDelay: propTypes.exports.number,
  autoplay: propTypes.exports.bool,
  autoplayDelay: propTypes.exports.number,
  autoplayInterval: propTypes.exports.number,
  callbackOffsetMargin: propTypes.exports.number,
  containerCustomStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  contentContainerCustomStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  enableMomentum: propTypes.exports.bool,
  enableSnap: propTypes.exports.bool,
  firstItem: propTypes.exports.number,
  hasParallaxImages: propTypes.exports.bool,
  inactiveSlideOpacity: propTypes.exports.number,
  inactiveSlideScale: propTypes.exports.number,
  inactiveSlideShift: propTypes.exports.number,
  layout: propTypes.exports.oneOf(['default', 'stack', 'tinder']),
  layoutCardOffset: propTypes.exports.number,
  lockScrollTimeoutDuration: propTypes.exports.number,
  lockScrollWhileSnapping: propTypes.exports.bool,
  loop: propTypes.exports.bool,
  loopClonesPerSide: propTypes.exports.number,
  scrollEnabled: propTypes.exports.bool,
  scrollInterpolator: propTypes.exports.func,
  slideInterpolatedStyle: propTypes.exports.func,
  slideStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  shouldOptimizeUpdates: propTypes.exports.bool,
  swipeThreshold: propTypes.exports.number,
  useScrollView: propTypes.exports.oneOfType([propTypes.exports.bool, propTypes.exports.func]),
  vertical: propTypes.exports.bool,
  onBeforeSnapToItem: propTypes.exports.func,
  onSnapToItem: propTypes.exports.func
});
_defineProperty(Carousel, "defaultProps", {
  activeAnimationType: 'timing',
  activeAnimationOptions: null,
  activeSlideAlignment: 'center',
  activeSlideOffset: 20,
  apparitionDelay: 0,
  autoplay: false,
  autoplayDelay: 1000,
  autoplayInterval: 3000,
  callbackOffsetMargin: 5,
  containerCustomStyle: {},
  contentContainerCustomStyle: {},
  enableMomentum: false,
  enableSnap: true,
  firstItem: 0,
  hasParallaxImages: false,
  inactiveSlideOpacity: 0.7,
  inactiveSlideScale: 0.9,
  inactiveSlideShift: 0,
  layout: 'default',
  lockScrollTimeoutDuration: 1000,
  lockScrollWhileSnapping: false,
  loop: false,
  loopClonesPerSide: 3,
  scrollEnabled: true,
  slideStyle: {},
  shouldOptimizeUpdates: true,
  swipeThreshold: 20,
  useScrollView: !AnimatedFlatList,
  vertical: false
});

const DEFAULT_DOT_SIZE = 7;
const DEFAULT_DOT_COLOR = 'rgba(0, 0, 0, 0.75)';
var styles$2 = StyleSheet.create({
  sliderPagination: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  sliderPaginationDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8
  },
  sliderPaginationDot: {
    width: DEFAULT_DOT_SIZE,
    height: DEFAULT_DOT_SIZE,
    borderRadius: DEFAULT_DOT_SIZE / 2,
    backgroundColor: DEFAULT_DOT_COLOR
  }
});

class PaginationDot extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animColor: new Animated.Value(0),
      animOpacity: new Animated.Value(0),
      animTransform: new Animated.Value(0)
    };
  }
  componentDidMount() {
    if (this.props.active) {
      this._animate(1);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      this._animate(this.props.active ? 1 : 0);
    }
  }
  _animate(toValue = 0) {
    const {
      animColor,
      animOpacity,
      animTransform
    } = this.state;
    const {
      animatedDuration,
      animatedFriction,
      animatedTension
    } = this.props;
    const commonProperties = {
      toValue,
      duration: animatedDuration,
      isInteraction: false,
      useNativeDriver: !this._shouldAnimateColor
    };
    let animations = [Animated.timing(animOpacity, {
      easing: Easing.linear,
      ...commonProperties
    }), Animated.spring(animTransform, {
      friction: animatedFriction,
      tension: animatedTension,
      ...commonProperties
    })];
    if (this._shouldAnimateColor) {
      animations.push(Animated.timing(animColor, {
        easing: Easing.linear,
        ...commonProperties
      }));
    }
    Animated.parallel(animations).start();
  }
  get _shouldAnimateColor() {
    const {
      color,
      inactiveColor
    } = this.props;
    return color && inactiveColor;
  }
  render() {
    const {
      animColor,
      animOpacity,
      animTransform
    } = this.state;
    const {
      active,
      activeOpacity,
      carouselRef,
      color,
      containerStyle,
      inactiveColor,
      inactiveStyle,
      inactiveOpacity,
      inactiveScale,
      index,
      style,
      tappable,
      delayPressInDot
    } = this.props;
    const animatedStyle = {
      opacity: animOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveOpacity, 1]
      }),
      transform: [{
        scale: animTransform.interpolate({
          inputRange: [0, 1],
          outputRange: [inactiveScale, 1]
        })
      }]
    };
    const animatedColor = this._shouldAnimateColor ? {
      backgroundColor: animColor.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveColor, color]
      })
    } : {};
    const dotContainerStyle = [styles$2.sliderPaginationDotContainer, containerStyle || {}];
    const dotStyle = [styles$2.sliderPaginationDot, style || {}, !active && inactiveStyle || {}, animatedStyle, animatedColor];
    const onPress = tappable ? () => {
      try {
        const currentRef = carouselRef.current || carouselRef;
        currentRef._snapToItem(currentRef._getPositionIndex(index));
      } catch (error) {
        console.warn('react-native-snap-carousel | Pagination: ' + '`carouselRef` has to be a Carousel ref.\n' + error);
      }
    } : undefined;
    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      accessible: false,
      style: dotContainerStyle,
      activeOpacity: tappable ? activeOpacity : 1,
      onPress: onPress,
      delayPressIn: delayPressInDot
    }, /*#__PURE__*/React.createElement(Animated.View, {
      style: dotStyle
    }));
  }
}
_defineProperty(PaginationDot, "propTypes", {
  inactiveOpacity: propTypes.exports.number.isRequired,
  inactiveScale: propTypes.exports.number.isRequired,
  active: propTypes.exports.bool,
  activeOpacity: propTypes.exports.number,
  carouselRef: propTypes.exports.object,
  color: propTypes.exports.string,
  containerStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  inactiveColor: propTypes.exports.string,
  inactiveStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  index: propTypes.exports.number,
  style: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  tappable: propTypes.exports.bool
});

const IS_IOS = "android" === 'ios';
const IS_RTL = I18nManager.isRTL;
class Pagination extends PureComponent {
  constructor(props) {
    super(props);

    // Warnings
    if (props.dotColor && !props.inactiveDotColor || !props.dotColor && props.inactiveDotColor) {
      console.warn('react-native-snap-carousel | Pagination: ' + 'You need to specify both `dotColor` and `inactiveDotColor`');
    }
    if (props.dotElement && !props.inactiveDotElement || !props.dotElement && props.inactiveDotElement) {
      console.warn('react-native-snap-carousel | Pagination: ' + 'You need to specify both `dotElement` and `inactiveDotElement`');
    }
    if (props.tappableDots && props.carouselRef === undefined) {
      console.warn('react-native-snap-carousel | Pagination: ' + 'You must specify prop `carouselRef` when setting `tappableDots` to `true`');
    }
  }
  _needsRTLAdaptations() {
    const {
      vertical
    } = this.props;
    return IS_RTL && !IS_IOS && !vertical;
  }
  get _activeDotIndex() {
    const {
      activeDotIndex,
      dotsLength
    } = this.props;
    return this._needsRTLAdaptations() ? dotsLength - activeDotIndex - 1 : activeDotIndex;
  }
  get dots() {
    const {
      activeOpacity,
      carouselRef,
      dotsLength,
      dotColor,
      dotContainerStyle,
      dotElement,
      dotStyle,
      inactiveDotColor,
      inactiveDotElement,
      inactiveDotOpacity,
      inactiveDotScale,
      inactiveDotStyle,
      renderDots,
      tappableDots,
      animatedDuration,
      animatedFriction,
      animatedTension,
      delayPressInDot
    } = this.props;
    if (renderDots) {
      return renderDots(this._activeDotIndex, dotsLength, this);
    }
    const DefaultDot = /*#__PURE__*/React.createElement(PaginationDot, {
      carouselRef: carouselRef,
      tappable: tappableDots && typeof carouselRef !== 'undefined',
      activeOpacity: activeOpacity,
      color: dotColor,
      containerStyle: dotContainerStyle,
      style: dotStyle,
      inactiveColor: inactiveDotColor,
      inactiveOpacity: inactiveDotOpacity,
      inactiveScale: inactiveDotScale,
      inactiveStyle: inactiveDotStyle,
      animatedDuration: animatedDuration,
      animatedFriction: animatedFriction,
      animatedTension: animatedTension,
      delayPressInDot: delayPressInDot
    });
    const dots = [...Array(dotsLength).keys()].map(i => {
      const isActive = i === this._activeDotIndex;
      return React.cloneElement((isActive ? dotElement : inactiveDotElement) || DefaultDot, {
        key: `pagination-dot-${i}`,
        active: isActive,
        index: i
      });
    });
    return dots;
  }
  render() {
    const {
      dotsLength,
      containerStyle,
      vertical,
      accessibilityLabel
    } = this.props;
    if (!dotsLength || dotsLength < 2) {
      return false;
    }
    const style = [styles$2.sliderPagination, {
      flexDirection: vertical ? 'column' : this._needsRTLAdaptations() ? 'row-reverse' : 'row'
    }, containerStyle || {}];
    return /*#__PURE__*/React.createElement(View, {
      pointerEvents: 'box-none',
      style: style,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel
    }, this.dots);
  }
}
_defineProperty(Pagination, "propTypes", {
  activeDotIndex: propTypes.exports.number.isRequired,
  dotsLength: propTypes.exports.number.isRequired,
  activeOpacity: propTypes.exports.number,
  carouselRef: propTypes.exports.object,
  containerStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  dotColor: propTypes.exports.string,
  dotContainerStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  dotElement: propTypes.exports.element,
  dotStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  inactiveDotColor: propTypes.exports.string,
  inactiveDotElement: propTypes.exports.element,
  inactiveDotOpacity: propTypes.exports.number,
  inactiveDotScale: propTypes.exports.number,
  inactiveDotStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  renderDots: propTypes.exports.func,
  tappableDots: propTypes.exports.bool,
  vertical: propTypes.exports.bool,
  accessibilityLabel: propTypes.exports.string,
  animatedDuration: propTypes.exports.number,
  animatedFriction: propTypes.exports.number,
  animatedTension: propTypes.exports.number,
  delayPressInDot: propTypes.exports.number
});
_defineProperty(Pagination, "defaultProps", {
  inactiveDotOpacity: 0.5,
  inactiveDotScale: 0.5,
  tappableDots: false,
  vertical: false,
  animatedDuration: 250,
  animatedFriction: 4,
  animatedTension: 50,
  delayPressInDot: 0
});

var styles$1 = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    position: 'relative',
    resizeMode: 'cover',
    width: null,
    height: null
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class ParallaxImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      width: 0,
      height: 0,
      status: 1,
      // 1 -> loading; 2 -> loaded // 3 -> transition finished; 4 -> error
      animOpacity: new Animated.Value(0)
    };
    this._onLoad = this._onLoad.bind(this);
    this._onError = this._onError.bind(this);
    this._measureLayout = this._measureLayout.bind(this);
  }
  setNativeProps(nativeProps) {
    this._container.setNativeProps(nativeProps);
  }
  componentDidMount() {
    this._mounted = true;
    setTimeout(() => {
      this._measureLayout();
    }, 0);
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  _measureLayout() {
    if (this._container) {
      const {
        dimensions,
        vertical,
        carouselRef,
        sliderWidth,
        sliderHeight,
        itemWidth,
        itemHeight
      } = this.props;
      if (carouselRef) {
        this._container.measureLayout(findNodeHandle(carouselRef), (x, y, width, height, pageX, pageY) => {
          const offset = vertical ? y - (sliderHeight - itemHeight) / 2 : x - (sliderWidth - itemWidth) / 2;
          this.setState({
            offset: offset,
            width: dimensions && dimensions.width ? dimensions.width : Math.ceil(width),
            height: dimensions && dimensions.height ? dimensions.height : Math.ceil(height)
          });
        });
      }
    }
  }
  _onLoad(event) {
    const {
      animOpacity
    } = this.state;
    const {
      fadeDuration,
      onLoad
    } = this.props;
    if (!this._mounted) {
      return;
    }
    this.setState({
      status: 2
    });
    if (onLoad) {
      onLoad(event);
    }
    Animated.timing(animOpacity, {
      toValue: 1,
      duration: fadeDuration,
      easing: Easing.out(Easing.quad),
      isInteraction: false,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        status: 3
      });
    });
  }

  // If arg is missing from method signature, it just won't be called
  _onError(event) {
    const {
      onError
    } = this.props;
    this.setState({
      status: 4
    });
    if (onError) {
      onError(event);
    }
  }
  get image() {
    const {
      status,
      animOpacity,
      offset,
      width,
      height
    } = this.state;
    const {
      scrollPosition,
      dimensions,
      vertical,
      sliderWidth,
      sliderHeight,
      parallaxFactor,
      style,
      AnimatedImageComponent,
      ...other
    } = this.props;
    const parallaxPadding = (vertical ? height : width) * parallaxFactor;
    const requiredStyles = {
      position: 'relative'
    };
    const dynamicStyles = {
      width: vertical ? width : width + parallaxPadding * 2,
      height: vertical ? height + parallaxPadding * 2 : height,
      opacity: animOpacity,
      transform: scrollPosition ? [{
        translateX: !vertical ? scrollPosition.interpolate({
          inputRange: [offset - sliderWidth, offset + sliderWidth],
          outputRange: [-parallaxPadding, parallaxPadding],
          extrapolate: 'clamp'
        }) : 0
      }, {
        translateY: vertical ? scrollPosition.interpolate({
          inputRange: [offset - sliderHeight, offset + sliderHeight],
          outputRange: [-parallaxPadding, parallaxPadding],
          extrapolate: 'clamp'
        }) : 0
      }] : []
    };
    return /*#__PURE__*/React.createElement(AnimatedImageComponent, _extends({}, other, {
      style: [styles$1.image, style, requiredStyles, dynamicStyles],
      onLoad: this._onLoad,
      onError: status !== 3 ? this._onError : undefined // prevent infinite-loop bug
    }));
  }
  get spinner() {
    const {
      status
    } = this.state;
    const {
      showSpinner,
      spinnerColor
    } = this.props;
    return status === 1 && showSpinner ? /*#__PURE__*/React.createElement(View, {
      style: styles$1.loaderContainer
    }, /*#__PURE__*/React.createElement(ActivityIndicator, {
      size: 'small',
      color: spinnerColor,
      animating: true
    })) : false;
  }
  render() {
    const {
      containerStyle
    } = this.props;
    return /*#__PURE__*/React.createElement(View, {
      ref: c => {
        this._container = c;
      },
      pointerEvents: 'none',
      style: [containerStyle, styles$1.container],
      onLayout: this._measureLayout
    }, this.image, this.spinner);
  }
}
_defineProperty(ParallaxImage, "propTypes", {
  ...Image.propTypes,
  carouselRef: propTypes.exports.object,
  // passed from <Carousel />
  itemHeight: propTypes.exports.number,
  // passed from <Carousel />
  itemWidth: propTypes.exports.number,
  // passed from <Carousel />
  scrollPosition: propTypes.exports.object,
  // passed from <Carousel />
  sliderHeight: propTypes.exports.number,
  // passed from <Carousel />
  sliderWidth: propTypes.exports.number,
  // passed from <Carousel />
  vertical: propTypes.exports.bool,
  // passed from <Carousel />
  containerStyle: deprecatedReactNativePropTypes.ViewPropTypes ? deprecatedReactNativePropTypes.ViewPropTypes.style : View.propTypes.style,
  dimensions: propTypes.exports.shape({
    width: propTypes.exports.number,
    height: propTypes.exports.number
  }),
  fadeDuration: propTypes.exports.number,
  parallaxFactor: propTypes.exports.number,
  showSpinner: propTypes.exports.bool,
  spinnerColor: propTypes.exports.string,
  AnimatedImageComponent: propTypes.exports.oneOfType([propTypes.exports.func, propTypes.exports.object])
});
_defineProperty(ParallaxImage, "defaultProps", {
  containerStyle: {},
  fadeDuration: 500,
  parallaxFactor: 0.3,
  showSpinner: true,
  spinnerColor: 'rgba(0, 0, 0, 0.4)',
  AnimatedImageComponent: Animated.Image
});

const windowWidth$1 = Dimensions.get("window").width;
function useSwipe(onSwipeLeft, onSwipeRight, rangeOffset = 4) {
  let firstTouch = 0;

  // set user touch start position
  function onTouchStart(e) {
    firstTouch = e.nativeEvent.pageX;
  }

  // when touch ends check for swipe directions
  function onTouchEnd(e) {
    // get touch position and screen size
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth$1 / rangeOffset;

    // check if position is growing positively and has reached specified range
    if (positionX - firstTouch > range) {
      onSwipeRight && onSwipeRight();
    }
    // check if position is growing negatively and has reached specified range
    else if (firstTouch - positionX > range) {
      onSwipeLeft && onSwipeLeft();
    }
  }
  return {
    onTouchStart,
    onTouchEnd
  };
}

const {
  width: windowWidth,
  height: windowHeight
} = Dimensions.get("window");

// hex color regex validation, support for 3-character HEX codes (no transparent supported)
// This means that instead of matching exactly 6 characters, it will match exactly 3 characters, but only 1 or 2 times. Allowing "ABC" and "AABBCC", but not "ABCD"
const hexColorValidate = /^#([0-9A-F]{3}){1,2}$/i;
function SnapCarousel({
  dataType,
  staticItems,
  data,
  action,
  content,
  scrollEnabled,
  firstItem,
  layout,
  pagination,
  paginationColor,
  loop,
  autoplay,
  autoplayDelay,
  autoplayInterval,
  lockScrollWhileSnapping,
  activeSlideOffset,
  layoutCardOffset,
  inactiveSlideOpacity,
  inactiveSlideScale,
  carouselWidth,
  customWidth,
  carouselPadding
}) {
  const [itemsObj, setItemsObj] = useState({});
  const [itemsKey, setItemsKey] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [startingItemIndex, setStartingItemIndex] = useState(null);
  const [scroll, setScroll] = useState(true);
  const [loopTimeout, setLoopTimeout] = useState(null);
  const [longPressFlag, setLongPressFlag] = useState(false);
  const [calcCarouselWidth, setCalcCarouselWidth] = useState(0);
  const [calcCarouselHeight, setCalcCarouselHeight] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const _carousel = useRef();

  /*****************************************************************************/
  /**************************** Manual Infante Loop ****************************/
  /*****************************************************************************/
  const {
    onTouchStart,
    onTouchEnd
  } = useSwipe(onSwipeLeft, onSwipeRight, 4);
  /**
   * This method is handling navigating to the first item when swiping left the last item or navigating to the second item when swiping left the first item
   */
  function onSwipeLeft() {
    const idxToSwipe = activeItem === itemsKey.length - 1 ? 0 : activeItem + 1;
    _carousel?.current?.snapToItem(idxToSwipe);
  }

  /**
   * This method is handling navigating to the last item when swiping right the first item or navigating to the before last item when swiping left the last item
   */
  function onSwipeRight() {
    const idxToSwipe = activeItem === 0 ? itemsKey.length - 1 : activeItem - 1;
    _carousel?.current?.snapToItem(idxToSwipe);
  }
  /*****************************************************************************/
  /*****************************************************************************/
  /*****************************************************************************/

  /**
   * this method will calculate the height of the carousel depending on the item height
   */
  const setCarouselHeight = useCallback(event => {
    if (calcCarouselHeight < event?.nativeEvent?.layout?.height) {
      const height = event?.nativeEvent?.layout?.height;
      setItemHeight(height);
      let offset = layoutCardOffset;
      setCalcCarouselHeight(height + offset);
    }
  });

  /**
   * Mandatory method by 'react-native-snap-carousel' to return items component
   *
   * @param {*} item - data array item
   * @param {number} index - item index in the carousel
   * @returns {React native component}
   */
  const _renderItem = ({
    item,
    index
  }) => createElement(View, {
    onLayout: setCarouselHeight
  }, itemsObj[index]?.content);

  /**
   * Validate the numerics values before setting them in the carousel properties
   *
   * @param {number} value - the actual value
   * @param {number} min - the maximum allowed value
   * @param {number} max - the minimum allowed value
   * @returns
   */
  const validateValue = (value, min, max) => value < min ? min : value > max ? max : value;

  /**
   * Validate the hex color of the pagination text or set the default color
   *
   * @param {string} value
   * @returns {string}
   */
  const validateColor = value => hexColorValidate.test(value) ? value : "#3b4045";

  /**
   * Clear the autoplay timer as it's manually created and destroyed
   */
  const clearAutoLoopTimer = () => {
    if (loopTimeout) {
      clearTimeout(loopTimeout);
      setLoopTimeout(null);
    }
  };

  /**
   * this function is used to fire the current item action and set the new active item to change the pagination
   *
   * @param {number} slideIndex
   */
  const onBeforeSnapToItem = slideIndex => {
    setLongPressFlag(false);
    setActiveItem(slideIndex);
    let actionToFire = itemsObj[slideIndex]?.action;
    if (actionToFire?.canExecute) {
      actionToFire.execute();
    }

    // Part of manual infinite loop, navigating to the first item to start the loop again when reaching to the last item
    // and cancel the current action when swiping manually to any other item
    if (autoplay && loop && slideIndex === itemsKey.length - 1) {
      setLoopTimeout(setTimeout(() => {
        _carousel?.current?.snapToItem(0);
      }, autoplayInterval));
    } else if (autoplay && loop) {
      clearAutoLoopTimer();
    }
  };

  /**
   * setting the data array that required in "react-native-snap-carousel" and the object mapping to like every item with it's own action
   * using the index as a key
   */
  useEffect(() => {
    if (dataType === "static") {
      let itemsList = staticItems.reduce((acc, item, index) => {
        acc[index] = {
          content: item.staticContent,
          action: item.staticAction
        };
        return acc;
      }, {});
      setItemsObj(itemsList);
      setItemsKey(Object.keys(itemsList));
    } else if (data.status === "available") {
      let itemsList = data.items.reduce((acc, item, index) => {
        acc[index] = {
          item,
          content: content.get(item),
          action: action?.get(item)
        };
        return acc;
      }, {});
      setItemsObj(itemsList);
      setItemsKey(Object.keys(itemsList));
    }
  }, [data]);

  /**
   * setting the current item start the carousel from and to render it in the pagination
   */
  useEffect(() => {
    if (itemsKey.length) {
      let toSetActiveItem = firstItem?.status === "available" ? firstItem.value ? validateValue(Number(firstItem.value), 0, itemsKey.length - 1) : 0 : 0;
      setStartingItemIndex(toSetActiveItem);
      onBeforeSnapToItem(toSetActiveItem);
    }
  }, [itemsKey.length]);
  useEffect(() => {
    if (scrollEnabled?.status === "available") {
      setScroll(scrollEnabled.value !== null && scrollEnabled.value !== undefined ? scrollEnabled.value : true);
    }
  }, [scrollEnabled]);

  /**
   * calculate the carousel width
   */
  useEffect(() => {
    let widthToSet = carouselWidth === "full" ? windowWidth : validateValue(customWidth, 1, windowWidth);
    setCalcCarouselWidth(widthToSet);
  }, []);
  return itemsKey?.length && calcCarouselWidth && startingItemIndex !== null ? createElement(View, null, loop && scroll && (activeItem === 0 || activeItem === itemsKey.length - 1) && createElement(TouchableWithoutFeedback, {
    onLongPress: autoplay ? () => {
      setLongPressFlag(true);
      _carousel?.current?.stopAutoplay();
      clearAutoLoopTimer();
    } : undefined,
    onPressOut: longPressFlag ? () => {
      setLongPressFlag(false);
      _carousel?.current?.startAutoplay();
      setLoopTimeout(setTimeout(() => {
        onSwipeLeft();
      }, autoplayInterval));
    } : onTouchEnd,
    onPressIn: onTouchStart
  }, createElement(View, {
    style: {
      ...styles.overlay,
      height: itemHeight,
      // same as item width
      width: calcCarouselWidth - validateValue(carouselPadding, 0, calcCarouselWidth - 1),
      left: carouselPadding / 2
    }
  })), createElement(View, {
    style: {
      ...styles.mainContainer,
      width: calcCarouselWidth
    }
  }, createElement(Carousel, {
    ref: _carousel
    /********************* Data and Action ********************/,
    data: itemsKey,
    renderItem: _renderItem,
    firstItem: startingItemIndex,
    scrollEnabled: scroll,
    onBeforeSnapToItem: slideIndex => onBeforeSnapToItem(slideIndex)
    /************************* Behavior ***********************/,
    layout: layout,
    autoplay: autoplay,
    autoplayDelay: validateValue(autoplayDelay, 1000, 300000),
    autoplayInterval: validateValue(autoplayInterval, 1000, 300000),
    lockScrollWhileSnapping: autoplay ? false : lockScrollWhileSnapping,
    activeSlideOffset: validateValue(activeSlideOffset, 1, windowWidth / 2)
    /****************** Style and animation *******************/,
    layoutCardOffset: validateValue(layoutCardOffset, 0, windowHeight),
    inactiveSlideOpacity: validateValue(Number(inactiveSlideOpacity), 0, 1),
    inactiveSlideScale: validateValue(Number(inactiveSlideScale), 0, 1),
    sliderWidth: calcCarouselWidth,
    itemWidth: calcCarouselWidth - validateValue(carouselPadding, 0, calcCarouselWidth - 1),
    containerCustomStyle: {
      height: calcCarouselHeight && layout === "tinder" ? calcCarouselHeight : "auto"
    }
  }), pagination && createElement(Text, {
    style: {
      ...styles.pagination,
      color: validateColor(paginationColor)
    }
  }, `${activeItem + 1}/${itemsKey.length}`))) : createElement(View, null);
}
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center"
  },
  pagination: {
    marginTop: 5
  },
  overlay: {
    position: "absolute",
    zIndex: 1
  }
});

export { SnapCarousel };
