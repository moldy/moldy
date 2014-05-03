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
		"baseUrl": "",
		"headers": {}
	}
}
},{}],17:[function(_dereq_,module,exports){
var config = _dereq_( './config.json' ),
  moldyApi = {
    adapters: {
      __default: void 0
    },
    use: function ( adapter ) {

      if( !adapter || !adapter.name || !adapter.create || !adapter.find || !adapter.findOne || !adapter.save || !adapter.destroy ) {
        throw new Error( 'Invalid Adapter' );
      }

      if( !this.adapters.__default ) {
        this.adapters.__default = adapter;
      }

      this.adapters[ adapter.name ] = adapter;
    }
  };

var ModelFactory = _dereq_( './moldy' )( _dereq_( './model' ), config.defaults, moldyApi.adapters );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;
},{"./config.json":16,"./model":19,"./moldy":20}],18:[function(_dereq_,module,exports){
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
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],19:[function(_dereq_,module,exports){
var cast = _dereq_( 'sc-cast' ),
  emitter = _dereq_( 'emitter-component' ),
  hasKey = _dereq_( 'sc-haskey' ),
  helpers = _dereq_( './helpers' ),
  is = _dereq_( 'sc-is' ),
  extend = helpers.extendObject;

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

  helpers.extend( initialValues, _data || {} );

  var newMoldy = this.__moldy.create( initialValues );

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
    method = 'delete',
    callback = is.a.func( _callback ) ? _callback : helpers.noop;

  if ( self.__destroyed ) {
    return callback.apply( self, [ helpers.destroyedError( self ) ] );
  }

  self.emit( 'predestroy', {
    moldy: self,
    data: data,
    method: method,
    callback: callback
  } );

  if ( !isDirty ) {
    this.__moldy.__adapter[ this.__moldy.__adapterName ].destroy.call( this.__moldy, this.$json(), function ( _error, _res ) {

      if ( _error && !( _error instanceof Error ) ) {
        _error = new Error( 'An unknown error occurred' );
      }

      self.emit( 'destroy', _error, _res );
      self.__destroyed = true;
      self[ self.__moldy.__key ] = undefined;

      callback && callback( _error, _res );
    } );
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
    method = isDirty ? 'create' : 'save',
    callback = is.a.func( _callback ) ? _callback : helpers.noop;

  self.__destroyed = false;

  self.emit( 'presave', {
    moldy: self,
    data: data,
    method: method,
    callback: callback
  } );

  var responseShouldContainAnId = hasKey( data, self.__key ) && is.not.empty( data[ self.__key ] );

  this.__moldy.__adapter[ this.__moldy.__adapterName ][ method ].call( this.__moldy, data, function ( _error, _res ) {

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

    self.emit( 'save', _error, self );

    callback && callback( _error, self );
  } );
};

emitter( Model.prototype );

Model.extend = extend;

exports = module.exports = Model;
},{"./helpers":18,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7}],20:[function(_dereq_,module,exports){
var helpers = _dereq_( "./helpers/index" ),
  emitter = _dereq_( 'emitter-component' ),
  observableArray = _dereq_( 'sg-observable-array' ),
  hasKey = _dereq_( 'sc-haskey' ),
  is = _dereq_( 'sc-is' ),
  merge = _dereq_( 'sc-merge' ),
  cast = _dereq_( 'sc-cast' );

module.exports = function ( BaseModel, defaultConfiguration, adapter ) {

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
      __adapterName: {
        value: properties[ 'adapter' ] || '__default'
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

  Moldy.prototype.adapter = function ( adapter ) {

    if( !adapter || !this.__adapter[ adapter ] ) {
      throw new Error("Provide a valid adpater ");
    }

    this.__adapterName = adapter;

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

  Moldy.prototype.$findOne = function ( _query, _callback ) {
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

    this.__adapter[ this.__adapterName ].findOne.call( this, _query, function ( _error, _response ) {
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

  Moldy.prototype.__adapter = adapter;

  Moldy.prototype.$baseUrl = function ( _base ) {
    var self = this,
      url = cast( _base, 'string', self.__baseUrl || '' );

    self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' ) || defaultConfiguration.baseUrl || '';

    return is.not.a.string( _base ) ? self.__baseUrl : self;
  };

  Moldy.prototype.$find = function ( _query, _callback ) {
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

    this.__adapter[ this.__adapterName ].find.call( this, _query, function ( _error, res ) {

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

  return Moldy;

};
},{"./helpers/index":18,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sg-observable-array":15}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2RlcnZhbHAvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHktbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RlcnZhbHAvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHktbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9ub2RlX21vZHVsZXMvc2MtY29udGFpbnMvaW5kZXguanMiLCIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtZ3VpZC9pbmRleC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaGFza2V5L25vZGVfbW9kdWxlcy90eXBlLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pbmRleC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RlcnZhbHAvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHktbW9sZHkvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZ3VpZC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL251bGxvcnVuZGVmaW5lZC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvdHlwZS5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zYy1tZXJnZS9pbmRleC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L3NyYy9jb25maWcuanNvbiIsIi9Vc2Vycy9kZXJ2YWxwL0Ryb3Bib3gvc3JjL21vbGR5L21vbGR5LW1vbGR5L21vbGR5L3NyYy9mYWtlXzQ1OWQ3NmQ1LmpzIiwiL1VzZXJzL2RlcnZhbHAvRHJvcGJveC9zcmMvbW9sZHkvbW9sZHktbW9sZHkvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9zcmMvbW9kZWwuanMiLCIvVXNlcnMvZGVydmFscC9Ecm9wYm94L3NyYy9tb2xkeS9tb2xkeS1tb2xkeS9tb2xkeS9zcmMvbW9sZHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsInZhciBjb250YWlucyA9IHJlcXVpcmUoIFwic2MtY29udGFpbnNcIiApLFxuICBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApO1xuXG52YXIgY2FzdCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfY2FzdFR5cGUsIF9kZWZhdWx0LCBfdmFsdWVzLCBfYWRkaXRpb25hbFByb3BlcnRpZXMgKSB7XG5cbiAgdmFyIHBhcnNlZFZhbHVlLFxuICAgIGNhc3RUeXBlID0gX2Nhc3RUeXBlLFxuICAgIHZhbHVlLFxuICAgIHZhbHVlcyA9IGlzLmFuLmFycmF5KCBfdmFsdWVzICkgPyBfdmFsdWVzIDogW107XG5cbiAgc3dpdGNoICggdHJ1ZSApIHtcbiAgY2FzZSAoIC9mbG9hdHxpbnRlZ2VyLy50ZXN0KCBjYXN0VHlwZSApICk6XG4gICAgY2FzdFR5cGUgPSBcIm51bWJlclwiO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCBpcy5hWyBjYXN0VHlwZSBdKCBfdmFsdWUgKSB8fCBjYXN0VHlwZSA9PT0gJyonICkge1xuXG4gICAgdmFsdWUgPSBfdmFsdWU7XG5cbiAgfSBlbHNlIHtcblxuICAgIHN3aXRjaCAoIHRydWUgKSB7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImFycmF5XCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSggX3ZhbHVlICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIGlmICggaXMubm90Lm51bGxPclVuZGVmaW5lZCggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBbIF92YWx1ZSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYm9vbGVhblwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IC9eKHRydWV8MXx5fHllcykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IHRydWUgOiB1bmRlZmluZWQ7XG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGlmICggaXMubm90LmEuYm9vbGVhbiggdmFsdWUgKSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gL14oZmFsc2V8LTF8MHxufG5vKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gZmFsc2UgOiB1bmRlZmluZWQ7XG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICB2YWx1ZSA9IGlzLmEuYm9vbGVhbiggdmFsdWUgKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiZGF0ZVwiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gbmV3IERhdGUoIF92YWx1ZSApO1xuICAgICAgICB2YWx1ZSA9IGlzTmFOKCB2YWx1ZS5nZXRUaW1lKCkgKSA/IHVuZGVmaW5lZCA6IHZhbHVlO1xuXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJzdHJpbmdcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy51bmRlZmluZWQoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGhyb3cgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoICggZSApIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhbHVlID0gX3ZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJudW1iZXJcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBfdmFsdWUgKTtcbiAgICAgICAgaWYgKCBpcy5ub3QuYS5udW1iZXIoIHZhbHVlICkgfHwgaXNOYU4oIHZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHN3aXRjaCAoIHRydWUgKSB7XG4gICAgICAgIGNhc2UgX2Nhc3RUeXBlID09PSBcImludGVnZXJcIjpcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCB2YWx1ZSApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBjYXN0KCBKU09OLnBhcnNlKCBfdmFsdWUgKSwgY2FzdFR5cGUgKVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIH1cblxuICB9XG5cbiAgaWYgKCB2YWx1ZXMubGVuZ3RoID4gMCAmJiAhY29udGFpbnMoIHZhbHVlcywgdmFsdWUgKSApIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1sgMCBdO1xuICB9XG5cbiAgcmV0dXJuIGlzLm5vdC51bmRlZmluZWQoIHZhbHVlICkgPyB2YWx1ZSA6IGlzLm5vdC51bmRlZmluZWQoIF9kZWZhdWx0ICkgPyBfZGVmYXVsdCA6IG51bGw7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdDsiLCJ2YXIgY29udGFpbnMgPSBmdW5jdGlvbiAoIGRhdGEsIGl0ZW0gKSB7XG4gIHZhciBmb3VuZE9uZSA9IGZhbHNlO1xuXG4gIGlmICggQXJyYXkuaXNBcnJheSggZGF0YSApICkge1xuXG4gICAgZGF0YS5mb3JFYWNoKCBmdW5jdGlvbiAoIGFycmF5SXRlbSApIHtcbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGl0ZW0gPT09IGFycmF5SXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gKTtcblxuICB9IGVsc2UgaWYgKCBPYmplY3QoIGRhdGEgKSA9PT0gZGF0YSApIHtcblxuICAgIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgICAgIGlmICggZm91bmRPbmUgPT09IGZhbHNlICYmIGRhdGFbIGtleSBdID09PSBpdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICB9ICk7XG5cbiAgfVxuICByZXR1cm4gZm91bmRPbmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRhaW5zOyIsInZhciBndWlkUnggPSBcIns/WzAtOUEtRmEtZl17OH0tWzAtOUEtRmEtZl17NH0tNFswLTlBLUZhLWZdezN9LVswLTlBLUZhLWZdezR9LVswLTlBLUZhLWZdezEyfX0/XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIHZhciBndWlkID0gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKCAvW3h5XS9nLCBmdW5jdGlvbiAoIGMgKSB7XG4gICAgdmFyIHIgPSAoIGQgKyBNYXRoLnJhbmRvbSgpICogMTYgKSAlIDE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG4gICAgcmV0dXJuICggYyA9PT0gXCJ4XCIgPyByIDogKCByICYgMHg3IHwgMHg4ICkgKS50b1N0cmluZyggMTYgKTtcbiAgfSApO1xuICByZXR1cm4gZ3VpZDtcbn07XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAoIHN0cmluZyApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4LCBcImdcIiApLFxuICAgIG1hdGNoZXMgPSAoIHR5cGVvZiBzdHJpbmcgPT09IFwic3RyaW5nXCIgPyBzdHJpbmcgOiBcIlwiICkubWF0Y2goIHJ4ICk7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KCBtYXRjaGVzICkgPyBtYXRjaGVzIDogW107XG59O1xuXG5leHBvcnRzLmlzVmFsaWQgPSBmdW5jdGlvbiAoIGd1aWQgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCApO1xuICByZXR1cm4gcngudGVzdCggZ3VpZCApO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApLFxuICBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBvYmplY3QgPSB0eXBlKCBvYmplY3QgKSA9PT0gXCJvYmplY3RcIiA/IG9iamVjdCA6IHt9LCBrZXlzID0gdHlwZSgga2V5cyApID09PSBcImFycmF5XCIgPyBrZXlzIDogW107XG4gIGtleVR5cGUgPSB0eXBlKCBrZXlUeXBlICkgPT09IFwic3RyaW5nXCIgPyBrZXlUeXBlIDogXCJcIjtcblxuICB2YXIga2V5ID0ga2V5cy5sZW5ndGggPiAwID8ga2V5cy5zaGlmdCgpIDogXCJcIixcbiAgICBrZXlFeGlzdHMgPSBoYXMuY2FsbCggb2JqZWN0LCBrZXkgKSB8fCBvYmplY3RbIGtleSBdICE9PSB2b2lkIDAsXG4gICAga2V5VmFsdWUgPSBrZXlFeGlzdHMgPyBvYmplY3RbIGtleSBdIDogdW5kZWZpbmVkLFxuICAgIGtleVR5cGVJc0NvcnJlY3QgPSB0eXBlKCBrZXlWYWx1ZSApID09PSBrZXlUeXBlO1xuXG4gIGlmICgga2V5cy5sZW5ndGggPiAwICYmIGtleUV4aXN0cyApIHtcbiAgICByZXR1cm4gaGFzS2V5KCBvYmplY3RbIGtleSBdLCBrZXlzLCBrZXlUeXBlICk7XG4gIH1cblxuICByZXR1cm4ga2V5cy5sZW5ndGggPiAwIHx8IGtleVR5cGUgPT09IFwiXCIgPyBrZXlFeGlzdHMgOiBrZXlFeGlzdHMgJiYga2V5VHlwZUlzQ29ycmVjdDtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwic3RyaW5nXCIgPyBrZXlzLnNwbGl0KCBcIi5cIiApIDogW107XG5cbiAgcmV0dXJuIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICk7XG5cbn07IiwiXG4vKipcbiAqIHRvU3RyaW5nIHJlZi5cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4vKipcbiAqIFJldHVybiB0aGUgdHlwZSBvZiBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwpe1xuICBzd2l0Y2ggKHRvU3RyaW5nLmNhbGwodmFsKSkge1xuICAgIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzogcmV0dXJuICdmdW5jdGlvbic7XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6IHJldHVybiAnZGF0ZSc7XG4gICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzogcmV0dXJuICdyZWdleHAnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6IHJldHVybiAnYXJndW1lbnRzJztcbiAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6IHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKHZhbCA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICh2YWwgPT09IE9iamVjdCh2YWwpKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59O1xuIiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4vaXNlcy90eXBlXCIgKSxcbiAgaXMgPSB7XG4gICAgYToge30sXG4gICAgYW46IHt9LFxuICAgIG5vdDoge1xuICAgICAgYToge30sXG4gICAgICBhbjoge31cbiAgICB9XG4gIH07XG5cbnZhciBpc2VzID0ge1xuICBcImFyZ3VtZW50c1wiOiBbIFwiYXJndW1lbnRzXCIsIHR5cGUoIFwiYXJndW1lbnRzXCIgKSBdLFxuICBcImFycmF5XCI6IFsgXCJhcnJheVwiLCB0eXBlKCBcImFycmF5XCIgKSBdLFxuICBcImJvb2xlYW5cIjogWyBcImJvb2xlYW5cIiwgdHlwZSggXCJib29sZWFuXCIgKSBdLFxuICBcImRhdGVcIjogWyBcImRhdGVcIiwgdHlwZSggXCJkYXRlXCIgKSBdLFxuICBcImZ1bmN0aW9uXCI6IFsgXCJmdW5jdGlvblwiLCBcImZ1bmNcIiwgXCJmblwiLCB0eXBlKCBcImZ1bmN0aW9uXCIgKSBdLFxuICBcIm51bGxcIjogWyBcIm51bGxcIiwgdHlwZSggXCJudWxsXCIgKSBdLFxuICBcIm51bWJlclwiOiBbIFwibnVtYmVyXCIsIFwiaW50ZWdlclwiLCBcImludFwiLCB0eXBlKCBcIm51bWJlclwiICkgXSxcbiAgXCJvYmplY3RcIjogWyBcIm9iamVjdFwiLCB0eXBlKCBcIm9iamVjdFwiICkgXSxcbiAgXCJyZWdleHBcIjogWyBcInJlZ2V4cFwiLCB0eXBlKCBcInJlZ2V4cFwiICkgXSxcbiAgXCJzdHJpbmdcIjogWyBcInN0cmluZ1wiLCB0eXBlKCBcInN0cmluZ1wiICkgXSxcbiAgXCJ1bmRlZmluZWRcIjogWyBcInVuZGVmaW5lZFwiLCB0eXBlKCBcInVuZGVmaW5lZFwiICkgXSxcbiAgXCJlbXB0eVwiOiBbIFwiZW1wdHlcIiwgcmVxdWlyZSggXCIuL2lzZXMvZW1wdHlcIiApIF0sXG4gIFwibnVsbG9ydW5kZWZpbmVkXCI6IFsgXCJudWxsT3JVbmRlZmluZWRcIiwgXCJudWxsb3J1bmRlZmluZWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvbnVsbG9ydW5kZWZpbmVkXCIgKSBdLFxuICBcImd1aWRcIjogWyBcImd1aWRcIiwgcmVxdWlyZSggXCIuL2lzZXMvZ3VpZFwiICkgXVxufVxuXG5PYmplY3Qua2V5cyggaXNlcyApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gIHZhciBtZXRob2RzID0gaXNlc1sga2V5IF0uc2xpY2UoIDAsIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgKSxcbiAgICBmbiA9IGlzZXNbIGtleSBdWyBpc2VzWyBrZXkgXS5sZW5ndGggLSAxIF07XG5cbiAgbWV0aG9kcy5mb3JFYWNoKCBmdW5jdGlvbiAoIG1ldGhvZEtleSApIHtcbiAgICBpc1sgbWV0aG9kS2V5IF0gPSBpcy5hWyBtZXRob2RLZXkgXSA9IGlzLmFuWyBtZXRob2RLZXkgXSA9IGZuO1xuICAgIGlzLm5vdFsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYVsgbWV0aG9kS2V5IF0gPSBpcy5ub3QuYW5bIG1ldGhvZEtleSBdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB9XG4gIH0gKTtcblxufSApO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBpcztcbmV4cG9ydHMudHlwZSA9IHR5cGU7IiwidmFyIHR5cGUgPSByZXF1aXJlKFwiLi4vdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICB2YXIgZW1wdHkgPSBmYWxzZTtcblxuICBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVsbFwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZW1wdHkgPSB0cnVlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm9iamVjdFwiICkge1xuICAgIGVtcHR5ID0gT2JqZWN0LmtleXMoIHZhbHVlICkubGVuZ3RoID09PSAwO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImJvb2xlYW5cIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSBmYWxzZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudW1iZXJcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAtMTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJhcnJheVwiIHx8IHR5cGUoIHZhbHVlICkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICByZXR1cm4gZW1wdHk7XG5cbn07IiwidmFyIGd1aWQgPSByZXF1aXJlKCBcInNjLWd1aWRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHJldHVybiBndWlkLmlzVmFsaWQoIHZhbHVlICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcblx0cmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IHZvaWQgMDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcIi4uL3R5cGVcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX3R5cGUgKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcbiAgICByZXR1cm4gdHlwZSggX3ZhbHVlICkgPT09IF90eXBlO1xuICB9XG59IiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbCApIHtcbiAgc3dpdGNoICggdG9TdHJpbmcuY2FsbCggdmFsICkgKSB7XG4gIGNhc2UgJ1tvYmplY3QgRnVuY3Rpb25dJzpcbiAgICByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgcmV0dXJuICdkYXRlJztcbiAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6XG4gICAgcmV0dXJuICdhcmd1bWVudHMnO1xuICBjYXNlICdbb2JqZWN0IEFycmF5XSc6XG4gICAgcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAoIHZhbCA9PT0gbnVsbCApIHJldHVybiAnbnVsbCc7XG4gIGlmICggdmFsID09PSB1bmRlZmluZWQgKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmICggdmFsID09PSBPYmplY3QoIHZhbCApICkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwidHlwZS1jb21wb25lbnRcIiApO1xuXG52YXIgbWVyZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgZGVlcCA9IHR5cGUoIGFyZ3NbIDAgXSApID09PSBcImJvb2xlYW5cIiA/IGFyZ3Muc2hpZnQoKSA6IGZhbHNlLFxuICAgIG9iamVjdHMgPSBhcmdzLFxuICAgIHJlc3VsdCA9IHt9O1xuXG4gIG9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24gKCBvYmplY3RuICkge1xuXG4gICAgaWYgKCB0eXBlKCBvYmplY3RuICkgIT09IFwib2JqZWN0XCIgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoIG9iamVjdG4gKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcbiAgICAgIGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBvYmplY3RuLCBrZXkgKSApIHtcbiAgICAgICAgaWYgKCBkZWVwICYmIHR5cGUoIG9iamVjdG5bIGtleSBdICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG1lcmdlKCBkZWVwLCB7fSwgcmVzdWx0WyBrZXkgXSwgb2JqZWN0blsga2V5IF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gb2JqZWN0blsga2V5IF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlOyIsInZhciBPYnNlcnZhYmxlQXJyYXkgPSBmdW5jdGlvbiAoIF9hcnJheSApIHtcblx0dmFyIGhhbmRsZXJzID0ge30sXG5cdFx0YXJyYXkgPSBBcnJheS5pc0FycmF5KCBfYXJyYXkgKSA/IF9hcnJheSA6IFtdO1xuXG5cdHZhciBwcm94eSA9IGZ1bmN0aW9uICggX21ldGhvZCwgX3ZhbHVlICkge1xuXHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApO1xuXG5cdFx0aWYgKCBoYW5kbGVyc1sgX21ldGhvZCBdICkge1xuXHRcdFx0cmV0dXJuIGhhbmRsZXJzWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3MgKTtcblx0XHR9XG5cdH07XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCB7XG5cdFx0b246IHtcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiAoIF9ldmVudCwgX2NhbGxiYWNrICkge1xuXHRcdFx0XHRoYW5kbGVyc1sgX2V2ZW50IF0gPSBfY2FsbGJhY2s7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3BvcCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHByb3h5KCAncG9wJywgYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXSApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdfX3BvcCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5wb3AuYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnc2hpZnQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3NoaWZ0JywgYXJyYXlbIDAgXSApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdfX3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNoaWZ0LmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0WyAncHVzaCcsICdyZXZlcnNlJywgJ3Vuc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xuXHRcdHZhciBwcm9wZXJ0aWVzID0ge307XG5cblx0XHRwcm9wZXJ0aWVzWyBfbWV0aG9kIF0gPSB7XG5cdFx0XHR2YWx1ZTogcHJveHkuYmluZCggbnVsbCwgX21ldGhvZCApXG5cdFx0fTtcblxuXHRcdHByb3BlcnRpZXNbICdfXycgKyBfbWV0aG9kIF0gPSB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG5cdFx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGVbIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggYXJyYXksIHByb3BlcnRpZXMgKTtcblx0fSApO1xuXG5cdHJldHVybiBhcnJheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2YWJsZUFycmF5OyIsIm1vZHVsZS5leHBvcnRzPXtcclxuXHRcImRlZmF1bHRzXCI6IHtcclxuXHRcdFwiYmFzZVVybFwiOiBcIlwiLFxyXG5cdFx0XCJoZWFkZXJzXCI6IHt9XHJcblx0fVxyXG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoICcuL2NvbmZpZy5qc29uJyApLFxyXG4gIG1vbGR5QXBpID0ge1xyXG4gICAgYWRhcHRlcnM6IHtcclxuICAgICAgX19kZWZhdWx0OiB2b2lkIDBcclxuICAgIH0sXHJcbiAgICB1c2U6IGZ1bmN0aW9uICggYWRhcHRlciApIHtcclxuXHJcbiAgICAgIGlmKCAhYWRhcHRlciB8fCAhYWRhcHRlci5uYW1lIHx8ICFhZGFwdGVyLmNyZWF0ZSB8fCAhYWRhcHRlci5maW5kIHx8ICFhZGFwdGVyLmZpbmRPbmUgfHwgIWFkYXB0ZXIuc2F2ZSB8fCAhYWRhcHRlci5kZXN0cm95ICkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ0ludmFsaWQgQWRhcHRlcicgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoICF0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCApIHtcclxuICAgICAgICB0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCA9IGFkYXB0ZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYWRhcHRlcnNbIGFkYXB0ZXIubmFtZSBdID0gYWRhcHRlcjtcclxuICAgIH1cclxuICB9O1xyXG5cclxudmFyIE1vZGVsRmFjdG9yeSA9IHJlcXVpcmUoICcuL21vbGR5JyApKCByZXF1aXJlKCAnLi9tb2RlbCcgKSwgY29uZmlnLmRlZmF1bHRzLCBtb2xkeUFwaS5hZGFwdGVycyApO1xyXG5cclxubW9sZHlBcGkuZXh0ZW5kID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcbiAgcmV0dXJuIG5ldyBNb2RlbEZhY3RvcnkoIF9uYW1lLCBfcHJvcGVydGllcyApO1xyXG59O1xyXG5cclxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbW9sZHlBcGk7XHJcbmV4cG9ydHMuZGVmYXVsdHMgPSBjb25maWcuZGVmYXVsdHM7IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG4gIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuICBtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKTtcclxuXHJcbmV4cG9ydHMuYXR0cmlidXRlcyA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG4gIHZhciB2YWx1ZTtcclxuXHJcbiAgaWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XHJcbiAgICB2YWx1ZSA9IHtcclxuICAgICAgdHlwZTogX3ZhbHVlXHJcbiAgICB9O1xyXG4gIH0gZWxzZSBpZiAoIGlzLmFuLm9iamVjdCggX3ZhbHVlICkgJiYgX3ZhbHVlWyAnX19pc01vbGR5JyBdID09PSB0cnVlICkge1xyXG4gICAgdmFsdWUgPSB7XHJcbiAgICAgIHR5cGU6ICdtb2xkeScsXHJcbiAgICAgIGRlZmF1bHQ6IF92YWx1ZVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB2YWx1ZSA9IF92YWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBtZXJnZSgge1xyXG4gICAgbmFtZTogX2tleSB8fCAnJyxcclxuICAgIHR5cGU6ICcnLFxyXG4gICAgZGVmYXVsdDogbnVsbCxcclxuICAgIG9wdGlvbmFsOiBmYWxzZVxyXG4gIH0sIHZhbHVlICk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fX2RhdGFbIF9rZXkgXTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnRzLmRlc3Ryb3llZEVycm9yID0gZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcbiAgdmFyIGl0ZW0gPSB0eXBlb2YgX21vbGR5ID09PSAnb2JqZWN0JyA/IF9tb2xkeSA6IHt9O1xyXG4gIHJldHVybiBuZXcgRXJyb3IoICdUaGUgZ2l2ZW4gbW9sZHkgaXRlbSBgJyArIGl0ZW0uX19uYW1lICsgJ2AgaGFzIGJlZW4gZGVzdHJveWVkJyApO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgX3NlbGYuYnVzeSA9IHRydWU7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG4gICAgICB2YWx1ZSA9IGF0dHJpYnV0ZXMudHlwZSA/IGNhc3QoIF92YWx1ZSwgYXR0cmlidXRlcy50eXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApIDogX3ZhbHVlO1xyXG5cclxuICAgIGlmICggc2VsZi5fX2RhdGFbIF9rZXkgXSAhPT0gdmFsdWUgKSB7XHJcbiAgICAgIHNlbGYuZW1pdCggJ2NoYW5nZScsIHNlbGYuX19kYXRhWyBfa2V5IF0sIHZhbHVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZhbHVlO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydHMudW5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgX3NlbGYuYnVzeSA9IGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxudmFyIF9leHRlbmQgPSBmdW5jdGlvbiggb2JqICkge1xyXG4gICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XHJcbiAgICAgIGlmICggc291cmNlICkge1xyXG4gICAgICAgIGZvciAoIHZhciBwcm9wIGluIHNvdXJjZSApIHtcclxuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5leHBvcnRzLmV4dGVuZCA9IF9leHRlbmQ7XHJcblxyXG5leHBvcnRzLmV4dGVuZE9iamVjdCA9IGZ1bmN0aW9uKCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcyApIHtcclxuICB2YXIgcGFyZW50ID0gdGhpcztcclxuICB2YXIgY2hpbGQ7XHJcblxyXG4gIGlmICggcHJvdG9Qcm9wcyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIHByb3RvUHJvcHMsICdjb25zdHJ1Y3RvcicgKSApIHtcclxuICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcclxuICB9IGVsc2Uge1xyXG4gICAgY2hpbGQgPSBmdW5jdGlvbiggKXsgcmV0dXJuIHBhcmVudC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7IH07XHJcbiAgfVxyXG5cclxuICBfZXh0ZW5kKCBjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyApO1xyXG5cclxuICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKXsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9O1xyXG5cclxuICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuICAgaWYgKHByb3RvUHJvcHMpIF9leHRlbmQoIGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyApO1xyXG5cclxuICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcbiAgcmV0dXJuIGNoaWxkO1xyXG59OyIsInZhciBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXHJcbiAgZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuICBoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxyXG4gIGhlbHBlcnMgPSByZXF1aXJlKCAnLi9oZWxwZXJzJyApLFxyXG4gIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG4gIGV4dGVuZCA9IGhlbHBlcnMuZXh0ZW5kT2JqZWN0O1xyXG5cclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCBpbml0aWFsLCBfX21vbGR5ICkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgaW5pdGlhbCA9IGluaXRpYWwgfHwge307XHJcblxyXG4gIHRoaXMuX19tb2xkeSA9IF9fbW9sZHk7XHJcbiAgdGhpcy5fX2lzTW9sZHkgPSB0cnVlO1xyXG4gIHRoaXMuX19hdHRyaWJ1dGVzID0ge307XHJcbiAgdGhpcy5fX2RhdGEgPSB7fTtcclxuICB0aGlzLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gIGlmICggIXNlbGYuX19tb2xkeS5fX2tleWxlc3MgKSB7XHJcbiAgICBzZWxmLl9fbW9sZHkuJGRlZmluZVByb3BlcnR5KCBzZWxmLCBzZWxmLl9fbW9sZHkuX19rZXkgKTtcclxuICB9XHJcblxyXG4gIE9iamVjdC5rZXlzKCBjYXN0KCBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YSwgJ29iamVjdCcsIHt9ICkgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcbiAgICBzZWxmLl9fbW9sZHkuJGRlZmluZVByb3BlcnR5KCBzZWxmLCBfa2V5LCBpbml0aWFsWyBfa2V5IF0gKTtcclxuICB9ICk7XHJcblxyXG4gIGZvciAoIHZhciBpIGluIGluaXRpYWwgKSB7XHJcbiAgICBpZiAoIGluaXRpYWwuaGFzT3duUHJvcGVydHkoIGkgKSAmJiBzZWxmLl9fbW9sZHkuX19tZXRhZGF0YVsgaSBdICkge1xyXG4gICAgICB0aGlzWyBpIF0gPSBpbml0aWFsWyBpIF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZWxmLm9uKCAncHJlc2F2ZScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XHJcbiAgc2VsZi5vbiggJ3NhdmUnLCBoZWxwZXJzLnVuc2V0QnVzeSggc2VsZiApICk7XHJcblxyXG4gIHNlbGYub24oICdwcmVkZXN0cm95JywgaGVscGVycy5zZXRCdXN5KCBzZWxmICkgKTtcclxuICBzZWxmLm9uKCAnZGVzdHJveScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgT2JqZWN0LmtleXMoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gICAgaWYgKCBoYXNLZXkoIHNlbGZbIF9rZXkgXSwgJ19faXNNb2xkeScsICdib29sZWFuJyApICYmIHNlbGZbIF9rZXkgXS5fX2lzTW9sZHkgPT09IHRydWUgKSB7XHJcbiAgICAgIHNlbGZbIF9rZXkgXS4kY2xlYXIoKTtcclxuICAgIH0gZWxzZSBpZiAoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlICkge1xyXG4gICAgICB3aGlsZSAoIHNlbGZbIF9rZXkgXS5sZW5ndGggPiAwICkge1xyXG4gICAgICAgIHNlbGZbIF9rZXkgXS5zaGlmdCgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmWyBfa2V5IF0gPSBzZWxmLl9fZGF0YVsgX2tleSBdID0gdm9pZCAwO1xyXG4gICAgfVxyXG4gIH0gKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAkY2xvbmUgd29uJ3Qgd29yayBjdXJyZW50bHlcclxuICogQHBhcmFtICB7W3R5cGVdfSBfZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLiRjbG9uZSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgaW5pdGlhbFZhbHVlcyA9IHRoaXMuJGpzb24oKTtcclxuXHJcbiAgaGVscGVycy5leHRlbmQoIGluaXRpYWxWYWx1ZXMsIF9kYXRhIHx8IHt9ICk7XHJcblxyXG4gIHZhciBuZXdNb2xkeSA9IHRoaXMuX19tb2xkeS5jcmVhdGUoIGluaXRpYWxWYWx1ZXMgKTtcclxuXHJcbiAgcmV0dXJuIG5ld01vbGR5O1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRkYXRhID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICBkYXRhID0gaXMub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiB7fTtcclxuXHJcbiAgaWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG4gICAgcmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuICB9XHJcblxyXG4gIE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG4gICAgaWYgKCBzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xyXG4gICAgICBpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBoYXNLZXkoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSAmJiBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSA9PT0gdHJ1ZSApIHtcclxuICAgICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcbiAgICAgICAgICBzZWxmWyBfa2V5IF0ucHVzaCggX21vbGR5ICk7XHJcbiAgICAgICAgfSApO1xyXG4gICAgICB9IGVsc2UgaWYgKCBpcy5hLm9iamVjdCggZGF0YVsgX2tleSBdICkgJiYgc2VsZlsgX2tleSBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgICAgc2VsZlsgX2tleSBdLiRkYXRhKCBkYXRhWyBfa2V5IF0gKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ICk7XHJcblxyXG4gIHJldHVybiBzZWxmO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xyXG4gIHZhciBzZWxmID0gdGhpcyxcclxuICAgIGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXHJcbiAgICBkYXRhID0gc2VsZi4kanNvbigpLFxyXG4gICAgbWV0aG9kID0gJ2RlbGV0ZScsXHJcbiAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XHJcblxyXG4gIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuICAgIHJldHVybiBjYWxsYmFjay5hcHBseSggc2VsZiwgWyBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICkgXSApO1xyXG4gIH1cclxuXHJcbiAgc2VsZi5lbWl0KCAncHJlZGVzdHJveScsIHtcclxuICAgIG1vbGR5OiBzZWxmLFxyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgfSApO1xyXG5cclxuICBpZiAoICFpc0RpcnR5ICkge1xyXG4gICAgdGhpcy5fX21vbGR5Ll9fYWRhcHRlclsgdGhpcy5fX21vbGR5Ll9fYWRhcHRlck5hbWUgXS5kZXN0cm95LmNhbGwoIHRoaXMuX19tb2xkeSwgdGhpcy4kanNvbigpLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuXHJcbiAgICAgIGlmICggX2Vycm9yICYmICEoIF9lcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XHJcbiAgICAgICAgX2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5lbWl0KCAnZGVzdHJveScsIF9lcnJvciwgX3JlcyApO1xyXG4gICAgICBzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgICAgc2VsZlsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayggX2Vycm9yLCBfcmVzICk7XHJcbiAgICB9ICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCBuZXcgRXJyb3IoICdUaGlzIG1vbGR5IGNhbm5vdCBiZSBkZXN0cm95ZWQgYmVjYXVzZSBpdCBoYXMgbm90IGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciB5ZXQuJyApICk7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgcmV0dXJuIHRoaXMuX19kZXN0cm95ZWQgPyB0cnVlIDogaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19tb2xkeS5fX2tleSBdICk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGlzVmFsaWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCB0aGlzLl9fZGVzdHJveWVkICkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgaXNWYWxpZCA9IHRydWU7XHJcblxyXG4gIE9iamVjdC5rZXlzKCBzZWxmLl9fYXR0cmlidXRlcyApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHJcbiAgICBpZiAoIHNlbGYuJGlzRGlydHkoKSAmJiBfa2V5ID09PSBzZWxmLl9fbW9sZHkuX19rZXkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdmFsdWUgPSBzZWxmWyBfa2V5IF0sXHJcbiAgICAgIGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG4gICAgICB0eXBlID0gYXR0cmlidXRlcy50eXBlLFxyXG4gICAgICBhcnJheU9mQVR5cGUgPSBoYXNLZXkoIGF0dHJpYnV0ZXMsICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSA/IGF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID09PSB0cnVlIDogZmFsc2UsXHJcbiAgICAgIGlzUmVxdWlyZWQgPSBhdHRyaWJ1dGVzLm9wdGlvbmFsICE9PSB0cnVlLFxyXG4gICAgICBpc051bGxPclVuZGVmaW5lZCA9IHNlbGYuX19tb2xkeS5fX2tleWxlc3MgPyBmYWxzZSA6IGFycmF5T2ZBVHlwZSA/IHZhbHVlLmxlbmd0aCA9PT0gMCA6IGlzLm51bGxPclVuZGVmaW5lZCggdmFsdWUgKSxcclxuICAgICAgdHlwZUlzV3JvbmcgPSBpcy5ub3QuZW1wdHkoIHR5cGUgKSAmJiBpcy5hLnN0cmluZyggdHlwZSApID8gaXMubm90LmFbIHR5cGUgXSggdmFsdWUgKSA6IGlzTnVsbE9yVW5kZWZpbmVkO1xyXG5cclxuICAgIGlmICggYXJyYXlPZkFUeXBlICYmIGlzLm5vdC5lbXB0eSggdmFsdWUgKSAmJiB2YWx1ZVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgIHZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XHJcbiAgICAgICAgaWYgKCBpc1ZhbGlkICYmIF9pdGVtLiRpc1ZhbGlkKCkgPT09IGZhbHNlICkge1xyXG4gICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggaXNWYWxpZCAmJiBpc1JlcXVpcmVkICYmIHR5cGVJc1dyb25nICkge1xyXG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gIH0gKTtcclxuXHJcbiAgcmV0dXJuIGlzVmFsaWQ7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGpzb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgZGF0YSA9IHNlbGYuX19kYXRhLFxyXG4gICAganNvbiA9IHt9O1xyXG5cclxuICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgIGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGRhdGFbIF9rZXkgXVsgMCBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcbiAgICAgIGpzb25bIF9rZXkgXSA9IFtdO1xyXG4gICAgICBkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcbiAgICAgICAganNvblsgX2tleSBdLnB1c2goIF9tb2xkeS4kanNvbigpICk7XHJcbiAgICAgIH0gKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGpzb25bIF9rZXkgXSA9IGRhdGFbIF9rZXkgXSBpbnN0YW5jZW9mIE1vZGVsID8gZGF0YVsgX2tleSBdLiRqc29uKCkgOiBkYXRhWyBfa2V5IF07XHJcbiAgICB9XHJcbiAgfSApO1xyXG5cclxuICByZXR1cm4ganNvbjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kc2F2ZSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xyXG4gIHZhciBzZWxmID0gdGhpcyxcclxuICAgIGVycm9yID0gbnVsbCxcclxuICAgIGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXHJcbiAgICBkYXRhID0gc2VsZi4kanNvbigpLFxyXG4gICAgbWV0aG9kID0gaXNEaXJ0eSA/ICdjcmVhdGUnIDogJ3NhdmUnLFxyXG4gICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuICBzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gIHNlbGYuZW1pdCggJ3ByZXNhdmUnLCB7XHJcbiAgICBtb2xkeTogc2VsZixcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gIH0gKTtcclxuXHJcbiAgdmFyIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgPSBoYXNLZXkoIGRhdGEsIHNlbGYuX19rZXkgKSAmJiBpcy5ub3QuZW1wdHkoIGRhdGFbIHNlbGYuX19rZXkgXSApO1xyXG5cclxuICB0aGlzLl9fbW9sZHkuX19hZGFwdGVyWyB0aGlzLl9fbW9sZHkuX19hZGFwdGVyTmFtZSBdWyBtZXRob2QgXS5jYWxsKCB0aGlzLl9fbW9sZHksIGRhdGEsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG5cclxuICAgIGlmICggX2Vycm9yICYmICEoIF9lcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XHJcbiAgICAgIF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCAhX2Vycm9yICYmIGlzRGlydHkgJiYgaXMub2JqZWN0KCBfcmVzICkgJiYgKCByZXNwb25zZVNob3VsZENvbnRhaW5BbklkICYmICFoYXNLZXkoIF9yZXMsIHNlbGYuX19tb2xkeS5fX2tleSApICkgKSB7XHJcbiAgICAgIF9lcnJvciA9IG5ldyBFcnJvciggJ1RoZSByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIgZGlkIG5vdCBjb250YWluIGEgdmFsaWQgYCcgKyBzZWxmLl9fbW9sZHkuX19rZXkgKyAnYCcgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoICFfZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIF9yZXMgKSApIHtcclxuICAgICAgc2VsZi5fX21vbGR5WyBzZWxmLl9fbW9sZHkuX19rZXkgXSA9IF9yZXNbIHNlbGYuX19tb2xkeS5fX2tleSBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggIWVycm9yICkge1xyXG4gICAgICBzZWxmLiRkYXRhKCBfcmVzICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5lbWl0KCAnc2F2ZScsIF9lcnJvciwgc2VsZiApO1xyXG5cclxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHNlbGYgKTtcclxuICB9ICk7XHJcbn07XHJcblxyXG5lbWl0dGVyKCBNb2RlbC5wcm90b3R5cGUgKTtcclxuXHJcbk1vZGVsLmV4dGVuZCA9IGV4dGVuZDtcclxuXHJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsInZhciBoZWxwZXJzID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvaW5kZXhcIiApLFxyXG4gIGVtaXR0ZXIgPSByZXF1aXJlKCAnZW1pdHRlci1jb21wb25lbnQnICksXHJcbiAgb2JzZXJ2YWJsZUFycmF5ID0gcmVxdWlyZSggJ3NnLW9ic2VydmFibGUtYXJyYXknICksXHJcbiAgaGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKSxcclxuICBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuICBtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKSxcclxuICBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggQmFzZU1vZGVsLCBkZWZhdWx0Q29uZmlndXJhdGlvbiwgYWRhcHRlciApIHtcclxuXHJcbiAgdmFyIE1vbGR5ID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIHByb3BlcnRpZXMgPSBpcy5hbi5vYmplY3QoIF9wcm9wZXJ0aWVzICkgPyBfcHJvcGVydGllcyA6IHt9LFxyXG5cclxuICAgICAgaW5pdGlhbCA9IHByb3BlcnRpZXMuaW5pdGlhbCB8fCB7fTtcclxuXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggc2VsZiwge1xyXG4gICAgICBfX21vbGR5OiB7XHJcbiAgICAgICAgdmFsdWU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19wcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgdmFsdWU6IHByb3BlcnRpZXNbICdwcm9wZXJ0aWVzJyBdIHx8IHt9XHJcbiAgICAgIH0sXHJcbiAgICAgIF9fYWRhcHRlck5hbWU6IHtcclxuICAgICAgICB2YWx1ZTogcHJvcGVydGllc1sgJ2FkYXB0ZXInIF0gfHwgJ19fZGVmYXVsdCdcclxuICAgICAgfSxcclxuICAgICAgX19tZXRhZGF0YToge1xyXG4gICAgICAgIHZhbHVlOiB7fVxyXG4gICAgICB9LFxyXG4gICAgICBfX2Jhc2VVcmw6IHtcclxuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2Jhc2VVcmwnIF0sICdzdHJpbmcnLCAnJyApLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fZGF0YToge1xyXG4gICAgICAgIHZhbHVlOiB7fSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX2Rlc3Ryb3llZDoge1xyXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX2hlYWRlcnM6IHtcclxuICAgICAgICB2YWx1ZTogbWVyZ2UoIHt9LCBjYXN0KCBwcm9wZXJ0aWVzWyAnaGVhZGVycycgXSwgJ29iamVjdCcsIHt9ICksIGNhc3QoIGRlZmF1bHRDb25maWd1cmF0aW9uLmhlYWRlcnMsICdvYmplY3QnLCB7fSApICksXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgX19rZXk6IHtcclxuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIF9fa2V5bGVzczoge1xyXG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSA9PT0gdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBfX25hbWU6IHtcclxuICAgICAgICB2YWx1ZTogX25hbWUgfHwgcHJvcGVydGllc1sgJ25hbWUnIF0gfHwgJydcclxuICAgICAgfSxcclxuICAgICAgX191cmw6IHtcclxuICAgICAgICB2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ3VybCcgXSwgJ3N0cmluZycsICcnICksXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgYnVzeToge1xyXG4gICAgICAgIHZhbHVlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgaWYgKCAhc2VsZi5fX2tleWxlc3MgKSB7XHJcbiAgICAgIHRoaXMuJHByb3BlcnR5KCB0aGlzLl9fa2V5ICk7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19wcm9wZXJ0aWVzLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuICAgICAgc2VsZi4kcHJvcGVydHkoIF9rZXksIHNlbGYuX19wcm9wZXJ0aWVzWyBfa2V5IF0gKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICBzZWxmLm9uKCAncHJlZmluZE9uZScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XHJcbiAgICBzZWxmLm9uKCAnZmluZE9uZScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuc2NoZW1hID0gZnVuY3Rpb24gKCBzY2hlbWEgKSB7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGNhc3QoIHNjaGVtYSwgJ29iamVjdCcsIHt9ICkgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcbiAgICAgIHNlbGYuJHByb3BlcnR5KCBfa2V5LCBzY2hlbWFbIF9rZXkgXSApO1xyXG4gICAgfSApO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS5hZGFwdGVyID0gZnVuY3Rpb24gKCBhZGFwdGVyICkge1xyXG5cclxuICAgIGlmKCAhYWRhcHRlciB8fCAhdGhpcy5fX2FkYXB0ZXJbIGFkYXB0ZXIgXSApIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvdmlkZSBhIHZhbGlkIGFkcGF0ZXIgXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX19hZGFwdGVyTmFtZSA9IGFkYXB0ZXI7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLnByb3RvID0gZnVuY3Rpb24gKCBwcm90byApIHtcclxuXHJcbiAgICB0aGlzLl9fcHJvcGVydGllcy5wcm90byA9IHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvIHx8IHt9O1xyXG4gICAgaGVscGVycy5leHRlbmQoIHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvLCBwcm90byApO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoIF9pbml0aWFsICkge1xyXG5cclxuICAgIHZhciBLbGFzcyA9IEJhc2VNb2RlbC5leHRlbmQoIHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvIHx8IHt9ICk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBLbGFzcyggX2luaXRpYWwsIHRoaXMgKTtcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuICAgICAgcmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IF9oZWFkZXJzIDogc2VsZi5fX2hlYWRlcnM7XHJcbiAgICByZXR1cm4gaXMubm90LmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IHNlbGYuX19oZWFkZXJzIDogc2VsZjtcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuJGZpbmRPbmUgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICByZXN1bHQsXHJcbiAgICAgIHVybCA9IHNlbGYuJHVybCgpLFxyXG4gICAgICBtZXRob2QgPSAnZmluZE9uZScsXHJcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wXHJcbiAgICAgIHdhc0Rlc3Ryb3llZCA9IHNlbGYuX19kZXN0cm95ZWQ7XHJcblxyXG4gICAgc2VsZi5lbWl0KCAncHJlZmluZE9uZScsIHtcclxuICAgICAgbW9sZHk6IHNlbGYsXHJcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICBxdWVyeTogcXVlcnksXHJcbiAgICAgIHVybDogdXJsLFxyXG4gICAgICBjYWxsYmFjazogY2FsbGJhY2tcclxuICAgIH0gKTtcclxuXHJcbiAgICBzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5fX2FkYXB0ZXJbIHRoaXMuX19hZGFwdGVyTmFtZSBdLmZpbmRPbmUuY2FsbCggdGhpcywgX3F1ZXJ5LCBmdW5jdGlvbiAoIF9lcnJvciwgX3Jlc3BvbnNlICkge1xyXG4gICAgICBpZiAoIF9lcnJvciAmJiAhKCBfZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xyXG4gICAgICAgIF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggIV9lcnJvciApIHtcclxuICAgICAgICBpZiAoIGlzLmFycmF5KCBfcmVzcG9uc2UgKSApIHtcclxuICAgICAgICAgIHJlc3VsdCA9IHNlbGYuY3JlYXRlKCBfcmVzcG9uc2VbIDAgXSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBzZWxmLmNyZWF0ZSggX3Jlc3BvbnNlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLmVtaXQoICdmaW5kT25lJywgX2Vycm9yLCBfcmVzcG9uc2UgKTtcclxuXHJcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlc3VsdCApO1xyXG4gICAgfSApO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBiYXNlID0gaXMuZW1wdHkoIHNlbGYuJGJhc2VVcmwoKSApID8gJycgOiBzZWxmLiRiYXNlVXJsKCksXHJcbiAgICAgIG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcclxuICAgICAgdXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxyXG4gICAgICBlbmRwb2ludCA9IGJhc2UgKyBuYW1lICsgKCBpcy5lbXB0eSggdXJsICkgPyAnJyA6ICcvJyArIHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApICk7XHJcblxyXG4gICAgc2VsZi5fX3VybCA9IHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApO1xyXG5cclxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcclxuICB9O1xyXG5cclxuICBNb2xkeS5wcm90b3R5cGUuX19hZGFwdGVyID0gYWRhcHRlcjtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRiYXNlVXJsID0gZnVuY3Rpb24gKCBfYmFzZSApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgdXJsID0gY2FzdCggX2Jhc2UsICdzdHJpbmcnLCBzZWxmLl9fYmFzZVVybCB8fCAnJyApO1xyXG5cclxuICAgIHNlbGYuX19iYXNlVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvKFxcL3xcXHMpKyQvZywgJycgKSB8fCBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsIHx8ICcnO1xyXG5cclxuICAgIHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF9iYXNlICkgPyBzZWxmLl9fYmFzZVVybCA6IHNlbGY7XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRmaW5kID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcyxcclxuICAgICAgdXJsID0gc2VsZi4kdXJsKCksXHJcbiAgICAgIG1ldGhvZCA9ICdmaW5kJyxcclxuICAgICAgcmVzdWx0ID0gW10sXHJcbiAgICAgIHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG4gICAgICBjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuICAgIHNlbGYuZW1pdCggJ3ByZWZpbmQnLCB7XHJcbiAgICAgIG1vbGR5OiBzZWxmLFxyXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcclxuICAgICAgcXVlcnk6IHF1ZXJ5LFxyXG4gICAgICB1cmw6IHVybCxcclxuICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXHJcbiAgICB9ICk7XHJcblxyXG4gICAgdGhpcy5fX2FkYXB0ZXJbIHRoaXMuX19hZGFwdGVyTmFtZSBdLmZpbmQuY2FsbCggdGhpcywgX3F1ZXJ5LCBmdW5jdGlvbiAoIF9lcnJvciwgcmVzICkge1xyXG5cclxuICAgICAgaWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgX2Vycm9yICkgKSB7XHJcbiAgICAgICAgX2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBpcy5hcnJheSggcmVzICkgKSB7XHJcbiAgICAgICAgcmVzLmZvckVhY2goIGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcbiAgICAgICAgICByZXN1bHQucHVzaCggc2VsZi5jcmVhdGUoIF9kYXRhICkgKTtcclxuICAgICAgICB9ICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goIHNlbGYuY3JlYXRlKCBfZGF0YSApICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciByZXMgPSBjYXN0KCByZXN1bHQgaW5zdGFuY2VvZiBCYXNlTW9kZWwgfHwgaXMuYW4uYXJyYXkoIHJlc3VsdCApID8gcmVzdWx0IDogbnVsbCwgJ2FycmF5JywgW10gKTtcclxuXHJcbiAgICAgIHNlbGYuZW1pdCggJ2ZpbmQnLCBfZXJyb3IsIHJlcyApO1xyXG5cclxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soIF9lcnJvciwgcmVzICk7XHJcblxyXG4gICAgfSApO1xyXG4gIH07XHJcblxyXG4gIE1vbGR5LnByb3RvdHlwZS4kZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAoIG9iaiwga2V5LCB2YWx1ZSApIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgIGV4aXN0aW5nVmFsdWUgPSBvYmpbIGtleSBdIHx8IHZhbHVlLFxyXG4gICAgICBtZXRhZGF0YSA9IHRoaXMuX19tZXRhZGF0YVsga2V5IF07XHJcblxyXG4gICAgaWYgKCAhb2JqLmhhc093blByb3BlcnR5KCBrZXkgKSB8fCAhb2JqLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgKSB7XHJcbiAgICAgIGlmICggbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlNb2xkeSB8fCBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheVN0cmluZyApIHtcclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgPSBtZXRhZGF0YS52YWx1ZTtcclxuICAgICAgICBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5TW9sZHk7XHJcbiAgICAgICAgbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlTdHJpbmc7XHJcbiAgICAgICAgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuICAgICAgfSBlbHNlIGlmICggbWV0YWRhdGEudmFsdWVJc0FTdGF0aWNNb2xkeSApIHtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IG5ldyBNb2xkeSggbWV0YWRhdGEudmFsdWUubmFtZSwgbWV0YWRhdGEudmFsdWUgKS5jcmVhdGUoKSxcclxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgfSApO1xyXG5cclxuICAgICAgICBvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICkge1xyXG5cclxuICAgICAgICB2YXIgYXJyYXkgPSBvYnNlcnZhYmxlQXJyYXkoIFtdICksXHJcbiAgICAgICAgICBhdHRyaWJ1dGVUeXBlID0gbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nIHx8IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID8gbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlWyAwIF0gOiAnKic7XHJcblxyXG4gICAgICAgIG1ldGFkYXRhLmF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG4gICAgICAgICAgdmFsdWU6IGFycmF5LFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuICAgICAgICBbICdwdXNoJywgJ3Vuc2hpZnQnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xyXG4gICAgICAgICAgYXJyYXkub24oIF9tZXRob2QsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXHJcbiAgICAgICAgICAgICAgdmFsdWVzID0gW107XHJcbiAgICAgICAgICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuICAgICAgICAgICAgICBpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vbGR5ID0gbmV3IE1vbGR5KCBhdHRyaWJ1dGVUeXBlWyAnbmFtZScgXSwgYXR0cmlidXRlVHlwZSApLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhID0gaXMuYW4ub2JqZWN0KCBfaXRlbSApID8gX2l0ZW0gOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaCggbW9sZHkuY3JlYXRlKCBkYXRhICkgKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goIGNhc3QoIF9pdGVtLCBhdHRyaWJ1dGVUeXBlLCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIHZhbHVlcyApO1xyXG4gICAgICAgICAgfSApO1xyXG4gICAgICAgIH0gKTtcclxuXHJcbiAgICAgICAgaWYgKCBleGlzdGluZ1ZhbHVlICYmIGV4aXN0aW5nVmFsdWUubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgIGV4aXN0aW5nVmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBvICkge1xyXG4gICAgICAgICAgICBvYmpbIGtleSBdLnB1c2goIG8gKTtcclxuICAgICAgICAgIH0gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuICAgICAgICAgIGdldDogaGVscGVycy5nZXRQcm9wZXJ0eSgga2V5ICksXHJcbiAgICAgICAgICBzZXQ6IGhlbHBlcnMuc2V0UHJvcGVydHkoIGtleSApLFxyXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgb2JqLl9fYXR0cmlidXRlc1sga2V5IF0gPSBtZXRhZGF0YS5hdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICggZXhpc3RpbmdWYWx1ZSAhPT0gdm9pZCAwICkgeyAvL2lmIGV4aXN0aW5nIHZhbHVlXHJcbiAgICAgIG9ialsga2V5IF0gPSBleGlzdGluZ1ZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSAmJiBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICkge1xyXG4gICAgICBvYmpbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XHJcbiAgICB9IGVsc2UgaWYgKCBpcy5lbXB0eSggb2JqWyBrZXkgXSApICYmIG1ldGFkYXRhLmF0dHJpYnV0ZXMub3B0aW9uYWwgPT09IGZhbHNlICkge1xyXG4gICAgICBpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgfHwgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcclxuICAgICAgICBvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2JqLl9fZGF0YVsga2V5IF0gPSBpcy5lbXB0eSggbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlICkgPyB1bmRlZmluZWQgOiBjYXN0KCB1bmRlZmluZWQsIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgTW9sZHkucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICBhdHRyaWJ1dGVzID0gbmV3IGhlbHBlcnMuYXR0cmlidXRlcyggX2tleSwgX3ZhbHVlICksXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgPSBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlICkgJiYgL21vbGR5Ly50ZXN0KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuICAgICAgYXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IGlzLmFuLmFycmF5KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuICAgICAgdmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5U3RyaW5nID0gaXMuYW4uYXJyYXkoIF92YWx1ZSApICYmIGlzLmEuc3RyaW5nKCBfdmFsdWVbIDAgXSApLFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgJiYgaGFzS2V5KCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcclxuICAgICAgdmFsdWVJc0FTdGF0aWNNb2xkeSA9IGhhc0tleSggX3ZhbHVlLCAncHJvcGVydGllcycsICdvYmplY3QnICk7XHJcblxyXG4gICAgc2VsZi5fX21ldGFkYXRhWyBfa2V5IF0gPSB7XHJcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcbiAgICAgIHZhbHVlOiBfdmFsdWUsXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHk6IGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHksXHJcbiAgICAgIGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXk6IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5TW9sZHk6IHZhbHVlSXNBbkFycmF5TW9sZHksXHJcbiAgICAgIHZhbHVlSXNBbkFycmF5U3RyaW5nOiB2YWx1ZUlzQW5BcnJheVN0cmluZyxcclxuICAgICAgYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHk6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5LFxyXG4gICAgICBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmc6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyxcclxuICAgICAgdmFsdWVJc0FTdGF0aWNNb2xkeTogdmFsdWVJc0FTdGF0aWNNb2xkeVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gc2VsZjtcclxuICB9O1xyXG5cclxuICBlbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcclxuXHJcbiAgcmV0dXJuIE1vbGR5O1xyXG5cclxufTsiXX0=
(17)
});
