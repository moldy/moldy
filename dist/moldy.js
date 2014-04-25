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
var helpers = _dereq_("./helpers/index"),
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

    if ( ! self.__keyless ) {
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
},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[19])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3VzZWlmeS9jb25maWcuanNvbiIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3VzZWlmeS9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2NvbmZpZy5qc29uIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvZmFrZV8yOGViZDkwYS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L3NyYy9tb2RlbC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL21vbGR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsInZhciBjb250YWlucyA9IHJlcXVpcmUoIFwic2MtY29udGFpbnNcIiApLFxuICBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApO1xuXG52YXIgY2FzdCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfY2FzdFR5cGUsIF9kZWZhdWx0LCBfdmFsdWVzLCBfYWRkaXRpb25hbFByb3BlcnRpZXMgKSB7XG5cbiAgdmFyIHBhcnNlZFZhbHVlLFxuICAgIGNhc3RUeXBlID0gX2Nhc3RUeXBlLFxuICAgIHZhbHVlLFxuICAgIHZhbHVlcyA9IGlzLmFuLmFycmF5KCBfdmFsdWVzICkgPyBfdmFsdWVzIDogW107XG5cbiAgc3dpdGNoICggdHJ1ZSApIHtcbiAgY2FzZSAoIC9mbG9hdHxpbnRlZ2VyLy50ZXN0KCBjYXN0VHlwZSApICk6XG4gICAgY2FzdFR5cGUgPSBcIm51bWJlclwiO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCBpcy5hWyBjYXN0VHlwZSBdKCBfdmFsdWUgKSB8fCBjYXN0VHlwZSA9PT0gJyonICkge1xuXG4gICAgdmFsdWUgPSBfdmFsdWU7XG5cbiAgfSBlbHNlIHtcblxuICAgIHN3aXRjaCAoIHRydWUgKSB7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImFycmF5XCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSggX3ZhbHVlICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBbIF92YWx1ZSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYm9vbGVhblwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IC9eKHRydWV8MXx5fHllcykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IHRydWUgOiB1bmRlZmluZWQ7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGlmICggaXMubm90LmEuYm9vbGVhbiggdmFsdWUgKSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gL14oZmFsc2V8LTF8MHxufG5vKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGlzLmEuYm9vbGVhbiggdmFsdWUgKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiZGF0ZVwiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gbmV3IERhdGUoIF92YWx1ZSApO1xuICAgICAgICB2YWx1ZSA9IGlzTmFOKCB2YWx1ZS5nZXRUaW1lKCkgKSA/IHVuZGVmaW5lZCA6IHZhbHVlO1xuXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJzdHJpbmdcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy51bmRlZmluZWQoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoICggZSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gX3ZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJudW1iZXJcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy5ub3QuYS5udW1iZXIoIHZhbHVlICkgfHwgaXNOYU4oIHZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHN3aXRjaCAoIHRydWUgKSB7XG4gICAgICAgIGNhc2UgX2Nhc3RUeXBlID09PSBcImludGVnZXJcIjpcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCB2YWx1ZSApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBjYXN0KCBKU09OLnBhcnNlKCBfdmFsdWUgKSwgY2FzdFR5cGUgKVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIH1cblxuICB9XG5cbiAgaWYgKCB2YWx1ZXMubGVuZ3RoID4gMCAmJiAhY29udGFpbnMoIHZhbHVlcywgdmFsdWUgKSApIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1sgMCBdO1xuICB9XG5cbiAgcmV0dXJuIGlzLm5vdC51bmRlZmluZWQoIHZhbHVlICkgPyB2YWx1ZSA6IGlzLm5vdC51bmRlZmluZWQoIF9kZWZhdWx0ICkgPyBfZGVmYXVsdCA6IG51bGw7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdDsiLCJ2YXIgY29udGFpbnMgPSBmdW5jdGlvbiAoIGRhdGEsIGl0ZW0gKSB7XG4gIHZhciBmb3VuZE9uZSA9IGZhbHNlO1xuXG4gIGlmICggQXJyYXkuaXNBcnJheSggZGF0YSApICkge1xuXG4gICAgZGF0YS5mb3JFYWNoKCBmdW5jdGlvbiAoIGFycmF5SXRlbSApIHtcbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGl0ZW0gPT09IGFycmF5SXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gKTtcblxuICB9IGVsc2UgaWYgKCBPYmplY3QoIGRhdGEgKSA9PT0gZGF0YSApIHtcblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGRhdGFbIGtleSBdID09PSBpdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgfVxuICByZXR1cm4gZm91bmRPbmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsInZhciBndWlkUnggPSBcIns/WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezR9LVswLTlBLUZhLWZdezEyfX0/XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBndWlkID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKCAvW3h5XS9nLCBmdW5jdGlvbiAoIGMgKSB7XG4gICAgdmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG4gICAgcmV0dXJuICggYyA9PT0gXCJ4XCIgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZyggMTYgKTtcbiAgfSApO1xuICByZXR1cm4gZ3VpZDtcbn07XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAoIHN0cmluZyApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4LCBcImdcIiApLFxuICAgIG1hdGNoZXMgPSAoIHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIgPyBzdHJpbmcgOiBcIlwiICkubWF0Y2goIHJ4ICk7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBtYXRjaGVzICkgPyBtYXRjaGVzIDogW107XG59O1xuXG5leHBvcnRzLmlzVmFsaWQgPSBmdW5jdGlvbiAoIGd1aWQgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCApO1xuICByZXR1cm4gcngudGVzdCggZ3VpZCApO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApLFxuICBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBvYmplY3QgPSB0eXBlKCBvYmplY3QgKSA9PT0gXCJvYmplY3RcIiA/IG9iamVjdCA6IHt9LCBrZXlzID0gdHlwZSgga2V5cyApID09PSBcImFycmF5XCIgPyBrZXlzIDogW107XG4gIGtleVR5cGUgPSB0eXBlKCBrZXlUeXBlICkgPT09IFwic3RyaW5nXCIgPyBrZXlUeXBlIDogXCJcIjtcblxuICB2YXIga2V5ID0ga2V5cy5sZW5ndGggPiAwID8ga2V5cy5zaGlmdCgpIDogXCJcIixcbiAgICBrZXlFeGlzdHMgPSBoYXMuY2FsbCggb2JqZWN0LCBrZXkgKSB8fCBvYmplY3RbIGtleSBdICE9PSB2b2lkIDAsXG4gICAga2V5VmFsdWUgPSBrZXlFeGlzdHMgPyBvYmplY3RbIGtleSBdIDogdW5kZWZpbmVkLFxuICAgIGtleVR5cGVJc0NvcnJlY3QgPSB0eXBlKCBrZXlWYWx1ZSApID09PSBrZXlUeXBlO1xuXG4gIGlmICgga2V5cy5sZW5ndGggPiAwICYmIGtleUV4aXN0cyApIHtcbiAgICByZXR1cm4gaGFzS2V5KCBvYmplY3RbIGtleSBdLCBrZXlzLCBrZXlUeXBlICk7XG4gIH1cblxuICByZXR1cm4ga2V5cy5sZW5ndGggPiAwIHx8IGtleVR5cGUgPT09IFwiXCIgPyBrZXlFeGlzdHMgOiBrZXlFeGlzdHMgJiYga2V5VHlwZUlzQ29ycmVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwic3RyaW5nXCIgPyBrZXlzLnNwbGl0KCBcIi5cIiApIDogW107XG5cbiAgcmV0dXJuIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICk7XG5cbn07IiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59O1xuIiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4vaXNlcy90eXBlXCIgKSxcbiAgaXMgPSB7XG4gICAgYToge30sXG4gICAgYW46IHt9LFxuICAgIG5vdDoge1xuICAgICAgYToge30sXG4gICAgICBhbjoge31cbiAgICB9XG4gIH07XG5cbnZhciBpc2VzID0ge1xuICBcImFyZ3VtZW50c1wiOiBbIFwiYXJndW1lbnRzXCIsIHR5cGUoIFwiYXJndW1lbnRzXCIgKSBdLFxuICBcImFycmF5XCI6IFsgXCJhcnJheVwiLCB0eXBlKCBcImFycmF5XCIgKSBdLFxuICBcImJvb2xlYW5cIjogWyBcImJvb2xlYW5cIiwgdHlwZSggXCJib29sZWFuXCIgKSBdLFxuICBcImRhdGVcIjogWyBcImRhdGVcIiwgdHlwZSggXCJkYXRlXCIgKSBdLFxuICBcImZ1bmN0aW9uXCI6IFsgXCJmdW5jdGlvblwiLCBcImZ1bmNcIiwgXCJmblwiLCB0eXBlKCBcImZ1bmN0aW9uXCIgKSBdLFxuICBcIm51bGxcIjogWyBcIm51bGxcIiwgdHlwZSggXCJudWxsXCIgKSBdLFxuICBcIm51bWJlclwiOiBbIFwibnVtYmVyXCIsIFwiaW50ZWdlclwiLCBcImludFwiLCB0eXBlKCBcIm51bWJlclwiICkgXSxcbiAgXCJvYmplY3RcIjogWyBcIm9iamVjdFwiLCB0eXBlKCBcIm9iamVjdFwiICkgXSxcbiAgXCJyZWdleHBcIjogWyBcInJlZ2V4cFwiLCB0eXBlKCBcInJlZ2V4cFwiICkgXSxcbiAgXCJzdHJpbmdcIjogWyBcInN0cmluZ1wiLCB0eXBlKCBcInN0cmluZ1wiICkgXSxcbiAgXCJ1bmRlZmluZWRcIjogWyBcInVuZGVmaW5lZFwiLCB0eXBlKCBcInVuZGVmaW5lZFwiICkgXSxcbiAgXCJlbXB0eVwiOiBbIFwiZW1wdHlcIiwgcmVxdWlyZSggXCIuL2lzZXMvZW1wdHlcIiApIF0sXG4gIFwibnVsbG9ydW5kZWZpbmVkXCI6IFsgXCJudWxsT3JVbmRlZmluZWRcIiwgXCJudWxsb3J1bmRlZmluZWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvbnVsbG9ydW5kZWZpbmVkXCIgKSBdLFxuICBcImd1aWRcIjogWyBcImd1aWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvZ3VpZFwiICkgXVxufVxuXG5PYmplY3Qua2V5cyggaXNlcyApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gIHZhciBtZXRob2RzID0gaXNlc1sga2V5IF0uc2xpY2UoIDAsIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgKSxcbiAgICBmbiA9IGlzZXNbIGtleSBdWyBpc2VzWyBrZXkgXS5sZW5ndGggLSAxIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiAoIG1ldGhvZEtleSApIHtcbiAgICBpc1sgbWV0aG9kS2V5IF0gPSBpcy5hWyBtZXRob2RLZXkgXSA9IGlzLmFuWyBtZXRob2RLZXkgXSA9IGZuO1xuICAgIGlzLm5vdFsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYVsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYW5bIG1ldGhvZEtleSBdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG4gIH0gKTtcblxufSApO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBpcztcbmV4cG9ydHMudHlwZSA9IHR5cGU7IiwidmFyIHR5cGUgPSByZXF1aXJlKFwiLi4vdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVsbFwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm9iamVjdFwiICkge1xuICAgIGVtcHR5ID0gT2JqZWN0LmtleXMoIHZhbHVlICkubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImJvb2xlYW5cIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSBmYWxzZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudW1iZXJcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAtMTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJhcnJheVwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICByZXR1cm4gZW1wdHk7XG5cbn07IiwidmFyIGd1aWQgPSByZXF1aXJlKCBcInNjLWd1aWRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHJldHVybiBndWlkLmlzVmFsaWQoIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IHZvaWQgMDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4uL3R5cGVcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX3R5cGUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcbiAgICByZXR1cm4gdHlwZSggX3ZhbHVlICkgPT09IF90eXBlO1xuICB9XG59IiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbCApIHtcbiAgc3dpdGNoICggdG9TdHJpbmcuY2FsbCggdmFsICkgKSB7XG4gIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzpcbiAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgcmV0dXJuICdkYXRlJztcbiAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6XG4gICAgcmV0dXJuICdhcmd1bWVudHMnO1xuICBjYXNlICdbb2JqZWN0IEFycmF5XSc6XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAoIHZhbCA9PT0gbnVsbCApIHJldHVybiAnbnVsbCc7XG4gIGlmICggdmFsID09PSB1bmRlZmluZWQgKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICggdmFsID09PSBPYmplY3QoIHZhbCApICkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgZGVlcCA9IHR5cGUoIGFyZ3NbIDAgXSApID09PSBcImJvb2xlYW5cIiA/IGFyZ3Muc2hpZnQoKSA6IGZhbHNlLFxuICAgIG9iamVjdHMgPSBhcmdzLFxuICAgIHJlc3VsdCA9IHt9O1xuXG4gIG9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24gKCBvYmplY3RuICkge1xuXG4gICAgaWYgKCB0eXBlKCBvYmplY3RuICkgIT09IFwib2JqZWN0XCIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIG9iamVjdG4gKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3RuLCBrZXkgKSApIHtcbiAgICAgICAgaWYgKCBkZWVwICYmIHR5cGUoIG9iamVjdG5bIGtleSBdICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG1lcmdlKCBkZWVwLCB7fSwgcmVzdWx0WyBrZXkgXSwgb2JqZWN0blsga2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gb2JqZWN0blsga2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlOyIsInZhciBPYnNlcnZhYmxlQXJyYXkgPSBmdW5jdGlvbiAoIF9hcnJheSApIHtcblx0dmFyIGhhbmRsZXJzID0ge30sXG5cdFx0YXJyYXkgPSBBcnJheS5pc0FycmF5KCBfYXJyYXkgKSA/IF9hcnJheSA6IFtdO1xuXG5cdHZhciBwcm94eSA9IGZ1bmN0aW9uICggX21ldGhvZCwgX3ZhbHVlICkge1xuXHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXG5cdFx0aWYgKCBoYW5kbGVyc1sgX21ldGhvZCBdICkge1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJzWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3MgKTtcblx0XHR9XG5cdH07XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCB7XG5cdFx0b246IHtcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiAoIF9ldmVudCwgX2NhbGxiYWNrICkge1xuXHRcdFx0XHRoYW5kbGVyc1sgX2V2ZW50IF0gPSBfY2FsbGJhY2s7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3BvcCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHByb3h5KCAncG9wJywgYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXSApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdfX3BvcCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnc2hpZnQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3NoaWZ0JywgYXJyYXlbIDAgXSApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdfX3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0WyAncHVzaCcsICdyZXZlcnNlJywgJ3Vuc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xuXHRcdHZhciBwcm9wZXJ0aWVzID0ge307XG5cblx0XHRwcm9wZXJ0aWVzWyBfbWV0aG9kIF0gPSB7XG5cdFx0XHR2YWx1ZTogcHJveHkuYmluZCggbnVsbCwgX21ldGhvZCApXG5cdFx0fTtcblxuXHRcdHByb3BlcnRpZXNbICdfXycgKyBfbWV0aG9kIF0gPSB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG5cdFx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGVbIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggYXJyYXksIHByb3BlcnRpZXMgKTtcblx0fSApO1xuXG5cdHJldHVybiBhcnJheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2YWJsZUFycmF5OyIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJkZWZhdWx0c1wiOiB7XG5cdFx0XCJtaWRkbGV3YXJlS2V5XCI6IFwiYWxsXCJcblx0fVxufSIsInZhciBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApLFxuICBjb25maWcgPSByZXF1aXJlKCBcIi4vY29uZmlnLmpzb25cIiApLFxuICBub29wID0gZnVuY3Rpb24gKCkge307XG5cbnZhciB1c2VpZnlGdW5jdGlvbiA9IGZ1bmN0aW9uICggZnVuY3Rpb25zLCBrZXksIGZuICkge1xuICBpZiAoIGlzLm5vdC5lbXB0eSgga2V5ICkgJiYgaXMuYS5zdHJpbmcoIGtleSApICkge1xuICAgIGlmICggaXMubm90LmFuLmFycmF5KCBmdW5jdGlvbnNbIGtleSBdICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdID0gW107XG4gICAgfVxuICAgIGlmICggaXMuYS5mdW5jKCBmbiApICkge1xuICAgICAgZnVuY3Rpb25zWyBrZXkgXS5wdXNoKCBmbiApO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb25zWyBrZXkgXTtcbiAgfVxufVxuXG52YXIgVXNlaWZ5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICBhbGw6IFtdXG4gIH07XG59O1xuXG5Vc2VpZnkucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAga2V5ID0gaXMuYS5zdHJpbmcoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgZm4gPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICBpZiggZm4gPT09IG5vb3AgJiYgaXMuYW4ub2JqZWN0KCBhcmdzWzBdKSApIHtcbiAgICBmbiA9IGFyZ3Muc2hpZnQoKS5zZXR1cCgpO1xuICB9XG5cbiAgdXNlaWZ5RnVuY3Rpb24oIHNlbGYuZnVuY3Rpb25zLCBrZXksIGZuICk7XG59O1xuXG5Vc2VpZnkucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGN1cnJlbnRGdW5jdGlvbiA9IDAsXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBtaWRkbGV3YXJlS2V5ID0gaXMuYS5zdHJpbmcoIGFyZ3NbIDAgXSApICYmIGlzLmEuZnVuYyggYXJnc1sgMSBdICkgPyBhcmdzLnNoaWZ0KCkgOiBjb25maWcuZGVmYXVsdHMubWlkZGxld2FyZUtleSxcbiAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBub29wO1xuXG4gIHVzZWlmeUZ1bmN0aW9uKCBzZWxmLmZ1bmN0aW9ucywgbWlkZGxld2FyZUtleSApO1xuXG4gIHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmbiA9IHNlbGYuZnVuY3Rpb25zWyBtaWRkbGV3YXJlS2V5IF1bIGN1cnJlbnRGdW5jdGlvbisrIF0sXG4gICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApO1xuXG4gICAgaWYgKCAhZm4gKSB7XG4gICAgICBjYWxsYmFjay5hcHBseSggc2VsZi5jb250ZXh0LCBhcmdzICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MucHVzaCggbmV4dCApO1xuICAgICAgZm4uYXBwbHkoIHNlbGYuY29udGV4dCwgYXJncyApO1xuICAgIH1cblxuICB9O1xuXG4gIG5leHQuYXBwbHkoIHNlbGYuY29udGV4dCwgYXJncyApO1xuXG59O1xuXG5Vc2VpZnkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCBtaWRkbGV3YXJlS2V5ICkge1xuICBpZiAoIGlzLmEuc3RyaW5nKCBtaWRkbGV3YXJlS2V5ICkgJiYgaXMubm90LmVtcHR5KCBtaWRkbGV3YXJlS2V5ICkgKSB7XG4gICAgdGhpcy5mdW5jdGlvbnNbIG1pZGRsZXdhcmVLZXkgXSA9IFtdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZnVuY3Rpb25zID0ge1xuICAgICAgYWxsOiBbXVxuICAgIH07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfb2JqZWN0T3JGdW5jdGlvbiApIHtcblxuICB2YXIgdXNlaWZ5ID0gbmV3IFVzZWlmeSgpO1xuXG4gIGlmICggaXMuYW4ub2JqZWN0KCBfb2JqZWN0T3JGdW5jdGlvbiApICkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIF9vYmplY3RPckZ1bmN0aW9uLCB7XG5cbiAgICAgIFwidXNlXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB1c2VpZnkudXNlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgICAgICAgIHJldHVybiBfb2JqZWN0T3JGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgXCJtaWRkbGV3YXJlXCI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB1c2VpZnkubWlkZGxld2FyZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgXCJ1c2VpZnlcIjoge1xuICAgICAgICB2YWx1ZTogdXNlaWZ5XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgICB1c2VpZnkuY29udGV4dCA9IF9vYmplY3RPckZ1bmN0aW9uO1xuXG4gIH0gZWxzZSBpZiAoIGlzLmEuZm4oIF9vYmplY3RPckZ1bmN0aW9uICkgKSB7XG5cbiAgICBfb2JqZWN0T3JGdW5jdGlvbi5wcm90b3R5cGUubWlkZGxld2FyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVzZWlmeS5jb250ZXh0ID0gdGhpcztcbiAgICAgIHVzZWlmeS5taWRkbGV3YXJlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgIH07XG5cbiAgICBfb2JqZWN0T3JGdW5jdGlvbi51c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB1c2VpZnkudXNlLmFwcGx5KCB1c2VpZnksIGFyZ3VtZW50cyApO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIF9vYmplY3RPckZ1bmN0aW9uLnVzZWlmeSA9IHVzZWlmeTtcblxuICB9XG5cbn07IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcImRlZmF1bHRzXCI6IHtcblx0XHRcImJhc2VVcmxcIjogXCJcIixcblx0XHRcImhlYWRlcnNcIjoge31cblx0fVxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCAnLi9jb25maWcuanNvbicgKSxcbiAgbW9sZHlBcGkgPSB7fSxcbiAgdXNlaWZ5ID0gcmVxdWlyZSggJ3VzZWlmeScgKTtcblxudXNlaWZ5KCBtb2xkeUFwaSApO1xuXG52YXIgTW9kZWxGYWN0b3J5ID0gcmVxdWlyZSggJy4vbW9sZHknICkoIHJlcXVpcmUoICcuL21vZGVsJyApLCBjb25maWcuZGVmYXVsdHMsIG1vbGR5QXBpLm1pZGRsZXdhcmUgKTtcblxubW9sZHlBcGkuZXh0ZW5kID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XG4gIHJldHVybiBuZXcgTW9kZWxGYWN0b3J5KCBfbmFtZSwgX3Byb3BlcnRpZXMgKTtcbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG1vbGR5QXBpO1xuZXhwb3J0cy5kZWZhdWx0cyA9IGNvbmZpZy5kZWZhdWx0czsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG4gIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcbiAgbWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICk7XG5cbmV4cG9ydHMuYXR0cmlidXRlcyA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xuICB2YXIgdmFsdWU7XG5cbiAgaWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XG4gICAgdmFsdWUgPSB7XG4gICAgICB0eXBlOiBfdmFsdWVcbiAgICB9O1xuICB9IGVsc2UgaWYgKCBpcy5hbi5vYmplY3QoIF92YWx1ZSApICYmIF92YWx1ZVsgJ19faXNNb2xkeScgXSA9PT0gdHJ1ZSApIHtcbiAgICB2YWx1ZSA9IHtcbiAgICAgIHR5cGU6ICdtb2xkeScsXG4gICAgICBkZWZhdWx0OiBfdmFsdWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBfdmFsdWU7XG4gIH1cblxuICByZXR1cm4gbWVyZ2UoIHtcbiAgICBuYW1lOiBfa2V5IHx8ICcnLFxuICAgIHR5cGU6ICcnLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgb3B0aW9uYWw6IGZhbHNlXG4gIH0sIHZhbHVlICk7XG59O1xuXG5leHBvcnRzLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9fZGF0YVsgX2tleSBdO1xuICB9XG59O1xuXG5leHBvcnRzLmRlc3Ryb3llZEVycm9yID0gZnVuY3Rpb24gKCBfbW9sZHkgKSB7XG4gIHZhciBpdGVtID0gdHlwZW9mIF9tb2xkeSA9PT0gJ29iamVjdCcgPyBfbW9sZHkgOiB7fTtcbiAgcmV0dXJuIG5ldyBFcnJvciggJ1RoZSBnaXZlbiBtb2xkeSBpdGVtIGAnICsgaXRlbS5fX25hbWUgKyAnYCBoYXMgYmVlbiBkZXN0cm95ZWQnICk7XG59O1xuXG5leHBvcnRzLnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIF9zZWxmLmJ1c3kgPSB0cnVlO1xuICB9XG59O1xuXG5leHBvcnRzLnNldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgYXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXG4gICAgICB2YWx1ZSA9IGF0dHJpYnV0ZXMudHlwZSA/IGNhc3QoIF92YWx1ZSwgYXR0cmlidXRlcy50eXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApIDogX3ZhbHVlO1xuXG4gICAgaWYgKCBzZWxmLl9fZGF0YVsgX2tleSBdICE9PSB2YWx1ZSApIHtcbiAgICAgIHNlbGYuZW1pdCggJ2NoYW5nZScsIHNlbGYuX19kYXRhWyBfa2V5IF0sIHZhbHVlICk7XG4gICAgfVxuXG4gICAgc2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZhbHVlO1xuICB9XG59O1xuXG5leHBvcnRzLnVuc2V0QnVzeSA9IGZ1bmN0aW9uICggX3NlbGYgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgX3NlbGYuYnVzeSA9IGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnRzLm5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIF9leHRlbmQgPSBmdW5jdGlvbiggb2JqICkge1xuICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKS5mb3JFYWNoKCBmdW5jdGlvbiggc291cmNlICkge1xuICAgICAgaWYgKCBzb3VyY2UgKSB7XG4gICAgICAgIGZvciAoIHZhciBwcm9wIGluIHNvdXJjZSApIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmV4dGVuZCA9IF9leHRlbmQ7XG5cbmV4cG9ydHMuZXh0ZW5kT2JqZWN0ID0gZnVuY3Rpb24oIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzICkge1xuICB2YXIgcGFyZW50ID0gdGhpcztcbiAgdmFyIGNoaWxkO1xuXG4gIGlmICggcHJvdG9Qcm9wcyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIHByb3RvUHJvcHMsICdjb25zdHJ1Y3RvcicgKSApIHtcbiAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gIH0gZWxzZSB7XG4gICAgY2hpbGQgPSBmdW5jdGlvbiggKXsgcmV0dXJuIHBhcmVudC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7IH07XG4gIH1cblxuICBfZXh0ZW5kKCBjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyApO1xuXG4gIHZhciBTdXJyb2dhdGUgPSBmdW5jdGlvbigpeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XG5cbiAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XG5cbiAgIGlmIChwcm90b1Byb3BzKSBfZXh0ZW5kKCBjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMgKTtcblxuICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICByZXR1cm4gY2hpbGQ7XG59OyIsInZhciBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXG4gIGVtaXR0ZXIgPSByZXF1aXJlKCAnZW1pdHRlci1jb21wb25lbnQnICksXG4gIGhhc0tleSA9IHJlcXVpcmUoICdzYy1oYXNrZXknICksXG4gIGhlbHBlcnMgPSByZXF1aXJlKCAnLi9oZWxwZXJzJyApLFxuICBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcbiAgbWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICksXG4gIHJlcXVlc3QgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApLFxuICBleHRlbmQgPSBoZWxwZXJzLmV4dGVuZE9iamVjdCxcbiAgdXNlaWZ5ID0gcmVxdWlyZSggJ3VzZWlmeScgKTtcblxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCBpbml0aWFsLCBfX21vbGR5ICkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgaW5pdGlhbCA9IGluaXRpYWwgfHwge307XG5cbiAgdGhpcy5fX21vbGR5ID0gX19tb2xkeTtcbiAgdGhpcy5fX2lzTW9sZHkgPSB0cnVlO1xuICB0aGlzLl9fYXR0cmlidXRlcyA9IHt9O1xuICB0aGlzLl9fZGF0YSA9IHt9O1xuICB0aGlzLl9fZGVzdHJveWVkID0gZmFsc2U7XG4gIFxuICBpZiAoICEgc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyApIHtcbiAgICBzZWxmLl9fbW9sZHkuJGRlZmluZVByb3BlcnR5KCBzZWxmLCBzZWxmLl9fbW9sZHkuX19rZXkgKTtcbiAgfVxuXG4gIE9iamVjdC5rZXlzKCBjYXN0KCBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YSwgJ29iamVjdCcsIHt9ICkgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG4gICAgc2VsZi5fX21vbGR5LiRkZWZpbmVQcm9wZXJ0eSggc2VsZiwgX2tleSwgaW5pdGlhbFsgX2tleSBdICk7XG4gIH0gKTtcblxuICBmb3IoIHZhciBpIGluIGluaXRpYWwgKSB7XG4gICAgaWYoIGluaXRpYWwuaGFzT3duUHJvcGVydHkoIGkgKSAmJiBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YVsgaSBdICkge1xuICAgICAgdGhpc1sgaSBdID0gaW5pdGlhbFsgaSBdO1xuICAgIH1cbiAgfVxuXG4gIHNlbGYub24oICdwcmVzYXZlJywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcbiAgc2VsZi5vbiggJ3NhdmUnLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XG5cbiAgc2VsZi5vbiggJ3ByZWRlc3Ryb3knLCBoZWxwZXJzLnNldEJ1c3koIHNlbGYgKSApO1xuICBzZWxmLm9uKCAnZGVzdHJveScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcblxufTtcblxuTW9kZWwucHJvdG90eXBlLiRjbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIE9iamVjdC5rZXlzKCBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcbiAgICBpZiAoIGhhc0tleSggc2VsZlsgX2tleSBdLCAnX19pc01vbGR5JywgJ2Jvb2xlYW4nICkgJiYgc2VsZlsgX2tleSBdLl9faXNNb2xkeSA9PT0gdHJ1ZSApIHtcbiAgICAgIHNlbGZbIF9rZXkgXS4kY2xlYXIoKTtcbiAgICB9IGVsc2UgaWYgKCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSApIHtcbiAgICAgIHdoaWxlICggc2VsZlsgX2tleSBdLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgIHNlbGZbIF9rZXkgXS5zaGlmdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmWyBfa2V5IF0gPSBzZWxmLl9fZGF0YVsgX2tleSBdID0gdm9pZCAwO1xuICAgIH1cbiAgfSApO1xufTtcblxuLyoqXG4gKiAkY2xvbmUgd29uJ3Qgd29yayBjdXJyZW50bHlcbiAqIEBwYXJhbSAge1t0eXBlXX0gX2RhdGEgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbk1vZGVsLnByb3RvdHlwZS4kY2xvbmUgPSBmdW5jdGlvbiAoIF9kYXRhICkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBpbml0aWFsVmFsdWVzID0gdGhpcy4kanNvbigpO1xuXG4gIC8vICBkYXRhID0gaXMuYW4ub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiBzZWxmLl9fZGF0YTtcbiAgaGVscGVycy5leHRlbmQoIGluaXRpYWxWYWx1ZXMsIF9kYXRhIHx8IHt9ICApO1xuXG4gIHZhciBuZXdNb2xkeSA9IHRoaXMuX19tb2xkeS5jcmVhdGUoIGluaXRpYWxWYWx1ZXMgKTtcbiAgICAvKiB0aGlzLl9fbW9sZHluZXcgTW9kZWxGYWN0b3J5KCBzZWxmLl9fbmFtZSwge1xuICAgICAgYmFzZVVybDogc2VsZi5fX21vbGR5LiRiYXNlVXJsKCksXG4gICAgICBoZWFkZXJzOiBzZWxmLl9faGVhZGVycyxcbiAgICAgIGtleTogc2VsZi5fX2tleSxcbiAgICAgIGtleWxlc3M6IHNlbGYuX19rZXlsZXNzLFxuICAgICAgdXJsOiBzZWxmLl9fdXJsXG4gICAgfSApOyovXG5cbiAgLypcbiAgT2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfcHJvcGVydHlLZXkgKSB7XG4gICAgbmV3TW9sZHkuJHByb3BlcnR5KCBfcHJvcGVydHlLZXksIG1lcmdlKCBzZWxmLl9fYXR0cmlidXRlc1sgX3Byb3BlcnR5S2V5IF0gKSApO1xuICAgIGlmICggaXMuYW4uYXJyYXkoIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXSApICYmIGlzLmFuLmFycmF5KCBkYXRhWyBfcHJvcGVydHlLZXkgXSApICkge1xuICAgICAgZGF0YVsgX3Byb3BlcnR5S2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YUl0ZW0gKSB7XG4gICAgICAgIG5ld01vbGR5WyBfcHJvcGVydHlLZXkgXS5wdXNoKCBfZGF0YUl0ZW0gKTtcbiAgICAgIH0gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TW9sZHlbIF9wcm9wZXJ0eUtleSBdID0gZGF0YVsgX3Byb3BlcnR5S2V5IF1cbiAgICB9XG4gIH0gKTsqL1xuXG4gIHJldHVybiBuZXdNb2xkeTtcbn07XG5cbiAgTW9kZWwucHJvdG90eXBlLiRkYXRhID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICBkYXRhID0gaXMub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiB7fTtcblxuICAgIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcbiAgICAgIHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG4gICAgICBpZiAoIHNlbGYuX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBfa2V5ICkgKSB7XG4gICAgICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGhhc0tleSggc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSwgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApICYmIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlID09PSB0cnVlICkge1xuICAgICAgICAgIGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcbiAgICAgICAgICAgIHNlbGZbIF9rZXkgXS5wdXNoKCBfbW9sZHkgKTtcbiAgICAgICAgICB9ICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGlzLmEub2JqZWN0KCBkYXRhWyBfa2V5IF0gKSAmJiBzZWxmWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcbiAgICAgICAgICBzZWxmWyBfa2V5IF0uJGRhdGEoIGRhdGFbIF9rZXkgXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGZbIF9rZXkgXSA9IGRhdGFbIF9rZXkgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiBzZWxmO1xuICB9O1xuICBcblxuTW9kZWwucHJvdG90eXBlLiRkZXN0cm95ID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBpc0RpcnR5ID0gc2VsZi4kaXNEaXJ0eSgpLFxuICAgIGRhdGEgPSBzZWxmLiRqc29uKCksXG4gICAgdXJsID0gc2VsZi5fX21vbGR5LiR1cmwoKSArICggc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyA/ICcnIDogJy8nICsgc2VsZlsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gKSxcbiAgICBtZXRob2QgPSAnZGVsZXRlJyxcbiAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cbiAgaWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICkgXSApO1xuICB9XG5cbiAgc2VsZi5lbWl0KCAncHJlZGVzdHJveScsIHtcbiAgICBtb2xkeTogc2VsZixcbiAgICBkYXRhOiBkYXRhLFxuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHVybDogdXJsLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICB9ICk7XG5cbiAgaWYgKCAhaXNEaXJ0eSApIHtcbiAgcmVxdWVzdCggc2VsZi5fX21vbGR5LCBzZWxmLCBkYXRhLCBtZXRob2QsIHVybCwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XG4gICAgc2VsZi5lbWl0KCAnZGVzdHJveScsIF9lcnJvciwgX3JlcyApO1xuICAgICAgc2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICBzZWxmWyBzZWxmLl9fbW9sZHkuX19rZXkgXSA9IHVuZGVmaW5lZDtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgICB9ICk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgbmV3IEVycm9yKCAnVGhpcyBtb2xkeSBjYW5ub3QgYmUgZGVzdHJveWVkIGJlY2F1c2UgaXQgaGFzIG5vdCBiZWVuIHNhdmVkIHRvIHRoZSBzZXJ2ZXIgeWV0LicgKSBdICk7XG4gIH1cblxufTtcblxuTW9kZWwucHJvdG90eXBlLiRpc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fX2Rlc3Ryb3llZCA/IHRydWUgOiBpcy5lbXB0eSggdGhpc1sgdGhpcy5fX21vbGR5Ll9fa2V5IF0gKTtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCB0aGlzLl9fZGVzdHJveWVkICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBpc1ZhbGlkID0gdHJ1ZTtcblxuICBPYmplY3Qua2V5cyggc2VsZi5fX2F0dHJpYnV0ZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cbiAgICBpZiAoIHNlbGYuJGlzRGlydHkoKSAmJiBfa2V5ID09PSBzZWxmLl9fbW9sZHkuX19rZXkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gc2VsZlsgX2tleSBdLFxuICAgICAgYXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXG4gICAgICB0eXBlID0gYXR0cmlidXRlcy50eXBlLFxuICAgICAgYXJyYXlPZkFUeXBlID0gaGFzS2V5KCBhdHRyaWJ1dGVzLCAnYXJyYXlPZkFUeXBlJywgJ2Jvb2xlYW4nICkgPyBhdHRyaWJ1dGVzLmFycmF5T2ZBVHlwZSA9PT0gdHJ1ZSA6IGZhbHNlLFxuICAgICAgaXNSZXF1aXJlZCA9IGF0dHJpYnV0ZXMub3B0aW9uYWwgIT09IHRydWUsXG4gICAgICBpc051bGxPclVuZGVmaW5lZCA9IHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyBmYWxzZSA6IGFycmF5T2ZBVHlwZSA/IHZhbHVlLmxlbmd0aCA9PT0gMCA6IGlzLm51bGxPclVuZGVmaW5lZCggdmFsdWUgKSxcbiAgICAgIHR5cGVJc1dyb25nID0gaXMubm90LmVtcHR5KCB0eXBlICkgJiYgaXMuYS5zdHJpbmcoIHR5cGUgKSA/IGlzLm5vdC5hWyB0eXBlIF0oIHZhbHVlICkgOiBpc051bGxPclVuZGVmaW5lZDtcblxuICAgIGlmICggYXJyYXlPZkFUeXBlICYmIGlzLm5vdC5lbXB0eSggdmFsdWUgKSAmJiB2YWx1ZVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XG4gICAgICB2YWx1ZS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9pdGVtICkge1xuICAgICAgICBpZiAoIGlzVmFsaWQgJiYgX2l0ZW0uJGlzVmFsaWQoKSA9PT0gZmFsc2UgKSB7XG4gICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgfVxuXG4gICAgaWYgKCBpc1ZhbGlkICYmIGlzUmVxdWlyZWQgJiYgdHlwZUlzV3JvbmcgKSB7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgfVxuXG4gIH0gKTtcblxuICByZXR1cm4gaXNWYWxpZDtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kanNvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIGRhdGEgPSBzZWxmLl9fZGF0YSxcbiAgICBqc29uID0ge307XG5cbiAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG4gICAgaWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgZGF0YVsgX2tleSBdWyAwIF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcbiAgICAgIGpzb25bIF9rZXkgXSA9IFtdO1xuICAgICAgZGF0YVsgX2tleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX21vbGR5ICkge1xuICAgICAgICBqc29uWyBfa2V5IF0ucHVzaCggX21vbGR5LiRqc29uKCkgKTtcbiAgICAgIH0gKTtcbiAgfSBlbHNlIHtcbiAgICBqc29uWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCA/IGRhdGFbIF9rZXkgXS4kanNvbigpIDogZGF0YVsgX2tleSBdO1xuICAgIH1cbiAgfSApO1xuXG4gIHJldHVybiBqc29uO1xufTtcblxuTW9kZWwucHJvdG90eXBlLiRzYXZlID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBlcnJvciA9IG51bGwsXG4gICAgaXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcbiAgICBkYXRhID0gc2VsZi4kanNvbigpLFxuICAgIHVybCA9IHNlbGYuX19tb2xkeS4kdXJsKCkgKyAoICFpc0RpcnR5ICYmICFzZWxmLl9fbW9sZHkuX19rZXlsZXNzID8gJy8nICsgc2VsZlsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gOiAnJyApLFxuICAgIG1ldGhvZCA9IGlzRGlydHkgPyAncG9zdCcgOiAncHV0JyxcbiAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cbiAgc2VsZi5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIHNlbGYuZW1pdCggJ3ByZXNhdmUnLCB7XG4gICAgbW9sZHk6IHNlbGYsXG4gICAgZGF0YTogZGF0YSxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICB1cmw6IHVybCxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfSApO1xuXG4gIHJlcXVlc3QoIHNlbGYuX19tb2xkeSwgc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuICAgIHNlbGYuZW1pdCggJ3NhdmUnLCBfZXJyb3IsIF9yZXMgKTtcbiAgICBjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7IC8vbm90IHN1cmUgYWJvdXQgdGhhdCAhIHdoeSBwYXNzaW5nIHRoZSBjb250ZXh0ID9cbiAgfSApO1xuXG59O1xuXG5lbWl0dGVyKCBNb2RlbC5wcm90b3R5cGUgKTtcbnVzZWlmeSggTW9kZWwgKTtcblxuTW9kZWwuZXh0ZW5kID0gZXh0ZW5kO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBNb2RlbDsiLCJ2YXIgaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvaW5kZXhcIiksXG4gICAgZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcbiAgICBvYnNlcnZhYmxlQXJyYXkgPSByZXF1aXJlKCAnc2ctb2JzZXJ2YWJsZS1hcnJheScgKSxcbiAgICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxuICAgIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxuICAgIG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxuICAgIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcbiAgICByZXF1ZXN0ID0gcmVxdWlyZSggJy4vcmVxdWVzdCcgKSxcbiAgICB1c2VpZnkgPSByZXF1aXJlKCAndXNlaWZ5JyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggQmFzZU1vZGVsLCBkZWZhdWx0Q29uZmlndXJhdGlvbiwgZGVmYXVsdE1pZGRsZXdhcmUgKSB7XG5cbiAgdmFyIE1vbGR5ID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgIHByb3BlcnRpZXMgPSBpcy5hbi5vYmplY3QoIF9wcm9wZXJ0aWVzICkgPyBfcHJvcGVydGllcyA6IHt9LFxuXG4gICAgaW5pdGlhbCA9IHByb3BlcnRpZXMuaW5pdGlhbCB8fCB7fTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBzZWxmLCB7XG4gICAgICBfX21vbGR5OiB7XG4gICAgICAgIHZhbHVlOiB0cnVlXG4gICAgICB9LFxuICAgICAgX19wcm9wZXJ0aWVzOiB7XG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzWyAncHJvcGVydGllcycgXSB8fCB7fVxuICAgICAgfSxcbiAgICAgIF9fbWV0YWRhdGE6IHtcbiAgICAgICAgdmFsdWU6IHt9XG4gICAgICB9LFxuICAgICAgLypfX2F0dHJpYnV0ZXM6IHtcbiAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSwqL1xuICAgICAgX19iYXNlVXJsOiB7XG4gICAgICAgIHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAnYmFzZVVybCcgXSwgJ3N0cmluZycsICcnICksXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgX19kYXRhOiB7XG4gICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBfX2Rlc3Ryb3llZDoge1xuICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9LFxuICAgICAgX19oZWFkZXJzOiB7XG4gICAgICAgIHZhbHVlOiBtZXJnZSgge30sIGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSwgY2FzdCggZGVmYXVsdENvbmZpZ3VyYXRpb24uaGVhZGVycywgJ29iamVjdCcsIHt9ICkgKSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBfX2tleToge1xuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIF9fa2V5bGVzczoge1xuICAgICAgICB2YWx1ZTogcHJvcGVydGllc1sgJ2tleWxlc3MnIF0gPT09IHRydWVcbiAgICAgIH0sXG4gICAgICBfX25hbWU6IHtcbiAgICAgICAgdmFsdWU6IF9uYW1lIHx8IHByb3BlcnRpZXNbICduYW1lJyBdIHx8ICcnXG4gICAgICB9LFxuICAgICAgX191cmw6IHtcbiAgICAgICAgdmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICd1cmwnIF0sICdzdHJpbmcnLCAnJyApLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGJ1c3k6IHtcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0gKTtcblxuICAgIGlmICggISBzZWxmLl9fa2V5bGVzcyApIHtcbiAgICAgIHRoaXMuJHByb3BlcnR5KCB0aGlzLl9fa2V5ICk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19wcm9wZXJ0aWVzLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcbiAgICAgIHNlbGYuJHByb3BlcnR5KCBfa2V5LCBzZWxmLl9fcHJvcGVydGllc1sgX2tleSBdICk7XG4gICAgfSApO1xuXG4gICAgc2VsZi5vbiggJ3ByZWdldCcsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XG4gICAgc2VsZi5vbiggJ2dldCcsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuc2NoZW1hID0gZnVuY3Rpb24gKCBzY2hlbWEgKSB7XG5cbiAgICBPYmplY3Qua2V5cyggY2FzdCggc2NoZW1hLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcbiAgICAgIHNlbGYuJHByb3BlcnR5KCBfa2V5LCBzY2hlbWFbIF9rZXkgXSApO1xuICAgIH0gKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS5wcm90byA9IGZ1bmN0aW9uICggcHJvdG8gKSB7XG5cbiAgICB0aGlzLl9fcHJvcGVydGllcy5wcm90byA9IHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvIHx8IHt9O1xuICAgIGhlbHBlcnMuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90bywgcHJvdG8gKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoIF9pbml0aWFsICkge1xuXG4gICAgdmFyIEtsYXNzID0gQmFzZU1vZGVsLmV4dGVuZCggdGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gfHwge30gKTtcblxuICAgIHJldHVybiBuZXcgS2xhc3MoIF9pbml0aWFsLCB0aGlzICk7XG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLiRoZWFkZXJzID0gZnVuY3Rpb24gKCBfaGVhZGVycyApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XG4gICAgICByZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xuICAgIH1cblxuICAgIHNlbGYuX19oZWFkZXJzID0gaXMuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gX2hlYWRlcnMgOiBzZWxmLl9faGVhZGVycztcbiAgICByZXR1cm4gaXMubm90LmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IHNlbGYuX19oZWFkZXJzIDogc2VsZjtcbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuJGdldCA9IGZ1bmN0aW9uICggX3F1ZXJ5LCBfY2FsbGJhY2sgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgdXJsID0gc2VsZi4kdXJsKCksXG4gICAgICBtZXRob2QgPSAnZ2V0JyxcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxuICAgICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcFxuICAgICAgd2FzRGVzdHJveWVkID0gc2VsZi5fX2Rlc3Ryb3llZDtcblxuICAgIHNlbGYuZW1pdCggJ3ByZWdldCcsIHtcbiAgICAgIG1vbGR5OiBzZWxmLFxuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICBxdWVyeTogcXVlcnksXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH0gKTtcblxuICAgIHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcblxuXG4gICAgcmVxdWVzdCggc2VsZiwgbnVsbCwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcbiAgICAgIC8vdmFyIHJlcyA9IF9yZXMgaW5zdGFuY2VvZiBCYXNlTW9kZWwgPyBfcmVzIDogbnVsbDtcblxuICAgICAgLyppZiAoIGlzLmFuLmFycmF5KCBfcmVzICkgJiYgX3Jlc1sgMCBdIGluc3RhbmNlb2YgQmFzZU1vZGVsICkge1xuICAgICAgICBzZWxmLiRkYXRhKCBfcmVzWyAwIF0uJGpzb24oKSApO1xuICAgICAgICByZXMgPSBzZWxmO1xuICAgICAgfSovXG4gICAgICAvKlxuICAgICAgaWYgKCBfZXJyb3IgJiYgd2FzRGVzdHJveWVkICkge1xuICAgICAgICBzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgIH0qL1xuXG4gICAgICBzZWxmLmVtaXQoICdnZXQnLCBfZXJyb3IsIF9yZXMgKTtcblxuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgX2Vycm9yLCBfcmVzIF0gKTtcbiAgICB9ICk7XG4gIH07XG5cbiAgTW9sZHkucHJvdG90eXBlLiR1cmwgPSBmdW5jdGlvbiAoIF91cmwgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgYmFzZSA9IGlzLmVtcHR5KCBzZWxmLiRiYXNlVXJsKCkgKSA/ICcnIDogc2VsZi4kYmFzZVVybCgpLFxuICAgICAgbmFtZSA9IGlzLmVtcHR5KCBzZWxmLl9fbmFtZSApID8gJycgOiAnLycgKyBzZWxmLl9fbmFtZS50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApLFxuICAgICAgdXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxuICAgICAgZW5kcG9pbnQgPSBiYXNlICsgbmFtZSArICggaXMuZW1wdHkoIHVybCApID8gJycgOiAnLycgKyB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSApO1xuXG4gICAgc2VsZi5fX3VybCA9IHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApO1xuXG4gICAgcmV0dXJuIGlzLm5vdC5hLnN0cmluZyggX3VybCApID8gZW5kcG9pbnQgOiBzZWxmO1xuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS5fX2RlZmF1bHRNaWRkbGV3YXJlID0gZGVmYXVsdE1pZGRsZXdhcmU7XG5cbiAgTW9sZHkucHJvdG90eXBlLiRiYXNlVXJsID0gZnVuY3Rpb24gKCBfYmFzZSApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICB1cmwgPSBjYXN0KCBfYmFzZSwgJ3N0cmluZycsIHNlbGYuX19iYXNlVXJsIHx8ICcnICk7XG5cbiAgICBzZWxmLl9fYmFzZVVybCA9IHVybC50cmltKCkucmVwbGFjZSggLyhcXC98XFxzKSskL2csICcnICkgfHwgZGVmYXVsdENvbmZpZ3VyYXRpb24uYmFzZVVybCB8fCAnJztcblxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF9iYXNlICkgPyBzZWxmLl9fYmFzZVVybCA6IHNlbGY7XG4gIH07XG4gIFxuICBNb2xkeS5wcm90b3R5cGUuJGNvbGxlY3Rpb24gPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgIHVybCA9IHNlbGYuJHVybCgpLFxuICAgICAgbWV0aG9kID0gJ2dldCcsXG4gICAgICBxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcbiAgICAgIGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfcXVlcnkgKSA/IF9xdWVyeSA6IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cbiAgICBzZWxmLmVtaXQoICdwcmVjb2xsZWN0aW9uJywge1xuICAgICAgbW9sZHk6IHNlbGYsXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSApO1xuXG4gICAgcmVxdWVzdCggc2VsZiwgbnVsbCwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcbiAgICAgIHZhciByZXMgPSBjYXN0KCBfcmVzIGluc3RhbmNlb2YgQmFzZU1vZGVsIHx8IGlzLmFuLmFycmF5KCBfcmVzICkgPyBfcmVzIDogbnVsbCwgJ2FycmF5JywgW10gKTtcbiAgICAgIHNlbGYuZW1pdCggJ2NvbGxlY3Rpb24nLCBfZXJyb3IsIHJlcyApO1xuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgX2Vycm9yLCByZXMgXSApO1xuICAgIH0gKTtcblxuICB9O1xuXG4gIE1vbGR5LnByb3RvdHlwZS4kZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAoIG9iaiwga2V5LCB2YWx1ZSApIHtcblxuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZXhpc3RpbmdWYWx1ZSA9IG9ialsga2V5IF0gfHwgdmFsdWUsXG4gICAgICAgIG1ldGFkYXRhID0gdGhpcy5fX21ldGFkYXRhWyBrZXkgXTtcblxuICAgIGlmICggIW9iai5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgfHwgIW9iai5fX2F0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xuICAgICAgaWYgKCBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheU1vbGR5IHx8IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5U3RyaW5nICkge1xuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgPSBtZXRhZGF0YS52YWx1ZTtcbiAgICAgICAgbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheU1vbGR5O1xuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheVN0cmluZztcbiAgICAgICAgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7XG4gICAgICAgICAgdmFsdWU6IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0gKTtcblxuICAgICAgICBvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XG5cbiAgICAgIH0gZWxzZSBpZiAoIG1ldGFkYXRhLnZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xuICAgICAgICAgIHZhbHVlOiBuZXcgTW9sZHkoIG1ldGFkYXRhLnZhbHVlLm5hbWUsIG1ldGFkYXRhLnZhbHVlICkuY3JlYXRlKCksXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgfSApO1xuXG4gICAgICAgIG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcblxuICAgICAgfSBlbHNlIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSApIHtcblxuICAgICAgICB2YXIgYXJyYXkgPSBvYnNlcnZhYmxlQXJyYXkoIFtdICksXG4gICAgICAgICAgYXR0cmlidXRlVHlwZSA9IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyB8fCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA/IG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZVsgMCBdIDogJyonO1xuXG4gICAgICAgIG1ldGFkYXRhLmF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID0gdHJ1ZTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7XG4gICAgICAgICAgdmFsdWU6IGFycmF5LFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgfSApO1xuXG4gICAgICAgIG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcblxuICAgICAgICBbICdwdXNoJywgJ3Vuc2hpZnQnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xuICAgICAgICAgIGFycmF5Lm9uKCBfbWV0aG9kLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICAgICAgICAgICAgdmFsdWVzID0gW107XG4gICAgICAgICAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XG4gICAgICAgICAgICAgIGlmICggbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vbGR5ID0gbmV3IE1vbGR5KCBhdHRyaWJ1dGVUeXBlWyAnbmFtZScgXSwgYXR0cmlidXRlVHlwZSApLFxuICAgICAgICAgICAgICAgICAgZGF0YSA9IGlzLmFuLm9iamVjdCggX2l0ZW0gKSA/IF9pdGVtIDogbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XG5cbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCggbW9sZHkuY3JlYXRlKCBkYXRhICkgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCggY2FzdCggX2l0ZW0sIGF0dHJpYnV0ZVR5cGUsIG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5WyAnX18nICsgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgdmFsdWVzICk7XG4gICAgICAgICAgfSApO1xuICAgICAgICB9ICk7XG5cbiAgICAgICAgaWYoIGV4aXN0aW5nVmFsdWUgJiYgZXhpc3RpbmdWYWx1ZS5sZW5ndGggPiAwICkge1xuICAgICAgICAgIGV4aXN0aW5nVmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBvICkge1xuICAgICAgICAgICAgb2JqWyBrZXkgXS5wdXNoKCBvICk7XG4gICAgICAgICAgfSApO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcbiAgICAgICAgICBnZXQ6IGhlbHBlcnMuZ2V0UHJvcGVydHkoIGtleSApLFxuICAgICAgICAgIHNldDogaGVscGVycy5zZXRQcm9wZXJ0eSgga2V5ICksXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICB9ICk7XG4gICAgICB9XG5cbiAgICAgIG9iai5fX2F0dHJpYnV0ZXNbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlcztcbiAgICB9XG5cbiAgICBpZiAoIGV4aXN0aW5nVmFsdWUgIT09IHZvaWQgMCApIHsgLy9pZiBleGlzdGluZyB2YWx1ZVxuICAgICAgb2JqWyBrZXkgXSA9IGV4aXN0aW5nVmFsdWU7XG4gICAgfSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSAmJiBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICkge1xuICAgICAgb2JqWyBrZXkgXSA9IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xuICAgIH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBvYmpbIGtleSBdICkgJiYgbWV0YWRhdGEuYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgKSB7XG4gICAgICBpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgfHwgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBpcy5lbXB0eSggbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlICkgPyB1bmRlZmluZWQgOiBjYXN0KCB1bmRlZmluZWQsIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBNb2xkeS5wcm90b3R5cGUuJHByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5LCBfdmFsdWUgKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgYXR0cmlidXRlcyA9IG5ldyBoZWxwZXJzLmF0dHJpYnV0ZXMoIF9rZXksIF92YWx1ZSApLFxuICAgICAgLy9leGlzdGluZ1ZhbHVlID0gc2VsZlsgX2tleSBdLFxuICAgICAgYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSA9IGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGUgKSAmJiAvbW9sZHkvLnRlc3QoIGF0dHJpYnV0ZXMudHlwZSApLFxuICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IGlzLmFuLmFycmF5KCBhdHRyaWJ1dGVzLnR5cGUgKSxcbiAgICAgIHZhbHVlSXNBbkFycmF5TW9sZHkgPSBpcy5hbi5hcnJheSggX3ZhbHVlICkgJiYgaGFzS2V5KCBfdmFsdWVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxuICAgICAgdmFsdWVJc0FuQXJyYXlTdHJpbmcgPSBpcy5hbi5hcnJheSggX3ZhbHVlICkgJiYgaXMuYS5zdHJpbmcoIF92YWx1ZVsgMCBdICksXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgJiYgaGFzS2V5KCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxuICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gYXR0cmlidXRlVHlwZUlzQW5BcnJheSAmJiBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlWyAwIF0gKSAmJiBpcy5ub3QuZW1wdHkoIGF0dHJpYnV0ZXMudHlwZVsgMCBdICksXG4gICAgICB2YWx1ZUlzQVN0YXRpY01vbGR5ID0gaGFzS2V5KCBfdmFsdWUsICdwcm9wZXJ0aWVzJywgJ29iamVjdCcgKTtcblxuICAgIHNlbGYuX19tZXRhZGF0YVsgX2tleSBdID0ge1xuICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgIHZhbHVlOiBfdmFsdWUsXG4gICAgICBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5OiBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5LFxuICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheTogYXR0cmlidXRlVHlwZUlzQW5BcnJheSxcbiAgICAgIHZhbHVlSXNBbkFycmF5TW9sZHk6IHZhbHVlSXNBbkFycmF5TW9sZHksXG4gICAgICB2YWx1ZUlzQW5BcnJheVN0cmluZzogdmFsdWVJc0FuQXJyYXlTdHJpbmcsXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeTogYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHksXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmc6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyxcbiAgICAgIHZhbHVlSXNBU3RhdGljTW9sZHk6IHZhbHVlSXNBU3RhdGljTW9sZHlcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgZW1pdHRlciggTW9sZHkucHJvdG90eXBlICk7XG4gIHVzZWlmeSggTW9sZHkgKTtcbiAgXG4gIHJldHVybiBNb2xkeTtcblxufTsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG4gIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcbiAgaGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKTtcbi8qKlxuICogRmV0Y2hpbmcgdGhlIGRhdGFcbiAqIEBwYXJhbSAge1t0eXBlXX0gX21vbGR5ICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gX2RhdGEgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gX21ldGhvZCAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gX3VybCAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gX2NhbGxiYWNrIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF9tb2xkeSwgaW5zdGFuY2UsIF9kYXRhLCBfbWV0aG9kLCBfdXJsLCBfY2FsbGJhY2sgKSB7XG4gIHZhciBtb2xkeSA9IF9tb2xkeSxcbiAgICByZXN1bHQgPSBbXSxcbiAgICByZXNwb25zZVNob3VsZENvbnRhaW5BbklkID0gaGFzS2V5KCBfZGF0YSwgbW9sZHkuX19rZXkgKSAmJiBpcy5ub3QuZW1wdHkoIF9kYXRhWyBtb2xkeS5fX2tleSBdICkgJiYgL2dldC8udGVzdCggX21ldGhvZCApLFxuICAgIGlzSW5zdGFuY2UgPSBpbnN0YW5jZSA/IHRydWUgOiBmYWxzZSxcbiAgICBpc0RpcnR5ID0gaXNJbnN0YW5jZSA/IGluc3RhbmNlLiRpc0RpcnR5KCkgOiBmYWxzZTtcblxuICBtb2xkeS5fX2RlZmF1bHRNaWRkbGV3YXJlKCBmdW5jdGlvbiAoIF9lcnJvciwgX3Jlc3BvbnNlICkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgICAgZXJyb3IgPSBfZXJyb3IgPT09IG1vbGR5ID8gbnVsbCA6IGFyZ3Muc2hpZnQoKSxcbiAgICAgIHJlc3BvbnNlID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKCBlcnJvciAmJiAhKCBlcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XG4gICAgfVxuXG4gICAgaWYgKCAhZXJyb3IgJiYgaXNJbnN0YW5jZSAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSAmJiAoIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgJiYgIWhhc0tleSggcmVzcG9uc2UsIG1vbGR5Ll9fa2V5ICkgKSApIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIG1vbGR5Ll9fa2V5ICsgJ2AnICk7XG4gICAgfVxuXG4gICAgaWYgKCAhZXJyb3IgJiYgaXNEaXJ0eSAmJiBpc0luc3RhbmNlICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSApIHtcbiAgICAgIG1vbGR5WyBtb2xkeS5fX2tleSBdID0gcmVzcG9uc2VbIG1vbGR5Ll9fa2V5IF07XG4gICAgfVxuXG4gICAgaWYgKCAhZXJyb3IgKSB7XG4gICAgICBpZiggIWlzSW5zdGFuY2UgKSB7XG4gICAgICAgIGlmICggaXMuYXJyYXkoIHJlc3BvbnNlICkgKSB7XG5cbiAgICAgICAgICByZXNwb25zZS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9kYXRhICkge1xuXG4gICAgICAgICAgICByZXN1bHQucHVzaCggbW9sZHkuY3JlYXRlKCBfZGF0YSApICk7XG4gICAgICAgICAgfSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IG1vbGR5LmNyZWF0ZSggcmVzcG9uc2UgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFuY2UuJGRhdGEoIHJlc3BvbnNlICk7XG4gICAgICAgIHJlc3VsdCA9IGluc3RhbmNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jYWxsYmFjayAmJiBfY2FsbGJhY2soIGVycm9yLCByZXN1bHQgKTtcblxuICB9LCBfbW9sZHksIF9kYXRhLCBfbWV0aG9kLCBfdXJsICk7XG5cbn07Il19
(19)
});
