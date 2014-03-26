!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sgModel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(_dereq_,module,exports){
var contains = _dereq_( "sc-contains" ),
  is = _dereq_( "sc-is" );

var cast = function ( _value, _castType, _default, _values, _additionalProperties ) {

  var parsedValue,
    castType = _castType,
    value,
    values = is.an.array( _values ) ? _values : [];

  switch ( true ) {
  case ( /float|integer/.test( castType ) ):
    castType = "number";
    break;
  }

  if ( is.a[ castType ]( _value ) || castType === '*' ) {

    value = _value;

  } else {

    switch ( true ) {

    case castType === "array":

      try {
        if ( is.a.string( _value ) ) {
          value = JSON.parse( _value );
        }
        if ( is.not.an.array( value ) ) {
          throw "";
        }
      } catch ( e ) {
        if ( is.not.nullOrUndefined( _value ) ) {
          value = [ _value ];
        }
      }
      break;

    case castType === "boolean":

      try {
        value = /^(true|1|y|yes)$/i.test( _value.toString() ) ? true : undefined;
      } catch ( e ) {}

      if ( is.not.a.boolean( value ) ) {

        try {
          value = /^(false|-1|0|n|no)$/i.test( _value.toString() ) ? false : undefined;
        } catch ( e ) {}

      }

      value = is.a.boolean( value ) ? value : undefined;

      break;

    case castType === "date":

      try {

        value = new Date( _value );
        value = isNaN( value.getTime() ) ? undefined : value;

      } catch ( e ) {}

      break;

    case castType === "string":

      try {

        value = JSON.stringify( _value );
        if ( is.undefined( value ) ) {
          throw "";
        }

      } catch ( e ) {

        try {
          value = _value.toString()
        } catch ( e ) {}

      }

      break;

    case castType === "number":

      try {
        value = parseFloat( _value );
        if ( is.not.a.number( value ) || isNaN( value ) ) {
          value = undefined;
        }
      } catch ( e ) {
        value = undefined
      }

      if ( value !== undefined ) {
        switch ( true ) {
        case _castType === "integer":
          value = parseInt( value );
          break;
        }
      }

      break;

    default:

      try {
        value = cast( JSON.parse( _value ), castType )
      } catch ( e ) {}

      break;

    }

  }

  if ( values.length > 0 && !contains( values, value ) ) {
    value = values[ 0 ];
  }

  return is.not.undefined( value ) ? value : is.not.undefined( _default ) ? _default : null;

};

module.exports = cast;
},{"sc-contains":3,"sc-is":7}],3:[function(_dereq_,module,exports){
var contains = function ( data, item ) {
  var foundOne = false;

  if ( Array.isArray( data ) ) {

    data.forEach( function ( arrayItem ) {
      if ( foundOne === false && item === arrayItem ) {
        foundOne = true;
      }
    } );

  } else if ( Object( data ) === data ) {

    Object.keys( data ).forEach( function ( key ) {

      if ( foundOne === false && data[ key ] === item ) {
        foundOne = true;
      }

    } );

  }
  return foundOne;
};

module.exports = contains;
},{}],4:[function(_dereq_,module,exports){
var guidRx = "{?[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}}?";

exports.generate = function () {
  var d = new Date().getTime();
  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0;
    d = Math.floor( d / 16 );
    return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
  } );
  return guid;
};

exports.match = function ( string ) {
  var rx = new RegExp( guidRx, "g" ),
    matches = ( typeof string === "string" ? string : "" ).match( rx );
  return Array.isArray( matches ) ? matches : [];
};

exports.isValid = function ( guid ) {
  var rx = new RegExp( guidRx );
  return rx.test( guid );
};
},{}],5:[function(_dereq_,module,exports){
var type = _dereq_( "type-component" ),
  has = Object.prototype.hasOwnProperty;

function hasKey( object, keys, keyType ) {

  object = type( object ) === "object" ? object : {}, keys = type( keys ) === "array" ? keys : [];
  keyType = type( keyType ) === "string" ? keyType : "";

  var key = keys.length > 0 ? keys.shift() : "",
    keyExists = has.call( object, key ) || object[ key ] !== void 0,
    keyValue = keyExists ? object[ key ] : undefined,
    keyTypeIsCorrect = type( keyValue ) === keyType;

  if ( keys.length > 0 && keyExists ) {
    return hasKey( object[ key ], keys, keyType );
  }

  return keys.length > 0 || keyType === "" ? keyExists : keyExists && keyTypeIsCorrect;

}

module.exports = function ( object, keys, keyType ) {

  keys = type( keys ) === "string" ? keys.split( "." ) : [];

  return hasKey( object, keys, keyType );

};
},{"type-component":6}],6:[function(_dereq_,module,exports){

/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
};

},{}],7:[function(_dereq_,module,exports){
var type = _dereq_( "./ises/type" ),
  is = {
    a: {},
    an: {},
    not: {
      a: {},
      an: {}
    }
  };

var ises = {
  "arguments": [ "arguments", type( "arguments" ) ],
  "array": [ "array", type( "array" ) ],
  "boolean": [ "boolean", type( "boolean" ) ],
  "date": [ "date", type( "date" ) ],
  "function": [ "function", "func", "fn", type( "function" ) ],
  "null": [ "null", type( "null" ) ],
  "number": [ "number", "integer", "int", type( "number" ) ],
  "object": [ "object", type( "object" ) ],
  "regexp": [ "regexp", type( "regexp" ) ],
  "string": [ "string", type( "string" ) ],
  "undefined": [ "undefined", type( "undefined" ) ],
  "empty": [ "empty", _dereq_( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", _dereq_( "./ises/nullorundefined" ) ],
  "guid": [ "guid", _dereq_( "./ises/guid" ) ]
}

Object.keys( ises ).forEach( function ( key ) {

  var methods = ises[ key ].slice( 0, ises[ key ].length - 1 ),
    fn = ises[ key ][ ises[ key ].length - 1 ];

  methods.forEach( function ( methodKey ) {
    is[ methodKey ] = is.a[ methodKey ] = is.an[ methodKey ] = fn;
    is.not[ methodKey ] = is.not.a[ methodKey ] = is.not.an[ methodKey ] = function () {
      return fn.apply( this, arguments ) ? false : true;
    }
  } );

} );

exports = module.exports = is;
exports.type = type;
},{"./ises/empty":8,"./ises/guid":9,"./ises/nullorundefined":10,"./ises/type":11}],8:[function(_dereq_,module,exports){
var type = _dereq_("../type");

module.exports = function ( value ) {
  var empty = false;

  if ( type( value ) === "null" || type( value ) === "undefined" ) {
    empty = true;
  } else if ( type( value ) === "object" ) {
    empty = Object.keys( value ).length === 0;
  } else if ( type( value ) === "boolean" ) {
    empty = value === false;
  } else if ( type( value ) === "number" ) {
    empty = value === 0 || value === -1;
  } else if ( type( value ) === "array" || type( value ) === "string" ) {
    empty = value.length === 0;
  }

  return empty;

};
},{"../type":12}],9:[function(_dereq_,module,exports){
var guid = _dereq_( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":4}],10:[function(_dereq_,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],11:[function(_dereq_,module,exports){
var type = _dereq_( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":12}],12:[function(_dereq_,module,exports){
var toString = Object.prototype.toString;

module.exports = function ( val ) {
  switch ( toString.call( val ) ) {
  case '[object Function]':
    return 'function';
  case '[object Date]':
    return 'date';
  case '[object RegExp]':
    return 'regexp';
  case '[object Arguments]':
    return 'arguments';
  case '[object Array]':
    return 'array';
  }

  if ( val === null ) return 'null';
  if ( val === undefined ) return 'undefined';
  if ( val === Object( val ) ) return 'object';

  return typeof val;
};
},{}],13:[function(_dereq_,module,exports){
var type = _dereq_( "type-component" );

var merge = function () {

  var args = Array.prototype.slice.call( arguments ),
    deep = type( args[ 0 ] ) === "boolean" ? args.shift() : false,
    objects = args,
    result = {};

  objects.forEach( function ( objectn ) {

    if ( type( objectn ) !== "object" ) {
      return;
    }

    Object.keys( objectn ).forEach( function ( key ) {
      if ( Object.prototype.hasOwnProperty.call( objectn, key ) ) {
        if ( deep && type( objectn[ key ] ) === "object" ) {
          result[ key ] = merge( deep, {}, result[ key ], objectn[ key ] );
        } else {
          result[ key ] = objectn[ key ];
        }
      }
    } );

  } );

  return result;
};

module.exports = merge;
},{"type-component":14}],14:[function(_dereq_,module,exports){
module.exports=_dereq_(6)
},{}],15:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Emitter = _dereq_('emitter');
var reduce = _dereq_('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = this.xhr.responseText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status || 1223 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var path = req.path;

  var msg = 'cannot ' + method + ' ' + path + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.path = path;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var res = new Response(self);
    if ('HEAD' == method) res.text = null;
    self.callback(null, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (self.aborted) return self.timeoutError();
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  if (xhr.upload) {
    xhr.upload.onprogress = function(e){
      e.percent = e.loaded / e.total * 100;
      self.emit('progress', e);
    };
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":16,"reduce":17}],16:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],17:[function(_dereq_,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],18:[function(_dereq_,module,exports){
var is = _dereq_('sc-is'),
	cast = _dereq_('sc-cast'),
	hasKey = _dereq_('sc-haskey'),
	merge = _dereq_('sc-merge'),
	emitter = _dereq_('emitter-component'),
	request = _dereq_('./request.ajax.js');

var noop = function() {};

var Attributes = function(_key, _value) {
	return merge({
		name: _key || '',
		type: '',
		default: null,
		optional: false
	}, _value);
}

var getProperty = function(_key) {
	return function() {
		return this.__data[_key];
	}
};

var setProperty = function(_key) {
	return function(_value) {
		var self = this,
			attributes = self.__attributes[_key],
			value = attributes.type ? cast(_value, attributes.type, attributes['default']) : _value;

		if (self.__data[_key] !== value) {
			self.emit('change', self.__data[_key], value);
		}

		self.__data[_key] = value;
	}
};

var setBusy = function(_self) {
	return function() {
		_self.busy = true;
	}
}

var unsetBusy = function(_self) {
	return function() {
		_self.busy = false;
	}
}

var Model = function(_name, _key) {
	var self = this;

	Object.defineProperties(self, {
		__attributes: {
			value: {},
			writable: true
		},
		__base: {
			value: '',
			writable: true
		},
		__data: {
			value: {},
			writable: true
		},
		__destroyed: {
			value: false,
			writable: true
		},
		__headers: {
			value: {},
			writable: true
		},
		__key: {
			value: _key || 'id',
			writable: true
		},
		__name: {
			value: _name || ''
		},
		__url: {
			value: '',
			writable: true
		},
		busy: {
			value: false,
			writable: true
		}
	});

	self.property(self.__key);

	self.on('presave', setBusy(self));
	self.on('save', unsetBusy(self));

	self.on('predestroy', setBusy(self));
	self.on('destroy', unsetBusy(self));

	self.on('preget', setBusy(self));
	self.on('get', unsetBusy(self));

};

Model.prototype.base = function(_base) {
	var self = this,
		url = is.empty(_base) ? '' : _base;

	self.__base = url.trim().replace(/(\/|\s)+$/g, '');

	return is.not.a.string(_base) ? self.__base : self;
};

Model.prototype.collection = function(_query) {
	var self = this,
		url = self.url(),
		method = 'get',
		query = is.an.object(_query) ? _query : {},
		callback = is.a.func(_query) ? _query : is.a.func(_callback) ? _callback : noop;

	self.emit('precollection', {
		model: self,
		method: method,
		query: query,
		url: url,
		callback: callback
	});

	request(self, query, method, url, function(_error, _res) {
		self.emit('collection', _error, _res);
		callback.apply(self, arguments);
	});

};

Model.prototype.destroy = function(_callback) {
	var self = this,
		isDirty = self.isDirty(),
		data = self.json(),
		url = self.url() + '/' + self[self.__key],
		method = 'delete',
		callback = is.a.func(_callback) ? _callback : noop;

	self.emit('predestroy', {
		model: self,
		data: data,
		method: method,
		url: url,
		callback: callback
	});

	if (!isDirty) {
		request(self, data, method, url, function() {

			self.emit('destroy', self);

			self.__destroyed = true;
			callback.apply(self, arguments);
		});
	} else {
		callback.apply(self, [new Error('This model cannot be destroyed because it has not been saved to the server yet.')]);
	}

};

Model.prototype.data = function(_data) {
	var self = this,
		data = is.object(_data) ? _data : {};

	Object.keys(data).forEach(function(_key) {
		self.property(_key, _data[_key]);
	});

	return self;
};

Model.prototype.clone = function(_data) {
	var self = this,
		newModel = new Model(self.__name, self.__key)
			.base(self.__base)
			.headers(self.__headers)
			.url(self.__url);

	Object.keys(self.__attributes).forEach(function(_propertyKey) {
		newModel.property(_propertyKey, merge(self.__attributes[_propertyKey]));
	});

	newModel.data(_data);

	return newModel;
};

Model.prototype.get = function(_query, _callback) {
	var self = this,
		url = self.url(),
		method = 'get',
		query = is.an.object(_query) ? _query : {},
		callback = is.a.func(_query) ? _query : is.a.func(_callback) ? _callback : noop;

	self.emit('preget', {
		model: self,
		method: method,
		query: query,
		url: url,
		callback: callback
	});

	request(self, query, method, url, function(_error, _res) {
		self.emit('get', _error, _res);
		callback.apply(self, arguments);
	});

};

Model.prototype.json = function() {
	return this.__data;
};

Model.prototype.headers = function(_headers) {
	this.__headers = is.an.object(_headers) ? _headers : this.__headers;
	return is.not.an.object(_headers) ? this.__headers : this;
};

Model.prototype.isDirty = function() {
	return is.empty(this[this.__key]);
};

Model.prototype.isValid = function() {
	var self = this,
		isValid = true;

	Object.keys(self.__attributes).forEach(function(_key) {

		if (self.isDirty() && _key === self.__key) {
			return;
		}

		var value = self[_key],
			attributes = self.__attributes[_key],
			type = attributes.type,
			isRequired = attributes.optional ? false : true,
			hasNoDefault = is.nullOrUndefined(attributes['default']),
			isNullOrUndefined = is.nullOrUndefined(value),
			typeIsWrong = is.not.empty(type) ? is.not.a[type](value) : isNullOrUndefined;

		if (isRequired && typeIsWrong) {
			isValid = false;
		}

	});

	return isValid;
};

Model.prototype.key = function(_key) {
	this.__key = _key;
	return this;
};

Model.prototype.property = function(_key, _value) {
	var self = this,
		attributes = new Attributes(_key, _value);

	if (!self.hasOwnProperty(_key)) {
		Object.defineProperty(self, _key, {
			get: getProperty(_key),
			set: setProperty(_key),
			enumerable: true
		});
		self.__attributes[_key] = attributes;
	}

	if (attributes.optional === false && is.not.nullOrUndefined(attributes['default'])) {
		self[_key] = attributes['default'];
	} else if (attributes.optional === false) {
		self.__data[_key] = is.empty(attributes.type) ? undefined : cast(undefined, attributes.type);
	}

	return self;
};

Model.prototype.save = function(_callback) {
	var self = this,
		error = null,
		isDirty = self.isDirty(),
		data = self.json(),
		url = self.url() + (!isDirty ? '/' + self[self.__key] : ''),
		method = isDirty ? 'post' : 'put',
		callback = is.a.func(_callback) ? _callback : noop;

	self.emit('presave', {
		model: self,
		data: data,
		method: method,
		url: url,
		callback: callback
	});

	request(self, data, method, url, function(_error, _res) {
		self.emit('save', _error, _res);
		callback.apply(self, arguments);
	});

};

Model.prototype.url = function(_url) {
	var self = this,
		base = is.empty(self.__base) ? '' : self.__base,
		name = is.empty(self.__name) ? '' : '/' + self.__name.trim().replace(/^\//, ''),
		url = _url || self.__url || '',
		endpoint = base + name + (is.empty(url) ? '' : '/' + url.trim().replace(/^\//, ''));

	self.__url = url.trim().replace(/^\//, '');

	return is.not.a.string(_url) ? endpoint : self;
};

emitter(Model.prototype);

module.exports = Model;
},{"./request.ajax.js":20,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13}],19:[function(_dereq_,module,exports){
module.exports=_dereq_(18)
},{"./request.ajax.js":20,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13}],20:[function(_dereq_,module,exports){
var Model = _dereq_('./'),
	request = _dereq_('superagent'),
	is = _dereq_('sc-is'),
	hasKey = _dereq_('sc-haskey');

module.exports = function(_model, _data, _method, _url, _callback) {
	var method = /delete/i.test(_method) ? 'del' : _method,
		model = _model,
		data = _data,
		url = _url,
		isDirty = model.isDirty(),
		modelKey,
		error;

	if (/get/i.test(method) && hasKey(data, model.__key) && new RegExp(data[model.__key]).test(url) === false) {
		modelKey = data[model.__key];
		delete data[model.__key];
		url += '/' + modelKey;
	}

	request[method](url)[/get/i.test(method) ? 'query' : 'send'](data)
		.set(model.headers())
		.type('json')
		.accept('json')
		.end(function(_error, _res) {
			var res = is.an.object(_res) ? _res : {},
				items = [],
				body = hasKey(_res, 'body') && (is.object(_res.body) || is.array(_res.body)) ? _res.body : null;

			if (res['ok'] !== true) {
				error = new Error('The response from the server was not OK');
			}

			if (body === null) {
				error = new Error('The response from the server contained an empty body');
			}

			if (!error && isDirty && is.object(body) && !hasKey(body, model.__key)) {
				error = new Error('The response from the server did not contain a valid `' + model.__key + '`');
			}

			if (!error && isDirty && is.object(body)) {
				model[model.__key] = body[model.__key];
			}

			if (is.array(body)) {

				body.forEach(function(_data) {
					items.push(model.clone(_data));
				});

				model = items;

			} else if (is.object(body)) {

				Object.keys(body).forEach(function(_key) {
					if (model.hasOwnProperty(_key)) {
						model[_key] = body[_key];
					}
				});

			}

			_callback && _callback(error, model);
		});

}
},{"./":19,"sc-haskey":5,"sc-is":7,"superagent":15}]},{},[18])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvc2cvc2ctbW9kZWwvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvc2cvc2ctbW9kZWwvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9jbGllbnQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zdXBlcmFnZW50L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvc2cvc2ctbW9kZWwvbm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbm9kZV9tb2R1bGVzL3JlZHVjZS1jb21wb25lbnQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL3NyYy9mYWtlX2RiZGZjMTZlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9zcmMvcmVxdWVzdC5hamF4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNStCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJ2YXIgY29udGFpbnMgPSByZXF1aXJlKCBcInNjLWNvbnRhaW5zXCIgKSxcbiAgaXMgPSByZXF1aXJlKCBcInNjLWlzXCIgKTtcblxudmFyIGNhc3QgPSBmdW5jdGlvbiAoIF92YWx1ZSwgX2Nhc3RUeXBlLCBfZGVmYXVsdCwgX3ZhbHVlcywgX2FkZGl0aW9uYWxQcm9wZXJ0aWVzICkge1xuXG4gIHZhciBwYXJzZWRWYWx1ZSxcbiAgICBjYXN0VHlwZSA9IF9jYXN0VHlwZSxcbiAgICB2YWx1ZSxcbiAgICB2YWx1ZXMgPSBpcy5hbi5hcnJheSggX3ZhbHVlcyApID8gX3ZhbHVlcyA6IFtdO1xuXG4gIHN3aXRjaCAoIHRydWUgKSB7XG4gIGNhc2UgKCAvZmxvYXR8aW50ZWdlci8udGVzdCggY2FzdFR5cGUgKSApOlxuICAgIGNhc3RUeXBlID0gXCJudW1iZXJcIjtcbiAgICBicmVhaztcbiAgfVxuXG4gIGlmICggaXMuYVsgY2FzdFR5cGUgXSggX3ZhbHVlICkgfHwgY2FzdFR5cGUgPT09ICcqJyApIHtcblxuICAgIHZhbHVlID0gX3ZhbHVlO1xuXG4gIH0gZWxzZSB7XG5cbiAgICBzd2l0Y2ggKCB0cnVlICkge1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJhcnJheVwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UoIF92YWx1ZSApO1xuICAgICAgICB9XG4gICAgICAgIGlmICggaXMubm90LmFuLmFycmF5KCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBpZiAoIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gWyBfdmFsdWUgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImJvb2xlYW5cIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSAvXih0cnVlfDF8eXx5ZXMpJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyB0cnVlIDogdW5kZWZpbmVkO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBpZiAoIGlzLm5vdC5hLmJvb2xlYW4oIHZhbHVlICkgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IC9eKGZhbHNlfC0xfDB8bnxubykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBpcy5hLmJvb2xlYW4oIHZhbHVlICkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImRhdGVcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IG5ldyBEYXRlKCBfdmFsdWUgKTtcbiAgICAgICAgdmFsdWUgPSBpc05hTiggdmFsdWUuZ2V0VGltZSgpICkgPyB1bmRlZmluZWQgOiB2YWx1ZTtcblxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwic3RyaW5nXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSggX3ZhbHVlICk7XG4gICAgICAgIGlmICggaXMudW5kZWZpbmVkKCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IF92YWx1ZS50b1N0cmluZygpXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwibnVtYmVyXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCggX3ZhbHVlICk7XG4gICAgICAgIGlmICggaXMubm90LmEubnVtYmVyKCB2YWx1ZSApIHx8IGlzTmFOKCB2YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgdmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICBzd2l0Y2ggKCB0cnVlICkge1xuICAgICAgICBjYXNlIF9jYXN0VHlwZSA9PT0gXCJpbnRlZ2VyXCI6XG4gICAgICAgICAgdmFsdWUgPSBwYXJzZUludCggdmFsdWUgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gY2FzdCggSlNPTi5wYXJzZSggX3ZhbHVlICksIGNhc3RUeXBlIClcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICB9XG5cbiAgfVxuXG4gIGlmICggdmFsdWVzLmxlbmd0aCA+IDAgJiYgIWNvbnRhaW5zKCB2YWx1ZXMsIHZhbHVlICkgKSB7XG4gICAgdmFsdWUgPSB2YWx1ZXNbIDAgXTtcbiAgfVxuXG4gIHJldHVybiBpcy5ub3QudW5kZWZpbmVkKCB2YWx1ZSApID8gdmFsdWUgOiBpcy5ub3QudW5kZWZpbmVkKCBfZGVmYXVsdCApID8gX2RlZmF1bHQgOiBudWxsO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3Q7IiwidmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gKCBkYXRhLCBpdGVtICkge1xuICB2YXIgZm91bmRPbmUgPSBmYWxzZTtcblxuICBpZiAoIEFycmF5LmlzQXJyYXkoIGRhdGEgKSApIHtcblxuICAgIGRhdGEuZm9yRWFjaCggZnVuY3Rpb24gKCBhcnJheUl0ZW0gKSB7XG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBpdGVtID09PSBhcnJheUl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSBlbHNlIGlmICggT2JqZWN0KCBkYXRhICkgPT09IGRhdGEgKSB7XG5cbiAgICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBkYXRhWyBrZXkgXSA9PT0gaXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgfSApO1xuXG4gIH1cbiAgcmV0dXJuIGZvdW5kT25lO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCJ2YXIgZ3VpZFJ4ID0gXCJ7P1swLTlBLUZhLWZdezh9LVswLTlBLUZhLWZdezR9LTRbMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXs0fS1bMC05QS1GYS1mXXsxMn19P1wiO1xuXG5leHBvcnRzLmdlbmVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB2YXIgZ3VpZCA9IFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSggL1t4eV0vZywgZnVuY3Rpb24gKCBjICkge1xuICAgIHZhciByID0gKCBkICsgTWF0aC5yYW5kb20oKSAqIDE2ICkgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuICAgIHJldHVybiAoIGMgPT09IFwieFwiID8gciA6ICggciAmIDB4NyB8IDB4OCApICkudG9TdHJpbmcoIDE2ICk7XG4gIH0gKTtcbiAgcmV0dXJuIGd1aWQ7XG59O1xuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKCBzdHJpbmcgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCwgXCJnXCIgKSxcbiAgICBtYXRjaGVzID0gKCB0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiID8gc3RyaW5nIDogXCJcIiApLm1hdGNoKCByeCApO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbWF0Y2hlcyApID8gbWF0Y2hlcyA6IFtdO1xufTtcblxuZXhwb3J0cy5pc1ZhbGlkID0gZnVuY3Rpb24gKCBndWlkICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUnggKTtcbiAgcmV0dXJuIHJ4LnRlc3QoIGd1aWQgKTtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKSxcbiAgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAgb2JqZWN0ID0gdHlwZSggb2JqZWN0ICkgPT09IFwib2JqZWN0XCIgPyBvYmplY3QgOiB7fSwga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJhcnJheVwiID8ga2V5cyA6IFtdO1xuICBrZXlUeXBlID0gdHlwZSgga2V5VHlwZSApID09PSBcInN0cmluZ1wiID8ga2V5VHlwZSA6IFwiXCI7XG5cbiAgdmFyIGtleSA9IGtleXMubGVuZ3RoID4gMCA/IGtleXMuc2hpZnQoKSA6IFwiXCIsXG4gICAga2V5RXhpc3RzID0gaGFzLmNhbGwoIG9iamVjdCwga2V5ICkgfHwgb2JqZWN0WyBrZXkgXSAhPT0gdm9pZCAwLFxuICAgIGtleVZhbHVlID0ga2V5RXhpc3RzID8gb2JqZWN0WyBrZXkgXSA6IHVuZGVmaW5lZCxcbiAgICBrZXlUeXBlSXNDb3JyZWN0ID0gdHlwZSgga2V5VmFsdWUgKSA9PT0ga2V5VHlwZTtcblxuICBpZiAoIGtleXMubGVuZ3RoID4gMCAmJiBrZXlFeGlzdHMgKSB7XG4gICAgcmV0dXJuIGhhc0tleSggb2JqZWN0WyBrZXkgXSwga2V5cywga2V5VHlwZSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXMubGVuZ3RoID4gMCB8fCBrZXlUeXBlID09PSBcIlwiID8ga2V5RXhpc3RzIDoga2V5RXhpc3RzICYmIGtleVR5cGVJc0NvcnJlY3Q7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBrZXlzID0gdHlwZSgga2V5cyApID09PSBcInN0cmluZ1wiID8ga2V5cy5zcGxpdCggXCIuXCIgKSA6IFtdO1xuXG4gIHJldHVybiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApO1xuXG59OyIsIlxuLyoqXG4gKiB0b1N0cmluZyByZWYuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHR5cGUgb2YgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsKXtcbiAgc3dpdGNoICh0b1N0cmluZy5jYWxsKHZhbCkpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6IHJldHVybiAnZnVuY3Rpb24nO1xuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnO1xuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJztcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCc7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsID09PSBPYmplY3QodmFsKSkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTtcbiIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuL2lzZXMvdHlwZVwiICksXG4gIGlzID0ge1xuICAgIGE6IHt9LFxuICAgIGFuOiB7fSxcbiAgICBub3Q6IHtcbiAgICAgIGE6IHt9LFxuICAgICAgYW46IHt9XG4gICAgfVxuICB9O1xuXG52YXIgaXNlcyA9IHtcbiAgXCJhcmd1bWVudHNcIjogWyBcImFyZ3VtZW50c1wiLCB0eXBlKCBcImFyZ3VtZW50c1wiICkgXSxcbiAgXCJhcnJheVwiOiBbIFwiYXJyYXlcIiwgdHlwZSggXCJhcnJheVwiICkgXSxcbiAgXCJib29sZWFuXCI6IFsgXCJib29sZWFuXCIsIHR5cGUoIFwiYm9vbGVhblwiICkgXSxcbiAgXCJkYXRlXCI6IFsgXCJkYXRlXCIsIHR5cGUoIFwiZGF0ZVwiICkgXSxcbiAgXCJmdW5jdGlvblwiOiBbIFwiZnVuY3Rpb25cIiwgXCJmdW5jXCIsIFwiZm5cIiwgdHlwZSggXCJmdW5jdGlvblwiICkgXSxcbiAgXCJudWxsXCI6IFsgXCJudWxsXCIsIHR5cGUoIFwibnVsbFwiICkgXSxcbiAgXCJudW1iZXJcIjogWyBcIm51bWJlclwiLCBcImludGVnZXJcIiwgXCJpbnRcIiwgdHlwZSggXCJudW1iZXJcIiApIF0sXG4gIFwib2JqZWN0XCI6IFsgXCJvYmplY3RcIiwgdHlwZSggXCJvYmplY3RcIiApIF0sXG4gIFwicmVnZXhwXCI6IFsgXCJyZWdleHBcIiwgdHlwZSggXCJyZWdleHBcIiApIF0sXG4gIFwic3RyaW5nXCI6IFsgXCJzdHJpbmdcIiwgdHlwZSggXCJzdHJpbmdcIiApIF0sXG4gIFwidW5kZWZpbmVkXCI6IFsgXCJ1bmRlZmluZWRcIiwgdHlwZSggXCJ1bmRlZmluZWRcIiApIF0sXG4gIFwiZW1wdHlcIjogWyBcImVtcHR5XCIsIHJlcXVpcmUoIFwiLi9pc2VzL2VtcHR5XCIgKSBdLFxuICBcIm51bGxvcnVuZGVmaW5lZFwiOiBbIFwibnVsbE9yVW5kZWZpbmVkXCIsIFwibnVsbG9ydW5kZWZpbmVkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL251bGxvcnVuZGVmaW5lZFwiICkgXSxcbiAgXCJndWlkXCI6IFsgXCJndWlkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL2d1aWRcIiApIF1cbn1cblxuT2JqZWN0LmtleXMoIGlzZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICB2YXIgbWV0aG9kcyA9IGlzZXNbIGtleSBdLnNsaWNlKCAwLCBpc2VzWyBrZXkgXS5sZW5ndGggLSAxICksXG4gICAgZm4gPSBpc2VzWyBrZXkgXVsgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSBdO1xuXG4gIG1ldGhvZHMuZm9yRWFjaCggZnVuY3Rpb24gKCBtZXRob2RLZXkgKSB7XG4gICAgaXNbIG1ldGhvZEtleSBdID0gaXMuYVsgbWV0aG9kS2V5IF0gPSBpcy5hblsgbWV0aG9kS2V5IF0gPSBmbjtcbiAgICBpcy5ub3RbIG1ldGhvZEtleSBdID0gaXMubm90LmFbIG1ldGhvZEtleSBdID0gaXMubm90LmFuWyBtZXRob2RLZXkgXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICkgPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuICB9ICk7XG5cbn0gKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gaXM7XG5leHBvcnRzLnR5cGUgPSB0eXBlOyIsInZhciB0eXBlID0gcmVxdWlyZShcIi4uL3R5cGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bGxcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIGVtcHR5ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICBlbXB0eSA9IE9iamVjdC5rZXlzKCB2YWx1ZSApLmxlbmd0aCA9PT0gMDtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJib29sZWFuXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVtYmVyXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gLTE7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYXJyYXlcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInN0cmluZ1wiICkge1xuICAgIGVtcHR5ID0gdmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcmV0dXJuIGVtcHR5O1xuXG59OyIsInZhciBndWlkID0gcmVxdWlyZSggXCJzYy1ndWlkXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICByZXR1cm4gZ3VpZC5pc1ZhbGlkKCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG5cdHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSB2b2lkIDA7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuLi90eXBlXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF90eXBlICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG4gICAgcmV0dXJuIHR5cGUoIF92YWx1ZSApID09PSBfdHlwZTtcbiAgfVxufSIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWwgKSB7XG4gIHN3aXRjaCAoIHRvU3RyaW5nLmNhbGwoIHZhbCApICkge1xuICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgcmV0dXJuICdmdW5jdGlvbic7XG4gIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgIHJldHVybiAnZGF0ZSc7XG4gIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgcmV0dXJuICdyZWdleHAnO1xuICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOlxuICAgIHJldHVybiAnYXJndW1lbnRzJztcbiAgY2FzZSAnW29iamVjdCBBcnJheV0nOlxuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKCB2YWwgPT09IG51bGwgKSByZXR1cm4gJ251bGwnO1xuICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAoIHZhbCA9PT0gT2JqZWN0KCB2YWwgKSApIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIGRlZXAgPSB0eXBlKCBhcmdzWyAwIF0gKSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnNoaWZ0KCkgOiBmYWxzZSxcbiAgICBvYmplY3RzID0gYXJncyxcbiAgICByZXN1bHQgPSB7fTtcblxuICBvYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uICggb2JqZWN0biApIHtcblxuICAgIGlmICggdHlwZSggb2JqZWN0biApICE9PSBcIm9iamVjdFwiICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKCBvYmplY3RuICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICBpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0biwga2V5ICkgKSB7XG4gICAgICAgIGlmICggZGVlcCAmJiB0eXBlKCBvYmplY3RuWyBrZXkgXSApID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBtZXJnZSggZGVlcCwge30sIHJlc3VsdFsga2V5IF0sIG9iamVjdG5bIGtleSBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG9iamVjdG5bIGtleSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTsiLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG52YXIgcmVkdWNlID0gcmVxdWlyZSgncmVkdWNlJyk7XG5cbi8qKlxuICogUm9vdCByZWZlcmVuY2UgZm9yIGlmcmFtZXMuXG4gKi9cblxudmFyIHJvb3QgPSAndW5kZWZpbmVkJyA9PSB0eXBlb2Ygd2luZG93XG4gID8gdGhpc1xuICA6IHdpbmRvdztcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIFRPRE86IGZ1dHVyZSBwcm9vZiwgbW92ZSB0byBjb21wb2VudCBsYW5kXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSG9zdChvYmopIHtcbiAgdmFyIHN0ciA9IHt9LnRvU3RyaW5nLmNhbGwob2JqKTtcblxuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgIGNhc2UgJ1tvYmplY3QgQmxvYl0nOlxuICAgIGNhc2UgJ1tvYmplY3QgRm9ybURhdGFdJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbmZ1bmN0aW9uIGdldFhIUigpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAmJiAoJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChudWxsICE9IG9ialtrZXldKSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtrZXldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbiByZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuIC8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhcnRzO1xuICB2YXIgcGFpcjtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcGFydHMgPSBwYWlyLnNwbGl0KCc9Jyk7XG4gICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYXJ0c1swXSldID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICdhcHBsaWNhdGlvbi94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxuIHJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnlcbiB9O1xuXG4gLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2Vcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGxpbmVzLnBvcCgpOyAvLyB0cmFpbGluZyBDUkxGXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHR5cGUoc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyYW1zKHN0cil7XG4gIHJldHVybiByZWR1Y2Uoc3RyLnNwbGl0KC8gKjsgKi8pLCBmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pXG4gICAgICAsIGtleSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICwgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgdGhpcy50ZXh0ID0gdGhpcy54aHIucmVzcG9uc2VUZXh0O1xuICB0aGlzLnNldFN0YXR1c1Byb3BlcnRpZXModGhpcy54aHIuc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLnNldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgPyB0aGlzLnBhcnNlQm9keSh0aGlzLnRleHQpXG4gICAgOiBudWxsO1xufVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gIC8vIGNvbnRlbnQtdHlwZVxuICB2YXIgY3QgPSB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICB2YXIgb2JqID0gcGFyYW1zKGN0KTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikgdGhpc1trZXldID0gb2JqW2tleV07XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnBhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cil7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgcmV0dXJuIHBhcnNlXG4gICAgPyBwYXJzZShzdHIpXG4gICAgOiBudWxsO1xufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAvLyBiYXNpY3NcbiAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cyB8fCAxMjIzID09IHN0YXR1cztcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbiAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciBwYXRoID0gcmVxLnBhdGg7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHBhdGggKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIucGF0aCA9IHBhdGg7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTtcbiAgdGhpcy5faGVhZGVyID0ge307XG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICBpZiAoJ0hFQUQnID09IG1ldGhvZCkgcmVzLnRleHQgPSBudWxsO1xuICAgIHNlbGYuY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbihmbikge1xuICBmbih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogU2V0IHRpbWVvdXQgdG8gYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24obXMpe1xuICB0aGlzLl90aW1lb3V0ID0gbXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbigpe1xuICB0aGlzLl90aW1lb3V0ID0gMDtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm47XG4gIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gIHRoaXMueGhyLmFib3J0KCk7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMuZW1pdCgnYWJvcnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgYGZpZWxkYCB0byBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWwpe1xuICBpZiAoaXNPYmplY3QoZmllbGQpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGZpZWxkKSB7XG4gICAgICB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV0gPSB2YWw7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZ2V0SGVhZGVyID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgQ29udGVudC1UeXBlIHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgneG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdhcHBsaWNhdGlvbi94bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0NvbnRlbnQtVHlwZScsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQWNjZXB0IHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0FjY2VwdCcsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQXV0aG9yaXphdGlvbiBmaWVsZCB2YWx1ZSB3aXRoIGB1c2VyYCBhbmQgYHBhc3NgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFzc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzKXtcbiAgdmFyIHN0ciA9IGJ0b2EodXNlciArICc6JyArIHBhc3MpO1xuICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICsgc3RyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbipcbiogRXhhbXBsZXM6XG4qXG4qICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4qICAgICAucXVlcnkoJ3NpemU9MTAnKVxuKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuKlxuKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiogQGFwaSBwdWJsaWNcbiovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKXtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHZhbCA9IHNlcmlhbGl6ZSh2YWwpO1xuICBpZiAodmFsKSB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBxdWVyeXN0cmluZ1xuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG11bHRpcGxlIGRhdGEgXCJ3cml0ZXNcIlxuICogICAgICAgcmVxdWVzdC5nZXQoJy9zZWFyY2gnKVxuICogICAgICAgICAuc2VuZCh7IHNlYXJjaDogJ3F1ZXJ5JyB9KVxuICogICAgICAgICAuc2VuZCh7IHJhbmdlOiAnMS4uNScgfSlcbiAqICAgICAgICAgLnNlbmQoeyBvcmRlcjogJ2Rlc2MnIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIG9iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuZ2V0SGVhZGVyKCdDb250ZW50LVR5cGUnKTtcblxuICAvLyBtZXJnZVxuICBpZiAob2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIW9iaikgcmV0dXJuIHRoaXM7XG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIGlmICgyID09IGZuLmxlbmd0aCkgcmV0dXJuIGZuKGVyciwgcmVzKTtcbiAgaWYgKGVycikgcmV0dXJuIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICBmbihyZXMpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB4LWRvbWFpbiBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jcm9zc0RvbWFpbkVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicpO1xuICBlcnIuY3Jvc3NEb21haW4gPSB0cnVlO1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudGltZW91dEVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRpbWVvdXQgPSB0aGlzLl90aW1lb3V0O1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCd0aW1lb3V0IG9mICcgKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyk7XG4gIGVyci50aW1lb3V0ID0gdGltZW91dDtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbigpe1xuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSW5pdGlhdGUgcmVxdWVzdCwgaW52b2tpbmcgY2FsbGJhY2sgYGZuKHJlcylgXG4gKiB3aXRoIGFuIGluc3RhbmNlb2YgYFJlc3BvbnNlYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgeGhyID0gdGhpcy54aHIgPSBnZXRYSFIoKTtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICB2YXIgdGltZW91dCA9IHRoaXMuX3RpbWVvdXQ7XG4gIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIGlmICg0ICE9IHhoci5yZWFkeVN0YXRlKSByZXR1cm47XG4gICAgaWYgKDAgPT0geGhyLnN0YXR1cykge1xuICAgICAgaWYgKHNlbGYuYWJvcnRlZCkgcmV0dXJuIHNlbGYudGltZW91dEVycm9yKCk7XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgaWYgKHhoci51cGxvYWQpIHtcbiAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKXtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gdGltZW91dFxuICBpZiAodGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIGlmIChxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcmVxdWVzdC5zZXJpYWxpemVPYmplY3QocXVlcnkpO1xuICAgIHRoaXMudXJsICs9IH50aGlzLnVybC5pbmRleE9mKCc/JylcbiAgICAgID8gJyYnICsgcXVlcnlcbiAgICAgIDogJz8nICsgcXVlcnk7XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICgnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIWlzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBzZXJpYWxpemUgPSByZXF1ZXN0LnNlcmlhbGl6ZVt0aGlzLmdldEhlYWRlcignQ29udGVudC1UeXBlJyldO1xuICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gIH1cblxuICAvLyBzZXQgaGVhZGVyIGZpZWxkc1xuICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmIChudWxsID09IHRoaXMuaGVhZGVyW2ZpZWxkXSkgY29udGludWU7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuICB4aHIuc2VuZChkYXRhKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdGAuXG4gKi9cblxucmVxdWVzdC5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBJc3N1ZSBhIHJlcXVlc3Q6XG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgcmVxdWVzdCgnR0VUJywgJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycpLmVuZChjYWxsYmFjaylcbiAqICAgIHJlcXVlc3QoJy91c2VycycsIGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB1cmwgb3IgY2FsbGJhY2tcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbn1cblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gZGF0YSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBkYXRhIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbil7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmRlbCA9IGZ1bmN0aW9uKHVybCwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBkYXRhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgZm4gPSBkYXRhLCBkYXRhID0gbnVsbDtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQT1NUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSBmbiA9IGRhdGEsIGRhdGEgPSBudWxsO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IGRhdGEgb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pe1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIGZuID0gZGF0YSwgZGF0YSA9IG51bGw7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3Q7XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgZm4uX29mZiA9IG9uO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBpID0gY2FsbGJhY2tzLmluZGV4T2YoZm4uX29mZiB8fCBmbik7XG4gIGlmICh+aSkgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsIlxuLyoqXG4gKiBSZWR1Y2UgYGFycmAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TWl4ZWR9IGluaXRpYWxcbiAqXG4gKiBUT0RPOiBjb21iYXRpYmxlIGVycm9yIGhhbmRsaW5nP1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJyLCBmbiwgaW5pdGlhbCl7ICBcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xuICB2YXIgY3VyciA9IGFyZ3VtZW50cy5sZW5ndGggPT0gM1xuICAgID8gaW5pdGlhbFxuICAgIDogYXJyW2lkeCsrXTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgY3VyciA9IGZuLmNhbGwobnVsbCwgY3VyciwgYXJyW2lkeF0sICsraWR4LCBhcnIpO1xuICB9XG4gIFxuICByZXR1cm4gY3Vycjtcbn07IiwidmFyIGlzID0gcmVxdWlyZSgnc2MtaXMnKSxcblx0Y2FzdCA9IHJlcXVpcmUoJ3NjLWNhc3QnKSxcblx0aGFzS2V5ID0gcmVxdWlyZSgnc2MtaGFza2V5JyksXG5cdG1lcmdlID0gcmVxdWlyZSgnc2MtbWVyZ2UnKSxcblx0ZW1pdHRlciA9IHJlcXVpcmUoJ2VtaXR0ZXItY29tcG9uZW50JyksXG5cdHJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QuYWpheC5qcycpO1xuXG52YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbnZhciBBdHRyaWJ1dGVzID0gZnVuY3Rpb24oX2tleSwgX3ZhbHVlKSB7XG5cdHJldHVybiBtZXJnZSh7XG5cdFx0bmFtZTogX2tleSB8fCAnJyxcblx0XHR0eXBlOiAnJyxcblx0XHRkZWZhdWx0OiBudWxsLFxuXHRcdG9wdGlvbmFsOiBmYWxzZVxuXHR9LCBfdmFsdWUpO1xufVxuXG52YXIgZ2V0UHJvcGVydHkgPSBmdW5jdGlvbihfa2V5KSB7XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2RhdGFbX2tleV07XG5cdH1cbn07XG5cbnZhciBzZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKF9rZXkpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKF92YWx1ZSkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1tfa2V5XSxcblx0XHRcdHZhbHVlID0gYXR0cmlidXRlcy50eXBlID8gY2FzdChfdmFsdWUsIGF0dHJpYnV0ZXMudHlwZSwgYXR0cmlidXRlc1snZGVmYXVsdCddKSA6IF92YWx1ZTtcblxuXHRcdGlmIChzZWxmLl9fZGF0YVtfa2V5XSAhPT0gdmFsdWUpIHtcblx0XHRcdHNlbGYuZW1pdCgnY2hhbmdlJywgc2VsZi5fX2RhdGFbX2tleV0sIHZhbHVlKTtcblx0XHR9XG5cblx0XHRzZWxmLl9fZGF0YVtfa2V5XSA9IHZhbHVlO1xuXHR9XG59O1xuXG52YXIgc2V0QnVzeSA9IGZ1bmN0aW9uKF9zZWxmKSB7XG5cdHJldHVybiBmdW5jdGlvbigpIHtcblx0XHRfc2VsZi5idXN5ID0gdHJ1ZTtcblx0fVxufVxuXG52YXIgdW5zZXRCdXN5ID0gZnVuY3Rpb24oX3NlbGYpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdF9zZWxmLmJ1c3kgPSBmYWxzZTtcblx0fVxufVxuXG52YXIgTW9kZWwgPSBmdW5jdGlvbihfbmFtZSwgX2tleSkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoc2VsZiwge1xuXHRcdF9fYXR0cmlidXRlczoge1xuXHRcdFx0dmFsdWU6IHt9LFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9fYmFzZToge1xuXHRcdFx0dmFsdWU6ICcnLFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9fZGF0YToge1xuXHRcdFx0dmFsdWU6IHt9LFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9fZGVzdHJveWVkOiB7XG5cdFx0XHR2YWx1ZTogZmFsc2UsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19oZWFkZXJzOiB7XG5cdFx0XHR2YWx1ZToge30sXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19rZXk6IHtcblx0XHRcdHZhbHVlOiBfa2V5IHx8ICdpZCcsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19uYW1lOiB7XG5cdFx0XHR2YWx1ZTogX25hbWUgfHwgJydcblx0XHR9LFxuXHRcdF9fdXJsOiB7XG5cdFx0XHR2YWx1ZTogJycsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0YnVzeToge1xuXHRcdFx0dmFsdWU6IGZhbHNlLFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9XG5cdH0pO1xuXG5cdHNlbGYucHJvcGVydHkoc2VsZi5fX2tleSk7XG5cblx0c2VsZi5vbigncHJlc2F2ZScsIHNldEJ1c3koc2VsZikpO1xuXHRzZWxmLm9uKCdzYXZlJywgdW5zZXRCdXN5KHNlbGYpKTtcblxuXHRzZWxmLm9uKCdwcmVkZXN0cm95Jywgc2V0QnVzeShzZWxmKSk7XG5cdHNlbGYub24oJ2Rlc3Ryb3knLCB1bnNldEJ1c3koc2VsZikpO1xuXG5cdHNlbGYub24oJ3ByZWdldCcsIHNldEJ1c3koc2VsZikpO1xuXHRzZWxmLm9uKCdnZXQnLCB1bnNldEJ1c3koc2VsZikpO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuYmFzZSA9IGZ1bmN0aW9uKF9iYXNlKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHR1cmwgPSBpcy5lbXB0eShfYmFzZSkgPyAnJyA6IF9iYXNlO1xuXG5cdHNlbGYuX19iYXNlID0gdXJsLnRyaW0oKS5yZXBsYWNlKC8oXFwvfFxccykrJC9nLCAnJyk7XG5cblx0cmV0dXJuIGlzLm5vdC5hLnN0cmluZyhfYmFzZSkgPyBzZWxmLl9fYmFzZSA6IHNlbGY7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuY29sbGVjdGlvbiA9IGZ1bmN0aW9uKF9xdWVyeSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0dXJsID0gc2VsZi51cmwoKSxcblx0XHRtZXRob2QgPSAnZ2V0Jyxcblx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdChfcXVlcnkpID8gX3F1ZXJ5IDoge30sXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoX3F1ZXJ5KSA/IF9xdWVyeSA6IGlzLmEuZnVuYyhfY2FsbGJhY2spID8gX2NhbGxiYWNrIDogbm9vcDtcblxuXHRzZWxmLmVtaXQoJ3ByZWNvbGxlY3Rpb24nLCB7XG5cdFx0bW9kZWw6IHNlbGYsXG5cdFx0bWV0aG9kOiBtZXRob2QsXG5cdFx0cXVlcnk6IHF1ZXJ5LFxuXHRcdHVybDogdXJsLFxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHR9KTtcblxuXHRyZXF1ZXN0KHNlbGYsIHF1ZXJ5LCBtZXRob2QsIHVybCwgZnVuY3Rpb24oX2Vycm9yLCBfcmVzKSB7XG5cdFx0c2VsZi5lbWl0KCdjb2xsZWN0aW9uJywgX2Vycm9yLCBfcmVzKTtcblx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHR9KTtcblxufTtcblxuTW9kZWwucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihfY2FsbGJhY2spIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdGlzRGlydHkgPSBzZWxmLmlzRGlydHkoKSxcblx0XHRkYXRhID0gc2VsZi5qc29uKCksXG5cdFx0dXJsID0gc2VsZi51cmwoKSArICcvJyArIHNlbGZbc2VsZi5fX2tleV0sXG5cdFx0bWV0aG9kID0gJ2RlbGV0ZScsXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoX2NhbGxiYWNrKSA/IF9jYWxsYmFjayA6IG5vb3A7XG5cblx0c2VsZi5lbWl0KCdwcmVkZXN0cm95Jywge1xuXHRcdG1vZGVsOiBzZWxmLFxuXHRcdGRhdGE6IGRhdGEsXG5cdFx0bWV0aG9kOiBtZXRob2QsXG5cdFx0dXJsOiB1cmwsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdH0pO1xuXG5cdGlmICghaXNEaXJ0eSkge1xuXHRcdHJlcXVlc3Qoc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRzZWxmLmVtaXQoJ2Rlc3Ryb3knLCBzZWxmKTtcblxuXHRcdFx0c2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XG5cdFx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGNhbGxiYWNrLmFwcGx5KHNlbGYsIFtuZXcgRXJyb3IoJ1RoaXMgbW9kZWwgY2Fubm90IGJlIGRlc3Ryb3llZCBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyIHlldC4nKV0pO1xuXHR9XG5cbn07XG5cbk1vZGVsLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24oX2RhdGEpIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdGRhdGEgPSBpcy5vYmplY3QoX2RhdGEpID8gX2RhdGEgOiB7fTtcblxuXHRPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKF9rZXkpIHtcblx0XHRzZWxmLnByb3BlcnR5KF9rZXksIF9kYXRhW19rZXldKTtcblx0fSk7XG5cblx0cmV0dXJuIHNlbGY7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbihfZGF0YSkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0bmV3TW9kZWwgPSBuZXcgTW9kZWwoc2VsZi5fX25hbWUsIHNlbGYuX19rZXkpXG5cdFx0XHQuYmFzZShzZWxmLl9fYmFzZSlcblx0XHRcdC5oZWFkZXJzKHNlbGYuX19oZWFkZXJzKVxuXHRcdFx0LnVybChzZWxmLl9fdXJsKTtcblxuXHRPYmplY3Qua2V5cyhzZWxmLl9fYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbihfcHJvcGVydHlLZXkpIHtcblx0XHRuZXdNb2RlbC5wcm9wZXJ0eShfcHJvcGVydHlLZXksIG1lcmdlKHNlbGYuX19hdHRyaWJ1dGVzW19wcm9wZXJ0eUtleV0pKTtcblx0fSk7XG5cblx0bmV3TW9kZWwuZGF0YShfZGF0YSk7XG5cblx0cmV0dXJuIG5ld01vZGVsO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKF9xdWVyeSwgX2NhbGxiYWNrKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHR1cmwgPSBzZWxmLnVybCgpLFxuXHRcdG1ldGhvZCA9ICdnZXQnLFxuXHRcdHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KF9xdWVyeSkgPyBfcXVlcnkgOiB7fSxcblx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyhfcXVlcnkpID8gX3F1ZXJ5IDogaXMuYS5mdW5jKF9jYWxsYmFjaykgPyBfY2FsbGJhY2sgOiBub29wO1xuXG5cdHNlbGYuZW1pdCgncHJlZ2V0Jywge1xuXHRcdG1vZGVsOiBzZWxmLFxuXHRcdG1ldGhvZDogbWV0aG9kLFxuXHRcdHF1ZXJ5OiBxdWVyeSxcblx0XHR1cmw6IHVybCxcblx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0fSk7XG5cblx0cmVxdWVzdChzZWxmLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uKF9lcnJvciwgX3Jlcykge1xuXHRcdHNlbGYuZW1pdCgnZ2V0JywgX2Vycm9yLCBfcmVzKTtcblx0XHRjYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHMpO1xuXHR9KTtcblxufTtcblxuTW9kZWwucHJvdG90eXBlLmpzb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX19kYXRhO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmhlYWRlcnMgPSBmdW5jdGlvbihfaGVhZGVycykge1xuXHR0aGlzLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdChfaGVhZGVycykgPyBfaGVhZGVycyA6IHRoaXMuX19oZWFkZXJzO1xuXHRyZXR1cm4gaXMubm90LmFuLm9iamVjdChfaGVhZGVycykgPyB0aGlzLl9faGVhZGVycyA6IHRoaXM7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuaXNEaXJ0eSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gaXMuZW1wdHkodGhpc1t0aGlzLl9fa2V5XSk7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0aXNWYWxpZCA9IHRydWU7XG5cblx0T2JqZWN0LmtleXMoc2VsZi5fX2F0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24oX2tleSkge1xuXG5cdFx0aWYgKHNlbGYuaXNEaXJ0eSgpICYmIF9rZXkgPT09IHNlbGYuX19rZXkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgdmFsdWUgPSBzZWxmW19rZXldLFxuXHRcdFx0YXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzW19rZXldLFxuXHRcdFx0dHlwZSA9IGF0dHJpYnV0ZXMudHlwZSxcblx0XHRcdGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsID8gZmFsc2UgOiB0cnVlLFxuXHRcdFx0aGFzTm9EZWZhdWx0ID0gaXMubnVsbE9yVW5kZWZpbmVkKGF0dHJpYnV0ZXNbJ2RlZmF1bHQnXSksXG5cdFx0XHRpc051bGxPclVuZGVmaW5lZCA9IGlzLm51bGxPclVuZGVmaW5lZCh2YWx1ZSksXG5cdFx0XHR0eXBlSXNXcm9uZyA9IGlzLm5vdC5lbXB0eSh0eXBlKSA/IGlzLm5vdC5hW3R5cGVdKHZhbHVlKSA6IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5cdFx0aWYgKGlzUmVxdWlyZWQgJiYgdHlwZUlzV3JvbmcpIHtcblx0XHRcdGlzVmFsaWQgPSBmYWxzZTtcblx0XHR9XG5cblx0fSk7XG5cblx0cmV0dXJuIGlzVmFsaWQ7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUua2V5ID0gZnVuY3Rpb24oX2tleSkge1xuXHR0aGlzLl9fa2V5ID0gX2tleTtcblx0cmV0dXJuIHRoaXM7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUucHJvcGVydHkgPSBmdW5jdGlvbihfa2V5LCBfdmFsdWUpIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdGF0dHJpYnV0ZXMgPSBuZXcgQXR0cmlidXRlcyhfa2V5LCBfdmFsdWUpO1xuXG5cdGlmICghc2VsZi5oYXNPd25Qcm9wZXJ0eShfa2V5KSkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBfa2V5LCB7XG5cdFx0XHRnZXQ6IGdldFByb3BlcnR5KF9rZXkpLFxuXHRcdFx0c2V0OiBzZXRQcm9wZXJ0eShfa2V5KSxcblx0XHRcdGVudW1lcmFibGU6IHRydWVcblx0XHR9KTtcblx0XHRzZWxmLl9fYXR0cmlidXRlc1tfa2V5XSA9IGF0dHJpYnV0ZXM7XG5cdH1cblxuXHRpZiAoYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgJiYgaXMubm90Lm51bGxPclVuZGVmaW5lZChhdHRyaWJ1dGVzWydkZWZhdWx0J10pKSB7XG5cdFx0c2VsZltfa2V5XSA9IGF0dHJpYnV0ZXNbJ2RlZmF1bHQnXTtcblx0fSBlbHNlIGlmIChhdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSkge1xuXHRcdHNlbGYuX19kYXRhW19rZXldID0gaXMuZW1wdHkoYXR0cmlidXRlcy50eXBlKSA/IHVuZGVmaW5lZCA6IGNhc3QodW5kZWZpbmVkLCBhdHRyaWJ1dGVzLnR5cGUpO1xuXHR9XG5cblx0cmV0dXJuIHNlbGY7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKF9jYWxsYmFjaykge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0ZXJyb3IgPSBudWxsLFxuXHRcdGlzRGlydHkgPSBzZWxmLmlzRGlydHkoKSxcblx0XHRkYXRhID0gc2VsZi5qc29uKCksXG5cdFx0dXJsID0gc2VsZi51cmwoKSArICghaXNEaXJ0eSA/ICcvJyArIHNlbGZbc2VsZi5fX2tleV0gOiAnJyksXG5cdFx0bWV0aG9kID0gaXNEaXJ0eSA/ICdwb3N0JyA6ICdwdXQnLFxuXHRcdGNhbGxiYWNrID0gaXMuYS5mdW5jKF9jYWxsYmFjaykgPyBfY2FsbGJhY2sgOiBub29wO1xuXG5cdHNlbGYuZW1pdCgncHJlc2F2ZScsIHtcblx0XHRtb2RlbDogc2VsZixcblx0XHRkYXRhOiBkYXRhLFxuXHRcdG1ldGhvZDogbWV0aG9kLFxuXHRcdHVybDogdXJsLFxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHR9KTtcblxuXHRyZXF1ZXN0KHNlbGYsIGRhdGEsIG1ldGhvZCwgdXJsLCBmdW5jdGlvbihfZXJyb3IsIF9yZXMpIHtcblx0XHRzZWxmLmVtaXQoJ3NhdmUnLCBfZXJyb3IsIF9yZXMpO1xuXHRcdGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3VtZW50cyk7XG5cdH0pO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUudXJsID0gZnVuY3Rpb24oX3VybCkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0YmFzZSA9IGlzLmVtcHR5KHNlbGYuX19iYXNlKSA/ICcnIDogc2VsZi5fX2Jhc2UsXG5cdFx0bmFtZSA9IGlzLmVtcHR5KHNlbGYuX19uYW1lKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoL15cXC8vLCAnJyksXG5cdFx0dXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxuXHRcdGVuZHBvaW50ID0gYmFzZSArIG5hbWUgKyAoaXMuZW1wdHkodXJsKSA/ICcnIDogJy8nICsgdXJsLnRyaW0oKS5yZXBsYWNlKC9eXFwvLywgJycpKTtcblxuXHRzZWxmLl9fdXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKC9eXFwvLywgJycpO1xuXG5cdHJldHVybiBpcy5ub3QuYS5zdHJpbmcoX3VybCkgPyBlbmRwb2ludCA6IHNlbGY7XG59O1xuXG5lbWl0dGVyKE1vZGVsLnByb3RvdHlwZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwidmFyIE1vZGVsID0gcmVxdWlyZSgnLi8nKSxcblx0cmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKSxcblx0aXMgPSByZXF1aXJlKCdzYy1pcycpLFxuXHRoYXNLZXkgPSByZXF1aXJlKCdzYy1oYXNrZXknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihfbW9kZWwsIF9kYXRhLCBfbWV0aG9kLCBfdXJsLCBfY2FsbGJhY2spIHtcblx0dmFyIG1ldGhvZCA9IC9kZWxldGUvaS50ZXN0KF9tZXRob2QpID8gJ2RlbCcgOiBfbWV0aG9kLFxuXHRcdG1vZGVsID0gX21vZGVsLFxuXHRcdGRhdGEgPSBfZGF0YSxcblx0XHR1cmwgPSBfdXJsLFxuXHRcdGlzRGlydHkgPSBtb2RlbC5pc0RpcnR5KCksXG5cdFx0bW9kZWxLZXksXG5cdFx0ZXJyb3I7XG5cblx0aWYgKC9nZXQvaS50ZXN0KG1ldGhvZCkgJiYgaGFzS2V5KGRhdGEsIG1vZGVsLl9fa2V5KSAmJiBuZXcgUmVnRXhwKGRhdGFbbW9kZWwuX19rZXldKS50ZXN0KHVybCkgPT09IGZhbHNlKSB7XG5cdFx0bW9kZWxLZXkgPSBkYXRhW21vZGVsLl9fa2V5XTtcblx0XHRkZWxldGUgZGF0YVttb2RlbC5fX2tleV07XG5cdFx0dXJsICs9ICcvJyArIG1vZGVsS2V5O1xuXHR9XG5cblx0cmVxdWVzdFttZXRob2RdKHVybClbL2dldC9pLnRlc3QobWV0aG9kKSA/ICdxdWVyeScgOiAnc2VuZCddKGRhdGEpXG5cdFx0LnNldChtb2RlbC5oZWFkZXJzKCkpXG5cdFx0LnR5cGUoJ2pzb24nKVxuXHRcdC5hY2NlcHQoJ2pzb24nKVxuXHRcdC5lbmQoZnVuY3Rpb24oX2Vycm9yLCBfcmVzKSB7XG5cdFx0XHR2YXIgcmVzID0gaXMuYW4ub2JqZWN0KF9yZXMpID8gX3JlcyA6IHt9LFxuXHRcdFx0XHRpdGVtcyA9IFtdLFxuXHRcdFx0XHRib2R5ID0gaGFzS2V5KF9yZXMsICdib2R5JykgJiYgKGlzLm9iamVjdChfcmVzLmJvZHkpIHx8IGlzLmFycmF5KF9yZXMuYm9keSkpID8gX3Jlcy5ib2R5IDogbnVsbDtcblxuXHRcdFx0aWYgKHJlc1snb2snXSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRlcnJvciA9IG5ldyBFcnJvcignVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciB3YXMgbm90IE9LJyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChib2R5ID09PSBudWxsKSB7XG5cdFx0XHRcdGVycm9yID0gbmV3IEVycm9yKCdUaGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGNvbnRhaW5lZCBhbiBlbXB0eSBib2R5Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoYm9keSkgJiYgIWhhc0tleShib2R5LCBtb2RlbC5fX2tleSkpIHtcblx0XHRcdFx0ZXJyb3IgPSBuZXcgRXJyb3IoJ1RoZSByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZGlkIG5vdCBjb250YWluIGEgdmFsaWQgYCcgKyBtb2RlbC5fX2tleSArICdgJyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoYm9keSkpIHtcblx0XHRcdFx0bW9kZWxbbW9kZWwuX19rZXldID0gYm9keVttb2RlbC5fX2tleV07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpcy5hcnJheShib2R5KSkge1xuXG5cdFx0XHRcdGJvZHkuZm9yRWFjaChmdW5jdGlvbihfZGF0YSkge1xuXHRcdFx0XHRcdGl0ZW1zLnB1c2gobW9kZWwuY2xvbmUoX2RhdGEpKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0bW9kZWwgPSBpdGVtcztcblxuXHRcdFx0fSBlbHNlIGlmIChpcy5vYmplY3QoYm9keSkpIHtcblxuXHRcdFx0XHRPYmplY3Qua2V5cyhib2R5KS5mb3JFYWNoKGZ1bmN0aW9uKF9rZXkpIHtcblx0XHRcdFx0XHRpZiAobW9kZWwuaGFzT3duUHJvcGVydHkoX2tleSkpIHtcblx0XHRcdFx0XHRcdG1vZGVsW19rZXldID0gYm9keVtfa2V5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdF9jYWxsYmFjayAmJiBfY2FsbGJhY2soZXJyb3IsIG1vZGVsKTtcblx0XHR9KTtcblxufSJdfQ==
(18)
});
