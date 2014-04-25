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
var helpers = _dereq_("./helpers/index"),
    emitter = _dereq_( 'emitter-component' ),
    observableArray = _dereq_( 'sg-observable-array' ),
    hasKey = _dereq_( 'sc-haskey' ),
    is = _dereq_( 'sc-is' ),
    merge = _dereq_( 'sc-merge' ),
    cast = _dereq_( 'sc-cast' ),
    request = _dereq_( './request' ),
    useify = _dereq_( 'sc-useify' );

module.exports = function ( BaseModel, defaultConfiguration, defaultMiddleware ) {

  var ModelFactory = function ( _name, _properties ) {
    var self = this,
    properties = is.an.object( _properties ) ? _properties : {},

    initial = properties.initial || {};

    Object.defineProperties( self, {
      __moldy: {
        value: true
      },
      __properties: {
        value: properties[ 'properties' ] || {}
      },
      __metadata: {
        value: {}
      },
      /*__attributes: {
        value: {},
        writable: true
      },*/
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

    if ( ! self.__keyless ) {
      this.$property( this.__key );
    }

    Object.keys( cast( self.__properties, 'object', {} ) ).forEach( function ( _key ) {
      self.$property( _key, self.__properties[ _key ] );
    } );

    self.on( 'preget', helpers.setBusy( self ) );
    self.on( 'get', helpers.unsetBusy( self ) );
  };

  ModelFactory.prototype.schema = function ( schema ) {

    Object.keys( cast( schema, 'object', {} ) ).forEach( function ( _key ) {
      self.$property( _key, schema[ _key ] );
    } );

    return this;
  };

  ModelFactory.prototype.proto = function ( proto ) {

    this.__properties.proto = this.__properties.proto || {};
    helpers.extend( this.__properties.proto, proto );

    return this;
  };

  ModelFactory.prototype.create = function ( _initial ) {

    var Klass = BaseModel.extend( this.__properties.proto || {} );

    return new Klass( _initial, this );
  };

  ModelFactory.prototype.$headers = function ( _headers ) {
    var self = this;

    if ( self.__destroyed ) {
      return helpers.destroyedError( self );
    }

    self.__headers = is.an.object( _headers ) ? _headers : self.__headers;
    return is.not.an.object( _headers ) ? self.__headers : self;
  };

  ModelFactory.prototype.$get = function ( _query, _callback ) {
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


    request( self, null, query, method, url, function ( _error, _res ) {
      //var res = _res instanceof BaseModel ? _res : null;

      /*if ( is.an.array( _res ) && _res[ 0 ] instanceof BaseModel ) {
        self.$data( _res[ 0 ].$json() );
        res = self;
      }*/
      /*
      if ( _error && wasDestroyed ) {
        self.__destroyed = true;
      }*/

      self.emit( 'get', _error, _res );

      callback.apply( self, [ _error, _res ] );
    } );
  };

  ModelFactory.prototype.$url = function ( _url ) {
    var self = this,
      base = is.empty( self.$baseUrl() ) ? '' : self.$baseUrl(),
      name = is.empty( self.__name ) ? '' : '/' + self.__name.trim().replace( /^\//, '' ),
      url = _url || self.__url || '',
      endpoint = base + name + ( is.empty( url ) ? '' : '/' + url.trim().replace( /^\//, '' ) );

    self.__url = url.trim().replace( /^\//, '' );

    return is.not.a.string( _url ) ? endpoint : self;
  };

  ModelFactory.prototype.__defaultMiddleware = defaultMiddleware;

  ModelFactory.prototype.$baseUrl = function ( _base ) {
    var self = this,
      url = cast( _base, 'string', self.__baseUrl || '' );

    self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || defaultConfiguration.baseUrl || '';

    return is.not.a.string( _base ) ? self.__baseUrl : self;
  };
  
  ModelFactory.prototype.$collection = function ( _query, _callback ) {
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

    request( self, null, query, method, url, function ( _error, _res ) {
      var res = cast( _res instanceof BaseModel || is.an.array( _res ) ? _res : null, 'array', [] );
      self.emit( 'collection', _error, res );
      callback.apply( self, [ _error, res ] );
    } );

  };

  ModelFactory.prototype.$defineProperty = function ( obj, key, value ) {

    var self = this,
        existingValue = obj[ key ] || value,
        metadata = this.__metadata[ key ];

    if ( !obj.hasOwnProperty( key ) || !obj.__attributes.hasOwnProperty( key ) ) {
      if ( metadata.valueIsAnArrayMoldy || metadata.valueIsAnArrayString ) {
        metadata.attributes.type = metadata.value;
        metadata.attributeArrayTypeIsAMoldy = metadata.valueIsAnArrayMoldy;
        metadata.attributeArrayTypeIsAString = metadata.valueIsAnArrayString;
        metadata.attributeTypeIsAnArray = true;
      }

      if ( metadata.attributeTypeIsAnInstantiatedMoldy ) {

        Object.defineProperty( obj, key, {
          value: metadata.attributes[ 'default' ],
          enumerable: true,
        } );

        obj.__data[ key ] = obj[ key ];

      } else if ( metadata.valueIsAStaticMoldy ) {

        Object.defineProperty( obj, key, {
          value: new ModelFactory( metadata.value.name, metadata.value ).create(),
          enumerable: true,
        } );

        obj.__data[ key ] = obj[ key ];

      } else if ( metadata.attributeTypeIsAnArray ) {

        var array = observableArray( [] ),
          attributeType = metadata.attributeArrayTypeIsAString || metadata.attributeArrayTypeIsAMoldy ? metadata.attributes.type[ 0 ] : '*';

        metadata.attributes.arrayOfAType = true;

        Object.defineProperty( obj, key, {
          value: array,
          enumerable: true
        } );

        obj.__data[ key ] = obj[ key ];

        [ 'push', 'unshift' ].forEach( function ( _method ) {
          array.on( _method, function () {
            var args = Array.prototype.slice.call( arguments ),
              values = [];
            args.forEach( function ( _item ) {
              if ( metadata.attributeArrayTypeIsAMoldy ) {
                var moldy = new ModelFactory( attributeType[ 'name' ], attributeType ),
                  data = is.an.object( _item ) ? _item : metadata.attributes[ 'default' ];

                values.push( moldy.create( data ) );
              } else {
                values.push( cast( _item, attributeType, metadata.attributes[ 'default' ] ) );
              }
            } );
            return array[ '__' + _method ].apply( array, values );
          } );
        } );

        if( existingValue && existingValue.length > 0 ) {
          existingValue.forEach( function ( o ) {
            obj[ key ].push( o );
          } );
        }

      } else {
        Object.defineProperty( obj, key, {
          get: helpers.getProperty( key ),
          set: helpers.setProperty( key ),
          enumerable: true
        } );
      }

      obj.__attributes[ key ] = metadata.attributes;
    }

    if ( existingValue !== void 0 ) { //if existing value
      obj[ key ] = existingValue;
    } else if ( is.empty( obj[ key ] ) && metadata.attributes.optional === false && is.not.nullOrUndefined( metadata.attributes[ 'default' ] ) ) {
      obj[ key ] = metadata.attributes[ 'default' ];
    } else if ( is.empty( obj[ key ] ) && metadata.attributes.optional === false ) {
      if ( metadata.attributeTypeIsAnArray || metadata.attributeTypeIsAnInstantiatedMoldy ) {
        obj.__data[ key ] = obj[ key ];
      } else {
        obj.__data[ key ] = is.empty( metadata.attributes.type ) ? undefined : cast( undefined, metadata.attributes.type );
      }
    }
  };

  ModelFactory.prototype.$property = function ( _key, _value ) {
    var self = this,
      attributes = new helpers.attributes( _key, _value ),
      //existingValue = self[ _key ],
      attributeTypeIsAnInstantiatedMoldy = is.a.string( attributes.type ) && /moldy/.test( attributes.type ),
      attributeTypeIsAnArray = is.an.array( attributes.type ),
      valueIsAnArrayMoldy = is.an.array( _value ) && hasKey( _value[ 0 ], 'properties', 'object' ),
      valueIsAnArrayString = is.an.array( _value ) && is.a.string( _value[ 0 ] ),
      attributeArrayTypeIsAMoldy = attributeTypeIsAnArray && hasKey( attributes.type[ 0 ], 'properties', 'object' ),
      attributeArrayTypeIsAString = attributeTypeIsAnArray && is.a.string( attributes.type[ 0 ] ) && is.not.empty( attributes.type[ 0 ] ),
      valueIsAStaticMoldy = hasKey( _value, 'properties', 'object' );

    self.__metadata[ _key ] = {
      attributes: attributes,
      value: _value,
      attributeTypeIsAnInstantiatedMoldy: attributeTypeIsAnInstantiatedMoldy,
      attributeTypeIsAnArray: attributeTypeIsAnArray,
      valueIsAnArrayMoldy: valueIsAnArrayMoldy,
      valueIsAnArrayString: valueIsAnArrayString,
      attributeArrayTypeIsAMoldy: attributeArrayTypeIsAMoldy,
      attributeArrayTypeIsAString: attributeArrayTypeIsAString,
      valueIsAStaticMoldy: valueIsAStaticMoldy
    };

    return self;
  };

  emitter( ModelFactory.prototype );
  useify( ModelFactory );
  
  return ModelFactory;

};
},{"./helpers/index":21,"./request":23,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sc-useify":16,"sg-observable-array":17}],20:[function(_dereq_,module,exports){
var config = _dereq_( './config.json' ),
  moldyApi = {},
  useify = _dereq_( 'sc-useify' );

useify( moldyApi );

var ModelFactory = _dereq_( './factory' )( _dereq_( './moldy' ), config.defaults, moldyApi.middleware );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;
},{"./config.json":18,"./factory":19,"./moldy":22,"sc-useify":16}],21:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
  cast = _dereq_( 'sc-cast' ),
  merge = _dereq_( 'sc-merge' );

exports.attributes = function ( _key, _value ) {
  var value;

  if ( is.a.string( _value ) ) {
    value = {
      type: _value
    };
  } else if ( is.an.object( _value ) && _value[ '__isMoldy' ] === true ) {
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

var _extend = function( obj ) {
    Array.prototype.slice.call( arguments, 1 ).forEach( function( source ) {
      if ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      }
    });

    return obj;
};

exports.extend = _extend;

exports.extendObject = function( protoProps, staticProps ) {
  var parent = this;
  var child;

  if ( protoProps && Object.prototype.hasOwnProperty.call( protoProps, 'constructor' ) ) {
    child = protoProps.constructor;
  } else {
    child = function( ){ return parent.apply( this, arguments ); };
  }

  _extend( child, parent, staticProps );

  var Surrogate = function(){ this.constructor = child; };

  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

   if (protoProps) _extend( child.prototype, protoProps );

   child.__super__ = parent.prototype;

  return child;
};
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],22:[function(_dereq_,module,exports){
var cast = _dereq_( 'sc-cast' ),
  emitter = _dereq_( 'emitter-component' ),
  hasKey = _dereq_( 'sc-haskey' ),
  helpers = _dereq_( './helpers' ),
  is = _dereq_( 'sc-is' ),
  merge = _dereq_( 'sc-merge' ),
  request = _dereq_( './request' ),
  extend = helpers.extendObject,
  ModelFactory = _dereq_( "./factory" ),
  useify = _dereq_( 'sc-useify' );

var Model = function ( initial, __moldy ) {
  var self = this;

  initial = initial || {};

  this.__moldy = __moldy;
  this.__isMoldy = true;
  this.__attributes = {};
  this.__data = {};
  this.__destroyed = false;
  
  if ( ! self.__moldy.__keyless ) {
    self.__moldy.$defineProperty( self, self.__moldy.__key );
  }

  Object.keys( cast( self.__moldy.__metadata, 'object', {} ) ).forEach( function ( _key ) {
    self.__moldy.$defineProperty( self, _key, initial[ _key ] );
  } );

  for( var i in initial ) {
    if( initial.hasOwnProperty( i ) && self.__moldy.__metadata[ i ] ) {
      this[ i ] = initial[ i ];
    }
  }

  self.on( 'presave', helpers.setBusy( self ) );
  self.on( 'save', helpers.unsetBusy( self ) );

  self.on( 'predestroy', helpers.setBusy( self ) );
  self.on( 'destroy', helpers.unsetBusy( self ) );

};

Model.prototype.$clear = function () {
  var self = this;

  Object.keys( self.__moldy.__metadata ).forEach( function ( _key ) {
    if ( hasKey( self[ _key ], '__isMoldy', 'boolean' ) && self[ _key ].__isMoldy === true ) {
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

/**
 * $clone won't work currently
 * @param  {[type]} _data [description]
 * @return {[type]}       [description]
 */
Model.prototype.$clone = function ( _data ) {
  var self = this,
      initialValues = this.$json();

  //  data = is.an.object( _data ) ? _data : self.__data;
  helpers.extend( initialValues, _data || {}  );

  var newMoldy = this.__moldy.create( initialValues );
    /* this.__moldynew ModelFactory( self.__name, {
      baseUrl: self.__moldy.$baseUrl(),
      headers: self.__headers,
      key: self.__key,
      keyless: self.__keyless,
      url: self.__url
    } );*/

  /*
  Object.keys( self.__attributes ).forEach( function ( _propertyKey ) {
    newMoldy.$property( _propertyKey, merge( self.__attributes[ _propertyKey ] ) );
    if ( is.an.array( newMoldy[ _propertyKey ] ) && is.an.array( data[ _propertyKey ] ) ) {
      data[ _propertyKey ].forEach( function ( _dataItem ) {
        newMoldy[ _propertyKey ].push( _dataItem );
      } );
    } else {
      newMoldy[ _propertyKey ] = data[ _propertyKey ]
    }
  } );*/

  return newMoldy;
};

  Model.prototype.$data = function ( _data ) {
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
        } else if ( is.a.object( data[ _key ] ) && self[ _key ] instanceof Model ) {
          self[ _key ].$data( data[ _key ] );
        } else {
          self[ _key ] = data[ _key ];
        }
      }
    } );

    return self;
  };
  

Model.prototype.$destroy = function ( _callback ) {
  var self = this,
    isDirty = self.$isDirty(),
    data = self.$json(),
    url = self.__moldy.$url() + ( self.__moldy.__keyless ? '' : '/' + self[ self.__moldy.__key ] ),
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
  request( self.__moldy, self, data, method, url, function ( _error, _res ) {
    self.emit( 'destroy', _error, _res );
      self.__destroyed = true;
      self[ self.__moldy.__key ] = undefined;
      callback.apply( self, arguments );
    } );
  } else {
    callback.apply( self, [ new Error( 'This moldy cannot be destroyed because it has not been saved to the server yet.' ) ] );
  }

};

Model.prototype.$isDirty = function () {
  return this.__destroyed ? true : is.empty( this[ this.__moldy.__key ] );
};

Model.prototype.$isValid = function () {
  if ( this.__destroyed ) {
    return false;
  }

  var self = this,
    isValid = true;

  Object.keys( self.__attributes ).forEach( function ( _key ) {

    if ( self.$isDirty() && _key === self.__moldy.__key ) {
      return;
    }

    var value = self[ _key ],
      attributes = self.__attributes[ _key ],
      type = attributes.type,
      arrayOfAType = hasKey( attributes, 'arrayOfAType', 'boolean' ) ? attributes.arrayOfAType === true : false,
      isRequired = attributes.optional !== true,
      isNullOrUndefined = self.__moldy.__keyless ? false : arrayOfAType ? value.length === 0 : is.nullOrUndefined( value ),
      typeIsWrong = is.not.empty( type ) && is.a.string( type ) ? is.not.a[ type ]( value ) : isNullOrUndefined;

    if ( arrayOfAType && is.not.empty( value ) && value[ 0 ] instanceof Model ) {
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

Model.prototype.$json = function () {
  var self = this,
    data = self.__data,
    json = {};

  Object.keys( data ).forEach( function ( _key ) {
    if ( is.an.array( data[ _key ] ) && data[ _key ][ 0 ] instanceof Model ) {
      json[ _key ] = [];
      data[ _key ].forEach( function ( _moldy ) {
        json[ _key ].push( _moldy.$json() );
      } );
  } else {
    json[ _key ] = data[ _key ] instanceof Model ? data[ _key ].$json() : data[ _key ];
    }
  } );

  return json;
};

Model.prototype.$save = function ( _callback ) {
  var self = this,
    error = null,
    isDirty = self.$isDirty(),
    data = self.$json(),
    url = self.__moldy.$url() + ( !isDirty && !self.__moldy.__keyless ? '/' + self[ self.__moldy.__key ] : '' ),
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

  request( self.__moldy, self, data, method, url, function ( _error, _res ) {
    self.emit( 'save', _error, _res );
    callback.apply( self, arguments ); //not sure about that ! why passing the context ?
  } );

};

emitter( Model.prototype );
useify( Model );

Model.extend = extend;

exports = module.exports = Model;
},{"./factory":19,"./helpers":21,"./request":23,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sc-useify":16}],23:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
  cast = _dereq_( 'sc-cast' ),
  hasKey = _dereq_( 'sc-haskey' );
/**
 * Fetching the data
 * @param  {[type]} _moldy    [description]
 * @param  {[type]} _data     [description]
 * @param  {[type]} _method   [description]
 * @param  {[type]} _url      [description]
 * @param  {[type]} _callback [description]
 * @return {[type]}           [description]
 */
module.exports = function ( _moldy, instance, _data, _method, _url, _callback ) {
  var moldy = _moldy,
    result = [],
    responseShouldContainAnId = hasKey( _data, moldy.__key ) && is.not.empty( _data[ moldy.__key ] ) && /get/.test( _method ),
    isInstance = instance ? true : false,
    isDirty = isInstance ? instance.$isDirty() : false;

  moldy.__defaultMiddleware( function ( _error, _response ) {
    var args = Array.prototype.slice.call( arguments ),
      error = _error === moldy ? null : args.shift(),
      response = args.shift();

    if ( error && !( error instanceof Error ) ) {
      error = new Error( 'An unknown error occurred' );
    }

    if ( !error && isInstance && isDirty && is.object( response ) && ( responseShouldContainAnId && !hasKey( response, moldy.__key ) ) ) {
      error = new Error( 'The response from the server did not contain a valid `' + moldy.__key + '`' );
    }

    if ( !error && isDirty && isInstance && is.object( response ) ) {
      moldy[ moldy.__key ] = response[ moldy.__key ];
    }

    if ( !error ) {
      if( !isInstance ) {
        if ( is.array( response ) ) {

          response.forEach( function ( _data ) {

            result.push( moldy.create( _data ) );
          } );
        } else {
          result = moldy.create( response );
        }
      } else {
        instance.$data( response );
        result = instance;
      }
    }

    _callback && _callback( error, result );

  }, _moldy, _data, _method, _url );

};
},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[20])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHBkZVxcRHJvcGJveFxcc3JjXFxtb2xkeVxcbW9sZHlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9ub2RlX21vZHVsZXMvc2MtY29udGFpbnMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaGFza2V5L25vZGVfbW9kdWxlcy90eXBlLWNvbXBvbmVudC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZW1wdHkuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZ3VpZC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvdHlwZS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvdHlwZS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLXVzZWlmeS9jb25maWcuanNvbiIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtdXNlaWZ5L2luZGV4LmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9zcmMvY29uZmlnLmpzb24iLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL2ZhY3RvcnkuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL2Zha2VfNzc4ZjM1ODIuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL21vbGR5LmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L3NyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbi8qKlxyXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cclxuICpcclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xyXG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcclxuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcclxuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cclxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcclxuICAgIC5wdXNoKGZuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcclxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgZnVuY3Rpb24gb24oKSB7XHJcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xyXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIG9uLmZuID0gZm47XHJcbiAgdGhpcy5vbihldmVudCwgb24pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXHJcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgLy8gYWxsXHJcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XHJcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXHJcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgdmFyIGNiO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcclxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XHJcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXHJcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XHJcblxyXG4gIGlmIChjYWxsYmFja3MpIHtcclxuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XHJcbn07XHJcbiIsInZhciBjb250YWlucyA9IHJlcXVpcmUoIFwic2MtY29udGFpbnNcIiApLFxuICBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApO1xuXG52YXIgY2FzdCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfY2FzdFR5cGUsIF9kZWZhdWx0LCBfdmFsdWVzLCBfYWRkaXRpb25hbFByb3BlcnRpZXMgKSB7XG5cbiAgdmFyIHBhcnNlZFZhbHVlLFxuICAgIGNhc3RUeXBlID0gX2Nhc3RUeXBlLFxuICAgIHZhbHVlLFxuICAgIHZhbHVlcyA9IGlzLmFuLmFycmF5KCBfdmFsdWVzICkgPyBfdmFsdWVzIDogW107XG5cbiAgc3dpdGNoICggdHJ1ZSApIHtcbiAgY2FzZSAoIC9mbG9hdHxpbnRlZ2VyLy50ZXN0KCBjYXN0VHlwZSApICk6XG4gICAgY2FzdFR5cGUgPSBcIm51bWJlclwiO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCBpcy5hWyBjYXN0VHlwZSBdKCBfdmFsdWUgKSB8fCBjYXN0VHlwZSA9PT0gJyonICkge1xuXG4gICAgdmFsdWUgPSBfdmFsdWU7XG5cbiAgfSBlbHNlIHtcblxuICAgIHN3aXRjaCAoIHRydWUgKSB7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImFycmF5XCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSggX3ZhbHVlICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBbIF92YWx1ZSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYm9vbGVhblwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IC9eKHRydWV8MXx5fHllcykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IHRydWUgOiB1bmRlZmluZWQ7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGlmICggaXMubm90LmEuYm9vbGVhbiggdmFsdWUgKSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gL14oZmFsc2V8LTF8MHxufG5vKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGlzLmEuYm9vbGVhbiggdmFsdWUgKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiZGF0ZVwiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gbmV3IERhdGUoIF92YWx1ZSApO1xuICAgICAgICB2YWx1ZSA9IGlzTmFOKCB2YWx1ZS5nZXRUaW1lKCkgKSA/IHVuZGVmaW5lZCA6IHZhbHVlO1xuXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJzdHJpbmdcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy51bmRlZmluZWQoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoICggZSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gX3ZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJudW1iZXJcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy5ub3QuYS5udW1iZXIoIHZhbHVlICkgfHwgaXNOYU4oIHZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHN3aXRjaCAoIHRydWUgKSB7XG4gICAgICAgIGNhc2UgX2Nhc3RUeXBlID09PSBcImludGVnZXJcIjpcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCB2YWx1ZSApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBjYXN0KCBKU09OLnBhcnNlKCBfdmFsdWUgKSwgY2FzdFR5cGUgKVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIH1cblxuICB9XG5cbiAgaWYgKCB2YWx1ZXMubGVuZ3RoID4gMCAmJiAhY29udGFpbnMoIHZhbHVlcywgdmFsdWUgKSApIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1sgMCBdO1xuICB9XG5cbiAgcmV0dXJuIGlzLm5vdC51bmRlZmluZWQoIHZhbHVlICkgPyB2YWx1ZSA6IGlzLm5vdC51bmRlZmluZWQoIF9kZWZhdWx0ICkgPyBfZGVmYXVsdCA6IG51bGw7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdDsiLCJ2YXIgY29udGFpbnMgPSBmdW5jdGlvbiAoIGRhdGEsIGl0ZW0gKSB7XG4gIHZhciBmb3VuZE9uZSA9IGZhbHNlO1xuXG4gIGlmICggQXJyYXkuaXNBcnJheSggZGF0YSApICkge1xuXG4gICAgZGF0YS5mb3JFYWNoKCBmdW5jdGlvbiAoIGFycmF5SXRlbSApIHtcbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGl0ZW0gPT09IGFycmF5SXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gKTtcblxuICB9IGVsc2UgaWYgKCBPYmplY3QoIGRhdGEgKSA9PT0gZGF0YSApIHtcblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGRhdGFbIGtleSBdID09PSBpdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgfVxuICByZXR1cm4gZm91bmRPbmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsInZhciBndWlkUnggPSBcIns/WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezR9LVswLTlBLUZhLWZdezEyfX0/XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBndWlkID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKCAvW3h5XS9nLCBmdW5jdGlvbiAoIGMgKSB7XG4gICAgdmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG4gICAgcmV0dXJuICggYyA9PT0gXCJ4XCIgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZyggMTYgKTtcbiAgfSApO1xuICByZXR1cm4gZ3VpZDtcbn07XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAoIHN0cmluZyApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4LCBcImdcIiApLFxuICAgIG1hdGNoZXMgPSAoIHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIgPyBzdHJpbmcgOiBcIlwiICkubWF0Y2goIHJ4ICk7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBtYXRjaGVzICkgPyBtYXRjaGVzIDogW107XG59O1xuXG5leHBvcnRzLmlzVmFsaWQgPSBmdW5jdGlvbiAoIGd1aWQgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCApO1xuICByZXR1cm4gcngudGVzdCggZ3VpZCApO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApLFxuICBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBvYmplY3QgPSB0eXBlKCBvYmplY3QgKSA9PT0gXCJvYmplY3RcIiA/IG9iamVjdCA6IHt9LCBrZXlzID0gdHlwZSgga2V5cyApID09PSBcImFycmF5XCIgPyBrZXlzIDogW107XG4gIGtleVR5cGUgPSB0eXBlKCBrZXlUeXBlICkgPT09IFwic3RyaW5nXCIgPyBrZXlUeXBlIDogXCJcIjtcblxuICB2YXIga2V5ID0ga2V5cy5sZW5ndGggPiAwID8ga2V5cy5zaGlmdCgpIDogXCJcIixcbiAgICBrZXlFeGlzdHMgPSBoYXMuY2FsbCggb2JqZWN0LCBrZXkgKSB8fCBvYmplY3RbIGtleSBdICE9PSB2b2lkIDAsXG4gICAga2V5VmFsdWUgPSBrZXlFeGlzdHMgPyBvYmplY3RbIGtleSBdIDogdW5kZWZpbmVkLFxuICAgIGtleVR5cGVJc0NvcnJlY3QgPSB0eXBlKCBrZXlWYWx1ZSApID09PSBrZXlUeXBlO1xuXG4gIGlmICgga2V5cy5sZW5ndGggPiAwICYmIGtleUV4aXN0cyApIHtcbiAgICByZXR1cm4gaGFzS2V5KCBvYmplY3RbIGtleSBdLCBrZXlzLCBrZXlUeXBlICk7XG4gIH1cblxuICByZXR1cm4ga2V5cy5sZW5ndGggPiAwIHx8IGtleVR5cGUgPT09IFwiXCIgPyBrZXlFeGlzdHMgOiBrZXlFeGlzdHMgJiYga2V5VHlwZUlzQ29ycmVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwic3RyaW5nXCIgPyBrZXlzLnNwbGl0KCBcIi5cIiApIDogW107XG5cbiAgcmV0dXJuIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICk7XG5cbn07IiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59O1xuIiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4vaXNlcy90eXBlXCIgKSxcbiAgaXMgPSB7XG4gICAgYToge30sXG4gICAgYW46IHt9LFxuICAgIG5vdDoge1xuICAgICAgYToge30sXG4gICAgICBhbjoge31cbiAgICB9XG4gIH07XG5cbnZhciBpc2VzID0ge1xuICBcImFyZ3VtZW50c1wiOiBbIFwiYXJndW1lbnRzXCIsIHR5cGUoIFwiYXJndW1lbnRzXCIgKSBdLFxuICBcImFycmF5XCI6IFsgXCJhcnJheVwiLCB0eXBlKCBcImFycmF5XCIgKSBdLFxuICBcImJvb2xlYW5cIjogWyBcImJvb2xlYW5cIiwgdHlwZSggXCJib29sZWFuXCIgKSBdLFxuICBcImRhdGVcIjogWyBcImRhdGVcIiwgdHlwZSggXCJkYXRlXCIgKSBdLFxuICBcImZ1bmN0aW9uXCI6IFsgXCJmdW5jdGlvblwiLCBcImZ1bmNcIiwgXCJmblwiLCB0eXBlKCBcImZ1bmN0aW9uXCIgKSBdLFxuICBcIm51bGxcIjogWyBcIm51bGxcIiwgdHlwZSggXCJudWxsXCIgKSBdLFxuICBcIm51bWJlclwiOiBbIFwibnVtYmVyXCIsIFwiaW50ZWdlclwiLCBcImludFwiLCB0eXBlKCBcIm51bWJlclwiICkgXSxcbiAgXCJvYmplY3RcIjogWyBcIm9iamVjdFwiLCB0eXBlKCBcIm9iamVjdFwiICkgXSxcbiAgXCJyZWdleHBcIjogWyBcInJlZ2V4cFwiLCB0eXBlKCBcInJlZ2V4cFwiICkgXSxcbiAgXCJzdHJpbmdcIjogWyBcInN0cmluZ1wiLCB0eXBlKCBcInN0cmluZ1wiICkgXSxcbiAgXCJ1bmRlZmluZWRcIjogWyBcInVuZGVmaW5lZFwiLCB0eXBlKCBcInVuZGVmaW5lZFwiICkgXSxcbiAgXCJlbXB0eVwiOiBbIFwiZW1wdHlcIiwgcmVxdWlyZSggXCIuL2lzZXMvZW1wdHlcIiApIF0sXG4gIFwibnVsbG9ydW5kZWZpbmVkXCI6IFsgXCJudWxsT3JVbmRlZmluZWRcIiwgXCJudWxsb3J1bmRlZmluZWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvbnVsbG9ydW5kZWZpbmVkXCIgKSBdLFxuICBcImd1aWRcIjogWyBcImd1aWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvZ3VpZFwiICkgXVxufVxuXG5PYmplY3Qua2V5cyggaXNlcyApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gIHZhciBtZXRob2RzID0gaXNlc1sga2V5IF0uc2xpY2UoIDAsIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgKSxcbiAgICBmbiA9IGlzZXNbIGtleSBdWyBpc2VzWyBrZXkgXS5sZW5ndGggLSAxIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiAoIG1ldGhvZEtleSApIHtcbiAgICBpc1sgbWV0aG9kS2V5IF0gPSBpcy5hWyBtZXRob2RLZXkgXSA9IGlzLmFuWyBtZXRob2RLZXkgXSA9IGZuO1xuICAgIGlzLm5vdFsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYVsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYW5bIG1ldGhvZEtleSBdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG4gIH0gKTtcblxufSApO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBpcztcbmV4cG9ydHMudHlwZSA9IHR5cGU7IiwidmFyIHR5cGUgPSByZXF1aXJlKFwiLi4vdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVsbFwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm9iamVjdFwiICkge1xuICAgIGVtcHR5ID0gT2JqZWN0LmtleXMoIHZhbHVlICkubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImJvb2xlYW5cIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSBmYWxzZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudW1iZXJcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAtMTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJhcnJheVwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICByZXR1cm4gZW1wdHk7XG5cbn07IiwidmFyIGd1aWQgPSByZXF1aXJlKCBcInNjLWd1aWRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHJldHVybiBndWlkLmlzVmFsaWQoIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IHZvaWQgMDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4uL3R5cGVcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX3R5cGUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcbiAgICByZXR1cm4gdHlwZSggX3ZhbHVlICkgPT09IF90eXBlO1xuICB9XG59IiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbCApIHtcbiAgc3dpdGNoICggdG9TdHJpbmcuY2FsbCggdmFsICkgKSB7XG4gIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzpcbiAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgcmV0dXJuICdkYXRlJztcbiAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6XG4gICAgcmV0dXJuICdhcmd1bWVudHMnO1xuICBjYXNlICdbb2JqZWN0IEFycmF5XSc6XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAoIHZhbCA9PT0gbnVsbCApIHJldHVybiAnbnVsbCc7XG4gIGlmICggdmFsID09PSB1bmRlZmluZWQgKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICggdmFsID09PSBPYmplY3QoIHZhbCApICkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgZGVlcCA9IHR5cGUoIGFyZ3NbIDAgXSApID09PSBcImJvb2xlYW5cIiA/IGFyZ3Muc2hpZnQoKSA6IGZhbHNlLFxuICAgIG9iamVjdHMgPSBhcmdzLFxuICAgIHJlc3VsdCA9IHt9O1xuXG4gIG9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24gKCBvYmplY3RuICkge1xuXG4gICAgaWYgKCB0eXBlKCBvYmplY3RuICkgIT09IFwib2JqZWN0XCIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIG9iamVjdG4gKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3RuLCBrZXkgKSApIHtcbiAgICAgICAgaWYgKCBkZWVwICYmIHR5cGUoIG9iamVjdG5bIGtleSBdICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG1lcmdlKCBkZWVwLCB7fSwgcmVzdWx0WyBrZXkgXSwgb2JqZWN0blsga2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gb2JqZWN0blsga2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlOyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJkZWZhdWx0c1wiOiB7XG5cdFx0XCJtaWRkbGV3YXJlS2V5XCI6IFwiYWxsXCJcblx0fVxufSIsInZhciBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApLFxuICBjb25maWcgPSByZXF1aXJlKCBcIi4vY29uZmlnLmpzb25cIiApLFxuICBub29wID0gZnVuY3Rpb24gKCkge307XG5cbnZhciB1c2VpZnlGdW5jdGlvbiA9IGZ1bmN0aW9uICggZnVuY3Rpb25zLCBrZXksIGZuICkge1xuICBpZiAoIGlzLm5vdC5lbXB0eSgga2V5ICkgJiYgaXMuYS5zdHJpbmcoIGtleSApICkge1xuICAgIGlmICggaXMubm90LmFuLmFycmF5KCBmdW5jdGlvbnNbIGtleSBdICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdID0gW107XG4gICAgfVxuICAgIGlmICggaXMuYS5mdW5jKCBmbiApICkge1xuICAgICAgZnVuY3Rpb25zWyBrZXkgXS5wdXNoKCBmbiApO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb25zWyBrZXkgXTtcbiAgfVxufVxuXG52YXIgVXNlaWZ5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICBhbGw6IFtdXG4gIH07XG59O1xuXG5Vc2VpZnkucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAga2V5ID0gaXMuYS5zdHJpbmcoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgZm4gPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIGtleSwgZm4gKTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgY3VycmVudEZ1bmN0aW9uID0gMCxcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIG1pZGRsZXdhcmVLZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgJiYgaXMuYS5mdW5jKCBhcmdzWyAxIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IGNvbmZpZy5kZWZhdWx0cy5taWRkbGV3YXJlS2V5LFxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBhcmdzWyAwIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IG5vb3A7XG5cbiAgdXNlaWZ5RnVuY3Rpb24oIHNlbGYuZnVuY3Rpb25zLCBtaWRkbGV3YXJlS2V5ICk7XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZuID0gc2VsZi5mdW5jdGlvbnNbIG1pZGRsZXdhcmVLZXkgXVsgY3VycmVudEZ1bmN0aW9uKysgXSxcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICk7XG5cbiAgICBpZiAoICFmbiApIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKCBuZXh0ICk7XG4gICAgICBmbi5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG4gICAgfVxuXG4gIH07XG5cbiAgbmV4dC5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG5cbn07XG5cblVzZWlmeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoIG1pZGRsZXdhcmVLZXkgKSB7XG4gIGlmICggaXMuYS5zdHJpbmcoIG1pZGRsZXdhcmVLZXkgKSAmJiBpcy5ub3QuZW1wdHkoIG1pZGRsZXdhcmVLZXkgKSApIHtcbiAgICB0aGlzLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdID0gW107XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5mdW5jdGlvbnMgPSB7XG4gICAgICBhbGw6IFtdXG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF9vYmplY3RPckZ1bmN0aW9uICkge1xuXG4gIHZhciB1c2VpZnkgPSBuZXcgVXNlaWZ5KCk7XG5cbiAgaWYgKCBpcy5hbi5vYmplY3QoIF9vYmplY3RPckZ1bmN0aW9uICkgKSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggX29iamVjdE9yRnVuY3Rpb24sIHtcblxuICAgICAgXCJ1c2VcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgICAgcmV0dXJuIF9vYmplY3RPckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcIm1pZGRsZXdhcmVcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS5taWRkbGV3YXJlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcInVzZWlmeVwiOiB7XG4gICAgICAgIHZhbHVlOiB1c2VpZnlcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICAgIHVzZWlmeS5jb250ZXh0ID0gX29iamVjdE9yRnVuY3Rpb247XG5cbiAgfSBlbHNlIGlmICggaXMuYS5mbiggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LmNvbnRleHQgPSB0aGlzO1xuICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgfTtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlaWZ5ID0gdXNlaWZ5O1xuXG4gIH1cblxufTsiLCJ2YXIgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKCBfYXJyYXkgKSB7XG5cdHZhciBoYW5kbGVycyA9IHt9LFxuXHRcdGFycmF5ID0gQXJyYXkuaXNBcnJheSggX2FycmF5ICkgPyBfYXJyYXkgOiBbXTtcblxuXHR2YXIgcHJveHkgPSBmdW5jdGlvbiAoIF9tZXRob2QsIF92YWx1ZSApIHtcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblxuXHRcdGlmICggaGFuZGxlcnNbIF9tZXRob2QgXSApIHtcblx0XHRcdHJldHVybiBoYW5kbGVyc1sgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fVxuXHR9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwge1xuXHRcdG9uOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfZXZlbnQsIF9jYWxsYmFjayApIHtcblx0XHRcdFx0aGFuZGxlcnNbIF9ldmVudCBdID0gX2NhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdwb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3BvcCcsIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19wb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdzaGlmdCcsIGFycmF5WyAwIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19zaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdFsgJ3B1c2gnLCAncmV2ZXJzZScsICd1bnNoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IHt9O1xuXG5cdFx0cHJvcGVydGllc1sgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IHByb3h5LmJpbmQoIG51bGwsIF9tZXRob2QgKVxuXHRcdH07XG5cblx0XHRwcm9wZXJ0aWVzWyAnX18nICsgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCBwcm9wZXJ0aWVzICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmFibGVBcnJheTsiLCJtb2R1bGUuZXhwb3J0cz17XHJcblx0XCJkZWZhdWx0c1wiOiB7XHJcblx0XHRcImJhc2VVcmxcIjogXCJcIixcclxuXHRcdFwiaGVhZGVyc1wiOiB7fVxyXG5cdH1cclxufSIsInZhciBoZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVycy9pbmRleFwiKSxcclxuICAgIGVtaXR0ZXIgPSByZXF1aXJlKCAnZW1pdHRlci1jb21wb25lbnQnICksXHJcbiAgICBvYnNlcnZhYmxlQXJyYXkgPSByZXF1aXJlKCAnc2ctb2JzZXJ2YWJsZS1hcnJheScgKSxcclxuICAgIGhhc0tleSA9IHJlcXVpcmUoICdzYy1oYXNrZXknICksXHJcbiAgICBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuICAgIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxyXG4gICAgY2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxyXG4gICAgcmVxdWVzdCA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXHJcbiAgICB1c2VpZnkgPSByZXF1aXJlKCAnc2MtdXNlaWZ5JyApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIEJhc2VNb2RlbCwgZGVmYXVsdENvbmZpZ3VyYXRpb24sIGRlZmF1bHRNaWRkbGV3YXJlICkge1xyXG5cclxuICB2YXIgTW9kZWxGYWN0b3J5ID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICBwcm9wZXJ0aWVzID0gaXMuYW4ub2JqZWN0KCBfcHJvcGVydGllcyApID8gX3Byb3BlcnRpZXMgOiB7fSxcclxuXHJcbiAgICBpbml0aWFsID0gcHJvcGVydGllcy5pbml0aWFsIHx8IHt9O1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBzZWxmLCB7XHJcbiAgICAgIF9fbW9sZHk6IHtcclxuICAgICAgICB2YWx1ZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX3Byb3BlcnRpZXM6IHtcclxuICAgICAgICB2YWx1ZTogcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF0gfHwge31cclxuICAgICAgfSxcclxuICAgICAgX19tZXRhZGF0YToge1xyXG4gICAgICAgIHZhbHVlOiB7fVxyXG4gICAgICB9LFxyXG4gICAgICAvKl9fYXR0cmlidXRlczoge1xyXG4gICAgICAgIHZhbHVlOiB7fSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LCovXHJcbiAgICAgIF9fYmFzZVVybDoge1xyXG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAnYmFzZVVybCcgXSwgJ3N0cmluZycsICcnICksXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19kYXRhOiB7XHJcbiAgICAgICAgdmFsdWU6IHt9LFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fZGVzdHJveWVkOiB7XHJcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9faGVhZGVyczoge1xyXG4gICAgICAgIHZhbHVlOiBtZXJnZSgge30sIGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSwgY2FzdCggZGVmYXVsdENvbmZpZ3VyYXRpb24uaGVhZGVycywgJ29iamVjdCcsIHt9ICkgKSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX2tleToge1xyXG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAna2V5JyBdLCAnc3RyaW5nJywgJ2lkJyApIHx8ICdpZCcsXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19rZXlsZXNzOiB7XHJcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNbICdrZXlsZXNzJyBdID09PSB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fbmFtZToge1xyXG4gICAgICAgIHZhbHVlOiBfbmFtZSB8fCBwcm9wZXJ0aWVzWyAnbmFtZScgXSB8fCAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBfX3VybDoge1xyXG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAndXJsJyBdLCAnc3RyaW5nJywgJycgKSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBidXN5OiB7XHJcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0gKTtcclxuXHJcbiAgICBpZiAoICEgc2VsZi5fX2tleWxlc3MgKSB7XHJcbiAgICAgIHRoaXMuJHByb3BlcnR5KCB0aGlzLl9fa2V5ICk7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19wcm9wZXJ0aWVzLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgICAgc2VsZi4kcHJvcGVydHkoIF9rZXksIHNlbGYuX19wcm9wZXJ0aWVzWyBfa2V5IF0gKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICBzZWxmLm9uKCAncHJlZ2V0JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcclxuICAgIHNlbGYub24oICdnZXQnLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XHJcbiAgfTtcclxuXHJcbiAgTW9kZWxGYWN0b3J5LnByb3RvdHlwZS5zY2hlbWEgPSBmdW5jdGlvbiAoIHNjaGVtYSApIHtcclxuXHJcbiAgICBPYmplY3Qua2V5cyggY2FzdCggc2NoZW1hLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgICAgc2VsZi4kcHJvcGVydHkoIF9rZXksIHNjaGVtYVsgX2tleSBdICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgTW9kZWxGYWN0b3J5LnByb3RvdHlwZS5wcm90byA9IGZ1bmN0aW9uICggcHJvdG8gKSB7XHJcblxyXG4gICAgdGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gPSB0aGlzLl9fcHJvcGVydGllcy5wcm90byB8fCB7fTtcclxuICAgIGhlbHBlcnMuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90bywgcHJvdG8gKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBNb2RlbEZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICggX2luaXRpYWwgKSB7XHJcblxyXG4gICAgdmFyIEtsYXNzID0gQmFzZU1vZGVsLmV4dGVuZCggdGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gfHwge30gKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IEtsYXNzKCBfaW5pdGlhbCwgdGhpcyApO1xyXG4gIH07XHJcblxyXG4gIE1vZGVsRmFjdG9yeS5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuICAgICAgcmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IF9oZWFkZXJzIDogc2VsZi5fX2hlYWRlcnM7XHJcbiAgICByZXR1cm4gaXMubm90LmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IHNlbGYuX19oZWFkZXJzIDogc2VsZjtcclxuICB9O1xyXG5cclxuICBNb2RlbEZhY3RvcnkucHJvdG90eXBlLiRnZXQgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICB1cmwgPSBzZWxmLiR1cmwoKSxcclxuICAgICAgbWV0aG9kID0gJ2dldCcsXHJcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wXHJcbiAgICAgIHdhc0Rlc3Ryb3llZCA9IHNlbGYuX19kZXN0cm95ZWQ7XHJcblxyXG4gICAgc2VsZi5lbWl0KCAncHJlZ2V0Jywge1xyXG4gICAgICBtb2xkeTogc2VsZixcclxuICAgICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcclxuICAgICAgdXJsOiB1cmwsXHJcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgfSApO1xyXG5cclxuICAgIHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgcmVxdWVzdCggc2VsZiwgbnVsbCwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuICAgICAgLy92YXIgcmVzID0gX3JlcyBpbnN0YW5jZW9mIEJhc2VNb2RlbCA/IF9yZXMgOiBudWxsO1xyXG5cclxuICAgICAgLyppZiAoIGlzLmFuLmFycmF5KCBfcmVzICkgJiYgX3Jlc1sgMCBdIGluc3RhbmNlb2YgQmFzZU1vZGVsICkge1xyXG4gICAgICAgIHNlbGYuJGRhdGEoIF9yZXNbIDAgXS4kanNvbigpICk7XHJcbiAgICAgICAgcmVzID0gc2VsZjtcclxuICAgICAgfSovXHJcbiAgICAgIC8qXHJcbiAgICAgIGlmICggX2Vycm9yICYmIHdhc0Rlc3Ryb3llZCApIHtcclxuICAgICAgICBzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgICAgfSovXHJcblxyXG4gICAgICBzZWxmLmVtaXQoICdnZXQnLCBfZXJyb3IsIF9yZXMgKTtcclxuXHJcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIF9lcnJvciwgX3JlcyBdICk7XHJcbiAgICB9ICk7XHJcbiAgfTtcclxuXHJcbiAgTW9kZWxGYWN0b3J5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBiYXNlID0gaXMuZW1wdHkoIHNlbGYuJGJhc2VVcmwoKSApID8gJycgOiBzZWxmLiRiYXNlVXJsKCksXHJcbiAgICAgIG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcclxuICAgICAgdXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxyXG4gICAgICBlbmRwb2ludCA9IGJhc2UgKyBuYW1lICsgKCBpcy5lbXB0eSggdXJsICkgPyAnJyA6ICcvJyArIHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApICk7XHJcblxyXG4gICAgc2VsZi5fX3VybCA9IHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApO1xyXG5cclxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcclxuICB9O1xyXG5cclxuICBNb2RlbEZhY3RvcnkucHJvdG90eXBlLl9fZGVmYXVsdE1pZGRsZXdhcmUgPSBkZWZhdWx0TWlkZGxld2FyZTtcclxuXHJcbiAgTW9kZWxGYWN0b3J5LnByb3RvdHlwZS4kYmFzZVVybCA9IGZ1bmN0aW9uICggX2Jhc2UgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIHVybCA9IGNhc3QoIF9iYXNlLCAnc3RyaW5nJywgc2VsZi5fX2Jhc2VVcmwgfHwgJycgKTtcclxuXHJcbiAgICBzZWxmLl9fYmFzZVVybCA9IHVybC50cmltKCkucmVwbGFjZSggLyhcXC98XFxzKSskL2csICcnICkgfHwgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCB8fCAnJztcclxuXHJcbiAgICByZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfYmFzZSApID8gc2VsZi5fX2Jhc2VVcmwgOiBzZWxmO1xyXG4gIH07XHJcbiAgXHJcbiAgTW9kZWxGYWN0b3J5LnByb3RvdHlwZS4kY29sbGVjdGlvbiA9IGZ1bmN0aW9uICggX3F1ZXJ5LCBfY2FsbGJhY2sgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIHVybCA9IHNlbGYuJHVybCgpLFxyXG4gICAgICBtZXRob2QgPSAnZ2V0JyxcclxuICAgICAgcXVlcnkgPSBpcy5hbi5vYmplY3QoIF9xdWVyeSApID8gX3F1ZXJ5IDoge30sXHJcbiAgICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfcXVlcnkgKSA/IF9xdWVyeSA6IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XHJcblxyXG4gICAgc2VsZi5lbWl0KCAncHJlY29sbGVjdGlvbicsIHtcclxuICAgICAgbW9sZHk6IHNlbGYsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBxdWVyeTogcXVlcnksXHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgIH0gKTtcclxuXHJcbiAgICByZXF1ZXN0KCBzZWxmLCBudWxsLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG4gICAgICB2YXIgcmVzID0gY2FzdCggX3JlcyBpbnN0YW5jZW9mIEJhc2VNb2RlbCB8fCBpcy5hbi5hcnJheSggX3JlcyApID8gX3JlcyA6IG51bGwsICdhcnJheScsIFtdICk7XHJcbiAgICAgIHNlbGYuZW1pdCggJ2NvbGxlY3Rpb24nLCBfZXJyb3IsIHJlcyApO1xyXG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBfZXJyb3IsIHJlcyBdICk7XHJcbiAgICB9ICk7XHJcblxyXG4gIH07XHJcblxyXG4gIE1vZGVsRmFjdG9yeS5wcm90b3R5cGUuJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKCBvYmosIGtleSwgdmFsdWUgKSB7XHJcblxyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGV4aXN0aW5nVmFsdWUgPSBvYmpbIGtleSBdIHx8IHZhbHVlLFxyXG4gICAgICAgIG1ldGFkYXRhID0gdGhpcy5fX21ldGFkYXRhWyBrZXkgXTtcclxuXHJcbiAgICBpZiAoICFvYmouaGFzT3duUHJvcGVydHkoIGtleSApIHx8ICFvYmouX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcclxuICAgICAgaWYgKCBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheU1vbGR5IHx8IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5U3RyaW5nICkge1xyXG4gICAgICAgIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSA9IG1ldGFkYXRhLnZhbHVlO1xyXG4gICAgICAgIG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID0gbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlNb2xkeTtcclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheVN0cmluZztcclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ICkge1xyXG5cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7XHJcbiAgICAgICAgICB2YWx1ZTogbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0sXHJcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggbWV0YWRhdGEudmFsdWVJc0FTdGF0aWNNb2xkeSApIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IG5ldyBNb2RlbEZhY3RvcnkoIG1ldGFkYXRhLnZhbHVlLm5hbWUsIG1ldGFkYXRhLnZhbHVlICkuY3JlYXRlKCksXHJcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSApIHtcclxuXHJcbiAgICAgICAgdmFyIGFycmF5ID0gb2JzZXJ2YWJsZUFycmF5KCBbXSApLFxyXG4gICAgICAgICAgYXR0cmlidXRlVHlwZSA9IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyB8fCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA/IG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZVsgMCBdIDogJyonO1xyXG5cclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVzLmFycmF5T2ZBVHlwZSA9IHRydWU7XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuICAgICAgICAgIHZhbHVlOiBhcnJheSxcclxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcclxuICAgICAgICB9ICk7XHJcblxyXG4gICAgICAgIG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcclxuXHJcbiAgICAgICAgWyAncHVzaCcsICd1bnNoaWZ0JyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcclxuICAgICAgICAgIGFycmF5Lm9uKCBfbWV0aG9kLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxyXG4gICAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xyXG4gICAgICAgICAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb2xkeSA9IG5ldyBNb2RlbEZhY3RvcnkoIGF0dHJpYnV0ZVR5cGVbICduYW1lJyBdLCBhdHRyaWJ1dGVUeXBlICksXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEgPSBpcy5hbi5vYmplY3QoIF9pdGVtICkgPyBfaXRlbSA6IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKCBtb2xkeS5jcmVhdGUoIGRhdGEgKSApO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCggY2FzdCggX2l0ZW0sIGF0dHJpYnV0ZVR5cGUsIG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gKTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5WyAnX18nICsgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgdmFsdWVzICk7XHJcbiAgICAgICAgICB9ICk7XHJcbiAgICAgICAgfSApO1xyXG5cclxuICAgICAgICBpZiggZXhpc3RpbmdWYWx1ZSAmJiBleGlzdGluZ1ZhbHVlLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICBleGlzdGluZ1ZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggbyApIHtcclxuICAgICAgICAgICAgb2JqWyBrZXkgXS5wdXNoKCBvICk7XHJcbiAgICAgICAgICB9ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7XHJcbiAgICAgICAgICBnZXQ6IGhlbHBlcnMuZ2V0UHJvcGVydHkoIGtleSApLFxyXG4gICAgICAgICAgc2V0OiBoZWxwZXJzLnNldFByb3BlcnR5KCBrZXkgKSxcclxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcclxuICAgICAgICB9ICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9iai5fX2F0dHJpYnV0ZXNbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIGV4aXN0aW5nVmFsdWUgIT09IHZvaWQgMCApIHsgLy9pZiBleGlzdGluZyB2YWx1ZVxyXG4gICAgICBvYmpbIGtleSBdID0gZXhpc3RpbmdWYWx1ZTtcclxuICAgIH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBvYmpbIGtleSBdICkgJiYgbWV0YWRhdGEuYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgJiYgaXMubm90Lm51bGxPclVuZGVmaW5lZCggbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApIHtcclxuICAgICAgb2JqWyBrZXkgXSA9IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xyXG4gICAgfSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcclxuICAgICAgaWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5IHx8IG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9iai5fX2RhdGFbIGtleSBdID0gaXMuZW1wdHkoIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApID8gdW5kZWZpbmVkIDogY2FzdCggdW5kZWZpbmVkLCBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIE1vZGVsRmFjdG9yeS5wcm90b3R5cGUuJHByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5LCBfdmFsdWUgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGF0dHJpYnV0ZXMgPSBuZXcgaGVscGVycy5hdHRyaWJ1dGVzKCBfa2V5LCBfdmFsdWUgKSxcclxuICAgICAgLy9leGlzdGluZ1ZhbHVlID0gc2VsZlsgX2tleSBdLFxyXG4gICAgICBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ID0gaXMuYS5zdHJpbmcoIGF0dHJpYnV0ZXMudHlwZSApICYmIC9tb2xkeS8udGVzdCggYXR0cmlidXRlcy50eXBlICksXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSBpcy5hbi5hcnJheSggYXR0cmlidXRlcy50eXBlICksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5TW9sZHkgPSBpcy5hbi5hcnJheSggX3ZhbHVlICkgJiYgaGFzS2V5KCBfdmFsdWVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG4gICAgICB2YWx1ZUlzQW5BcnJheVN0cmluZyA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBpcy5hLnN0cmluZyggX3ZhbHVlWyAwIF0gKSxcclxuICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGhhc0tleSggYXR0cmlidXRlcy50eXBlWyAwIF0sICdwcm9wZXJ0aWVzJywgJ29iamVjdCcgKSxcclxuICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gYXR0cmlidXRlVHlwZUlzQW5BcnJheSAmJiBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlWyAwIF0gKSAmJiBpcy5ub3QuZW1wdHkoIGF0dHJpYnV0ZXMudHlwZVsgMCBdICksXHJcbiAgICAgIHZhbHVlSXNBU3RhdGljTW9sZHkgPSBoYXNLZXkoIF92YWx1ZSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApO1xyXG5cclxuICAgIHNlbGYuX19tZXRhZGF0YVsgX2tleSBdID0ge1xyXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG4gICAgICB2YWx1ZTogX3ZhbHVlLFxyXG4gICAgICBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5OiBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5LFxyXG4gICAgICBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5OiBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5LFxyXG4gICAgICB2YWx1ZUlzQW5BcnJheU1vbGR5OiB2YWx1ZUlzQW5BcnJheU1vbGR5LFxyXG4gICAgICB2YWx1ZUlzQW5BcnJheVN0cmluZzogdmFsdWVJc0FuQXJyYXlTdHJpbmcsXHJcbiAgICAgIGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5OiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSxcclxuICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nOiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcsXHJcbiAgICAgIHZhbHVlSXNBU3RhdGljTW9sZHk6IHZhbHVlSXNBU3RhdGljTW9sZHlcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHNlbGY7XHJcbiAgfTtcclxuXHJcbiAgZW1pdHRlciggTW9kZWxGYWN0b3J5LnByb3RvdHlwZSApO1xyXG4gIHVzZWlmeSggTW9kZWxGYWN0b3J5ICk7XHJcbiAgXHJcbiAgcmV0dXJuIE1vZGVsRmFjdG9yeTtcclxuXHJcbn07IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoICcuL2NvbmZpZy5qc29uJyApLFxyXG4gIG1vbGR5QXBpID0ge30sXHJcbiAgdXNlaWZ5ID0gcmVxdWlyZSggJ3NjLXVzZWlmeScgKTtcclxuXHJcbnVzZWlmeSggbW9sZHlBcGkgKTtcclxuXHJcbnZhciBNb2RlbEZhY3RvcnkgPSByZXF1aXJlKCAnLi9mYWN0b3J5JyApKCByZXF1aXJlKCAnLi9tb2xkeScgKSwgY29uZmlnLmRlZmF1bHRzLCBtb2xkeUFwaS5taWRkbGV3YXJlICk7XHJcblxyXG5tb2xkeUFwaS5leHRlbmQgPSBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcclxuICByZXR1cm4gbmV3IE1vZGVsRmFjdG9yeSggX25hbWUsIF9wcm9wZXJ0aWVzICk7XHJcbn07XHJcblxyXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBtb2xkeUFwaTtcclxuZXhwb3J0cy5kZWZhdWx0cyA9IGNvbmZpZy5kZWZhdWx0czsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXHJcbiAgY2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxyXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApO1xyXG5cclxuZXhwb3J0cy5hdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCBfa2V5LCBfdmFsdWUgKSB7XHJcbiAgdmFyIHZhbHVlO1xyXG5cclxuICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcclxuICAgIHZhbHVlID0ge1xyXG4gICAgICB0eXBlOiBfdmFsdWVcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICggaXMuYW4ub2JqZWN0KCBfdmFsdWUgKSAmJiBfdmFsdWVbICdfX2lzTW9sZHknIF0gPT09IHRydWUgKSB7XHJcbiAgICB2YWx1ZSA9IHtcclxuICAgICAgdHlwZTogJ21vbGR5JyxcclxuICAgICAgZGVmYXVsdDogX3ZhbHVlXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhbHVlID0gX3ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1lcmdlKCB7XHJcbiAgICBuYW1lOiBfa2V5IHx8ICcnLFxyXG4gICAgdHlwZTogJycsXHJcbiAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgb3B0aW9uYWw6IGZhbHNlXHJcbiAgfSwgdmFsdWUgKTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9fZGF0YVsgX2tleSBdO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydHMuZGVzdHJveWVkRXJyb3IgPSBmdW5jdGlvbiAoIF9tb2xkeSApIHtcclxuICB2YXIgaXRlbSA9IHR5cGVvZiBfbW9sZHkgPT09ICdvYmplY3QnID8gX21vbGR5IDoge307XHJcbiAgcmV0dXJuIG5ldyBFcnJvciggJ1RoZSBnaXZlbiBtb2xkeSBpdGVtIGAnICsgaXRlbS5fX25hbWUgKyAnYCBoYXMgYmVlbiBkZXN0cm95ZWQnICk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBfc2VsZi5idXN5ID0gdHJ1ZTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnRzLnNldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgYXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXHJcbiAgICAgIHZhbHVlID0gYXR0cmlidXRlcy50eXBlID8gY2FzdCggX3ZhbHVlLCBhdHRyaWJ1dGVzLnR5cGUsIGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgOiBfdmFsdWU7XHJcblxyXG4gICAgaWYgKCBzZWxmLl9fZGF0YVsgX2tleSBdICE9PSB2YWx1ZSApIHtcclxuICAgICAgc2VsZi5lbWl0KCAnY2hhbmdlJywgc2VsZi5fX2RhdGFbIF9rZXkgXSwgdmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLl9fZGF0YVsgX2tleSBdID0gdmFsdWU7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0cy51bnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBfc2VsZi5idXN5ID0gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gKCkge307XHJcblxyXG52YXIgX2V4dGVuZCA9IGZ1bmN0aW9uKCBvYmogKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICkuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcclxuICAgICAgaWYgKCBzb3VyY2UgKSB7XHJcbiAgICAgICAgZm9yICggdmFyIHByb3AgaW4gc291cmNlICkge1xyXG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG9iajtcclxufTtcclxuXHJcbmV4cG9ydHMuZXh0ZW5kID0gX2V4dGVuZDtcclxuXHJcbmV4cG9ydHMuZXh0ZW5kT2JqZWN0ID0gZnVuY3Rpb24oIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzICkge1xyXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xyXG4gIHZhciBjaGlsZDtcclxuXHJcbiAgaWYgKCBwcm90b1Byb3BzICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggcHJvdG9Qcm9wcywgJ2NvbnN0cnVjdG9yJyApICkge1xyXG4gICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGlsZCA9IGZ1bmN0aW9uKCApeyByZXR1cm4gcGFyZW50LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTsgfTtcclxuICB9XHJcblxyXG4gIF9leHRlbmQoIGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzICk7XHJcblxyXG4gIHZhciBTdXJyb2dhdGUgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XHJcblxyXG4gIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xyXG4gIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XHJcblxyXG4gICBpZiAocHJvdG9Qcm9wcykgX2V4dGVuZCggY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzICk7XHJcblxyXG4gICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuICByZXR1cm4gY2hpbGQ7XHJcbn07IiwidmFyIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuICBlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxyXG4gIGhhc0tleSA9IHJlcXVpcmUoICdzYy1oYXNrZXknICksXHJcbiAgaGVscGVycyA9IHJlcXVpcmUoICcuL2hlbHBlcnMnICksXHJcbiAgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXHJcbiAgbWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICksXHJcbiAgcmVxdWVzdCA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXHJcbiAgZXh0ZW5kID0gaGVscGVycy5leHRlbmRPYmplY3QsXHJcbiAgTW9kZWxGYWN0b3J5ID0gcmVxdWlyZSggXCIuL2ZhY3RvcnlcIiApLFxyXG4gIHVzZWlmeSA9IHJlcXVpcmUoICdzYy11c2VpZnknICk7XHJcblxyXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoIGluaXRpYWwsIF9fbW9sZHkgKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpbml0aWFsID0gaW5pdGlhbCB8fCB7fTtcclxuXHJcbiAgdGhpcy5fX21vbGR5ID0gX19tb2xkeTtcclxuICB0aGlzLl9faXNNb2xkeSA9IHRydWU7XHJcbiAgdGhpcy5fX2F0dHJpYnV0ZXMgPSB7fTtcclxuICB0aGlzLl9fZGF0YSA9IHt9O1xyXG4gIHRoaXMuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuICBcclxuICBpZiAoICEgc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyApIHtcclxuICAgIHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIHNlbGYuX19tb2xkeS5fX2tleSApO1xyXG4gIH1cclxuXHJcbiAgT2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgIHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIGluaXRpYWxbIF9rZXkgXSApO1xyXG4gIH0gKTtcclxuXHJcbiAgZm9yKCB2YXIgaSBpbiBpbml0aWFsICkge1xyXG4gICAgaWYoIGluaXRpYWwuaGFzT3duUHJvcGVydHkoIGkgKSAmJiBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YVsgaSBdICkge1xyXG4gICAgICB0aGlzWyBpIF0gPSBpbml0aWFsWyBpIF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZWxmLm9uKCAncHJlc2F2ZScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XHJcbiAgc2VsZi5vbiggJ3NhdmUnLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XHJcblxyXG4gIHNlbGYub24oICdwcmVkZXN0cm95JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcclxuICBzZWxmLm9uKCAnZGVzdHJveScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgT2JqZWN0LmtleXMoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gICAgaWYgKCBoYXNLZXkoIHNlbGZbIF9rZXkgXSwgJ19faXNNb2xkeScsICdib29sZWFuJyApICYmIHNlbGZbIF9rZXkgXS5fX2lzTW9sZHkgPT09IHRydWUgKSB7XHJcbiAgICAgIHNlbGZbIF9rZXkgXS4kY2xlYXIoKTtcclxuICAgIH0gZWxzZSBpZiAoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlICkge1xyXG4gICAgICB3aGlsZSAoIHNlbGZbIF9rZXkgXS5sZW5ndGggPiAwICkge1xyXG4gICAgICAgIHNlbGZbIF9rZXkgXS5zaGlmdCgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmWyBfa2V5IF0gPSBzZWxmLl9fZGF0YVsgX2tleSBdID0gdm9pZCAwO1xyXG4gICAgfVxyXG4gIH0gKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAkY2xvbmUgd29uJ3Qgd29yayBjdXJyZW50bHlcclxuICogQHBhcmFtICB7W3R5cGVdfSBfZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLiRjbG9uZSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBpbml0aWFsVmFsdWVzID0gdGhpcy4kanNvbigpO1xyXG5cclxuICAvLyAgZGF0YSA9IGlzLmFuLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDogc2VsZi5fX2RhdGE7XHJcbiAgaGVscGVycy5leHRlbmQoIGluaXRpYWxWYWx1ZXMsIF9kYXRhIHx8IHt9ICApO1xyXG5cclxuICB2YXIgbmV3TW9sZHkgPSB0aGlzLl9fbW9sZHkuY3JlYXRlKCBpbml0aWFsVmFsdWVzICk7XHJcbiAgICAvKiB0aGlzLl9fbW9sZHluZXcgTW9kZWxGYWN0b3J5KCBzZWxmLl9fbmFtZSwge1xyXG4gICAgICBiYXNlVXJsOiBzZWxmLl9fbW9sZHkuJGJhc2VVcmwoKSxcclxuICAgICAgaGVhZGVyczogc2VsZi5fX2hlYWRlcnMsXHJcbiAgICAgIGtleTogc2VsZi5fX2tleSxcclxuICAgICAga2V5bGVzczogc2VsZi5fX2tleWxlc3MsXHJcbiAgICAgIHVybDogc2VsZi5fX3VybFxyXG4gICAgfSApOyovXHJcblxyXG4gIC8qXHJcbiAgT2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfcHJvcGVydHlLZXkgKSB7XHJcbiAgICBuZXdNb2xkeS4kcHJvcGVydHkoIF9wcm9wZXJ0eUtleSwgbWVyZ2UoIHNlbGYuX19hdHRyaWJ1dGVzWyBfcHJvcGVydHlLZXkgXSApICk7XHJcbiAgICBpZiAoIGlzLmFuLmFycmF5KCBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0gKSAmJiBpcy5hbi5hcnJheSggZGF0YVsgX3Byb3BlcnR5S2V5IF0gKSApIHtcclxuICAgICAgZGF0YVsgX3Byb3BlcnR5S2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YUl0ZW0gKSB7XHJcbiAgICAgICAgbmV3TW9sZHlbIF9wcm9wZXJ0eUtleSBdLnB1c2goIF9kYXRhSXRlbSApO1xyXG4gICAgICB9ICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0gPSBkYXRhWyBfcHJvcGVydHlLZXkgXVxyXG4gICAgfVxyXG4gIH0gKTsqL1xyXG5cclxuICByZXR1cm4gbmV3TW9sZHk7XHJcbn07XHJcblxyXG4gIE1vZGVsLnByb3RvdHlwZS4kZGF0YSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGRhdGEgPSBpcy5vYmplY3QoIF9kYXRhICkgPyBfZGF0YSA6IHt9O1xyXG5cclxuICAgIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuICAgICAgcmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgICAgaWYgKCBzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xyXG4gICAgICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGhhc0tleSggc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSwgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApICYmIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlID09PSB0cnVlICkge1xyXG4gICAgICAgICAgZGF0YVsgX2tleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX21vbGR5ICkge1xyXG4gICAgICAgICAgICBzZWxmWyBfa2V5IF0ucHVzaCggX21vbGR5ICk7XHJcbiAgICAgICAgICB9ICk7XHJcbiAgICAgICAgfSBlbHNlIGlmICggaXMuYS5vYmplY3QoIGRhdGFbIF9rZXkgXSApICYmIHNlbGZbIF9rZXkgXSBpbnN0YW5jZW9mIE1vZGVsICkge1xyXG4gICAgICAgICAgc2VsZlsgX2tleSBdLiRkYXRhKCBkYXRhWyBfa2V5IF0gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VsZlsgX2tleSBdID0gZGF0YVsgX2tleSBdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSApO1xyXG5cclxuICAgIHJldHVybiBzZWxmO1xyXG4gIH07XHJcbiAgXHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGRlc3Ryb3kgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICBpc0RpcnR5ID0gc2VsZi4kaXNEaXJ0eSgpLFxyXG4gICAgZGF0YSA9IHNlbGYuJGpzb24oKSxcclxuICAgIHVybCA9IHNlbGYuX19tb2xkeS4kdXJsKCkgKyAoIHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyAnJyA6ICcvJyArIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdICksXHJcbiAgICBtZXRob2QgPSAnZGVsZXRlJyxcclxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcbiAgaWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKSBdICk7XHJcbiAgfVxyXG5cclxuICBzZWxmLmVtaXQoICdwcmVkZXN0cm95Jywge1xyXG4gICAgbW9sZHk6IHNlbGYsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICB1cmw6IHVybCxcclxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gIH0gKTtcclxuXHJcbiAgaWYgKCAhaXNEaXJ0eSApIHtcclxuICByZXF1ZXN0KCBzZWxmLl9fbW9sZHksIHNlbGYsIGRhdGEsIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuICAgIHNlbGYuZW1pdCggJ2Rlc3Ryb3knLCBfZXJyb3IsIF9yZXMgKTtcclxuICAgICAgc2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICAgIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdID0gdW5kZWZpbmVkO1xyXG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XHJcbiAgICB9ICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIG5ldyBFcnJvciggJ1RoaXMgbW9sZHkgY2Fubm90IGJlIGRlc3Ryb3llZCBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyIHlldC4nICkgXSApO1xyXG4gIH1cclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGlzRGlydHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuX19kZXN0cm95ZWQgPyB0cnVlIDogaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19tb2xkeS5fX2tleSBdICk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCB0aGlzLl9fZGVzdHJveWVkICkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgaXNWYWxpZCA9IHRydWU7XHJcblxyXG4gIE9iamVjdC5rZXlzKCBzZWxmLl9fYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHJcbiAgICBpZiAoIHNlbGYuJGlzRGlydHkoKSAmJiBfa2V5ID09PSBzZWxmLl9fbW9sZHkuX19rZXkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdmFsdWUgPSBzZWxmWyBfa2V5IF0sXHJcbiAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG4gICAgICB0eXBlID0gYXR0cmlidXRlcy50eXBlLFxyXG4gICAgICBhcnJheU9mQVR5cGUgPSBoYXNLZXkoIGF0dHJpYnV0ZXMsICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSA/IGF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID09PSB0cnVlIDogZmFsc2UsXHJcbiAgICAgIGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsICE9PSB0cnVlLFxyXG4gICAgICBpc051bGxPclVuZGVmaW5lZCA9IHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyBmYWxzZSA6IGFycmF5T2ZBVHlwZSA/IHZhbHVlLmxlbmd0aCA9PT0gMCA6IGlzLm51bGxPclVuZGVmaW5lZCggdmFsdWUgKSxcclxuICAgICAgdHlwZUlzV3JvbmcgPSBpcy5ub3QuZW1wdHkoIHR5cGUgKSAmJiBpcy5hLnN0cmluZyggdHlwZSApID8gaXMubm90LmFbIHR5cGUgXSggdmFsdWUgKSA6IGlzTnVsbE9yVW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICggYXJyYXlPZkFUeXBlICYmIGlzLm5vdC5lbXB0eSggdmFsdWUgKSAmJiB2YWx1ZVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgIHZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XHJcbiAgICAgICAgaWYgKCBpc1ZhbGlkICYmIF9pdGVtLiRpc1ZhbGlkKCkgPT09IGZhbHNlICkge1xyXG4gICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggaXNWYWxpZCAmJiBpc1JlcXVpcmVkICYmIHR5cGVJc1dyb25nICkge1xyXG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gIH0gKTtcclxuXHJcbiAgcmV0dXJuIGlzVmFsaWQ7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGpzb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgZGF0YSA9IHNlbGYuX19kYXRhLFxyXG4gICAganNvbiA9IHt9O1xyXG5cclxuICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGRhdGFbIF9rZXkgXVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgIGpzb25bIF9rZXkgXSA9IFtdO1xyXG4gICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcbiAgICAgICAganNvblsgX2tleSBdLnB1c2goIF9tb2xkeS4kanNvbigpICk7XHJcbiAgICAgIH0gKTtcclxuICB9IGVsc2Uge1xyXG4gICAganNvblsgX2tleSBdID0gZGF0YVsgX2tleSBdIGluc3RhbmNlb2YgTW9kZWwgPyBkYXRhWyBfa2V5IF0uJGpzb24oKSA6IGRhdGFbIF9rZXkgXTtcclxuICAgIH1cclxuICB9ICk7XHJcblxyXG4gIHJldHVybiBqc29uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRzYXZlID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgZXJyb3IgPSBudWxsLFxyXG4gICAgaXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcclxuICAgIGRhdGEgPSBzZWxmLiRqc29uKCksXHJcbiAgICB1cmwgPSBzZWxmLl9fbW9sZHkuJHVybCgpICsgKCAhaXNEaXJ0eSAmJiAhc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyA/ICcvJyArIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdIDogJycgKSxcclxuICAgIG1ldGhvZCA9IGlzRGlydHkgPyAncG9zdCcgOiAncHV0JyxcclxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcbiAgc2VsZi5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuICBzZWxmLmVtaXQoICdwcmVzYXZlJywge1xyXG4gICAgbW9sZHk6IHNlbGYsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICB1cmw6IHVybCxcclxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gIH0gKTtcclxuXHJcbiAgcmVxdWVzdCggc2VsZi5fX21vbGR5LCBzZWxmLCBkYXRhLCBtZXRob2QsIHVybCwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcbiAgICBzZWxmLmVtaXQoICdzYXZlJywgX2Vycm9yLCBfcmVzICk7XHJcbiAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7IC8vbm90IHN1cmUgYWJvdXQgdGhhdCAhIHdoeSBwYXNzaW5nIHRoZSBjb250ZXh0ID9cclxuICB9ICk7XHJcblxyXG59O1xyXG5cclxuZW1pdHRlciggTW9kZWwucHJvdG90eXBlICk7XHJcbnVzZWlmeSggTW9kZWwgKTtcclxuXHJcbk1vZGVsLmV4dGVuZCA9IGV4dGVuZDtcclxuXHJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsInZhciBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuICBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXHJcbiAgaGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKTtcclxuLyoqXHJcbiAqIEZldGNoaW5nIHRoZSBkYXRhXHJcbiAqIEBwYXJhbSAge1t0eXBlXX0gX21vbGR5ICAgIFtkZXNjcmlwdGlvbl1cclxuICogQHBhcmFtICB7W3R5cGVdfSBfZGF0YSAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9tZXRob2QgICBbZGVzY3JpcHRpb25dXHJcbiAqIEBwYXJhbSAge1t0eXBlXX0gX3VybCAgICAgIFtkZXNjcmlwdGlvbl1cclxuICogQHBhcmFtICB7W3R5cGVdfSBfY2FsbGJhY2sgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX21vbGR5LCBpbnN0YW5jZSwgX2RhdGEsIF9tZXRob2QsIF91cmwsIF9jYWxsYmFjayApIHtcclxuICB2YXIgbW9sZHkgPSBfbW9sZHksXHJcbiAgICByZXN1bHQgPSBbXSxcclxuICAgIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgPSBoYXNLZXkoIF9kYXRhLCBtb2xkeS5fX2tleSApICYmIGlzLm5vdC5lbXB0eSggX2RhdGFbIG1vbGR5Ll9fa2V5IF0gKSAmJiAvZ2V0Ly50ZXN0KCBfbWV0aG9kICksXHJcbiAgICBpc0luc3RhbmNlID0gaW5zdGFuY2UgPyB0cnVlIDogZmFsc2UsXHJcbiAgICBpc0RpcnR5ID0gaXNJbnN0YW5jZSA/IGluc3RhbmNlLiRpc0RpcnR5KCkgOiBmYWxzZTtcclxuXHJcbiAgbW9sZHkuX19kZWZhdWx0TWlkZGxld2FyZSggZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXNwb25zZSApIHtcclxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxyXG4gICAgICBlcnJvciA9IF9lcnJvciA9PT0gbW9sZHkgPyBudWxsIDogYXJncy5zaGlmdCgpLFxyXG4gICAgICByZXNwb25zZSA9IGFyZ3Muc2hpZnQoKTtcclxuXHJcbiAgICBpZiAoIGVycm9yICYmICEoIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcclxuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkJyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggIWVycm9yICYmIGlzSW5zdGFuY2UgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIHJlc3BvbnNlICkgJiYgKCByZXNwb25zZVNob3VsZENvbnRhaW5BbklkICYmICFoYXNLZXkoIHJlc3BvbnNlLCBtb2xkeS5fX2tleSApICkgKSB7XHJcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIG1vbGR5Ll9fa2V5ICsgJ2AnICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCAhZXJyb3IgJiYgaXNEaXJ0eSAmJiBpc0luc3RhbmNlICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSApIHtcclxuICAgICAgbW9sZHlbIG1vbGR5Ll9fa2V5IF0gPSByZXNwb25zZVsgbW9sZHkuX19rZXkgXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoICFlcnJvciApIHtcclxuICAgICAgaWYoICFpc0luc3RhbmNlICkge1xyXG4gICAgICAgIGlmICggaXMuYXJyYXkoIHJlc3BvbnNlICkgKSB7XHJcblxyXG4gICAgICAgICAgcmVzcG9uc2UuZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKCBtb2xkeS5jcmVhdGUoIF9kYXRhICkgKTtcclxuICAgICAgICAgIH0gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzdWx0ID0gbW9sZHkuY3JlYXRlKCByZXNwb25zZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnN0YW5jZS4kZGF0YSggcmVzcG9uc2UgKTtcclxuICAgICAgICByZXN1bHQgPSBpbnN0YW5jZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIF9jYWxsYmFjayAmJiBfY2FsbGJhY2soIGVycm9yLCByZXN1bHQgKTtcclxuXHJcbiAgfSwgX21vbGR5LCBfZGF0YSwgX21ldGhvZCwgX3VybCApO1xyXG5cclxufTsiXX0=
(20)
});
