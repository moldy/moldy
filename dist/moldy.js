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
var cast = _dereq_( 'sc-cast' ),
	emitter = _dereq_( 'emitter-component' ),
	hasKey = _dereq_( 'sc-haskey' ),
	helpers = _dereq_( './helpers' ),
	is = _dereq_( 'sc-is' ),
	merge = _dereq_( 'sc-merge' ),
	observableArray = _dereq_( 'sg-observable-array' ),
	request = _dereq_( './request' ),
	useify = _dereq_( 'sc-useify' );

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
			value: merge( {}, cast( properties[ 'headers' ], 'object', {} ), cast( Moldy.defaults.headers, 'object', {} ) ),
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

	self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || Moldy.defaults.baseUrl || '';

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

exports = module.exports = Moldy;
exports.defaults = {
	baseUrl: '',
	headers: {}
};
},{"./helpers":19,"./request":20,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sc-useify":16,"sg-observable-array":17}],19:[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy11c2VpZnkvY29uZmlnLmpzb24iLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy11c2VpZnkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2Zha2VfNzYyMWVmZjEuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L3NyYy9oZWxwZXJzL2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsInZhciBjb250YWlucyA9IHJlcXVpcmUoIFwic2MtY29udGFpbnNcIiApLFxuICBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApO1xuXG52YXIgY2FzdCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfY2FzdFR5cGUsIF9kZWZhdWx0LCBfdmFsdWVzLCBfYWRkaXRpb25hbFByb3BlcnRpZXMgKSB7XG5cbiAgdmFyIHBhcnNlZFZhbHVlLFxuICAgIGNhc3RUeXBlID0gX2Nhc3RUeXBlLFxuICAgIHZhbHVlLFxuICAgIHZhbHVlcyA9IGlzLmFuLmFycmF5KCBfdmFsdWVzICkgPyBfdmFsdWVzIDogW107XG5cbiAgc3dpdGNoICggdHJ1ZSApIHtcbiAgY2FzZSAoIC9mbG9hdHxpbnRlZ2VyLy50ZXN0KCBjYXN0VHlwZSApICk6XG4gICAgY2FzdFR5cGUgPSBcIm51bWJlclwiO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCBpcy5hWyBjYXN0VHlwZSBdKCBfdmFsdWUgKSB8fCBjYXN0VHlwZSA9PT0gJyonICkge1xuXG4gICAgdmFsdWUgPSBfdmFsdWU7XG5cbiAgfSBlbHNlIHtcblxuICAgIHN3aXRjaCAoIHRydWUgKSB7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImFycmF5XCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSggX3ZhbHVlICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBbIF92YWx1ZSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYm9vbGVhblwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IC9eKHRydWV8MXx5fHllcykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IHRydWUgOiB1bmRlZmluZWQ7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGlmICggaXMubm90LmEuYm9vbGVhbiggdmFsdWUgKSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gL14oZmFsc2V8LTF8MHxufG5vKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGlzLmEuYm9vbGVhbiggdmFsdWUgKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiZGF0ZVwiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gbmV3IERhdGUoIF92YWx1ZSApO1xuICAgICAgICB2YWx1ZSA9IGlzTmFOKCB2YWx1ZS5nZXRUaW1lKCkgKSA/IHVuZGVmaW5lZCA6IHZhbHVlO1xuXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJzdHJpbmdcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy51bmRlZmluZWQoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoICggZSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gX3ZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJudW1iZXJcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy5ub3QuYS5udW1iZXIoIHZhbHVlICkgfHwgaXNOYU4oIHZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHN3aXRjaCAoIHRydWUgKSB7XG4gICAgICAgIGNhc2UgX2Nhc3RUeXBlID09PSBcImludGVnZXJcIjpcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCB2YWx1ZSApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBjYXN0KCBKU09OLnBhcnNlKCBfdmFsdWUgKSwgY2FzdFR5cGUgKVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIH1cblxuICB9XG5cbiAgaWYgKCB2YWx1ZXMubGVuZ3RoID4gMCAmJiAhY29udGFpbnMoIHZhbHVlcywgdmFsdWUgKSApIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1sgMCBdO1xuICB9XG5cbiAgcmV0dXJuIGlzLm5vdC51bmRlZmluZWQoIHZhbHVlICkgPyB2YWx1ZSA6IGlzLm5vdC51bmRlZmluZWQoIF9kZWZhdWx0ICkgPyBfZGVmYXVsdCA6IG51bGw7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdDsiLCJ2YXIgY29udGFpbnMgPSBmdW5jdGlvbiAoIGRhdGEsIGl0ZW0gKSB7XG4gIHZhciBmb3VuZE9uZSA9IGZhbHNlO1xuXG4gIGlmICggQXJyYXkuaXNBcnJheSggZGF0YSApICkge1xuXG4gICAgZGF0YS5mb3JFYWNoKCBmdW5jdGlvbiAoIGFycmF5SXRlbSApIHtcbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGl0ZW0gPT09IGFycmF5SXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gKTtcblxuICB9IGVsc2UgaWYgKCBPYmplY3QoIGRhdGEgKSA9PT0gZGF0YSApIHtcblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGRhdGFbIGtleSBdID09PSBpdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgfVxuICByZXR1cm4gZm91bmRPbmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsInZhciBndWlkUnggPSBcIns/WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezR9LVswLTlBLUZhLWZdezEyfX0/XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBndWlkID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKCAvW3h5XS9nLCBmdW5jdGlvbiAoIGMgKSB7XG4gICAgdmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG4gICAgcmV0dXJuICggYyA9PT0gXCJ4XCIgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZyggMTYgKTtcbiAgfSApO1xuICByZXR1cm4gZ3VpZDtcbn07XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAoIHN0cmluZyApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4LCBcImdcIiApLFxuICAgIG1hdGNoZXMgPSAoIHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIgPyBzdHJpbmcgOiBcIlwiICkubWF0Y2goIHJ4ICk7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBtYXRjaGVzICkgPyBtYXRjaGVzIDogW107XG59O1xuXG5leHBvcnRzLmlzVmFsaWQgPSBmdW5jdGlvbiAoIGd1aWQgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCApO1xuICByZXR1cm4gcngudGVzdCggZ3VpZCApO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApLFxuICBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBvYmplY3QgPSB0eXBlKCBvYmplY3QgKSA9PT0gXCJvYmplY3RcIiA/IG9iamVjdCA6IHt9LCBrZXlzID0gdHlwZSgga2V5cyApID09PSBcImFycmF5XCIgPyBrZXlzIDogW107XG4gIGtleVR5cGUgPSB0eXBlKCBrZXlUeXBlICkgPT09IFwic3RyaW5nXCIgPyBrZXlUeXBlIDogXCJcIjtcblxuICB2YXIga2V5ID0ga2V5cy5sZW5ndGggPiAwID8ga2V5cy5zaGlmdCgpIDogXCJcIixcbiAgICBrZXlFeGlzdHMgPSBoYXMuY2FsbCggb2JqZWN0LCBrZXkgKSB8fCBvYmplY3RbIGtleSBdICE9PSB2b2lkIDAsXG4gICAga2V5VmFsdWUgPSBrZXlFeGlzdHMgPyBvYmplY3RbIGtleSBdIDogdW5kZWZpbmVkLFxuICAgIGtleVR5cGVJc0NvcnJlY3QgPSB0eXBlKCBrZXlWYWx1ZSApID09PSBrZXlUeXBlO1xuXG4gIGlmICgga2V5cy5sZW5ndGggPiAwICYmIGtleUV4aXN0cyApIHtcbiAgICByZXR1cm4gaGFzS2V5KCBvYmplY3RbIGtleSBdLCBrZXlzLCBrZXlUeXBlICk7XG4gIH1cblxuICByZXR1cm4ga2V5cy5sZW5ndGggPiAwIHx8IGtleVR5cGUgPT09IFwiXCIgPyBrZXlFeGlzdHMgOiBrZXlFeGlzdHMgJiYga2V5VHlwZUlzQ29ycmVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwic3RyaW5nXCIgPyBrZXlzLnNwbGl0KCBcIi5cIiApIDogW107XG5cbiAgcmV0dXJuIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICk7XG5cbn07IiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59O1xuIiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4vaXNlcy90eXBlXCIgKSxcbiAgaXMgPSB7XG4gICAgYToge30sXG4gICAgYW46IHt9LFxuICAgIG5vdDoge1xuICAgICAgYToge30sXG4gICAgICBhbjoge31cbiAgICB9XG4gIH07XG5cbnZhciBpc2VzID0ge1xuICBcImFyZ3VtZW50c1wiOiBbIFwiYXJndW1lbnRzXCIsIHR5cGUoIFwiYXJndW1lbnRzXCIgKSBdLFxuICBcImFycmF5XCI6IFsgXCJhcnJheVwiLCB0eXBlKCBcImFycmF5XCIgKSBdLFxuICBcImJvb2xlYW5cIjogWyBcImJvb2xlYW5cIiwgdHlwZSggXCJib29sZWFuXCIgKSBdLFxuICBcImRhdGVcIjogWyBcImRhdGVcIiwgdHlwZSggXCJkYXRlXCIgKSBdLFxuICBcImZ1bmN0aW9uXCI6IFsgXCJmdW5jdGlvblwiLCBcImZ1bmNcIiwgXCJmblwiLCB0eXBlKCBcImZ1bmN0aW9uXCIgKSBdLFxuICBcIm51bGxcIjogWyBcIm51bGxcIiwgdHlwZSggXCJudWxsXCIgKSBdLFxuICBcIm51bWJlclwiOiBbIFwibnVtYmVyXCIsIFwiaW50ZWdlclwiLCBcImludFwiLCB0eXBlKCBcIm51bWJlclwiICkgXSxcbiAgXCJvYmplY3RcIjogWyBcIm9iamVjdFwiLCB0eXBlKCBcIm9iamVjdFwiICkgXSxcbiAgXCJyZWdleHBcIjogWyBcInJlZ2V4cFwiLCB0eXBlKCBcInJlZ2V4cFwiICkgXSxcbiAgXCJzdHJpbmdcIjogWyBcInN0cmluZ1wiLCB0eXBlKCBcInN0cmluZ1wiICkgXSxcbiAgXCJ1bmRlZmluZWRcIjogWyBcInVuZGVmaW5lZFwiLCB0eXBlKCBcInVuZGVmaW5lZFwiICkgXSxcbiAgXCJlbXB0eVwiOiBbIFwiZW1wdHlcIiwgcmVxdWlyZSggXCIuL2lzZXMvZW1wdHlcIiApIF0sXG4gIFwibnVsbG9ydW5kZWZpbmVkXCI6IFsgXCJudWxsT3JVbmRlZmluZWRcIiwgXCJudWxsb3J1bmRlZmluZWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvbnVsbG9ydW5kZWZpbmVkXCIgKSBdLFxuICBcImd1aWRcIjogWyBcImd1aWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvZ3VpZFwiICkgXVxufVxuXG5PYmplY3Qua2V5cyggaXNlcyApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gIHZhciBtZXRob2RzID0gaXNlc1sga2V5IF0uc2xpY2UoIDAsIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgKSxcbiAgICBmbiA9IGlzZXNbIGtleSBdWyBpc2VzWyBrZXkgXS5sZW5ndGggLSAxIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiAoIG1ldGhvZEtleSApIHtcbiAgICBpc1sgbWV0aG9kS2V5IF0gPSBpcy5hWyBtZXRob2RLZXkgXSA9IGlzLmFuWyBtZXRob2RLZXkgXSA9IGZuO1xuICAgIGlzLm5vdFsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYVsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYW5bIG1ldGhvZEtleSBdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG4gIH0gKTtcblxufSApO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBpcztcbmV4cG9ydHMudHlwZSA9IHR5cGU7IiwidmFyIHR5cGUgPSByZXF1aXJlKFwiLi4vdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVsbFwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm9iamVjdFwiICkge1xuICAgIGVtcHR5ID0gT2JqZWN0LmtleXMoIHZhbHVlICkubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImJvb2xlYW5cIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSBmYWxzZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudW1iZXJcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAtMTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJhcnJheVwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICByZXR1cm4gZW1wdHk7XG5cbn07IiwidmFyIGd1aWQgPSByZXF1aXJlKCBcInNjLWd1aWRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHJldHVybiBndWlkLmlzVmFsaWQoIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IHZvaWQgMDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4uL3R5cGVcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX3R5cGUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcbiAgICByZXR1cm4gdHlwZSggX3ZhbHVlICkgPT09IF90eXBlO1xuICB9XG59IiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbCApIHtcbiAgc3dpdGNoICggdG9TdHJpbmcuY2FsbCggdmFsICkgKSB7XG4gIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzpcbiAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgcmV0dXJuICdkYXRlJztcbiAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6XG4gICAgcmV0dXJuICdhcmd1bWVudHMnO1xuICBjYXNlICdbb2JqZWN0IEFycmF5XSc6XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAoIHZhbCA9PT0gbnVsbCApIHJldHVybiAnbnVsbCc7XG4gIGlmICggdmFsID09PSB1bmRlZmluZWQgKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICggdmFsID09PSBPYmplY3QoIHZhbCApICkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgZGVlcCA9IHR5cGUoIGFyZ3NbIDAgXSApID09PSBcImJvb2xlYW5cIiA/IGFyZ3Muc2hpZnQoKSA6IGZhbHNlLFxuICAgIG9iamVjdHMgPSBhcmdzLFxuICAgIHJlc3VsdCA9IHt9O1xuXG4gIG9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24gKCBvYmplY3RuICkge1xuXG4gICAgaWYgKCB0eXBlKCBvYmplY3RuICkgIT09IFwib2JqZWN0XCIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIG9iamVjdG4gKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3RuLCBrZXkgKSApIHtcbiAgICAgICAgaWYgKCBkZWVwICYmIHR5cGUoIG9iamVjdG5bIGtleSBdICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG1lcmdlKCBkZWVwLCB7fSwgcmVzdWx0WyBrZXkgXSwgb2JqZWN0blsga2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gb2JqZWN0blsga2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlOyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJkZWZhdWx0c1wiOiB7XG5cdFx0XCJtaWRkbGV3YXJlS2V5XCI6IFwiYWxsXCJcblx0fVxufSIsInZhciBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApLFxuICBjb25maWcgPSByZXF1aXJlKCBcIi4vY29uZmlnLmpzb25cIiApLFxuICBub29wID0gZnVuY3Rpb24gKCkge307XG5cbnZhciB1c2VpZnlGdW5jdGlvbiA9IGZ1bmN0aW9uICggZnVuY3Rpb25zLCBrZXksIGZuICkge1xuICBpZiAoIGlzLm5vdC5lbXB0eSgga2V5ICkgJiYgaXMuYS5zdHJpbmcoIGtleSApICkge1xuICAgIGlmICggaXMubm90LmFuLmFycmF5KCBmdW5jdGlvbnNbIGtleSBdICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdID0gW107XG4gICAgfVxuICAgIGlmICggaXMuYS5mdW5jKCBmbiApICkge1xuICAgICAgZnVuY3Rpb25zWyBrZXkgXS5wdXNoKCBmbiApO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb25zWyBrZXkgXTtcbiAgfVxufVxuXG52YXIgVXNlaWZ5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICBhbGw6IFtdXG4gIH07XG59O1xuXG5Vc2VpZnkucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAga2V5ID0gaXMuYS5zdHJpbmcoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgZm4gPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIGtleSwgZm4gKTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgY3VycmVudEZ1bmN0aW9uID0gMCxcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIG1pZGRsZXdhcmVLZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgJiYgaXMuYS5mdW5jKCBhcmdzWyAxIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IGNvbmZpZy5kZWZhdWx0cy5taWRkbGV3YXJlS2V5LFxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBhcmdzWyAwIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IG5vb3A7XG5cbiAgdXNlaWZ5RnVuY3Rpb24oIHNlbGYuZnVuY3Rpb25zLCBtaWRkbGV3YXJlS2V5ICk7XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZuID0gc2VsZi5mdW5jdGlvbnNbIG1pZGRsZXdhcmVLZXkgXVsgY3VycmVudEZ1bmN0aW9uKysgXSxcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICk7XG5cbiAgICBpZiAoICFmbiApIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKCBuZXh0ICk7XG4gICAgICBmbi5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG4gICAgfVxuXG4gIH07XG5cbiAgbmV4dC5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG5cbn07XG5cblVzZWlmeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoIG1pZGRsZXdhcmVLZXkgKSB7XG4gIGlmICggaXMuYS5zdHJpbmcoIG1pZGRsZXdhcmVLZXkgKSAmJiBpcy5ub3QuZW1wdHkoIG1pZGRsZXdhcmVLZXkgKSApIHtcbiAgICB0aGlzLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdID0gW107XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5mdW5jdGlvbnMgPSB7XG4gICAgICBhbGw6IFtdXG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF9vYmplY3RPckZ1bmN0aW9uICkge1xuXG4gIHZhciB1c2VpZnkgPSBuZXcgVXNlaWZ5KCk7XG5cbiAgaWYgKCBpcy5hbi5vYmplY3QoIF9vYmplY3RPckZ1bmN0aW9uICkgKSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggX29iamVjdE9yRnVuY3Rpb24sIHtcblxuICAgICAgXCJ1c2VcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgICAgcmV0dXJuIF9vYmplY3RPckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcIm1pZGRsZXdhcmVcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS5taWRkbGV3YXJlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcInVzZWlmeVwiOiB7XG4gICAgICAgIHZhbHVlOiB1c2VpZnlcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICAgIHVzZWlmeS5jb250ZXh0ID0gX29iamVjdE9yRnVuY3Rpb247XG5cbiAgfSBlbHNlIGlmICggaXMuYS5mbiggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LmNvbnRleHQgPSB0aGlzO1xuICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgfTtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlaWZ5ID0gdXNlaWZ5O1xuXG4gIH1cblxufTsiLCJ2YXIgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKCBfYXJyYXkgKSB7XG5cdHZhciBoYW5kbGVycyA9IHt9LFxuXHRcdGFycmF5ID0gQXJyYXkuaXNBcnJheSggX2FycmF5ICkgPyBfYXJyYXkgOiBbXTtcblxuXHR2YXIgcHJveHkgPSBmdW5jdGlvbiAoIF9tZXRob2QsIF92YWx1ZSApIHtcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblxuXHRcdGlmICggaGFuZGxlcnNbIF9tZXRob2QgXSApIHtcblx0XHRcdHJldHVybiBoYW5kbGVyc1sgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fVxuXHR9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwge1xuXHRcdG9uOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfZXZlbnQsIF9jYWxsYmFjayApIHtcblx0XHRcdFx0aGFuZGxlcnNbIF9ldmVudCBdID0gX2NhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdwb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3BvcCcsIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19wb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdzaGlmdCcsIGFycmF5WyAwIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19zaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdFsgJ3B1c2gnLCAncmV2ZXJzZScsICd1bnNoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IHt9O1xuXG5cdFx0cHJvcGVydGllc1sgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IHByb3h5LmJpbmQoIG51bGwsIF9tZXRob2QgKVxuXHRcdH07XG5cblx0XHRwcm9wZXJ0aWVzWyAnX18nICsgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCBwcm9wZXJ0aWVzICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmFibGVBcnJheTsiLCJ2YXIgY2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuXHRlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxuXHRoZWxwZXJzID0gcmVxdWlyZSggJy4vaGVscGVycycgKSxcblx0aXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG5cdG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxuXHRvYnNlcnZhYmxlQXJyYXkgPSByZXF1aXJlKCAnc2ctb2JzZXJ2YWJsZS1hcnJheScgKSxcblx0cmVxdWVzdCA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXG5cdHVzZWlmeSA9IHJlcXVpcmUoICdzYy11c2VpZnknICk7XG5cbnZhciBNb2xkeSA9IGZ1bmN0aW9uICggX25hbWUsIF9wcm9wZXJ0aWVzICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0cHJvcGVydGllcyA9IGlzLmFuLm9iamVjdCggX3Byb3BlcnRpZXMgKSA/IF9wcm9wZXJ0aWVzIDoge307XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIHNlbGYsIHtcblx0XHRfX21vbGR5OiB7XG5cdFx0XHR2YWx1ZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19hdHRyaWJ1dGVzOiB7XG5cdFx0XHR2YWx1ZToge30sXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19iYXNlVXJsOiB7XG5cdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2Jhc2VVcmwnIF0sICdzdHJpbmcnLCAnJyApLFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9fZGF0YToge1xuXHRcdFx0dmFsdWU6IHt9LFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9fZGVzdHJveWVkOiB7XG5cdFx0XHR2YWx1ZTogZmFsc2UsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19oZWFkZXJzOiB7XG5cdFx0XHR2YWx1ZTogbWVyZ2UoIHt9LCBjYXN0KCBwcm9wZXJ0aWVzWyAnaGVhZGVycycgXSwgJ29iamVjdCcsIHt9ICksIGNhc3QoIE1vbGR5LmRlZmF1bHRzLmhlYWRlcnMsICdvYmplY3QnLCB7fSApICksXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19rZXk6IHtcblx0XHRcdHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAna2V5JyBdLCAnc3RyaW5nJywgJ2lkJyApIHx8ICdpZCcsXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0X19rZXlsZXNzOiB7XG5cdFx0XHR2YWx1ZTogcHJvcGVydGllc1sgJ2tleWxlc3MnIF0gPT09IHRydWVcblx0XHR9LFxuXHRcdF9fbmFtZToge1xuXHRcdFx0dmFsdWU6IF9uYW1lIHx8IHByb3BlcnRpZXNbICduYW1lJyBdIHx8ICcnXG5cdFx0fSxcblx0XHRfX3VybDoge1xuXHRcdFx0dmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICd1cmwnIF0sICdzdHJpbmcnLCAnJyApLFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdGJ1c3k6IHtcblx0XHRcdHZhbHVlOiBmYWxzZSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0fVxuXHR9ICk7XG5cblx0aWYgKCAhcHJvcGVydGllc1sgJ2tleWxlc3MnIF0gKSB7XG5cdFx0c2VsZi4kcHJvcGVydHkoIHNlbGYuX19rZXkgKTtcblx0fVxuXG5cdE9iamVjdC5rZXlzKCBjYXN0KCBwcm9wZXJ0aWVzWyAncHJvcGVydGllcycgXSwgJ29iamVjdCcsIHt9ICkgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cdFx0c2VsZi4kcHJvcGVydHkoIF9rZXksIHByb3BlcnRpZXNbICdwcm9wZXJ0aWVzJyBdWyBfa2V5IF0gKTtcblx0fSApO1xuXG5cdHNlbGYub24oICdwcmVzYXZlJywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcblx0c2VsZi5vbiggJ3NhdmUnLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XG5cblx0c2VsZi5vbiggJ3ByZWRlc3Ryb3knLCBoZWxwZXJzLnNldEJ1c3koIHNlbGYgKSApO1xuXHRzZWxmLm9uKCAnZGVzdHJveScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcblxuXHRzZWxmLm9uKCAncHJlZ2V0JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcblx0c2VsZi5vbiggJ2dldCcsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcblxufTtcblxuTW9sZHkucHJvdG90eXBlLiRiYXNlVXJsID0gZnVuY3Rpb24gKCBfYmFzZSApIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdHVybCA9IGNhc3QoIF9iYXNlLCAnc3RyaW5nJywgc2VsZi5fX2Jhc2VVcmwgfHwgJycgKTtcblxuXHRzZWxmLl9fYmFzZVVybCA9IHVybC50cmltKCkucmVwbGFjZSggLyhcXC98XFxzKSskL2csICcnICkgfHwgTW9sZHkuZGVmYXVsdHMuYmFzZVVybCB8fCAnJztcblxuXHRyZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfYmFzZSApID8gc2VsZi5fX2Jhc2VVcmwgOiBzZWxmO1xufTtcblxuTW9sZHkucHJvdG90eXBlLiRjbG9uZSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRkYXRhID0gaXMuYW4ub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiBzZWxmLl9fZGF0YSxcblx0XHRuZXdNb2xkeSA9IG5ldyBNb2xkeSggc2VsZi5fX25hbWUsIHtcblx0XHRcdGJhc2VVcmw6IHNlbGYuJGJhc2VVcmwoKSxcblx0XHRcdGhlYWRlcnM6IHNlbGYuX19oZWFkZXJzLFxuXHRcdFx0a2V5OiBzZWxmLl9fa2V5LFxuXHRcdFx0a2V5bGVzczogc2VsZi5fX2tleWxlc3MsXG5cdFx0XHR1cmw6IHNlbGYuX191cmxcblx0XHR9ICk7XG5cblx0T2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfcHJvcGVydHlLZXkgKSB7XG5cdFx0bmV3TW9sZHkuJHByb3BlcnR5KCBfcHJvcGVydHlLZXksIG1lcmdlKCBzZWxmLl9fYXR0cmlidXRlc1sgX3Byb3BlcnR5S2V5IF0gKSApO1xuXHRcdGlmICggaXMuYW4uYXJyYXkoIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXSApICYmIGlzLmFuLmFycmF5KCBkYXRhWyBfcHJvcGVydHlLZXkgXSApICkge1xuXHRcdFx0ZGF0YVsgX3Byb3BlcnR5S2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YUl0ZW0gKSB7XG5cdFx0XHRcdG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXS5wdXNoKCBfZGF0YUl0ZW0gKTtcblx0XHRcdH0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3TW9sZHlbIF9wcm9wZXJ0eUtleSBdID0gZGF0YVsgX3Byb3BlcnR5S2V5IF1cblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gbmV3TW9sZHk7XG59O1xuXG5Nb2xkeS5wcm90b3R5cGUuJGNvbGxlY3Rpb24gPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0dXJsID0gc2VsZi4kdXJsKCksXG5cdFx0bWV0aG9kID0gJ2dldCcsXG5cdFx0cXVlcnkgPSBpcy5hbi5vYmplY3QoIF9xdWVyeSApID8gX3F1ZXJ5IDoge30sXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcblxuXHRzZWxmLmVtaXQoICdwcmVjb2xsZWN0aW9uJywge1xuXHRcdG1vbGR5OiBzZWxmLFxuXHRcdG1ldGhvZDogbWV0aG9kLFxuXHRcdHF1ZXJ5OiBxdWVyeSxcblx0XHR1cmw6IHVybCxcblx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0fSApO1xuXG5cdHJlcXVlc3QoIHNlbGYsIHF1ZXJ5LCBtZXRob2QsIHVybCwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XG5cdFx0dmFyIHJlcyA9IGNhc3QoIF9yZXMgaW5zdGFuY2VvZiBNb2xkeSB8fCBpcy5hbi5hcnJheSggX3JlcyApID8gX3JlcyA6IG51bGwsICdhcnJheScsIFtdICk7XG5cdFx0c2VsZi5lbWl0KCAnY29sbGVjdGlvbicsIF9lcnJvciwgcmVzICk7XG5cdFx0Y2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgX2Vycm9yLCByZXMgXSApO1xuXHR9ICk7XG5cbn07XG5cbk1vbGR5LnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0aXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxuXHRcdHVybCA9IHNlbGYuJHVybCgpICsgKCBzZWxmLl9fa2V5bGVzcyA/ICcnIDogJy8nICsgc2VsZlsgc2VsZi5fX2tleSBdICksXG5cdFx0bWV0aG9kID0gJ2RlbGV0ZScsXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xuXG5cdGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcblx0XHRyZXR1cm4gY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApIF0gKTtcblx0fVxuXG5cdHNlbGYuZW1pdCggJ3ByZWRlc3Ryb3knLCB7XG5cdFx0bW9sZHk6IHNlbGYsXG5cdFx0ZGF0YTogZGF0YSxcblx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHR1cmw6IHVybCxcblx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0fSApO1xuXG5cdGlmICggIWlzRGlydHkgKSB7XG5cdFx0cmVxdWVzdCggc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGYuZW1pdCggJ2Rlc3Ryb3knLCBzZWxmICk7XG5cdFx0XHRzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcblx0XHRcdHNlbGZbIHNlbGYuX19rZXkgXSA9IHVuZGVmaW5lZDtcblx0XHRcdGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcblx0XHR9ICk7XG5cdH0gZWxzZSB7XG5cdFx0Y2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgbmV3IEVycm9yKCAnVGhpcyBtb2xkeSBjYW5ub3QgYmUgZGVzdHJveWVkIGJlY2F1c2UgaXQgaGFzIG5vdCBiZWVuIHNhdmVkIHRvIHRoZSBzZXJ2ZXIgeWV0LicgKSBdICk7XG5cdH1cblxufTtcblxuTW9sZHkucHJvdG90eXBlLiRkYXRhID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdGRhdGEgPSBpcy5vYmplY3QoIF9kYXRhICkgPyBfZGF0YSA6IHt9O1xuXG5cdGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcblx0XHRyZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xuXHR9XG5cblx0T2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cdFx0aWYgKCBzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xuXHRcdFx0aWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgaGFzS2V5KCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLCAnYXJyYXlPZkFUeXBlJywgJ2Jvb2xlYW4nICkgJiYgc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXS5hcnJheU9mQVR5cGUgPT09IHRydWUgKSB7XG5cdFx0XHRcdGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcblx0XHRcdFx0XHRzZWxmWyBfa2V5IF0ucHVzaCggX21vbGR5ICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gZWxzZSBpZiAoIGlzLmEub2JqZWN0KCBkYXRhWyBfa2V5IF0gKSAmJiBzZWxmWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2xkeSApIHtcblx0XHRcdFx0c2VsZlsgX2tleSBdLiRkYXRhKCBkYXRhWyBfa2V5IF0gKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNlbGZbIF9rZXkgXSA9IGRhdGFbIF9rZXkgXTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gc2VsZjtcbn07XG5cbk1vbGR5LnByb3RvdHlwZS4kZ2V0ID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdHVybCA9IHNlbGYuJHVybCgpLFxuXHRcdG1ldGhvZCA9ICdnZXQnLFxuXHRcdHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxuXHRcdGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfcXVlcnkgKSA/IF9xdWVyeSA6IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3Bcblx0XHR3YXNEZXN0cm95ZWQgPSBzZWxmLl9fZGVzdHJveWVkO1xuXG5cdHNlbGYuZW1pdCggJ3ByZWdldCcsIHtcblx0XHRtb2xkeTogc2VsZixcblx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHRxdWVyeTogcXVlcnksXG5cdFx0dXJsOiB1cmwsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdH0gKTtcblxuXHRzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XG5cblx0cmVxdWVzdCggc2VsZiwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcblx0XHR2YXIgcmVzID0gX3JlcyBpbnN0YW5jZW9mIE1vbGR5ID8gX3JlcyA6IG51bGw7XG5cblx0XHRpZiAoIGlzLmFuLmFycmF5KCBfcmVzICkgJiYgX3Jlc1sgMCBdIGluc3RhbmNlb2YgTW9sZHkgKSB7XG5cdFx0XHRzZWxmLiRkYXRhKCBfcmVzWyAwIF0uJGpzb24oKSApO1xuXHRcdFx0cmVzID0gc2VsZjtcblx0XHR9XG5cblx0XHRpZiAoIF9lcnJvciAmJiB3YXNEZXN0cm95ZWQgKSB7XG5cdFx0XHRzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRzZWxmLmVtaXQoICdnZXQnLCBfZXJyb3IsIHJlcyApO1xuXHRcdGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIF9lcnJvciwgcmVzIF0gKTtcblx0fSApO1xuXG59O1xuXG5Nb2xkeS5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0aWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xuXHRcdHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XG5cdH1cblxuXHRzZWxmLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IF9oZWFkZXJzIDogc2VsZi5fX2hlYWRlcnM7XG5cdHJldHVybiBpcy5ub3QuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gc2VsZi5fX2hlYWRlcnMgOiBzZWxmO1xufTtcblxuTW9sZHkucHJvdG90eXBlLiRpc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5fX2Rlc3Ryb3llZCA/IHRydWUgOiBpcy5lbXB0eSggdGhpc1sgdGhpcy5fX2tleSBdICk7XG59O1xuXG5Nb2xkeS5wcm90b3R5cGUuJGlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XG5cblx0aWYgKCB0aGlzLl9fZGVzdHJveWVkICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRpc1ZhbGlkID0gdHJ1ZTtcblxuXHRPYmplY3Qua2V5cyggc2VsZi5fX2F0dHJpYnV0ZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cblx0XHRpZiAoIHNlbGYuJGlzRGlydHkoKSAmJiBfa2V5ID09PSBzZWxmLl9fa2V5ICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciB2YWx1ZSA9IHNlbGZbIF9rZXkgXSxcblx0XHRcdGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxuXHRcdFx0dHlwZSA9IGF0dHJpYnV0ZXMudHlwZSxcblx0XHRcdGFycmF5T2ZBVHlwZSA9IGhhc0tleSggYXR0cmlidXRlcywgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApID8gYXR0cmlidXRlcy5hcnJheU9mQVR5cGUgPT09IHRydWUgOiBmYWxzZSxcblx0XHRcdGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsICE9PSB0cnVlLFxuXHRcdFx0aXNOdWxsT3JVbmRlZmluZWQgPSBzZWxmLl9fa2V5bGVzcyA/IGZhbHNlIDogYXJyYXlPZkFUeXBlID8gdmFsdWUubGVuZ3RoID09PSAwIDogaXMubnVsbE9yVW5kZWZpbmVkKCB2YWx1ZSApLFxuXHRcdFx0dHlwZUlzV3JvbmcgPSBpcy5ub3QuZW1wdHkoIHR5cGUgKSAmJiBpcy5hLnN0cmluZyggdHlwZSApID8gaXMubm90LmFbIHR5cGUgXSggdmFsdWUgKSA6IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5cdFx0aWYgKCBhcnJheU9mQVR5cGUgJiYgaXMubm90LmVtcHR5KCB2YWx1ZSApICYmIHZhbHVlWyAwIF0gaW5zdGFuY2VvZiBNb2xkeSApIHtcblx0XHRcdHZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XG5cdFx0XHRcdGlmICggaXNWYWxpZCAmJiBfaXRlbS4kaXNWYWxpZCgpID09PSBmYWxzZSApIHtcblx0XHRcdFx0XHRpc1ZhbGlkID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIGlzVmFsaWQgJiYgaXNSZXF1aXJlZCAmJiB0eXBlSXNXcm9uZyApIHtcblx0XHRcdGlzVmFsaWQgPSBmYWxzZTtcblx0XHR9XG5cblx0fSApO1xuXG5cdHJldHVybiBpc1ZhbGlkO1xufTtcblxuTW9sZHkucHJvdG90eXBlLiRqc29uID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0ZGF0YSA9IHNlbGYuX19kYXRhLFxuXHRcdGpzb24gPSB7fTtcblxuXHRPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcblx0XHRpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBkYXRhWyBfa2V5IF1bIDAgXSBpbnN0YW5jZW9mIE1vbGR5ICkge1xuXHRcdFx0anNvblsgX2tleSBdID0gW107XG5cdFx0XHRkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XG5cdFx0XHRcdGpzb25bIF9rZXkgXS5wdXNoKCBfbW9sZHkuJGpzb24oKSApO1xuXHRcdFx0fSApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRqc29uWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2xkeSA/IGRhdGFbIF9rZXkgXS4kanNvbigpIDogZGF0YVsgX2tleSBdO1xuXHRcdH1cblx0fSApO1xuXG5cdHJldHVybiBqc29uO1xufTtcblxuTW9sZHkucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0YXR0cmlidXRlcyA9IG5ldyBoZWxwZXJzLmF0dHJpYnV0ZXMoIF9rZXksIF92YWx1ZSApLFxuXHRcdGV4aXN0aW5nVmFsdWUgPSBzZWxmWyBfa2V5IF0sXG5cdFx0YXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSA9IGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGUgKSAmJiAvbW9sZHkvLnRlc3QoIGF0dHJpYnV0ZXMudHlwZSApLFxuXHRcdGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSBpcy5hbi5hcnJheSggYXR0cmlidXRlcy50eXBlICksXG5cdFx0dmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXG5cdFx0dmFsdWVJc0FuQXJyYXlTdHJpbmcgPSBpcy5hbi5hcnJheSggX3ZhbHVlICkgJiYgaXMuYS5zdHJpbmcoIF92YWx1ZVsgMCBdICksXG5cdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGhhc0tleSggYXR0cmlidXRlcy50eXBlWyAwIF0sICdwcm9wZXJ0aWVzJywgJ29iamVjdCcgKSxcblx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcblx0XHR2YWx1ZUlzQVN0YXRpY01vbGR5ID0gaGFzS2V5KCBfdmFsdWUsICdwcm9wZXJ0aWVzJywgJ29iamVjdCcgKTtcblxuXHRpZiAoICFzZWxmLmhhc093blByb3BlcnR5KCBfa2V5ICkgfHwgIXNlbGYuX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBfa2V5ICkgKSB7XG5cblx0XHRpZiAoIHZhbHVlSXNBbkFycmF5TW9sZHkgfHwgdmFsdWVJc0FuQXJyYXlTdHJpbmcgKSB7XG5cdFx0XHRhdHRyaWJ1dGVzLnR5cGUgPSBfdmFsdWU7XG5cdFx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IHZhbHVlSXNBbkFycmF5TW9sZHk7XG5cdFx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSB2YWx1ZUlzQW5BcnJheVN0cmluZztcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICggYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XG5cdFx0XHRcdHZhbHVlOiBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdH0gKTtcblxuXHRcdFx0c2VsZi5fX2RhdGFbIF9rZXkgXSA9IHNlbGZbIF9rZXkgXTtcblxuXHRcdH0gZWxzZSBpZiAoIHZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XG5cblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgX2tleSwge1xuXHRcdFx0XHR2YWx1ZTogbmV3IE1vbGR5KCBfdmFsdWUubmFtZSwgX3ZhbHVlICksXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHR9ICk7XG5cblx0XHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSBzZWxmWyBfa2V5IF07XG5cblx0XHR9IGVsc2UgaWYgKCBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICkge1xuXG5cdFx0XHR2YXIgYXJyYXkgPSBvYnNlcnZhYmxlQXJyYXkoIFtdICksXG5cdFx0XHRcdGF0dHJpYnV0ZVR5cGUgPSBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgfHwgYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPyBhdHRyaWJ1dGVzLnR5cGVbIDAgXSA6ICcqJztcblxuXHRcdFx0YXR0cmlidXRlcy5hcnJheU9mQVR5cGUgPSB0cnVlO1xuXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIHtcblx0XHRcdFx0dmFsdWU6IGFycmF5LFxuXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0XHR9ICk7XG5cblx0XHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSBzZWxmWyBfa2V5IF07XG5cblx0XHRcdFsgJ3B1c2gnLCAndW5zaGlmdCcgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tZXRob2QgKSB7XG5cdFx0XHRcdGFycmF5Lm9uKCBfbWV0aG9kLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG5cdFx0XHRcdFx0XHR2YWx1ZXMgPSBbXTtcblx0XHRcdFx0XHRhcmdzLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbW9sZHkgPSBuZXcgTW9sZHkoIGF0dHJpYnV0ZVR5cGVbICduYW1lJyBdLCBhdHRyaWJ1dGVUeXBlICksXG5cdFx0XHRcdFx0XHRcdFx0ZGF0YSA9IGlzLmFuLm9iamVjdCggX2l0ZW0gKSA/IF9pdGVtIDogYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XG5cdFx0XHRcdFx0XHRcdG1vbGR5LiRkYXRhKCBkYXRhICk7XG5cdFx0XHRcdFx0XHRcdHZhbHVlcy5wdXNoKCBtb2xkeSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIGNhc3QoIF9pdGVtLCBhdHRyaWJ1dGVUeXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHRcdHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIHZhbHVlcyApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCB7XG5cdFx0XHRcdGdldDogaGVscGVycy5nZXRQcm9wZXJ0eSggX2tleSApLFxuXHRcdFx0XHRzZXQ6IGhlbHBlcnMuc2V0UHJvcGVydHkoIF9rZXkgKSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0gPSBhdHRyaWJ1dGVzO1xuXHR9XG5cblx0aWYgKCBleGlzdGluZ1ZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0c2VsZlsgX2tleSBdID0gZXhpc3RpbmdWYWx1ZTtcblx0fSBlbHNlIGlmICggaXMuZW1wdHkoIHNlbGZbIF9rZXkgXSApICYmIGF0dHJpYnV0ZXMub3B0aW9uYWwgPT09IGZhbHNlICYmIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgKSB7XG5cdFx0c2VsZlsgX2tleSBdID0gYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XG5cdH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBzZWxmWyBfa2V5IF0gKSAmJiBhdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcblx0XHRpZiAoIGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgfHwgYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcblx0XHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSBzZWxmWyBfa2V5IF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSBpcy5lbXB0eSggYXR0cmlidXRlcy50eXBlICkgPyB1bmRlZmluZWQgOiBjYXN0KCB1bmRlZmluZWQsIGF0dHJpYnV0ZXMudHlwZSApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBzZWxmO1xufTtcblxuTW9sZHkucHJvdG90eXBlLiRzYXZlID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRlcnJvciA9IG51bGwsXG5cdFx0aXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxuXHRcdHVybCA9IHNlbGYuJHVybCgpICsgKCAhaXNEaXJ0eSAmJiAhc2VsZi5fX2tleWxlc3MgPyAnLycgKyBzZWxmWyBzZWxmLl9fa2V5IF0gOiAnJyApLFxuXHRcdG1ldGhvZCA9IGlzRGlydHkgPyAncG9zdCcgOiAncHV0Jyxcblx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cblx0c2VsZi5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXG5cdHNlbGYuZW1pdCggJ3ByZXNhdmUnLCB7XG5cdFx0bW9sZHk6IHNlbGYsXG5cdFx0ZGF0YTogZGF0YSxcblx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHR1cmw6IHVybCxcblx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0fSApO1xuXG5cdHJlcXVlc3QoIHNlbGYsIGRhdGEsIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcblx0XHRzZWxmLmVtaXQoICdzYXZlJywgX2Vycm9yLCBfcmVzICk7XG5cdFx0Y2FsbGJhY2suYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuXHR9ICk7XG5cbn07XG5cbk1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0YmFzZSA9IGlzLmVtcHR5KCBzZWxmLiRiYXNlVXJsKCkgKSA/ICcnIDogc2VsZi4kYmFzZVVybCgpLFxuXHRcdG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcblx0XHR1cmwgPSBfdXJsIHx8IHNlbGYuX191cmwgfHwgJycsXG5cdFx0ZW5kcG9pbnQgPSBiYXNlICsgbmFtZSArICggaXMuZW1wdHkoIHVybCApID8gJycgOiAnLycgKyB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSApO1xuXG5cdHNlbGYuX191cmwgPSB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKTtcblxuXHRyZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfdXJsICkgPyBlbmRwb2ludCA6IHNlbGY7XG59O1xuXG5lbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcbnVzZWlmeSggTW9sZHkgKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTW9sZHk7XG5leHBvcnRzLmRlZmF1bHRzID0ge1xuXHRiYXNlVXJsOiAnJyxcblx0aGVhZGVyczoge31cbn07IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxuXHRjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXG5cdG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApO1xuXG5leHBvcnRzLmF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcblx0dmFyIHZhbHVlO1xuXG5cdGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuXHRcdHZhbHVlID0ge1xuXHRcdFx0dHlwZTogX3ZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIGlmICggaXMuYW4ub2JqZWN0KCBfdmFsdWUgKSAmJiBfdmFsdWVbICdfX21vbGR5JyBdID09PSB0cnVlICkge1xuXHRcdHZhbHVlID0ge1xuXHRcdFx0dHlwZTogJ21vbGR5Jyxcblx0XHRcdGRlZmF1bHQ6IF92YWx1ZVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHR2YWx1ZSA9IF92YWx1ZTtcblx0fVxuXG5cdHJldHVybiBtZXJnZSgge1xuXHRcdG5hbWU6IF9rZXkgfHwgJycsXG5cdFx0dHlwZTogJycsXG5cdFx0ZGVmYXVsdDogbnVsbCxcblx0XHRvcHRpb25hbDogZmFsc2Vcblx0fSwgdmFsdWUgKTtcbn07XG5cbmV4cG9ydHMuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX19kYXRhWyBfa2V5IF07XG5cdH1cbn07XG5cbmV4cG9ydHMuZGVzdHJveWVkRXJyb3IgPSBmdW5jdGlvbiAoIF9tb2xkeSApIHtcblx0dmFyIGl0ZW0gPSB0eXBlb2YgX21vbGR5ID09PSAnb2JqZWN0JyA/IF9tb2xkeSA6IHt9O1xuXHRyZXR1cm4gbmV3IEVycm9yKCAnVGhlIGdpdmVuIG1vbGR5IGl0ZW0gYCcgKyBpdGVtLl9fbmFtZSArICdgIGhhcyBiZWVuIGRlc3Ryb3llZCcgKTtcbn07XG5cbmV4cG9ydHMuc2V0QnVzeSA9IGZ1bmN0aW9uICggX3NlbGYgKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0X3NlbGYuYnVzeSA9IHRydWU7XG5cdH1cbn07XG5cbmV4cG9ydHMuc2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRhdHRyaWJ1dGVzID0gc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSxcblx0XHRcdHZhbHVlID0gYXR0cmlidXRlcy50eXBlID8gY2FzdCggX3ZhbHVlLCBhdHRyaWJ1dGVzLnR5cGUsIGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgOiBfdmFsdWU7XG5cblx0XHRpZiAoIHNlbGYuX19kYXRhWyBfa2V5IF0gIT09IHZhbHVlICkge1xuXHRcdFx0c2VsZi5lbWl0KCAnY2hhbmdlJywgc2VsZi5fX2RhdGFbIF9rZXkgXSwgdmFsdWUgKTtcblx0XHR9XG5cblx0XHRzZWxmLl9fZGF0YVsgX2tleSBdID0gdmFsdWU7XG5cdH1cbn07XG5cbmV4cG9ydHMudW5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRfc2VsZi5idXN5ID0gZmFsc2U7XG5cdH1cbn07XG5cbmV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uICgpIHt9OyIsInZhciBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcblx0Y2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX21vbGR5LCBfZGF0YSwgX21ldGhvZCwgX3VybCwgX2NhbGxiYWNrICkge1xuXHR2YXIgbW9sZHkgPSBfbW9sZHksXG5cdFx0aXRlbXMgPSBbXSxcblx0XHRyZXNwb25zZVNob3VsZENvbnRhaW5BbklkID0gaGFzS2V5KCBfZGF0YSwgbW9sZHkuX19rZXkgKSAmJiBpcy5ub3QuZW1wdHkoIF9kYXRhWyBtb2xkeS5fX2tleSBdICkgJiYgL2dldC8udGVzdCggX21ldGhvZCApLFxuXHRcdGlzRGlydHkgPSBtb2xkeS4kaXNEaXJ0eSgpO1xuXG5cdG1vbGR5Lm1pZGRsZXdhcmUoIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzcG9uc2UgKSB7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG5cdFx0XHRlcnJvciA9IF9lcnJvciA9PT0gbW9sZHkgPyBudWxsIDogYXJncy5zaGlmdCgpLFxuXHRcdFx0cmVzcG9uc2UgPSBhcmdzLnNoaWZ0KCk7XG5cblx0XHRpZiAoIGVycm9yICYmICEoIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcblx0XHRcdGVycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcblx0XHR9XG5cblx0XHRpZiAoICFlcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSAmJiAoIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgJiYgIWhhc0tleSggcmVzcG9uc2UsIG1vbGR5Ll9fa2V5ICkgKSApIHtcblx0XHRcdGVycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIG1vbGR5Ll9fa2V5ICsgJ2AnICk7XG5cdFx0fVxuXG5cdFx0aWYgKCAhZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIHJlc3BvbnNlICkgKSB7XG5cdFx0XHRtb2xkeVsgbW9sZHkuX19rZXkgXSA9IHJlc3BvbnNlWyBtb2xkeS5fX2tleSBdO1xuXHRcdH1cblxuXHRcdGlmICggIWVycm9yICkge1xuXHRcdFx0aWYgKCBpcy5hcnJheSggcmVzcG9uc2UgKSApIHtcblx0XHRcdFx0cmVzcG9uc2UuZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YSApIHtcblx0XHRcdFx0XHRpdGVtcy5wdXNoKCBtb2xkeS4kY2xvbmUoIF9kYXRhICkgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0XHRtb2xkeSA9IGl0ZW1zO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bW9sZHkuJGRhdGEoIHJlc3BvbnNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0X2NhbGxiYWNrICYmIF9jYWxsYmFjayggZXJyb3IsIG1vbGR5ICk7XG5cblx0fSwgX21vbGR5LCBfZGF0YSwgX21ldGhvZCwgX3VybCApO1xuXG59OyJdfQ==
(18)
});
