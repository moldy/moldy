!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.moldy=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

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
module.exports={
	"defaults": {
		"middlewareKey": "all"
	}
}
},{}],16:[function(_dereq_,module,exports){
var is = _dereq_( "sc-is" ),
  config = _dereq_( "./config.json" ),
  noop = function () {};

var useifyFunction = function ( functions, key, fn ) {
  if ( is.not.empty( key ) && is.a.string( key ) ) {
    if ( is.not.an.array( functions[ key ] ) ) {
      functions[ key ] = [];
    }
    if ( is.a.func( fn ) ) {
      functions[ key ].push( fn );
    }
    return functions[ key ];
  }
}

var Useify = function () {
  this.functions = {
    all: []
  };
};

Useify.prototype.use = function () {
  var self = this,
    args = Array.prototype.slice.call( arguments ),
    key = is.a.string( args[ 0 ] ) ? args.shift() : config.defaults.middlewareKey,
    fn = is.a.func( args[ 0 ] ) ? args.shift() : noop;

  useifyFunction( self.functions, key, fn );
};

Useify.prototype.middleware = function () {

  var self = this,
    currentFunction = 0,
    args = Array.prototype.slice.call( arguments ),
    middlewareKey = is.a.string( args[ 0 ] ) && is.a.func( args[ 1 ] ) ? args.shift() : config.defaults.middlewareKey,
    callback = is.a.func( args[ 0 ] ) ? args.shift() : noop;

  useifyFunction( self.functions, middlewareKey );

  var next = function () {
    var fn = self.functions[ middlewareKey ][ currentFunction++ ],
      args = Array.prototype.slice.call( arguments );

    if ( !fn ) {
      callback.apply( self.context, args );
    } else {
      args.push( next );
      fn.apply( self.context, args );
    }

  };

  next.apply( self.context, args );

};

Useify.prototype.clear = function ( middlewareKey ) {
  if ( is.a.string( middlewareKey ) && is.not.empty( middlewareKey ) ) {
    this.functions[ middlewareKey ] = [];
  } else {
    this.functions = {
      all: []
    };
  }
};

module.exports = function ( _objectOrFunction ) {

  var useify = new Useify();

  if ( is.an.object( _objectOrFunction ) ) {

    Object.defineProperties( _objectOrFunction, {

      "use": {
        value: function () {
          useify.use.apply( useify, arguments );
          return _objectOrFunction;
        }
      },

      "middleware": {
        value: function () {
          useify.middleware.apply( useify, arguments );
        }
      },

      "useify": {
        value: useify
      }

    } );

    useify.context = _objectOrFunction;

  } else if ( is.a.fn( _objectOrFunction ) ) {

    _objectOrFunction.prototype.middleware = function () {
      useify.context = this;
      useify.middleware.apply( useify, arguments );
    };

    _objectOrFunction.use = function () {
      useify.use.apply( useify, arguments );
      return this;
    };

    _objectOrFunction.useify = useify;

  }

};
},{"./config.json":15,"sc-is":7}],17:[function(_dereq_,module,exports){
var ObservableArray = function ( _array ) {
	var handlers = {},
		array = Array.isArray( _array ) ? _array : [];

	var proxy = function ( _method, _value ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		if ( handlers[ _method ] ) {
			return handlers[ _method ].apply( array, args );
		} else {
			return array[ '__' + _method ].apply( array, args );
		}
	};

	Object.defineProperties( array, {
		on: {
			value: function ( _event, _callback ) {
				handlers[ _event ] = _callback;
			}
		}
	} );

	Object.defineProperty( array, 'pop', {
		value: function () {
			return proxy( 'pop', array[ array.length - 1 ] );
		}
	} );

	Object.defineProperty( array, '__pop', {
		value: function () {
			return Array.prototype.pop.apply( array, arguments );
		}
	} );

	Object.defineProperty( array, 'shift', {
		value: function () {
			return proxy( 'shift', array[ 0 ] );
		}
	} );

	Object.defineProperty( array, '__shift', {
		value: function () {
			return Array.prototype.shift.apply( array, arguments );
		}
	} );

	[ 'push', 'reverse', 'unshift', 'sort', 'splice' ].forEach( function ( _method ) {
		var properties = {};

		properties[ _method ] = {
			value: proxy.bind( null, _method )
		};

		properties[ '__' + _method ] = {
			value: function ( _value ) {
				return Array.prototype[ _method ].apply( array, arguments );
			}
		};

		Object.defineProperties( array, properties );
	} );

	return array;
};

module.exports = ObservableArray;
},{}],18:[function(_dereq_,module,exports){
var useify = _dereq_( 'sc-useify' ),
    defaultConfiguration = {
      baseUrl: '',
      headers: {}
    },
    Moldy = _dereq_( './moldy' )( defaultConfiguration );

var moldyAPI = {
  create: function ( _name, _properties ) {
    return new Moldy( _name, _properties );
  }
};

useify( moldyAPI );

exports = module.exports = moldyAPI;

exports.defaults = defaultConfiguration
/**
 * Expose built in middleware
 */
// exports.schema = require( './middleware/schema.middleware' );
// exports.ajax = require( './middleware/ajax.middleware' );
},{"./moldy":20,"sc-useify":16}],19:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
	cast = _dereq_( 'sc-cast' ),
	merge = _dereq_( 'sc-merge' );

exports.attributes = function ( _key, _value ) {
	var value;

	if ( is.a.string( _value ) ) {
		value = {
			type: _value
		};
	} else if ( is.an.object( _value ) && _value[ '__moldy' ] === true ) {
		value = {
			type: 'moldy',
			default: _value
		}
	} else {
		value = _value;
	}

	return merge( {
		name: _key || '',
		type: '',
		default: null,
		optional: false
	}, value );
};

exports.getProperty = function ( _key ) {
	return function () {
		return this.__data[ _key ];
	}
};

exports.destroyedError = function ( _moldy ) {
	var item = typeof _moldy === 'object' ? _moldy : {};
	return new Error( 'The given moldy item `' + item.__name + '` has been destroyed' );
};

exports.setBusy = function ( _self ) {
	return function () {
		_self.busy = true;
	}
};

exports.setProperty = function ( _key ) {
	return function ( _value ) {
		var self = this,
			attributes = self.__attributes[ _key ],
			value = attributes.type ? cast( _value, attributes.type, attributes[ 'default' ] ) : _value;

		if ( self.__data[ _key ] !== value ) {
			self.emit( 'change', self.__data[ _key ], value );
		}

		self.__data[ _key ] = value;
	}
};

exports.unsetBusy = function ( _self ) {
	return function () {
		_self.busy = false;
	}
};

exports.noop = function () {};
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],20:[function(_dereq_,module,exports){
var cast = _dereq_( 'sc-cast' ),
  emitter = _dereq_( 'emitter-component' ),
  hasKey = _dereq_( 'sc-haskey' ),
  helpers = _dereq_( './helpers' ),
  is = _dereq_( 'sc-is' ),
  merge = _dereq_( 'sc-merge' ),
  observableArray = _dereq_( 'sg-observable-array' ),
  request = _dereq_( './request' ),
  useify = _dereq_( 'sc-useify' );

exports = module.exports = function ( defaultConfiguration ) {
  var Moldy = function ( _name, _properties ) {
    var self = this,
      properties = is.an.object( _properties ) ? _properties : {};

    Object.defineProperties( self, {
      __moldy: {
        value: true
      },
      __attributes: {
        value: {},
        writable: true
      },
      __baseUrl: {
        value: cast( properties[ 'baseUrl' ], 'string', '' ),
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
        value: merge( {}, cast( properties[ 'headers' ], 'object', {} ), cast( defaultConfiguration.headers, 'object', {} ) ),
        writable: true
      },
      __key: {
        value: cast( properties[ 'key' ], 'string', 'id' ) || 'id',
        writable: true
      },
      __keyless: {
        value: properties[ 'keyless' ] === true
      },
      __name: {
        value: _name || properties[ 'name' ] || ''
      },
      __url: {
        value: cast( properties[ 'url' ], 'string', '' ),
        writable: true
      },
      busy: {
        value: false,
        writable: true
      }
    } );

    if ( !properties[ 'keyless' ] ) {
      self.$property( self.__key );
    }

    Object.keys( cast( properties[ 'properties' ], 'object', {} ) ).forEach( function ( _key ) {
      self.$property( _key, properties[ 'properties' ][ _key ] );
    } );

    self.on( 'presave', helpers.setBusy( self ) );
    self.on( 'save', helpers.unsetBusy( self ) );

    self.on( 'predestroy', helpers.setBusy( self ) );
    self.on( 'destroy', helpers.unsetBusy( self ) );

    self.on( 'preget', helpers.setBusy( self ) );
    self.on( 'get', helpers.unsetBusy( self ) );

  };

  Moldy.prototype.$baseUrl = function ( _base ) {
    var self = this,
      url = cast( _base, 'string', self.__baseUrl || '' );

    self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || defaultConfiguration.baseUrl || '';

    return is.not.a.string( _base ) ? self.__baseUrl : self;
  };

  Moldy.prototype.$clone = function ( _data ) {
    var self = this,
      data = is.an.object( _data ) ? _data : self.__data,
      newMoldy = new Moldy( self.__name, {
        baseUrl: self.$baseUrl(),
        headers: self.__headers,
        key: self.__key,
        keyless: self.__keyless,
        url: self.__url
      } );

    Object.keys( self.__attributes ).forEach( function ( _propertyKey ) {
      newMoldy.$property( _propertyKey, merge( self.__attributes[ _propertyKey ] ) );
      if ( is.an.array( newMoldy[ _propertyKey ] ) && is.an.array( data[ _propertyKey ] ) ) {
        data[ _propertyKey ].forEach( function ( _dataItem ) {
          newMoldy[ _propertyKey ].push( _dataItem );
        } );
      } else {
        newMoldy[ _propertyKey ] = data[ _propertyKey ]
      }
    } );

    return newMoldy;
  };

  Moldy.prototype.$collection = function ( _query, _callback ) {
    var self = this,
      url = self.$url(),
      method = 'get',
      query = is.an.object( _query ) ? _query : {},
      callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop;

    self.emit( 'precollection', {
      moldy: self,
      method: method,
      query: query,
      url: url,
      callback: callback
    } );

    request( self, query, method, url, function ( _error, _res ) {
      var res = cast( _res instanceof Moldy || is.an.array( _res ) ? _res : null, 'array', [] );
      self.emit( 'collection', _error, res );
      callback.apply( self, [ _error, res ] );
    } );

  };

  Moldy.prototype.$destroy = function ( _callback ) {
    var self = this,
      isDirty = self.$isDirty(),
      data = self.$json(),
      url = self.$url() + ( self.__keyless ? '' : '/' + self[ self.__key ] ),
      method = 'delete',
      callback = is.a.func( _callback ) ? _callback : helpers.noop;

    if ( self.__destroyed ) {
      return callback.apply( self, [ helpers.destroyedError( self ) ] );
    }

    self.emit( 'predestroy', {
      moldy: self,
      data: data,
      method: method,
      url: url,
      callback: callback
    } );

    if ( !isDirty ) {
      request( self, data, method, url, function () {
        self.emit( 'destroy', self );
        self.__destroyed = true;
        self[ self.__key ] = undefined;
        callback.apply( self, arguments );
      } );
    } else {
      callback.apply( self, [ new Error( 'This moldy cannot be destroyed because it has not been saved to the server yet.' ) ] );
    }

  };

  Moldy.prototype.$data = function ( _data ) {
    var self = this,
      data = is.object( _data ) ? _data : {};

    if ( self.__destroyed ) {
      return helpers.destroyedError( self );
    }

    Object.keys( data ).forEach( function ( _key ) {
      if ( self.__attributes.hasOwnProperty( _key ) ) {
        if ( is.an.array( data[ _key ] ) && hasKey( self.__attributes[ _key ], 'arrayOfAType', 'boolean' ) && self.__attributes[ _key ].arrayOfAType === true ) {
          data[ _key ].forEach( function ( _moldy ) {
            self[ _key ].push( _moldy );
          } );
        } else if ( is.a.object( data[ _key ] ) && self[ _key ] instanceof Moldy ) {
          self[ _key ].$data( data[ _key ] );
        } else {
          self[ _key ] = data[ _key ];
        }
      }
    } );

    return self;
  };

  Moldy.prototype.$get = function ( _query, _callback ) {
    var self = this,
      url = self.$url(),
      method = 'get',
      query = is.an.object( _query ) ? _query : {},
      callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop
      wasDestroyed = self.__destroyed;

    self.emit( 'preget', {
      moldy: self,
      method: method,
      query: query,
      url: url,
      callback: callback
    } );

    self.__destroyed = false;

    request( self, query, method, url, function ( _error, _res ) {
      var res = _res instanceof Moldy ? _res : null;

      if ( is.an.array( _res ) && _res[ 0 ] instanceof Moldy ) {
        self.$data( _res[ 0 ].$json() );
        res = self;
      }

      if ( _error && wasDestroyed ) {
        self.__destroyed = true;
      }

      self.emit( 'get', _error, res );
      callback.apply( self, [ _error, res ] );
    } );

  };

  Moldy.prototype.$headers = function ( _headers ) {
    var self = this;

    if ( self.__destroyed ) {
      return helpers.destroyedError( self );
    }

    self.__headers = is.an.object( _headers ) ? _headers : self.__headers;
    return is.not.an.object( _headers ) ? self.__headers : self;
  };

  Moldy.prototype.$isDirty = function () {
    return this.__destroyed ? true : is.empty( this[ this.__key ] );
  };

  Moldy.prototype.$isValid = function () {

    if ( this.__destroyed ) {
      return false;
    }

    var self = this,
      isValid = true;

    Object.keys( self.__attributes ).forEach( function ( _key ) {

      if ( self.$isDirty() && _key === self.__key ) {
        return;
      }

      var value = self[ _key ],
        attributes = self.__attributes[ _key ],
        type = attributes.type,
        arrayOfAType = hasKey( attributes, 'arrayOfAType', 'boolean' ) ? attributes.arrayOfAType === true : false,
        isRequired = attributes.optional !== true,
        isNullOrUndefined = self.__keyless ? false : arrayOfAType ? value.length === 0 : is.nullOrUndefined( value ),
        typeIsWrong = is.not.empty( type ) && is.a.string( type ) ? is.not.a[ type ]( value ) : isNullOrUndefined;

      if ( arrayOfAType && is.not.empty( value ) && value[ 0 ] instanceof Moldy ) {
        value.forEach( function ( _item ) {
          if ( isValid && _item.$isValid() === false ) {
            isValid = false;
          }
        } );
      }

      if ( isValid && isRequired && typeIsWrong ) {
        isValid = false;
      }

    } );

    return isValid;
  };

  Moldy.prototype.$json = function () {
    var self = this,
      data = self.__data,
      json = {};

    Object.keys( data ).forEach( function ( _key ) {
      if ( is.an.array( data[ _key ] ) && data[ _key ][ 0 ] instanceof Moldy ) {
        json[ _key ] = [];
        data[ _key ].forEach( function ( _moldy ) {
          json[ _key ].push( _moldy.$json() );
        } );
      } else if ( is.not.an.object( data[ _key ] ) ) {
        json[ _key ] = data[ _key ];
      } else if ( data[ _key ] instanceof Moldy ) {
        json[ _key ] = data[ _key ].$json();
      }
    } );

    return json;
  };

  Moldy.prototype.$property = function ( _key, _value ) {
    var self = this,
      attributes = new helpers.attributes( _key, _value ),
      existingValue = self[ _key ],
      attributeTypeIsAnInstantiatedMoldy = is.a.string( attributes.type ) && /moldy/.test( attributes.type ),
      attributeTypeIsAnArray = is.an.array( attributes.type ),
      valueIsAnArrayMoldy = is.an.array( _value ) && hasKey( _value[ 0 ], 'properties', 'object' ),
      valueIsAnArrayString = is.an.array( _value ) && is.a.string( _value[ 0 ] ),
      attributeArrayTypeIsAMoldy = attributeTypeIsAnArray && hasKey( attributes.type[ 0 ], 'properties', 'object' ),
      attributeArrayTypeIsAString = attributeTypeIsAnArray && is.a.string( attributes.type[ 0 ] ) && is.not.empty( attributes.type[ 0 ] ),
      valueIsAStaticMoldy = hasKey( _value, 'properties', 'object' );

    if ( !self.hasOwnProperty( _key ) || !self.__attributes.hasOwnProperty( _key ) ) {

      if ( valueIsAnArrayMoldy || valueIsAnArrayString ) {
        attributes.type = _value;
        attributeArrayTypeIsAMoldy = valueIsAnArrayMoldy;
        attributeArrayTypeIsAString = valueIsAnArrayString;
        attributeTypeIsAnArray = true;
      }

      if ( attributeTypeIsAnInstantiatedMoldy ) {

        Object.defineProperty( self, _key, {
          value: attributes[ 'default' ],
          enumerable: true,
        } );

        self.__data[ _key ] = self[ _key ];

      } else if ( valueIsAStaticMoldy ) {

        Object.defineProperty( self, _key, {
          value: new Moldy( _value.name, _value ),
          enumerable: true,
        } );

        self.__data[ _key ] = self[ _key ];

      } else if ( attributeTypeIsAnArray ) {

        var array = observableArray( [] ),
          attributeType = attributeArrayTypeIsAString || attributeArrayTypeIsAMoldy ? attributes.type[ 0 ] : '*';

        attributes.arrayOfAType = true;

        Object.defineProperty( self, _key, {
          value: array,
          enumerable: true
        } );

        self.__data[ _key ] = self[ _key ];

        [ 'push', 'unshift' ].forEach( function ( _method ) {
          array.on( _method, function () {
            var args = Array.prototype.slice.call( arguments ),
              values = [];
            args.forEach( function ( _item ) {
              if ( attributeArrayTypeIsAMoldy ) {
                var moldy = new Moldy( attributeType[ 'name' ], attributeType ),
                  data = is.an.object( _item ) ? _item : attributes[ 'default' ];
                moldy.$data( data );
                values.push( moldy );
              } else {
                values.push( cast( _item, attributeType, attributes[ 'default' ] ) );
              }
            } );
            return array[ '__' + _method ].apply( array, values );
          } );
        } );

      } else {
        Object.defineProperty( self, _key, {
          get: helpers.getProperty( _key ),
          set: helpers.setProperty( _key ),
          enumerable: true
        } );
      }

      self.__attributes[ _key ] = attributes;
    }

    if ( existingValue !== undefined ) {
      self[ _key ] = existingValue;
    } else if ( is.empty( self[ _key ] ) && attributes.optional === false && is.not.nullOrUndefined( attributes[ 'default' ] ) ) {
      self[ _key ] = attributes[ 'default' ];
    } else if ( is.empty( self[ _key ] ) && attributes.optional === false ) {
      if ( attributeTypeIsAnArray || attributeTypeIsAnInstantiatedMoldy ) {
        self.__data[ _key ] = self[ _key ];
      } else {
        self.__data[ _key ] = is.empty( attributes.type ) ? undefined : cast( undefined, attributes.type );
      }
    }

    return self;
  };

  Moldy.prototype.$save = function ( _callback ) {
    var self = this,
      error = null,
      isDirty = self.$isDirty(),
      data = self.$json(),
      url = self.$url() + ( !isDirty && !self.__keyless ? '/' + self[ self.__key ] : '' ),
      method = isDirty ? 'post' : 'put',
      callback = is.a.func( _callback ) ? _callback : helpers.noop;

    self.__destroyed = false;

    self.emit( 'presave', {
      moldy: self,
      data: data,
      method: method,
      url: url,
      callback: callback
    } );

    request( self, data, method, url, function ( _error, _res ) {
      self.emit( 'save', _error, _res );
      callback.apply( self, arguments );
    } );

  };

  Moldy.prototype.$url = function ( _url ) {
    var self = this,
      base = is.empty( self.$baseUrl() ) ? '' : self.$baseUrl(),
      name = is.empty( self.__name ) ? '' : '/' + self.__name.trim().replace( /^\//, '' ),
      url = _url || self.__url || '',
      endpoint = base + name + ( is.empty( url ) ? '' : '/' + url.trim().replace( /^\//, '' ) );

    self.__url = url.trim().replace( /^\//, '' );

    return is.not.a.string( _url ) ? endpoint : self;
  };

  emitter( Moldy.prototype );
  useify( Moldy );

  return Moldy;
};
},{"./helpers":19,"./request":21,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sc-useify":16,"sg-observable-array":17}],21:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
	cast = _dereq_( 'sc-cast' ),
	hasKey = _dereq_( 'sc-haskey' );

module.exports = function ( _moldy, _data, _method, _url, _callback ) {
	var moldy = _moldy,
		items = [],
		responseShouldContainAnId = hasKey( _data, moldy.__key ) && is.not.empty( _data[ moldy.__key ] ) && /get/.test( _method ),
		isDirty = moldy.$isDirty();

	moldy.middleware( function ( _error, _response ) {
		var args = Array.prototype.slice.call( arguments ),
			error = _error === moldy ? null : args.shift(),
			response = args.shift();

		if ( error && !( error instanceof Error ) ) {
			error = new Error( 'An unknown error occurred' );
		}

		if ( !error && isDirty && is.object( response ) && ( responseShouldContainAnId && !hasKey( response, moldy.__key ) ) ) {
			error = new Error( 'The response from the server did not contain a valid `' + moldy.__key + '`' );
		}

		if ( !error && isDirty && is.object( response ) ) {
			moldy[ moldy.__key ] = response[ moldy.__key ];
		}

		if ( !error ) {
			if ( is.array( response ) ) {
				response.forEach( function ( _data ) {
					items.push( moldy.$clone( _data ) );
				} );
				moldy = items;
			} else {
				moldy.$data( response );
			}
		}

		_callback && _callback( error, moldy );

	}, _moldy, _data, _method, _url );

};
},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[18])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHBkZVxcRHJvcGJveFxcc3JjXFxtb2xkeVxcbW9sZHlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9ub2RlX21vZHVsZXMvc2MtY29udGFpbnMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaGFza2V5L25vZGVfbW9kdWxlcy90eXBlLWNvbXBvbmVudC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZW1wdHkuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZ3VpZC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvdHlwZS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvdHlwZS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLXVzZWlmeS9jb25maWcuanNvbiIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtdXNlaWZ5L2luZGV4LmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9zcmMvZmFrZV9kMzExNjQwMy5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9zcmMvaGVscGVycy9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9zcmMvbW9sZHkuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL3JlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuLyoqXHJcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuIiwidmFyIGNvbnRhaW5zID0gcmVxdWlyZSggXCJzYy1jb250YWluc1wiICksXG4gIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICk7XG5cbnZhciBjYXN0ID0gZnVuY3Rpb24gKCBfdmFsdWUsIF9jYXN0VHlwZSwgX2RlZmF1bHQsIF92YWx1ZXMsIF9hZGRpdGlvbmFsUHJvcGVydGllcyApIHtcblxuICB2YXIgcGFyc2VkVmFsdWUsXG4gICAgY2FzdFR5cGUgPSBfY2FzdFR5cGUsXG4gICAgdmFsdWUsXG4gICAgdmFsdWVzID0gaXMuYW4uYXJyYXkoIF92YWx1ZXMgKSA/IF92YWx1ZXMgOiBbXTtcblxuICBzd2l0Y2ggKCB0cnVlICkge1xuICBjYXNlICggL2Zsb2F0fGludGVnZXIvLnRlc3QoIGNhc3RUeXBlICkgKTpcbiAgICBjYXN0VHlwZSA9IFwibnVtYmVyXCI7XG4gICAgYnJlYWs7XG4gIH1cblxuICBpZiAoIGlzLmFbIGNhc3RUeXBlIF0oIF92YWx1ZSApIHx8IGNhc3RUeXBlID09PSAnKicgKSB7XG5cbiAgICB2YWx1ZSA9IF92YWx1ZTtcblxuICB9IGVsc2Uge1xuXG4gICAgc3dpdGNoICggdHJ1ZSApIHtcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYXJyYXlcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKCBfdmFsdWUgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGlzLm5vdC5hbi5hcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgaWYgKCBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IFsgX3ZhbHVlIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJib29sZWFuXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gL14odHJ1ZXwxfHl8eWVzKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gdHJ1ZSA6IHVuZGVmaW5lZDtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgaWYgKCBpcy5ub3QuYS5ib29sZWFuKCB2YWx1ZSApICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSAvXihmYWxzZXwtMXwwfG58bm8pJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyBmYWxzZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gaXMuYS5ib29sZWFuKCB2YWx1ZSApID8gdmFsdWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJkYXRlXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZSggX3ZhbHVlICk7XG4gICAgICAgIHZhbHVlID0gaXNOYU4oIHZhbHVlLmdldFRpbWUoKSApID8gdW5kZWZpbmVkIDogdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcInN0cmluZ1wiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLnVuZGVmaW5lZCggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSBfdmFsdWUudG9TdHJpbmcoKVxuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcIm51bWJlclwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLm5vdC5hLm51bWJlciggdmFsdWUgKSB8fCBpc05hTiggdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgICAgY2FzZSBfY2FzdFR5cGUgPT09IFwiaW50ZWdlclwiOlxuICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoIHZhbHVlICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGNhc3QoIEpTT04ucGFyc2UoIF92YWx1ZSApLCBjYXN0VHlwZSApXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgfVxuXG4gIH1cblxuICBpZiAoIHZhbHVlcy5sZW5ndGggPiAwICYmICFjb250YWlucyggdmFsdWVzLCB2YWx1ZSApICkge1xuICAgIHZhbHVlID0gdmFsdWVzWyAwIF07XG4gIH1cblxuICByZXR1cm4gaXMubm90LnVuZGVmaW5lZCggdmFsdWUgKSA/IHZhbHVlIDogaXMubm90LnVuZGVmaW5lZCggX2RlZmF1bHQgKSA/IF9kZWZhdWx0IDogbnVsbDtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0OyIsInZhciBjb250YWlucyA9IGZ1bmN0aW9uICggZGF0YSwgaXRlbSApIHtcbiAgdmFyIGZvdW5kT25lID0gZmFsc2U7XG5cbiAgaWYgKCBBcnJheS5pc0FycmF5KCBkYXRhICkgKSB7XG5cbiAgICBkYXRhLmZvckVhY2goIGZ1bmN0aW9uICggYXJyYXlJdGVtICkge1xuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgaXRlbSA9PT0gYXJyYXlJdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gZWxzZSBpZiAoIE9iamVjdCggZGF0YSApID09PSBkYXRhICkge1xuXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgZGF0YVsga2V5IF0gPT09IGl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICB9XG4gIHJldHVybiBmb3VuZE9uZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7IiwidmFyIGd1aWRSeCA9IFwiez9bMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17MTJ9fT9cIjtcblxuZXhwb3J0cy5nZW5lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIGd1aWQgPSBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoIC9beHldL2csIGZ1bmN0aW9uICggYyApIHtcbiAgICB2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcbiAgICByZXR1cm4gKCBjID09PSBcInhcIiA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKCAxNiApO1xuICB9ICk7XG4gIHJldHVybiBndWlkO1xufTtcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICggc3RyaW5nICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUngsIFwiZ1wiICksXG4gICAgbWF0Y2hlcyA9ICggdHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIiA/IHN0cmluZyA6IFwiXCIgKS5tYXRjaCggcnggKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG1hdGNoZXMgKSA/IG1hdGNoZXMgOiBbXTtcbn07XG5cbmV4cG9ydHMuaXNWYWxpZCA9IGZ1bmN0aW9uICggZ3VpZCApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4ICk7XG4gIHJldHVybiByeC50ZXN0KCBndWlkICk7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICksXG4gIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIG9iamVjdCA9IHR5cGUoIG9iamVjdCApID09PSBcIm9iamVjdFwiID8gb2JqZWN0IDoge30sIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwiYXJyYXlcIiA/IGtleXMgOiBbXTtcbiAga2V5VHlwZSA9IHR5cGUoIGtleVR5cGUgKSA9PT0gXCJzdHJpbmdcIiA/IGtleVR5cGUgOiBcIlwiO1xuXG4gIHZhciBrZXkgPSBrZXlzLmxlbmd0aCA+IDAgPyBrZXlzLnNoaWZ0KCkgOiBcIlwiLFxuICAgIGtleUV4aXN0cyA9IGhhcy5jYWxsKCBvYmplY3QsIGtleSApIHx8IG9iamVjdFsga2V5IF0gIT09IHZvaWQgMCxcbiAgICBrZXlWYWx1ZSA9IGtleUV4aXN0cyA/IG9iamVjdFsga2V5IF0gOiB1bmRlZmluZWQsXG4gICAga2V5VHlwZUlzQ29ycmVjdCA9IHR5cGUoIGtleVZhbHVlICkgPT09IGtleVR5cGU7XG5cbiAgaWYgKCBrZXlzLmxlbmd0aCA+IDAgJiYga2V5RXhpc3RzICkge1xuICAgIHJldHVybiBoYXNLZXkoIG9iamVjdFsga2V5IF0sIGtleXMsIGtleVR5cGUgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzLmxlbmd0aCA+IDAgfHwga2V5VHlwZSA9PT0gXCJcIiA/IGtleUV4aXN0cyA6IGtleUV4aXN0cyAmJiBrZXlUeXBlSXNDb3JyZWN0O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJzdHJpbmdcIiA/IGtleXMuc3BsaXQoIFwiLlwiICkgOiBbXTtcblxuICByZXR1cm4gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKTtcblxufTsiLCJcbi8qKlxuICogdG9TdHJpbmcgcmVmLlxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogUmV0dXJuIHRoZSB0eXBlIG9mIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCl7XG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOiByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJztcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzogcmV0dXJuICdhcmd1bWVudHMnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi9pc2VzL3R5cGVcIiApLFxuICBpcyA9IHtcbiAgICBhOiB7fSxcbiAgICBhbjoge30sXG4gICAgbm90OiB7XG4gICAgICBhOiB7fSxcbiAgICAgIGFuOiB7fVxuICAgIH1cbiAgfTtcblxudmFyIGlzZXMgPSB7XG4gIFwiYXJndW1lbnRzXCI6IFsgXCJhcmd1bWVudHNcIiwgdHlwZSggXCJhcmd1bWVudHNcIiApIF0sXG4gIFwiYXJyYXlcIjogWyBcImFycmF5XCIsIHR5cGUoIFwiYXJyYXlcIiApIF0sXG4gIFwiYm9vbGVhblwiOiBbIFwiYm9vbGVhblwiLCB0eXBlKCBcImJvb2xlYW5cIiApIF0sXG4gIFwiZGF0ZVwiOiBbIFwiZGF0ZVwiLCB0eXBlKCBcImRhdGVcIiApIF0sXG4gIFwiZnVuY3Rpb25cIjogWyBcImZ1bmN0aW9uXCIsIFwiZnVuY1wiLCBcImZuXCIsIHR5cGUoIFwiZnVuY3Rpb25cIiApIF0sXG4gIFwibnVsbFwiOiBbIFwibnVsbFwiLCB0eXBlKCBcIm51bGxcIiApIF0sXG4gIFwibnVtYmVyXCI6IFsgXCJudW1iZXJcIiwgXCJpbnRlZ2VyXCIsIFwiaW50XCIsIHR5cGUoIFwibnVtYmVyXCIgKSBdLFxuICBcIm9iamVjdFwiOiBbIFwib2JqZWN0XCIsIHR5cGUoIFwib2JqZWN0XCIgKSBdLFxuICBcInJlZ2V4cFwiOiBbIFwicmVnZXhwXCIsIHR5cGUoIFwicmVnZXhwXCIgKSBdLFxuICBcInN0cmluZ1wiOiBbIFwic3RyaW5nXCIsIHR5cGUoIFwic3RyaW5nXCIgKSBdLFxuICBcInVuZGVmaW5lZFwiOiBbIFwidW5kZWZpbmVkXCIsIHR5cGUoIFwidW5kZWZpbmVkXCIgKSBdLFxuICBcImVtcHR5XCI6IFsgXCJlbXB0eVwiLCByZXF1aXJlKCBcIi4vaXNlcy9lbXB0eVwiICkgXSxcbiAgXCJudWxsb3J1bmRlZmluZWRcIjogWyBcIm51bGxPclVuZGVmaW5lZFwiLCBcIm51bGxvcnVuZGVmaW5lZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9udWxsb3J1bmRlZmluZWRcIiApIF0sXG4gIFwiZ3VpZFwiOiBbIFwiZ3VpZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9ndWlkXCIgKSBdXG59XG5cbk9iamVjdC5rZXlzKCBpc2VzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgdmFyIG1ldGhvZHMgPSBpc2VzWyBrZXkgXS5zbGljZSggMCwgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSApLFxuICAgIGZuID0gaXNlc1sga2V5IF1bIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgXTtcblxuICBtZXRob2RzLmZvckVhY2goIGZ1bmN0aW9uICggbWV0aG9kS2V5ICkge1xuICAgIGlzWyBtZXRob2RLZXkgXSA9IGlzLmFbIG1ldGhvZEtleSBdID0gaXMuYW5bIG1ldGhvZEtleSBdID0gZm47XG4gICAgaXMubm90WyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hWyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hblsgbWV0aG9kS2V5IF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApID8gZmFsc2UgOiB0cnVlO1xuICAgIH1cbiAgfSApO1xuXG59ICk7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGlzO1xuZXhwb3J0cy50eXBlID0gdHlwZTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoXCIuLi90eXBlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHZhciBlbXB0eSA9IGZhbHNlO1xuXG4gIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudWxsXCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgZW1wdHkgPSBPYmplY3Qua2V5cyggdmFsdWUgKS5sZW5ndGggPT09IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYm9vbGVhblwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IGZhbHNlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bWJlclwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IC0xO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImFycmF5XCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHJldHVybiBlbXB0eTtcblxufTsiLCJ2YXIgZ3VpZCA9IHJlcXVpcmUoIFwic2MtZ3VpZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGd1aWQuaXNWYWxpZCggdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuXHRyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gdm9pZCAwO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi4vdHlwZVwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfdHlwZSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xuICAgIHJldHVybiB0eXBlKCBfdmFsdWUgKSA9PT0gX3R5cGU7XG4gIH1cbn0iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsICkge1xuICBzd2l0Y2ggKCB0b1N0cmluZy5jYWxsKCB2YWwgKSApIHtcbiAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgIHJldHVybiAnZnVuY3Rpb24nO1xuICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICByZXR1cm4gJ2RhdGUnO1xuICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgIHJldHVybiAncmVnZXhwJztcbiAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzpcbiAgICByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gIGNhc2UgJ1tvYmplY3QgQXJyYXldJzpcbiAgICByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICggdmFsID09PSBudWxsICkgcmV0dXJuICdudWxsJztcbiAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKCB2YWwgPT09IE9iamVjdCggdmFsICkgKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICk7XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBkZWVwID0gdHlwZSggYXJnc1sgMCBdICkgPT09IFwiYm9vbGVhblwiID8gYXJncy5zaGlmdCgpIDogZmFsc2UsXG4gICAgb2JqZWN0cyA9IGFyZ3MsXG4gICAgcmVzdWx0ID0ge307XG5cbiAgb2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiAoIG9iamVjdG4gKSB7XG5cbiAgICBpZiAoIHR5cGUoIG9iamVjdG4gKSAhPT0gXCJvYmplY3RcIiApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyggb2JqZWN0biApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIG9iamVjdG4sIGtleSApICkge1xuICAgICAgICBpZiAoIGRlZXAgJiYgdHlwZSggb2JqZWN0blsga2V5IF0gKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gbWVyZ2UoIGRlZXAsIHt9LCByZXN1bHRbIGtleSBdLCBvYmplY3RuWyBrZXkgXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBvYmplY3RuWyBrZXkgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gKTtcblxuICB9ICk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcImRlZmF1bHRzXCI6IHtcblx0XHRcIm1pZGRsZXdhcmVLZXlcIjogXCJhbGxcIlxuXHR9XG59IiwidmFyIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICksXG4gIGNvbmZpZyA9IHJlcXVpcmUoIFwiLi9jb25maWcuanNvblwiICksXG4gIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIHVzZWlmeUZ1bmN0aW9uID0gZnVuY3Rpb24gKCBmdW5jdGlvbnMsIGtleSwgZm4gKSB7XG4gIGlmICggaXMubm90LmVtcHR5KCBrZXkgKSAmJiBpcy5hLnN0cmluZygga2V5ICkgKSB7XG4gICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIGZ1bmN0aW9uc1sga2V5IF0gKSApIHtcbiAgICAgIGZ1bmN0aW9uc1sga2V5IF0gPSBbXTtcbiAgICB9XG4gICAgaWYgKCBpcy5hLmZ1bmMoIGZuICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdLnB1c2goIGZuICk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbnNbIGtleSBdO1xuICB9XG59XG5cbnZhciBVc2VpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZnVuY3Rpb25zID0ge1xuICAgIGFsbDogW11cbiAgfTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBrZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBjb25maWcuZGVmYXVsdHMubWlkZGxld2FyZUtleSxcbiAgICBmbiA9IGlzLmEuZnVuYyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBub29wO1xuXG4gIHVzZWlmeUZ1bmN0aW9uKCBzZWxmLmZ1bmN0aW9ucywga2V5LCBmbiApO1xufTtcblxuVXNlaWZ5LnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBjdXJyZW50RnVuY3Rpb24gPSAwLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgbWlkZGxld2FyZUtleSA9IGlzLmEuc3RyaW5nKCBhcmdzWyAwIF0gKSAmJiBpcy5hLmZ1bmMoIGFyZ3NbIDEgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIG1pZGRsZXdhcmVLZXkgKTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm4gPSBzZWxmLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdWyBjdXJyZW50RnVuY3Rpb24rKyBdLFxuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKTtcblxuICAgIGlmICggIWZuICkge1xuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYuY29udGV4dCwgYXJncyApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmdzLnB1c2goIG5leHQgKTtcbiAgICAgIGZuLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9XG5cbiAgfTtcblxuICBuZXh0LmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcblxufTtcblxuVXNlaWZ5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICggbWlkZGxld2FyZUtleSApIHtcbiAgaWYgKCBpcy5hLnN0cmluZyggbWlkZGxld2FyZUtleSApICYmIGlzLm5vdC5lbXB0eSggbWlkZGxld2FyZUtleSApICkge1xuICAgIHRoaXMuZnVuY3Rpb25zWyBtaWRkbGV3YXJlS2V5IF0gPSBbXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICAgIGFsbDogW11cbiAgICB9O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX29iamVjdE9yRnVuY3Rpb24gKSB7XG5cbiAgdmFyIHVzZWlmeSA9IG5ldyBVc2VpZnkoKTtcblxuICBpZiAoIGlzLmFuLm9iamVjdCggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBfb2JqZWN0T3JGdW5jdGlvbiwge1xuXG4gICAgICBcInVzZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXNlaWZ5LnVzZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgICAgICByZXR1cm4gX29iamVjdE9yRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwibWlkZGxld2FyZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwidXNlaWZ5XCI6IHtcbiAgICAgICAgdmFsdWU6IHVzZWlmeVxuICAgICAgfVxuXG4gICAgfSApO1xuXG4gICAgdXNlaWZ5LmNvbnRleHQgPSBfb2JqZWN0T3JGdW5jdGlvbjtcblxuICB9IGVsc2UgaWYgKCBpcy5hLmZuKCBfb2JqZWN0T3JGdW5jdGlvbiApICkge1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24ucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB1c2VpZnkuY29udGV4dCA9IHRoaXM7XG4gICAgICB1c2VpZnkubWlkZGxld2FyZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LnVzZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfb2JqZWN0T3JGdW5jdGlvbi51c2VpZnkgPSB1c2VpZnk7XG5cbiAgfVxuXG59OyIsInZhciBPYnNlcnZhYmxlQXJyYXkgPSBmdW5jdGlvbiAoIF9hcnJheSApIHtcblx0dmFyIGhhbmRsZXJzID0ge30sXG5cdFx0YXJyYXkgPSBBcnJheS5pc0FycmF5KCBfYXJyYXkgKSA/IF9hcnJheSA6IFtdO1xuXG5cdHZhciBwcm94eSA9IGZ1bmN0aW9uICggX21ldGhvZCwgX3ZhbHVlICkge1xuXHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXG5cdFx0aWYgKCBoYW5kbGVyc1sgX21ldGhvZCBdICkge1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJzWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3MgKTtcblx0XHR9XG5cdH07XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCB7XG5cdFx0b246IHtcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiAoIF9ldmVudCwgX2NhbGxiYWNrICkge1xuXHRcdFx0XHRoYW5kbGVyc1sgX2V2ZW50IF0gPSBfY2FsbGJhY2s7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3BvcCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHByb3h5KCAncG9wJywgYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXSApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdfX3BvcCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnc2hpZnQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3NoaWZ0JywgYXJyYXlbIDAgXSApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdfX3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0WyAncHVzaCcsICdyZXZlcnNlJywgJ3Vuc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xuXHRcdHZhciBwcm9wZXJ0aWVzID0ge307XG5cblx0XHRwcm9wZXJ0aWVzWyBfbWV0aG9kIF0gPSB7XG5cdFx0XHR2YWx1ZTogcHJveHkuYmluZCggbnVsbCwgX21ldGhvZCApXG5cdFx0fTtcblxuXHRcdHByb3BlcnRpZXNbICdfXycgKyBfbWV0aG9kIF0gPSB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG5cdFx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGVbIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggYXJyYXksIHByb3BlcnRpZXMgKTtcblx0fSApO1xuXG5cdHJldHVybiBhcnJheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2YWJsZUFycmF5OyIsInZhciB1c2VpZnkgPSByZXF1aXJlKCAnc2MtdXNlaWZ5JyApLFxyXG4gICAgZGVmYXVsdENvbmZpZ3VyYXRpb24gPSB7XHJcbiAgICAgIGJhc2VVcmw6ICcnLFxyXG4gICAgICBoZWFkZXJzOiB7fVxyXG4gICAgfSxcclxuICAgIE1vbGR5ID0gcmVxdWlyZSggJy4vbW9sZHknICkoIGRlZmF1bHRDb25maWd1cmF0aW9uICk7XHJcblxyXG52YXIgbW9sZHlBUEkgPSB7XHJcbiAgY3JlYXRlOiBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcclxuICAgIHJldHVybiBuZXcgTW9sZHkoIF9uYW1lLCBfcHJvcGVydGllcyApO1xyXG4gIH1cclxufTtcclxuXHJcbnVzZWlmeSggbW9sZHlBUEkgKTtcclxuXHJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG1vbGR5QVBJO1xyXG5cclxuZXhwb3J0cy5kZWZhdWx0cyA9IGRlZmF1bHRDb25maWd1cmF0aW9uXHJcbi8qKlxyXG4gKiBFeHBvc2UgYnVpbHQgaW4gbWlkZGxld2FyZVxyXG4gKi9cclxuLy8gZXhwb3J0cy5zY2hlbWEgPSByZXF1aXJlKCAnLi9taWRkbGV3YXJlL3NjaGVtYS5taWRkbGV3YXJlJyApO1xyXG4vLyBleHBvcnRzLmFqYXggPSByZXF1aXJlKCAnLi9taWRkbGV3YXJlL2FqYXgubWlkZGxld2FyZScgKTsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXHJcblx0Y2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxyXG5cdG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApO1xyXG5cclxuZXhwb3J0cy5hdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCBfa2V5LCBfdmFsdWUgKSB7XHJcblx0dmFyIHZhbHVlO1xyXG5cclxuXHRpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcclxuXHRcdHZhbHVlID0ge1xyXG5cdFx0XHR0eXBlOiBfdmFsdWVcclxuXHRcdH07XHJcblx0fSBlbHNlIGlmICggaXMuYW4ub2JqZWN0KCBfdmFsdWUgKSAmJiBfdmFsdWVbICdfX21vbGR5JyBdID09PSB0cnVlICkge1xyXG5cdFx0dmFsdWUgPSB7XHJcblx0XHRcdHR5cGU6ICdtb2xkeScsXHJcblx0XHRcdGRlZmF1bHQ6IF92YWx1ZVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHR2YWx1ZSA9IF92YWx1ZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXJnZSgge1xyXG5cdFx0bmFtZTogX2tleSB8fCAnJyxcclxuXHRcdHR5cGU6ICcnLFxyXG5cdFx0ZGVmYXVsdDogbnVsbCxcclxuXHRcdG9wdGlvbmFsOiBmYWxzZVxyXG5cdH0sIHZhbHVlICk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fX2RhdGFbIF9rZXkgXTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLmRlc3Ryb3llZEVycm9yID0gZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcblx0dmFyIGl0ZW0gPSB0eXBlb2YgX21vbGR5ID09PSAnb2JqZWN0JyA/IF9tb2xkeSA6IHt9O1xyXG5cdHJldHVybiBuZXcgRXJyb3IoICdUaGUgZ2l2ZW4gbW9sZHkgaXRlbSBgJyArIGl0ZW0uX19uYW1lICsgJ2AgaGFzIGJlZW4gZGVzdHJveWVkJyApO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NlbGYuYnVzeSA9IHRydWU7XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG5cdFx0XHR2YWx1ZSA9IGF0dHJpYnV0ZXMudHlwZSA/IGNhc3QoIF92YWx1ZSwgYXR0cmlidXRlcy50eXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApIDogX3ZhbHVlO1xyXG5cclxuXHRcdGlmICggc2VsZi5fX2RhdGFbIF9rZXkgXSAhPT0gdmFsdWUgKSB7XHJcblx0XHRcdHNlbGYuZW1pdCggJ2NoYW5nZScsIHNlbGYuX19kYXRhWyBfa2V5IF0sIHZhbHVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZhbHVlO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydHMudW5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NlbGYuYnVzeSA9IGZhbHNlO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uICgpIHt9OyIsInZhciBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXHJcbiAgZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxyXG4gIGhlbHBlcnMgPSByZXF1aXJlKCAnLi9oZWxwZXJzJyApLFxyXG4gIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxyXG4gIG9ic2VydmFibGVBcnJheSA9IHJlcXVpcmUoICdzZy1vYnNlcnZhYmxlLWFycmF5JyApLFxyXG4gIHJlcXVlc3QgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApLFxyXG4gIHVzZWlmeSA9IHJlcXVpcmUoICdzYy11c2VpZnknICk7XHJcblxyXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIGRlZmF1bHRDb25maWd1cmF0aW9uICkge1xyXG4gIHZhciBNb2xkeSA9IGZ1bmN0aW9uICggX25hbWUsIF9wcm9wZXJ0aWVzICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBwcm9wZXJ0aWVzID0gaXMuYW4ub2JqZWN0KCBfcHJvcGVydGllcyApID8gX3Byb3BlcnRpZXMgOiB7fTtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggc2VsZiwge1xyXG4gICAgICBfX21vbGR5OiB7XHJcbiAgICAgICAgdmFsdWU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19hdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgdmFsdWU6IHt9LFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fYmFzZVVybDoge1xyXG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAnYmFzZVVybCcgXSwgJ3N0cmluZycsICcnICksXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19kYXRhOiB7XHJcbiAgICAgICAgdmFsdWU6IHt9LFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fZGVzdHJveWVkOiB7XHJcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9faGVhZGVyczoge1xyXG4gICAgICAgIHZhbHVlOiBtZXJnZSgge30sIGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSwgY2FzdCggZGVmYXVsdENvbmZpZ3VyYXRpb24uaGVhZGVycywgJ29iamVjdCcsIHt9ICkgKSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX2tleToge1xyXG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAna2V5JyBdLCAnc3RyaW5nJywgJ2lkJyApIHx8ICdpZCcsXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19rZXlsZXNzOiB7XHJcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNbICdrZXlsZXNzJyBdID09PSB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fbmFtZToge1xyXG4gICAgICAgIHZhbHVlOiBfbmFtZSB8fCBwcm9wZXJ0aWVzWyAnbmFtZScgXSB8fCAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBfX3VybDoge1xyXG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAndXJsJyBdLCAnc3RyaW5nJywgJycgKSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBidXN5OiB7XHJcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0gKTtcclxuXHJcbiAgICBpZiAoICFwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSApIHtcclxuICAgICAgc2VsZi4kcHJvcGVydHkoIHNlbGYuX19rZXkgKTtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3Qua2V5cyggY2FzdCggcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF0sICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gICAgICBzZWxmLiRwcm9wZXJ0eSggX2tleSwgcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF1bIF9rZXkgXSApO1xyXG4gICAgfSApO1xyXG5cclxuICAgIHNlbGYub24oICdwcmVzYXZlJywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcclxuICAgIHNlbGYub24oICdzYXZlJywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xyXG5cclxuICAgIHNlbGYub24oICdwcmVkZXN0cm95JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcclxuICAgIHNlbGYub24oICdkZXN0cm95JywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xyXG5cclxuICAgIHNlbGYub24oICdwcmVnZXQnLCBoZWxwZXJzLnNldEJ1c3koIHNlbGYgKSApO1xyXG4gICAgc2VsZi5vbiggJ2dldCcsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRiYXNlVXJsID0gZnVuY3Rpb24gKCBfYmFzZSApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgdXJsID0gY2FzdCggX2Jhc2UsICdzdHJpbmcnLCBzZWxmLl9fYmFzZVVybCB8fCAnJyApO1xyXG5cclxuICAgIHNlbGYuX19iYXNlVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvKFxcL3xcXHMpKyQvZywgJycgKSB8fCBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsIHx8ICcnO1xyXG5cclxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF9iYXNlICkgPyBzZWxmLl9fYmFzZVVybCA6IHNlbGY7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRjbG9uZSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGRhdGEgPSBpcy5hbi5vYmplY3QoIF9kYXRhICkgPyBfZGF0YSA6IHNlbGYuX19kYXRhLFxyXG4gICAgICBuZXdNb2xkeSA9IG5ldyBNb2xkeSggc2VsZi5fX25hbWUsIHtcclxuICAgICAgICBiYXNlVXJsOiBzZWxmLiRiYXNlVXJsKCksXHJcbiAgICAgICAgaGVhZGVyczogc2VsZi5fX2hlYWRlcnMsXHJcbiAgICAgICAga2V5OiBzZWxmLl9fa2V5LFxyXG4gICAgICAgIGtleWxlc3M6IHNlbGYuX19rZXlsZXNzLFxyXG4gICAgICAgIHVybDogc2VsZi5fX3VybFxyXG4gICAgICB9ICk7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfcHJvcGVydHlLZXkgKSB7XHJcbiAgICAgIG5ld01vbGR5LiRwcm9wZXJ0eSggX3Byb3BlcnR5S2V5LCBtZXJnZSggc2VsZi5fX2F0dHJpYnV0ZXNbIF9wcm9wZXJ0eUtleSBdICkgKTtcclxuICAgICAgaWYgKCBpcy5hbi5hcnJheSggbmV3TW9sZHlbIF9wcm9wZXJ0eUtleSBdICkgJiYgaXMuYW4uYXJyYXkoIGRhdGFbIF9wcm9wZXJ0eUtleSBdICkgKSB7XHJcbiAgICAgICAgZGF0YVsgX3Byb3BlcnR5S2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YUl0ZW0gKSB7XHJcbiAgICAgICAgICBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0ucHVzaCggX2RhdGFJdGVtICk7XHJcbiAgICAgICAgfSApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXSA9IGRhdGFbIF9wcm9wZXJ0eUtleSBdXHJcbiAgICAgIH1cclxuICAgIH0gKTtcclxuXHJcbiAgICByZXR1cm4gbmV3TW9sZHk7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRjb2xsZWN0aW9uID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgdXJsID0gc2VsZi4kdXJsKCksXHJcbiAgICAgIG1ldGhvZCA9ICdnZXQnLFxyXG4gICAgICBxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcclxuICAgICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcbiAgICBzZWxmLmVtaXQoICdwcmVjb2xsZWN0aW9uJywge1xyXG4gICAgICBtb2xkeTogc2VsZixcclxuICAgICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgfSApO1xyXG5cclxuICAgIHJlcXVlc3QoIHNlbGYsIHF1ZXJ5LCBtZXRob2QsIHVybCwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcbiAgICAgIHZhciByZXMgPSBjYXN0KCBfcmVzIGluc3RhbmNlb2YgTW9sZHkgfHwgaXMuYW4uYXJyYXkoIF9yZXMgKSA/IF9yZXMgOiBudWxsLCAnYXJyYXknLCBbXSApO1xyXG4gICAgICBzZWxmLmVtaXQoICdjb2xsZWN0aW9uJywgX2Vycm9yLCByZXMgKTtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgX2Vycm9yLCByZXMgXSApO1xyXG4gICAgfSApO1xyXG5cclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuJGRlc3Ryb3kgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgaXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcclxuICAgICAgZGF0YSA9IHNlbGYuJGpzb24oKSxcclxuICAgICAgdXJsID0gc2VsZi4kdXJsKCkgKyAoIHNlbGYuX19rZXlsZXNzID8gJycgOiAnLycgKyBzZWxmWyBzZWxmLl9fa2V5IF0gKSxcclxuICAgICAgbWV0aG9kID0gJ2RlbGV0ZScsXHJcbiAgICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XHJcbiAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICkgXSApO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuZW1pdCggJ3ByZWRlc3Ryb3knLCB7XHJcbiAgICAgIG1vbGR5OiBzZWxmLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgfSApO1xyXG5cclxuICAgIGlmICggIWlzRGlydHkgKSB7XHJcbiAgICAgIHJlcXVlc3QoIHNlbGYsIGRhdGEsIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi5lbWl0KCAnZGVzdHJveScsIHNlbGYgKTtcclxuICAgICAgICBzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgICAgICBzZWxmWyBzZWxmLl9fa2V5IF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xyXG4gICAgICB9ICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBuZXcgRXJyb3IoICdUaGlzIG1vbGR5IGNhbm5vdCBiZSBkZXN0cm95ZWQgYmVjYXVzZSBpdCBoYXMgbm90IGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciB5ZXQuJyApIF0gKTtcclxuICAgIH1cclxuXHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRkYXRhID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgZGF0YSA9IGlzLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDoge307XHJcblxyXG4gICAgaWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG4gICAgICByZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gICAgICBpZiAoIHNlbGYuX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBfa2V5ICkgKSB7XHJcbiAgICAgICAgaWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgaGFzS2V5KCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLCAnYXJyYXlPZkFUeXBlJywgJ2Jvb2xlYW4nICkgJiYgc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXS5hcnJheU9mQVR5cGUgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcbiAgICAgICAgICAgIHNlbGZbIF9rZXkgXS5wdXNoKCBfbW9sZHkgKTtcclxuICAgICAgICAgIH0gKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCBpcy5hLm9iamVjdCggZGF0YVsgX2tleSBdICkgJiYgc2VsZlsgX2tleSBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XHJcbiAgICAgICAgICBzZWxmWyBfa2V5IF0uJGRhdGEoIGRhdGFbIF9rZXkgXSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgcmV0dXJuIHNlbGY7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRnZXQgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICB1cmwgPSBzZWxmLiR1cmwoKSxcclxuICAgICAgbWV0aG9kID0gJ2dldCcsXHJcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wXHJcbiAgICAgIHdhc0Rlc3Ryb3llZCA9IHNlbGYuX19kZXN0cm95ZWQ7XHJcblxyXG4gICAgc2VsZi5lbWl0KCAncHJlZ2V0Jywge1xyXG4gICAgICBtb2xkeTogc2VsZixcclxuICAgICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgfSApO1xyXG5cclxuICAgIHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcbiAgICByZXF1ZXN0KCBzZWxmLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG4gICAgICB2YXIgcmVzID0gX3JlcyBpbnN0YW5jZW9mIE1vbGR5ID8gX3JlcyA6IG51bGw7XHJcblxyXG4gICAgICBpZiAoIGlzLmFuLmFycmF5KCBfcmVzICkgJiYgX3Jlc1sgMCBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XHJcbiAgICAgICAgc2VsZi4kZGF0YSggX3Jlc1sgMCBdLiRqc29uKCkgKTtcclxuICAgICAgICByZXMgPSBzZWxmO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIF9lcnJvciAmJiB3YXNEZXN0cm95ZWQgKSB7XHJcbiAgICAgICAgc2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuZW1pdCggJ2dldCcsIF9lcnJvciwgcmVzICk7XHJcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIF9lcnJvciwgcmVzIF0gKTtcclxuICAgIH0gKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRoZWFkZXJzID0gZnVuY3Rpb24gKCBfaGVhZGVycyApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XHJcbiAgICAgIHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5fX2hlYWRlcnMgPSBpcy5hbi5vYmplY3QoIF9oZWFkZXJzICkgPyBfaGVhZGVycyA6IHNlbGYuX19oZWFkZXJzO1xyXG4gICAgcmV0dXJuIGlzLm5vdC5hbi5vYmplY3QoIF9oZWFkZXJzICkgPyBzZWxmLl9faGVhZGVycyA6IHNlbGY7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRpc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX19kZXN0cm95ZWQgPyB0cnVlIDogaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19rZXkgXSApO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAoIHRoaXMuX19kZXN0cm95ZWQgKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGlzVmFsaWQgPSB0cnVlO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKCBzZWxmLl9fYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHJcbiAgICAgIGlmICggc2VsZi4kaXNEaXJ0eSgpICYmIF9rZXkgPT09IHNlbGYuX19rZXkgKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdmFsdWUgPSBzZWxmWyBfa2V5IF0sXHJcbiAgICAgICAgYXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXHJcbiAgICAgICAgdHlwZSA9IGF0dHJpYnV0ZXMudHlwZSxcclxuICAgICAgICBhcnJheU9mQVR5cGUgPSBoYXNLZXkoIGF0dHJpYnV0ZXMsICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSA/IGF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID09PSB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgaXNSZXF1aXJlZCA9IGF0dHJpYnV0ZXMub3B0aW9uYWwgIT09IHRydWUsXHJcbiAgICAgICAgaXNOdWxsT3JVbmRlZmluZWQgPSBzZWxmLl9fa2V5bGVzcyA/IGZhbHNlIDogYXJyYXlPZkFUeXBlID8gdmFsdWUubGVuZ3RoID09PSAwIDogaXMubnVsbE9yVW5kZWZpbmVkKCB2YWx1ZSApLFxyXG4gICAgICAgIHR5cGVJc1dyb25nID0gaXMubm90LmVtcHR5KCB0eXBlICkgJiYgaXMuYS5zdHJpbmcoIHR5cGUgKSA/IGlzLm5vdC5hWyB0eXBlIF0oIHZhbHVlICkgOiBpc051bGxPclVuZGVmaW5lZDtcclxuXHJcbiAgICAgIGlmICggYXJyYXlPZkFUeXBlICYmIGlzLm5vdC5lbXB0eSggdmFsdWUgKSAmJiB2YWx1ZVsgMCBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XHJcbiAgICAgICAgdmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuICAgICAgICAgIGlmICggaXNWYWxpZCAmJiBfaXRlbS4kaXNWYWxpZCgpID09PSBmYWxzZSApIHtcclxuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBpc1ZhbGlkICYmIGlzUmVxdWlyZWQgJiYgdHlwZUlzV3JvbmcgKSB7XHJcbiAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSApO1xyXG5cclxuICAgIHJldHVybiBpc1ZhbGlkO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kanNvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgZGF0YSA9IHNlbGYuX19kYXRhLFxyXG4gICAgICBqc29uID0ge307XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcbiAgICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGRhdGFbIF9rZXkgXVsgMCBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XHJcbiAgICAgICAganNvblsgX2tleSBdID0gW107XHJcbiAgICAgICAgZGF0YVsgX2tleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX21vbGR5ICkge1xyXG4gICAgICAgICAganNvblsgX2tleSBdLnB1c2goIF9tb2xkeS4kanNvbigpICk7XHJcbiAgICAgICAgfSApO1xyXG4gICAgICB9IGVsc2UgaWYgKCBpcy5ub3QuYW4ub2JqZWN0KCBkYXRhWyBfa2V5IF0gKSApIHtcclxuICAgICAgICBqc29uWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XHJcbiAgICAgIH0gZWxzZSBpZiAoIGRhdGFbIF9rZXkgXSBpbnN0YW5jZW9mIE1vbGR5ICkge1xyXG4gICAgICAgIGpzb25bIF9rZXkgXSA9IGRhdGFbIF9rZXkgXS4kanNvbigpO1xyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgcmV0dXJuIGpzb247XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBhdHRyaWJ1dGVzID0gbmV3IGhlbHBlcnMuYXR0cmlidXRlcyggX2tleSwgX3ZhbHVlICksXHJcbiAgICAgIGV4aXN0aW5nVmFsdWUgPSBzZWxmWyBfa2V5IF0sXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgPSBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlICkgJiYgL21vbGR5Ly50ZXN0KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IGlzLmFuLmFycmF5KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuICAgICAgdmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5U3RyaW5nID0gaXMuYW4uYXJyYXkoIF92YWx1ZSApICYmIGlzLmEuc3RyaW5nKCBfdmFsdWVbIDAgXSApLFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgJiYgaGFzS2V5KCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcclxuICAgICAgdmFsdWVJc0FTdGF0aWNNb2xkeSA9IGhhc0tleSggX3ZhbHVlLCAncHJvcGVydGllcycsICdvYmplY3QnICk7XHJcblxyXG4gICAgaWYgKCAhc2VsZi5oYXNPd25Qcm9wZXJ0eSggX2tleSApIHx8ICFzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xyXG5cclxuICAgICAgaWYgKCB2YWx1ZUlzQW5BcnJheU1vbGR5IHx8IHZhbHVlSXNBbkFycmF5U3RyaW5nICkge1xyXG4gICAgICAgIGF0dHJpYnV0ZXMudHlwZSA9IF92YWx1ZTtcclxuICAgICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IHZhbHVlSXNBbkFycmF5TW9sZHk7XHJcbiAgICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gdmFsdWVJc0FuQXJyYXlTdHJpbmc7XHJcbiAgICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XHJcbiAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0sXHJcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgc2VsZi5fX2RhdGFbIF9rZXkgXSA9IHNlbGZbIF9rZXkgXTtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoIHZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgX2tleSwge1xyXG4gICAgICAgICAgdmFsdWU6IG5ldyBNb2xkeSggX3ZhbHVlLm5hbWUsIF92YWx1ZSApLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICB9ICk7XHJcblxyXG4gICAgICAgIHNlbGYuX19kYXRhWyBfa2V5IF0gPSBzZWxmWyBfa2V5IF07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICkge1xyXG5cclxuICAgICAgICB2YXIgYXJyYXkgPSBvYnNlcnZhYmxlQXJyYXkoIFtdICksXHJcbiAgICAgICAgICBhdHRyaWJ1dGVUeXBlID0gYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nIHx8IGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID8gYXR0cmlidXRlcy50eXBlWyAwIF0gOiAnKic7XHJcblxyXG4gICAgICAgIGF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XHJcbiAgICAgICAgICB2YWx1ZTogYXJyYXksXHJcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSApO1xyXG5cclxuICAgICAgICBzZWxmLl9fZGF0YVsgX2tleSBdID0gc2VsZlsgX2tleSBdO1xyXG5cclxuICAgICAgICBbICdwdXNoJywgJ3Vuc2hpZnQnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xyXG4gICAgICAgICAgYXJyYXkub24oIF9tZXRob2QsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXHJcbiAgICAgICAgICAgICAgdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuICAgICAgICAgICAgICBpZiAoIGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vbGR5ID0gbmV3IE1vbGR5KCBhdHRyaWJ1dGVUeXBlWyAnbmFtZScgXSwgYXR0cmlidXRlVHlwZSApLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhID0gaXMuYW4ub2JqZWN0KCBfaXRlbSApID8gX2l0ZW0gOiBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXTtcclxuICAgICAgICAgICAgICAgIG1vbGR5LiRkYXRhKCBkYXRhICk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCggbW9sZHkgKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goIGNhc3QoIF9pdGVtLCBhdHRyaWJ1dGVUeXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIHZhbHVlcyApO1xyXG4gICAgICAgICAgfSApO1xyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XHJcbiAgICAgICAgICBnZXQ6IGhlbHBlcnMuZ2V0UHJvcGVydHkoIF9rZXkgKSxcclxuICAgICAgICAgIHNldDogaGVscGVycy5zZXRQcm9wZXJ0eSggX2tleSApLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSA9IGF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBleGlzdGluZ1ZhbHVlICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgIHNlbGZbIF9rZXkgXSA9IGV4aXN0aW5nVmFsdWU7XHJcbiAgICB9IGVsc2UgaWYgKCBpcy5lbXB0eSggc2VsZlsgX2tleSBdICkgJiYgYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgJiYgaXMubm90Lm51bGxPclVuZGVmaW5lZCggYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApIHtcclxuICAgICAgc2VsZlsgX2tleSBdID0gYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XHJcbiAgICB9IGVsc2UgaWYgKCBpcy5lbXB0eSggc2VsZlsgX2tleSBdICkgJiYgYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgKSB7XHJcbiAgICAgIGlmICggYXR0cmlidXRlVHlwZUlzQW5BcnJheSB8fCBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ICkge1xyXG4gICAgICAgIHNlbGYuX19kYXRhWyBfa2V5IF0gPSBzZWxmWyBfa2V5IF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5fX2RhdGFbIF9rZXkgXSA9IGlzLmVtcHR5KCBhdHRyaWJ1dGVzLnR5cGUgKSA/IHVuZGVmaW5lZCA6IGNhc3QoIHVuZGVmaW5lZCwgYXR0cmlidXRlcy50eXBlICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VsZjtcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuJHNhdmUgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgZXJyb3IgPSBudWxsLFxyXG4gICAgICBpc0RpcnR5ID0gc2VsZi4kaXNEaXJ0eSgpLFxyXG4gICAgICBkYXRhID0gc2VsZi4kanNvbigpLFxyXG4gICAgICB1cmwgPSBzZWxmLiR1cmwoKSArICggIWlzRGlydHkgJiYgIXNlbGYuX19rZXlsZXNzID8gJy8nICsgc2VsZlsgc2VsZi5fX2tleSBdIDogJycgKSxcclxuICAgICAgbWV0aG9kID0gaXNEaXJ0eSA/ICdwb3N0JyA6ICdwdXQnLFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XHJcblxyXG4gICAgc2VsZi5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuICAgIHNlbGYuZW1pdCggJ3ByZXNhdmUnLCB7XHJcbiAgICAgIG1vbGR5OiBzZWxmLFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgfSApO1xyXG5cclxuICAgIHJlcXVlc3QoIHNlbGYsIGRhdGEsIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuICAgICAgc2VsZi5lbWl0KCAnc2F2ZScsIF9lcnJvciwgX3JlcyApO1xyXG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XHJcbiAgICB9ICk7XHJcblxyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBiYXNlID0gaXMuZW1wdHkoIHNlbGYuJGJhc2VVcmwoKSApID8gJycgOiBzZWxmLiRiYXNlVXJsKCksXHJcbiAgICAgIG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcclxuICAgICAgdXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxyXG4gICAgICBlbmRwb2ludCA9IGJhc2UgKyBuYW1lICsgKCBpcy5lbXB0eSggdXJsICkgPyAnJyA6ICcvJyArIHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApICk7XHJcblxyXG4gICAgc2VsZi5fX3VybCA9IHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApO1xyXG5cclxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcclxuICB9O1xyXG5cclxuICBlbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcclxuICB1c2VpZnkoIE1vbGR5ICk7XHJcblxyXG4gIHJldHVybiBNb2xkeTtcclxufTsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXHJcblx0Y2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxyXG5cdGhhc0tleSA9IHJlcXVpcmUoICdzYy1oYXNrZXknICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX21vbGR5LCBfZGF0YSwgX21ldGhvZCwgX3VybCwgX2NhbGxiYWNrICkge1xyXG5cdHZhciBtb2xkeSA9IF9tb2xkeSxcclxuXHRcdGl0ZW1zID0gW10sXHJcblx0XHRyZXNwb25zZVNob3VsZENvbnRhaW5BbklkID0gaGFzS2V5KCBfZGF0YSwgbW9sZHkuX19rZXkgKSAmJiBpcy5ub3QuZW1wdHkoIF9kYXRhWyBtb2xkeS5fX2tleSBdICkgJiYgL2dldC8udGVzdCggX21ldGhvZCApLFxyXG5cdFx0aXNEaXJ0eSA9IG1vbGR5LiRpc0RpcnR5KCk7XHJcblxyXG5cdG1vbGR5Lm1pZGRsZXdhcmUoIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzcG9uc2UgKSB7XHJcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcclxuXHRcdFx0ZXJyb3IgPSBfZXJyb3IgPT09IG1vbGR5ID8gbnVsbCA6IGFyZ3Muc2hpZnQoKSxcclxuXHRcdFx0cmVzcG9uc2UgPSBhcmdzLnNoaWZ0KCk7XHJcblxyXG5cdFx0aWYgKCBlcnJvciAmJiAhKCBlcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XHJcblx0XHRcdGVycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFlcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSAmJiAoIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgJiYgIWhhc0tleSggcmVzcG9uc2UsIG1vbGR5Ll9fa2V5ICkgKSApIHtcclxuXHRcdFx0ZXJyb3IgPSBuZXcgRXJyb3IoICdUaGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGRpZCBub3QgY29udGFpbiBhIHZhbGlkIGAnICsgbW9sZHkuX19rZXkgKyAnYCcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFlcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSApIHtcclxuXHRcdFx0bW9sZHlbIG1vbGR5Ll9fa2V5IF0gPSByZXNwb25zZVsgbW9sZHkuX19rZXkgXTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFlcnJvciApIHtcclxuXHRcdFx0aWYgKCBpcy5hcnJheSggcmVzcG9uc2UgKSApIHtcclxuXHRcdFx0XHRyZXNwb25zZS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9kYXRhICkge1xyXG5cdFx0XHRcdFx0aXRlbXMucHVzaCggbW9sZHkuJGNsb25lKCBfZGF0YSApICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdG1vbGR5ID0gaXRlbXM7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bW9sZHkuJGRhdGEoIHJlc3BvbnNlICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRfY2FsbGJhY2sgJiYgX2NhbGxiYWNrKCBlcnJvciwgbW9sZHkgKTtcclxuXHJcblx0fSwgX21vbGR5LCBfZGF0YSwgX21ldGhvZCwgX3VybCApO1xyXG5cclxufTsiXX0=
(18)
});
