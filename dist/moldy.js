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

  if( fn === noop && is.an.object( args[0]) ) {
    fn = args.shift().setup();
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
  moldyApi = {},
  useify = _dereq_( 'useify' );

useify( moldyApi );

var ModelFactory = _dereq_( './moldy' )( _dereq_( './model' ), config.defaults, moldyApi.middleware );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;
},{"./config.json":18,"./model":21,"./moldy":22,"useify":17}],20:[function(_dereq_,module,exports){
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
  merge = _dereq_( 'sc-merge' ),
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
},{"./helpers":20,"./request":23,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"useify":17}],22:[function(_dereq_,module,exports){
var helpers = _dereq_( "./helpers/index" ),
	emitter = _dereq_( 'emitter-component' ),
	observableArray = _dereq_( 'sg-observable-array' ),
	hasKey = _dereq_( 'sc-haskey' ),
	is = _dereq_( 'sc-is' ),
	merge = _dereq_( 'sc-merge' ),
	cast = _dereq_( 'sc-cast' ),
	request = _dereq_( './request' ),
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

		if ( !self.__keyless ) {
			this.$property( this.__key );
		}

		Object.keys( cast( self.__properties, 'object', {} ) ).forEach( function ( _key ) {
			self.$property( _key, self.__properties[ _key ] );
		} );

		self.on( 'preget', helpers.setBusy( self ) );
		self.on( 'get', helpers.unsetBusy( self ) );
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
		var self = this,
			Klass = BaseModel.extend( this.__properties.proto || {} ),
			klass = new Klass( _initial, this );

		klass.on( 'save', self.emit.bind( self, 'save' ) );
		klass.on( 'destroy', self.emit.bind( self, 'destroy' ) );

		return klass;
	};

	Moldy.prototype.$headers = function ( _headers ) {
		var self = this;

		if ( self.__destroyed ) {
			return helpers.destroyedError( self );
		}

		self.__headers = is.an.object( _headers ) ? _headers : self.__headers;
		return is.not.an.object( _headers ) ? self.__headers : self;
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


		request( self, null, query, method, url, function ( _error, _res ) {
			//var res = _res instanceof BaseModel ? _res : null;

			// if ( is.an.array( _res ) && _res[ 0 ] instanceof BaseModel ) {
			//   self.$data( _res[ 0 ].$json() );
			//   res = self;
			// }
			/*
      if ( _error && wasDestroyed ) {
        self.__destroyed = true;
      }*/

			self.emit( 'get', _error, _res );

			callback.apply( self, [ _error, _res ] );
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

	Moldy.prototype.__defaultMiddleware = defaultMiddleware;

	Moldy.prototype.$baseUrl = function ( _base ) {
		var self = this,
			url = cast( _base, 'string', self.__baseUrl || '' );

		self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || defaultConfiguration.baseUrl || '';

		return is.not.a.string( _base ) ? self.__baseUrl : self;
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

		request( self, null, query, method, url, function ( _error, _res ) {
			var res = cast( _res instanceof BaseModel || is.an.array( _res ) ? _res : null, 'array', [] );
			self.emit( 'collection', _error, res );
			callback.apply( self, [ _error, res ] );
		} );

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
					enumerable: true,
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

	emitter( Moldy.prototype );
	useify( Moldy );

	return Moldy;

};

},{"./helpers/index":20,"./request":23,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sg-observable-array":15,"useify":17}],23:[function(_dereq_,module,exports){
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
			if ( !isInstance ) {
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
},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3VzZWlmeS9jb25maWcuanNvbiIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3VzZWlmeS9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2NvbmZpZy5qc29uIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvZmFrZV9iNjAxZTBiMy5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L3NyYy9tb2RlbC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL21vbGR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJ2YXIgY29udGFpbnMgPSByZXF1aXJlKCBcInNjLWNvbnRhaW5zXCIgKSxcbiAgaXMgPSByZXF1aXJlKCBcInNjLWlzXCIgKTtcblxudmFyIGNhc3QgPSBmdW5jdGlvbiAoIF92YWx1ZSwgX2Nhc3RUeXBlLCBfZGVmYXVsdCwgX3ZhbHVlcywgX2FkZGl0aW9uYWxQcm9wZXJ0aWVzICkge1xuXG4gIHZhciBwYXJzZWRWYWx1ZSxcbiAgICBjYXN0VHlwZSA9IF9jYXN0VHlwZSxcbiAgICB2YWx1ZSxcbiAgICB2YWx1ZXMgPSBpcy5hbi5hcnJheSggX3ZhbHVlcyApID8gX3ZhbHVlcyA6IFtdO1xuXG4gIHN3aXRjaCAoIHRydWUgKSB7XG4gIGNhc2UgKCAvZmxvYXR8aW50ZWdlci8udGVzdCggY2FzdFR5cGUgKSApOlxuICAgIGNhc3RUeXBlID0gXCJudW1iZXJcIjtcbiAgICBicmVhaztcbiAgfVxuXG4gIGlmICggaXMuYVsgY2FzdFR5cGUgXSggX3ZhbHVlICkgfHwgY2FzdFR5cGUgPT09ICcqJyApIHtcblxuICAgIHZhbHVlID0gX3ZhbHVlO1xuXG4gIH0gZWxzZSB7XG5cbiAgICBzd2l0Y2ggKCB0cnVlICkge1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJhcnJheVwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UoIF92YWx1ZSApO1xuICAgICAgICB9XG4gICAgICAgIGlmICggaXMubm90LmFuLmFycmF5KCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBpZiAoIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gWyBfdmFsdWUgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImJvb2xlYW5cIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSAvXih0cnVlfDF8eXx5ZXMpJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyB0cnVlIDogdW5kZWZpbmVkO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBpZiAoIGlzLm5vdC5hLmJvb2xlYW4oIHZhbHVlICkgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IC9eKGZhbHNlfC0xfDB8bnxubykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBpcy5hLmJvb2xlYW4oIHZhbHVlICkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImRhdGVcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IG5ldyBEYXRlKCBfdmFsdWUgKTtcbiAgICAgICAgdmFsdWUgPSBpc05hTiggdmFsdWUuZ2V0VGltZSgpICkgPyB1bmRlZmluZWQgOiB2YWx1ZTtcblxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwic3RyaW5nXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSggX3ZhbHVlICk7XG4gICAgICAgIGlmICggaXMudW5kZWZpbmVkKCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IF92YWx1ZS50b1N0cmluZygpXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwibnVtYmVyXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCggX3ZhbHVlICk7XG4gICAgICAgIGlmICggaXMubm90LmEubnVtYmVyKCB2YWx1ZSApIHx8IGlzTmFOKCB2YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgdmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICBzd2l0Y2ggKCB0cnVlICkge1xuICAgICAgICBjYXNlIF9jYXN0VHlwZSA9PT0gXCJpbnRlZ2VyXCI6XG4gICAgICAgICAgdmFsdWUgPSBwYXJzZUludCggdmFsdWUgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gY2FzdCggSlNPTi5wYXJzZSggX3ZhbHVlICksIGNhc3RUeXBlIClcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICB9XG5cbiAgfVxuXG4gIGlmICggdmFsdWVzLmxlbmd0aCA+IDAgJiYgIWNvbnRhaW5zKCB2YWx1ZXMsIHZhbHVlICkgKSB7XG4gICAgdmFsdWUgPSB2YWx1ZXNbIDAgXTtcbiAgfVxuXG4gIHJldHVybiBpcy5ub3QudW5kZWZpbmVkKCB2YWx1ZSApID8gdmFsdWUgOiBpcy5ub3QudW5kZWZpbmVkKCBfZGVmYXVsdCApID8gX2RlZmF1bHQgOiBudWxsO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3Q7IiwidmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gKCBkYXRhLCBpdGVtICkge1xuICB2YXIgZm91bmRPbmUgPSBmYWxzZTtcblxuICBpZiAoIEFycmF5LmlzQXJyYXkoIGRhdGEgKSApIHtcblxuICAgIGRhdGEuZm9yRWFjaCggZnVuY3Rpb24gKCBhcnJheUl0ZW0gKSB7XG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBpdGVtID09PSBhcnJheUl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSBlbHNlIGlmICggT2JqZWN0KCBkYXRhICkgPT09IGRhdGEgKSB7XG5cbiAgICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBkYXRhWyBrZXkgXSA9PT0gaXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgfSApO1xuXG4gIH1cbiAgcmV0dXJuIGZvdW5kT25lO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCJ2YXIgZ3VpZFJ4ID0gXCJ7P1swLTlBLUZhLWZdezh9LVswLTlBLUZhLWZdezR9LTRbMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXs0fS1bMC05QS1GYS1mXXsxMn19P1wiO1xuXG5leHBvcnRzLmdlbmVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB2YXIgZ3VpZCA9IFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSggL1t4eV0vZywgZnVuY3Rpb24gKCBjICkge1xuICAgIHZhciByID0gKCBkICsgTWF0aC5yYW5kb20oKSAqIDE2ICkgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuICAgIHJldHVybiAoIGMgPT09IFwieFwiID8gciA6ICggciAmIDB4NyB8IDB4OCApICkudG9TdHJpbmcoIDE2ICk7XG4gIH0gKTtcbiAgcmV0dXJuIGd1aWQ7XG59O1xuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKCBzdHJpbmcgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCwgXCJnXCIgKSxcbiAgICBtYXRjaGVzID0gKCB0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiID8gc3RyaW5nIDogXCJcIiApLm1hdGNoKCByeCApO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbWF0Y2hlcyApID8gbWF0Y2hlcyA6IFtdO1xufTtcblxuZXhwb3J0cy5pc1ZhbGlkID0gZnVuY3Rpb24gKCBndWlkICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUnggKTtcbiAgcmV0dXJuIHJ4LnRlc3QoIGd1aWQgKTtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKSxcbiAgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAgb2JqZWN0ID0gdHlwZSggb2JqZWN0ICkgPT09IFwib2JqZWN0XCIgPyBvYmplY3QgOiB7fSwga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJhcnJheVwiID8ga2V5cyA6IFtdO1xuICBrZXlUeXBlID0gdHlwZSgga2V5VHlwZSApID09PSBcInN0cmluZ1wiID8ga2V5VHlwZSA6IFwiXCI7XG5cbiAgdmFyIGtleSA9IGtleXMubGVuZ3RoID4gMCA/IGtleXMuc2hpZnQoKSA6IFwiXCIsXG4gICAga2V5RXhpc3RzID0gaGFzLmNhbGwoIG9iamVjdCwga2V5ICkgfHwgb2JqZWN0WyBrZXkgXSAhPT0gdm9pZCAwLFxuICAgIGtleVZhbHVlID0ga2V5RXhpc3RzID8gb2JqZWN0WyBrZXkgXSA6IHVuZGVmaW5lZCxcbiAgICBrZXlUeXBlSXNDb3JyZWN0ID0gdHlwZSgga2V5VmFsdWUgKSA9PT0ga2V5VHlwZTtcblxuICBpZiAoIGtleXMubGVuZ3RoID4gMCAmJiBrZXlFeGlzdHMgKSB7XG4gICAgcmV0dXJuIGhhc0tleSggb2JqZWN0WyBrZXkgXSwga2V5cywga2V5VHlwZSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXMubGVuZ3RoID4gMCB8fCBrZXlUeXBlID09PSBcIlwiID8ga2V5RXhpc3RzIDoga2V5RXhpc3RzICYmIGtleVR5cGVJc0NvcnJlY3Q7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBrZXlzID0gdHlwZSgga2V5cyApID09PSBcInN0cmluZ1wiID8ga2V5cy5zcGxpdCggXCIuXCIgKSA6IFtdO1xuXG4gIHJldHVybiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApO1xuXG59OyIsIlxuLyoqXG4gKiB0b1N0cmluZyByZWYuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHR5cGUgb2YgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsKXtcbiAgc3dpdGNoICh0b1N0cmluZy5jYWxsKHZhbCkpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6IHJldHVybiAnZnVuY3Rpb24nO1xuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnO1xuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJztcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCc7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsID09PSBPYmplY3QodmFsKSkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTtcbiIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuL2lzZXMvdHlwZVwiICksXG4gIGlzID0ge1xuICAgIGE6IHt9LFxuICAgIGFuOiB7fSxcbiAgICBub3Q6IHtcbiAgICAgIGE6IHt9LFxuICAgICAgYW46IHt9XG4gICAgfVxuICB9O1xuXG52YXIgaXNlcyA9IHtcbiAgXCJhcmd1bWVudHNcIjogWyBcImFyZ3VtZW50c1wiLCB0eXBlKCBcImFyZ3VtZW50c1wiICkgXSxcbiAgXCJhcnJheVwiOiBbIFwiYXJyYXlcIiwgdHlwZSggXCJhcnJheVwiICkgXSxcbiAgXCJib29sZWFuXCI6IFsgXCJib29sZWFuXCIsIHR5cGUoIFwiYm9vbGVhblwiICkgXSxcbiAgXCJkYXRlXCI6IFsgXCJkYXRlXCIsIHR5cGUoIFwiZGF0ZVwiICkgXSxcbiAgXCJmdW5jdGlvblwiOiBbIFwiZnVuY3Rpb25cIiwgXCJmdW5jXCIsIFwiZm5cIiwgdHlwZSggXCJmdW5jdGlvblwiICkgXSxcbiAgXCJudWxsXCI6IFsgXCJudWxsXCIsIHR5cGUoIFwibnVsbFwiICkgXSxcbiAgXCJudW1iZXJcIjogWyBcIm51bWJlclwiLCBcImludGVnZXJcIiwgXCJpbnRcIiwgdHlwZSggXCJudW1iZXJcIiApIF0sXG4gIFwib2JqZWN0XCI6IFsgXCJvYmplY3RcIiwgdHlwZSggXCJvYmplY3RcIiApIF0sXG4gIFwicmVnZXhwXCI6IFsgXCJyZWdleHBcIiwgdHlwZSggXCJyZWdleHBcIiApIF0sXG4gIFwic3RyaW5nXCI6IFsgXCJzdHJpbmdcIiwgdHlwZSggXCJzdHJpbmdcIiApIF0sXG4gIFwidW5kZWZpbmVkXCI6IFsgXCJ1bmRlZmluZWRcIiwgdHlwZSggXCJ1bmRlZmluZWRcIiApIF0sXG4gIFwiZW1wdHlcIjogWyBcImVtcHR5XCIsIHJlcXVpcmUoIFwiLi9pc2VzL2VtcHR5XCIgKSBdLFxuICBcIm51bGxvcnVuZGVmaW5lZFwiOiBbIFwibnVsbE9yVW5kZWZpbmVkXCIsIFwibnVsbG9ydW5kZWZpbmVkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL251bGxvcnVuZGVmaW5lZFwiICkgXSxcbiAgXCJndWlkXCI6IFsgXCJndWlkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL2d1aWRcIiApIF1cbn1cblxuT2JqZWN0LmtleXMoIGlzZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICB2YXIgbWV0aG9kcyA9IGlzZXNbIGtleSBdLnNsaWNlKCAwLCBpc2VzWyBrZXkgXS5sZW5ndGggLSAxICksXG4gICAgZm4gPSBpc2VzWyBrZXkgXVsgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSBdO1xuXG4gIG1ldGhvZHMuZm9yRWFjaCggZnVuY3Rpb24gKCBtZXRob2RLZXkgKSB7XG4gICAgaXNbIG1ldGhvZEtleSBdID0gaXMuYVsgbWV0aG9kS2V5IF0gPSBpcy5hblsgbWV0aG9kS2V5IF0gPSBmbjtcbiAgICBpcy5ub3RbIG1ldGhvZEtleSBdID0gaXMubm90LmFbIG1ldGhvZEtleSBdID0gaXMubm90LmFuWyBtZXRob2RLZXkgXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICkgPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuICB9ICk7XG5cbn0gKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gaXM7XG5leHBvcnRzLnR5cGUgPSB0eXBlOyIsInZhciB0eXBlID0gcmVxdWlyZShcIi4uL3R5cGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bGxcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIGVtcHR5ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICBlbXB0eSA9IE9iamVjdC5rZXlzKCB2YWx1ZSApLmxlbmd0aCA9PT0gMDtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJib29sZWFuXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVtYmVyXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gLTE7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYXJyYXlcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInN0cmluZ1wiICkge1xuICAgIGVtcHR5ID0gdmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcmV0dXJuIGVtcHR5O1xuXG59OyIsInZhciBndWlkID0gcmVxdWlyZSggXCJzYy1ndWlkXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICByZXR1cm4gZ3VpZC5pc1ZhbGlkKCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG5cdHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSB2b2lkIDA7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuLi90eXBlXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF90eXBlICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG4gICAgcmV0dXJuIHR5cGUoIF92YWx1ZSApID09PSBfdHlwZTtcbiAgfVxufSIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWwgKSB7XG4gIHN3aXRjaCAoIHRvU3RyaW5nLmNhbGwoIHZhbCApICkge1xuICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgcmV0dXJuICdmdW5jdGlvbic7XG4gIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgIHJldHVybiAnZGF0ZSc7XG4gIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgcmV0dXJuICdyZWdleHAnO1xuICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOlxuICAgIHJldHVybiAnYXJndW1lbnRzJztcbiAgY2FzZSAnW29iamVjdCBBcnJheV0nOlxuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKCB2YWwgPT09IG51bGwgKSByZXR1cm4gJ251bGwnO1xuICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAoIHZhbCA9PT0gT2JqZWN0KCB2YWwgKSApIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIGRlZXAgPSB0eXBlKCBhcmdzWyAwIF0gKSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnNoaWZ0KCkgOiBmYWxzZSxcbiAgICBvYmplY3RzID0gYXJncyxcbiAgICByZXN1bHQgPSB7fTtcblxuICBvYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uICggb2JqZWN0biApIHtcblxuICAgIGlmICggdHlwZSggb2JqZWN0biApICE9PSBcIm9iamVjdFwiICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKCBvYmplY3RuICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICBpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0biwga2V5ICkgKSB7XG4gICAgICAgIGlmICggZGVlcCAmJiB0eXBlKCBvYmplY3RuWyBrZXkgXSApID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBtZXJnZSggZGVlcCwge30sIHJlc3VsdFsga2V5IF0sIG9iamVjdG5bIGtleSBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG9iamVjdG5bIGtleSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTsiLCJ2YXIgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKCBfYXJyYXkgKSB7XG5cdHZhciBoYW5kbGVycyA9IHt9LFxuXHRcdGFycmF5ID0gQXJyYXkuaXNBcnJheSggX2FycmF5ICkgPyBfYXJyYXkgOiBbXTtcblxuXHR2YXIgcHJveHkgPSBmdW5jdGlvbiAoIF9tZXRob2QsIF92YWx1ZSApIHtcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblxuXHRcdGlmICggaGFuZGxlcnNbIF9tZXRob2QgXSApIHtcblx0XHRcdHJldHVybiBoYW5kbGVyc1sgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fVxuXHR9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwge1xuXHRcdG9uOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfZXZlbnQsIF9jYWxsYmFjayApIHtcblx0XHRcdFx0aGFuZGxlcnNbIF9ldmVudCBdID0gX2NhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdwb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3BvcCcsIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19wb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdzaGlmdCcsIGFycmF5WyAwIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19zaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdFsgJ3B1c2gnLCAncmV2ZXJzZScsICd1bnNoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IHt9O1xuXG5cdFx0cHJvcGVydGllc1sgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IHByb3h5LmJpbmQoIG51bGwsIF9tZXRob2QgKVxuXHRcdH07XG5cblx0XHRwcm9wZXJ0aWVzWyAnX18nICsgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCBwcm9wZXJ0aWVzICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmFibGVBcnJheTsiLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiZGVmYXVsdHNcIjoge1xuXHRcdFwibWlkZGxld2FyZUtleVwiOiBcImFsbFwiXG5cdH1cbn0iLCJ2YXIgaXMgPSByZXF1aXJlKCBcInNjLWlzXCIgKSxcbiAgY29uZmlnID0gcmVxdWlyZSggXCIuL2NvbmZpZy5qc29uXCIgKSxcbiAgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG52YXIgdXNlaWZ5RnVuY3Rpb24gPSBmdW5jdGlvbiAoIGZ1bmN0aW9ucywga2V5LCBmbiApIHtcbiAgaWYgKCBpcy5ub3QuZW1wdHkoIGtleSApICYmIGlzLmEuc3RyaW5nKCBrZXkgKSApIHtcbiAgICBpZiAoIGlzLm5vdC5hbi5hcnJheSggZnVuY3Rpb25zWyBrZXkgXSApICkge1xuICAgICAgZnVuY3Rpb25zWyBrZXkgXSA9IFtdO1xuICAgIH1cbiAgICBpZiAoIGlzLmEuZnVuYyggZm4gKSApIHtcbiAgICAgIGZ1bmN0aW9uc1sga2V5IF0ucHVzaCggZm4gKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uc1sga2V5IF07XG4gIH1cbn1cblxudmFyIFVzZWlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5mdW5jdGlvbnMgPSB7XG4gICAgYWxsOiBbXVxuICB9O1xufTtcblxuVXNlaWZ5LnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIGtleSA9IGlzLmEuc3RyaW5nKCBhcmdzWyAwIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IGNvbmZpZy5kZWZhdWx0cy5taWRkbGV3YXJlS2V5LFxuICAgIGZuID0gaXMuYS5mdW5jKCBhcmdzWyAwIF0gKSA/IGFyZ3Muc2hpZnQoKSA6IG5vb3A7XG5cbiAgaWYoIGZuID09PSBub29wICYmIGlzLmFuLm9iamVjdCggYXJnc1swXSkgKSB7XG4gICAgZm4gPSBhcmdzLnNoaWZ0KCkuc2V0dXAoKTtcbiAgfVxuXG4gIHVzZWlmeUZ1bmN0aW9uKCBzZWxmLmZ1bmN0aW9ucywga2V5LCBmbiApO1xufTtcblxuVXNlaWZ5LnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBjdXJyZW50RnVuY3Rpb24gPSAwLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgbWlkZGxld2FyZUtleSA9IGlzLmEuc3RyaW5nKCBhcmdzWyAwIF0gKSAmJiBpcy5hLmZ1bmMoIGFyZ3NbIDEgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIG1pZGRsZXdhcmVLZXkgKTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm4gPSBzZWxmLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdWyBjdXJyZW50RnVuY3Rpb24rKyBdLFxuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKTtcblxuICAgIGlmICggIWZuICkge1xuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYuY29udGV4dCwgYXJncyApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmdzLnB1c2goIG5leHQgKTtcbiAgICAgIGZuLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9XG5cbiAgfTtcblxuICBuZXh0LmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcblxufTtcblxuVXNlaWZ5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICggbWlkZGxld2FyZUtleSApIHtcbiAgaWYgKCBpcy5hLnN0cmluZyggbWlkZGxld2FyZUtleSApICYmIGlzLm5vdC5lbXB0eSggbWlkZGxld2FyZUtleSApICkge1xuICAgIHRoaXMuZnVuY3Rpb25zWyBtaWRkbGV3YXJlS2V5IF0gPSBbXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICAgIGFsbDogW11cbiAgICB9O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX29iamVjdE9yRnVuY3Rpb24gKSB7XG5cbiAgdmFyIHVzZWlmeSA9IG5ldyBVc2VpZnkoKTtcblxuICBpZiAoIGlzLmFuLm9iamVjdCggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBfb2JqZWN0T3JGdW5jdGlvbiwge1xuXG4gICAgICBcInVzZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXNlaWZ5LnVzZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgICAgICByZXR1cm4gX29iamVjdE9yRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwibWlkZGxld2FyZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwidXNlaWZ5XCI6IHtcbiAgICAgICAgdmFsdWU6IHVzZWlmeVxuICAgICAgfVxuXG4gICAgfSApO1xuXG4gICAgdXNlaWZ5LmNvbnRleHQgPSBfb2JqZWN0T3JGdW5jdGlvbjtcblxuICB9IGVsc2UgaWYgKCBpcy5hLmZuKCBfb2JqZWN0T3JGdW5jdGlvbiApICkge1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24ucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB1c2VpZnkuY29udGV4dCA9IHRoaXM7XG4gICAgICB1c2VpZnkubWlkZGxld2FyZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LnVzZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfb2JqZWN0T3JGdW5jdGlvbi51c2VpZnkgPSB1c2VpZnk7XG5cbiAgfVxuXG59OyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJkZWZhdWx0c1wiOiB7XG5cdFx0XCJiYXNlVXJsXCI6IFwiXCIsXG5cdFx0XCJoZWFkZXJzXCI6IHt9XG5cdH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSggJy4vY29uZmlnLmpzb24nICksXG4gIG1vbGR5QXBpID0ge30sXG4gIHVzZWlmeSA9IHJlcXVpcmUoICd1c2VpZnknICk7XG5cbnVzZWlmeSggbW9sZHlBcGkgKTtcblxudmFyIE1vZGVsRmFjdG9yeSA9IHJlcXVpcmUoICcuL21vbGR5JyApKCByZXF1aXJlKCAnLi9tb2RlbCcgKSwgY29uZmlnLmRlZmF1bHRzLCBtb2xkeUFwaS5taWRkbGV3YXJlICk7XG5cbm1vbGR5QXBpLmV4dGVuZCA9IGZ1bmN0aW9uICggX25hbWUsIF9wcm9wZXJ0aWVzICkge1xuICByZXR1cm4gbmV3IE1vZGVsRmFjdG9yeSggX25hbWUsIF9wcm9wZXJ0aWVzICk7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBtb2xkeUFwaTtcbmV4cG9ydHMuZGVmYXVsdHMgPSBjb25maWcuZGVmYXVsdHM7IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxuICBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApO1xuXG5leHBvcnRzLmF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcbiAgdmFyIHZhbHVlO1xuXG4gIGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuICAgIHZhbHVlID0ge1xuICAgICAgdHlwZTogX3ZhbHVlXG4gICAgfTtcbiAgfSBlbHNlIGlmICggaXMuYW4ub2JqZWN0KCBfdmFsdWUgKSAmJiBfdmFsdWVbICdfX2lzTW9sZHknIF0gPT09IHRydWUgKSB7XG4gICAgdmFsdWUgPSB7XG4gICAgICB0eXBlOiAnbW9sZHknLFxuICAgICAgZGVmYXVsdDogX3ZhbHVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gX3ZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG1lcmdlKCB7XG4gICAgbmFtZTogX2tleSB8fCAnJyxcbiAgICB0eXBlOiAnJyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG9wdGlvbmFsOiBmYWxzZVxuICB9LCB2YWx1ZSApO1xufTtcblxuZXhwb3J0cy5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX2RhdGFbIF9rZXkgXTtcbiAgfVxufTtcblxuZXhwb3J0cy5kZXN0cm95ZWRFcnJvciA9IGZ1bmN0aW9uICggX21vbGR5ICkge1xuICB2YXIgaXRlbSA9IHR5cGVvZiBfbW9sZHkgPT09ICdvYmplY3QnID8gX21vbGR5IDoge307XG4gIHJldHVybiBuZXcgRXJyb3IoICdUaGUgZ2l2ZW4gbW9sZHkgaXRlbSBgJyArIGl0ZW0uX19uYW1lICsgJ2AgaGFzIGJlZW4gZGVzdHJveWVkJyApO1xufTtcblxuZXhwb3J0cy5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBfc2VsZi5idXN5ID0gdHJ1ZTtcbiAgfVxufTtcblxuZXhwb3J0cy5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxuICAgICAgdmFsdWUgPSBhdHRyaWJ1dGVzLnR5cGUgPyBjYXN0KCBfdmFsdWUsIGF0dHJpYnV0ZXMudHlwZSwgYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSA6IF92YWx1ZTtcblxuICAgIGlmICggc2VsZi5fX2RhdGFbIF9rZXkgXSAhPT0gdmFsdWUgKSB7XG4gICAgICBzZWxmLmVtaXQoICdjaGFuZ2UnLCBzZWxmLl9fZGF0YVsgX2tleSBdLCB2YWx1ZSApO1xuICAgIH1cblxuICAgIHNlbGYuX19kYXRhWyBfa2V5IF0gPSB2YWx1ZTtcbiAgfVxufTtcblxuZXhwb3J0cy51bnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIF9zZWxmLmJ1c3kgPSBmYWxzZTtcbiAgfVxufTtcblxuZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBfZXh0ZW5kID0gZnVuY3Rpb24oIG9iaiApIHtcbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICkuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcbiAgICAgIGlmICggc291cmNlICkge1xuICAgICAgICBmb3IgKCB2YXIgcHJvcCBpbiBzb3VyY2UgKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5leHRlbmQgPSBfZXh0ZW5kO1xuXG5leHBvcnRzLmV4dGVuZE9iamVjdCA9IGZ1bmN0aW9uKCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcyApIHtcbiAgdmFyIHBhcmVudCA9IHRoaXM7XG4gIHZhciBjaGlsZDtcblxuICBpZiAoIHByb3RvUHJvcHMgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBwcm90b1Byb3BzLCAnY29uc3RydWN0b3InICkgKSB7XG4gICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xuICB9IGVsc2Uge1xuICAgIGNoaWxkID0gZnVuY3Rpb24oICl7IHJldHVybiBwYXJlbnQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApOyB9O1xuICB9XG5cbiAgX2V4dGVuZCggY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMgKTtcblxuICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9O1xuXG4gIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xuXG4gICBpZiAocHJvdG9Qcm9wcykgX2V4dGVuZCggY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzICk7XG5cbiAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAgcmV0dXJuIGNoaWxkO1xufTsiLCJ2YXIgY2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuICBlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxuICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxuICBoZWxwZXJzID0gcmVxdWlyZSggJy4vaGVscGVycycgKSxcbiAgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG4gIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxuICByZXF1ZXN0ID0gcmVxdWlyZSggJy4vcmVxdWVzdCcgKSxcbiAgZXh0ZW5kID0gaGVscGVycy5leHRlbmRPYmplY3QsXG4gIHVzZWlmeSA9IHJlcXVpcmUoICd1c2VpZnknICk7XG5cbnZhciBNb2RlbCA9IGZ1bmN0aW9uICggaW5pdGlhbCwgX19tb2xkeSApIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIGluaXRpYWwgPSBpbml0aWFsIHx8IHt9O1xuXG4gIHRoaXMuX19tb2xkeSA9IF9fbW9sZHk7XG4gIHRoaXMuX19pc01vbGR5ID0gdHJ1ZTtcbiAgdGhpcy5fX2F0dHJpYnV0ZXMgPSB7fTtcbiAgdGhpcy5fX2RhdGEgPSB7fTtcbiAgdGhpcy5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xuICBcbiAgaWYgKCAhIHNlbGYuX19tb2xkeS5fX2tleWxlc3MgKSB7XG4gICAgc2VsZi5fX21vbGR5LiRkZWZpbmVQcm9wZXJ0eSggc2VsZiwgc2VsZi5fX21vbGR5Ll9fa2V5ICk7XG4gIH1cblxuICBPYmplY3Qua2V5cyggY2FzdCggc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGEsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuICAgIHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIGluaXRpYWxbIF9rZXkgXSApO1xuICB9ICk7XG5cbiAgZm9yKCB2YXIgaSBpbiBpbml0aWFsICkge1xuICAgIGlmKCBpbml0aWFsLmhhc093blByb3BlcnR5KCBpICkgJiYgc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGFbIGkgXSApIHtcbiAgICAgIHRoaXNbIGkgXSA9IGluaXRpYWxbIGkgXTtcbiAgICB9XG4gIH1cblxuICBzZWxmLm9uKCAncHJlc2F2ZScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XG4gIHNlbGYub24oICdzYXZlJywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xuXG4gIHNlbGYub24oICdwcmVkZXN0cm95JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcbiAgc2VsZi5vbiggJ2Rlc3Ryb3knLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XG5cbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBPYmplY3Qua2V5cyggc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG4gICAgaWYgKCBoYXNLZXkoIHNlbGZbIF9rZXkgXSwgJ19faXNNb2xkeScsICdib29sZWFuJyApICYmIHNlbGZbIF9rZXkgXS5fX2lzTW9sZHkgPT09IHRydWUgKSB7XG4gICAgICBzZWxmWyBfa2V5IF0uJGNsZWFyKCk7XG4gICAgfSBlbHNlIGlmICggc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXS5hcnJheU9mQVR5cGUgKSB7XG4gICAgICB3aGlsZSAoIHNlbGZbIF9rZXkgXS5sZW5ndGggPiAwICkge1xuICAgICAgICBzZWxmWyBfa2V5IF0uc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZlsgX2tleSBdID0gc2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZvaWQgMDtcbiAgICB9XG4gIH0gKTtcbn07XG5cbi8qKlxuICogJGNsb25lIHdvbid0IHdvcmsgY3VycmVudGx5XG4gKiBAcGFyYW0gIHtbdHlwZV19IF9kYXRhIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5Nb2RlbC5wcm90b3R5cGUuJGNsb25lID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgaW5pdGlhbFZhbHVlcyA9IHRoaXMuJGpzb24oKTtcblxuICAvLyAgZGF0YSA9IGlzLmFuLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDogc2VsZi5fX2RhdGE7XG4gIGhlbHBlcnMuZXh0ZW5kKCBpbml0aWFsVmFsdWVzLCBfZGF0YSB8fCB7fSAgKTtcblxuICB2YXIgbmV3TW9sZHkgPSB0aGlzLl9fbW9sZHkuY3JlYXRlKCBpbml0aWFsVmFsdWVzICk7XG4gICAgLyogdGhpcy5fX21vbGR5bmV3IE1vZGVsRmFjdG9yeSggc2VsZi5fX25hbWUsIHtcbiAgICAgIGJhc2VVcmw6IHNlbGYuX19tb2xkeS4kYmFzZVVybCgpLFxuICAgICAgaGVhZGVyczogc2VsZi5fX2hlYWRlcnMsXG4gICAgICBrZXk6IHNlbGYuX19rZXksXG4gICAgICBrZXlsZXNzOiBzZWxmLl9fa2V5bGVzcyxcbiAgICAgIHVybDogc2VsZi5fX3VybFxuICAgIH0gKTsqL1xuXG4gIC8qXG4gIE9iamVjdC5rZXlzKCBzZWxmLl9fYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uICggX3Byb3BlcnR5S2V5ICkge1xuICAgIG5ld01vbGR5LiRwcm9wZXJ0eSggX3Byb3BlcnR5S2V5LCBtZXJnZSggc2VsZi5fX2F0dHJpYnV0ZXNbIF9wcm9wZXJ0eUtleSBdICkgKTtcbiAgICBpZiAoIGlzLmFuLmFycmF5KCBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0gKSAmJiBpcy5hbi5hcnJheSggZGF0YVsgX3Byb3BlcnR5S2V5IF0gKSApIHtcbiAgICAgIGRhdGFbIF9wcm9wZXJ0eUtleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX2RhdGFJdGVtICkge1xuICAgICAgICBuZXdNb2xkeVsgX3Byb3BlcnR5S2V5IF0ucHVzaCggX2RhdGFJdGVtICk7XG4gICAgICB9ICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXSA9IGRhdGFbIF9wcm9wZXJ0eUtleSBdXG4gICAgfVxuICB9ICk7Ki9cblxuICByZXR1cm4gbmV3TW9sZHk7XG59O1xuXG4gIE1vZGVsLnByb3RvdHlwZS4kZGF0YSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgZGF0YSA9IGlzLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDoge307XG5cbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XG4gICAgICByZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuICAgICAgaWYgKCBzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xuICAgICAgICBpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBoYXNLZXkoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSAmJiBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XG4gICAgICAgICAgICBzZWxmWyBfa2V5IF0ucHVzaCggX21vbGR5ICk7XG4gICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2UgaWYgKCBpcy5hLm9iamVjdCggZGF0YVsgX2tleSBdICkgJiYgc2VsZlsgX2tleSBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XG4gICAgICAgICAgc2VsZlsgX2tleSBdLiRkYXRhKCBkYXRhWyBfa2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbiAgXG5cbk1vZGVsLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgaXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcbiAgICBkYXRhID0gc2VsZi4kanNvbigpLFxuICAgIHVybCA9IHNlbGYuX19tb2xkeS4kdXJsKCkgKyAoIHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyAnJyA6ICcvJyArIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdICksXG4gICAgbWV0aG9kID0gJ2RlbGV0ZScsXG4gICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xuXG4gIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcbiAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApIF0gKTtcbiAgfVxuXG4gIHNlbGYuZW1pdCggJ3ByZWRlc3Ryb3knLCB7XG4gICAgbW9sZHk6IHNlbGYsXG4gICAgZGF0YTogZGF0YSxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICB1cmw6IHVybCxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSApO1xuXG4gIGlmICggIWlzRGlydHkgKSB7XG4gIHJlcXVlc3QoIHNlbGYuX19tb2xkeSwgc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuICAgIHNlbGYuZW1pdCggJ2Rlc3Ryb3knLCBfZXJyb3IsIF9yZXMgKTtcbiAgICAgIHNlbGYuX19kZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgc2VsZlsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gPSB1bmRlZmluZWQ7XG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gICAgfSApO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIG5ldyBFcnJvciggJ1RoaXMgbW9sZHkgY2Fubm90IGJlIGRlc3Ryb3llZCBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyIHlldC4nICkgXSApO1xuICB9XG5cbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX19kZXN0cm95ZWQgPyB0cnVlIDogaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19tb2xkeS5fX2tleSBdICk7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuJGlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICggdGhpcy5fX2Rlc3Ryb3llZCApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgaXNWYWxpZCA9IHRydWU7XG5cbiAgT2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuXG4gICAgaWYgKCBzZWxmLiRpc0RpcnR5KCkgJiYgX2tleSA9PT0gc2VsZi5fX21vbGR5Ll9fa2V5ICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IHNlbGZbIF9rZXkgXSxcbiAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxuICAgICAgdHlwZSA9IGF0dHJpYnV0ZXMudHlwZSxcbiAgICAgIGFycmF5T2ZBVHlwZSA9IGhhc0tleSggYXR0cmlidXRlcywgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApID8gYXR0cmlidXRlcy5hcnJheU9mQVR5cGUgPT09IHRydWUgOiBmYWxzZSxcbiAgICAgIGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsICE9PSB0cnVlLFxuICAgICAgaXNOdWxsT3JVbmRlZmluZWQgPSBzZWxmLl9fbW9sZHkuX19rZXlsZXNzID8gZmFsc2UgOiBhcnJheU9mQVR5cGUgPyB2YWx1ZS5sZW5ndGggPT09IDAgOiBpcy5udWxsT3JVbmRlZmluZWQoIHZhbHVlICksXG4gICAgICB0eXBlSXNXcm9uZyA9IGlzLm5vdC5lbXB0eSggdHlwZSApICYmIGlzLmEuc3RyaW5nKCB0eXBlICkgPyBpcy5ub3QuYVsgdHlwZSBdKCB2YWx1ZSApIDogaXNOdWxsT3JVbmRlZmluZWQ7XG5cbiAgICBpZiAoIGFycmF5T2ZBVHlwZSAmJiBpcy5ub3QuZW1wdHkoIHZhbHVlICkgJiYgdmFsdWVbIDAgXSBpbnN0YW5jZW9mIE1vZGVsICkge1xuICAgICAgdmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcbiAgICAgICAgaWYgKCBpc1ZhbGlkICYmIF9pdGVtLiRpc1ZhbGlkKCkgPT09IGZhbHNlICkge1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSApO1xuICAgIH1cblxuICAgIGlmICggaXNWYWxpZCAmJiBpc1JlcXVpcmVkICYmIHR5cGVJc1dyb25nICkge1xuICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICB9ICk7XG5cbiAgcmV0dXJuIGlzVmFsaWQ7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuJGpzb24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBkYXRhID0gc2VsZi5fX2RhdGEsXG4gICAganNvbiA9IHt9O1xuXG4gIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGRhdGFbIF9rZXkgXVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XG4gICAgICBqc29uWyBfa2V5IF0gPSBbXTtcbiAgICAgIGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcbiAgICAgICAganNvblsgX2tleSBdLnB1c2goIF9tb2xkeS4kanNvbigpICk7XG4gICAgICB9ICk7XG4gIH0gZWxzZSB7XG4gICAganNvblsgX2tleSBdID0gZGF0YVsgX2tleSBdIGluc3RhbmNlb2YgTW9kZWwgPyBkYXRhWyBfa2V5IF0uJGpzb24oKSA6IGRhdGFbIF9rZXkgXTtcbiAgICB9XG4gIH0gKTtcblxuICByZXR1cm4ganNvbjtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kc2F2ZSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgZXJyb3IgPSBudWxsLFxuICAgIGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXG4gICAgZGF0YSA9IHNlbGYuJGpzb24oKSxcbiAgICB1cmwgPSBzZWxmLl9fbW9sZHkuJHVybCgpICsgKCAhaXNEaXJ0eSAmJiAhc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyA/ICcvJyArIHNlbGZbIHNlbGYuX19tb2xkeS5fX2tleSBdIDogJycgKSxcbiAgICBtZXRob2QgPSBpc0RpcnR5ID8gJ3Bvc3QnIDogJ3B1dCcsXG4gICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xuXG4gIHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcblxuICBzZWxmLmVtaXQoICdwcmVzYXZlJywge1xuICAgIG1vbGR5OiBzZWxmLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgdXJsOiB1cmwsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH0gKTtcblxuICByZXF1ZXN0KCBzZWxmLl9fbW9sZHksIHNlbGYsIGRhdGEsIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcbiAgICBzZWxmLmVtaXQoICdzYXZlJywgX2Vycm9yLCBfcmVzICk7XG4gICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApOyAvL25vdCBzdXJlIGFib3V0IHRoYXQgISB3aHkgcGFzc2luZyB0aGUgY29udGV4dCA/XG4gIH0gKTtcblxufTtcblxuZW1pdHRlciggTW9kZWwucHJvdG90eXBlICk7XG51c2VpZnkoIE1vZGVsICk7XG5cbk1vZGVsLmV4dGVuZCA9IGV4dGVuZDtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwidmFyIGhlbHBlcnMgPSByZXF1aXJlKCBcIi4vaGVscGVycy9pbmRleFwiICksXG5cdGVtaXR0ZXIgPSByZXF1aXJlKCAnZW1pdHRlci1jb21wb25lbnQnICksXG5cdG9ic2VydmFibGVBcnJheSA9IHJlcXVpcmUoICdzZy1vYnNlcnZhYmxlLWFycmF5JyApLFxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxuXHRpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcblx0bWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICksXG5cdGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcblx0cmVxdWVzdCA9IHJlcXVpcmUoICcuL3JlcXVlc3QnICksXG5cdHVzZWlmeSA9IHJlcXVpcmUoICd1c2VpZnknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBCYXNlTW9kZWwsIGRlZmF1bHRDb25maWd1cmF0aW9uLCBkZWZhdWx0TWlkZGxld2FyZSApIHtcblxuXHR2YXIgTW9sZHkgPSBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRwcm9wZXJ0aWVzID0gaXMuYW4ub2JqZWN0KCBfcHJvcGVydGllcyApID8gX3Byb3BlcnRpZXMgOiB7fSxcblxuXHRcdFx0aW5pdGlhbCA9IHByb3BlcnRpZXMuaW5pdGlhbCB8fCB7fTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBzZWxmLCB7XG5cdFx0XHRfX21vbGR5OiB7XG5cdFx0XHRcdHZhbHVlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0X19wcm9wZXJ0aWVzOiB7XG5cdFx0XHRcdHZhbHVlOiBwcm9wZXJ0aWVzWyAncHJvcGVydGllcycgXSB8fCB7fVxuXHRcdFx0fSxcblx0XHRcdF9fbWV0YWRhdGE6IHtcblx0XHRcdFx0dmFsdWU6IHt9XG5cdFx0XHR9LFxuXHRcdFx0LypfX2F0dHJpYnV0ZXM6IHtcbiAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSwqL1xuXHRcdFx0X19iYXNlVXJsOiB7XG5cdFx0XHRcdHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAnYmFzZVVybCcgXSwgJ3N0cmluZycsICcnICksXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0X19kYXRhOiB7XG5cdFx0XHRcdHZhbHVlOiB7fSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfX2Rlc3Ryb3llZDoge1xuXHRcdFx0XHR2YWx1ZTogZmFsc2UsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0X19oZWFkZXJzOiB7XG5cdFx0XHRcdHZhbHVlOiBtZXJnZSgge30sIGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSwgY2FzdCggZGVmYXVsdENvbmZpZ3VyYXRpb24uaGVhZGVycywgJ29iamVjdCcsIHt9ICkgKSxcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfX2tleToge1xuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdF9fa2V5bGVzczoge1xuXHRcdFx0XHR2YWx1ZTogcHJvcGVydGllc1sgJ2tleWxlc3MnIF0gPT09IHRydWVcblx0XHRcdH0sXG5cdFx0XHRfX25hbWU6IHtcblx0XHRcdFx0dmFsdWU6IF9uYW1lIHx8IHByb3BlcnRpZXNbICduYW1lJyBdIHx8ICcnXG5cdFx0XHR9LFxuXHRcdFx0X191cmw6IHtcblx0XHRcdFx0dmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICd1cmwnIF0sICdzdHJpbmcnLCAnJyApLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGJ1c3k6IHtcblx0XHRcdFx0dmFsdWU6IGZhbHNlLFxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdGlmICggIXNlbGYuX19rZXlsZXNzICkge1xuXHRcdFx0dGhpcy4kcHJvcGVydHkoIHRoaXMuX19rZXkgKTtcblx0XHR9XG5cblx0XHRPYmplY3Qua2V5cyggY2FzdCggc2VsZi5fX3Byb3BlcnRpZXMsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuXHRcdFx0c2VsZi4kcHJvcGVydHkoIF9rZXksIHNlbGYuX19wcm9wZXJ0aWVzWyBfa2V5IF0gKTtcblx0XHR9ICk7XG5cblx0XHRzZWxmLm9uKCAncHJlZ2V0JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcblx0XHRzZWxmLm9uKCAnZ2V0JywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xuXHR9O1xuXG5cdE1vbGR5LnByb3RvdHlwZS5zY2hlbWEgPSBmdW5jdGlvbiAoIHNjaGVtYSApIHtcblxuXHRcdE9iamVjdC5rZXlzKCBjYXN0KCBzY2hlbWEsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuXHRcdFx0c2VsZi4kcHJvcGVydHkoIF9rZXksIHNjaGVtYVsgX2tleSBdICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0TW9sZHkucHJvdG90eXBlLnByb3RvID0gZnVuY3Rpb24gKCBwcm90byApIHtcblxuXHRcdHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvID0gdGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gfHwge307XG5cdFx0aGVscGVycy5leHRlbmQoIHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvLCBwcm90byApO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0TW9sZHkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICggX2luaXRpYWwgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0S2xhc3MgPSBCYXNlTW9kZWwuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90byB8fCB7fSApLFxuXHRcdFx0a2xhc3MgPSBuZXcgS2xhc3MoIF9pbml0aWFsLCB0aGlzICk7XG5cblx0XHRrbGFzcy5vbiggJ3NhdmUnLCBzZWxmLmVtaXQuYmluZCggc2VsZiwgJ3NhdmUnICkgKTtcblx0XHRrbGFzcy5vbiggJ2Rlc3Ryb3knLCBzZWxmLmVtaXQuYmluZCggc2VsZiwgJ2Rlc3Ryb3knICkgKTtcblxuXHRcdHJldHVybiBrbGFzcztcblx0fTtcblxuXHRNb2xkeS5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcblx0XHRcdHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XG5cdFx0fVxuXG5cdFx0c2VsZi5fX2hlYWRlcnMgPSBpcy5hbi5vYmplY3QoIF9oZWFkZXJzICkgPyBfaGVhZGVycyA6IHNlbGYuX19oZWFkZXJzO1xuXHRcdHJldHVybiBpcy5ub3QuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gc2VsZi5fX2hlYWRlcnMgOiBzZWxmO1xuXHR9O1xuXG5cdE1vbGR5LnByb3RvdHlwZS4kZ2V0ID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHR1cmwgPSBzZWxmLiR1cmwoKSxcblx0XHRcdG1ldGhvZCA9ICdnZXQnLFxuXHRcdFx0cXVlcnkgPSBpcy5hbi5vYmplY3QoIF9xdWVyeSApID8gX3F1ZXJ5IDoge30sXG5cdFx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wXG5cdFx0XHR3YXNEZXN0cm95ZWQgPSBzZWxmLl9fZGVzdHJveWVkO1xuXG5cdFx0c2VsZi5lbWl0KCAncHJlZ2V0Jywge1xuXHRcdFx0bW9sZHk6IHNlbGYsXG5cdFx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHRcdHF1ZXJ5OiBxdWVyeSxcblx0XHRcdHVybDogdXJsLFxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdFx0fSApO1xuXG5cdFx0c2VsZi5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXG5cblx0XHRyZXF1ZXN0KCBzZWxmLCBudWxsLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuXHRcdFx0Ly92YXIgcmVzID0gX3JlcyBpbnN0YW5jZW9mIEJhc2VNb2RlbCA/IF9yZXMgOiBudWxsO1xuXG5cdFx0XHQvLyBpZiAoIGlzLmFuLmFycmF5KCBfcmVzICkgJiYgX3Jlc1sgMCBdIGluc3RhbmNlb2YgQmFzZU1vZGVsICkge1xuXHRcdFx0Ly8gICBzZWxmLiRkYXRhKCBfcmVzWyAwIF0uJGpzb24oKSApO1xuXHRcdFx0Ly8gICByZXMgPSBzZWxmO1xuXHRcdFx0Ly8gfVxuXHRcdFx0LypcbiAgICAgIGlmICggX2Vycm9yICYmIHdhc0Rlc3Ryb3llZCApIHtcbiAgICAgICAgc2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9Ki9cblxuXHRcdFx0c2VsZi5lbWl0KCAnZ2V0JywgX2Vycm9yLCBfcmVzICk7XG5cblx0XHRcdGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIF9lcnJvciwgX3JlcyBdICk7XG5cdFx0fSApO1xuXHR9O1xuXG5cdE1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdGJhc2UgPSBpcy5lbXB0eSggc2VsZi4kYmFzZVVybCgpICkgPyAnJyA6IHNlbGYuJGJhc2VVcmwoKSxcblx0XHRcdG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcblx0XHRcdHVybCA9IF91cmwgfHwgc2VsZi5fX3VybCB8fCAnJyxcblx0XHRcdGVuZHBvaW50ID0gYmFzZSArIG5hbWUgKyAoIGlzLmVtcHR5KCB1cmwgKSA/ICcnIDogJy8nICsgdXJsLnRyaW0oKS5yZXBsYWNlKCAvXlxcLy8sICcnICkgKTtcblxuXHRcdHNlbGYuX191cmwgPSB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKTtcblxuXHRcdHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcblx0fTtcblxuXHRNb2xkeS5wcm90b3R5cGUuX19kZWZhdWx0TWlkZGxld2FyZSA9IGRlZmF1bHRNaWRkbGV3YXJlO1xuXG5cdE1vbGR5LnByb3RvdHlwZS4kYmFzZVVybCA9IGZ1bmN0aW9uICggX2Jhc2UgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0dXJsID0gY2FzdCggX2Jhc2UsICdzdHJpbmcnLCBzZWxmLl9fYmFzZVVybCB8fCAnJyApO1xuXG5cdFx0c2VsZi5fX2Jhc2VVcmwgPSB1cmwudHJpbSgpLnJlcGxhY2UoIC8oXFwvfFxccykrJC9nLCAnJyApIHx8IGRlZmF1bHRDb25maWd1cmF0aW9uLmJhc2VVcmwgfHwgJyc7XG5cblx0XHRyZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfYmFzZSApID8gc2VsZi5fX2Jhc2VVcmwgOiBzZWxmO1xuXHR9O1xuXG5cdE1vbGR5LnByb3RvdHlwZS4kY29sbGVjdGlvbiA9IGZ1bmN0aW9uICggX3F1ZXJ5LCBfY2FsbGJhY2sgKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0dXJsID0gc2VsZi4kdXJsKCksXG5cdFx0XHRtZXRob2QgPSAnZ2V0Jyxcblx0XHRcdHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxuXHRcdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcblxuXHRcdHNlbGYuZW1pdCggJ3ByZWNvbGxlY3Rpb24nLCB7XG5cdFx0XHRtb2xkeTogc2VsZixcblx0XHRcdG1ldGhvZDogbWV0aG9kLFxuXHRcdFx0cXVlcnk6IHF1ZXJ5LFxuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0XHR9ICk7XG5cblx0XHRyZXF1ZXN0KCBzZWxmLCBudWxsLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuXHRcdFx0dmFyIHJlcyA9IGNhc3QoIF9yZXMgaW5zdGFuY2VvZiBCYXNlTW9kZWwgfHwgaXMuYW4uYXJyYXkoIF9yZXMgKSA/IF9yZXMgOiBudWxsLCAnYXJyYXknLCBbXSApO1xuXHRcdFx0c2VsZi5lbWl0KCAnY29sbGVjdGlvbicsIF9lcnJvciwgcmVzICk7XG5cdFx0XHRjYWxsYmFjay5hcHBseSggc2VsZiwgWyBfZXJyb3IsIHJlcyBdICk7XG5cdFx0fSApO1xuXG5cdH07XG5cblx0TW9sZHkucHJvdG90eXBlLiRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uICggb2JqLCBrZXksIHZhbHVlICkge1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0ZXhpc3RpbmdWYWx1ZSA9IG9ialsga2V5IF0gfHwgdmFsdWUsXG5cdFx0XHRtZXRhZGF0YSA9IHRoaXMuX19tZXRhZGF0YVsga2V5IF07XG5cblx0XHRpZiAoICFvYmouaGFzT3duUHJvcGVydHkoIGtleSApIHx8ICFvYmouX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcblx0XHRcdGlmICggbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlNb2xkeSB8fCBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheVN0cmluZyApIHtcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlcy50eXBlID0gbWV0YWRhdGEudmFsdWU7XG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID0gbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlNb2xkeTtcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlTdHJpbmc7XG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XG5cblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xuXHRcdFx0XHRcdHZhbHVlOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBtZXRhZGF0YS52YWx1ZUlzQVN0YXRpY01vbGR5ICkge1xuXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcblx0XHRcdFx0XHR2YWx1ZTogbmV3IE1vbGR5KCBtZXRhZGF0YS52YWx1ZS5uYW1lLCBtZXRhZGF0YS52YWx1ZSApLmNyZWF0ZSgpLFxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XG5cblx0XHRcdH0gZWxzZSBpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgKSB7XG5cblx0XHRcdFx0dmFyIGFycmF5ID0gb2JzZXJ2YWJsZUFycmF5KCBbXSApLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZVR5cGUgPSBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgfHwgbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPyBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGVbIDAgXSA6ICcqJztcblxuXHRcdFx0XHRtZXRhZGF0YS5hdHRyaWJ1dGVzLmFycmF5T2ZBVHlwZSA9IHRydWU7XG5cblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xuXHRcdFx0XHRcdHZhbHVlOiBhcnJheSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XG5cblx0XHRcdFx0WyAncHVzaCcsICd1bnNoaWZ0JyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHRcdFx0XHRhcnJheS5vbiggX21ldGhvZCwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG5cdFx0XHRcdFx0XHRcdHZhbHVlcyA9IFtdO1xuXHRcdFx0XHRcdFx0YXJncy5mb3JFYWNoKCBmdW5jdGlvbiAoIF9pdGVtICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ICkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtb2xkeSA9IG5ldyBNb2xkeSggYXR0cmlidXRlVHlwZVsgJ25hbWUnIF0sIGF0dHJpYnV0ZVR5cGUgKSxcblx0XHRcdFx0XHRcdFx0XHRcdGRhdGEgPSBpcy5hbi5vYmplY3QoIF9pdGVtICkgPyBfaXRlbSA6IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xuXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIG1vbGR5LmNyZWF0ZSggZGF0YSApICk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIGNhc3QoIF9pdGVtLCBhdHRyaWJ1dGVUeXBlLCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0XHRcdHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIHZhbHVlcyApO1xuXHRcdFx0XHRcdH0gKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmICggZXhpc3RpbmdWYWx1ZSAmJiBleGlzdGluZ1ZhbHVlLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdFx0ZXhpc3RpbmdWYWx1ZS5mb3JFYWNoKCBmdW5jdGlvbiAoIG8gKSB7XG5cdFx0XHRcdFx0XHRvYmpbIGtleSBdLnB1c2goIG8gKTtcblx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xuXHRcdFx0XHRcdGdldDogaGVscGVycy5nZXRQcm9wZXJ0eSgga2V5ICksXG5cdFx0XHRcdFx0c2V0OiBoZWxwZXJzLnNldFByb3BlcnR5KCBrZXkgKSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblxuXHRcdFx0b2JqLl9fYXR0cmlidXRlc1sga2V5IF0gPSBtZXRhZGF0YS5hdHRyaWJ1dGVzO1xuXHRcdH1cblxuXHRcdGlmICggZXhpc3RpbmdWYWx1ZSAhPT0gdm9pZCAwICkgeyAvL2lmIGV4aXN0aW5nIHZhbHVlXG5cdFx0XHRvYmpbIGtleSBdID0gZXhpc3RpbmdWYWx1ZTtcblx0XHR9IGVsc2UgaWYgKCBpcy5lbXB0eSggb2JqWyBrZXkgXSApICYmIG1ldGFkYXRhLmF0dHJpYnV0ZXMub3B0aW9uYWwgPT09IGZhbHNlICYmIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgKSB7XG5cdFx0XHRvYmpbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XG5cdFx0fSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcblx0XHRcdGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSB8fCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ICkge1xuXHRcdFx0XHRvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvYmouX19kYXRhWyBrZXkgXSA9IGlzLmVtcHR5KCBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgKSA/IHVuZGVmaW5lZCA6IGNhc3QoIHVuZGVmaW5lZCwgbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdE1vbGR5LnByb3RvdHlwZS4kcHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcblx0XHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0XHRhdHRyaWJ1dGVzID0gbmV3IGhlbHBlcnMuYXR0cmlidXRlcyggX2tleSwgX3ZhbHVlICksXG5cdFx0XHQvL2V4aXN0aW5nVmFsdWUgPSBzZWxmWyBfa2V5IF0sXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ID0gaXMuYS5zdHJpbmcoIGF0dHJpYnV0ZXMudHlwZSApICYmIC9tb2xkeS8udGVzdCggYXR0cmlidXRlcy50eXBlICksXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ID0gaXMuYW4uYXJyYXkoIGF0dHJpYnV0ZXMudHlwZSApLFxuXHRcdFx0dmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXG5cdFx0XHR2YWx1ZUlzQW5BcnJheVN0cmluZyA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBpcy5hLnN0cmluZyggX3ZhbHVlWyAwIF0gKSxcblx0XHRcdGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID0gYXR0cmlidXRlVHlwZUlzQW5BcnJheSAmJiBoYXNLZXkoIGF0dHJpYnV0ZXMudHlwZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXG5cdFx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcblx0XHRcdHZhbHVlSXNBU3RhdGljTW9sZHkgPSBoYXNLZXkoIF92YWx1ZSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApO1xuXG5cdFx0c2VsZi5fX21ldGFkYXRhWyBfa2V5IF0gPSB7XG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuXHRcdFx0dmFsdWU6IF92YWx1ZSxcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHk6IGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHksXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkFycmF5OiBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5LFxuXHRcdFx0dmFsdWVJc0FuQXJyYXlNb2xkeTogdmFsdWVJc0FuQXJyYXlNb2xkeSxcblx0XHRcdHZhbHVlSXNBbkFycmF5U3RyaW5nOiB2YWx1ZUlzQW5BcnJheVN0cmluZyxcblx0XHRcdGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5OiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSxcblx0XHRcdGF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZzogYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nLFxuXHRcdFx0dmFsdWVJc0FTdGF0aWNNb2xkeTogdmFsdWVJc0FTdGF0aWNNb2xkeVxuXHRcdH07XG5cblx0XHRyZXR1cm4gc2VsZjtcblx0fTtcblxuXHRlbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcblx0dXNlaWZ5KCBNb2xkeSApO1xuXG5cdHJldHVybiBNb2xkeTtcblxufTtcbiIsInZhciBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcblx0Y2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApO1xuLyoqXG4gKiBGZXRjaGluZyB0aGUgZGF0YVxuICogQHBhcmFtICB7W3R5cGVdfSBfbW9sZHkgICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBfZGF0YSAgICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBfbWV0aG9kICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBfdXJsICAgICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBfY2FsbGJhY2sgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX21vbGR5LCBpbnN0YW5jZSwgX2RhdGEsIF9tZXRob2QsIF91cmwsIF9jYWxsYmFjayApIHtcblx0dmFyIG1vbGR5ID0gX21vbGR5LFxuXHRcdHJlc3VsdCA9IFtdLFxuXHRcdHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgPSBoYXNLZXkoIF9kYXRhLCBtb2xkeS5fX2tleSApICYmIGlzLm5vdC5lbXB0eSggX2RhdGFbIG1vbGR5Ll9fa2V5IF0gKSAmJiAvZ2V0Ly50ZXN0KCBfbWV0aG9kICksXG5cdFx0aXNJbnN0YW5jZSA9IGluc3RhbmNlID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdGlzRGlydHkgPSBpc0luc3RhbmNlID8gaW5zdGFuY2UuJGlzRGlydHkoKSA6IGZhbHNlO1xuXG5cdG1vbGR5Ll9fZGVmYXVsdE1pZGRsZXdhcmUoIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzcG9uc2UgKSB7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG5cdFx0XHRlcnJvciA9IF9lcnJvciA9PT0gbW9sZHkgPyBudWxsIDogYXJncy5zaGlmdCgpLFxuXHRcdFx0cmVzcG9uc2UgPSBhcmdzLnNoaWZ0KCk7XG5cblx0XHRpZiAoIGVycm9yICYmICEoIGVycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcblx0XHRcdGVycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcblx0XHR9XG5cblx0XHRpZiAoICFlcnJvciAmJiBpc0luc3RhbmNlICYmIGlzRGlydHkgJiYgaXMub2JqZWN0KCByZXNwb25zZSApICYmICggcmVzcG9uc2VTaG91bGRDb250YWluQW5JZCAmJiAhaGFzS2V5KCByZXNwb25zZSwgbW9sZHkuX19rZXkgKSApICkge1xuXHRcdFx0ZXJyb3IgPSBuZXcgRXJyb3IoICdUaGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGRpZCBub3QgY29udGFpbiBhIHZhbGlkIGAnICsgbW9sZHkuX19rZXkgKyAnYCcgKTtcblx0XHR9XG5cblx0XHRpZiAoICFlcnJvciAmJiBpc0RpcnR5ICYmIGlzSW5zdGFuY2UgJiYgaXMub2JqZWN0KCByZXNwb25zZSApICkge1xuXHRcdFx0bW9sZHlbIG1vbGR5Ll9fa2V5IF0gPSByZXNwb25zZVsgbW9sZHkuX19rZXkgXTtcblx0XHR9XG5cblx0XHRpZiAoICFlcnJvciApIHtcblx0XHRcdGlmICggIWlzSW5zdGFuY2UgKSB7XG5cdFx0XHRcdGlmICggaXMuYXJyYXkoIHJlc3BvbnNlICkgKSB7XG5cblx0XHRcdFx0XHRyZXNwb25zZS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9kYXRhICkge1xuXG5cdFx0XHRcdFx0XHRyZXN1bHQucHVzaCggbW9sZHkuY3JlYXRlKCBfZGF0YSApICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlc3VsdCA9IG1vbGR5LmNyZWF0ZSggcmVzcG9uc2UgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aW5zdGFuY2UuJGRhdGEoIHJlc3BvbnNlICk7XG5cdFx0XHRcdHJlc3VsdCA9IGluc3RhbmNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdF9jYWxsYmFjayAmJiBfY2FsbGJhY2soIGVycm9yLCByZXN1bHQgKTtcblxuXHR9LCBfbW9sZHksIF9kYXRhLCBfbWV0aG9kLCBfdXJsICk7XG5cbn07Il19
(19)
});
