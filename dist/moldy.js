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
    castType = _castType.toLowerCase(),
    value,
    values = is.an.array( _values ) ? _values : [],
    alreadyCorrectlyTyped;

  switch ( true ) {
  case ( /float|integer/.test( castType ) ):
    castType = "number";
    break;
  }

  if ( is.a.hasOwnProperty( castType ) ) {
    alreadyCorrectlyTyped = is.a[ castType ]( _value );
  } else if ( castType === '*' ) {
    alreadyCorrectlyTyped = true;
  }

  if ( alreadyCorrectlyTyped ) {

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

    case ( castType === "date" || castType === "datetime" ):

      try {

        value = new Date( _value );

        value = isNaN( value.getTime() ) ? undefined : value;
      } catch ( e ) {}

      break;

    case castType === "string":
      if ( is.a.string( _value ) ) {
        value = _value
      }

      if ( is.a.boolean( _value ) || is.a.number( _value ) ) {
        value = _value.toString();
      }

      break;

    case castType === "number":

      try {

        if ( is.a.array( _value ) || is.a.guid( _value ) ) {
          throw "wrong number";
        }

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
          value = parseInt( value, 10 );
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

  return alreadyCorrectlyTyped || is.not.undefined( value ) ? value : is.not.undefined( _default ) ? _default : null;

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
			values = Array.isArray( attributes[ 'values' ] ) ? attributes[ 'values' ] : [],
			value = attributes.type ? cast( _value, attributes.type, attributes[ 'default' ], values ) : _value;

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

var _extend = function ( obj ) {
	Array.prototype.slice.call( arguments, 1 ).forEach( function ( source ) {
		if ( source ) {
			for ( var prop in source ) {
				obj[ prop ] = source[ prop ];
			}
		}
	} );

	return obj;
};

exports.extend = _extend;

exports.extendObject = function ( protoProps, staticProps ) {
	var parent = this;
	var child;

	if ( protoProps && Object.prototype.hasOwnProperty.call( protoProps, 'constructor' ) ) {
		child = protoProps.constructor;
	} else {
		child = function () {
			return parent.apply( this, arguments );
		};
	}

	_extend( child, parent, staticProps );

	var Surrogate = function () {
		this.constructor = child;
	};

	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;

	if ( protoProps ) _extend( child.prototype, protoProps );

	child.__super__ = parent.prototype;

	return child;
};
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],19:[function(_dereq_,module,exports){
var cast = _dereq_( 'sc-cast' ),
	emitter = _dereq_( 'emitter-component' ),
	guid = _dereq_( 'sc-guid' ),
	hasKey = _dereq_( 'sc-haskey' ),
	helpers = _dereq_( './helpers' ),
	is = _dereq_( 'sc-is' ),
	extend = helpers.extendObject;

var Model = function ( _initial, _moldy ) {
	var self = this,
		initial = _initial || {};

	this.__moldy = _moldy;
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

Model.prototype.$data = function ( _data, _options ) {
	var self = this,
		data = is.object( _data ) ? _data : {},
		options = helpers.extend( {
			mergeArrayOfAType: true
		}, _options );

	if ( self.__destroyed ) {
		return helpers.destroyedError( self );
	}

	Object.keys( data ).forEach( function ( _key ) {
		if ( self.__attributes.hasOwnProperty( _key ) ) {
			if ( is.an.array( data[ _key ] ) && hasKey( self.__attributes[ _key ], 'arrayOfAType', 'boolean' ) && self.__attributes[ _key ].arrayOfAType === true ) {
				if ( options.mergeArrayOfAType !== true ) {
					while ( self[ _key ].length ) self[ _key ].shift();
				}
				data[ _key ].forEach( function ( _moldy ) {
					self[ _key ].push( _moldy );
				} );
			} else if ( is.a.object( data[ _key ] ) && self[ _key ] instanceof Model ) {
				self[ _key ].$data( data[ _key ], _options );
			} else {
				self[ _key ] = data[ _key ];
			}
		}
	} );

	return self;
};


Model.prototype.$destroy = function ( _callback ) {
	var self = this,
		eguid = guid.generate(),
		isDirty = self.$isDirty(),
		data = self.$json(),
		method = 'delete',
		callback = is.a.func( _callback ) ? _callback : helpers.noop;

	if ( self.__destroyed ) {
		return callback.apply( self, [ helpers.destroyedError( self ) ] );
	}

	self.__moldy.emit( 'busy', eguid );
	self.emit( 'predestroy', {
		moldy: self,
		data: data,
		method: method,
		callback: callback
	} );

	if ( !isDirty ) {
		self.__moldy.__adapter[ self.__moldy.__adapterName ].destroy.call( self.__moldy, self.$json(), function ( _error, _res ) {

			if ( _error && !( _error instanceof Error ) ) {
				_error = new Error( 'An unknown error occurred' );
			}

			self.__moldy.emit( 'busy:done', eguid );
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
		} else if ( is.a.date( data[ _key ] ) ) {
			json[ _key ] = data[ _key ].toISOString();
		} else {
			json[ _key ] = data[ _key ] instanceof Model ? data[ _key ].$json() : data[ _key ];
		}
	} );

	return json;
};

Model.prototype.$save = function ( _callback ) {
	var self = this,
		error = null,
		eguid = guid.generate(),
		isDirty = self.$isDirty(),
		data = self.$json(),
		method = isDirty ? 'create' : 'save',
		callback = is.a.func( _callback ) ? _callback : helpers.noop;

	self.__destroyed = false;

	self.__moldy.emit( 'busy', eguid );
	self.emit( 'presave', {
		moldy: self,
		data: data,
		method: method,
		callback: callback
	} );

	var responseShouldContainAnId = hasKey( data, self.__key ) && is.not.empty( data[ self.__key ] );

	self.__moldy.__adapter[ self.__moldy.__adapterName ][ method ].call( self.__moldy, data, function ( _error, _res ) {

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
			self.$data( _res, {
				mergeArrayOfAType: false
			} );
		}

		self.emit( 'save', _error, self );
		self.__moldy.emit( 'busy:done', eguid );

		callback && callback( _error, self );
	} );
};

emitter( Model.prototype );

Model.extend = extend;

exports = module.exports = Model;
},{"./helpers":18,"emitter-component":1,"sc-cast":2,"sc-guid":4,"sc-haskey":5,"sc-is":7}],20:[function(_dereq_,module,exports){
var helpers = _dereq_( "./helpers/index" ),
	emitter = _dereq_( 'emitter-component' ),
	guid = _dereq_( 'sc-guid' ),
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
				value: _name || properties[ 'name' ] || '',
				writable: true
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

	};

	Moldy.prototype.schema = function ( schema ) {

		Object.keys( cast( schema, 'object', {} ) ).forEach( function ( _key ) {
			self.$property( _key, schema[ _key ] );
		} );

		return this;
	};

	Moldy.prototype.adapter = function ( adapter ) {

		if ( !adapter || !this.__adapter[ adapter ] ) {
			throw new Error( "Provide a valid adpater " );
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
			eguid = guid.generate(),
			result,
			url = self.$url(),
			method = 'findOne',
			query = is.an.object( _query ) ? _query : {},
			callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop,
			wasDestroyed = self.__destroyed;

		self.emit( 'busy', eguid )
		self.emit( 'prefindOne', {
			moldy: self,
			method: method,
			query: query,
			url: url,
			callback: callback
		} );

		self.__destroyed = false;

		self.__adapter[ self.__adapterName ].findOne.call( self, query, function ( _error, _res ) {
			if ( _error && !( _error instanceof Error ) ) {
				_error = new Error( 'An unknown error occurred' );
			}

			if ( is.empty( _res ) ) {
				result = undefined;
			} else {
				if ( is.array( _res ) ) {
					result = self.create( _res[ 0 ] );
				} else {
					result = self.create( _res );
				}
			}

			self.emit( 'busy:done', eguid );
			self.emit( 'findOne', _error, result );

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
			eguid = guid.generate(),
			url = self.$url(),
			method = 'find',
			result = [],
			query = is.an.object( _query ) ? _query : {},
			callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop;

		self.emit( 'busy', eguid );
		self.emit( 'prefind', {
			moldy: self,
			method: method,
			query: query,
			url: url,
			callback: callback
		} );

		self.__adapter[ self.__adapterName ].find.call( self, query, function ( _error, _res ) {

			if ( _error && !( _error instanceof _error ) ) {
				_error = new Error( 'An unknown error occurred' );
			}

			if ( is.array( _res ) ) {
				_res.forEach( function ( _data ) {
					result.push( self.create( _data ) );
				} );
			} else {
				result.push( self.create( _data ) );
			}

			var res = cast( result instanceof BaseModel || is.an.array( result ) ? result : null, 'array', [] );
			self.emit( 'busy:done', eguid );
			self.emit( 'find', _error, res );

			callback && callback( _error, res );

		} );
	};

	Moldy.prototype.$defineProperty = function ( obj, key, value ) {

		var self = this,
			existingValue = obj[ key ] || value,
			metadata = self.__metadata[ key ];

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
					value: new Moldy( metadata.value.name, metadata.value ).create( existingValue ),
					enumerable: true
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
},{"./helpers/index":18,"emitter-component":1,"sc-cast":2,"sc-guid":4,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sg-observable-array":15}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2RhdmlkL1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9ub2RlX21vZHVsZXMvc2MtY29udGFpbnMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaGFza2V5L25vZGVfbW9kdWxlcy90eXBlLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZW1wdHkuanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZ3VpZC5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvdHlwZS5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvdHlwZS5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NnLW9ic2VydmFibGUtYXJyYXkvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkL1NpdGVzL21vbGR5L3NyYy9jb25maWcuanNvbiIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9zcmMvZmFrZV84YjRiMDI1OS5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9zcmMvaGVscGVycy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZC9TaXRlcy9tb2xkeS9zcmMvbW9kZWwuanMiLCIvVXNlcnMvZGF2aWQvU2l0ZXMvbW9sZHkvc3JjL21vbGR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufTtcblxuLyoqXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gICh0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXSlcbiAgICAucHVzaChmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGZ1bmN0aW9uIG9uKCkge1xuICAgIHNlbGYub2ZmKGV2ZW50LCBvbik7XG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIG9uLmZuID0gZm47XG4gIHRoaXMub24oZXZlbnQsIG9uKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgLy8gYWxsXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XG5cbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2I7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2IgPSBjYWxsYmFja3NbaV07XG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtNaXhlZH0gLi4uXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG5cbiAgaWYgKGNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xufTtcbiIsInZhciBjb250YWlucyA9IHJlcXVpcmUoIFwic2MtY29udGFpbnNcIiApLFxuICBpcyA9IHJlcXVpcmUoIFwic2MtaXNcIiApO1xuXG52YXIgY2FzdCA9IGZ1bmN0aW9uICggX3ZhbHVlLCBfY2FzdFR5cGUsIF9kZWZhdWx0LCBfdmFsdWVzLCBfYWRkaXRpb25hbFByb3BlcnRpZXMgKSB7XG5cbiAgdmFyIHBhcnNlZFZhbHVlLFxuICAgIGNhc3RUeXBlID0gX2Nhc3RUeXBlLnRvTG93ZXJDYXNlKCksXG4gICAgdmFsdWUsXG4gICAgdmFsdWVzID0gaXMuYW4uYXJyYXkoIF92YWx1ZXMgKSA/IF92YWx1ZXMgOiBbXSxcbiAgICBhbHJlYWR5Q29ycmVjdGx5VHlwZWQ7XG5cbiAgc3dpdGNoICggdHJ1ZSApIHtcbiAgY2FzZSAoIC9mbG9hdHxpbnRlZ2VyLy50ZXN0KCBjYXN0VHlwZSApICk6XG4gICAgY2FzdFR5cGUgPSBcIm51bWJlclwiO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKCBpcy5hLmhhc093blByb3BlcnR5KCBjYXN0VHlwZSApICkge1xuICAgIGFscmVhZHlDb3JyZWN0bHlUeXBlZCA9IGlzLmFbIGNhc3RUeXBlIF0oIF92YWx1ZSApO1xuICB9IGVsc2UgaWYgKCBjYXN0VHlwZSA9PT0gJyonICkge1xuICAgIGFscmVhZHlDb3JyZWN0bHlUeXBlZCA9IHRydWU7XG4gIH1cblxuICBpZiAoIGFscmVhZHlDb3JyZWN0bHlUeXBlZCApIHtcblxuICAgIHZhbHVlID0gX3ZhbHVlO1xuXG4gIH0gZWxzZSB7XG5cbiAgICBzd2l0Y2ggKCB0cnVlICkge1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJhcnJheVwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UoIF92YWx1ZSApO1xuICAgICAgICB9XG4gICAgICAgIGlmICggaXMubm90LmFuLmFycmF5KCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBpZiAoIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gWyBfdmFsdWUgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImJvb2xlYW5cIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSAvXih0cnVlfDF8eXx5ZXMpJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyB0cnVlIDogdW5kZWZpbmVkO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBpZiAoIGlzLm5vdC5hLmJvb2xlYW4oIHZhbHVlICkgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IC9eKGZhbHNlfC0xfDB8bnxubykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBpcy5hLmJvb2xlYW4oIHZhbHVlICkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICggY2FzdFR5cGUgPT09IFwiZGF0ZVwiIHx8IGNhc3RUeXBlID09PSBcImRhdGV0aW1lXCIgKTpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IG5ldyBEYXRlKCBfdmFsdWUgKTtcblxuICAgICAgICB2YWx1ZSA9IGlzTmFOKCB2YWx1ZS5nZXRUaW1lKCkgKSA/IHVuZGVmaW5lZCA6IHZhbHVlO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwic3RyaW5nXCI6XG4gICAgICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcbiAgICAgICAgdmFsdWUgPSBfdmFsdWVcbiAgICAgIH1cblxuICAgICAgaWYgKCBpcy5hLmJvb2xlYW4oIF92YWx1ZSApIHx8IGlzLmEubnVtYmVyKCBfdmFsdWUgKSApIHtcbiAgICAgICAgdmFsdWUgPSBfdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcIm51bWJlclwiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIGlmICggaXMuYS5hcnJheSggX3ZhbHVlICkgfHwgaXMuYS5ndWlkKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIndyb25nIG51bWJlclwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBfdmFsdWUgKTtcblxuICAgICAgICBpZiAoIGlzLm5vdC5hLm51bWJlciggdmFsdWUgKSB8fCBpc05hTiggdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgICAgY2FzZSBfY2FzdFR5cGUgPT09IFwiaW50ZWdlclwiOlxuICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoIHZhbHVlLCAxMCApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBjYXN0KCBKU09OLnBhcnNlKCBfdmFsdWUgKSwgY2FzdFR5cGUgKVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIH1cblxuICB9XG5cbiAgaWYgKCB2YWx1ZXMubGVuZ3RoID4gMCAmJiAhY29udGFpbnMoIHZhbHVlcywgdmFsdWUgKSApIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1sgMCBdO1xuICB9XG5cbiAgcmV0dXJuIGFscmVhZHlDb3JyZWN0bHlUeXBlZCB8fCBpcy5ub3QudW5kZWZpbmVkKCB2YWx1ZSApID8gdmFsdWUgOiBpcy5ub3QudW5kZWZpbmVkKCBfZGVmYXVsdCApID8gX2RlZmF1bHQgOiBudWxsO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3Q7IiwidmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gKCBkYXRhLCBpdGVtICkge1xuICB2YXIgZm91bmRPbmUgPSBmYWxzZTtcblxuICBpZiAoIEFycmF5LmlzQXJyYXkoIGRhdGEgKSApIHtcblxuICAgIGRhdGEuZm9yRWFjaCggZnVuY3Rpb24gKCBhcnJheUl0ZW0gKSB7XG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBpdGVtID09PSBhcnJheUl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSBlbHNlIGlmICggT2JqZWN0KCBkYXRhICkgPT09IGRhdGEgKSB7XG5cbiAgICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBkYXRhWyBrZXkgXSA9PT0gaXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgfSApO1xuXG4gIH1cbiAgcmV0dXJuIGZvdW5kT25lO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCJ2YXIgZ3VpZFJ4ID0gXCJ7P1swLTlBLUZhLWZdezh9LVswLTlBLUZhLWZdezR9LTRbMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXs0fS1bMC05QS1GYS1mXXsxMn19P1wiO1xuXG5leHBvcnRzLmdlbmVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB2YXIgZ3VpZCA9IFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSggL1t4eV0vZywgZnVuY3Rpb24gKCBjICkge1xuICAgIHZhciByID0gKCBkICsgTWF0aC5yYW5kb20oKSAqIDE2ICkgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuICAgIHJldHVybiAoIGMgPT09IFwieFwiID8gciA6ICggciAmIDB4NyB8IDB4OCApICkudG9TdHJpbmcoIDE2ICk7XG4gIH0gKTtcbiAgcmV0dXJuIGd1aWQ7XG59O1xuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKCBzdHJpbmcgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCwgXCJnXCIgKSxcbiAgICBtYXRjaGVzID0gKCB0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiID8gc3RyaW5nIDogXCJcIiApLm1hdGNoKCByeCApO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbWF0Y2hlcyApID8gbWF0Y2hlcyA6IFtdO1xufTtcblxuZXhwb3J0cy5pc1ZhbGlkID0gZnVuY3Rpb24gKCBndWlkICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUnggKTtcbiAgcmV0dXJuIHJ4LnRlc3QoIGd1aWQgKTtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKSxcbiAgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAgb2JqZWN0ID0gdHlwZSggb2JqZWN0ICkgPT09IFwib2JqZWN0XCIgPyBvYmplY3QgOiB7fSwga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJhcnJheVwiID8ga2V5cyA6IFtdO1xuICBrZXlUeXBlID0gdHlwZSgga2V5VHlwZSApID09PSBcInN0cmluZ1wiID8ga2V5VHlwZSA6IFwiXCI7XG5cbiAgdmFyIGtleSA9IGtleXMubGVuZ3RoID4gMCA/IGtleXMuc2hpZnQoKSA6IFwiXCIsXG4gICAga2V5RXhpc3RzID0gaGFzLmNhbGwoIG9iamVjdCwga2V5ICkgfHwgb2JqZWN0WyBrZXkgXSAhPT0gdm9pZCAwLFxuICAgIGtleVZhbHVlID0ga2V5RXhpc3RzID8gb2JqZWN0WyBrZXkgXSA6IHVuZGVmaW5lZCxcbiAgICBrZXlUeXBlSXNDb3JyZWN0ID0gdHlwZSgga2V5VmFsdWUgKSA9PT0ga2V5VHlwZTtcblxuICBpZiAoIGtleXMubGVuZ3RoID4gMCAmJiBrZXlFeGlzdHMgKSB7XG4gICAgcmV0dXJuIGhhc0tleSggb2JqZWN0WyBrZXkgXSwga2V5cywga2V5VHlwZSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXMubGVuZ3RoID4gMCB8fCBrZXlUeXBlID09PSBcIlwiID8ga2V5RXhpc3RzIDoga2V5RXhpc3RzICYmIGtleVR5cGVJc0NvcnJlY3Q7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBrZXlzID0gdHlwZSgga2V5cyApID09PSBcInN0cmluZ1wiID8ga2V5cy5zcGxpdCggXCIuXCIgKSA6IFtdO1xuXG4gIHJldHVybiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApO1xuXG59OyIsIlxuLyoqXG4gKiB0b1N0cmluZyByZWYuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHR5cGUgb2YgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsKXtcbiAgc3dpdGNoICh0b1N0cmluZy5jYWxsKHZhbCkpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6IHJldHVybiAnZnVuY3Rpb24nO1xuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnO1xuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJztcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCc7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsID09PSBPYmplY3QodmFsKSkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTtcbiIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuL2lzZXMvdHlwZVwiICksXG4gIGlzID0ge1xuICAgIGE6IHt9LFxuICAgIGFuOiB7fSxcbiAgICBub3Q6IHtcbiAgICAgIGE6IHt9LFxuICAgICAgYW46IHt9XG4gICAgfVxuICB9O1xuXG52YXIgaXNlcyA9IHtcbiAgXCJhcmd1bWVudHNcIjogWyBcImFyZ3VtZW50c1wiLCB0eXBlKCBcImFyZ3VtZW50c1wiICkgXSxcbiAgXCJhcnJheVwiOiBbIFwiYXJyYXlcIiwgdHlwZSggXCJhcnJheVwiICkgXSxcbiAgXCJib29sZWFuXCI6IFsgXCJib29sZWFuXCIsIHR5cGUoIFwiYm9vbGVhblwiICkgXSxcbiAgXCJkYXRlXCI6IFsgXCJkYXRlXCIsIHR5cGUoIFwiZGF0ZVwiICkgXSxcbiAgXCJmdW5jdGlvblwiOiBbIFwiZnVuY3Rpb25cIiwgXCJmdW5jXCIsIFwiZm5cIiwgdHlwZSggXCJmdW5jdGlvblwiICkgXSxcbiAgXCJudWxsXCI6IFsgXCJudWxsXCIsIHR5cGUoIFwibnVsbFwiICkgXSxcbiAgXCJudW1iZXJcIjogWyBcIm51bWJlclwiLCBcImludGVnZXJcIiwgXCJpbnRcIiwgdHlwZSggXCJudW1iZXJcIiApIF0sXG4gIFwib2JqZWN0XCI6IFsgXCJvYmplY3RcIiwgdHlwZSggXCJvYmplY3RcIiApIF0sXG4gIFwicmVnZXhwXCI6IFsgXCJyZWdleHBcIiwgdHlwZSggXCJyZWdleHBcIiApIF0sXG4gIFwic3RyaW5nXCI6IFsgXCJzdHJpbmdcIiwgdHlwZSggXCJzdHJpbmdcIiApIF0sXG4gIFwidW5kZWZpbmVkXCI6IFsgXCJ1bmRlZmluZWRcIiwgdHlwZSggXCJ1bmRlZmluZWRcIiApIF0sXG4gIFwiZW1wdHlcIjogWyBcImVtcHR5XCIsIHJlcXVpcmUoIFwiLi9pc2VzL2VtcHR5XCIgKSBdLFxuICBcIm51bGxvcnVuZGVmaW5lZFwiOiBbIFwibnVsbE9yVW5kZWZpbmVkXCIsIFwibnVsbG9ydW5kZWZpbmVkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL251bGxvcnVuZGVmaW5lZFwiICkgXSxcbiAgXCJndWlkXCI6IFsgXCJndWlkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL2d1aWRcIiApIF1cbn1cblxuT2JqZWN0LmtleXMoIGlzZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICB2YXIgbWV0aG9kcyA9IGlzZXNbIGtleSBdLnNsaWNlKCAwLCBpc2VzWyBrZXkgXS5sZW5ndGggLSAxICksXG4gICAgZm4gPSBpc2VzWyBrZXkgXVsgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSBdO1xuXG4gIG1ldGhvZHMuZm9yRWFjaCggZnVuY3Rpb24gKCBtZXRob2RLZXkgKSB7XG4gICAgaXNbIG1ldGhvZEtleSBdID0gaXMuYVsgbWV0aG9kS2V5IF0gPSBpcy5hblsgbWV0aG9kS2V5IF0gPSBmbjtcbiAgICBpcy5ub3RbIG1ldGhvZEtleSBdID0gaXMubm90LmFbIG1ldGhvZEtleSBdID0gaXMubm90LmFuWyBtZXRob2RLZXkgXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICkgPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuICB9ICk7XG5cbn0gKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gaXM7XG5leHBvcnRzLnR5cGUgPSB0eXBlOyIsInZhciB0eXBlID0gcmVxdWlyZShcIi4uL3R5cGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bGxcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIGVtcHR5ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICBlbXB0eSA9IE9iamVjdC5rZXlzKCB2YWx1ZSApLmxlbmd0aCA9PT0gMDtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJib29sZWFuXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVtYmVyXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gLTE7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYXJyYXlcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInN0cmluZ1wiICkge1xuICAgIGVtcHR5ID0gdmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcmV0dXJuIGVtcHR5O1xuXG59OyIsInZhciBndWlkID0gcmVxdWlyZSggXCJzYy1ndWlkXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICByZXR1cm4gZ3VpZC5pc1ZhbGlkKCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG5cdHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSB2b2lkIDA7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuLi90eXBlXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF90eXBlICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG4gICAgcmV0dXJuIHR5cGUoIF92YWx1ZSApID09PSBfdHlwZTtcbiAgfVxufSIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWwgKSB7XG4gIHN3aXRjaCAoIHRvU3RyaW5nLmNhbGwoIHZhbCApICkge1xuICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgcmV0dXJuICdmdW5jdGlvbic7XG4gIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgIHJldHVybiAnZGF0ZSc7XG4gIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgcmV0dXJuICdyZWdleHAnO1xuICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOlxuICAgIHJldHVybiAnYXJndW1lbnRzJztcbiAgY2FzZSAnW29iamVjdCBBcnJheV0nOlxuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKCB2YWwgPT09IG51bGwgKSByZXR1cm4gJ251bGwnO1xuICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAoIHZhbCA9PT0gT2JqZWN0KCB2YWwgKSApIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIGRlZXAgPSB0eXBlKCBhcmdzWyAwIF0gKSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnNoaWZ0KCkgOiBmYWxzZSxcbiAgICBvYmplY3RzID0gYXJncyxcbiAgICByZXN1bHQgPSB7fTtcblxuICBvYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uICggb2JqZWN0biApIHtcblxuICAgIGlmICggdHlwZSggb2JqZWN0biApICE9PSBcIm9iamVjdFwiICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKCBvYmplY3RuICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICBpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0biwga2V5ICkgKSB7XG4gICAgICAgIGlmICggZGVlcCAmJiB0eXBlKCBvYmplY3RuWyBrZXkgXSApID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBtZXJnZSggZGVlcCwge30sIHJlc3VsdFsga2V5IF0sIG9iamVjdG5bIGtleSBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG9iamVjdG5bIGtleSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTsiLCJ2YXIgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKCBfYXJyYXkgKSB7XG5cdHZhciBoYW5kbGVycyA9IHt9LFxuXHRcdGFycmF5ID0gQXJyYXkuaXNBcnJheSggX2FycmF5ICkgPyBfYXJyYXkgOiBbXTtcblxuXHR2YXIgcHJveHkgPSBmdW5jdGlvbiAoIF9tZXRob2QsIF92YWx1ZSApIHtcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblxuXHRcdGlmICggaGFuZGxlcnNbIF9tZXRob2QgXSApIHtcblx0XHRcdHJldHVybiBoYW5kbGVyc1sgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fVxuXHR9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwge1xuXHRcdG9uOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfZXZlbnQsIF9jYWxsYmFjayApIHtcblx0XHRcdFx0aGFuZGxlcnNbIF9ldmVudCBdID0gX2NhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdwb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3BvcCcsIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19wb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdzaGlmdCcsIGFycmF5WyAwIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19zaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdFsgJ3B1c2gnLCAncmV2ZXJzZScsICd1bnNoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IHt9O1xuXG5cdFx0cHJvcGVydGllc1sgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IHByb3h5LmJpbmQoIG51bGwsIF9tZXRob2QgKVxuXHRcdH07XG5cblx0XHRwcm9wZXJ0aWVzWyAnX18nICsgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCBwcm9wZXJ0aWVzICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmFibGVBcnJheTsiLCJtb2R1bGUuZXhwb3J0cz17XHJcblx0XCJkZWZhdWx0c1wiOiB7XHJcblx0XHRcImJhc2VVcmxcIjogXCJcIixcclxuXHRcdFwiaGVhZGVyc1wiOiB7fVxyXG5cdH1cclxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCAnLi9jb25maWcuanNvbicgKSxcclxuICBtb2xkeUFwaSA9IHtcclxuICAgIGFkYXB0ZXJzOiB7XHJcbiAgICAgIF9fZGVmYXVsdDogdm9pZCAwXHJcbiAgICB9LFxyXG4gICAgdXNlOiBmdW5jdGlvbiAoIGFkYXB0ZXIgKSB7XHJcbiAgICAgIGlmKCAhYWRhcHRlciB8fCAhYWRhcHRlci5uYW1lIHx8ICFhZGFwdGVyLmNyZWF0ZSB8fCAhYWRhcHRlci5maW5kIHx8ICFhZGFwdGVyLmZpbmRPbmUgfHwgIWFkYXB0ZXIuc2F2ZSB8fCAhYWRhcHRlci5kZXN0cm95ICkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ0ludmFsaWQgQWRhcHRlcicgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoICF0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCApIHtcclxuICAgICAgICB0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCA9IGFkYXB0ZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYWRhcHRlcnNbIGFkYXB0ZXIubmFtZSBdID0gYWRhcHRlcjtcclxuICAgIH1cclxuICB9O1xyXG5cclxudmFyIE1vZGVsRmFjdG9yeSA9IHJlcXVpcmUoICcuL21vbGR5JyApKCByZXF1aXJlKCAnLi9tb2RlbCcgKSwgY29uZmlnLmRlZmF1bHRzLCBtb2xkeUFwaS5hZGFwdGVycyApO1xyXG5cclxubW9sZHlBcGkuZXh0ZW5kID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcbiAgcmV0dXJuIG5ldyBNb2RlbEZhY3RvcnkoIF9uYW1lLCBfcHJvcGVydGllcyApO1xyXG59O1xyXG5cclxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbW9sZHlBcGk7XHJcbmV4cG9ydHMuZGVmYXVsdHMgPSBjb25maWcuZGVmYXVsdHM7IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG5cdGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuXHRtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKTtcclxuXHJcbmV4cG9ydHMuYXR0cmlidXRlcyA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG5cdHZhciB2YWx1ZTtcclxuXHJcblx0aWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XHJcblx0XHR2YWx1ZSA9IHtcclxuXHRcdFx0dHlwZTogX3ZhbHVlXHJcblx0XHR9O1xyXG5cdH0gZWxzZSBpZiAoIGlzLmFuLm9iamVjdCggX3ZhbHVlICkgJiYgX3ZhbHVlWyAnX19pc01vbGR5JyBdID09PSB0cnVlICkge1xyXG5cdFx0dmFsdWUgPSB7XHJcblx0XHRcdHR5cGU6ICdtb2xkeScsXHJcblx0XHRcdGRlZmF1bHQ6IF92YWx1ZVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHR2YWx1ZSA9IF92YWx1ZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXJnZSgge1xyXG5cdFx0bmFtZTogX2tleSB8fCAnJyxcclxuXHRcdHR5cGU6ICcnLFxyXG5cdFx0ZGVmYXVsdDogbnVsbCxcclxuXHRcdG9wdGlvbmFsOiBmYWxzZVxyXG5cdH0sIHZhbHVlICk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fX2RhdGFbIF9rZXkgXTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLmRlc3Ryb3llZEVycm9yID0gZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcblx0dmFyIGl0ZW0gPSB0eXBlb2YgX21vbGR5ID09PSAnb2JqZWN0JyA/IF9tb2xkeSA6IHt9O1xyXG5cdHJldHVybiBuZXcgRXJyb3IoICdUaGUgZ2l2ZW4gbW9sZHkgaXRlbSBgJyArIGl0ZW0uX19uYW1lICsgJ2AgaGFzIGJlZW4gZGVzdHJveWVkJyApO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NlbGYuYnVzeSA9IHRydWU7XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG5cdFx0XHR2YWx1ZXMgPSBBcnJheS5pc0FycmF5KCBhdHRyaWJ1dGVzWyAndmFsdWVzJyBdICkgPyBhdHRyaWJ1dGVzWyAndmFsdWVzJyBdIDogW10sXHJcblx0XHRcdHZhbHVlID0gYXR0cmlidXRlcy50eXBlID8gY2FzdCggX3ZhbHVlLCBhdHRyaWJ1dGVzLnR5cGUsIGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdLCB2YWx1ZXMgKSA6IF92YWx1ZTtcclxuXHJcblx0XHRpZiAoIHNlbGYuX19kYXRhWyBfa2V5IF0gIT09IHZhbHVlICkge1xyXG5cdFx0XHRzZWxmLmVtaXQoICdjaGFuZ2UnLCBzZWxmLl9fZGF0YVsgX2tleSBdLCB2YWx1ZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSB2YWx1ZTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLnVuc2V0QnVzeSA9IGZ1bmN0aW9uICggX3NlbGYgKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZWxmLmJ1c3kgPSBmYWxzZTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLm5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbnZhciBfZXh0ZW5kID0gZnVuY3Rpb24gKCBvYmogKSB7XHJcblx0QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLmZvckVhY2goIGZ1bmN0aW9uICggc291cmNlICkge1xyXG5cdFx0aWYgKCBzb3VyY2UgKSB7XHJcblx0XHRcdGZvciAoIHZhciBwcm9wIGluIHNvdXJjZSApIHtcclxuXHRcdFx0XHRvYmpbIHByb3AgXSA9IHNvdXJjZVsgcHJvcCBdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSApO1xyXG5cclxuXHRyZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuZXhwb3J0cy5leHRlbmQgPSBfZXh0ZW5kO1xyXG5cclxuZXhwb3J0cy5leHRlbmRPYmplY3QgPSBmdW5jdGlvbiAoIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzICkge1xyXG5cdHZhciBwYXJlbnQgPSB0aGlzO1xyXG5cdHZhciBjaGlsZDtcclxuXHJcblx0aWYgKCBwcm90b1Byb3BzICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggcHJvdG9Qcm9wcywgJ2NvbnN0cnVjdG9yJyApICkge1xyXG5cdFx0Y2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIHBhcmVudC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0X2V4dGVuZCggY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMgKTtcclxuXHJcblx0dmFyIFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuXHR9O1xyXG5cclxuXHRTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHRjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuXHRpZiAoIHByb3RvUHJvcHMgKSBfZXh0ZW5kKCBjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMgKTtcclxuXHJcblx0Y2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcblx0cmV0dXJuIGNoaWxkO1xyXG59OyIsInZhciBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXHJcblx0ZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuXHRndWlkID0gcmVxdWlyZSggJ3NjLWd1aWQnICksXHJcblx0aGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKSxcclxuXHRoZWxwZXJzID0gcmVxdWlyZSggJy4vaGVscGVycycgKSxcclxuXHRpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuXHRleHRlbmQgPSBoZWxwZXJzLmV4dGVuZE9iamVjdDtcclxuXHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICggX2luaXRpYWwsIF9tb2xkeSApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRpbml0aWFsID0gX2luaXRpYWwgfHwge307XHJcblxyXG5cdHRoaXMuX19tb2xkeSA9IF9tb2xkeTtcclxuXHR0aGlzLl9faXNNb2xkeSA9IHRydWU7XHJcblx0dGhpcy5fX2F0dHJpYnV0ZXMgPSB7fTtcclxuXHR0aGlzLl9fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcblx0aWYgKCAhc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyApIHtcclxuXHRcdHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIHNlbGYuX19tb2xkeS5fX2tleSApO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRcdHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIGluaXRpYWxbIF9rZXkgXSApO1xyXG5cdH0gKTtcclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0T2JqZWN0LmtleXMoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0aWYgKCBoYXNLZXkoIHNlbGZbIF9rZXkgXSwgJ19faXNNb2xkeScsICdib29sZWFuJyApICYmIHNlbGZbIF9rZXkgXS5fX2lzTW9sZHkgPT09IHRydWUgKSB7XHJcblx0XHRcdHNlbGZbIF9rZXkgXS4kY2xlYXIoKTtcclxuXHRcdH0gZWxzZSBpZiAoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlICkge1xyXG5cdFx0XHR3aGlsZSAoIHNlbGZbIF9rZXkgXS5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdHNlbGZbIF9rZXkgXS5zaGlmdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmWyBfa2V5IF0gPSBzZWxmLl9fZGF0YVsgX2tleSBdID0gdm9pZCAwO1xyXG5cdFx0fVxyXG5cdH0gKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAkY2xvbmUgd29uJ3Qgd29yayBjdXJyZW50bHlcclxuICogQHBhcmFtICB7W3R5cGVdfSBfZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLiRjbG9uZSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0aW5pdGlhbFZhbHVlcyA9IHRoaXMuJGpzb24oKTtcclxuXHJcblx0aGVscGVycy5leHRlbmQoIGluaXRpYWxWYWx1ZXMsIF9kYXRhIHx8IHt9ICk7XHJcblxyXG5cdHZhciBuZXdNb2xkeSA9IHRoaXMuX19tb2xkeS5jcmVhdGUoIGluaXRpYWxWYWx1ZXMgKTtcclxuXHJcblx0cmV0dXJuIG5ld01vbGR5O1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRkYXRhID0gZnVuY3Rpb24gKCBfZGF0YSwgX29wdGlvbnMgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0ZGF0YSA9IGlzLm9iamVjdCggX2RhdGEgKSA/IF9kYXRhIDoge30sXHJcblx0XHRvcHRpb25zID0gaGVscGVycy5leHRlbmQoIHtcclxuXHRcdFx0bWVyZ2VBcnJheU9mQVR5cGU6IHRydWVcclxuXHRcdH0sIF9vcHRpb25zICk7XHJcblxyXG5cdGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuXHRcdHJldHVybiBoZWxwZXJzLmRlc3Ryb3llZEVycm9yKCBzZWxmICk7XHJcblx0fVxyXG5cclxuXHRPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRcdGlmICggc2VsZi5fX2F0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIF9rZXkgKSApIHtcclxuXHRcdFx0aWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgaGFzS2V5KCBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLCAnYXJyYXlPZkFUeXBlJywgJ2Jvb2xlYW4nICkgJiYgc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXS5hcnJheU9mQVR5cGUgPT09IHRydWUgKSB7XHJcblx0XHRcdFx0aWYgKCBvcHRpb25zLm1lcmdlQXJyYXlPZkFUeXBlICE9PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0d2hpbGUgKCBzZWxmWyBfa2V5IF0ubGVuZ3RoICkgc2VsZlsgX2tleSBdLnNoaWZ0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcclxuXHRcdFx0XHRcdHNlbGZbIF9rZXkgXS5wdXNoKCBfbW9sZHkgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gZWxzZSBpZiAoIGlzLmEub2JqZWN0KCBkYXRhWyBfa2V5IF0gKSAmJiBzZWxmWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcclxuXHRcdFx0XHRzZWxmWyBfa2V5IF0uJGRhdGEoIGRhdGFbIF9rZXkgXSwgX29wdGlvbnMgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9ICk7XHJcblxyXG5cdHJldHVybiBzZWxmO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xyXG5cdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdGVndWlkID0gZ3VpZC5nZW5lcmF0ZSgpLFxyXG5cdFx0aXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcclxuXHRcdGRhdGEgPSBzZWxmLiRqc29uKCksXHJcblx0XHRtZXRob2QgPSAnZGVsZXRlJyxcclxuXHRcdGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcblx0aWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG5cdFx0cmV0dXJuIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKSBdICk7XHJcblx0fVxyXG5cclxuXHRzZWxmLl9fbW9sZHkuZW1pdCggJ2J1c3knLCBlZ3VpZCApO1xyXG5cdHNlbGYuZW1pdCggJ3ByZWRlc3Ryb3knLCB7XHJcblx0XHRtb2xkeTogc2VsZixcclxuXHRcdGRhdGE6IGRhdGEsXHJcblx0XHRtZXRob2Q6IG1ldGhvZCxcclxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xyXG5cdH0gKTtcclxuXHJcblx0aWYgKCAhaXNEaXJ0eSApIHtcclxuXHRcdHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJbIHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJOYW1lIF0uZGVzdHJveS5jYWxsKCBzZWxmLl9fbW9sZHksIHNlbGYuJGpzb24oKSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblxyXG5cdFx0XHRpZiAoIF9lcnJvciAmJiAhKCBfZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xyXG5cdFx0XHRcdF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeTpkb25lJywgZWd1aWQgKTtcclxuXHRcdFx0c2VsZi5lbWl0KCAnZGVzdHJveScsIF9lcnJvciwgX3JlcyApO1xyXG5cdFx0XHRzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcclxuXHRcdFx0c2VsZlsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjayggX2Vycm9yLCBfcmVzICk7XHJcblx0XHR9ICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBuZXcgRXJyb3IoICdUaGlzIG1vbGR5IGNhbm5vdCBiZSBkZXN0cm95ZWQgYmVjYXVzZSBpdCBoYXMgbm90IGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciB5ZXQuJyApICk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gdGhpcy5fX2Rlc3Ryb3llZCA/IHRydWUgOiBpcy5lbXB0eSggdGhpc1sgdGhpcy5fX21vbGR5Ll9fa2V5IF0gKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoIHRoaXMuX19kZXN0cm95ZWQgKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcblx0T2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cclxuXHRcdGlmICggc2VsZi4kaXNEaXJ0eSgpICYmIF9rZXkgPT09IHNlbGYuX19tb2xkeS5fX2tleSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB2YWx1ZSA9IHNlbGZbIF9rZXkgXSxcclxuXHRcdFx0YXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXHJcblx0XHRcdHR5cGUgPSBhdHRyaWJ1dGVzLnR5cGUsXHJcblx0XHRcdGFycmF5T2ZBVHlwZSA9IGhhc0tleSggYXR0cmlidXRlcywgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApID8gYXR0cmlidXRlcy5hcnJheU9mQVR5cGUgPT09IHRydWUgOiBmYWxzZSxcclxuXHRcdFx0aXNSZXF1aXJlZCA9IGF0dHJpYnV0ZXMub3B0aW9uYWwgIT09IHRydWUsXHJcblx0XHRcdGlzTnVsbE9yVW5kZWZpbmVkID0gc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyA/IGZhbHNlIDogYXJyYXlPZkFUeXBlID8gdmFsdWUubGVuZ3RoID09PSAwIDogaXMubnVsbE9yVW5kZWZpbmVkKCB2YWx1ZSApLFxyXG5cdFx0XHR0eXBlSXNXcm9uZyA9IGlzLm5vdC5lbXB0eSggdHlwZSApICYmIGlzLmEuc3RyaW5nKCB0eXBlICkgPyBpcy5ub3QuYVsgdHlwZSBdKCB2YWx1ZSApIDogaXNOdWxsT3JVbmRlZmluZWQ7XHJcblxyXG5cdFx0aWYgKCBhcnJheU9mQVR5cGUgJiYgaXMubm90LmVtcHR5KCB2YWx1ZSApICYmIHZhbHVlWyAwIF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcclxuXHRcdFx0dmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuXHRcdFx0XHRpZiAoIGlzVmFsaWQgJiYgX2l0ZW0uJGlzVmFsaWQoKSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRpc1ZhbGlkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBpc1ZhbGlkICYmIGlzUmVxdWlyZWQgJiYgdHlwZUlzV3JvbmcgKSB7XHJcblx0XHRcdGlzVmFsaWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cclxuXHRyZXR1cm4gaXNWYWxpZDtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kanNvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRkYXRhID0gc2VsZi5fX2RhdGEsXHJcblx0XHRqc29uID0ge307XHJcblxyXG5cdE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0aWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgZGF0YVsgX2tleSBdWyAwIF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcclxuXHRcdFx0anNvblsgX2tleSBdID0gW107XHJcblx0XHRcdGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcclxuXHRcdFx0XHRqc29uWyBfa2V5IF0ucHVzaCggX21vbGR5LiRqc29uKCkgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fSBlbHNlIGlmICggaXMuYS5kYXRlKCBkYXRhWyBfa2V5IF0gKSApIHtcclxuXHRcdFx0anNvblsgX2tleSBdID0gZGF0YVsgX2tleSBdLnRvSVNPU3RyaW5nKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRqc29uWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCA/IGRhdGFbIF9rZXkgXS4kanNvbigpIDogZGF0YVsgX2tleSBdO1xyXG5cdFx0fVxyXG5cdH0gKTtcclxuXHJcblx0cmV0dXJuIGpzb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJHNhdmUgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRlcnJvciA9IG51bGwsXHJcblx0XHRlZ3VpZCA9IGd1aWQuZ2VuZXJhdGUoKSxcclxuXHRcdGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXHJcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxyXG5cdFx0bWV0aG9kID0gaXNEaXJ0eSA/ICdjcmVhdGUnIDogJ3NhdmUnLFxyXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuXHRzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG5cdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeScsIGVndWlkICk7XHJcblx0c2VsZi5lbWl0KCAncHJlc2F2ZScsIHtcclxuXHRcdG1vbGR5OiBzZWxmLFxyXG5cdFx0ZGF0YTogZGF0YSxcclxuXHRcdG1ldGhvZDogbWV0aG9kLFxyXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXHJcblx0fSApO1xyXG5cclxuXHR2YXIgcmVzcG9uc2VTaG91bGRDb250YWluQW5JZCA9IGhhc0tleSggZGF0YSwgc2VsZi5fX2tleSApICYmIGlzLm5vdC5lbXB0eSggZGF0YVsgc2VsZi5fX2tleSBdICk7XHJcblxyXG5cdHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJbIHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJOYW1lIF1bIG1ldGhvZCBdLmNhbGwoIHNlbGYuX19tb2xkeSwgZGF0YSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblxyXG5cdFx0aWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcclxuXHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFfZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIF9yZXMgKSAmJiAoIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgJiYgIWhhc0tleSggX3Jlcywgc2VsZi5fX21vbGR5Ll9fa2V5ICkgKSApIHtcclxuXHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIHNlbGYuX19tb2xkeS5fX2tleSArICdgJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggIV9lcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggX3JlcyApICkge1xyXG5cdFx0XHRzZWxmLl9fbW9sZHlbIHNlbGYuX19tb2xkeS5fX2tleSBdID0gX3Jlc1sgc2VsZi5fX21vbGR5Ll9fa2V5IF07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAhZXJyb3IgKSB7XHJcblx0XHRcdHNlbGYuJGRhdGEoIF9yZXMsIHtcclxuXHRcdFx0XHRtZXJnZUFycmF5T2ZBVHlwZTogZmFsc2VcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuZW1pdCggJ3NhdmUnLCBfZXJyb3IsIHNlbGYgKTtcclxuXHRcdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeTpkb25lJywgZWd1aWQgKTtcclxuXHJcblx0XHRjYWxsYmFjayAmJiBjYWxsYmFjayggX2Vycm9yLCBzZWxmICk7XHJcblx0fSApO1xyXG59O1xyXG5cclxuZW1pdHRlciggTW9kZWwucHJvdG90eXBlICk7XHJcblxyXG5Nb2RlbC5leHRlbmQgPSBleHRlbmQ7XHJcblxyXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBNb2RlbDsiLCJ2YXIgaGVscGVycyA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2luZGV4XCIgKSxcclxuXHRlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxyXG5cdGd1aWQgPSByZXF1aXJlKCAnc2MtZ3VpZCcgKSxcclxuXHRvYnNlcnZhYmxlQXJyYXkgPSByZXF1aXJlKCAnc2ctb2JzZXJ2YWJsZS1hcnJheScgKSxcclxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxyXG5cdGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG5cdG1lcmdlID0gcmVxdWlyZSggJ3NjLW1lcmdlJyApLFxyXG5cdGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBCYXNlTW9kZWwsIGRlZmF1bHRDb25maWd1cmF0aW9uLCBhZGFwdGVyICkge1xyXG5cclxuXHR2YXIgTW9sZHkgPSBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0cHJvcGVydGllcyA9IGlzLmFuLm9iamVjdCggX3Byb3BlcnRpZXMgKSA/IF9wcm9wZXJ0aWVzIDoge30sXHJcblxyXG5cdFx0XHRpbml0aWFsID0gcHJvcGVydGllcy5pbml0aWFsIHx8IHt9O1xyXG5cclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBzZWxmLCB7XHJcblx0XHRcdF9fbW9sZHk6IHtcclxuXHRcdFx0XHR2YWx1ZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX3Byb3BlcnRpZXM6IHtcclxuXHRcdFx0XHR2YWx1ZTogcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF0gfHwge31cclxuXHRcdFx0fSxcclxuXHRcdFx0X19hZGFwdGVyTmFtZToge1xyXG5cdFx0XHRcdHZhbHVlOiBwcm9wZXJ0aWVzWyAnYWRhcHRlcicgXSB8fCAnX19kZWZhdWx0J1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX21ldGFkYXRhOiB7XHJcblx0XHRcdFx0dmFsdWU6IHt9XHJcblx0XHRcdH0sXHJcblx0XHRcdF9fYmFzZVVybDoge1xyXG5cdFx0XHRcdHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAnYmFzZVVybCcgXSwgJ3N0cmluZycsICcnICksXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0X19kYXRhOiB7XHJcblx0XHRcdFx0dmFsdWU6IHt9LFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9fZGVzdHJveWVkOiB7XHJcblx0XHRcdFx0dmFsdWU6IGZhbHNlLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9faGVhZGVyczoge1xyXG5cdFx0XHRcdHZhbHVlOiBtZXJnZSgge30sIGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSwgY2FzdCggZGVmYXVsdENvbmZpZ3VyYXRpb24uaGVhZGVycywgJ29iamVjdCcsIHt9ICkgKSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2tleToge1xyXG5cdFx0XHRcdHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAna2V5JyBdLCAnc3RyaW5nJywgJ2lkJyApIHx8ICdpZCcsXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0X19rZXlsZXNzOiB7XHJcblx0XHRcdFx0dmFsdWU6IHByb3BlcnRpZXNbICdrZXlsZXNzJyBdID09PSB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9fbmFtZToge1xyXG5cdFx0XHRcdHZhbHVlOiBfbmFtZSB8fCBwcm9wZXJ0aWVzWyAnbmFtZScgXSB8fCAnJyxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX3VybDoge1xyXG5cdFx0XHRcdHZhbHVlOiBjYXN0KCBwcm9wZXJ0aWVzWyAndXJsJyBdLCAnc3RyaW5nJywgJycgKSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRidXN5OiB7XHJcblx0XHRcdFx0dmFsdWU6IGZhbHNlLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH0gKTtcclxuXHJcblx0XHRpZiAoICFzZWxmLl9fa2V5bGVzcyApIHtcclxuXHRcdFx0dGhpcy4kcHJvcGVydHkoIHRoaXMuX19rZXkgKTtcclxuXHRcdH1cclxuXHJcblx0XHRPYmplY3Qua2V5cyggY2FzdCggc2VsZi5fX3Byb3BlcnRpZXMsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0XHRzZWxmLiRwcm9wZXJ0eSggX2tleSwgc2VsZi5fX3Byb3BlcnRpZXNbIF9rZXkgXSApO1xyXG5cdFx0fSApO1xyXG5cclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuc2NoZW1hID0gZnVuY3Rpb24gKCBzY2hlbWEgKSB7XHJcblxyXG5cdFx0T2JqZWN0LmtleXMoIGNhc3QoIHNjaGVtYSwgJ29iamVjdCcsIHt9ICkgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcblx0XHRcdHNlbGYuJHByb3BlcnR5KCBfa2V5LCBzY2hlbWFbIF9rZXkgXSApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS5hZGFwdGVyID0gZnVuY3Rpb24gKCBhZGFwdGVyICkge1xyXG5cclxuXHRcdGlmICggIWFkYXB0ZXIgfHwgIXRoaXMuX19hZGFwdGVyWyBhZGFwdGVyIF0gKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvciggXCJQcm92aWRlIGEgdmFsaWQgYWRwYXRlciBcIiApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX19hZGFwdGVyTmFtZSA9IGFkYXB0ZXI7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLnByb3RvID0gZnVuY3Rpb24gKCBwcm90byApIHtcclxuXHJcblx0XHR0aGlzLl9fcHJvcGVydGllcy5wcm90byA9IHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvIHx8IHt9O1xyXG5cdFx0aGVscGVycy5leHRlbmQoIHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvLCBwcm90byApO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoIF9pbml0aWFsICkge1xyXG5cdFx0dmFyIEtsYXNzID0gQmFzZU1vZGVsLmV4dGVuZCggdGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gfHwge30gKTtcclxuXHJcblx0XHRyZXR1cm4gbmV3IEtsYXNzKCBfaW5pdGlhbCwgdGhpcyApO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS4kaGVhZGVycyA9IGZ1bmN0aW9uICggX2hlYWRlcnMgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG5cdFx0XHRyZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuX19oZWFkZXJzID0gaXMuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gX2hlYWRlcnMgOiBzZWxmLl9faGVhZGVycztcclxuXHRcdHJldHVybiBpcy5ub3QuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gc2VsZi5fX2hlYWRlcnMgOiBzZWxmO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS4kZmluZE9uZSA9IGZ1bmN0aW9uICggX3F1ZXJ5LCBfY2FsbGJhY2sgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdGVndWlkID0gZ3VpZC5nZW5lcmF0ZSgpLFxyXG5cdFx0XHRyZXN1bHQsXHJcblx0XHRcdHVybCA9IHNlbGYuJHVybCgpLFxyXG5cdFx0XHRtZXRob2QgPSAnZmluZE9uZScsXHJcblx0XHRcdHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG5cdFx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wLFxyXG5cdFx0XHR3YXNEZXN0cm95ZWQgPSBzZWxmLl9fZGVzdHJveWVkO1xyXG5cclxuXHRcdHNlbGYuZW1pdCggJ2J1c3knLCBlZ3VpZCApXHJcblx0XHRzZWxmLmVtaXQoICdwcmVmaW5kT25lJywge1xyXG5cdFx0XHRtb2xkeTogc2VsZixcclxuXHRcdFx0bWV0aG9kOiBtZXRob2QsXHJcblx0XHRcdHF1ZXJ5OiBxdWVyeSxcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRzZWxmLl9fYWRhcHRlclsgc2VsZi5fX2FkYXB0ZXJOYW1lIF0uZmluZE9uZS5jYWxsKCBzZWxmLCBxdWVyeSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblx0XHRcdGlmICggX2Vycm9yICYmICEoIF9lcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XHJcblx0XHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBpcy5lbXB0eSggX3JlcyApICkge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoIGlzLmFycmF5KCBfcmVzICkgKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBzZWxmLmNyZWF0ZSggX3Jlc1sgMCBdICk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHNlbGYuY3JlYXRlKCBfcmVzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdmaW5kT25lJywgX2Vycm9yLCByZXN1bHQgKTtcclxuXHJcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlc3VsdCApO1xyXG5cdFx0fSApO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRiYXNlID0gaXMuZW1wdHkoIHNlbGYuJGJhc2VVcmwoKSApID8gJycgOiBzZWxmLiRiYXNlVXJsKCksXHJcblx0XHRcdG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcclxuXHRcdFx0dXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxyXG5cdFx0XHRlbmRwb2ludCA9IGJhc2UgKyBuYW1lICsgKCBpcy5lbXB0eSggdXJsICkgPyAnJyA6ICcvJyArIHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApICk7XHJcblxyXG5cdFx0c2VsZi5fX3VybCA9IHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApO1xyXG5cclxuXHRcdHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuX19hZGFwdGVyID0gYWRhcHRlcjtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLiRiYXNlVXJsID0gZnVuY3Rpb24gKCBfYmFzZSApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0dXJsID0gY2FzdCggX2Jhc2UsICdzdHJpbmcnLCBzZWxmLl9fYmFzZVVybCB8fCAnJyApO1xyXG5cclxuXHRcdHNlbGYuX19iYXNlVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvKFxcL3xcXHMpKyQvZywgJycgKSB8fCBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsIHx8ICcnO1xyXG5cclxuXHRcdHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF9iYXNlICkgPyBzZWxmLl9fYmFzZVVybCA6IHNlbGY7XHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLiRmaW5kID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0ZWd1aWQgPSBndWlkLmdlbmVyYXRlKCksXHJcblx0XHRcdHVybCA9IHNlbGYuJHVybCgpLFxyXG5cdFx0XHRtZXRob2QgPSAnZmluZCcsXHJcblx0XHRcdHJlc3VsdCA9IFtdLFxyXG5cdFx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcclxuXHRcdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcblx0XHRzZWxmLmVtaXQoICdidXN5JywgZWd1aWQgKTtcclxuXHRcdHNlbGYuZW1pdCggJ3ByZWZpbmQnLCB7XHJcblx0XHRcdG1vbGR5OiBzZWxmLFxyXG5cdFx0XHRtZXRob2Q6IG1ldGhvZCxcclxuXHRcdFx0cXVlcnk6IHF1ZXJ5LFxyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0c2VsZi5fX2FkYXB0ZXJbIHNlbGYuX19hZGFwdGVyTmFtZSBdLmZpbmQuY2FsbCggc2VsZiwgcXVlcnksIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG5cclxuXHRcdFx0aWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgX2Vycm9yICkgKSB7XHJcblx0XHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBpcy5hcnJheSggX3JlcyApICkge1xyXG5cdFx0XHRcdF9yZXMuZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBzZWxmLmNyZWF0ZSggX2RhdGEgKSApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCggc2VsZi5jcmVhdGUoIF9kYXRhICkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlcyA9IGNhc3QoIHJlc3VsdCBpbnN0YW5jZW9mIEJhc2VNb2RlbCB8fCBpcy5hbi5hcnJheSggcmVzdWx0ICkgPyByZXN1bHQgOiBudWxsLCAnYXJyYXknLCBbXSApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdmaW5kJywgX2Vycm9yLCByZXMgKTtcclxuXHJcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlcyApO1xyXG5cclxuXHRcdH0gKTtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKCBvYmosIGtleSwgdmFsdWUgKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRleGlzdGluZ1ZhbHVlID0gb2JqWyBrZXkgXSB8fCB2YWx1ZSxcclxuXHRcdFx0bWV0YWRhdGEgPSBzZWxmLl9fbWV0YWRhdGFbIGtleSBdO1xyXG5cclxuXHRcdGlmICggIW9iai5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgfHwgIW9iai5fX2F0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5TW9sZHkgfHwgbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlTdHJpbmcgKSB7XHJcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlcy50eXBlID0gbWV0YWRhdGEudmFsdWU7XHJcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheU1vbGR5O1xyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyA9IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5U3RyaW5nO1xyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG1ldGFkYXRhLnZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBuZXcgTW9sZHkoIG1ldGFkYXRhLnZhbHVlLm5hbWUsIG1ldGFkYXRhLnZhbHVlICkuY3JlYXRlKCBleGlzdGluZ1ZhbHVlICksXHJcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlXHJcblx0XHRcdFx0fSApO1xyXG5cclxuXHRcdFx0XHRvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICkge1xyXG5cclxuXHRcdFx0XHR2YXIgYXJyYXkgPSBvYnNlcnZhYmxlQXJyYXkoIFtdICksXHJcblx0XHRcdFx0XHRhdHRyaWJ1dGVUeXBlID0gbWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nIHx8IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ID8gbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlWyAwIF0gOiAnKic7XHJcblxyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZXMuYXJyYXlPZkFUeXBlID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBvYmosIGtleSwge1xyXG5cdFx0XHRcdFx0dmFsdWU6IGFycmF5LFxyXG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxyXG5cdFx0XHRcdH0gKTtcclxuXHJcblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuXHRcdFx0XHRbICdwdXNoJywgJ3Vuc2hpZnQnIF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbWV0aG9kICkge1xyXG5cdFx0XHRcdFx0YXJyYXkub24oIF9tZXRob2QsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXHJcblx0XHRcdFx0XHRcdFx0dmFsdWVzID0gW107XHJcblx0XHRcdFx0XHRcdGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5ICkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG1vbGR5ID0gbmV3IE1vbGR5KCBhdHRyaWJ1dGVUeXBlWyAnbmFtZScgXSwgYXR0cmlidXRlVHlwZSApLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhID0gaXMuYW4ub2JqZWN0KCBfaXRlbSApID8gX2l0ZW0gOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCggbW9sZHkuY3JlYXRlKCBkYXRhICkgKTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIGNhc3QoIF9pdGVtLCBhdHRyaWJ1dGVUeXBlLCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0XHRcdHJldHVybiBhcnJheVsgJ19fJyArIF9tZXRob2QgXS5hcHBseSggYXJyYXksIHZhbHVlcyApO1xyXG5cdFx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHJcblx0XHRcdFx0aWYgKCBleGlzdGluZ1ZhbHVlICYmIGV4aXN0aW5nVmFsdWUubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0XHRcdGV4aXN0aW5nVmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBvICkge1xyXG5cdFx0XHRcdFx0XHRvYmpbIGtleSBdLnB1c2goIG8gKTtcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdGdldDogaGVscGVycy5nZXRQcm9wZXJ0eSgga2V5ICksXHJcblx0XHRcdFx0XHRzZXQ6IGhlbHBlcnMuc2V0UHJvcGVydHkoIGtleSApLFxyXG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZVxyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0b2JqLl9fYXR0cmlidXRlc1sga2V5IF0gPSBtZXRhZGF0YS5hdHRyaWJ1dGVzO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggZXhpc3RpbmdWYWx1ZSAhPT0gdm9pZCAwICkgeyAvL2lmIGV4aXN0aW5nIHZhbHVlXHJcblx0XHRcdG9ialsga2V5IF0gPSBleGlzdGluZ1ZhbHVlO1xyXG5cdFx0fSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSAmJiBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApICkge1xyXG5cdFx0XHRvYmpbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XHJcblx0XHR9IGVsc2UgaWYgKCBpcy5lbXB0eSggb2JqWyBrZXkgXSApICYmIG1ldGFkYXRhLmF0dHJpYnV0ZXMub3B0aW9uYWwgPT09IGZhbHNlICkge1xyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgfHwgbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5JbnN0YW50aWF0ZWRNb2xkeSApIHtcclxuXHRcdFx0XHRvYmouX19kYXRhWyBrZXkgXSA9IG9ialsga2V5IF07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBpcy5lbXB0eSggbWV0YWRhdGEuYXR0cmlidXRlcy50eXBlICkgPyB1bmRlZmluZWQgOiBjYXN0KCB1bmRlZmluZWQsIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRhdHRyaWJ1dGVzID0gbmV3IGhlbHBlcnMuYXR0cmlidXRlcyggX2tleSwgX3ZhbHVlICksXHJcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgPSBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlICkgJiYgL21vbGR5Ly50ZXN0KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuXHRcdFx0YXR0cmlidXRlVHlwZUlzQW5BcnJheSA9IGlzLmFuLmFycmF5KCBhdHRyaWJ1dGVzLnR5cGUgKSxcclxuXHRcdFx0dmFsdWVJc0FuQXJyYXlNb2xkeSA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBoYXNLZXkoIF92YWx1ZVsgMCBdLCAncHJvcGVydGllcycsICdvYmplY3QnICksXHJcblx0XHRcdHZhbHVlSXNBbkFycmF5U3RyaW5nID0gaXMuYW4uYXJyYXkoIF92YWx1ZSApICYmIGlzLmEuc3RyaW5nKCBfdmFsdWVbIDAgXSApLFxyXG5cdFx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA9IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgJiYgaGFzS2V5KCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG5cdFx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGlzLmEuc3RyaW5nKCBhdHRyaWJ1dGVzLnR5cGVbIDAgXSApICYmIGlzLm5vdC5lbXB0eSggYXR0cmlidXRlcy50eXBlWyAwIF0gKSxcclxuXHRcdFx0dmFsdWVJc0FTdGF0aWNNb2xkeSA9IGhhc0tleSggX3ZhbHVlLCAncHJvcGVydGllcycsICdvYmplY3QnICk7XHJcblxyXG5cdFx0c2VsZi5fX21ldGFkYXRhWyBfa2V5IF0gPSB7XHJcblx0XHRcdGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXHJcblx0XHRcdHZhbHVlOiBfdmFsdWUsXHJcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHk6IGF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHksXHJcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXk6IGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXksXHJcblx0XHRcdHZhbHVlSXNBbkFycmF5TW9sZHk6IHZhbHVlSXNBbkFycmF5TW9sZHksXHJcblx0XHRcdHZhbHVlSXNBbkFycmF5U3RyaW5nOiB2YWx1ZUlzQW5BcnJheVN0cmluZyxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHk6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5LFxyXG5cdFx0XHRhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmc6IGF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyxcclxuXHRcdFx0dmFsdWVJc0FTdGF0aWNNb2xkeTogdmFsdWVJc0FTdGF0aWNNb2xkeVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gc2VsZjtcclxuXHR9O1xyXG5cclxuXHRlbWl0dGVyKCBNb2xkeS5wcm90b3R5cGUgKTtcclxuXHJcblx0cmV0dXJuIE1vbGR5O1xyXG5cclxufTsiXX0=
(17)
});
