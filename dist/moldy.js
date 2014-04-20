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
module.exports={
	"defaults": {
		"baseUrl": "",
		"headers": {}
	}
}
},{}],19:[function(_dereq_,module,exports){
var config = _dereq_( './config.json' ),
	moldyApi = {},
	useify = _dereq_( 'sc-useify' );

useify( moldyApi );

var Moldy = _dereq_( './moldy' )( config.defaults, moldyApi.middleware );

moldyApi.create = function ( _name, _properties ) {
	return new Moldy( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;
},{"./config.json":18,"./moldy":21,"sc-useify":16}],20:[function(_dereq_,module,exports){
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
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],21:[function(_dereq_,module,exports){
var cast = _dereq_( 'sc-cast' ),
  emitter = _dereq_( 'emitter-component' ),
  hasKey = _dereq_( 'sc-haskey' ),
  helpers = _dereq_( './helpers' ),
  is = _dereq_( 'sc-is' ),
  merge = _dereq_( 'sc-merge' ),
  observableArray = _dereq_( 'sg-observable-array' ),
  request = _dereq_( './request' ),
  useify = _dereq_( 'sc-useify' );

exports = module.exports = function ( defaultConfiguration, defaultMiddleware ) {


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

  Moldy.prototype.__defaultMiddleware = defaultMiddleware;

  Moldy.prototype.$baseUrl = function ( _base ) {
    var self = this,
      url = cast( _base, 'string', self.__baseUrl || '' );

    self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || defaultConfiguration.baseUrl || '';

    return is.not.a.string( _base ) ? self.__baseUrl : self;
};

Moldy.prototype.$clear = function () {
	var self = this;

	Object.keys( self.__attributes ).forEach( function ( _key ) {
		if ( hasKey( self[ _key ], '__moldy', 'boolean' ) && self[ _key ].__moldy === true ) {
			self[ _key ].$clear();
		} else if ( self.__attributes[ _key ].arrayOfAType ) {
			while ( self[ _key ].length > 0 ) {
				self[ _key ].shift();
			}
		} else {
			self[ _key ] = self.__data[ _key ] = void 0;
		}
	} );
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
		request( self, data, method, url, function ( _error, _res ) {
			self.emit( 'destroy', _error, _res );
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
		} else {
			json[ _key ] = data[ _key ] instanceof Moldy ? data[ _key ].$json() : data[ _key ];
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

},{"./helpers":20,"./request":22,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sc-useify":16,"sg-observable-array":17}],22:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
  cast = _dereq_( 'sc-cast' ),
  hasKey = _dereq_( 'sc-haskey' );

module.exports = function ( _moldy, _data, _method, _url, _callback ) {
  var moldy = _moldy,
    items = [],
    responseShouldContainAnId = hasKey( _data, moldy.__key ) && is.not.empty( _data[ moldy.__key ] ) && /get/.test( _method ),
    isDirty = moldy.$isDirty();

  moldy.__defaultMiddleware( function ( _error, _response ) {
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
},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy11c2VpZnkvY29uZmlnLmpzb24iLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy11c2VpZnkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2NvbmZpZy5qc29uIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvZmFrZV9lN2ZkN2RlOS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L3NyYy9tb2xkeS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL3JlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsInZhciBjb250YWlucyA9IHJlcXVpcmUoIFwic2MtY29udGFpbnNcIiApLFxuICBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApO1xuXG52YXIgY2FzdCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfY2FzdFR5cGUsIF9kZWZhdWx0LCBfdmFsdWVzLCBfYWRkaXRpb25hbFByb3BlcnRpZXMgKSB7XG5cbiAgdmFyIHBhcnNlZFZhbHVlLFxuICAgIGNhc3RUeXBlID0gX2Nhc3RUeXBlLFxuICAgIHZhbHVlLFxuICAgIHZhbHVlcyA9IGlzLmFuLmFycmF5KCBfdmFsdWVzICkgPyBfdmFsdWVzIDogW107XG5cbiAgc3dpdGNoICggdHJ1ZSApIHtcbiAgY2FzZSAoIC9mbG9hdHxpbnRlZ2VyLy50ZXN0KCBjYXN0VHlwZSApICk6XG4gICAgY2FzdFR5cGUgPSBcIm51bWJlclwiO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCBpcy5hWyBjYXN0VHlwZSBdKCBfdmFsdWUgKSB8fCBjYXN0VHlwZSA9PT0gJyonICkge1xuXG4gICAgdmFsdWUgPSBfdmFsdWU7XG5cbiAgfSBlbHNlIHtcblxuICAgIHN3aXRjaCAoIHRydWUgKSB7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImFycmF5XCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSggX3ZhbHVlICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBbIF92YWx1ZSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYm9vbGVhblwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IC9eKHRydWV8MXx5fHllcykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IHRydWUgOiB1bmRlZmluZWQ7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGlmICggaXMubm90LmEuYm9vbGVhbiggdmFsdWUgKSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gL14oZmFsc2V8LTF8MHxufG5vKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGlzLmEuYm9vbGVhbiggdmFsdWUgKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiZGF0ZVwiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gbmV3IERhdGUoIF92YWx1ZSApO1xuICAgICAgICB2YWx1ZSA9IGlzTmFOKCB2YWx1ZS5nZXRUaW1lKCkgKSA/IHVuZGVmaW5lZCA6IHZhbHVlO1xuXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJzdHJpbmdcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy51bmRlZmluZWQoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoICggZSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gX3ZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJudW1iZXJcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy5ub3QuYS5udW1iZXIoIHZhbHVlICkgfHwgaXNOYU4oIHZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHN3aXRjaCAoIHRydWUgKSB7XG4gICAgICAgIGNhc2UgX2Nhc3RUeXBlID09PSBcImludGVnZXJcIjpcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCB2YWx1ZSApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBjYXN0KCBKU09OLnBhcnNlKCBfdmFsdWUgKSwgY2FzdFR5cGUgKVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIH1cblxuICB9XG5cbiAgaWYgKCB2YWx1ZXMubGVuZ3RoID4gMCAmJiAhY29udGFpbnMoIHZhbHVlcywgdmFsdWUgKSApIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1sgMCBdO1xuICB9XG5cbiAgcmV0dXJuIGlzLm5vdC51bmRlZmluZWQoIHZhbHVlICkgPyB2YWx1ZSA6IGlzLm5vdC51bmRlZmluZWQoIF9kZWZhdWx0ICkgPyBfZGVmYXVsdCA6IG51bGw7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdDsiLCJ2YXIgY29udGFpbnMgPSBmdW5jdGlvbiAoIGRhdGEsIGl0ZW0gKSB7XG4gIHZhciBmb3VuZE9uZSA9IGZhbHNlO1xuXG4gIGlmICggQXJyYXkuaXNBcnJheSggZGF0YSApICkge1xuXG4gICAgZGF0YS5mb3JFYWNoKCBmdW5jdGlvbiAoIGFycmF5SXRlbSApIHtcbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGl0ZW0gPT09IGFycmF5SXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gKTtcblxuICB9IGVsc2UgaWYgKCBPYmplY3QoIGRhdGEgKSA9PT0gZGF0YSApIHtcblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGRhdGFbIGtleSBdID09PSBpdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgfVxuICByZXR1cm4gZm91bmRPbmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsInZhciBndWlkUnggPSBcIns/WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezR9LVswLTlBLUZhLWZdezEyfX0/XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBndWlkID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKCAvW3h5XS9nLCBmdW5jdGlvbiAoIGMgKSB7XG4gICAgdmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG4gICAgcmV0dXJuICggYyA9PT0gXCJ4XCIgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZyggMTYgKTtcbiAgfSApO1xuICByZXR1cm4gZ3VpZDtcbn07XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAoIHN0cmluZyApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4LCBcImdcIiApLFxuICAgIG1hdGNoZXMgPSAoIHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIgPyBzdHJpbmcgOiBcIlwiICkubWF0Y2goIHJ4ICk7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBtYXRjaGVzICkgPyBtYXRjaGVzIDogW107XG59O1xuXG5leHBvcnRzLmlzVmFsaWQgPSBmdW5jdGlvbiAoIGd1aWQgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCApO1xuICByZXR1cm4gcngudGVzdCggZ3VpZCApO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApLFxuICBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBvYmplY3QgPSB0eXBlKCBvYmplY3QgKSA9PT0gXCJvYmplY3RcIiA/IG9iamVjdCA6IHt9LCBrZXlzID0gdHlwZSgga2V5cyApID09PSBcImFycmF5XCIgPyBrZXlzIDogW107XG4gIGtleVR5cGUgPSB0eXBlKCBrZXlUeXBlICkgPT09IFwic3RyaW5nXCIgPyBrZXlUeXBlIDogXCJcIjtcblxuICB2YXIga2V5ID0ga2V5cy5sZW5ndGggPiAwID8ga2V5cy5zaGlmdCgpIDogXCJcIixcbiAgICBrZXlFeGlzdHMgPSBoYXMuY2FsbCggb2JqZWN0LCBrZXkgKSB8fCBvYmplY3RbIGtleSBdICE9PSB2b2lkIDAsXG4gICAga2V5VmFsdWUgPSBrZXlFeGlzdHMgPyBvYmplY3RbIGtleSBdIDogdW5kZWZpbmVkLFxuICAgIGtleVR5cGVJc0NvcnJlY3QgPSB0eXBlKCBrZXlWYWx1ZSApID09PSBrZXlUeXBlO1xuXG4gIGlmICgga2V5cy5sZW5ndGggPiAwICYmIGtleUV4aXN0cyApIHtcbiAgICByZXR1cm4gaGFzS2V5KCBvYmplY3RbIGtleSBdLCBrZXlzLCBrZXlUeXBlICk7XG4gIH1cblxuICByZXR1cm4ga2V5cy5sZW5ndGggPiAwIHx8IGtleVR5cGUgPT09IFwiXCIgPyBrZXlFeGlzdHMgOiBrZXlFeGlzdHMgJiYga2V5VHlwZUlzQ29ycmVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwic3RyaW5nXCIgPyBrZXlzLnNwbGl0KCBcIi5cIiApIDogW107XG5cbiAgcmV0dXJuIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICk7XG5cbn07IiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59O1xuIiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4vaXNlcy90eXBlXCIgKSxcbiAgaXMgPSB7XG4gICAgYToge30sXG4gICAgYW46IHt9LFxuICAgIG5vdDoge1xuICAgICAgYToge30sXG4gICAgICBhbjoge31cbiAgICB9XG4gIH07XG5cbnZhciBpc2VzID0ge1xuICBcImFyZ3VtZW50c1wiOiBbIFwiYXJndW1lbnRzXCIsIHR5cGUoIFwiYXJndW1lbnRzXCIgKSBdLFxuICBcImFycmF5XCI6IFsgXCJhcnJheVwiLCB0eXBlKCBcImFycmF5XCIgKSBdLFxuICBcImJvb2xlYW5cIjogWyBcImJvb2xlYW5cIiwgdHlwZSggXCJib29sZWFuXCIgKSBdLFxuICBcImRhdGVcIjogWyBcImRhdGVcIiwgdHlwZSggXCJkYXRlXCIgKSBdLFxuICBcImZ1bmN0aW9uXCI6IFsgXCJmdW5jdGlvblwiLCBcImZ1bmNcIiwgXCJmblwiLCB0eXBlKCBcImZ1bmN0aW9uXCIgKSBdLFxuICBcIm51bGxcIjogWyBcIm51bGxcIiwgdHlwZSggXCJudWxsXCIgKSBdLFxuICBcIm51bWJlclwiOiBbIFwibnVtYmVyXCIsIFwiaW50ZWdlclwiLCBcImludFwiLCB0eXBlKCBcIm51bWJlclwiICkgXSxcbiAgXCJvYmplY3RcIjogWyBcIm9iamVjdFwiLCB0eXBlKCBcIm9iamVjdFwiICkgXSxcbiAgXCJyZWdleHBcIjogWyBcInJlZ2V4cFwiLCB0eXBlKCBcInJlZ2V4cFwiICkgXSxcbiAgXCJzdHJpbmdcIjogWyBcInN0cmluZ1wiLCB0eXBlKCBcInN0cmluZ1wiICkgXSxcbiAgXCJ1bmRlZmluZWRcIjogWyBcInVuZGVmaW5lZFwiLCB0eXBlKCBcInVuZGVmaW5lZFwiICkgXSxcbiAgXCJlbXB0eVwiOiBbIFwiZW1wdHlcIiwgcmVxdWlyZSggXCIuL2lzZXMvZW1wdHlcIiApIF0sXG4gIFwibnVsbG9ydW5kZWZpbmVkXCI6IFsgXCJudWxsT3JVbmRlZmluZWRcIiwgXCJudWxsb3J1bmRlZmluZWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvbnVsbG9ydW5kZWZpbmVkXCIgKSBdLFxuICBcImd1aWRcIjogWyBcImd1aWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvZ3VpZFwiICkgXVxufVxuXG5PYmplY3Qua2V5cyggaXNlcyApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gIHZhciBtZXRob2RzID0gaXNlc1sga2V5IF0uc2xpY2UoIDAsIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgKSxcbiAgICBmbiA9IGlzZXNbIGtleSBdWyBpc2VzWyBrZXkgXS5sZW5ndGggLSAxIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiAoIG1ldGhvZEtleSApIHtcbiAgICBpc1sgbWV0aG9kS2V5IF0gPSBpcy5hWyBtZXRob2RLZXkgXSA9IGlzLmFuWyBtZXRob2RLZXkgXSA9IGZuO1xuICAgIGlzLm5vdFsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYVsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYW5bIG1ldGhvZEtleSBdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG4gIH0gKTtcblxufSApO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBpcztcbmV4cG9ydHMudHlwZSA9IHR5cGU7IiwidmFyIHR5cGUgPSByZXF1aXJlKFwiLi4vdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVsbFwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm9iamVjdFwiICkge1xuICAgIGVtcHR5ID0gT2JqZWN0LmtleXMoIHZhbHVlICkubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImJvb2xlYW5cIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSBmYWxzZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudW1iZXJcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAtMTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJhcnJheVwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICByZXR1cm4gZW1wdHk7XG5cbn07IiwidmFyIGd1aWQgPSByZXF1aXJlKCBcInNjLWd1aWRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHJldHVybiBndWlkLmlzVmFsaWQoIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IHZvaWQgMDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4uL3R5cGVcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX3R5cGUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcbiAgICByZXR1cm4gdHlwZSggX3ZhbHVlICkgPT09IF90eXBlO1xuICB9XG59IiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbCApIHtcbiAgc3dpdGNoICggdG9TdHJpbmcuY2FsbCggdmFsICkgKSB7XG4gIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzpcbiAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgcmV0dXJuICdkYXRlJztcbiAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6XG4gICAgcmV0dXJuICdhcmd1bWVudHMnO1xuICBjYXNlICdbb2JqZWN0IEFycmF5XSc6XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAoIHZhbCA9PT0gbnVsbCApIHJldHVybiAnbnVsbCc7XG4gIGlmICggdmFsID09PSB1bmRlZmluZWQgKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICggdmFsID09PSBPYmplY3QoIHZhbCApICkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgZGVlcCA9IHR5cGUoIGFyZ3NbIDAgXSApID09PSBcImJvb2xlYW5cIiA/IGFyZ3Muc2hpZnQoKSA6IGZhbHNlLFxuICAgIG9iamVjdHMgPSBhcmdzLFxuICAgIHJlc3VsdCA9IHt9O1xuXG4gIG9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24gKCBvYmplY3RuICkge1xuXG4gICAgaWYgKCB0eXBlKCBvYmplY3RuICkgIT09IFwib2JqZWN0XCIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIG9iamVjdG4gKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3RuLCBrZXkgKSApIHtcbiAgICAgICAgaWYgKCBkZWVwICYmIHR5cGUoIG9iamVjdG5bIGtleSBdICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG1lcmdlKCBkZWVwLCB7fSwgcmVzdWx0WyBrZXkgXSwgb2JqZWN0blsga2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gb2JqZWN0blsga2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlOyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJkZWZhdWx0c1wiOiB7XG5cdFx0XCJtaWRkbGV3YXJlS2V5XCI6IFwiYWxsXCJcblx0fVxufSIsInZhciBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApLFxuICBjb25maWcgPSByZXF1aXJlKCBcIi4vY29uZmlnLmpzb25cIiApLFxuICBub29wID0gZnVuY3Rpb24gKCkge307XG5cbnZhciB1c2VpZnlGdW5jdGlvbiA9IGZ1bmN0aW9uICggZnVuY3Rpb25zLCBrZXksIGZuICkge1xuICBpZiAoIGlzLm5vdC5lbXB0eSgga2V5ICkgJiYgaXMuYS5zdHJpbmcoIGtleSApICkge1xuICAgIGlmICggaXMubm90LmFuLmFycmF5KCBmdW5jdGlvbnNbIGtleSBdICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdID0gW107XG4gICAgfVxuICAgIGlmICggaXMuYS5mdW5jKCBmbiApICkge1xuICAgICAgZnVuY3Rpb25zWyBrZXkgXS5wdXNoKCBmbiApO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb25zWyBrZXkgXTtcbiAgfVxufVxuXG52YXIgVXNlaWZ5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICBhbGw6IFtdXG4gIH07XG59O1xuXG5Vc2VpZnkucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAga2V5ID0gaXMuYS5zdHJpbmcoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgZm4gPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIGtleSwgZm4gKTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgY3VycmVudEZ1bmN0aW9uID0gMCxcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIG1pZGRsZXdhcmVLZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgJiYgaXMuYS5mdW5jKCBhcmdzWyAxIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IGNvbmZpZy5kZWZhdWx0cy5taWRkbGV3YXJlS2V5LFxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBhcmdzWyAwIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IG5vb3A7XG5cbiAgdXNlaWZ5RnVuY3Rpb24oIHNlbGYuZnVuY3Rpb25zLCBtaWRkbGV3YXJlS2V5ICk7XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZuID0gc2VsZi5mdW5jdGlvbnNbIG1pZGRsZXdhcmVLZXkgXVsgY3VycmVudEZ1bmN0aW9uKysgXSxcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICk7XG5cbiAgICBpZiAoICFmbiApIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKCBuZXh0ICk7XG4gICAgICBmbi5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG4gICAgfVxuXG4gIH07XG5cbiAgbmV4dC5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG5cbn07XG5cblVzZWlmeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoIG1pZGRsZXdhcmVLZXkgKSB7XG4gIGlmICggaXMuYS5zdHJpbmcoIG1pZGRsZXdhcmVLZXkgKSAmJiBpcy5ub3QuZW1wdHkoIG1pZGRsZXdhcmVLZXkgKSApIHtcbiAgICB0aGlzLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdID0gW107XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5mdW5jdGlvbnMgPSB7XG4gICAgICBhbGw6IFtdXG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF9vYmplY3RPckZ1bmN0aW9uICkge1xuXG4gIHZhciB1c2VpZnkgPSBuZXcgVXNlaWZ5KCk7XG5cbiAgaWYgKCBpcy5hbi5vYmplY3QoIF9vYmplY3RPckZ1bmN0aW9uICkgKSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggX29iamVjdE9yRnVuY3Rpb24sIHtcblxuICAgICAgXCJ1c2VcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgICAgcmV0dXJuIF9vYmplY3RPckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcIm1pZGRsZXdhcmVcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS5taWRkbGV3YXJlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcInVzZWlmeVwiOiB7XG4gICAgICAgIHZhbHVlOiB1c2VpZnlcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICAgIHVzZWlmeS5jb250ZXh0ID0gX29iamVjdE9yRnVuY3Rpb247XG5cbiAgfSBlbHNlIGlmICggaXMuYS5mbiggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LmNvbnRleHQgPSB0aGlzO1xuICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgfTtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlaWZ5ID0gdXNlaWZ5O1xuXG4gIH1cblxufTsiLCJ2YXIgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKCBfYXJyYXkgKSB7XG5cdHZhciBoYW5kbGVycyA9IHt9LFxuXHRcdGFycmF5ID0gQXJyYXkuaXNBcnJheSggX2FycmF5ICkgPyBfYXJyYXkgOiBbXTtcblxuXHR2YXIgcHJveHkgPSBmdW5jdGlvbiAoIF9tZXRob2QsIF92YWx1ZSApIHtcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblxuXHRcdGlmICggaGFuZGxlcnNbIF9tZXRob2QgXSApIHtcblx0XHRcdHJldHVybiBoYW5kbGVyc1sgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fVxuXHR9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwge1xuXHRcdG9uOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfZXZlbnQsIF9jYWxsYmFjayApIHtcblx0XHRcdFx0aGFuZGxlcnNbIF9ldmVudCBdID0gX2NhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdwb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3BvcCcsIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19wb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdzaGlmdCcsIGFycmF5WyAwIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19zaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdFsgJ3B1c2gnLCAncmV2ZXJzZScsICd1bnNoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IHt9O1xuXG5cdFx0cHJvcGVydGllc1sgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IHByb3h5LmJpbmQoIG51bGwsIF9tZXRob2QgKVxuXHRcdH07XG5cblx0XHRwcm9wZXJ0aWVzWyAnX18nICsgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCBwcm9wZXJ0aWVzICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmFibGVBcnJheTsiLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiZGVmYXVsdHNcIjoge1xuXHRcdFwiYmFzZVVybFwiOiBcIlwiLFxuXHRcdFwiaGVhZGVyc1wiOiB7fVxuXHR9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoICcuL2NvbmZpZy5qc29uJyApLFxuXHRtb2xkeUFwaSA9IHt9LFxuXHR1c2VpZnkgPSByZXF1aXJlKCAnc2MtdXNlaWZ5JyApO1xuXG51c2VpZnkoIG1vbGR5QXBpICk7XG5cbnZhciBNb2xkeSA9IHJlcXVpcmUoICcuL21vbGR5JyApKCBjb25maWcuZGVmYXVsdHMsIG1vbGR5QXBpLm1pZGRsZXdhcmUgKTtcblxubW9sZHlBcGkuY3JlYXRlID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XG5cdHJldHVybiBuZXcgTW9sZHkoIF9uYW1lLCBfcHJvcGVydGllcyApO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbW9sZHlBcGk7XG5leHBvcnRzLmRlZmF1bHRzID0gY29uZmlnLmRlZmF1bHRzOyIsInZhciBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcblx0Y2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuXHRtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKTtcblxuZXhwb3J0cy5hdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCBfa2V5LCBfdmFsdWUgKSB7XG5cdHZhciB2YWx1ZTtcblxuXHRpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHtcblx0XHRcdHR5cGU6IF92YWx1ZVxuXHRcdH07XG5cdH0gZWxzZSBpZiAoIGlzLmFuLm9iamVjdCggX3ZhbHVlICkgJiYgX3ZhbHVlWyAnX19tb2xkeScgXSA9PT0gdHJ1ZSApIHtcblx0XHR2YWx1ZSA9IHtcblx0XHRcdHR5cGU6ICdtb2xkeScsXG5cdFx0XHRkZWZhdWx0OiBfdmFsdWVcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0dmFsdWUgPSBfdmFsdWU7XG5cdH1cblxuXHRyZXR1cm4gbWVyZ2UoIHtcblx0XHRuYW1lOiBfa2V5IHx8ICcnLFxuXHRcdHR5cGU6ICcnLFxuXHRcdGRlZmF1bHQ6IG51bGwsXG5cdFx0b3B0aW9uYWw6IGZhbHNlXG5cdH0sIHZhbHVlICk7XG59O1xuXG5leHBvcnRzLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9fZGF0YVsgX2tleSBdO1xuXHR9XG59O1xuXG5leHBvcnRzLmRlc3Ryb3llZEVycm9yID0gZnVuY3Rpb24gKCBfbW9sZHkgKSB7XG5cdHZhciBpdGVtID0gdHlwZW9mIF9tb2xkeSA9PT0gJ29iamVjdCcgPyBfbW9sZHkgOiB7fTtcblx0cmV0dXJuIG5ldyBFcnJvciggJ1RoZSBnaXZlbiBtb2xkeSBpdGVtIGAnICsgaXRlbS5fX25hbWUgKyAnYCBoYXMgYmVlbiBkZXN0cm95ZWQnICk7XG59O1xuXG5leHBvcnRzLnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdF9zZWxmLmJ1c3kgPSB0cnVlO1xuXHR9XG59O1xuXG5leHBvcnRzLnNldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0YXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXG5cdFx0XHR2YWx1ZSA9IGF0dHJpYnV0ZXMudHlwZSA/IGNhc3QoIF92YWx1ZSwgYXR0cmlidXRlcy50eXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApIDogX3ZhbHVlO1xuXG5cdFx0aWYgKCBzZWxmLl9fZGF0YVsgX2tleSBdICE9PSB2YWx1ZSApIHtcblx0XHRcdHNlbGYuZW1pdCggJ2NoYW5nZScsIHNlbGYuX19kYXRhWyBfa2V5IF0sIHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0c2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZhbHVlO1xuXHR9XG59O1xuXG5leHBvcnRzLnVuc2V0QnVzeSA9IGZ1bmN0aW9uICggX3NlbGYgKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0X3NlbGYuYnVzeSA9IGZhbHNlO1xuXHR9XG59O1xuXG5leHBvcnRzLm5vb3AgPSBmdW5jdGlvbiAoKSB7fTsiLCJ2YXIgY2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuICBlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxuICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxuICBoZWxwZXJzID0gcmVxdWlyZSggJy4vaGVscGVycycgKSxcbiAgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxuICBvYnNlcnZhYmxlQXJyYXkgPSByZXF1aXJlKCAnc2ctb2JzZXJ2YWJsZS1hcnJheScgKSxcbiAgcmVxdWVzdCA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXG4gIHVzZWlmeSA9IHJlcXVpcmUoICdzYy11c2VpZnknICk7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggZGVmYXVsdENvbmZpZ3VyYXRpb24sIGRlZmF1bHRNaWRkbGV3YXJlICkge1xuXG5cbiAgdmFyIE1vbGR5ID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgcHJvcGVydGllcyA9IGlzLmFuLm9iamVjdCggX3Byb3BlcnRpZXMgKSA/IF9wcm9wZXJ0aWVzIDoge307XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggc2VsZiwge1xuICAgICAgX19tb2xkeToge1xuICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIF9fYXR0cmlidXRlczoge1xuICAgICAgICB2YWx1ZToge30sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgX19iYXNlVXJsOiB7XG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAnYmFzZVVybCcgXSwgJ3N0cmluZycsICcnICksXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgX19kYXRhOiB7XG4gICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBfX2Rlc3Ryb3llZDoge1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgX19oZWFkZXJzOiB7XG4gICAgICAgIHZhbHVlOiBtZXJnZSgge30sIGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSwgY2FzdCggZGVmYXVsdENvbmZpZ3VyYXRpb24uaGVhZGVycywgJ29iamVjdCcsIHt9ICkgKSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBfX2tleToge1xuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIF9fa2V5bGVzczoge1xuICAgICAgICB2YWx1ZTogcHJvcGVydGllc1sgJ2tleWxlc3MnIF0gPT09IHRydWVcbiAgICAgIH0sXG4gICAgICBfX25hbWU6IHtcbiAgICAgICAgdmFsdWU6IF9uYW1lIHx8IHByb3BlcnRpZXNbICduYW1lJyBdIHx8ICcnXG4gICAgICB9LFxuICAgICAgX191cmw6IHtcbiAgICAgICAgdmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICd1cmwnIF0sICdzdHJpbmcnLCAnJyApLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGJ1c3k6IHtcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0gKTtcblxuICAgIGlmICggIXByb3BlcnRpZXNbICdrZXlsZXNzJyBdICkge1xuICAgICAgc2VsZi4kcHJvcGVydHkoIHNlbGYuX19rZXkgKTtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyggY2FzdCggcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF0sICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuICAgICAgc2VsZi4kcHJvcGVydHkoIF9rZXksIHByb3BlcnRpZXNbICdwcm9wZXJ0aWVzJyBdWyBfa2V5IF0gKTtcbiAgICB9ICk7XG5cbiAgICBzZWxmLm9uKCAncHJlc2F2ZScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XG4gICAgc2VsZi5vbiggJ3NhdmUnLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XG5cbiAgICBzZWxmLm9uKCAncHJlZGVzdHJveScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XG4gICAgc2VsZi5vbiggJ2Rlc3Ryb3knLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XG5cbiAgICBzZWxmLm9uKCAncHJlZ2V0JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcbiAgICBzZWxmLm9uKCAnZ2V0JywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xuXG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLl9fZGVmYXVsdE1pZGRsZXdhcmUgPSBkZWZhdWx0TWlkZGxld2FyZTtcblxuICBNb2xkeS5wcm90b3R5cGUuJGJhc2VVcmwgPSBmdW5jdGlvbiAoIF9iYXNlICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIHVybCA9IGNhc3QoIF9iYXNlLCAnc3RyaW5nJywgc2VsZi5fX2Jhc2VVcmwgfHwgJycgKTtcblxuICAgIHNlbGYuX19iYXNlVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvKFxcL3xcXHMpKyQvZywgJycgKSB8fCBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsIHx8ICcnO1xuXG4gICAgcmV0dXJuIGlzLm5vdC5hLnN0cmluZyggX2Jhc2UgKSA/IHNlbGYuX19iYXNlVXJsIDogc2VsZjtcbn07XG5cbk1vbGR5LnByb3RvdHlwZS4kY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzZWxmID0gdGhpcztcblxuXHRPYmplY3Qua2V5cyggc2VsZi5fX2F0dHJpYnV0ZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cdFx0aWYgKCBoYXNLZXkoIHNlbGZbIF9rZXkgXSwgJ19fbW9sZHknLCAnYm9vbGVhbicgKSAmJiBzZWxmWyBfa2V5IF0uX19tb2xkeSA9PT0gdHJ1ZSApIHtcblx0XHRcdHNlbGZbIF9rZXkgXS4kY2xlYXIoKTtcblx0XHR9IGVsc2UgaWYgKCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSApIHtcblx0XHRcdHdoaWxlICggc2VsZlsgX2tleSBdLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdHNlbGZbIF9rZXkgXS5zaGlmdCgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWxmWyBfa2V5IF0gPSBzZWxmLl9fZGF0YVsgX2tleSBdID0gdm9pZCAwO1xuXHRcdH1cblx0fSApO1xuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS4kY2xvbmUgPSBmdW5jdGlvbiAoIF9kYXRhICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIGRhdGEgPSBpcy5hbi5vYmplY3QoIF9kYXRhICkgPyBfZGF0YSA6IHNlbGYuX19kYXRhLFxuICAgICAgbmV3TW9sZHkgPSBuZXcgTW9sZHkoIHNlbGYuX19uYW1lLCB7XG4gICAgICAgIGJhc2VVcmw6IHNlbGYuJGJhc2VVcmwoKSxcbiAgICAgICAgaGVhZGVyczogc2VsZi5fX2hlYWRlcnMsXG4gICAgICAgIGtleTogc2VsZi5fX2tleSxcbiAgICAgICAga2V5bGVzczogc2VsZi5fX2tleWxlc3MsXG4gICAgICAgIHVybDogc2VsZi5fX3VybFxuICAgICAgfSApO1xuXG4gICAgT2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfcHJvcGVydHlLZXkgKSB7XG4gICAgICBuZXdNb2xkeS4kcHJvcGVydHkoIF9wcm9wZXJ0eUtleSwgbWVyZ2UoIHNlbGYuX19hdHRyaWJ1dGVzWyBfcHJvcGVydHlLZXkgXSApICk7XG4gICAgICBpZiAoIGlzLmFuLmFycmF5KCBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0gKSAmJiBpcy5hbi5hcnJheSggZGF0YVsgX3Byb3BlcnR5S2V5IF0gKSApIHtcbiAgICAgICAgZGF0YVsgX3Byb3BlcnR5S2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YUl0ZW0gKSB7XG4gICAgICAgICAgbmV3TW9sZHlbIF9wcm9wZXJ0eUtleSBdLnB1c2goIF9kYXRhSXRlbSApO1xuICAgICAgICB9ICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0gPSBkYXRhWyBfcHJvcGVydHlLZXkgXVxuICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiBuZXdNb2xkeTtcbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuJGNvbGxlY3Rpb24gPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIHVybCA9IHNlbGYuJHVybCgpLFxuICAgICAgbWV0aG9kID0gJ2dldCcsXG4gICAgICBxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcbiAgICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfcXVlcnkgKSA/IF9xdWVyeSA6IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cbiAgICBzZWxmLmVtaXQoICdwcmVjb2xsZWN0aW9uJywge1xuICAgICAgbW9sZHk6IHNlbGYsXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSApO1xuXG4gICAgcmVxdWVzdCggc2VsZiwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcbiAgICAgIHZhciByZXMgPSBjYXN0KCBfcmVzIGluc3RhbmNlb2YgTW9sZHkgfHwgaXMuYW4uYXJyYXkoIF9yZXMgKSA/IF9yZXMgOiBudWxsLCAnYXJyYXknLCBbXSApO1xuICAgICAgc2VsZi5lbWl0KCAnY29sbGVjdGlvbicsIF9lcnJvciwgcmVzICk7XG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBfZXJyb3IsIHJlcyBdICk7XG4gICAgfSApO1xuXG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLiRkZXN0cm95ID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgaXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcbiAgICAgIGRhdGEgPSBzZWxmLiRqc29uKCksXG4gICAgICB1cmwgPSBzZWxmLiR1cmwoKSArICggc2VsZi5fX2tleWxlc3MgPyAnJyA6ICcvJyArIHNlbGZbIHNlbGYuX19rZXkgXSApLFxuICAgICAgbWV0aG9kID0gJ2RlbGV0ZScsXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApIF0gKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoICdwcmVkZXN0cm95Jywge1xuICAgICAgbW9sZHk6IHNlbGYsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH0gKTtcblxuICAgIGlmICggIWlzRGlydHkgKSB7XG5cdFx0cmVxdWVzdCggc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuXHRcdFx0c2VsZi5lbWl0KCAnZGVzdHJveScsIF9lcnJvciwgX3JlcyApO1xuICAgICAgICBzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZlsgc2VsZi5fX2tleSBdID0gdW5kZWZpbmVkO1xuICAgICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gICAgICB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIG5ldyBFcnJvciggJ1RoaXMgbW9sZHkgY2Fubm90IGJlIGRlc3Ryb3llZCBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyIHlldC4nICkgXSApO1xuICAgIH1cblxuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS4kZGF0YSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgZGF0YSA9IGlzLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDoge307XG5cbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XG4gICAgICByZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuICAgICAgaWYgKCBzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xuICAgICAgICBpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBoYXNLZXkoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSAmJiBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XG4gICAgICAgICAgICBzZWxmWyBfa2V5IF0ucHVzaCggX21vbGR5ICk7XG4gICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2UgaWYgKCBpcy5hLm9iamVjdCggZGF0YVsgX2tleSBdICkgJiYgc2VsZlsgX2tleSBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XG4gICAgICAgICAgc2VsZlsgX2tleSBdLiRkYXRhKCBkYXRhWyBfa2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuJGdldCA9IGZ1bmN0aW9uICggX3F1ZXJ5LCBfY2FsbGJhY2sgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgdXJsID0gc2VsZi4kdXJsKCksXG4gICAgICBtZXRob2QgPSAnZ2V0JyxcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxuICAgICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcFxuICAgICAgd2FzRGVzdHJveWVkID0gc2VsZi5fX2Rlc3Ryb3llZDtcbiAgICBcbiAgICBzZWxmLmVtaXQoICdwcmVnZXQnLCB7XG4gICAgICBtb2xkeTogc2VsZixcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9ICk7XG5cbiAgICBzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgICByZXF1ZXN0KCBzZWxmLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuICAgICAgdmFyIHJlcyA9IF9yZXMgaW5zdGFuY2VvZiBNb2xkeSA/IF9yZXMgOiBudWxsO1xuXG4gICAgICBpZiAoIGlzLmFuLmFycmF5KCBfcmVzICkgJiYgX3Jlc1sgMCBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XG4gICAgICAgIHNlbGYuJGRhdGEoIF9yZXNbIDAgXS4kanNvbigpICk7XG4gICAgICAgIHJlcyA9IHNlbGY7XG4gICAgICB9XG5cbiAgICAgIGlmICggX2Vycm9yICYmIHdhc0Rlc3Ryb3llZCApIHtcbiAgICAgICAgc2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuZW1pdCggJ2dldCcsIF9lcnJvciwgcmVzICk7XG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBfZXJyb3IsIHJlcyBdICk7XG4gICAgfSApO1xuXG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLiRoZWFkZXJzID0gZnVuY3Rpb24gKCBfaGVhZGVycyApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XG4gICAgICByZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xuICAgIH1cblxuICAgIHNlbGYuX19oZWFkZXJzID0gaXMuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gX2hlYWRlcnMgOiBzZWxmLl9faGVhZGVycztcbiAgICByZXR1cm4gaXMubm90LmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IHNlbGYuX19oZWFkZXJzIDogc2VsZjtcbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuJGlzRGlydHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19kZXN0cm95ZWQgPyB0cnVlIDogaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19rZXkgXSApO1xuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS4kaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICggdGhpcy5fX2Rlc3Ryb3llZCApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBpc1ZhbGlkID0gdHJ1ZTtcblxuICAgIE9iamVjdC5rZXlzKCBzZWxmLl9fYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcblxuICAgICAgaWYgKCBzZWxmLiRpc0RpcnR5KCkgJiYgX2tleSA9PT0gc2VsZi5fX2tleSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsdWUgPSBzZWxmWyBfa2V5IF0sXG4gICAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxuICAgICAgICB0eXBlID0gYXR0cmlidXRlcy50eXBlLFxuICAgICAgICBhcnJheU9mQVR5cGUgPSBoYXNLZXkoIGF0dHJpYnV0ZXMsICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSA/IGF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID09PSB0cnVlIDogZmFsc2UsXG4gICAgICAgIGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsICE9PSB0cnVlLFxuICAgICAgICBpc051bGxPclVuZGVmaW5lZCA9IHNlbGYuX19rZXlsZXNzID8gZmFsc2UgOiBhcnJheU9mQVR5cGUgPyB2YWx1ZS5sZW5ndGggPT09IDAgOiBpcy5udWxsT3JVbmRlZmluZWQoIHZhbHVlICksXG4gICAgICAgIHR5cGVJc1dyb25nID0gaXMubm90LmVtcHR5KCB0eXBlICkgJiYgaXMuYS5zdHJpbmcoIHR5cGUgKSA/IGlzLm5vdC5hWyB0eXBlIF0oIHZhbHVlICkgOiBpc051bGxPclVuZGVmaW5lZDtcblxuICAgICAgaWYgKCBhcnJheU9mQVR5cGUgJiYgaXMubm90LmVtcHR5KCB2YWx1ZSApICYmIHZhbHVlWyAwIF0gaW5zdGFuY2VvZiBNb2xkeSApIHtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcbiAgICAgICAgICBpZiAoIGlzVmFsaWQgJiYgX2l0ZW0uJGlzVmFsaWQoKSA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9ICk7XG4gICAgICB9XG5cbiAgICAgIGlmICggaXNWYWxpZCAmJiBpc1JlcXVpcmVkICYmIHR5cGVJc1dyb25nICkge1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuJGpzb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgZGF0YSA9IHNlbGYuX19kYXRhLFxuICAgICAganNvbiA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG4gICAgICBpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBkYXRhWyBfa2V5IF1bIDAgXSBpbnN0YW5jZW9mIE1vbGR5ICkge1xuICAgICAgICBqc29uWyBfa2V5IF0gPSBbXTtcbiAgICAgICAgZGF0YVsgX2tleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX21vbGR5ICkge1xuICAgICAgICAgIGpzb25bIF9rZXkgXS5wdXNoKCBfbW9sZHkuJGpzb24oKSApO1xuICAgICAgICB9ICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGpzb25bIF9rZXkgXSA9IGRhdGFbIF9rZXkgXSBpbnN0YW5jZW9mIE1vbGR5ID8gZGF0YVsgX2tleSBdLiRqc29uKCkgOiBkYXRhWyBfa2V5IF07XG4gICAgICB9XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIGpzb247XG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIGF0dHJpYnV0ZXMgPSBuZXcgaGVscGVycy5hdHRyaWJ1dGVzKCBfa2V5LCBfdmFsdWUgKSxcbiAgICAgIGV4aXN0aW5nVmFsdWUgPSBzZWxmWyBfa2V5IF0sXG4gICAgICBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ID0gaXMuYS5zdHJpbmcoIGF0dHJpYnV0ZXMudHlwZSApICYmIC9tb2xkeS8udGVzdCggYXR0cmlidXRlcy50eXBlICksXG4gICAgICBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ID0gaXMuYW4uYXJyYXkoIGF0dHJpYnV0ZXMudHlwZSApLFxuICAgICAgdmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXG4gICAgICB2YWx1ZUlzQW5BcnJheVN0cmluZyA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBpcy5hLnN0cmluZyggX3ZhbHVlWyAwIF0gKSxcbiAgICAgIGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID0gYXR0cmlidXRlVHlwZUlzQW5BcnJheSAmJiBoYXNLZXkoIGF0dHJpYnV0ZXMudHlwZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcbiAgICAgIHZhbHVlSXNBU3RhdGljTW9sZHkgPSBoYXNLZXkoIF92YWx1ZSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApO1xuXG4gICAgaWYgKCAhc2VsZi5oYXNPd25Qcm9wZXJ0eSggX2tleSApIHx8ICFzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xuXG4gICAgICBpZiAoIHZhbHVlSXNBbkFycmF5TW9sZHkgfHwgdmFsdWVJc0FuQXJyYXlTdHJpbmcgKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMudHlwZSA9IF92YWx1ZTtcbiAgICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSB2YWx1ZUlzQW5BcnJheU1vbGR5O1xuICAgICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSB2YWx1ZUlzQW5BcnJheVN0cmluZztcbiAgICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICggYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIHtcbiAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0sXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSApO1xuXG4gICAgICAgIHNlbGYuX19kYXRhWyBfa2V5IF0gPSBzZWxmWyBfa2V5IF07XG5cbiAgICAgIH0gZWxzZSBpZiAoIHZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XG4gICAgICAgICAgdmFsdWU6IG5ldyBNb2xkeSggX3ZhbHVlLm5hbWUsIF92YWx1ZSApLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0gKTtcblxuICAgICAgICBzZWxmLl9fZGF0YVsgX2tleSBdID0gc2VsZlsgX2tleSBdO1xuXG4gICAgICB9IGVsc2UgaWYgKCBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICkge1xuXG4gICAgICAgIHZhciBhcnJheSA9IG9ic2VydmFibGVBcnJheSggW10gKSxcbiAgICAgICAgICBhdHRyaWJ1dGVUeXBlID0gYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nIHx8IGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID8gYXR0cmlidXRlcy50eXBlWyAwIF0gOiAnKic7XG5cbiAgICAgICAgYXR0cmlidXRlcy5hcnJheU9mQVR5cGUgPSB0cnVlO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgX2tleSwge1xuICAgICAgICAgIHZhbHVlOiBhcnJheSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgIH0gKTtcblxuICAgICAgICBzZWxmLl9fZGF0YVsgX2tleSBdID0gc2VsZlsgX2tleSBdO1xuXG4gICAgICAgIFsgJ3B1c2gnLCAndW5zaGlmdCcgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tZXRob2QgKSB7XG4gICAgICAgICAgYXJyYXkub24oIF9tZXRob2QsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgICAgICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcbiAgICAgICAgICAgICAgaWYgKCBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSApIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9sZHkgPSBuZXcgTW9sZHkoIGF0dHJpYnV0ZVR5cGVbICduYW1lJyBdLCBhdHRyaWJ1dGVUeXBlICksXG4gICAgICAgICAgICAgICAgICBkYXRhID0gaXMuYW4ub2JqZWN0KCBfaXRlbSApID8gX2l0ZW0gOiBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXTtcbiAgICAgICAgICAgICAgICBtb2xkeS4kZGF0YSggZGF0YSApO1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKCBtb2xkeSApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKCBjYXN0KCBfaXRlbSwgYXR0cmlidXRlVHlwZSwgYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCB2YWx1ZXMgKTtcbiAgICAgICAgICB9ICk7XG4gICAgICAgIH0gKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XG4gICAgICAgICAgZ2V0OiBoZWxwZXJzLmdldFByb3BlcnR5KCBfa2V5ICksXG4gICAgICAgICAgc2V0OiBoZWxwZXJzLnNldFByb3BlcnR5KCBfa2V5ICksXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9ICk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0gPSBhdHRyaWJ1dGVzO1xuICAgIH1cblxuICAgIGlmICggZXhpc3RpbmdWYWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgc2VsZlsgX2tleSBdID0gZXhpc3RpbmdWYWx1ZTtcbiAgICB9IGVsc2UgaWYgKCBpcy5lbXB0eSggc2VsZlsgX2tleSBdICkgJiYgYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgJiYgaXMubm90Lm51bGxPclVuZGVmaW5lZCggYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApIHtcbiAgICAgIHNlbGZbIF9rZXkgXSA9IGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xuICAgIH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBzZWxmWyBfa2V5IF0gKSAmJiBhdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcbiAgICAgIGlmICggYXR0cmlidXRlVHlwZUlzQW5BcnJheSB8fCBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ICkge1xuICAgICAgICBzZWxmLl9fZGF0YVsgX2tleSBdID0gc2VsZlsgX2tleSBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5fX2RhdGFbIF9rZXkgXSA9IGlzLmVtcHR5KCBhdHRyaWJ1dGVzLnR5cGUgKSA/IHVuZGVmaW5lZCA6IGNhc3QoIHVuZGVmaW5lZCwgYXR0cmlidXRlcy50eXBlICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLiRzYXZlID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgZXJyb3IgPSBudWxsLFxuICAgICAgaXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcbiAgICAgIGRhdGEgPSBzZWxmLiRqc29uKCksXG4gICAgICB1cmwgPSBzZWxmLiR1cmwoKSArICggIWlzRGlydHkgJiYgIXNlbGYuX19rZXlsZXNzID8gJy8nICsgc2VsZlsgc2VsZi5fX2tleSBdIDogJycgKSxcbiAgICAgIG1ldGhvZCA9IGlzRGlydHkgPyAncG9zdCcgOiAncHV0JyxcbiAgICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcblxuICAgIHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcblxuICAgIHNlbGYuZW1pdCggJ3ByZXNhdmUnLCB7XG4gICAgICBtb2xkeTogc2VsZixcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSApO1xuXG4gICAgcmVxdWVzdCggc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuICAgICAgc2VsZi5lbWl0KCAnc2F2ZScsIF9lcnJvciwgX3JlcyApO1xuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICAgIH0gKTtcblxuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIGJhc2UgPSBpcy5lbXB0eSggc2VsZi4kYmFzZVVybCgpICkgPyAnJyA6IHNlbGYuJGJhc2VVcmwoKSxcbiAgICAgIG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcbiAgICAgIHVybCA9IF91cmwgfHwgc2VsZi5fX3VybCB8fCAnJyxcbiAgICAgIGVuZHBvaW50ID0gYmFzZSArIG5hbWUgKyAoIGlzLmVtcHR5KCB1cmwgKSA/ICcnIDogJy8nICsgdXJsLnRyaW0oKS5yZXBsYWNlKCAvXlxcLy8sICcnICkgKTtcblxuICAgIHNlbGYuX191cmwgPSB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKTtcblxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcbiAgfTtcblxuICBlbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcbiAgdXNlaWZ5KCBNb2xkeSApO1xuXG4gIHJldHVybiBNb2xkeTtcbn07XG4iLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG4gIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcbiAgaGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF9tb2xkeSwgX2RhdGEsIF9tZXRob2QsIF91cmwsIF9jYWxsYmFjayApIHtcbiAgdmFyIG1vbGR5ID0gX21vbGR5LFxuICAgIGl0ZW1zID0gW10sXG4gICAgcmVzcG9uc2VTaG91bGRDb250YWluQW5JZCA9IGhhc0tleSggX2RhdGEsIG1vbGR5Ll9fa2V5ICkgJiYgaXMubm90LmVtcHR5KCBfZGF0YVsgbW9sZHkuX19rZXkgXSApICYmIC9nZXQvLnRlc3QoIF9tZXRob2QgKSxcbiAgICBpc0RpcnR5ID0gbW9sZHkuJGlzRGlydHkoKTtcblxuICBtb2xkeS5fX2RlZmF1bHRNaWRkbGV3YXJlKCBmdW5jdGlvbiAoIF9lcnJvciwgX3Jlc3BvbnNlICkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgICAgZXJyb3IgPSBfZXJyb3IgPT09IG1vbGR5ID8gbnVsbCA6IGFyZ3Muc2hpZnQoKSxcbiAgICAgIHJlc3BvbnNlID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKCBlcnJvciAmJiAhKCBlcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XG4gICAgfVxuXG4gICAgaWYgKCAhZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIHJlc3BvbnNlICkgJiYgKCByZXNwb25zZVNob3VsZENvbnRhaW5BbklkICYmICFoYXNLZXkoIHJlc3BvbnNlLCBtb2xkeS5fX2tleSApICkgKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvciggJ1RoZSByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZGlkIG5vdCBjb250YWluIGEgdmFsaWQgYCcgKyBtb2xkeS5fX2tleSArICdgJyApO1xuICAgIH1cblxuICAgIGlmICggIWVycm9yICYmIGlzRGlydHkgJiYgaXMub2JqZWN0KCByZXNwb25zZSApICkge1xuICAgICAgbW9sZHlbIG1vbGR5Ll9fa2V5IF0gPSByZXNwb25zZVsgbW9sZHkuX19rZXkgXTtcbiAgICB9XG5cbiAgICBpZiAoICFlcnJvciApIHtcbiAgICAgIGlmICggaXMuYXJyYXkoIHJlc3BvbnNlICkgKSB7XG4gICAgICAgIHJlc3BvbnNlLmZvckVhY2goIGZ1bmN0aW9uICggX2RhdGEgKSB7XG4gICAgICAgICAgaXRlbXMucHVzaCggbW9sZHkuJGNsb25lKCBfZGF0YSApICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgbW9sZHkgPSBpdGVtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vbGR5LiRkYXRhKCByZXNwb25zZSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWxsYmFjayAmJiBfY2FsbGJhY2soIGVycm9yLCBtb2xkeSApO1xuXG4gIH0sIF9tb2xkeSwgX2RhdGEsIF9tZXRob2QsIF91cmwgKTtcblxufTsiXX0=
(19)
});
