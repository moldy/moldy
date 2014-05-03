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

	for ( var i in initial ) {
		if ( initial.hasOwnProperty( i ) && self.__moldy.__metadata[ i ] ) {
			this[ i ] = initial[ i ];
		}
	}
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
			self.$data( _res );
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
			callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop
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

		self.__adapter[ self.__adapterName ].findOne.call( self, _query, function ( _error, _res ) {
			if ( _error && !( _error instanceof Error ) ) {
				_error = new Error( 'An unknown error occurred' );
			}

			if ( !_error ) {
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

		self.__adapter[ self.__adapterName ].find.call( self, _query, function ( _error, _res ) {

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
},{"./helpers/index":18,"emitter-component":1,"sc-cast":2,"sc-guid":4,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sg-observable-array":15}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zZy1vYnNlcnZhYmxlLWFycmF5L3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2NvbmZpZy5qc29uIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvZmFrZV9lNGRmYThhYy5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL2hlbHBlcnMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L3NyYy9tb2RlbC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL21vbGR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCJ2YXIgY29udGFpbnMgPSByZXF1aXJlKCBcInNjLWNvbnRhaW5zXCIgKSxcbiAgaXMgPSByZXF1aXJlKCBcInNjLWlzXCIgKTtcblxudmFyIGNhc3QgPSBmdW5jdGlvbiAoIF92YWx1ZSwgX2Nhc3RUeXBlLCBfZGVmYXVsdCwgX3ZhbHVlcywgX2FkZGl0aW9uYWxQcm9wZXJ0aWVzICkge1xuXG4gIHZhciBwYXJzZWRWYWx1ZSxcbiAgICBjYXN0VHlwZSA9IF9jYXN0VHlwZSxcbiAgICB2YWx1ZSxcbiAgICB2YWx1ZXMgPSBpcy5hbi5hcnJheSggX3ZhbHVlcyApID8gX3ZhbHVlcyA6IFtdO1xuXG4gIHN3aXRjaCAoIHRydWUgKSB7XG4gIGNhc2UgKCAvZmxvYXR8aW50ZWdlci8udGVzdCggY2FzdFR5cGUgKSApOlxuICAgIGNhc3RUeXBlID0gXCJudW1iZXJcIjtcbiAgICBicmVhaztcbiAgfVxuXG4gIGlmICggaXMuYVsgY2FzdFR5cGUgXSggX3ZhbHVlICkgfHwgY2FzdFR5cGUgPT09ICcqJyApIHtcblxuICAgIHZhbHVlID0gX3ZhbHVlO1xuXG4gIH0gZWxzZSB7XG5cbiAgICBzd2l0Y2ggKCB0cnVlICkge1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJhcnJheVwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIGlzLmEuc3RyaW5nKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UoIF92YWx1ZSApO1xuICAgICAgICB9XG4gICAgICAgIGlmICggaXMubm90LmFuLmFycmF5KCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuICAgICAgICBpZiAoIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIF92YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gWyBfdmFsdWUgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImJvb2xlYW5cIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSAvXih0cnVlfDF8eXx5ZXMpJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyB0cnVlIDogdW5kZWZpbmVkO1xuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBpZiAoIGlzLm5vdC5hLmJvb2xlYW4oIHZhbHVlICkgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IC9eKGZhbHNlfC0xfDB8bnxubykkL2kudGVzdCggX3ZhbHVlLnRvU3RyaW5nKCkgKSA/IGZhbHNlIDogdW5kZWZpbmVkO1xuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgdmFsdWUgPSBpcy5hLmJvb2xlYW4oIHZhbHVlICkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcImRhdGVcIjpcblxuICAgICAgdHJ5IHtcblxuICAgICAgICB2YWx1ZSA9IG5ldyBEYXRlKCBfdmFsdWUgKTtcbiAgICAgICAgdmFsdWUgPSBpc05hTiggdmFsdWUuZ2V0VGltZSgpICkgPyB1bmRlZmluZWQgOiB2YWx1ZTtcblxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwic3RyaW5nXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBKU09OLnN0cmluZ2lmeSggX3ZhbHVlICk7XG4gICAgICAgIGlmICggaXMudW5kZWZpbmVkKCB2YWx1ZSApICkge1xuICAgICAgICAgIHRocm93IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YWx1ZSA9IF92YWx1ZS50b1N0cmluZygpXG4gICAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwibnVtYmVyXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCggX3ZhbHVlICk7XG4gICAgICAgIGlmICggaXMubm90LmEubnVtYmVyKCB2YWx1ZSApIHx8IGlzTmFOKCB2YWx1ZSApICkge1xuICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgdmFsdWUgPSB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICBzd2l0Y2ggKCB0cnVlICkge1xuICAgICAgICBjYXNlIF9jYXN0VHlwZSA9PT0gXCJpbnRlZ2VyXCI6XG4gICAgICAgICAgdmFsdWUgPSBwYXJzZUludCggdmFsdWUgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gY2FzdCggSlNPTi5wYXJzZSggX3ZhbHVlICksIGNhc3RUeXBlIClcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICB9XG5cbiAgfVxuXG4gIGlmICggdmFsdWVzLmxlbmd0aCA+IDAgJiYgIWNvbnRhaW5zKCB2YWx1ZXMsIHZhbHVlICkgKSB7XG4gICAgdmFsdWUgPSB2YWx1ZXNbIDAgXTtcbiAgfVxuXG4gIHJldHVybiBpcy5ub3QudW5kZWZpbmVkKCB2YWx1ZSApID8gdmFsdWUgOiBpcy5ub3QudW5kZWZpbmVkKCBfZGVmYXVsdCApID8gX2RlZmF1bHQgOiBudWxsO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3Q7IiwidmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gKCBkYXRhLCBpdGVtICkge1xuICB2YXIgZm91bmRPbmUgPSBmYWxzZTtcblxuICBpZiAoIEFycmF5LmlzQXJyYXkoIGRhdGEgKSApIHtcblxuICAgIGRhdGEuZm9yRWFjaCggZnVuY3Rpb24gKCBhcnJheUl0ZW0gKSB7XG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBpdGVtID09PSBhcnJheUl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgfSBlbHNlIGlmICggT2JqZWN0KCBkYXRhICkgPT09IGRhdGEgKSB7XG5cbiAgICBPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuXG4gICAgICBpZiAoIGZvdW5kT25lID09PSBmYWxzZSAmJiBkYXRhWyBrZXkgXSA9PT0gaXRlbSApIHtcbiAgICAgICAgZm91bmRPbmUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgfSApO1xuXG4gIH1cbiAgcmV0dXJuIGZvdW5kT25lO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250YWluczsiLCJ2YXIgZ3VpZFJ4ID0gXCJ7P1swLTlBLUZhLWZdezh9LVswLTlBLUZhLWZdezR9LTRbMC05QS1GYS1mXXszfS1bMC05QS1GYS1mXXs0fS1bMC05QS1GYS1mXXsxMn19P1wiO1xuXG5leHBvcnRzLmdlbmVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB2YXIgZ3VpZCA9IFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSggL1t4eV0vZywgZnVuY3Rpb24gKCBjICkge1xuICAgIHZhciByID0gKCBkICsgTWF0aC5yYW5kb20oKSAqIDE2ICkgJSAxNiB8IDA7XG4gICAgZCA9IE1hdGguZmxvb3IoIGQgLyAxNiApO1xuICAgIHJldHVybiAoIGMgPT09IFwieFwiID8gciA6ICggciAmIDB4NyB8IDB4OCApICkudG9TdHJpbmcoIDE2ICk7XG4gIH0gKTtcbiAgcmV0dXJuIGd1aWQ7XG59O1xuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKCBzdHJpbmcgKSB7XG4gIHZhciByeCA9IG5ldyBSZWdFeHAoIGd1aWRSeCwgXCJnXCIgKSxcbiAgICBtYXRjaGVzID0gKCB0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiID8gc3RyaW5nIDogXCJcIiApLm1hdGNoKCByeCApO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbWF0Y2hlcyApID8gbWF0Y2hlcyA6IFtdO1xufTtcblxuZXhwb3J0cy5pc1ZhbGlkID0gZnVuY3Rpb24gKCBndWlkICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUnggKTtcbiAgcmV0dXJuIHJ4LnRlc3QoIGd1aWQgKTtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKSxcbiAgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAgb2JqZWN0ID0gdHlwZSggb2JqZWN0ICkgPT09IFwib2JqZWN0XCIgPyBvYmplY3QgOiB7fSwga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJhcnJheVwiID8ga2V5cyA6IFtdO1xuICBrZXlUeXBlID0gdHlwZSgga2V5VHlwZSApID09PSBcInN0cmluZ1wiID8ga2V5VHlwZSA6IFwiXCI7XG5cbiAgdmFyIGtleSA9IGtleXMubGVuZ3RoID4gMCA/IGtleXMuc2hpZnQoKSA6IFwiXCIsXG4gICAga2V5RXhpc3RzID0gaGFzLmNhbGwoIG9iamVjdCwga2V5ICkgfHwgb2JqZWN0WyBrZXkgXSAhPT0gdm9pZCAwLFxuICAgIGtleVZhbHVlID0ga2V5RXhpc3RzID8gb2JqZWN0WyBrZXkgXSA6IHVuZGVmaW5lZCxcbiAgICBrZXlUeXBlSXNDb3JyZWN0ID0gdHlwZSgga2V5VmFsdWUgKSA9PT0ga2V5VHlwZTtcblxuICBpZiAoIGtleXMubGVuZ3RoID4gMCAmJiBrZXlFeGlzdHMgKSB7XG4gICAgcmV0dXJuIGhhc0tleSggb2JqZWN0WyBrZXkgXSwga2V5cywga2V5VHlwZSApO1xuICB9XG5cbiAgcmV0dXJuIGtleXMubGVuZ3RoID4gMCB8fCBrZXlUeXBlID09PSBcIlwiID8ga2V5RXhpc3RzIDoga2V5RXhpc3RzICYmIGtleVR5cGVJc0NvcnJlY3Q7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIG9iamVjdCwga2V5cywga2V5VHlwZSApIHtcblxuICBrZXlzID0gdHlwZSgga2V5cyApID09PSBcInN0cmluZ1wiID8ga2V5cy5zcGxpdCggXCIuXCIgKSA6IFtdO1xuXG4gIHJldHVybiBoYXNLZXkoIG9iamVjdCwga2V5cywga2V5VHlwZSApO1xuXG59OyIsIlxuLyoqXG4gKiB0b1N0cmluZyByZWYuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHR5cGUgb2YgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsKXtcbiAgc3dpdGNoICh0b1N0cmluZy5jYWxsKHZhbCkpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6IHJldHVybiAnZnVuY3Rpb24nO1xuICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOiByZXR1cm4gJ2RhdGUnO1xuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6IHJldHVybiAncmVnZXhwJztcbiAgICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOiByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gICAgY2FzZSAnW29iamVjdCBBcnJheV0nOiByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHJldHVybiAnbnVsbCc7XG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsID09PSBPYmplY3QodmFsKSkgcmV0dXJuICdvYmplY3QnO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsO1xufTtcbiIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuL2lzZXMvdHlwZVwiICksXG4gIGlzID0ge1xuICAgIGE6IHt9LFxuICAgIGFuOiB7fSxcbiAgICBub3Q6IHtcbiAgICAgIGE6IHt9LFxuICAgICAgYW46IHt9XG4gICAgfVxuICB9O1xuXG52YXIgaXNlcyA9IHtcbiAgXCJhcmd1bWVudHNcIjogWyBcImFyZ3VtZW50c1wiLCB0eXBlKCBcImFyZ3VtZW50c1wiICkgXSxcbiAgXCJhcnJheVwiOiBbIFwiYXJyYXlcIiwgdHlwZSggXCJhcnJheVwiICkgXSxcbiAgXCJib29sZWFuXCI6IFsgXCJib29sZWFuXCIsIHR5cGUoIFwiYm9vbGVhblwiICkgXSxcbiAgXCJkYXRlXCI6IFsgXCJkYXRlXCIsIHR5cGUoIFwiZGF0ZVwiICkgXSxcbiAgXCJmdW5jdGlvblwiOiBbIFwiZnVuY3Rpb25cIiwgXCJmdW5jXCIsIFwiZm5cIiwgdHlwZSggXCJmdW5jdGlvblwiICkgXSxcbiAgXCJudWxsXCI6IFsgXCJudWxsXCIsIHR5cGUoIFwibnVsbFwiICkgXSxcbiAgXCJudW1iZXJcIjogWyBcIm51bWJlclwiLCBcImludGVnZXJcIiwgXCJpbnRcIiwgdHlwZSggXCJudW1iZXJcIiApIF0sXG4gIFwib2JqZWN0XCI6IFsgXCJvYmplY3RcIiwgdHlwZSggXCJvYmplY3RcIiApIF0sXG4gIFwicmVnZXhwXCI6IFsgXCJyZWdleHBcIiwgdHlwZSggXCJyZWdleHBcIiApIF0sXG4gIFwic3RyaW5nXCI6IFsgXCJzdHJpbmdcIiwgdHlwZSggXCJzdHJpbmdcIiApIF0sXG4gIFwidW5kZWZpbmVkXCI6IFsgXCJ1bmRlZmluZWRcIiwgdHlwZSggXCJ1bmRlZmluZWRcIiApIF0sXG4gIFwiZW1wdHlcIjogWyBcImVtcHR5XCIsIHJlcXVpcmUoIFwiLi9pc2VzL2VtcHR5XCIgKSBdLFxuICBcIm51bGxvcnVuZGVmaW5lZFwiOiBbIFwibnVsbE9yVW5kZWZpbmVkXCIsIFwibnVsbG9ydW5kZWZpbmVkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL251bGxvcnVuZGVmaW5lZFwiICkgXSxcbiAgXCJndWlkXCI6IFsgXCJndWlkXCIsIHJlcXVpcmUoIFwiLi9pc2VzL2d1aWRcIiApIF1cbn1cblxuT2JqZWN0LmtleXMoIGlzZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICB2YXIgbWV0aG9kcyA9IGlzZXNbIGtleSBdLnNsaWNlKCAwLCBpc2VzWyBrZXkgXS5sZW5ndGggLSAxICksXG4gICAgZm4gPSBpc2VzWyBrZXkgXVsgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSBdO1xuXG4gIG1ldGhvZHMuZm9yRWFjaCggZnVuY3Rpb24gKCBtZXRob2RLZXkgKSB7XG4gICAgaXNbIG1ldGhvZEtleSBdID0gaXMuYVsgbWV0aG9kS2V5IF0gPSBpcy5hblsgbWV0aG9kS2V5IF0gPSBmbjtcbiAgICBpcy5ub3RbIG1ldGhvZEtleSBdID0gaXMubm90LmFbIG1ldGhvZEtleSBdID0gaXMubm90LmFuWyBtZXRob2RLZXkgXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSggdGhpcywgYXJndW1lbnRzICkgPyBmYWxzZSA6IHRydWU7XG4gICAgfVxuICB9ICk7XG5cbn0gKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gaXM7XG5leHBvcnRzLnR5cGUgPSB0eXBlOyIsInZhciB0eXBlID0gcmVxdWlyZShcIi4uL3R5cGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgdmFyIGVtcHR5ID0gZmFsc2U7XG5cbiAgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bGxcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIGVtcHR5ID0gdHJ1ZTtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICBlbXB0eSA9IE9iamVjdC5rZXlzKCB2YWx1ZSApLmxlbmd0aCA9PT0gMDtcbiAgfSBlbHNlIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJib29sZWFuXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwibnVtYmVyXCIgKSB7XG4gICAgZW1wdHkgPSB2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gLTE7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYXJyYXlcIiB8fCB0eXBlKCB2YWx1ZSApID09PSBcInN0cmluZ1wiICkge1xuICAgIGVtcHR5ID0gdmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcmV0dXJuIGVtcHR5O1xuXG59OyIsInZhciBndWlkID0gcmVxdWlyZSggXCJzYy1ndWlkXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuICByZXR1cm4gZ3VpZC5pc1ZhbGlkKCB2YWx1ZSApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG5cdHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSB2b2lkIDA7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCIuLi90eXBlXCIgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIF90eXBlICkge1xuICByZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XG4gICAgcmV0dXJuIHR5cGUoIF92YWx1ZSApID09PSBfdHlwZTtcbiAgfVxufSIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWwgKSB7XG4gIHN3aXRjaCAoIHRvU3RyaW5nLmNhbGwoIHZhbCApICkge1xuICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgcmV0dXJuICdmdW5jdGlvbic7XG4gIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgIHJldHVybiAnZGF0ZSc7XG4gIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgcmV0dXJuICdyZWdleHAnO1xuICBjYXNlICdbb2JqZWN0IEFyZ3VtZW50c10nOlxuICAgIHJldHVybiAnYXJndW1lbnRzJztcbiAgY2FzZSAnW29iamVjdCBBcnJheV0nOlxuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG5cbiAgaWYgKCB2YWwgPT09IG51bGwgKSByZXR1cm4gJ251bGwnO1xuICBpZiAoIHZhbCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAoIHZhbCA9PT0gT2JqZWN0KCB2YWwgKSApIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07IiwidmFyIHR5cGUgPSByZXF1aXJlKCBcInR5cGUtY29tcG9uZW50XCIgKTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxuICAgIGRlZXAgPSB0eXBlKCBhcmdzWyAwIF0gKSA9PT0gXCJib29sZWFuXCIgPyBhcmdzLnNoaWZ0KCkgOiBmYWxzZSxcbiAgICBvYmplY3RzID0gYXJncyxcbiAgICByZXN1bHQgPSB7fTtcblxuICBvYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uICggb2JqZWN0biApIHtcblxuICAgIGlmICggdHlwZSggb2JqZWN0biApICE9PSBcIm9iamVjdFwiICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKCBvYmplY3RuICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICBpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggb2JqZWN0biwga2V5ICkgKSB7XG4gICAgICAgIGlmICggZGVlcCAmJiB0eXBlKCBvYmplY3RuWyBrZXkgXSApID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBtZXJnZSggZGVlcCwge30sIHJlc3VsdFsga2V5IF0sIG9iamVjdG5bIGtleSBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0WyBrZXkgXSA9IG9iamVjdG5bIGtleSBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gKTtcblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTsiLCJ2YXIgT2JzZXJ2YWJsZUFycmF5ID0gZnVuY3Rpb24gKCBfYXJyYXkgKSB7XG5cdHZhciBoYW5kbGVycyA9IHt9LFxuXHRcdGFycmF5ID0gQXJyYXkuaXNBcnJheSggX2FycmF5ICkgPyBfYXJyYXkgOiBbXTtcblxuXHR2YXIgcHJveHkgPSBmdW5jdGlvbiAoIF9tZXRob2QsIF92YWx1ZSApIHtcblx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcblxuXHRcdGlmICggaGFuZGxlcnNbIF9tZXRob2QgXSApIHtcblx0XHRcdHJldHVybiBoYW5kbGVyc1sgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmdzICk7XG5cdFx0fVxuXHR9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwge1xuXHRcdG9uOiB7XG5cdFx0XHR2YWx1ZTogZnVuY3Rpb24gKCBfZXZlbnQsIF9jYWxsYmFjayApIHtcblx0XHRcdFx0aGFuZGxlcnNbIF9ldmVudCBdID0gX2NhbGxiYWNrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdwb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBwcm94eSggJ3BvcCcsIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19wb3AnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUucG9wLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ3NoaWZ0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdzaGlmdCcsIGFycmF5WyAwIF0gKTtcblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAnX19zaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zaGlmdC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdFsgJ3B1c2gnLCAncmV2ZXJzZScsICd1bnNoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcblx0XHR2YXIgcHJvcGVydGllcyA9IHt9O1xuXG5cdFx0cHJvcGVydGllc1sgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IHByb3h5LmJpbmQoIG51bGwsIF9tZXRob2QgKVxuXHRcdH07XG5cblx0XHRwcm9wZXJ0aWVzWyAnX18nICsgX21ldGhvZCBdID0ge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlWyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoIGFycmF5LCBwcm9wZXJ0aWVzICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gYXJyYXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmFibGVBcnJheTsiLCJtb2R1bGUuZXhwb3J0cz17XHJcblx0XCJkZWZhdWx0c1wiOiB7XHJcblx0XHRcImJhc2VVcmxcIjogXCJcIixcclxuXHRcdFwiaGVhZGVyc1wiOiB7fVxyXG5cdH1cclxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCAnLi9jb25maWcuanNvbicgKSxcclxuICBtb2xkeUFwaSA9IHtcclxuICAgIGFkYXB0ZXJzOiB7XHJcbiAgICAgIF9fZGVmYXVsdDogdm9pZCAwXHJcbiAgICB9LFxyXG4gICAgdXNlOiBmdW5jdGlvbiAoIGFkYXB0ZXIgKSB7XHJcbiAgICAgIGlmKCAhYWRhcHRlciB8fCAhYWRhcHRlci5uYW1lIHx8ICFhZGFwdGVyLmNyZWF0ZSB8fCAhYWRhcHRlci5maW5kIHx8ICFhZGFwdGVyLmZpbmRPbmUgfHwgIWFkYXB0ZXIuc2F2ZSB8fCAhYWRhcHRlci5kZXN0cm95ICkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvciggJ0ludmFsaWQgQWRhcHRlcicgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoICF0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCApIHtcclxuICAgICAgICB0aGlzLmFkYXB0ZXJzLl9fZGVmYXVsdCA9IGFkYXB0ZXI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYWRhcHRlcnNbIGFkYXB0ZXIubmFtZSBdID0gYWRhcHRlcjtcclxuICAgIH1cclxuICB9O1xyXG5cclxudmFyIE1vZGVsRmFjdG9yeSA9IHJlcXVpcmUoICcuL21vbGR5JyApKCByZXF1aXJlKCAnLi9tb2RlbCcgKSwgY29uZmlnLmRlZmF1bHRzLCBtb2xkeUFwaS5hZGFwdGVycyApO1xyXG5cclxubW9sZHlBcGkuZXh0ZW5kID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcbiAgcmV0dXJuIG5ldyBNb2RlbEZhY3RvcnkoIF9uYW1lLCBfcHJvcGVydGllcyApO1xyXG59O1xyXG5cclxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbW9sZHlBcGk7XHJcbmV4cG9ydHMuZGVmYXVsdHMgPSBjb25maWcuZGVmYXVsdHM7IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG5cdGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuXHRtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKTtcclxuXHJcbmV4cG9ydHMuYXR0cmlidXRlcyA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xyXG5cdHZhciB2YWx1ZTtcclxuXHJcblx0aWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XHJcblx0XHR2YWx1ZSA9IHtcclxuXHRcdFx0dHlwZTogX3ZhbHVlXHJcblx0XHR9O1xyXG5cdH0gZWxzZSBpZiAoIGlzLmFuLm9iamVjdCggX3ZhbHVlICkgJiYgX3ZhbHVlWyAnX19pc01vbGR5JyBdID09PSB0cnVlICkge1xyXG5cdFx0dmFsdWUgPSB7XHJcblx0XHRcdHR5cGU6ICdtb2xkeScsXHJcblx0XHRcdGRlZmF1bHQ6IF92YWx1ZVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHR2YWx1ZSA9IF92YWx1ZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBtZXJnZSgge1xyXG5cdFx0bmFtZTogX2tleSB8fCAnJyxcclxuXHRcdHR5cGU6ICcnLFxyXG5cdFx0ZGVmYXVsdDogbnVsbCxcclxuXHRcdG9wdGlvbmFsOiBmYWxzZVxyXG5cdH0sIHZhbHVlICk7XHJcbn07XHJcblxyXG5leHBvcnRzLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fX2RhdGFbIF9rZXkgXTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLmRlc3Ryb3llZEVycm9yID0gZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcblx0dmFyIGl0ZW0gPSB0eXBlb2YgX21vbGR5ID09PSAnb2JqZWN0JyA/IF9tb2xkeSA6IHt9O1xyXG5cdHJldHVybiBuZXcgRXJyb3IoICdUaGUgZ2l2ZW4gbW9sZHkgaXRlbSBgJyArIGl0ZW0uX19uYW1lICsgJ2AgaGFzIGJlZW4gZGVzdHJveWVkJyApO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NlbGYuYnVzeSA9IHRydWU7XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0cy5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCBfdmFsdWUgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxyXG5cdFx0XHR2YWx1ZSA9IGF0dHJpYnV0ZXMudHlwZSA/IGNhc3QoIF92YWx1ZSwgYXR0cmlidXRlcy50eXBlLCBhdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSApIDogX3ZhbHVlO1xyXG5cclxuXHRcdGlmICggc2VsZi5fX2RhdGFbIF9rZXkgXSAhPT0gdmFsdWUgKSB7XHJcblx0XHRcdHNlbGYuZW1pdCggJ2NoYW5nZScsIHNlbGYuX19kYXRhWyBfa2V5IF0sIHZhbHVlICk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5fX2RhdGFbIF9rZXkgXSA9IHZhbHVlO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydHMudW5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0X3NlbGYuYnVzeSA9IGZhbHNlO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxudmFyIF9leHRlbmQgPSBmdW5jdGlvbiAoIG9iaiApIHtcclxuXHRBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICkuZm9yRWFjaCggZnVuY3Rpb24gKCBzb3VyY2UgKSB7XHJcblx0XHRpZiAoIHNvdXJjZSApIHtcclxuXHRcdFx0Zm9yICggdmFyIHByb3AgaW4gc291cmNlICkge1xyXG5cdFx0XHRcdG9ialsgcHJvcCBdID0gc291cmNlWyBwcm9wIF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9ICk7XHJcblxyXG5cdHJldHVybiBvYmo7XHJcbn07XHJcblxyXG5leHBvcnRzLmV4dGVuZCA9IF9leHRlbmQ7XHJcblxyXG5leHBvcnRzLmV4dGVuZE9iamVjdCA9IGZ1bmN0aW9uICggcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMgKSB7XHJcblx0dmFyIHBhcmVudCA9IHRoaXM7XHJcblx0dmFyIGNoaWxkO1xyXG5cclxuXHRpZiAoIHByb3RvUHJvcHMgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBwcm90b1Byb3BzLCAnY29uc3RydWN0b3InICkgKSB7XHJcblx0XHRjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNoaWxkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gcGFyZW50LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRfZXh0ZW5kKCBjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyApO1xyXG5cclxuXHR2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG5cdH07XHJcblxyXG5cdFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cdGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XHJcblxyXG5cdGlmICggcHJvdG9Qcm9wcyApIF9leHRlbmQoIGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyApO1xyXG5cclxuXHRjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuXHRyZXR1cm4gY2hpbGQ7XHJcbn07IiwidmFyIGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcclxuXHRlbWl0dGVyID0gcmVxdWlyZSggJ2VtaXR0ZXItY29tcG9uZW50JyApLFxyXG5cdGd1aWQgPSByZXF1aXJlKCAnc2MtZ3VpZCcgKSxcclxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxyXG5cdGhlbHBlcnMgPSByZXF1aXJlKCAnLi9oZWxwZXJzJyApLFxyXG5cdGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxyXG5cdGV4dGVuZCA9IGhlbHBlcnMuZXh0ZW5kT2JqZWN0O1xyXG5cclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCBfaW5pdGlhbCwgX21vbGR5ICkge1xyXG5cdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdGluaXRpYWwgPSBfaW5pdGlhbCB8fCB7fTtcclxuXHJcblx0dGhpcy5fX21vbGR5ID0gX21vbGR5O1xyXG5cdHRoaXMuX19pc01vbGR5ID0gdHJ1ZTtcclxuXHR0aGlzLl9fYXR0cmlidXRlcyA9IHt9O1xyXG5cdHRoaXMuX19kYXRhID0ge307XHJcblx0dGhpcy5fX2Rlc3Ryb3llZCA9IGZhbHNlO1xyXG5cclxuXHRpZiAoICFzZWxmLl9fbW9sZHkuX19rZXlsZXNzICkge1xyXG5cdFx0c2VsZi5fX21vbGR5LiRkZWZpbmVQcm9wZXJ0eSggc2VsZiwgc2VsZi5fX21vbGR5Ll9fa2V5ICk7XHJcblx0fVxyXG5cclxuXHRPYmplY3Qua2V5cyggY2FzdCggc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGEsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0c2VsZi5fX21vbGR5LiRkZWZpbmVQcm9wZXJ0eSggc2VsZiwgX2tleSwgaW5pdGlhbFsgX2tleSBdICk7XHJcblx0fSApO1xyXG5cclxuXHRmb3IgKCB2YXIgaSBpbiBpbml0aWFsICkge1xyXG5cdFx0aWYgKCBpbml0aWFsLmhhc093blByb3BlcnR5KCBpICkgJiYgc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGFbIGkgXSApIHtcclxuXHRcdFx0dGhpc1sgaSBdID0gaW5pdGlhbFsgaSBdO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRPYmplY3Qua2V5cyggc2VsZi5fX21vbGR5Ll9fbWV0YWRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcblx0XHRpZiAoIGhhc0tleSggc2VsZlsgX2tleSBdLCAnX19pc01vbGR5JywgJ2Jvb2xlYW4nICkgJiYgc2VsZlsgX2tleSBdLl9faXNNb2xkeSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0c2VsZlsgX2tleSBdLiRjbGVhcigpO1xyXG5cdFx0fSBlbHNlIGlmICggc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXS5hcnJheU9mQVR5cGUgKSB7XHJcblx0XHRcdHdoaWxlICggc2VsZlsgX2tleSBdLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdFx0c2VsZlsgX2tleSBdLnNoaWZ0KCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNlbGZbIF9rZXkgXSA9IHNlbGYuX19kYXRhWyBfa2V5IF0gPSB2b2lkIDA7XHJcblx0XHR9XHJcblx0fSApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqICRjbG9uZSB3b24ndCB3b3JrIGN1cnJlbnRseVxyXG4gKiBAcGFyYW0gIHtbdHlwZV19IF9kYXRhIFtkZXNjcmlwdGlvbl1cclxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXHJcbiAqL1xyXG5Nb2RlbC5wcm90b3R5cGUuJGNsb25lID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRpbml0aWFsVmFsdWVzID0gdGhpcy4kanNvbigpO1xyXG5cclxuXHRoZWxwZXJzLmV4dGVuZCggaW5pdGlhbFZhbHVlcywgX2RhdGEgfHwge30gKTtcclxuXHJcblx0dmFyIG5ld01vbGR5ID0gdGhpcy5fX21vbGR5LmNyZWF0ZSggaW5pdGlhbFZhbHVlcyApO1xyXG5cclxuXHRyZXR1cm4gbmV3TW9sZHk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGRhdGEgPSBmdW5jdGlvbiAoIF9kYXRhICkge1xyXG5cdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdGRhdGEgPSBpcy5vYmplY3QoIF9kYXRhICkgPyBfZGF0YSA6IHt9O1xyXG5cclxuXHRpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XHJcblx0XHRyZXR1cm4gaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcblx0XHRpZiAoIHNlbGYuX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBfa2V5ICkgKSB7XHJcblx0XHRcdGlmICggaXMuYW4uYXJyYXkoIGRhdGFbIF9rZXkgXSApICYmIGhhc0tleSggc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSwgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApICYmIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlID09PSB0cnVlICkge1xyXG5cdFx0XHRcdGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcclxuXHRcdFx0XHRcdHNlbGZbIF9rZXkgXS5wdXNoKCBfbW9sZHkgKTtcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH0gZWxzZSBpZiAoIGlzLmEub2JqZWN0KCBkYXRhWyBfa2V5IF0gKSAmJiBzZWxmWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcclxuXHRcdFx0XHRzZWxmWyBfa2V5IF0uJGRhdGEoIGRhdGFbIF9rZXkgXSApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGZbIF9rZXkgXSA9IGRhdGFbIF9rZXkgXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0gKTtcclxuXHJcblx0cmV0dXJuIHNlbGY7XHJcbn07XHJcblxyXG5cclxuTW9kZWwucHJvdG90eXBlLiRkZXN0cm95ID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0ZWd1aWQgPSBndWlkLmdlbmVyYXRlKCksXHJcblx0XHRpc0RpcnR5ID0gc2VsZi4kaXNEaXJ0eSgpLFxyXG5cdFx0ZGF0YSA9IHNlbGYuJGpzb24oKSxcclxuXHRcdG1ldGhvZCA9ICdkZWxldGUnLFxyXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuXHRpZiAoIHNlbGYuX19kZXN0cm95ZWQgKSB7XHJcblx0XHRyZXR1cm4gY2FsbGJhY2suYXBwbHkoIHNlbGYsIFsgaGVscGVycy5kZXN0cm95ZWRFcnJvciggc2VsZiApIF0gKTtcclxuXHR9XHJcblxyXG5cdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeScsIGVndWlkICk7XHJcblx0c2VsZi5lbWl0KCAncHJlZGVzdHJveScsIHtcclxuXHRcdG1vbGR5OiBzZWxmLFxyXG5cdFx0ZGF0YTogZGF0YSxcclxuXHRcdG1ldGhvZDogbWV0aG9kLFxyXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXHJcblx0fSApO1xyXG5cclxuXHRpZiAoICFpc0RpcnR5ICkge1xyXG5cdFx0c2VsZi5fX21vbGR5Ll9fYWRhcHRlclsgc2VsZi5fX21vbGR5Ll9fYWRhcHRlck5hbWUgXS5kZXN0cm95LmNhbGwoIHNlbGYuX19tb2xkeSwgc2VsZi4kanNvbigpLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcclxuXHJcblx0XHRcdGlmICggX2Vycm9yICYmICEoIF9lcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XHJcblx0XHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZi5fX21vbGR5LmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdkZXN0cm95JywgX2Vycm9yLCBfcmVzICk7XHJcblx0XHRcdHNlbGYuX19kZXN0cm95ZWQgPSB0cnVlO1xyXG5cdFx0XHRzZWxmWyBzZWxmLl9fbW9sZHkuX19rZXkgXSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIF9yZXMgKTtcclxuXHRcdH0gKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soIG5ldyBFcnJvciggJ1RoaXMgbW9sZHkgY2Fubm90IGJlIGRlc3Ryb3llZCBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyIHlldC4nICkgKTtcclxuXHR9XHJcblxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRpc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB0aGlzLl9fZGVzdHJveWVkID8gdHJ1ZSA6IGlzLmVtcHR5KCB0aGlzWyB0aGlzLl9fbW9sZHkuX19rZXkgXSApO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRpc1ZhbGlkID0gZnVuY3Rpb24gKCkge1xyXG5cdGlmICggdGhpcy5fX2Rlc3Ryb3llZCApIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdGlzVmFsaWQgPSB0cnVlO1xyXG5cclxuXHRPYmplY3Qua2V5cyggc2VsZi5fX2F0dHJpYnV0ZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcblxyXG5cdFx0aWYgKCBzZWxmLiRpc0RpcnR5KCkgJiYgX2tleSA9PT0gc2VsZi5fX21vbGR5Ll9fa2V5ICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHZhbHVlID0gc2VsZlsgX2tleSBdLFxyXG5cdFx0XHRhdHRyaWJ1dGVzID0gc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSxcclxuXHRcdFx0dHlwZSA9IGF0dHJpYnV0ZXMudHlwZSxcclxuXHRcdFx0YXJyYXlPZkFUeXBlID0gaGFzS2V5KCBhdHRyaWJ1dGVzLCAnYXJyYXlPZkFUeXBlJywgJ2Jvb2xlYW4nICkgPyBhdHRyaWJ1dGVzLmFycmF5T2ZBVHlwZSA9PT0gdHJ1ZSA6IGZhbHNlLFxyXG5cdFx0XHRpc1JlcXVpcmVkID0gYXR0cmlidXRlcy5vcHRpb25hbCAhPT0gdHJ1ZSxcclxuXHRcdFx0aXNOdWxsT3JVbmRlZmluZWQgPSBzZWxmLl9fbW9sZHkuX19rZXlsZXNzID8gZmFsc2UgOiBhcnJheU9mQVR5cGUgPyB2YWx1ZS5sZW5ndGggPT09IDAgOiBpcy5udWxsT3JVbmRlZmluZWQoIHZhbHVlICksXHJcblx0XHRcdHR5cGVJc1dyb25nID0gaXMubm90LmVtcHR5KCB0eXBlICkgJiYgaXMuYS5zdHJpbmcoIHR5cGUgKSA/IGlzLm5vdC5hWyB0eXBlIF0oIHZhbHVlICkgOiBpc051bGxPclVuZGVmaW5lZDtcclxuXHJcblx0XHRpZiAoIGFycmF5T2ZBVHlwZSAmJiBpcy5ub3QuZW1wdHkoIHZhbHVlICkgJiYgdmFsdWVbIDAgXSBpbnN0YW5jZW9mIE1vZGVsICkge1xyXG5cdFx0XHR2YWx1ZS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9pdGVtICkge1xyXG5cdFx0XHRcdGlmICggaXNWYWxpZCAmJiBfaXRlbS4kaXNWYWxpZCgpID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRcdGlzVmFsaWQgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIGlzVmFsaWQgJiYgaXNSZXF1aXJlZCAmJiB0eXBlSXNXcm9uZyApIHtcclxuXHRcdFx0aXNWYWxpZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblxyXG5cdHJldHVybiBpc1ZhbGlkO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRqc29uID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdGRhdGEgPSBzZWxmLl9fZGF0YSxcclxuXHRcdGpzb24gPSB7fTtcclxuXHJcblx0T2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcblx0XHRpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBkYXRhWyBfa2V5IF1bIDAgXSBpbnN0YW5jZW9mIE1vZGVsICkge1xyXG5cdFx0XHRqc29uWyBfa2V5IF0gPSBbXTtcclxuXHRcdFx0ZGF0YVsgX2tleSBdLmZvckVhY2goIGZ1bmN0aW9uICggX21vbGR5ICkge1xyXG5cdFx0XHRcdGpzb25bIF9rZXkgXS5wdXNoKCBfbW9sZHkuJGpzb24oKSApO1xyXG5cdFx0XHR9ICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRqc29uWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCA/IGRhdGFbIF9rZXkgXS4kanNvbigpIDogZGF0YVsgX2tleSBdO1xyXG5cdFx0fVxyXG5cdH0gKTtcclxuXHJcblx0cmV0dXJuIGpzb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJHNhdmUgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRlcnJvciA9IG51bGwsXHJcblx0XHRlZ3VpZCA9IGd1aWQuZ2VuZXJhdGUoKSxcclxuXHRcdGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXHJcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxyXG5cdFx0bWV0aG9kID0gaXNEaXJ0eSA/ICdjcmVhdGUnIDogJ3NhdmUnLFxyXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuXHRzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG5cdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeScsIGVndWlkICk7XHJcblx0c2VsZi5lbWl0KCAncHJlc2F2ZScsIHtcclxuXHRcdG1vbGR5OiBzZWxmLFxyXG5cdFx0ZGF0YTogZGF0YSxcclxuXHRcdG1ldGhvZDogbWV0aG9kLFxyXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXHJcblx0fSApO1xyXG5cclxuXHR2YXIgcmVzcG9uc2VTaG91bGRDb250YWluQW5JZCA9IGhhc0tleSggZGF0YSwgc2VsZi5fX2tleSApICYmIGlzLm5vdC5lbXB0eSggZGF0YVsgc2VsZi5fX2tleSBdICk7XHJcblxyXG5cdHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJbIHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJOYW1lIF1bIG1ldGhvZCBdLmNhbGwoIHNlbGYuX19tb2xkeSwgZGF0YSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblxyXG5cdFx0aWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcclxuXHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFfZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIF9yZXMgKSAmJiAoIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgJiYgIWhhc0tleSggX3Jlcywgc2VsZi5fX21vbGR5Ll9fa2V5ICkgKSApIHtcclxuXHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIHNlbGYuX19tb2xkeS5fX2tleSArICdgJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggIV9lcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggX3JlcyApICkge1xyXG5cdFx0XHRzZWxmLl9fbW9sZHlbIHNlbGYuX19tb2xkeS5fX2tleSBdID0gX3Jlc1sgc2VsZi5fX21vbGR5Ll9fa2V5IF07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAhZXJyb3IgKSB7XHJcblx0XHRcdHNlbGYuJGRhdGEoIF9yZXMgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLmVtaXQoICdzYXZlJywgX2Vycm9yLCBzZWxmICk7XHJcblx0XHRzZWxmLl9fbW9sZHkuZW1pdCggJ2J1c3k6ZG9uZScsIGVndWlkICk7XHJcblxyXG5cdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soIF9lcnJvciwgc2VsZiApO1xyXG5cdH0gKTtcclxufTtcclxuXHJcbmVtaXR0ZXIoIE1vZGVsLnByb3RvdHlwZSApO1xyXG5cclxuTW9kZWwuZXh0ZW5kID0gZXh0ZW5kO1xyXG5cclxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwidmFyIGhlbHBlcnMgPSByZXF1aXJlKCBcIi4vaGVscGVycy9pbmRleFwiICksXHJcblx0ZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuXHRndWlkID0gcmVxdWlyZSggJ3NjLWd1aWQnICksXHJcblx0b2JzZXJ2YWJsZUFycmF5ID0gcmVxdWlyZSggJ3NnLW9ic2VydmFibGUtYXJyYXknICksXHJcblx0aGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKSxcclxuXHRpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuXHRtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKSxcclxuXHRjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggQmFzZU1vZGVsLCBkZWZhdWx0Q29uZmlndXJhdGlvbiwgYWRhcHRlciApIHtcclxuXHJcblx0dmFyIE1vbGR5ID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdHByb3BlcnRpZXMgPSBpcy5hbi5vYmplY3QoIF9wcm9wZXJ0aWVzICkgPyBfcHJvcGVydGllcyA6IHt9LFxyXG5cclxuXHRcdFx0aW5pdGlhbCA9IHByb3BlcnRpZXMuaW5pdGlhbCB8fCB7fTtcclxuXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggc2VsZiwge1xyXG5cdFx0XHRfX21vbGR5OiB7XHJcblx0XHRcdFx0dmFsdWU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0X19wcm9wZXJ0aWVzOiB7XHJcblx0XHRcdFx0dmFsdWU6IHByb3BlcnRpZXNbICdwcm9wZXJ0aWVzJyBdIHx8IHt9XHJcblx0XHRcdH0sXHJcblx0XHRcdF9fYWRhcHRlck5hbWU6IHtcclxuXHRcdFx0XHR2YWx1ZTogcHJvcGVydGllc1sgJ2FkYXB0ZXInIF0gfHwgJ19fZGVmYXVsdCdcclxuXHRcdFx0fSxcclxuXHRcdFx0X19tZXRhZGF0YToge1xyXG5cdFx0XHRcdHZhbHVlOiB7fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2Jhc2VVcmw6IHtcclxuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2Jhc2VVcmwnIF0sICdzdHJpbmcnLCAnJyApLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9fZGF0YToge1xyXG5cdFx0XHRcdHZhbHVlOiB7fSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2Rlc3Ryb3llZDoge1xyXG5cdFx0XHRcdHZhbHVlOiBmYWxzZSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2hlYWRlcnM6IHtcclxuXHRcdFx0XHR2YWx1ZTogbWVyZ2UoIHt9LCBjYXN0KCBwcm9wZXJ0aWVzWyAnaGVhZGVycycgXSwgJ29iamVjdCcsIHt9ICksIGNhc3QoIGRlZmF1bHRDb25maWd1cmF0aW9uLmhlYWRlcnMsICdvYmplY3QnLCB7fSApICksXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0X19rZXk6IHtcclxuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9fa2V5bGVzczoge1xyXG5cdFx0XHRcdHZhbHVlOiBwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSA9PT0gdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX25hbWU6IHtcclxuXHRcdFx0XHR2YWx1ZTogX25hbWUgfHwgcHJvcGVydGllc1sgJ25hbWUnIF0gfHwgJydcclxuXHRcdFx0fSxcclxuXHRcdFx0X191cmw6IHtcclxuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ3VybCcgXSwgJ3N0cmluZycsICcnICksXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0YnVzeToge1xyXG5cdFx0XHRcdHZhbHVlOiBmYWxzZSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0aWYgKCAhc2VsZi5fX2tleWxlc3MgKSB7XHJcblx0XHRcdHRoaXMuJHByb3BlcnR5KCB0aGlzLl9fa2V5ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0T2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19wcm9wZXJ0aWVzLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRcdFx0c2VsZi4kcHJvcGVydHkoIF9rZXksIHNlbGYuX19wcm9wZXJ0aWVzWyBfa2V5IF0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLnNjaGVtYSA9IGZ1bmN0aW9uICggc2NoZW1hICkge1xyXG5cclxuXHRcdE9iamVjdC5rZXlzKCBjYXN0KCBzY2hlbWEsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0XHRzZWxmLiRwcm9wZXJ0eSggX2tleSwgc2NoZW1hWyBfa2V5IF0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuYWRhcHRlciA9IGZ1bmN0aW9uICggYWRhcHRlciApIHtcclxuXHJcblx0XHRpZiAoICFhZGFwdGVyIHx8ICF0aGlzLl9fYWRhcHRlclsgYWRhcHRlciBdICkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiUHJvdmlkZSBhIHZhbGlkIGFkcGF0ZXIgXCIgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9fYWRhcHRlck5hbWUgPSBhZGFwdGVyO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS5wcm90byA9IGZ1bmN0aW9uICggcHJvdG8gKSB7XHJcblxyXG5cdFx0dGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gPSB0aGlzLl9fcHJvcGVydGllcy5wcm90byB8fCB7fTtcclxuXHRcdGhlbHBlcnMuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90bywgcHJvdG8gKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCBfaW5pdGlhbCApIHtcclxuXHRcdHZhciBLbGFzcyA9IEJhc2VNb2RlbC5leHRlbmQoIHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvIHx8IHt9ICk7XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBLbGFzcyggX2luaXRpYWwsIHRoaXMgKTtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuXHRcdFx0cmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IF9oZWFkZXJzIDogc2VsZi5fX2hlYWRlcnM7XHJcblx0XHRyZXR1cm4gaXMubm90LmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IHNlbGYuX19oZWFkZXJzIDogc2VsZjtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGZpbmRPbmUgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRlZ3VpZCA9IGd1aWQuZ2VuZXJhdGUoKSxcclxuXHRcdFx0cmVzdWx0LFxyXG5cdFx0XHR1cmwgPSBzZWxmLiR1cmwoKSxcclxuXHRcdFx0bWV0aG9kID0gJ2ZpbmRPbmUnLFxyXG5cdFx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcclxuXHRcdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcFxyXG5cdFx0XHR3YXNEZXN0cm95ZWQgPSBzZWxmLl9fZGVzdHJveWVkO1xyXG5cclxuXHRcdHNlbGYuZW1pdCggJ2J1c3knLCBlZ3VpZCApXHJcblx0XHRzZWxmLmVtaXQoICdwcmVmaW5kT25lJywge1xyXG5cdFx0XHRtb2xkeTogc2VsZixcclxuXHRcdFx0bWV0aG9kOiBtZXRob2QsXHJcblx0XHRcdHF1ZXJ5OiBxdWVyeSxcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRzZWxmLl9fYWRhcHRlclsgc2VsZi5fX2FkYXB0ZXJOYW1lIF0uZmluZE9uZS5jYWxsKCBzZWxmLCBfcXVlcnksIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG5cdFx0XHRpZiAoIF9lcnJvciAmJiAhKCBfZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xyXG5cdFx0XHRcdF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggIV9lcnJvciApIHtcclxuXHRcdFx0XHRpZiAoIGlzLmFycmF5KCBfcmVzICkgKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBzZWxmLmNyZWF0ZSggX3Jlc1sgMCBdICk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHNlbGYuY3JlYXRlKCBfcmVzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdmaW5kT25lJywgX2Vycm9yLCByZXN1bHQgKTtcclxuXHRcdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soIF9lcnJvciwgcmVzdWx0ICk7XHJcblx0XHR9ICk7XHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLiR1cmwgPSBmdW5jdGlvbiAoIF91cmwgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdGJhc2UgPSBpcy5lbXB0eSggc2VsZi4kYmFzZVVybCgpICkgPyAnJyA6IHNlbGYuJGJhc2VVcmwoKSxcclxuXHRcdFx0bmFtZSA9IGlzLmVtcHR5KCBzZWxmLl9fbmFtZSApID8gJycgOiAnLycgKyBzZWxmLl9fbmFtZS50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApLFxyXG5cdFx0XHR1cmwgPSBfdXJsIHx8IHNlbGYuX191cmwgfHwgJycsXHJcblx0XHRcdGVuZHBvaW50ID0gYmFzZSArIG5hbWUgKyAoIGlzLmVtcHR5KCB1cmwgKSA/ICcnIDogJy8nICsgdXJsLnRyaW0oKS5yZXBsYWNlKCAvXlxcLy8sICcnICkgKTtcclxuXHJcblx0XHRzZWxmLl9fdXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvXlxcLy8sICcnICk7XHJcblxyXG5cdFx0cmV0dXJuIGlzLm5vdC5hLnN0cmluZyggX3VybCApID8gZW5kcG9pbnQgOiBzZWxmO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS5fX2FkYXB0ZXIgPSBhZGFwdGVyO1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGJhc2VVcmwgPSBmdW5jdGlvbiAoIF9iYXNlICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHR1cmwgPSBjYXN0KCBfYmFzZSwgJ3N0cmluZycsIHNlbGYuX19iYXNlVXJsIHx8ICcnICk7XHJcblxyXG5cdFx0c2VsZi5fX2Jhc2VVcmwgPSB1cmwudHJpbSgpLnJlcGxhY2UoIC8oXFwvfFxccykrJC9nLCAnJyApIHx8IGRlZmF1bHRDb25maWd1cmF0aW9uLmJhc2VVcmwgfHwgJyc7XHJcblxyXG5cdFx0cmV0dXJuIGlzLm5vdC5hLnN0cmluZyggX2Jhc2UgKSA/IHNlbGYuX19iYXNlVXJsIDogc2VsZjtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGZpbmQgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRlZ3VpZCA9IGd1aWQuZ2VuZXJhdGUoKSxcclxuXHRcdFx0dXJsID0gc2VsZi4kdXJsKCksXHJcblx0XHRcdG1ldGhvZCA9ICdmaW5kJyxcclxuXHRcdFx0cmVzdWx0ID0gW10sXHJcblx0XHRcdHF1ZXJ5ID0gaXMuYW4ub2JqZWN0KCBfcXVlcnkgKSA/IF9xdWVyeSA6IHt9LFxyXG5cdFx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuXHRcdHNlbGYuZW1pdCggJ2J1c3knLCBlZ3VpZCApO1xyXG5cdFx0c2VsZi5lbWl0KCAncHJlZmluZCcsIHtcclxuXHRcdFx0bW9sZHk6IHNlbGYsXHJcblx0XHRcdG1ldGhvZDogbWV0aG9kLFxyXG5cdFx0XHRxdWVyeTogcXVlcnksXHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRjYWxsYmFjazogY2FsbGJhY2tcclxuXHRcdH0gKTtcclxuXHJcblx0XHRzZWxmLl9fYWRhcHRlclsgc2VsZi5fX2FkYXB0ZXJOYW1lIF0uZmluZC5jYWxsKCBzZWxmLCBfcXVlcnksIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG5cclxuXHRcdFx0aWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgX2Vycm9yICkgKSB7XHJcblx0XHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBpcy5hcnJheSggX3JlcyApICkge1xyXG5cdFx0XHRcdF9yZXMuZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBzZWxmLmNyZWF0ZSggX2RhdGEgKSApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCggc2VsZi5jcmVhdGUoIF9kYXRhICkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlcyA9IGNhc3QoIHJlc3VsdCBpbnN0YW5jZW9mIEJhc2VNb2RlbCB8fCBpcy5hbi5hcnJheSggcmVzdWx0ICkgPyByZXN1bHQgOiBudWxsLCAnYXJyYXknLCBbXSApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdmaW5kJywgX2Vycm9yLCByZXMgKTtcclxuXHJcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlcyApO1xyXG5cclxuXHRcdH0gKTtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKCBvYmosIGtleSwgdmFsdWUgKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRleGlzdGluZ1ZhbHVlID0gb2JqWyBrZXkgXSB8fCB2YWx1ZSxcclxuXHRcdFx0bWV0YWRhdGEgPSBzZWxmLl9fbWV0YWRhdGFbIGtleSBdO1xyXG5cclxuXHRcdGlmICggIW9iai5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgfHwgIW9iai5fX2F0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5TW9sZHkgfHwgbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlTdHJpbmcgKSB7XHJcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlcy50eXBlID0gbWV0YWRhdGEudmFsdWU7XHJcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheU1vbGR5O1xyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyA9IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5U3RyaW5nO1xyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG1ldGFkYXRhLnZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBuZXcgTW9sZHkoIG1ldGFkYXRhLnZhbHVlLm5hbWUsIG1ldGFkYXRhLnZhbHVlICkuY3JlYXRlKCksXHJcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdH0gKTtcclxuXHJcblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSApIHtcclxuXHJcblx0XHRcdFx0dmFyIGFycmF5ID0gb2JzZXJ2YWJsZUFycmF5KCBbXSApLFxyXG5cdFx0XHRcdFx0YXR0cmlidXRlVHlwZSA9IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyB8fCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA/IG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZVsgMCBdIDogJyonO1xyXG5cclxuXHRcdFx0XHRtZXRhZGF0YS5hdHRyaWJ1dGVzLmFycmF5T2ZBVHlwZSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBhcnJheSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcclxuXHJcblx0XHRcdFx0WyAncHVzaCcsICd1bnNoaWZ0JyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcclxuXHRcdFx0XHRcdGFycmF5Lm9uKCBfbWV0aG9kLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdFx0XHRhcmdzLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBtb2xkeSA9IG5ldyBNb2xkeSggYXR0cmlidXRlVHlwZVsgJ25hbWUnIF0sIGF0dHJpYnV0ZVR5cGUgKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YSA9IGlzLmFuLm9iamVjdCggX2l0ZW0gKSA/IF9pdGVtIDogbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIG1vbGR5LmNyZWF0ZSggZGF0YSApICk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlcy5wdXNoKCBjYXN0KCBfaXRlbSwgYXR0cmlidXRlVHlwZSwgbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCB2YWx1ZXMgKTtcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdGlmICggZXhpc3RpbmdWYWx1ZSAmJiBleGlzdGluZ1ZhbHVlLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdFx0XHRleGlzdGluZ1ZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggbyApIHtcclxuXHRcdFx0XHRcdFx0b2JqWyBrZXkgXS5wdXNoKCBvICk7XHJcblx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7XHJcblx0XHRcdFx0XHRnZXQ6IGhlbHBlcnMuZ2V0UHJvcGVydHkoIGtleSApLFxyXG5cdFx0XHRcdFx0c2V0OiBoZWxwZXJzLnNldFByb3BlcnR5KCBrZXkgKSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG9iai5fX2F0dHJpYnV0ZXNbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlcztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIGV4aXN0aW5nVmFsdWUgIT09IHZvaWQgMCApIHsgLy9pZiBleGlzdGluZyB2YWx1ZVxyXG5cdFx0XHRvYmpbIGtleSBdID0gZXhpc3RpbmdWYWx1ZTtcclxuXHRcdH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBvYmpbIGtleSBdICkgJiYgbWV0YWRhdGEuYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgJiYgaXMubm90Lm51bGxPclVuZGVmaW5lZCggbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApIHtcclxuXHRcdFx0b2JqWyBrZXkgXSA9IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xyXG5cdFx0fSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcclxuXHRcdFx0aWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5IHx8IG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XHJcblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gaXMuZW1wdHkoIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApID8gdW5kZWZpbmVkIDogY2FzdCggdW5kZWZpbmVkLCBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS4kcHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0YXR0cmlidXRlcyA9IG5ldyBoZWxwZXJzLmF0dHJpYnV0ZXMoIF9rZXksIF92YWx1ZSApLFxyXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ID0gaXMuYS5zdHJpbmcoIGF0dHJpYnV0ZXMudHlwZSApICYmIC9tb2xkeS8udGVzdCggYXR0cmlidXRlcy50eXBlICksXHJcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSBpcy5hbi5hcnJheSggYXR0cmlidXRlcy50eXBlICksXHJcblx0XHRcdHZhbHVlSXNBbkFycmF5TW9sZHkgPSBpcy5hbi5hcnJheSggX3ZhbHVlICkgJiYgaGFzS2V5KCBfdmFsdWVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG5cdFx0XHR2YWx1ZUlzQW5BcnJheVN0cmluZyA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBpcy5hLnN0cmluZyggX3ZhbHVlWyAwIF0gKSxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGhhc0tleSggYXR0cmlidXRlcy50eXBlWyAwIF0sICdwcm9wZXJ0aWVzJywgJ29iamVjdCcgKSxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gYXR0cmlidXRlVHlwZUlzQW5BcnJheSAmJiBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlWyAwIF0gKSAmJiBpcy5ub3QuZW1wdHkoIGF0dHJpYnV0ZXMudHlwZVsgMCBdICksXHJcblx0XHRcdHZhbHVlSXNBU3RhdGljTW9sZHkgPSBoYXNLZXkoIF92YWx1ZSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApO1xyXG5cclxuXHRcdHNlbGYuX19tZXRhZGF0YVsgX2tleSBdID0ge1xyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR2YWx1ZTogX3ZhbHVlLFxyXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5OiBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5LFxyXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkFycmF5OiBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5LFxyXG5cdFx0XHR2YWx1ZUlzQW5BcnJheU1vbGR5OiB2YWx1ZUlzQW5BcnJheU1vbGR5LFxyXG5cdFx0XHR2YWx1ZUlzQW5BcnJheVN0cmluZzogdmFsdWVJc0FuQXJyYXlTdHJpbmcsXHJcblx0XHRcdGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5OiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nOiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcsXHJcblx0XHRcdHZhbHVlSXNBU3RhdGljTW9sZHk6IHZhbHVlSXNBU3RhdGljTW9sZHlcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHNlbGY7XHJcblx0fTtcclxuXHJcblx0ZW1pdHRlciggTW9sZHkucHJvdG90eXBlICk7XHJcblxyXG5cdHJldHVybiBNb2xkeTtcclxuXHJcbn07Il19
(17)
});
