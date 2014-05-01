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
},{}],16:[function(_dereq_,module,exports){
module.exports={
	"defaults": {
		"middlewareKey": "all"
	}
}
},{}],17:[function(_dereq_,module,exports){
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

  console.log( args[ 0 ] );
  console.log( is.an.object( args[ 0 ] ) )

  if ( fn === noop && is.an.object( args[ 0 ] ) ) {
    console.log( key )
    fn = args.shift().setup();
    console.log( fn.findOne );
  }

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
},{"./config.json":16,"sc-is":7}],18:[function(_dereq_,module,exports){
module.exports={
	"defaults": {
		"baseUrl": "",
		"headers": {}
	}
}
},{}],19:[function(_dereq_,module,exports){
var config = _dereq_( './config.json' ),
	moldyApi = {
		adapters: {
			__default: {}
		},
		use: function ( adapter ) {
			this.adapters.__default = adapter.setup();
			console.log( this.adapters.__default )
			console.log( "====" )
		}
	};
//useify = require( 'useify' );

//useify( moldyApi );

var ModelFactory = _dereq_( './moldy' )( _dereq_( './model' ), config.defaults, moldyApi.adapters );

moldyApi.extend = function ( _name, _properties ) {
	return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;
},{"./config.json":18,"./model":21,"./moldy":22}],20:[function(_dereq_,module,exports){
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
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],21:[function(_dereq_,module,exports){
var cast = _dereq_( 'sc-cast' ),
  emitter = _dereq_( 'emitter-component' ),
  hasKey = _dereq_( 'sc-haskey' ),
  helpers = _dereq_( './helpers' ),
  is = _dereq_( 'sc-is' ),
  request = _dereq_( './request' ),
  extend = helpers.extendObject,
  useify = _dereq_( 'useify' );

var Model = function ( initial, __moldy ) {
  var self = this;

  initial = initial || {};

  this.__moldy = __moldy;
  this.__isMoldy = true;
  this.__attributes = {};
  this.__data = {};
  this.__destroyed = false;

  if ( !self.__moldy.__keyless ) {
    self.__moldy.$defineProperty( self, self.__moldy.__key );
  }

  Object.keys( cast( self.__moldy.__metadata, 'object', {} ) ).forEach( function ( _key ) {
    self.__moldy.$defineProperty( self, _key, initial[ _key ] );
  } );

  for ( var i in initial ) {
    if ( initial.hasOwnProperty( i ) && self.__moldy.__metadata[ i ] ) {
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
  helpers.extend( initialValues, _data || {} );

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

  console.log( "I am in destroy" );

  if ( !isDirty ) {
    console.log( "isDirty" )
    this.__moldy.__defaultMiddleware.__default.destroy.call( this.__moldy, this.$json(), function ( _error, _res ) {

      if ( _error && !( _error instanceof Error ) ) {
        _error = new Error( 'An unknown error occurred' );
      }

      self.emit( 'destroy', _error, _res );
      self.__destroyed = true;
      self[ self.__moldy.__key ] = undefined;

      callback && callback( _error, _res );
    } );


    /*request( self.__moldy, self, data, method, url, function ( _error, _res ) {
      self.emit( 'destroy', _error, _res );
      self.__destroyed = true;
      self[ self.__moldy.__key ] = undefined;
      callback.apply( self, arguments );
    } );*/
  } else {
    callback && callback( new Error( 'This moldy cannot be destroyed because it has not been saved to the server yet.' ) );
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
    method = isDirty ? 'save' : 'create',
    callback = is.a.func( _callback ) ? _callback : helpers.noop;

  self.__destroyed = false;

  self.emit( 'presave', {
    moldy: self,
    data: data,
    method: method,
    url: url,
    callback: callback
  } );

  var responseShouldContainAnId = hasKey( data, self.__key ) && is.not.empty( data[ self.__key ] );

  console.log( "!!!" )
  console.log( this.__moldy.__defaultMiddleware )

  this.__moldy.__defaultMiddleware.__default[ method ].call( this.__moldy, data, function ( _error, _res ) {

    if ( _error && !( _error instanceof Error ) ) {
      _error = new Error( 'An unknown error occurred' );
    }

    if ( !_error && isDirty && is.object( _res ) && ( responseShouldContainAnId && !hasKey( _res, self.__moldy.__key ) ) ) {
      _error = new Error( 'The response from the server did not contain a valid `' + self.__moldy.__key + '`' );
    }

    if ( !_error && isDirty && is.object( _res ) ) {
      self.__moldy[ self.__moldy.__key ] = _res[ self.__moldy.__key ];
    }

    if ( !error ) {
      self.$data( _res );
    }

    self.emit( 'save', _error, _res );

    callback && callback( _error, _res ); //not sure about that ! why passing the context ?
  } );

  /*request( self.__moldy, self, data, method, url, function ( _error, _res ) {
    self.emit( 'save', _error, _res );
    callback.apply( self, arguments ); //not sure about that ! why passing the context ?
  } );*/

};

emitter( Model.prototype );
useify( Model );

Model.extend = extend;

exports = module.exports = Model;
},{"./helpers":20,"./request":23,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"useify":17}],22:[function(_dereq_,module,exports){
var helpers = _dereq_( "./helpers/index" ),
  emitter = _dereq_( 'emitter-component' ),
  observableArray = _dereq_( 'sg-observable-array' ),
  hasKey = _dereq_( 'sc-haskey' ),
  is = _dereq_( 'sc-is' ),
  merge = _dereq_( 'sc-merge' ),
  cast = _dereq_( 'sc-cast' ),
  useify = _dereq_( 'useify' );

module.exports = function ( BaseModel, defaultConfiguration, defaultMiddleware ) {

  var Moldy = function ( _name, _properties ) {
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

    if ( !self.__keyless ) {
      this.$property( this.__key );
    }

    Object.keys( cast( self.__properties, 'object', {} ) ).forEach( function ( _key ) {
      self.$property( _key, self.__properties[ _key ] );
    } );

    self.on( 'prefindOne', helpers.setBusy( self ) );
    self.on( 'findOne', helpers.unsetBusy( self ) );
  };

  Moldy.prototype.schema = function ( schema ) {

    Object.keys( cast( schema, 'object', {} ) ).forEach( function ( _key ) {
      self.$property( _key, schema[ _key ] );
    } );

    return this;
  };

  Moldy.prototype.proto = function ( proto ) {

    this.__properties.proto = this.__properties.proto || {};
    helpers.extend( this.__properties.proto, proto );

    return this;
  };

  Moldy.prototype.create = function ( _initial ) {

    var Klass = BaseModel.extend( this.__properties.proto || {} );

    return new Klass( _initial, this );
  };

  Moldy.prototype.$headers = function ( _headers ) {
    var self = this;

    if ( self.__destroyed ) {
      return helpers.destroyedError( self );
    }

    self.__headers = is.an.object( _headers ) ? _headers : self.__headers;
    return is.not.an.object( _headers ) ? self.__headers : self;
  };

  Moldy.prototype.findOne = function ( _query, _callback ) {
    var self = this,
      result,
      url = self.$url(),
      method = 'findOne',
      query = is.an.object( _query ) ? _query : {},
      callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop
      wasDestroyed = self.__destroyed;

    self.emit( 'prefindOne', {
      moldy: self,
      method: method,
      query: query,
      url: url,
      callback: callback
    } );

    self.__destroyed = false;

    console.log()
    this.__defaultMiddleware.__default.findOne.call( this, _query, function ( _error, _response ) {
      if ( _error && !( _error instanceof Error ) ) {
        _error = new Error( 'An unknown error occurred' );
      }

      if ( !_error ) {
        if ( is.array( _response ) ) {
          result = self.create( _response[ 0 ] );
        } else {
          result = self.create( _response );
        }
      }

      self.emit( 'findOne', _error, _response );

      callback && callback( _error, result );
    } );
    //request( self, null, query, method, url, function ( _error, _res ) {
    //var res = _res instanceof BaseModel ? _res : null;

    /*if ( is.an.array( _res ) && _res[ 0 ] instanceof BaseModel ) {
        self.$data( _res[ 0 ].$json() );
        res = self;
      }*/
    /*
      if ( _error && wasDestroyed ) {
        self.__destroyed = true;
      }*/

    //self.emit( 'findOne', _error, _res );

    //callback.apply( self, [ _error, _res ] );
    //} );
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

  Moldy.prototype.__defaultMiddleware = defaultMiddleware;

  Moldy.prototype.$baseUrl = function ( _base ) {
    var self = this,
      url = cast( _base, 'string', self.__baseUrl || '' );

    self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || defaultConfiguration.baseUrl || '';

    return is.not.a.string( _base ) ? self.__baseUrl : self;
  };

  Moldy.prototype.find = function ( _query, _callback ) {
    var self = this,
      url = self.$url(),
      method = 'find',
      result = [],
      query = is.an.object( _query ) ? _query : {},
      callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop;

    self.emit( 'prefind', {
      moldy: self,
      method: method,
      query: query,
      url: url,
      callback: callback
    } );

    this.__defaultMiddleware.__default.find.call( this, _query, function ( _error, res ) {

      if ( _error && !( _error instanceof _error ) ) {
        _error = new Error( 'An unknown error occurred' );
      }

      if ( is.array( res ) ) {
        res.forEach( function ( _data ) {
          result.push( self.create( _data ) );
        } );
      } else {
        result.push( self.create( _data ) );
      }

      var res = cast( result instanceof BaseModel || is.an.array( result ) ? result : null, 'array', [] );

      self.emit( 'find', _error, res );

      callback && callback( _error, res );

    } );
    /*request( self, null, query, method, url, function ( _error, _res ) {
      var res = cast( _res instanceof BaseModel || is.an.array( _res ) ? _res : null, 'array', [] );
      self.emit( 'find', _error, res );
      callback.apply( self, [ _error, res ] );
    } );*/

  };

  Moldy.prototype.$defineProperty = function ( obj, key, value ) {

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
          enumerable: true
        } );

        obj.__data[ key ] = obj[ key ];

      } else if ( metadata.valueIsAStaticMoldy ) {

        Object.defineProperty( obj, key, {
          value: new Moldy( metadata.value.name, metadata.value ).create(),
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
                var moldy = new Moldy( attributeType[ 'name' ], attributeType ),
                  data = is.an.object( _item ) ? _item : metadata.attributes[ 'default' ];

                values.push( moldy.create( data ) );
              } else {
                values.push( cast( _item, attributeType, metadata.attributes[ 'default' ] ) );
              }
            } );
            return array[ '__' + _method ].apply( array, values );
          } );
        } );

        if ( existingValue && existingValue.length > 0 ) {
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

  Moldy.prototype.$property = function ( _key, _value ) {
    var self = this,
      attributes = new helpers.attributes( _key, _value ),
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

  emitter( Moldy.prototype );
  useify( Moldy );

  return Moldy;

};
},{"./helpers/index":20,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sg-observable-array":15,"useify":17}],23:[function(_dereq_,module,exports){
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
    method = ( _method === 'find' || _method === 'findOne' ) ? 'get' : _method,
    responseShouldContainAnId = hasKey( _data, moldy.__key ) && is.not.empty( _data[ moldy.__key ] ) && /get/.test( method ),
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
      if ( !isInstance ) {
        if ( _method !== 'findOne' && is.array( response ) ) {

          response.forEach( function ( _data ) {

            result.push( moldy.create( _data ) );
          } );
        } else if ( _method === 'findOne' && is.array( response ) ) {
          result = moldy.create( response[ 0 ] );
        } else {
          result = moldy.create( response );
        }
      } else {
        instance.$data( response );
        result = instance;
      }
    }

    _callback && _callback( error, result );

  }, _moldy, _data, method, _url );

};
},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHBkZVxcRHJvcGJveFxcc3JjXFxtb2xkeVxcbW9sZHlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9ub2RlX21vZHVsZXMvc2MtY29udGFpbnMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaGFza2V5L25vZGVfbW9kdWxlcy90eXBlLWNvbXBvbmVudC9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZW1wdHkuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZ3VpZC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvdHlwZS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvdHlwZS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NnLW9ic2VydmFibGUtYXJyYXkvc3JjL2luZGV4LmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L25vZGVfbW9kdWxlcy91c2VpZnkvY29uZmlnLmpzb24iLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3VzZWlmeS9pbmRleC5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9zcmMvY29uZmlnLmpzb24iLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL2Zha2VfOThkZWVhZjAuanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCJDOi9Vc2Vycy9wZGUvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHkvc3JjL21vZGVsLmpzIiwiQzovVXNlcnMvcGRlL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5L3NyYy9tb2xkeS5qcyIsIkM6L1VzZXJzL3BkZS9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS9zcmMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuLyoqXHJcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuIiwidmFyIGNvbnRhaW5zID0gcmVxdWlyZSggXCJzYy1jb250YWluc1wiICksXG4gIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICk7XG5cbnZhciBjYXN0ID0gZnVuY3Rpb24gKCBfdmFsdWUsIF9jYXN0VHlwZSwgX2RlZmF1bHQsIF92YWx1ZXMsIF9hZGRpdGlvbmFsUHJvcGVydGllcyApIHtcblxuICB2YXIgcGFyc2VkVmFsdWUsXG4gICAgY2FzdFR5cGUgPSBfY2FzdFR5cGUsXG4gICAgdmFsdWUsXG4gICAgdmFsdWVzID0gaXMuYW4uYXJyYXkoIF92YWx1ZXMgKSA/IF92YWx1ZXMgOiBbXTtcblxuICBzd2l0Y2ggKCB0cnVlICkge1xuICBjYXNlICggL2Zsb2F0fGludGVnZXIvLnRlc3QoIGNhc3RUeXBlICkgKTpcbiAgICBjYXN0VHlwZSA9IFwibnVtYmVyXCI7XG4gICAgYnJlYWs7XG4gIH1cblxuICBpZiAoIGlzLmFbIGNhc3RUeXBlIF0oIF92YWx1ZSApIHx8IGNhc3RUeXBlID09PSAnKicgKSB7XG5cbiAgICB2YWx1ZSA9IF92YWx1ZTtcblxuICB9IGVsc2Uge1xuXG4gICAgc3dpdGNoICggdHJ1ZSApIHtcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYXJyYXlcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKCBfdmFsdWUgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGlzLm5vdC5hbi5hcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgaWYgKCBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IFsgX3ZhbHVlIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJib29sZWFuXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gL14odHJ1ZXwxfHl8eWVzKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gdHJ1ZSA6IHVuZGVmaW5lZDtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgaWYgKCBpcy5ub3QuYS5ib29sZWFuKCB2YWx1ZSApICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSAvXihmYWxzZXwtMXwwfG58bm8pJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyBmYWxzZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gaXMuYS5ib29sZWFuKCB2YWx1ZSApID8gdmFsdWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJkYXRlXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZSggX3ZhbHVlICk7XG4gICAgICAgIHZhbHVlID0gaXNOYU4oIHZhbHVlLmdldFRpbWUoKSApID8gdW5kZWZpbmVkIDogdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcInN0cmluZ1wiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLnVuZGVmaW5lZCggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSBfdmFsdWUudG9TdHJpbmcoKVxuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcIm51bWJlclwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLm5vdC5hLm51bWJlciggdmFsdWUgKSB8fCBpc05hTiggdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgICAgY2FzZSBfY2FzdFR5cGUgPT09IFwiaW50ZWdlclwiOlxuICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoIHZhbHVlICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGNhc3QoIEpTT04ucGFyc2UoIF92YWx1ZSApLCBjYXN0VHlwZSApXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgfVxuXG4gIH1cblxuICBpZiAoIHZhbHVlcy5sZW5ndGggPiAwICYmICFjb250YWlucyggdmFsdWVzLCB2YWx1ZSApICkge1xuICAgIHZhbHVlID0gdmFsdWVzWyAwIF07XG4gIH1cblxuICByZXR1cm4gaXMubm90LnVuZGVmaW5lZCggdmFsdWUgKSA/IHZhbHVlIDogaXMubm90LnVuZGVmaW5lZCggX2RlZmF1bHQgKSA/IF9kZWZhdWx0IDogbnVsbDtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0OyIsInZhciBjb250YWlucyA9IGZ1bmN0aW9uICggZGF0YSwgaXRlbSApIHtcbiAgdmFyIGZvdW5kT25lID0gZmFsc2U7XG5cbiAgaWYgKCBBcnJheS5pc0FycmF5KCBkYXRhICkgKSB7XG5cbiAgICBkYXRhLmZvckVhY2goIGZ1bmN0aW9uICggYXJyYXlJdGVtICkge1xuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgaXRlbSA9PT0gYXJyYXlJdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gZWxzZSBpZiAoIE9iamVjdCggZGF0YSApID09PSBkYXRhICkge1xuXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgZGF0YVsga2V5IF0gPT09IGl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICB9XG4gIHJldHVybiBmb3VuZE9uZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7IiwidmFyIGd1aWRSeCA9IFwiez9bMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17MTJ9fT9cIjtcblxuZXhwb3J0cy5nZW5lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIGd1aWQgPSBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoIC9beHldL2csIGZ1bmN0aW9uICggYyApIHtcbiAgICB2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcbiAgICByZXR1cm4gKCBjID09PSBcInhcIiA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKCAxNiApO1xuICB9ICk7XG4gIHJldHVybiBndWlkO1xufTtcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICggc3RyaW5nICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUngsIFwiZ1wiICksXG4gICAgbWF0Y2hlcyA9ICggdHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIiA/IHN0cmluZyA6IFwiXCIgKS5tYXRjaCggcnggKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG1hdGNoZXMgKSA/IG1hdGNoZXMgOiBbXTtcbn07XG5cbmV4cG9ydHMuaXNWYWxpZCA9IGZ1bmN0aW9uICggZ3VpZCApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4ICk7XG4gIHJldHVybiByeC50ZXN0KCBndWlkICk7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICksXG4gIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIG9iamVjdCA9IHR5cGUoIG9iamVjdCApID09PSBcIm9iamVjdFwiID8gb2JqZWN0IDoge30sIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwiYXJyYXlcIiA/IGtleXMgOiBbXTtcbiAga2V5VHlwZSA9IHR5cGUoIGtleVR5cGUgKSA9PT0gXCJzdHJpbmdcIiA/IGtleVR5cGUgOiBcIlwiO1xuXG4gIHZhciBrZXkgPSBrZXlzLmxlbmd0aCA+IDAgPyBrZXlzLnNoaWZ0KCkgOiBcIlwiLFxuICAgIGtleUV4aXN0cyA9IGhhcy5jYWxsKCBvYmplY3QsIGtleSApIHx8IG9iamVjdFsga2V5IF0gIT09IHZvaWQgMCxcbiAgICBrZXlWYWx1ZSA9IGtleUV4aXN0cyA/IG9iamVjdFsga2V5IF0gOiB1bmRlZmluZWQsXG4gICAga2V5VHlwZUlzQ29ycmVjdCA9IHR5cGUoIGtleVZhbHVlICkgPT09IGtleVR5cGU7XG5cbiAgaWYgKCBrZXlzLmxlbmd0aCA+IDAgJiYga2V5RXhpc3RzICkge1xuICAgIHJldHVybiBoYXNLZXkoIG9iamVjdFsga2V5IF0sIGtleXMsIGtleVR5cGUgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzLmxlbmd0aCA+IDAgfHwga2V5VHlwZSA9PT0gXCJcIiA/IGtleUV4aXN0cyA6IGtleUV4aXN0cyAmJiBrZXlUeXBlSXNDb3JyZWN0O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJzdHJpbmdcIiA/IGtleXMuc3BsaXQoIFwiLlwiICkgOiBbXTtcblxuICByZXR1cm4gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKTtcblxufTsiLCJcbi8qKlxuICogdG9TdHJpbmcgcmVmLlxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogUmV0dXJuIHRoZSB0eXBlIG9mIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCl7XG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOiByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJztcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzogcmV0dXJuICdhcmd1bWVudHMnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi9pc2VzL3R5cGVcIiApLFxuICBpcyA9IHtcbiAgICBhOiB7fSxcbiAgICBhbjoge30sXG4gICAgbm90OiB7XG4gICAgICBhOiB7fSxcbiAgICAgIGFuOiB7fVxuICAgIH1cbiAgfTtcblxudmFyIGlzZXMgPSB7XG4gIFwiYXJndW1lbnRzXCI6IFsgXCJhcmd1bWVudHNcIiwgdHlwZSggXCJhcmd1bWVudHNcIiApIF0sXG4gIFwiYXJyYXlcIjogWyBcImFycmF5XCIsIHR5cGUoIFwiYXJyYXlcIiApIF0sXG4gIFwiYm9vbGVhblwiOiBbIFwiYm9vbGVhblwiLCB0eXBlKCBcImJvb2xlYW5cIiApIF0sXG4gIFwiZGF0ZVwiOiBbIFwiZGF0ZVwiLCB0eXBlKCBcImRhdGVcIiApIF0sXG4gIFwiZnVuY3Rpb25cIjogWyBcImZ1bmN0aW9uXCIsIFwiZnVuY1wiLCBcImZuXCIsIHR5cGUoIFwiZnVuY3Rpb25cIiApIF0sXG4gIFwibnVsbFwiOiBbIFwibnVsbFwiLCB0eXBlKCBcIm51bGxcIiApIF0sXG4gIFwibnVtYmVyXCI6IFsgXCJudW1iZXJcIiwgXCJpbnRlZ2VyXCIsIFwiaW50XCIsIHR5cGUoIFwibnVtYmVyXCIgKSBdLFxuICBcIm9iamVjdFwiOiBbIFwib2JqZWN0XCIsIHR5cGUoIFwib2JqZWN0XCIgKSBdLFxuICBcInJlZ2V4cFwiOiBbIFwicmVnZXhwXCIsIHR5cGUoIFwicmVnZXhwXCIgKSBdLFxuICBcInN0cmluZ1wiOiBbIFwic3RyaW5nXCIsIHR5cGUoIFwic3RyaW5nXCIgKSBdLFxuICBcInVuZGVmaW5lZFwiOiBbIFwidW5kZWZpbmVkXCIsIHR5cGUoIFwidW5kZWZpbmVkXCIgKSBdLFxuICBcImVtcHR5XCI6IFsgXCJlbXB0eVwiLCByZXF1aXJlKCBcIi4vaXNlcy9lbXB0eVwiICkgXSxcbiAgXCJudWxsb3J1bmRlZmluZWRcIjogWyBcIm51bGxPclVuZGVmaW5lZFwiLCBcIm51bGxvcnVuZGVmaW5lZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9udWxsb3J1bmRlZmluZWRcIiApIF0sXG4gIFwiZ3VpZFwiOiBbIFwiZ3VpZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9ndWlkXCIgKSBdXG59XG5cbk9iamVjdC5rZXlzKCBpc2VzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgdmFyIG1ldGhvZHMgPSBpc2VzWyBrZXkgXS5zbGljZSggMCwgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSApLFxuICAgIGZuID0gaXNlc1sga2V5IF1bIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgXTtcblxuICBtZXRob2RzLmZvckVhY2goIGZ1bmN0aW9uICggbWV0aG9kS2V5ICkge1xuICAgIGlzWyBtZXRob2RLZXkgXSA9IGlzLmFbIG1ldGhvZEtleSBdID0gaXMuYW5bIG1ldGhvZEtleSBdID0gZm47XG4gICAgaXMubm90WyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hWyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hblsgbWV0aG9kS2V5IF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApID8gZmFsc2UgOiB0cnVlO1xuICAgIH1cbiAgfSApO1xuXG59ICk7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGlzO1xuZXhwb3J0cy50eXBlID0gdHlwZTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoXCIuLi90eXBlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHZhciBlbXB0eSA9IGZhbHNlO1xuXG4gIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudWxsXCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgZW1wdHkgPSBPYmplY3Qua2V5cyggdmFsdWUgKS5sZW5ndGggPT09IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYm9vbGVhblwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IGZhbHNlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bWJlclwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IC0xO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImFycmF5XCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHJldHVybiBlbXB0eTtcblxufTsiLCJ2YXIgZ3VpZCA9IHJlcXVpcmUoIFwic2MtZ3VpZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGd1aWQuaXNWYWxpZCggdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuXHRyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gdm9pZCAwO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi4vdHlwZVwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfdHlwZSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xuICAgIHJldHVybiB0eXBlKCBfdmFsdWUgKSA9PT0gX3R5cGU7XG4gIH1cbn0iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsICkge1xuICBzd2l0Y2ggKCB0b1N0cmluZy5jYWxsKCB2YWwgKSApIHtcbiAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgIHJldHVybiAnZnVuY3Rpb24nO1xuICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICByZXR1cm4gJ2RhdGUnO1xuICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgIHJldHVybiAncmVnZXhwJztcbiAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzpcbiAgICByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gIGNhc2UgJ1tvYmplY3QgQXJyYXldJzpcbiAgICByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICggdmFsID09PSBudWxsICkgcmV0dXJuICdudWxsJztcbiAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKCB2YWwgPT09IE9iamVjdCggdmFsICkgKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICk7XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBkZWVwID0gdHlwZSggYXJnc1sgMCBdICkgPT09IFwiYm9vbGVhblwiID8gYXJncy5zaGlmdCgpIDogZmFsc2UsXG4gICAgb2JqZWN0cyA9IGFyZ3MsXG4gICAgcmVzdWx0ID0ge307XG5cbiAgb2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiAoIG9iamVjdG4gKSB7XG5cbiAgICBpZiAoIHR5cGUoIG9iamVjdG4gKSAhPT0gXCJvYmplY3RcIiApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyggb2JqZWN0biApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIG9iamVjdG4sIGtleSApICkge1xuICAgICAgICBpZiAoIGRlZXAgJiYgdHlwZSggb2JqZWN0blsga2V5IF0gKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gbWVyZ2UoIGRlZXAsIHt9LCByZXN1bHRbIGtleSBdLCBvYmplY3RuWyBrZXkgXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBvYmplY3RuWyBrZXkgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gKTtcblxuICB9ICk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7IiwidmFyIE9ic2VydmFibGVBcnJheSA9IGZ1bmN0aW9uICggX2FycmF5ICkge1xuXHR2YXIgaGFuZGxlcnMgPSB7fSxcblx0XHRhcnJheSA9IEFycmF5LmlzQXJyYXkoIF9hcnJheSApID8gX2FycmF5IDogW107XG5cblx0dmFyIHByb3h5ID0gZnVuY3Rpb24gKCBfbWV0aG9kLCBfdmFsdWUgKSB7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cblx0XHRpZiAoIGhhbmRsZXJzWyBfbWV0aG9kIF0gKSB7XG5cdFx0XHRyZXR1cm4gaGFuZGxlcnNbIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3MgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGFycmF5WyAnX18nICsgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH1cblx0fTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggYXJyYXksIHtcblx0XHRvbjoge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX2V2ZW50LCBfY2FsbGJhY2sgKSB7XG5cdFx0XHRcdGhhbmRsZXJzWyBfZXZlbnQgXSA9IF9jYWxsYmFjaztcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAncG9wJywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdwb3AnLCBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ19fcG9wJywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnBvcC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdzaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHByb3h5KCAnc2hpZnQnLCBhcnJheVsgMCBdICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ19fc2hpZnQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRbICdwdXNoJywgJ3JldmVyc2UnLCAndW5zaGlmdCcsICdzb3J0JywgJ3NwbGljZScgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tZXRob2QgKSB7XG5cdFx0dmFyIHByb3BlcnRpZXMgPSB7fTtcblxuXHRcdHByb3BlcnRpZXNbIF9tZXRob2QgXSA9IHtcblx0XHRcdHZhbHVlOiBwcm94eS5iaW5kKCBudWxsLCBfbWV0aG9kIClcblx0XHR9O1xuXG5cdFx0cHJvcGVydGllc1sgJ19fJyArIF9tZXRob2QgXSA9IHtcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcblx0XHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZVsgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwgcHJvcGVydGllcyApO1xuXHR9ICk7XG5cblx0cmV0dXJuIGFycmF5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZhYmxlQXJyYXk7IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcImRlZmF1bHRzXCI6IHtcblx0XHRcIm1pZGRsZXdhcmVLZXlcIjogXCJhbGxcIlxuXHR9XG59IiwidmFyIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICksXG4gIGNvbmZpZyA9IHJlcXVpcmUoIFwiLi9jb25maWcuanNvblwiICksXG4gIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIHVzZWlmeUZ1bmN0aW9uID0gZnVuY3Rpb24gKCBmdW5jdGlvbnMsIGtleSwgZm4gKSB7XG4gIGlmICggaXMubm90LmVtcHR5KCBrZXkgKSAmJiBpcy5hLnN0cmluZygga2V5ICkgKSB7XG4gICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIGZ1bmN0aW9uc1sga2V5IF0gKSApIHtcbiAgICAgIGZ1bmN0aW9uc1sga2V5IF0gPSBbXTtcbiAgICB9XG4gICAgaWYgKCBpcy5hLmZ1bmMoIGZuICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdLnB1c2goIGZuICk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbnNbIGtleSBdO1xuICB9XG59XG5cbnZhciBVc2VpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZnVuY3Rpb25zID0ge1xuICAgIGFsbDogW11cbiAgfTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBrZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBjb25maWcuZGVmYXVsdHMubWlkZGxld2FyZUtleSxcbiAgICBmbiA9IGlzLmEuZnVuYyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBub29wO1xuXG4gIGNvbnNvbGUubG9nKCBhcmdzWyAwIF0gKTtcbiAgY29uc29sZS5sb2coIGlzLmFuLm9iamVjdCggYXJnc1sgMCBdICkgKVxuXG4gIGlmICggZm4gPT09IG5vb3AgJiYgaXMuYW4ub2JqZWN0KCBhcmdzWyAwIF0gKSApIHtcbiAgICBjb25zb2xlLmxvZygga2V5IClcbiAgICBmbiA9IGFyZ3Muc2hpZnQoKS5zZXR1cCgpO1xuICAgIGNvbnNvbGUubG9nKCBmbi5maW5kT25lICk7XG4gIH1cblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIGtleSwgZm4gKTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgY3VycmVudEZ1bmN0aW9uID0gMCxcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIG1pZGRsZXdhcmVLZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgJiYgaXMuYS5mdW5jKCBhcmdzWyAxIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IGNvbmZpZy5kZWZhdWx0cy5taWRkbGV3YXJlS2V5LFxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBhcmdzWyAwIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IG5vb3A7XG5cbiAgdXNlaWZ5RnVuY3Rpb24oIHNlbGYuZnVuY3Rpb25zLCBtaWRkbGV3YXJlS2V5ICk7XG5cbiAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZuID0gc2VsZi5mdW5jdGlvbnNbIG1pZGRsZXdhcmVLZXkgXVsgY3VycmVudEZ1bmN0aW9uKysgXSxcbiAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICk7XG5cbiAgICBpZiAoICFmbiApIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKCBuZXh0ICk7XG4gICAgICBmbi5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG4gICAgfVxuXG4gIH07XG5cbiAgbmV4dC5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG5cbn07XG5cblVzZWlmeS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoIG1pZGRsZXdhcmVLZXkgKSB7XG4gIGlmICggaXMuYS5zdHJpbmcoIG1pZGRsZXdhcmVLZXkgKSAmJiBpcy5ub3QuZW1wdHkoIG1pZGRsZXdhcmVLZXkgKSApIHtcbiAgICB0aGlzLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdID0gW107XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5mdW5jdGlvbnMgPSB7XG4gICAgICBhbGw6IFtdXG4gICAgfTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF9vYmplY3RPckZ1bmN0aW9uICkge1xuXG4gIHZhciB1c2VpZnkgPSBuZXcgVXNlaWZ5KCk7XG5cbiAgaWYgKCBpcy5hbi5vYmplY3QoIF9vYmplY3RPckZ1bmN0aW9uICkgKSB7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggX29iamVjdE9yRnVuY3Rpb24sIHtcblxuICAgICAgXCJ1c2VcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgICAgcmV0dXJuIF9vYmplY3RPckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcIm1pZGRsZXdhcmVcIjoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVzZWlmeS5taWRkbGV3YXJlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBcInVzZWlmeVwiOiB7XG4gICAgICAgIHZhbHVlOiB1c2VpZnlcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICAgIHVzZWlmeS5jb250ZXh0ID0gX29iamVjdE9yRnVuY3Rpb247XG5cbiAgfSBlbHNlIGlmICggaXMuYS5mbiggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LmNvbnRleHQgPSB0aGlzO1xuICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgfTtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVzZWlmeS51c2UuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlaWZ5ID0gdXNlaWZ5O1xuXG4gIH1cblxufTsiLCJtb2R1bGUuZXhwb3J0cz17XHJcblx0XCJkZWZhdWx0c1wiOiB7XHJcblx0XHRcImJhc2VVcmxcIjogXCJcIixcclxuXHRcdFwiaGVhZGVyc1wiOiB7fVxyXG5cdH1cclxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCAnLi9jb25maWcuanNvbicgKSxcclxuXHRtb2xkeUFwaSA9IHtcclxuXHRcdGFkYXB0ZXJzOiB7XHJcblx0XHRcdF9fZGVmYXVsdDoge31cclxuXHRcdH0sXHJcblx0XHR1c2U6IGZ1bmN0aW9uICggYWRhcHRlciApIHtcclxuXHRcdFx0dGhpcy5hZGFwdGVycy5fX2RlZmF1bHQgPSBhZGFwdGVyLnNldHVwKCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCB0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCApXHJcblx0XHRcdGNvbnNvbGUubG9nKCBcIj09PT1cIiApXHJcblx0XHR9XHJcblx0fTtcclxuLy91c2VpZnkgPSByZXF1aXJlKCAndXNlaWZ5JyApO1xyXG5cclxuLy91c2VpZnkoIG1vbGR5QXBpICk7XHJcblxyXG52YXIgTW9kZWxGYWN0b3J5ID0gcmVxdWlyZSggJy4vbW9sZHknICkoIHJlcXVpcmUoICcuL21vZGVsJyApLCBjb25maWcuZGVmYXVsdHMsIG1vbGR5QXBpLmFkYXB0ZXJzICk7XHJcblxyXG5tb2xkeUFwaS5leHRlbmQgPSBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcclxuXHRyZXR1cm4gbmV3IE1vZGVsRmFjdG9yeSggX25hbWUsIF9wcm9wZXJ0aWVzICk7XHJcbn07XHJcblxyXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBtb2xkeUFwaTtcclxuZXhwb3J0cy5kZWZhdWx0cyA9IGNvbmZpZy5kZWZhdWx0czsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXHJcbiAgY2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxyXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApO1xyXG5cclxuZXhwb3J0cy5hdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCBfa2V5LCBfdmFsdWUgKSB7XHJcbiAgdmFyIHZhbHVlO1xyXG5cclxuICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcclxuICAgIHZhbHVlID0ge1xyXG4gICAgICB0eXBlOiBfdmFsdWVcclxuICAgIH07XHJcbiAgfSBlbHNlIGlmICggaXMuYW4ub2JqZWN0KCBfdmFsdWUgKSAmJiBfdmFsdWVbICdfX2lzTW9sZHknIF0gPT09IHRydWUgKSB7XHJcbiAgICB2YWx1ZSA9IHtcclxuICAgICAgdHlwZTogJ21vbGR5JyxcclxuICAgICAgZGVmYXVsdDogX3ZhbHVlXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhbHVlID0gX3ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1lcmdlKCB7XHJcbiAgICBuYW1lOiBfa2V5IHx8ICcnLFxyXG4gICAgdHlwZTogJycsXHJcbiAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgb3B0aW9uYWw6IGZhbHNlXHJcbiAgfSwgdmFsdWUgKTtcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9fZGF0YVsgX2tleSBdO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydHMuZGVzdHJveWVkRXJyb3IgPSBmdW5jdGlvbiAoIF9tb2xkeSApIHtcclxuICB2YXIgaXRlbSA9IHR5cGVvZiBfbW9sZHkgPT09ICdvYmplY3QnID8gX21vbGR5IDoge307XHJcbiAgcmV0dXJuIG5ldyBFcnJvciggJ1RoZSBnaXZlbiBtb2xkeSBpdGVtIGAnICsgaXRlbS5fX25hbWUgKyAnYCBoYXMgYmVlbiBkZXN0cm95ZWQnICk7XHJcbn07XHJcblxyXG5leHBvcnRzLnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBfc2VsZi5idXN5ID0gdHJ1ZTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnRzLnNldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgYXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXHJcbiAgICAgIHZhbHVlID0gYXR0cmlidXRlcy50eXBlID8gY2FzdCggX3ZhbHVlLCBhdHRyaWJ1dGVzLnR5cGUsIGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgOiBfdmFsdWU7XHJcblxyXG4gICAgaWYgKCBzZWxmLl9fZGF0YVsgX2tleSBdICE9PSB2YWx1ZSApIHtcclxuICAgICAgc2VsZi5lbWl0KCAnY2hhbmdlJywgc2VsZi5fX2RhdGFbIF9rZXkgXSwgdmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLl9fZGF0YVsgX2tleSBdID0gdmFsdWU7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0cy51bnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBfc2VsZi5idXN5ID0gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gKCkge307XHJcblxyXG52YXIgX2V4dGVuZCA9IGZ1bmN0aW9uKCBvYmogKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICkuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcclxuICAgICAgaWYgKCBzb3VyY2UgKSB7XHJcbiAgICAgICAgZm9yICggdmFyIHByb3AgaW4gc291cmNlICkge1xyXG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIG9iajtcclxufTtcclxuXHJcbmV4cG9ydHMuZXh0ZW5kID0gX2V4dGVuZDtcclxuXHJcbmV4cG9ydHMuZXh0ZW5kT2JqZWN0ID0gZnVuY3Rpb24oIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzICkge1xyXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xyXG4gIHZhciBjaGlsZDtcclxuXHJcbiAgaWYgKCBwcm90b1Byb3BzICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggcHJvdG9Qcm9wcywgJ2NvbnN0cnVjdG9yJyApICkge1xyXG4gICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjaGlsZCA9IGZ1bmN0aW9uKCApeyByZXR1cm4gcGFyZW50LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTsgfTtcclxuICB9XHJcblxyXG4gIF9leHRlbmQoIGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzICk7XHJcblxyXG4gIHZhciBTdXJyb2dhdGUgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XHJcblxyXG4gIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xyXG4gIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XHJcblxyXG4gICBpZiAocHJvdG9Qcm9wcykgX2V4dGVuZCggY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzICk7XHJcblxyXG4gICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuICByZXR1cm4gY2hpbGQ7XHJcbn07IiwidmFyIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuICBlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxyXG4gIGhhc0tleSA9IHJlcXVpcmUoICdzYy1oYXNrZXknICksXHJcbiAgaGVscGVycyA9IHJlcXVpcmUoICcuL2hlbHBlcnMnICksXHJcbiAgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXHJcbiAgcmVxdWVzdCA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXHJcbiAgZXh0ZW5kID0gaGVscGVycy5leHRlbmRPYmplY3QsXHJcbiAgdXNlaWZ5ID0gcmVxdWlyZSggJ3VzZWlmeScgKTtcclxuXHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICggaW5pdGlhbCwgX19tb2xkeSApIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIGluaXRpYWwgPSBpbml0aWFsIHx8IHt9O1xyXG5cclxuICB0aGlzLl9fbW9sZHkgPSBfX21vbGR5O1xyXG4gIHRoaXMuX19pc01vbGR5ID0gdHJ1ZTtcclxuICB0aGlzLl9fYXR0cmlidXRlcyA9IHt9O1xyXG4gIHRoaXMuX19kYXRhID0ge307XHJcbiAgdGhpcy5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoICFzZWxmLl9fbW9sZHkuX19rZXlsZXNzICkge1xyXG4gICAgc2VsZi5fX21vbGR5LiRkZWZpbmVQcm9wZXJ0eSggc2VsZiwgc2VsZi5fX21vbGR5Ll9fa2V5ICk7XHJcbiAgfVxyXG5cclxuICBPYmplY3Qua2V5cyggY2FzdCggc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGEsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gICAgc2VsZi5fX21vbGR5LiRkZWZpbmVQcm9wZXJ0eSggc2VsZiwgX2tleSwgaW5pdGlhbFsgX2tleSBdICk7XHJcbiAgfSApO1xyXG5cclxuICBmb3IgKCB2YXIgaSBpbiBpbml0aWFsICkge1xyXG4gICAgaWYgKCBpbml0aWFsLmhhc093blByb3BlcnR5KCBpICkgJiYgc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGFbIGkgXSApIHtcclxuICAgICAgdGhpc1sgaSBdID0gaW5pdGlhbFsgaSBdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VsZi5vbiggJ3ByZXNhdmUnLCBoZWxwZXJzLnNldEJ1c3koIHNlbGYgKSApO1xyXG4gIHNlbGYub24oICdzYXZlJywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xyXG5cclxuICBzZWxmLm9uKCAncHJlZGVzdHJveScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XHJcbiAgc2VsZi5vbiggJ2Rlc3Ryb3knLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XHJcblxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRjbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIE9iamVjdC5rZXlzKCBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgIGlmICggaGFzS2V5KCBzZWxmWyBfa2V5IF0sICdfX2lzTW9sZHknLCAnYm9vbGVhbicgKSAmJiBzZWxmWyBfa2V5IF0uX19pc01vbGR5ID09PSB0cnVlICkge1xyXG4gICAgICBzZWxmWyBfa2V5IF0uJGNsZWFyKCk7XHJcbiAgICB9IGVsc2UgaWYgKCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSApIHtcclxuICAgICAgd2hpbGUgKCBzZWxmWyBfa2V5IF0ubGVuZ3RoID4gMCApIHtcclxuICAgICAgICBzZWxmWyBfa2V5IF0uc2hpZnQoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZlsgX2tleSBdID0gc2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZvaWQgMDtcclxuICAgIH1cclxuICB9ICk7XHJcbn07XHJcblxyXG4vKipcclxuICogJGNsb25lIHdvbid0IHdvcmsgY3VycmVudGx5XHJcbiAqIEBwYXJhbSAge1t0eXBlXX0gX2RhdGEgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICovXHJcbk1vZGVsLnByb3RvdHlwZS4kY2xvbmUgPSBmdW5jdGlvbiAoIF9kYXRhICkge1xyXG4gIHZhciBzZWxmID0gdGhpcyxcclxuICAgIGluaXRpYWxWYWx1ZXMgPSB0aGlzLiRqc29uKCk7XHJcblxyXG4gIC8vICBkYXRhID0gaXMuYW4ub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiBzZWxmLl9fZGF0YTtcclxuICBoZWxwZXJzLmV4dGVuZCggaW5pdGlhbFZhbHVlcywgX2RhdGEgfHwge30gKTtcclxuXHJcbiAgdmFyIG5ld01vbGR5ID0gdGhpcy5fX21vbGR5LmNyZWF0ZSggaW5pdGlhbFZhbHVlcyApO1xyXG4gIC8qIHRoaXMuX19tb2xkeW5ldyBNb2RlbEZhY3RvcnkoIHNlbGYuX19uYW1lLCB7XHJcbiAgICAgIGJhc2VVcmw6IHNlbGYuX19tb2xkeS4kYmFzZVVybCgpLFxyXG4gICAgICBoZWFkZXJzOiBzZWxmLl9faGVhZGVycyxcclxuICAgICAga2V5OiBzZWxmLl9fa2V5LFxyXG4gICAgICBrZXlsZXNzOiBzZWxmLl9fa2V5bGVzcyxcclxuICAgICAgdXJsOiBzZWxmLl9fdXJsXHJcbiAgICB9ICk7Ki9cclxuXHJcbiAgLypcclxuICBPYmplY3Qua2V5cyggc2VsZi5fX2F0dHJpYnV0ZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9wcm9wZXJ0eUtleSApIHtcclxuICAgIG5ld01vbGR5LiRwcm9wZXJ0eSggX3Byb3BlcnR5S2V5LCBtZXJnZSggc2VsZi5fX2F0dHJpYnV0ZXNbIF9wcm9wZXJ0eUtleSBdICkgKTtcclxuICAgIGlmICggaXMuYW4uYXJyYXkoIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXSApICYmIGlzLmFuLmFycmF5KCBkYXRhWyBfcHJvcGVydHlLZXkgXSApICkge1xyXG4gICAgICBkYXRhWyBfcHJvcGVydHlLZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9kYXRhSXRlbSApIHtcclxuICAgICAgICBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0ucHVzaCggX2RhdGFJdGVtICk7XHJcbiAgICAgIH0gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXSA9IGRhdGFbIF9wcm9wZXJ0eUtleSBdXHJcbiAgICB9XHJcbiAgfSApOyovXHJcblxyXG4gIHJldHVybiBuZXdNb2xkeTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kZGF0YSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgZGF0YSA9IGlzLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDoge307XHJcblxyXG4gIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuICAgIHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XHJcbiAgfVxyXG5cclxuICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgIGlmICggc2VsZi5fX2F0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIF9rZXkgKSApIHtcclxuICAgICAgaWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgaGFzS2V5KCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLCAnYXJyYXlPZkFUeXBlJywgJ2Jvb2xlYW4nICkgJiYgc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXS5hcnJheU9mQVR5cGUgPT09IHRydWUgKSB7XHJcbiAgICAgICAgZGF0YVsgX2tleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX21vbGR5ICkge1xyXG4gICAgICAgICAgc2VsZlsgX2tleSBdLnB1c2goIF9tb2xkeSApO1xyXG4gICAgICAgIH0gKTtcclxuICAgICAgfSBlbHNlIGlmICggaXMuYS5vYmplY3QoIGRhdGFbIF9rZXkgXSApICYmIHNlbGZbIF9rZXkgXSBpbnN0YW5jZW9mIE1vZGVsICkge1xyXG4gICAgICAgIHNlbGZbIF9rZXkgXS4kZGF0YSggZGF0YVsgX2tleSBdICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZlsgX2tleSBdID0gZGF0YVsgX2tleSBdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICByZXR1cm4gc2VsZjtcclxufTtcclxuXHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGRlc3Ryb3kgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICBpc0RpcnR5ID0gc2VsZi4kaXNEaXJ0eSgpLFxyXG4gICAgZGF0YSA9IHNlbGYuJGpzb24oKSxcclxuICAgIHVybCA9IHNlbGYuX19tb2xkeS4kdXJsKCkgKyAoIHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyAnJyA6ICcvJyArIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdICksXHJcbiAgICBtZXRob2QgPSAnZGVsZXRlJyxcclxuICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcbiAgaWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKSBdICk7XHJcbiAgfVxyXG5cclxuICBzZWxmLmVtaXQoICdwcmVkZXN0cm95Jywge1xyXG4gICAgbW9sZHk6IHNlbGYsXHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgbWV0aG9kOiBtZXRob2QsXHJcbiAgICB1cmw6IHVybCxcclxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gIH0gKTtcclxuXHJcbiAgY29uc29sZS5sb2coIFwiSSBhbSBpbiBkZXN0cm95XCIgKTtcclxuXHJcbiAgaWYgKCAhaXNEaXJ0eSApIHtcclxuICAgIGNvbnNvbGUubG9nKCBcImlzRGlydHlcIiApXHJcbiAgICB0aGlzLl9fbW9sZHkuX19kZWZhdWx0TWlkZGxld2FyZS5fX2RlZmF1bHQuZGVzdHJveS5jYWxsKCB0aGlzLl9fbW9sZHksIHRoaXMuJGpzb24oKSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblxyXG4gICAgICBpZiAoIF9lcnJvciAmJiAhKCBfZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xyXG4gICAgICAgIF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuZW1pdCggJ2Rlc3Ryb3knLCBfZXJyb3IsIF9yZXMgKTtcclxuICAgICAgc2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICAgIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soIF9lcnJvciwgX3JlcyApO1xyXG4gICAgfSApO1xyXG5cclxuXHJcbiAgICAvKnJlcXVlc3QoIHNlbGYuX19tb2xkeSwgc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG4gICAgICBzZWxmLmVtaXQoICdkZXN0cm95JywgX2Vycm9yLCBfcmVzICk7XHJcbiAgICAgIHNlbGYuX19kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgICBzZWxmWyBzZWxmLl9fbW9sZHkuX19rZXkgXSA9IHVuZGVmaW5lZDtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xyXG4gICAgfSApOyovXHJcbiAgfSBlbHNlIHtcclxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCBuZXcgRXJyb3IoICdUaGlzIG1vbGR5IGNhbm5vdCBiZSBkZXN0cm95ZWQgYmVjYXVzZSBpdCBoYXMgbm90IGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciB5ZXQuJyApICk7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgcmV0dXJuIHRoaXMuX19kZXN0cm95ZWQgPyB0cnVlIDogaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19tb2xkeS5fX2tleSBdICk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCB0aGlzLl9fZGVzdHJveWVkICkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgaXNWYWxpZCA9IHRydWU7XHJcblxyXG4gIE9iamVjdC5rZXlzKCBzZWxmLl9fYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHJcbiAgICBpZiAoIHNlbGYuJGlzRGlydHkoKSAmJiBfa2V5ID09PSBzZWxmLl9fbW9sZHkuX19rZXkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdmFsdWUgPSBzZWxmWyBfa2V5IF0sXHJcbiAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG4gICAgICB0eXBlID0gYXR0cmlidXRlcy50eXBlLFxyXG4gICAgICBhcnJheU9mQVR5cGUgPSBoYXNLZXkoIGF0dHJpYnV0ZXMsICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSA/IGF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID09PSB0cnVlIDogZmFsc2UsXHJcbiAgICAgIGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsICE9PSB0cnVlLFxyXG4gICAgICBpc051bGxPclVuZGVmaW5lZCA9IHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyBmYWxzZSA6IGFycmF5T2ZBVHlwZSA/IHZhbHVlLmxlbmd0aCA9PT0gMCA6IGlzLm51bGxPclVuZGVmaW5lZCggdmFsdWUgKSxcclxuICAgICAgdHlwZUlzV3JvbmcgPSBpcy5ub3QuZW1wdHkoIHR5cGUgKSAmJiBpcy5hLnN0cmluZyggdHlwZSApID8gaXMubm90LmFbIHR5cGUgXSggdmFsdWUgKSA6IGlzTnVsbE9yVW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICggYXJyYXlPZkFUeXBlICYmIGlzLm5vdC5lbXB0eSggdmFsdWUgKSAmJiB2YWx1ZVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgIHZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XHJcbiAgICAgICAgaWYgKCBpc1ZhbGlkICYmIF9pdGVtLiRpc1ZhbGlkKCkgPT09IGZhbHNlICkge1xyXG4gICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggaXNWYWxpZCAmJiBpc1JlcXVpcmVkICYmIHR5cGVJc1dyb25nICkge1xyXG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gIH0gKTtcclxuXHJcbiAgcmV0dXJuIGlzVmFsaWQ7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGpzb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgZGF0YSA9IHNlbGYuX19kYXRhLFxyXG4gICAganNvbiA9IHt9O1xyXG5cclxuICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGRhdGFbIF9rZXkgXVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgIGpzb25bIF9rZXkgXSA9IFtdO1xyXG4gICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcbiAgICAgICAganNvblsgX2tleSBdLnB1c2goIF9tb2xkeS4kanNvbigpICk7XHJcbiAgICAgIH0gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzb25bIF9rZXkgXSA9IGRhdGFbIF9rZXkgXSBpbnN0YW5jZW9mIE1vZGVsID8gZGF0YVsgX2tleSBdLiRqc29uKCkgOiBkYXRhWyBfa2V5IF07XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICByZXR1cm4ganNvbjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kc2F2ZSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xyXG4gIHZhciBzZWxmID0gdGhpcyxcclxuICAgIGVycm9yID0gbnVsbCxcclxuICAgIGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXHJcbiAgICBkYXRhID0gc2VsZi4kanNvbigpLFxyXG4gICAgdXJsID0gc2VsZi5fX21vbGR5LiR1cmwoKSArICggIWlzRGlydHkgJiYgIXNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyAnLycgKyBzZWxmWyBzZWxmLl9fbW9sZHkuX19rZXkgXSA6ICcnICksXHJcbiAgICBtZXRob2QgPSBpc0RpcnR5ID8gJ3NhdmUnIDogJ2NyZWF0ZScsXHJcbiAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XHJcblxyXG4gIHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcbiAgc2VsZi5lbWl0KCAncHJlc2F2ZScsIHtcclxuICAgIG1vbGR5OiBzZWxmLFxyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgdXJsOiB1cmwsXHJcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICB9ICk7XHJcblxyXG4gIHZhciByZXNwb25zZVNob3VsZENvbnRhaW5BbklkID0gaGFzS2V5KCBkYXRhLCBzZWxmLl9fa2V5ICkgJiYgaXMubm90LmVtcHR5KCBkYXRhWyBzZWxmLl9fa2V5IF0gKTtcclxuXHJcbiAgY29uc29sZS5sb2coIFwiISEhXCIgKVxyXG4gIGNvbnNvbGUubG9nKCB0aGlzLl9fbW9sZHkuX19kZWZhdWx0TWlkZGxld2FyZSApXHJcblxyXG4gIHRoaXMuX19tb2xkeS5fX2RlZmF1bHRNaWRkbGV3YXJlLl9fZGVmYXVsdFsgbWV0aG9kIF0uY2FsbCggdGhpcy5fX21vbGR5LCBkYXRhLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuXHJcbiAgICBpZiAoIF9lcnJvciAmJiAhKCBfZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xyXG4gICAgICBfZXJyb3IgPSBuZXcgRXJyb3IoICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkJyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggIV9lcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggX3JlcyApICYmICggcmVzcG9uc2VTaG91bGRDb250YWluQW5JZCAmJiAhaGFzS2V5KCBfcmVzLCBzZWxmLl9fbW9sZHkuX19rZXkgKSApICkge1xyXG4gICAgICBfZXJyb3IgPSBuZXcgRXJyb3IoICdUaGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGRpZCBub3QgY29udGFpbiBhIHZhbGlkIGAnICsgc2VsZi5fX21vbGR5Ll9fa2V5ICsgJ2AnICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCAhX2Vycm9yICYmIGlzRGlydHkgJiYgaXMub2JqZWN0KCBfcmVzICkgKSB7XHJcbiAgICAgIHNlbGYuX19tb2xkeVsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gPSBfcmVzWyBzZWxmLl9fbW9sZHkuX19rZXkgXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoICFlcnJvciApIHtcclxuICAgICAgc2VsZi4kZGF0YSggX3JlcyApO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuZW1pdCggJ3NhdmUnLCBfZXJyb3IsIF9yZXMgKTtcclxuXHJcbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayggX2Vycm9yLCBfcmVzICk7IC8vbm90IHN1cmUgYWJvdXQgdGhhdCAhIHdoeSBwYXNzaW5nIHRoZSBjb250ZXh0ID9cclxuICB9ICk7XHJcblxyXG4gIC8qcmVxdWVzdCggc2VsZi5fX21vbGR5LCBzZWxmLCBkYXRhLCBtZXRob2QsIHVybCwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcbiAgICBzZWxmLmVtaXQoICdzYXZlJywgX2Vycm9yLCBfcmVzICk7XHJcbiAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7IC8vbm90IHN1cmUgYWJvdXQgdGhhdCAhIHdoeSBwYXNzaW5nIHRoZSBjb250ZXh0ID9cclxuICB9ICk7Ki9cclxuXHJcbn07XHJcblxyXG5lbWl0dGVyKCBNb2RlbC5wcm90b3R5cGUgKTtcclxudXNlaWZ5KCBNb2RlbCApO1xyXG5cclxuTW9kZWwuZXh0ZW5kID0gZXh0ZW5kO1xyXG5cclxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwidmFyIGhlbHBlcnMgPSByZXF1aXJlKCBcIi4vaGVscGVycy9pbmRleFwiICksXHJcbiAgZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuICBvYnNlcnZhYmxlQXJyYXkgPSByZXF1aXJlKCAnc2ctb2JzZXJ2YWJsZS1hcnJheScgKSxcclxuICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxyXG4gIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxyXG4gIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuICB1c2VpZnkgPSByZXF1aXJlKCAndXNlaWZ5JyApO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIEJhc2VNb2RlbCwgZGVmYXVsdENvbmZpZ3VyYXRpb24sIGRlZmF1bHRNaWRkbGV3YXJlICkge1xyXG5cclxuICB2YXIgTW9sZHkgPSBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgcHJvcGVydGllcyA9IGlzLmFuLm9iamVjdCggX3Byb3BlcnRpZXMgKSA/IF9wcm9wZXJ0aWVzIDoge30sXHJcblxyXG4gICAgICBpbml0aWFsID0gcHJvcGVydGllcy5pbml0aWFsIHx8IHt9O1xyXG5cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBzZWxmLCB7XHJcbiAgICAgIF9fbW9sZHk6IHtcclxuICAgICAgICB2YWx1ZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX3Byb3BlcnRpZXM6IHtcclxuICAgICAgICB2YWx1ZTogcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF0gfHwge31cclxuICAgICAgfSxcclxuICAgICAgX19tZXRhZGF0YToge1xyXG4gICAgICAgIHZhbHVlOiB7fVxyXG4gICAgICB9LFxyXG4gICAgICBfX2Jhc2VVcmw6IHtcclxuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2Jhc2VVcmwnIF0sICdzdHJpbmcnLCAnJyApLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fZGF0YToge1xyXG4gICAgICAgIHZhbHVlOiB7fSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX2Rlc3Ryb3llZDoge1xyXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX2hlYWRlcnM6IHtcclxuICAgICAgICB2YWx1ZTogbWVyZ2UoIHt9LCBjYXN0KCBwcm9wZXJ0aWVzWyAnaGVhZGVycycgXSwgJ29iamVjdCcsIHt9ICksIGNhc3QoIGRlZmF1bHRDb25maWd1cmF0aW9uLmhlYWRlcnMsICdvYmplY3QnLCB7fSApICksXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19rZXk6IHtcclxuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fa2V5bGVzczoge1xyXG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSA9PT0gdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX25hbWU6IHtcclxuICAgICAgICB2YWx1ZTogX25hbWUgfHwgcHJvcGVydGllc1sgJ25hbWUnIF0gfHwgJydcclxuICAgICAgfSxcclxuICAgICAgX191cmw6IHtcclxuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ3VybCcgXSwgJ3N0cmluZycsICcnICksXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgYnVzeToge1xyXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgaWYgKCAhc2VsZi5fX2tleWxlc3MgKSB7XHJcbiAgICAgIHRoaXMuJHByb3BlcnR5KCB0aGlzLl9fa2V5ICk7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19wcm9wZXJ0aWVzLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgICAgc2VsZi4kcHJvcGVydHkoIF9rZXksIHNlbGYuX19wcm9wZXJ0aWVzWyBfa2V5IF0gKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICBzZWxmLm9uKCAncHJlZmluZE9uZScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XHJcbiAgICBzZWxmLm9uKCAnZmluZE9uZScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuc2NoZW1hID0gZnVuY3Rpb24gKCBzY2hlbWEgKSB7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGNhc3QoIHNjaGVtYSwgJ29iamVjdCcsIHt9ICkgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcbiAgICAgIHNlbGYuJHByb3BlcnR5KCBfa2V5LCBzY2hlbWFbIF9rZXkgXSApO1xyXG4gICAgfSApO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS5wcm90byA9IGZ1bmN0aW9uICggcHJvdG8gKSB7XHJcblxyXG4gICAgdGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gPSB0aGlzLl9fcHJvcGVydGllcy5wcm90byB8fCB7fTtcclxuICAgIGhlbHBlcnMuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90bywgcHJvdG8gKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCBfaW5pdGlhbCApIHtcclxuXHJcbiAgICB2YXIgS2xhc3MgPSBCYXNlTW9kZWwuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90byB8fCB7fSApO1xyXG5cclxuICAgIHJldHVybiBuZXcgS2xhc3MoIF9pbml0aWFsLCB0aGlzICk7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRoZWFkZXJzID0gZnVuY3Rpb24gKCBfaGVhZGVycyApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XHJcbiAgICAgIHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5fX2hlYWRlcnMgPSBpcy5hbi5vYmplY3QoIF9oZWFkZXJzICkgPyBfaGVhZGVycyA6IHNlbGYuX19oZWFkZXJzO1xyXG4gICAgcmV0dXJuIGlzLm5vdC5hbi5vYmplY3QoIF9oZWFkZXJzICkgPyBzZWxmLl9faGVhZGVycyA6IHNlbGY7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLmZpbmRPbmUgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICByZXN1bHQsXHJcbiAgICAgIHVybCA9IHNlbGYuJHVybCgpLFxyXG4gICAgICBtZXRob2QgPSAnZmluZE9uZScsXHJcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wXHJcbiAgICAgIHdhc0Rlc3Ryb3llZCA9IHNlbGYuX19kZXN0cm95ZWQ7XHJcblxyXG4gICAgc2VsZi5lbWl0KCAncHJlZmluZE9uZScsIHtcclxuICAgICAgbW9sZHk6IHNlbGYsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBxdWVyeTogcXVlcnksXHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgIH0gKTtcclxuXHJcbiAgICBzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gICAgY29uc29sZS5sb2coKVxyXG4gICAgdGhpcy5fX2RlZmF1bHRNaWRkbGV3YXJlLl9fZGVmYXVsdC5maW5kT25lLmNhbGwoIHRoaXMsIF9xdWVyeSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXNwb25zZSApIHtcclxuICAgICAgaWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcclxuICAgICAgICBfZXJyb3IgPSBuZXcgRXJyb3IoICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkJyApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoICFfZXJyb3IgKSB7XHJcbiAgICAgICAgaWYgKCBpcy5hcnJheSggX3Jlc3BvbnNlICkgKSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBzZWxmLmNyZWF0ZSggX3Jlc3BvbnNlWyAwIF0gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzdWx0ID0gc2VsZi5jcmVhdGUoIF9yZXNwb25zZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5lbWl0KCAnZmluZE9uZScsIF9lcnJvciwgX3Jlc3BvbnNlICk7XHJcblxyXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayggX2Vycm9yLCByZXN1bHQgKTtcclxuICAgIH0gKTtcclxuICAgIC8vcmVxdWVzdCggc2VsZiwgbnVsbCwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuICAgIC8vdmFyIHJlcyA9IF9yZXMgaW5zdGFuY2VvZiBCYXNlTW9kZWwgPyBfcmVzIDogbnVsbDtcclxuXHJcbiAgICAvKmlmICggaXMuYW4uYXJyYXkoIF9yZXMgKSAmJiBfcmVzWyAwIF0gaW5zdGFuY2VvZiBCYXNlTW9kZWwgKSB7XHJcbiAgICAgICAgc2VsZi4kZGF0YSggX3Jlc1sgMCBdLiRqc29uKCkgKTtcclxuICAgICAgICByZXMgPSBzZWxmO1xyXG4gICAgICB9Ki9cclxuICAgIC8qXHJcbiAgICAgIGlmICggX2Vycm9yICYmIHdhc0Rlc3Ryb3llZCApIHtcclxuICAgICAgICBzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgICAgfSovXHJcblxyXG4gICAgLy9zZWxmLmVtaXQoICdmaW5kT25lJywgX2Vycm9yLCBfcmVzICk7XHJcblxyXG4gICAgLy9jYWxsYmFjay5hcHBseSggc2VsZiwgWyBfZXJyb3IsIF9yZXMgXSApO1xyXG4gICAgLy99ICk7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiR1cmwgPSBmdW5jdGlvbiAoIF91cmwgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGJhc2UgPSBpcy5lbXB0eSggc2VsZi4kYmFzZVVybCgpICkgPyAnJyA6IHNlbGYuJGJhc2VVcmwoKSxcclxuICAgICAgbmFtZSA9IGlzLmVtcHR5KCBzZWxmLl9fbmFtZSApID8gJycgOiAnLycgKyBzZWxmLl9fbmFtZS50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApLFxyXG4gICAgICB1cmwgPSBfdXJsIHx8IHNlbGYuX191cmwgfHwgJycsXHJcbiAgICAgIGVuZHBvaW50ID0gYmFzZSArIG5hbWUgKyAoIGlzLmVtcHR5KCB1cmwgKSA/ICcnIDogJy8nICsgdXJsLnRyaW0oKS5yZXBsYWNlKCAvXlxcLy8sICcnICkgKTtcclxuXHJcbiAgICBzZWxmLl9fdXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvXlxcLy8sICcnICk7XHJcblxyXG4gICAgcmV0dXJuIGlzLm5vdC5hLnN0cmluZyggX3VybCApID8gZW5kcG9pbnQgOiBzZWxmO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS5fX2RlZmF1bHRNaWRkbGV3YXJlID0gZGVmYXVsdE1pZGRsZXdhcmU7XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kYmFzZVVybCA9IGZ1bmN0aW9uICggX2Jhc2UgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIHVybCA9IGNhc3QoIF9iYXNlLCAnc3RyaW5nJywgc2VsZi5fX2Jhc2VVcmwgfHwgJycgKTtcclxuXHJcbiAgICBzZWxmLl9fYmFzZVVybCA9IHVybC50cmltKCkucmVwbGFjZSggLyhcXC98XFxzKSskL2csICcnICkgfHwgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCB8fCAnJztcclxuXHJcbiAgICByZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfYmFzZSApID8gc2VsZi5fX2Jhc2VVcmwgOiBzZWxmO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgdXJsID0gc2VsZi4kdXJsKCksXHJcbiAgICAgIG1ldGhvZCA9ICdmaW5kJyxcclxuICAgICAgcmVzdWx0ID0gW10sXHJcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuICAgIHNlbGYuZW1pdCggJ3ByZWZpbmQnLCB7XHJcbiAgICAgIG1vbGR5OiBzZWxmLFxyXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgcXVlcnk6IHF1ZXJ5LFxyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICB9ICk7XHJcblxyXG4gICAgdGhpcy5fX2RlZmF1bHRNaWRkbGV3YXJlLl9fZGVmYXVsdC5maW5kLmNhbGwoIHRoaXMsIF9xdWVyeSwgZnVuY3Rpb24gKCBfZXJyb3IsIHJlcyApIHtcclxuXHJcbiAgICAgIGlmICggX2Vycm9yICYmICEoIF9lcnJvciBpbnN0YW5jZW9mIF9lcnJvciApICkge1xyXG4gICAgICAgIF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggaXMuYXJyYXkoIHJlcyApICkge1xyXG4gICAgICAgIHJlcy5mb3JFYWNoKCBmdW5jdGlvbiAoIF9kYXRhICkge1xyXG4gICAgICAgICAgcmVzdWx0LnB1c2goIHNlbGYuY3JlYXRlKCBfZGF0YSApICk7XHJcbiAgICAgICAgfSApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKCBzZWxmLmNyZWF0ZSggX2RhdGEgKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcmVzID0gY2FzdCggcmVzdWx0IGluc3RhbmNlb2YgQmFzZU1vZGVsIHx8IGlzLmFuLmFycmF5KCByZXN1bHQgKSA/IHJlc3VsdCA6IG51bGwsICdhcnJheScsIFtdICk7XHJcblxyXG4gICAgICBzZWxmLmVtaXQoICdmaW5kJywgX2Vycm9yLCByZXMgKTtcclxuXHJcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlcyApO1xyXG5cclxuICAgIH0gKTtcclxuICAgIC8qcmVxdWVzdCggc2VsZiwgbnVsbCwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuICAgICAgdmFyIHJlcyA9IGNhc3QoIF9yZXMgaW5zdGFuY2VvZiBCYXNlTW9kZWwgfHwgaXMuYW4uYXJyYXkoIF9yZXMgKSA/IF9yZXMgOiBudWxsLCAnYXJyYXknLCBbXSApO1xyXG4gICAgICBzZWxmLmVtaXQoICdmaW5kJywgX2Vycm9yLCByZXMgKTtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgX2Vycm9yLCByZXMgXSApO1xyXG4gICAgfSApOyovXHJcblxyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAoIG9iaiwga2V5LCB2YWx1ZSApIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGV4aXN0aW5nVmFsdWUgPSBvYmpbIGtleSBdIHx8IHZhbHVlLFxyXG4gICAgICBtZXRhZGF0YSA9IHRoaXMuX19tZXRhZGF0YVsga2V5IF07XHJcblxyXG4gICAgaWYgKCAhb2JqLmhhc093blByb3BlcnR5KCBrZXkgKSB8fCAhb2JqLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgIGlmICggbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlNb2xkeSB8fCBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheVN0cmluZyApIHtcclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgPSBtZXRhZGF0YS52YWx1ZTtcclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5TW9sZHk7XHJcbiAgICAgICAgbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlTdHJpbmc7XHJcbiAgICAgICAgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggbWV0YWRhdGEudmFsdWVJc0FTdGF0aWNNb2xkeSApIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IG5ldyBNb2xkeSggbWV0YWRhdGEudmFsdWUubmFtZSwgbWV0YWRhdGEudmFsdWUgKS5jcmVhdGUoKSxcclxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgfSApO1xyXG5cclxuICAgICAgICBvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICkge1xyXG5cclxuICAgICAgICB2YXIgYXJyYXkgPSBvYnNlcnZhYmxlQXJyYXkoIFtdICksXHJcbiAgICAgICAgICBhdHRyaWJ1dGVUeXBlID0gbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nIHx8IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID8gbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlWyAwIF0gOiAnKic7XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IGFycmF5LFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuICAgICAgICBbICdwdXNoJywgJ3Vuc2hpZnQnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xyXG4gICAgICAgICAgYXJyYXkub24oIF9tZXRob2QsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXHJcbiAgICAgICAgICAgICAgdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuICAgICAgICAgICAgICBpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vbGR5ID0gbmV3IE1vbGR5KCBhdHRyaWJ1dGVUeXBlWyAnbmFtZScgXSwgYXR0cmlidXRlVHlwZSApLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhID0gaXMuYW4ub2JqZWN0KCBfaXRlbSApID8gX2l0ZW0gOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCggbW9sZHkuY3JlYXRlKCBkYXRhICkgKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goIGNhc3QoIF9pdGVtLCBhdHRyaWJ1dGVUeXBlLCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIHZhbHVlcyApO1xyXG4gICAgICAgICAgfSApO1xyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgaWYgKCBleGlzdGluZ1ZhbHVlICYmIGV4aXN0aW5nVmFsdWUubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgIGV4aXN0aW5nVmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBvICkge1xyXG4gICAgICAgICAgICBvYmpbIGtleSBdLnB1c2goIG8gKTtcclxuICAgICAgICAgIH0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuICAgICAgICAgIGdldDogaGVscGVycy5nZXRQcm9wZXJ0eSgga2V5ICksXHJcbiAgICAgICAgICBzZXQ6IGhlbHBlcnMuc2V0UHJvcGVydHkoIGtleSApLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgb2JqLl9fYXR0cmlidXRlc1sga2V5IF0gPSBtZXRhZGF0YS5hdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggZXhpc3RpbmdWYWx1ZSAhPT0gdm9pZCAwICkgeyAvL2lmIGV4aXN0aW5nIHZhbHVlXHJcbiAgICAgIG9ialsga2V5IF0gPSBleGlzdGluZ1ZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSAmJiBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICkge1xyXG4gICAgICBvYmpbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XHJcbiAgICB9IGVsc2UgaWYgKCBpcy5lbXB0eSggb2JqWyBrZXkgXSApICYmIG1ldGFkYXRhLmF0dHJpYnV0ZXMub3B0aW9uYWwgPT09IGZhbHNlICkge1xyXG4gICAgICBpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgfHwgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcclxuICAgICAgICBvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBpcy5lbXB0eSggbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlICkgPyB1bmRlZmluZWQgOiBjYXN0KCB1bmRlZmluZWQsIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBhdHRyaWJ1dGVzID0gbmV3IGhlbHBlcnMuYXR0cmlidXRlcyggX2tleSwgX3ZhbHVlICksXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgPSBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlICkgJiYgL21vbGR5Ly50ZXN0KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IGlzLmFuLmFycmF5KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuICAgICAgdmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5U3RyaW5nID0gaXMuYW4uYXJyYXkoIF92YWx1ZSApICYmIGlzLmEuc3RyaW5nKCBfdmFsdWVbIDAgXSApLFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgJiYgaGFzS2V5KCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcclxuICAgICAgdmFsdWVJc0FTdGF0aWNNb2xkeSA9IGhhc0tleSggX3ZhbHVlLCAncHJvcGVydGllcycsICdvYmplY3QnICk7XHJcblxyXG4gICAgc2VsZi5fX21ldGFkYXRhWyBfa2V5IF0gPSB7XHJcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcbiAgICAgIHZhbHVlOiBfdmFsdWUsXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHk6IGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHksXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXk6IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5TW9sZHk6IHZhbHVlSXNBbkFycmF5TW9sZHksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5U3RyaW5nOiB2YWx1ZUlzQW5BcnJheVN0cmluZyxcclxuICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHk6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5LFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmc6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyxcclxuICAgICAgdmFsdWVJc0FTdGF0aWNNb2xkeTogdmFsdWVJc0FTdGF0aWNNb2xkeVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VsZjtcclxuICB9O1xyXG5cclxuICBlbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcclxuICB1c2VpZnkoIE1vbGR5ICk7XHJcblxyXG4gIHJldHVybiBNb2xkeTtcclxuXHJcbn07IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG4gIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApO1xyXG4vKipcclxuICogRmV0Y2hpbmcgdGhlIGRhdGFcclxuICogQHBhcmFtICB7W3R5cGVdfSBfbW9sZHkgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9kYXRhICAgICBbZGVzY3JpcHRpb25dXHJcbiAqIEBwYXJhbSAge1t0eXBlXX0gX21ldGhvZCAgIFtkZXNjcmlwdGlvbl1cclxuICogQHBhcmFtICB7W3R5cGVdfSBfdXJsICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9jYWxsYmFjayBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfbW9sZHksIGluc3RhbmNlLCBfZGF0YSwgX21ldGhvZCwgX3VybCwgX2NhbGxiYWNrICkge1xyXG4gIHZhciBtb2xkeSA9IF9tb2xkeSxcclxuICAgIHJlc3VsdCA9IFtdLFxyXG4gICAgbWV0aG9kID0gKCBfbWV0aG9kID09PSAnZmluZCcgfHwgX21ldGhvZCA9PT0gJ2ZpbmRPbmUnICkgPyAnZ2V0JyA6IF9tZXRob2QsXHJcbiAgICByZXNwb25zZVNob3VsZENvbnRhaW5BbklkID0gaGFzS2V5KCBfZGF0YSwgbW9sZHkuX19rZXkgKSAmJiBpcy5ub3QuZW1wdHkoIF9kYXRhWyBtb2xkeS5fX2tleSBdICkgJiYgL2dldC8udGVzdCggbWV0aG9kICksXHJcbiAgICBpc0luc3RhbmNlID0gaW5zdGFuY2UgPyB0cnVlIDogZmFsc2UsXHJcbiAgICBpc0RpcnR5ID0gaXNJbnN0YW5jZSA/IGluc3RhbmNlLiRpc0RpcnR5KCkgOiBmYWxzZTtcclxuXHJcbiAgbW9sZHkuX19kZWZhdWx0TWlkZGxld2FyZSggZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXNwb25zZSApIHtcclxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxyXG4gICAgICBlcnJvciA9IF9lcnJvciA9PT0gbW9sZHkgPyBudWxsIDogYXJncy5zaGlmdCgpLFxyXG4gICAgICByZXNwb25zZSA9IGFyZ3Muc2hpZnQoKTtcclxuXHJcbiAgICBpZiAoIGVycm9yICYmICEoIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcclxuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkJyApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggIWVycm9yICYmIGlzSW5zdGFuY2UgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIHJlc3BvbnNlICkgJiYgKCByZXNwb25zZVNob3VsZENvbnRhaW5BbklkICYmICFoYXNLZXkoIHJlc3BvbnNlLCBtb2xkeS5fX2tleSApICkgKSB7XHJcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIG1vbGR5Ll9fa2V5ICsgJ2AnICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCAhZXJyb3IgJiYgaXNEaXJ0eSAmJiBpc0luc3RhbmNlICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSApIHtcclxuICAgICAgbW9sZHlbIG1vbGR5Ll9fa2V5IF0gPSByZXNwb25zZVsgbW9sZHkuX19rZXkgXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoICFlcnJvciApIHtcclxuICAgICAgaWYgKCAhaXNJbnN0YW5jZSApIHtcclxuICAgICAgICBpZiAoIF9tZXRob2QgIT09ICdmaW5kT25lJyAmJiBpcy5hcnJheSggcmVzcG9uc2UgKSApIHtcclxuXHJcbiAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9kYXRhICkge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goIG1vbGR5LmNyZWF0ZSggX2RhdGEgKSApO1xyXG4gICAgICAgICAgfSApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIF9tZXRob2QgPT09ICdmaW5kT25lJyAmJiBpcy5hcnJheSggcmVzcG9uc2UgKSApIHtcclxuICAgICAgICAgIHJlc3VsdCA9IG1vbGR5LmNyZWF0ZSggcmVzcG9uc2VbIDAgXSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBtb2xkeS5jcmVhdGUoIHJlc3BvbnNlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluc3RhbmNlLiRkYXRhKCByZXNwb25zZSApO1xyXG4gICAgICAgIHJlc3VsdCA9IGluc3RhbmNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2NhbGxiYWNrICYmIF9jYWxsYmFjayggZXJyb3IsIHJlc3VsdCApO1xyXG5cclxuICB9LCBfbW9sZHksIF9kYXRhLCBtZXRob2QsIF91cmwgKTtcclxuXHJcbn07Il19
(19)
});
