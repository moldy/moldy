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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtY2FzdC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWNhc3Qvbm9kZV9tb2R1bGVzL3NjLWNvbnRhaW5zL2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9ub2RlX21vZHVsZXMvc2MtZ3VpZC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWhhc2tleS9ub2RlX21vZHVsZXMvdHlwZS1jb21wb25lbnQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvZW1wdHkuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2d1aWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL251bGxvcnVuZGVmaW5lZC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL2lzZXMvdHlwZS5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NjLWlzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L25vZGVfbW9kdWxlcy9zYy1tZXJnZS9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvbm9kZV9tb2R1bGVzL3NnLW9ic2VydmFibGUtYXJyYXkvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvY29uZmlnLmpzb24iLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL21vbGR5L3NyYy9mYWtlX2EzMDk0MmM5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvaGVscGVycy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvbW9sZHkvc3JjL21vZGVsLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9tb2xkeS9zcmMvbW9sZHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwidmFyIGNvbnRhaW5zID0gcmVxdWlyZSggXCJzYy1jb250YWluc1wiICksXG4gIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICk7XG5cbnZhciBjYXN0ID0gZnVuY3Rpb24gKCBfdmFsdWUsIF9jYXN0VHlwZSwgX2RlZmF1bHQsIF92YWx1ZXMsIF9hZGRpdGlvbmFsUHJvcGVydGllcyApIHtcblxuICB2YXIgcGFyc2VkVmFsdWUsXG4gICAgY2FzdFR5cGUgPSBfY2FzdFR5cGUsXG4gICAgdmFsdWUsXG4gICAgdmFsdWVzID0gaXMuYW4uYXJyYXkoIF92YWx1ZXMgKSA/IF92YWx1ZXMgOiBbXTtcblxuICBzd2l0Y2ggKCB0cnVlICkge1xuICBjYXNlICggL2Zsb2F0fGludGVnZXIvLnRlc3QoIGNhc3RUeXBlICkgKTpcbiAgICBjYXN0VHlwZSA9IFwibnVtYmVyXCI7XG4gICAgYnJlYWs7XG4gIH1cblxuICBpZiAoIGlzLmFbIGNhc3RUeXBlIF0oIF92YWx1ZSApIHx8IGNhc3RUeXBlID09PSAnKicgKSB7XG5cbiAgICB2YWx1ZSA9IF92YWx1ZTtcblxuICB9IGVsc2Uge1xuXG4gICAgc3dpdGNoICggdHJ1ZSApIHtcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYXJyYXlcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKCBfdmFsdWUgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGlzLm5vdC5hbi5hcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgaWYgKCBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IFsgX3ZhbHVlIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJib29sZWFuXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gL14odHJ1ZXwxfHl8eWVzKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gdHJ1ZSA6IHVuZGVmaW5lZDtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgaWYgKCBpcy5ub3QuYS5ib29sZWFuKCB2YWx1ZSApICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSAvXihmYWxzZXwtMXwwfG58bm8pJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyBmYWxzZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gaXMuYS5ib29sZWFuKCB2YWx1ZSApID8gdmFsdWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJkYXRlXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZSggX3ZhbHVlICk7XG4gICAgICAgIHZhbHVlID0gaXNOYU4oIHZhbHVlLmdldFRpbWUoKSApID8gdW5kZWZpbmVkIDogdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcInN0cmluZ1wiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLnVuZGVmaW5lZCggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSBfdmFsdWUudG9TdHJpbmcoKVxuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcIm51bWJlclwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLm5vdC5hLm51bWJlciggdmFsdWUgKSB8fCBpc05hTiggdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgICAgY2FzZSBfY2FzdFR5cGUgPT09IFwiaW50ZWdlclwiOlxuICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoIHZhbHVlICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGNhc3QoIEpTT04ucGFyc2UoIF92YWx1ZSApLCBjYXN0VHlwZSApXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgfVxuXG4gIH1cblxuICBpZiAoIHZhbHVlcy5sZW5ndGggPiAwICYmICFjb250YWlucyggdmFsdWVzLCB2YWx1ZSApICkge1xuICAgIHZhbHVlID0gdmFsdWVzWyAwIF07XG4gIH1cblxuICByZXR1cm4gaXMubm90LnVuZGVmaW5lZCggdmFsdWUgKSA/IHZhbHVlIDogaXMubm90LnVuZGVmaW5lZCggX2RlZmF1bHQgKSA/IF9kZWZhdWx0IDogbnVsbDtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0OyIsInZhciBjb250YWlucyA9IGZ1bmN0aW9uICggZGF0YSwgaXRlbSApIHtcbiAgdmFyIGZvdW5kT25lID0gZmFsc2U7XG5cbiAgaWYgKCBBcnJheS5pc0FycmF5KCBkYXRhICkgKSB7XG5cbiAgICBkYXRhLmZvckVhY2goIGZ1bmN0aW9uICggYXJyYXlJdGVtICkge1xuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgaXRlbSA9PT0gYXJyYXlJdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gZWxzZSBpZiAoIE9iamVjdCggZGF0YSApID09PSBkYXRhICkge1xuXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgZGF0YVsga2V5IF0gPT09IGl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICB9XG4gIHJldHVybiBmb3VuZE9uZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7IiwidmFyIGd1aWRSeCA9IFwiez9bMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17MTJ9fT9cIjtcblxuZXhwb3J0cy5nZW5lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIGd1aWQgPSBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoIC9beHldL2csIGZ1bmN0aW9uICggYyApIHtcbiAgICB2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcbiAgICByZXR1cm4gKCBjID09PSBcInhcIiA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKCAxNiApO1xuICB9ICk7XG4gIHJldHVybiBndWlkO1xufTtcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICggc3RyaW5nICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUngsIFwiZ1wiICksXG4gICAgbWF0Y2hlcyA9ICggdHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIiA/IHN0cmluZyA6IFwiXCIgKS5tYXRjaCggcnggKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG1hdGNoZXMgKSA/IG1hdGNoZXMgOiBbXTtcbn07XG5cbmV4cG9ydHMuaXNWYWxpZCA9IGZ1bmN0aW9uICggZ3VpZCApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4ICk7XG4gIHJldHVybiByeC50ZXN0KCBndWlkICk7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICksXG4gIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIG9iamVjdCA9IHR5cGUoIG9iamVjdCApID09PSBcIm9iamVjdFwiID8gb2JqZWN0IDoge30sIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwiYXJyYXlcIiA/IGtleXMgOiBbXTtcbiAga2V5VHlwZSA9IHR5cGUoIGtleVR5cGUgKSA9PT0gXCJzdHJpbmdcIiA/IGtleVR5cGUgOiBcIlwiO1xuXG4gIHZhciBrZXkgPSBrZXlzLmxlbmd0aCA+IDAgPyBrZXlzLnNoaWZ0KCkgOiBcIlwiLFxuICAgIGtleUV4aXN0cyA9IGhhcy5jYWxsKCBvYmplY3QsIGtleSApIHx8IG9iamVjdFsga2V5IF0gIT09IHZvaWQgMCxcbiAgICBrZXlWYWx1ZSA9IGtleUV4aXN0cyA/IG9iamVjdFsga2V5IF0gOiB1bmRlZmluZWQsXG4gICAga2V5VHlwZUlzQ29ycmVjdCA9IHR5cGUoIGtleVZhbHVlICkgPT09IGtleVR5cGU7XG5cbiAgaWYgKCBrZXlzLmxlbmd0aCA+IDAgJiYga2V5RXhpc3RzICkge1xuICAgIHJldHVybiBoYXNLZXkoIG9iamVjdFsga2V5IF0sIGtleXMsIGtleVR5cGUgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzLmxlbmd0aCA+IDAgfHwga2V5VHlwZSA9PT0gXCJcIiA/IGtleUV4aXN0cyA6IGtleUV4aXN0cyAmJiBrZXlUeXBlSXNDb3JyZWN0O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJzdHJpbmdcIiA/IGtleXMuc3BsaXQoIFwiLlwiICkgOiBbXTtcblxuICByZXR1cm4gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKTtcblxufTsiLCJcbi8qKlxuICogdG9TdHJpbmcgcmVmLlxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogUmV0dXJuIHRoZSB0eXBlIG9mIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCl7XG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOiByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJztcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzogcmV0dXJuICdhcmd1bWVudHMnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi9pc2VzL3R5cGVcIiApLFxuICBpcyA9IHtcbiAgICBhOiB7fSxcbiAgICBhbjoge30sXG4gICAgbm90OiB7XG4gICAgICBhOiB7fSxcbiAgICAgIGFuOiB7fVxuICAgIH1cbiAgfTtcblxudmFyIGlzZXMgPSB7XG4gIFwiYXJndW1lbnRzXCI6IFsgXCJhcmd1bWVudHNcIiwgdHlwZSggXCJhcmd1bWVudHNcIiApIF0sXG4gIFwiYXJyYXlcIjogWyBcImFycmF5XCIsIHR5cGUoIFwiYXJyYXlcIiApIF0sXG4gIFwiYm9vbGVhblwiOiBbIFwiYm9vbGVhblwiLCB0eXBlKCBcImJvb2xlYW5cIiApIF0sXG4gIFwiZGF0ZVwiOiBbIFwiZGF0ZVwiLCB0eXBlKCBcImRhdGVcIiApIF0sXG4gIFwiZnVuY3Rpb25cIjogWyBcImZ1bmN0aW9uXCIsIFwiZnVuY1wiLCBcImZuXCIsIHR5cGUoIFwiZnVuY3Rpb25cIiApIF0sXG4gIFwibnVsbFwiOiBbIFwibnVsbFwiLCB0eXBlKCBcIm51bGxcIiApIF0sXG4gIFwibnVtYmVyXCI6IFsgXCJudW1iZXJcIiwgXCJpbnRlZ2VyXCIsIFwiaW50XCIsIHR5cGUoIFwibnVtYmVyXCIgKSBdLFxuICBcIm9iamVjdFwiOiBbIFwib2JqZWN0XCIsIHR5cGUoIFwib2JqZWN0XCIgKSBdLFxuICBcInJlZ2V4cFwiOiBbIFwicmVnZXhwXCIsIHR5cGUoIFwicmVnZXhwXCIgKSBdLFxuICBcInN0cmluZ1wiOiBbIFwic3RyaW5nXCIsIHR5cGUoIFwic3RyaW5nXCIgKSBdLFxuICBcInVuZGVmaW5lZFwiOiBbIFwidW5kZWZpbmVkXCIsIHR5cGUoIFwidW5kZWZpbmVkXCIgKSBdLFxuICBcImVtcHR5XCI6IFsgXCJlbXB0eVwiLCByZXF1aXJlKCBcIi4vaXNlcy9lbXB0eVwiICkgXSxcbiAgXCJudWxsb3J1bmRlZmluZWRcIjogWyBcIm51bGxPclVuZGVmaW5lZFwiLCBcIm51bGxvcnVuZGVmaW5lZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9udWxsb3J1bmRlZmluZWRcIiApIF0sXG4gIFwiZ3VpZFwiOiBbIFwiZ3VpZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9ndWlkXCIgKSBdXG59XG5cbk9iamVjdC5rZXlzKCBpc2VzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgdmFyIG1ldGhvZHMgPSBpc2VzWyBrZXkgXS5zbGljZSggMCwgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSApLFxuICAgIGZuID0gaXNlc1sga2V5IF1bIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgXTtcblxuICBtZXRob2RzLmZvckVhY2goIGZ1bmN0aW9uICggbWV0aG9kS2V5ICkge1xuICAgIGlzWyBtZXRob2RLZXkgXSA9IGlzLmFbIG1ldGhvZEtleSBdID0gaXMuYW5bIG1ldGhvZEtleSBdID0gZm47XG4gICAgaXMubm90WyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hWyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hblsgbWV0aG9kS2V5IF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApID8gZmFsc2UgOiB0cnVlO1xuICAgIH1cbiAgfSApO1xuXG59ICk7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGlzO1xuZXhwb3J0cy50eXBlID0gdHlwZTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoXCIuLi90eXBlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHZhciBlbXB0eSA9IGZhbHNlO1xuXG4gIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudWxsXCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgZW1wdHkgPSBPYmplY3Qua2V5cyggdmFsdWUgKS5sZW5ndGggPT09IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYm9vbGVhblwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IGZhbHNlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bWJlclwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IC0xO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImFycmF5XCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHJldHVybiBlbXB0eTtcblxufTsiLCJ2YXIgZ3VpZCA9IHJlcXVpcmUoIFwic2MtZ3VpZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGd1aWQuaXNWYWxpZCggdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuXHRyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gdm9pZCAwO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi4vdHlwZVwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfdHlwZSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xuICAgIHJldHVybiB0eXBlKCBfdmFsdWUgKSA9PT0gX3R5cGU7XG4gIH1cbn0iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsICkge1xuICBzd2l0Y2ggKCB0b1N0cmluZy5jYWxsKCB2YWwgKSApIHtcbiAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgIHJldHVybiAnZnVuY3Rpb24nO1xuICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICByZXR1cm4gJ2RhdGUnO1xuICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgIHJldHVybiAncmVnZXhwJztcbiAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzpcbiAgICByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gIGNhc2UgJ1tvYmplY3QgQXJyYXldJzpcbiAgICByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICggdmFsID09PSBudWxsICkgcmV0dXJuICdudWxsJztcbiAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKCB2YWwgPT09IE9iamVjdCggdmFsICkgKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICk7XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBkZWVwID0gdHlwZSggYXJnc1sgMCBdICkgPT09IFwiYm9vbGVhblwiID8gYXJncy5zaGlmdCgpIDogZmFsc2UsXG4gICAgb2JqZWN0cyA9IGFyZ3MsXG4gICAgcmVzdWx0ID0ge307XG5cbiAgb2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiAoIG9iamVjdG4gKSB7XG5cbiAgICBpZiAoIHR5cGUoIG9iamVjdG4gKSAhPT0gXCJvYmplY3RcIiApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyggb2JqZWN0biApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIG9iamVjdG4sIGtleSApICkge1xuICAgICAgICBpZiAoIGRlZXAgJiYgdHlwZSggb2JqZWN0blsga2V5IF0gKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gbWVyZ2UoIGRlZXAsIHt9LCByZXN1bHRbIGtleSBdLCBvYmplY3RuWyBrZXkgXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBvYmplY3RuWyBrZXkgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gKTtcblxuICB9ICk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7IiwidmFyIE9ic2VydmFibGVBcnJheSA9IGZ1bmN0aW9uICggX2FycmF5ICkge1xuXHR2YXIgaGFuZGxlcnMgPSB7fSxcblx0XHRhcnJheSA9IEFycmF5LmlzQXJyYXkoIF9hcnJheSApID8gX2FycmF5IDogW107XG5cblx0dmFyIHByb3h5ID0gZnVuY3Rpb24gKCBfbWV0aG9kLCBfdmFsdWUgKSB7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cblx0XHRpZiAoIGhhbmRsZXJzWyBfbWV0aG9kIF0gKSB7XG5cdFx0XHRyZXR1cm4gaGFuZGxlcnNbIF9tZXRob2QgXS5hcHBseSggYXJyYXksIGFyZ3MgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGFycmF5WyAnX18nICsgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJncyApO1xuXHRcdH1cblx0fTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggYXJyYXksIHtcblx0XHRvbjoge1xuXHRcdFx0dmFsdWU6IGZ1bmN0aW9uICggX2V2ZW50LCBfY2FsbGJhY2sgKSB7XG5cdFx0XHRcdGhhbmRsZXJzWyBfZXZlbnQgXSA9IF9jYWxsYmFjaztcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIGFycmF5LCAncG9wJywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gcHJveHkoICdwb3AnLCBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ19fcG9wJywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnBvcC5hcHBseSggYXJyYXksIGFyZ3VtZW50cyApO1xuXHRcdH1cblx0fSApO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggYXJyYXksICdzaGlmdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHByb3h5KCAnc2hpZnQnLCBhcnJheVsgMCBdICk7XG5cdFx0fVxuXHR9ICk7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCBhcnJheSwgJ19fc2hpZnQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2hpZnQuYXBwbHkoIGFycmF5LCBhcmd1bWVudHMgKTtcblx0XHR9XG5cdH0gKTtcblxuXHRbICdwdXNoJywgJ3JldmVyc2UnLCAndW5zaGlmdCcsICdzb3J0JywgJ3NwbGljZScgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tZXRob2QgKSB7XG5cdFx0dmFyIHByb3BlcnRpZXMgPSB7fTtcblxuXHRcdHByb3BlcnRpZXNbIF9tZXRob2QgXSA9IHtcblx0XHRcdHZhbHVlOiBwcm94eS5iaW5kKCBudWxsLCBfbWV0aG9kIClcblx0XHR9O1xuXG5cdFx0cHJvcGVydGllc1sgJ19fJyArIF9tZXRob2QgXSA9IHtcblx0XHRcdHZhbHVlOiBmdW5jdGlvbiAoIF92YWx1ZSApIHtcblx0XHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZVsgX21ldGhvZCBdLmFwcGx5KCBhcnJheSwgYXJndW1lbnRzICk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBhcnJheSwgcHJvcGVydGllcyApO1xuXHR9ICk7XG5cblx0cmV0dXJuIGFycmF5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZhYmxlQXJyYXk7IiwibW9kdWxlLmV4cG9ydHM9e1xyXG5cdFwiZGVmYXVsdHNcIjoge1xyXG5cdFx0XCJiYXNlVXJsXCI6IFwiXCIsXHJcblx0XHRcImhlYWRlcnNcIjoge31cclxuXHR9XHJcbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSggJy4vY29uZmlnLmpzb24nICksXHJcbiAgbW9sZHlBcGkgPSB7XHJcbiAgICBhZGFwdGVyczoge1xyXG4gICAgICBfX2RlZmF1bHQ6IHZvaWQgMFxyXG4gICAgfSxcclxuICAgIHVzZTogZnVuY3Rpb24gKCBhZGFwdGVyICkge1xyXG4gICAgICBpZiggIWFkYXB0ZXIgfHwgIWFkYXB0ZXIubmFtZSB8fCAhYWRhcHRlci5jcmVhdGUgfHwgIWFkYXB0ZXIuZmluZCB8fCAhYWRhcHRlci5maW5kT25lIHx8ICFhZGFwdGVyLnNhdmUgfHwgIWFkYXB0ZXIuZGVzdHJveSApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdJbnZhbGlkIEFkYXB0ZXInICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmKCAhdGhpcy5hZGFwdGVycy5fX2RlZmF1bHQgKSB7XHJcbiAgICAgICAgdGhpcy5hZGFwdGVycy5fX2RlZmF1bHQgPSBhZGFwdGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmFkYXB0ZXJzWyBhZGFwdGVyLm5hbWUgXSA9IGFkYXB0ZXI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbnZhciBNb2RlbEZhY3RvcnkgPSByZXF1aXJlKCAnLi9tb2xkeScgKSggcmVxdWlyZSggJy4vbW9kZWwnICksIGNvbmZpZy5kZWZhdWx0cywgbW9sZHlBcGkuYWRhcHRlcnMgKTtcclxuXHJcbm1vbGR5QXBpLmV4dGVuZCA9IGZ1bmN0aW9uICggX25hbWUsIF9wcm9wZXJ0aWVzICkge1xyXG4gIHJldHVybiBuZXcgTW9kZWxGYWN0b3J5KCBfbmFtZSwgX3Byb3BlcnRpZXMgKTtcclxufTtcclxuXHJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG1vbGR5QXBpO1xyXG5leHBvcnRzLmRlZmF1bHRzID0gY29uZmlnLmRlZmF1bHRzOyIsInZhciBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuXHRjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXHJcblx0bWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICk7XHJcblxyXG5leHBvcnRzLmF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcclxuXHR2YXIgdmFsdWU7XHJcblxyXG5cdGlmICggaXMuYS5zdHJpbmcoIF92YWx1ZSApICkge1xyXG5cdFx0dmFsdWUgPSB7XHJcblx0XHRcdHR5cGU6IF92YWx1ZVxyXG5cdFx0fTtcclxuXHR9IGVsc2UgaWYgKCBpcy5hbi5vYmplY3QoIF92YWx1ZSApICYmIF92YWx1ZVsgJ19faXNNb2xkeScgXSA9PT0gdHJ1ZSApIHtcclxuXHRcdHZhbHVlID0ge1xyXG5cdFx0XHR0eXBlOiAnbW9sZHknLFxyXG5cdFx0XHRkZWZhdWx0OiBfdmFsdWVcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFsdWUgPSBfdmFsdWU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gbWVyZ2UoIHtcclxuXHRcdG5hbWU6IF9rZXkgfHwgJycsXHJcblx0XHR0eXBlOiAnJyxcclxuXHRcdGRlZmF1bHQ6IG51bGwsXHJcblx0XHRvcHRpb25hbDogZmFsc2VcclxuXHR9LCB2YWx1ZSApO1xyXG59O1xyXG5cclxuZXhwb3J0cy5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX19kYXRhWyBfa2V5IF07XHJcblx0fVxyXG59O1xyXG5cclxuZXhwb3J0cy5kZXN0cm95ZWRFcnJvciA9IGZ1bmN0aW9uICggX21vbGR5ICkge1xyXG5cdHZhciBpdGVtID0gdHlwZW9mIF9tb2xkeSA9PT0gJ29iamVjdCcgPyBfbW9sZHkgOiB7fTtcclxuXHRyZXR1cm4gbmV3IEVycm9yKCAnVGhlIGdpdmVuIG1vbGR5IGl0ZW0gYCcgKyBpdGVtLl9fbmFtZSArICdgIGhhcyBiZWVuIGRlc3Ryb3llZCcgKTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2V0QnVzeSA9IGZ1bmN0aW9uICggX3NlbGYgKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZWxmLmJ1c3kgPSB0cnVlO1xyXG5cdH1cclxufTtcclxuXHJcbmV4cG9ydHMuc2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXkgKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRhdHRyaWJ1dGVzID0gc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSxcclxuXHRcdFx0dmFsdWUgPSBhdHRyaWJ1dGVzLnR5cGUgPyBjYXN0KCBfdmFsdWUsIGF0dHJpYnV0ZXMudHlwZSwgYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSA6IF92YWx1ZTtcclxuXHJcblx0XHRpZiAoIHNlbGYuX19kYXRhWyBfa2V5IF0gIT09IHZhbHVlICkge1xyXG5cdFx0XHRzZWxmLmVtaXQoICdjaGFuZ2UnLCBzZWxmLl9fZGF0YVsgX2tleSBdLCB2YWx1ZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSB2YWx1ZTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLnVuc2V0QnVzeSA9IGZ1bmN0aW9uICggX3NlbGYgKSB7XHJcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdF9zZWxmLmJ1c3kgPSBmYWxzZTtcclxuXHR9XHJcbn07XHJcblxyXG5leHBvcnRzLm5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbnZhciBfZXh0ZW5kID0gZnVuY3Rpb24gKCBvYmogKSB7XHJcblx0QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLmZvckVhY2goIGZ1bmN0aW9uICggc291cmNlICkge1xyXG5cdFx0aWYgKCBzb3VyY2UgKSB7XHJcblx0XHRcdGZvciAoIHZhciBwcm9wIGluIHNvdXJjZSApIHtcclxuXHRcdFx0XHRvYmpbIHByb3AgXSA9IHNvdXJjZVsgcHJvcCBdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSApO1xyXG5cclxuXHRyZXR1cm4gb2JqO1xyXG59O1xyXG5cclxuZXhwb3J0cy5leHRlbmQgPSBfZXh0ZW5kO1xyXG5cclxuZXhwb3J0cy5leHRlbmRPYmplY3QgPSBmdW5jdGlvbiAoIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzICkge1xyXG5cdHZhciBwYXJlbnQgPSB0aGlzO1xyXG5cdHZhciBjaGlsZDtcclxuXHJcblx0aWYgKCBwcm90b1Byb3BzICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggcHJvdG9Qcm9wcywgJ2NvbnN0cnVjdG9yJyApICkge1xyXG5cdFx0Y2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIHBhcmVudC5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0X2V4dGVuZCggY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMgKTtcclxuXHJcblx0dmFyIFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuXHR9O1xyXG5cclxuXHRTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHRjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuXHRpZiAoIHByb3RvUHJvcHMgKSBfZXh0ZW5kKCBjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMgKTtcclxuXHJcblx0Y2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcblx0cmV0dXJuIGNoaWxkO1xyXG59OyIsInZhciBjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXHJcblx0ZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuXHRndWlkID0gcmVxdWlyZSggJ3NjLWd1aWQnICksXHJcblx0aGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKSxcclxuXHRoZWxwZXJzID0gcmVxdWlyZSggJy4vaGVscGVycycgKSxcclxuXHRpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuXHRleHRlbmQgPSBoZWxwZXJzLmV4dGVuZE9iamVjdDtcclxuXHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICggX2luaXRpYWwsIF9tb2xkeSApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRpbml0aWFsID0gX2luaXRpYWwgfHwge307XHJcblxyXG5cdHRoaXMuX19tb2xkeSA9IF9tb2xkeTtcclxuXHR0aGlzLl9faXNNb2xkeSA9IHRydWU7XHJcblx0dGhpcy5fX2F0dHJpYnV0ZXMgPSB7fTtcclxuXHR0aGlzLl9fZGF0YSA9IHt9O1xyXG5cdHRoaXMuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcblx0aWYgKCAhc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyApIHtcclxuXHRcdHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIHNlbGYuX19tb2xkeS5fX2tleSApO1xyXG5cdH1cclxuXHJcblx0T2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRcdHNlbGYuX19tb2xkeS4kZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIGluaXRpYWxbIF9rZXkgXSApO1xyXG5cdH0gKTtcclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJGNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0T2JqZWN0LmtleXMoIHNlbGYuX19tb2xkeS5fX21ldGFkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0aWYgKCBoYXNLZXkoIHNlbGZbIF9rZXkgXSwgJ19faXNNb2xkeScsICdib29sZWFuJyApICYmIHNlbGZbIF9rZXkgXS5fX2lzTW9sZHkgPT09IHRydWUgKSB7XHJcblx0XHRcdHNlbGZbIF9rZXkgXS4kY2xlYXIoKTtcclxuXHRcdH0gZWxzZSBpZiAoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0uYXJyYXlPZkFUeXBlICkge1xyXG5cdFx0XHR3aGlsZSAoIHNlbGZbIF9rZXkgXS5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdHNlbGZbIF9rZXkgXS5zaGlmdCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmWyBfa2V5IF0gPSBzZWxmLl9fZGF0YVsgX2tleSBdID0gdm9pZCAwO1xyXG5cdFx0fVxyXG5cdH0gKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiAkY2xvbmUgd29uJ3Qgd29yayBjdXJyZW50bHlcclxuICogQHBhcmFtICB7W3R5cGVdfSBfZGF0YSBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxyXG4gKi9cclxuTW9kZWwucHJvdG90eXBlLiRjbG9uZSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0aW5pdGlhbFZhbHVlcyA9IHRoaXMuJGpzb24oKTtcclxuXHJcblx0aGVscGVycy5leHRlbmQoIGluaXRpYWxWYWx1ZXMsIF9kYXRhIHx8IHt9ICk7XHJcblxyXG5cdHZhciBuZXdNb2xkeSA9IHRoaXMuX19tb2xkeS5jcmVhdGUoIGluaXRpYWxWYWx1ZXMgKTtcclxuXHJcblx0cmV0dXJuIG5ld01vbGR5O1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLiRkYXRhID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRkYXRhID0gaXMub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiB7fTtcclxuXHJcblx0aWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG5cdFx0cmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuXHR9XHJcblxyXG5cdE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0aWYgKCBzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xyXG5cdFx0XHRpZiAoIGlzLmFuLmFycmF5KCBkYXRhWyBfa2V5IF0gKSAmJiBoYXNLZXkoIHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sICdhcnJheU9mQVR5cGUnLCAnYm9vbGVhbicgKSAmJiBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLmFycmF5T2ZBVHlwZSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRkYXRhWyBfa2V5IF0uZm9yRWFjaCggZnVuY3Rpb24gKCBfbW9sZHkgKSB7XHJcblx0XHRcdFx0XHRzZWxmWyBfa2V5IF0ucHVzaCggX21vbGR5ICk7XHJcblx0XHRcdFx0fSApO1xyXG5cdFx0XHR9IGVsc2UgaWYgKCBpcy5hLm9iamVjdCggZGF0YVsgX2tleSBdICkgJiYgc2VsZlsgX2tleSBdIGluc3RhbmNlb2YgTW9kZWwgKSB7XHJcblx0XHRcdFx0c2VsZlsgX2tleSBdLiRkYXRhKCBkYXRhWyBfa2V5IF0gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9ICk7XHJcblxyXG5cdHJldHVybiBzZWxmO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xyXG5cdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdGVndWlkID0gZ3VpZC5nZW5lcmF0ZSgpLFxyXG5cdFx0aXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcclxuXHRcdGRhdGEgPSBzZWxmLiRqc29uKCksXHJcblx0XHRtZXRob2QgPSAnZGVsZXRlJyxcclxuXHRcdGNhbGxiYWNrID0gaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcblx0aWYgKCBzZWxmLl9fZGVzdHJveWVkICkge1xyXG5cdFx0cmV0dXJuIGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKSBdICk7XHJcblx0fVxyXG5cclxuXHRzZWxmLl9fbW9sZHkuZW1pdCggJ2J1c3knLCBlZ3VpZCApO1xyXG5cdHNlbGYuZW1pdCggJ3ByZWRlc3Ryb3knLCB7XHJcblx0XHRtb2xkeTogc2VsZixcclxuXHRcdGRhdGE6IGRhdGEsXHJcblx0XHRtZXRob2Q6IG1ldGhvZCxcclxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xyXG5cdH0gKTtcclxuXHJcblx0aWYgKCAhaXNEaXJ0eSApIHtcclxuXHRcdHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJbIHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJOYW1lIF0uZGVzdHJveS5jYWxsKCBzZWxmLl9fbW9sZHksIHNlbGYuJGpzb24oKSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblxyXG5cdFx0XHRpZiAoIF9lcnJvciAmJiAhKCBfZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xyXG5cdFx0XHRcdF9lcnJvciA9IG5ldyBFcnJvciggJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeTpkb25lJywgZWd1aWQgKTtcclxuXHRcdFx0c2VsZi5lbWl0KCAnZGVzdHJveScsIF9lcnJvciwgX3JlcyApO1xyXG5cdFx0XHRzZWxmLl9fZGVzdHJveWVkID0gdHJ1ZTtcclxuXHRcdFx0c2VsZlsgc2VsZi5fX21vbGR5Ll9fa2V5IF0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRjYWxsYmFjayAmJiBjYWxsYmFjayggX2Vycm9yLCBfcmVzICk7XHJcblx0XHR9ICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBuZXcgRXJyb3IoICdUaGlzIG1vbGR5IGNhbm5vdCBiZSBkZXN0cm95ZWQgYmVjYXVzZSBpdCBoYXMgbm90IGJlZW4gc2F2ZWQgdG8gdGhlIHNlcnZlciB5ZXQuJyApICk7XHJcblx0fVxyXG5cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kaXNEaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gdGhpcy5fX2Rlc3Ryb3llZCA/IHRydWUgOiBpcy5lbXB0eSggdGhpc1sgdGhpcy5fX21vbGR5Ll9fa2V5IF0gKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRpZiAoIHRoaXMuX19kZXN0cm95ZWQgKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRpc1ZhbGlkID0gdHJ1ZTtcclxuXHJcblx0T2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cclxuXHRcdGlmICggc2VsZi4kaXNEaXJ0eSgpICYmIF9rZXkgPT09IHNlbGYuX19tb2xkeS5fX2tleSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB2YWx1ZSA9IHNlbGZbIF9rZXkgXSxcclxuXHRcdFx0YXR0cmlidXRlcyA9IHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0sXHJcblx0XHRcdHR5cGUgPSBhdHRyaWJ1dGVzLnR5cGUsXHJcblx0XHRcdGFycmF5T2ZBVHlwZSA9IGhhc0tleSggYXR0cmlidXRlcywgJ2FycmF5T2ZBVHlwZScsICdib29sZWFuJyApID8gYXR0cmlidXRlcy5hcnJheU9mQVR5cGUgPT09IHRydWUgOiBmYWxzZSxcclxuXHRcdFx0aXNSZXF1aXJlZCA9IGF0dHJpYnV0ZXMub3B0aW9uYWwgIT09IHRydWUsXHJcblx0XHRcdGlzTnVsbE9yVW5kZWZpbmVkID0gc2VsZi5fX21vbGR5Ll9fa2V5bGVzcyA/IGZhbHNlIDogYXJyYXlPZkFUeXBlID8gdmFsdWUubGVuZ3RoID09PSAwIDogaXMubnVsbE9yVW5kZWZpbmVkKCB2YWx1ZSApLFxyXG5cdFx0XHR0eXBlSXNXcm9uZyA9IGlzLm5vdC5lbXB0eSggdHlwZSApICYmIGlzLmEuc3RyaW5nKCB0eXBlICkgPyBpcy5ub3QuYVsgdHlwZSBdKCB2YWx1ZSApIDogaXNOdWxsT3JVbmRlZmluZWQ7XHJcblxyXG5cdFx0aWYgKCBhcnJheU9mQVR5cGUgJiYgaXMubm90LmVtcHR5KCB2YWx1ZSApICYmIHZhbHVlWyAwIF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcclxuXHRcdFx0dmFsdWUuZm9yRWFjaCggZnVuY3Rpb24gKCBfaXRlbSApIHtcclxuXHRcdFx0XHRpZiAoIGlzVmFsaWQgJiYgX2l0ZW0uJGlzVmFsaWQoKSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRpc1ZhbGlkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBpc1ZhbGlkICYmIGlzUmVxdWlyZWQgJiYgdHlwZUlzV3JvbmcgKSB7XHJcblx0XHRcdGlzVmFsaWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cclxuXHRyZXR1cm4gaXNWYWxpZDtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS4kanNvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRkYXRhID0gc2VsZi5fX2RhdGEsXHJcblx0XHRqc29uID0ge307XHJcblxyXG5cdE9iamVjdC5rZXlzKCBkYXRhICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0aWYgKCBpcy5hbi5hcnJheSggZGF0YVsgX2tleSBdICkgJiYgZGF0YVsgX2tleSBdWyAwIF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcclxuXHRcdFx0anNvblsgX2tleSBdID0gW107XHJcblx0XHRcdGRhdGFbIF9rZXkgXS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9tb2xkeSApIHtcclxuXHRcdFx0XHRqc29uWyBfa2V5IF0ucHVzaCggX21vbGR5LiRqc29uKCkgKTtcclxuXHRcdFx0fSApO1xyXG5cdFx0fSBlbHNlIGlmICggaXMuYS5kYXRlKCBkYXRhWyBfa2V5IF0gKSApIHtcclxuXHRcdFx0anNvblsgX2tleSBdID0gZGF0YVsgX2tleSBdLnRvSVNPU3RyaW5nKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRqc29uWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCA/IGRhdGFbIF9rZXkgXS4kanNvbigpIDogZGF0YVsgX2tleSBdO1xyXG5cdFx0fVxyXG5cdH0gKTtcclxuXHJcblx0cmV0dXJuIGpzb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuJHNhdmUgPSBmdW5jdGlvbiAoIF9jYWxsYmFjayApIHtcclxuXHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRlcnJvciA9IG51bGwsXHJcblx0XHRlZ3VpZCA9IGd1aWQuZ2VuZXJhdGUoKSxcclxuXHRcdGlzRGlydHkgPSBzZWxmLiRpc0RpcnR5KCksXHJcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxyXG5cdFx0bWV0aG9kID0gaXNEaXJ0eSA/ICdjcmVhdGUnIDogJ3NhdmUnLFxyXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xyXG5cclxuXHRzZWxmLl9fZGVzdHJveWVkID0gZmFsc2U7XHJcblxyXG5cdHNlbGYuX19tb2xkeS5lbWl0KCAnYnVzeScsIGVndWlkICk7XHJcblx0c2VsZi5lbWl0KCAncHJlc2F2ZScsIHtcclxuXHRcdG1vbGR5OiBzZWxmLFxyXG5cdFx0ZGF0YTogZGF0YSxcclxuXHRcdG1ldGhvZDogbWV0aG9kLFxyXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXHJcblx0fSApO1xyXG5cclxuXHR2YXIgcmVzcG9uc2VTaG91bGRDb250YWluQW5JZCA9IGhhc0tleSggZGF0YSwgc2VsZi5fX2tleSApICYmIGlzLm5vdC5lbXB0eSggZGF0YVsgc2VsZi5fX2tleSBdICk7XHJcblxyXG5cdHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJbIHNlbGYuX19tb2xkeS5fX2FkYXB0ZXJOYW1lIF1bIG1ldGhvZCBdLmNhbGwoIHNlbGYuX19tb2xkeSwgZGF0YSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblxyXG5cdFx0aWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgRXJyb3IgKSApIHtcclxuXHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICFfZXJyb3IgJiYgaXNEaXJ0eSAmJiBpcy5vYmplY3QoIF9yZXMgKSAmJiAoIHJlc3BvbnNlU2hvdWxkQ29udGFpbkFuSWQgJiYgIWhhc0tleSggX3Jlcywgc2VsZi5fX21vbGR5Ll9fa2V5ICkgKSApIHtcclxuXHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnVGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBkaWQgbm90IGNvbnRhaW4gYSB2YWxpZCBgJyArIHNlbGYuX19tb2xkeS5fX2tleSArICdgJyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggIV9lcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggX3JlcyApICkge1xyXG5cdFx0XHRzZWxmLl9fbW9sZHlbIHNlbGYuX19tb2xkeS5fX2tleSBdID0gX3Jlc1sgc2VsZi5fX21vbGR5Ll9fa2V5IF07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCAhZXJyb3IgKSB7XHJcblx0XHRcdHNlbGYuJGRhdGEoIF9yZXMgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLmVtaXQoICdzYXZlJywgX2Vycm9yLCBzZWxmICk7XHJcblx0XHRzZWxmLl9fbW9sZHkuZW1pdCggJ2J1c3k6ZG9uZScsIGVndWlkICk7XHJcblxyXG5cdFx0Y2FsbGJhY2sgJiYgY2FsbGJhY2soIF9lcnJvciwgc2VsZiApO1xyXG5cdH0gKTtcclxufTtcclxuXHJcbmVtaXR0ZXIoIE1vZGVsLnByb3RvdHlwZSApO1xyXG5cclxuTW9kZWwuZXh0ZW5kID0gZXh0ZW5kO1xyXG5cclxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gTW9kZWw7IiwidmFyIGhlbHBlcnMgPSByZXF1aXJlKCBcIi4vaGVscGVycy9pbmRleFwiICksXHJcblx0ZW1pdHRlciA9IHJlcXVpcmUoICdlbWl0dGVyLWNvbXBvbmVudCcgKSxcclxuXHRndWlkID0gcmVxdWlyZSggJ3NjLWd1aWQnICksXHJcblx0b2JzZXJ2YWJsZUFycmF5ID0gcmVxdWlyZSggJ3NnLW9ic2VydmFibGUtYXJyYXknICksXHJcblx0aGFzS2V5ID0gcmVxdWlyZSggJ3NjLWhhc2tleScgKSxcclxuXHRpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcclxuXHRtZXJnZSA9IHJlcXVpcmUoICdzYy1tZXJnZScgKSxcclxuXHRjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggQmFzZU1vZGVsLCBkZWZhdWx0Q29uZmlndXJhdGlvbiwgYWRhcHRlciApIHtcclxuXHJcblx0dmFyIE1vbGR5ID0gZnVuY3Rpb24gKCBfbmFtZSwgX3Byb3BlcnRpZXMgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdHByb3BlcnRpZXMgPSBpcy5hbi5vYmplY3QoIF9wcm9wZXJ0aWVzICkgPyBfcHJvcGVydGllcyA6IHt9LFxyXG5cclxuXHRcdFx0aW5pdGlhbCA9IHByb3BlcnRpZXMuaW5pdGlhbCB8fCB7fTtcclxuXHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyggc2VsZiwge1xyXG5cdFx0XHRfX21vbGR5OiB7XHJcblx0XHRcdFx0dmFsdWU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0X19wcm9wZXJ0aWVzOiB7XHJcblx0XHRcdFx0dmFsdWU6IHByb3BlcnRpZXNbICdwcm9wZXJ0aWVzJyBdIHx8IHt9XHJcblx0XHRcdH0sXHJcblx0XHRcdF9fYWRhcHRlck5hbWU6IHtcclxuXHRcdFx0XHR2YWx1ZTogcHJvcGVydGllc1sgJ2FkYXB0ZXInIF0gfHwgJ19fZGVmYXVsdCdcclxuXHRcdFx0fSxcclxuXHRcdFx0X19tZXRhZGF0YToge1xyXG5cdFx0XHRcdHZhbHVlOiB7fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2Jhc2VVcmw6IHtcclxuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2Jhc2VVcmwnIF0sICdzdHJpbmcnLCAnJyApLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9fZGF0YToge1xyXG5cdFx0XHRcdHZhbHVlOiB7fSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2Rlc3Ryb3llZDoge1xyXG5cdFx0XHRcdHZhbHVlOiBmYWxzZSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX2hlYWRlcnM6IHtcclxuXHRcdFx0XHR2YWx1ZTogbWVyZ2UoIHt9LCBjYXN0KCBwcm9wZXJ0aWVzWyAnaGVhZGVycycgXSwgJ29iamVjdCcsIHt9ICksIGNhc3QoIGRlZmF1bHRDb25maWd1cmF0aW9uLmhlYWRlcnMsICdvYmplY3QnLCB7fSApICksXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0X19rZXk6IHtcclxuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ2tleScgXSwgJ3N0cmluZycsICdpZCcgKSB8fCAnaWQnLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlXHJcblx0XHRcdH0sXHJcblx0XHRcdF9fa2V5bGVzczoge1xyXG5cdFx0XHRcdHZhbHVlOiBwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSA9PT0gdHJ1ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRfX25hbWU6IHtcclxuXHRcdFx0XHR2YWx1ZTogX25hbWUgfHwgcHJvcGVydGllc1sgJ25hbWUnIF0gfHwgJydcclxuXHRcdFx0fSxcclxuXHRcdFx0X191cmw6IHtcclxuXHRcdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ3VybCcgXSwgJ3N0cmluZycsICcnICksXHJcblx0XHRcdFx0d3JpdGFibGU6IHRydWVcclxuXHRcdFx0fSxcclxuXHRcdFx0YnVzeToge1xyXG5cdFx0XHRcdHZhbHVlOiBmYWxzZSxcclxuXHRcdFx0XHR3cml0YWJsZTogdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0aWYgKCAhc2VsZi5fX2tleWxlc3MgKSB7XHJcblx0XHRcdHRoaXMuJHByb3BlcnR5KCB0aGlzLl9fa2V5ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0T2JqZWN0LmtleXMoIGNhc3QoIHNlbGYuX19wcm9wZXJ0aWVzLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcclxuXHRcdFx0c2VsZi4kcHJvcGVydHkoIF9rZXksIHNlbGYuX19wcm9wZXJ0aWVzWyBfa2V5IF0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLnNjaGVtYSA9IGZ1bmN0aW9uICggc2NoZW1hICkge1xyXG5cclxuXHRcdE9iamVjdC5rZXlzKCBjYXN0KCBzY2hlbWEsICdvYmplY3QnLCB7fSApICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xyXG5cdFx0XHRzZWxmLiRwcm9wZXJ0eSggX2tleSwgc2NoZW1hWyBfa2V5IF0gKTtcclxuXHRcdH0gKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuYWRhcHRlciA9IGZ1bmN0aW9uICggYWRhcHRlciApIHtcclxuXHJcblx0XHRpZiAoICFhZGFwdGVyIHx8ICF0aGlzLl9fYWRhcHRlclsgYWRhcHRlciBdICkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiUHJvdmlkZSBhIHZhbGlkIGFkcGF0ZXIgXCIgKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9fYWRhcHRlck5hbWUgPSBhZGFwdGVyO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS5wcm90byA9IGZ1bmN0aW9uICggcHJvdG8gKSB7XHJcblxyXG5cdFx0dGhpcy5fX3Byb3BlcnRpZXMucHJvdG8gPSB0aGlzLl9fcHJvcGVydGllcy5wcm90byB8fCB7fTtcclxuXHRcdGhlbHBlcnMuZXh0ZW5kKCB0aGlzLl9fcHJvcGVydGllcy5wcm90bywgcHJvdG8gKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCBfaW5pdGlhbCApIHtcclxuXHRcdHZhciBLbGFzcyA9IEJhc2VNb2RlbC5leHRlbmQoIHRoaXMuX19wcm9wZXJ0aWVzLnByb3RvIHx8IHt9ICk7XHJcblxyXG5cdFx0cmV0dXJuIG5ldyBLbGFzcyggX2luaXRpYWwsIHRoaXMgKTtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdGlmICggc2VsZi5fX2Rlc3Ryb3llZCApIHtcclxuXHRcdFx0cmV0dXJuIGhlbHBlcnMuZGVzdHJveWVkRXJyb3IoIHNlbGYgKTtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IF9oZWFkZXJzIDogc2VsZi5fX2hlYWRlcnM7XHJcblx0XHRyZXR1cm4gaXMubm90LmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IHNlbGYuX19oZWFkZXJzIDogc2VsZjtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGZpbmRPbmUgPSBmdW5jdGlvbiAoIF9xdWVyeSwgX2NhbGxiYWNrICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRlZ3VpZCA9IGd1aWQuZ2VuZXJhdGUoKSxcclxuXHRcdFx0cmVzdWx0LFxyXG5cdFx0XHR1cmwgPSBzZWxmLiR1cmwoKSxcclxuXHRcdFx0bWV0aG9kID0gJ2ZpbmRPbmUnLFxyXG5cdFx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcclxuXHRcdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcFxyXG5cdFx0XHR3YXNEZXN0cm95ZWQgPSBzZWxmLl9fZGVzdHJveWVkO1xyXG5cclxuXHRcdHNlbGYuZW1pdCggJ2J1c3knLCBlZ3VpZCApXHJcblx0XHRzZWxmLmVtaXQoICdwcmVmaW5kT25lJywge1xyXG5cdFx0XHRtb2xkeTogc2VsZixcclxuXHRcdFx0bWV0aG9kOiBtZXRob2QsXHJcblx0XHRcdHF1ZXJ5OiBxdWVyeSxcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdGNhbGxiYWNrOiBjYWxsYmFja1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdHNlbGYuX19kZXN0cm95ZWQgPSBmYWxzZTtcclxuXHJcblx0XHRzZWxmLl9fYWRhcHRlclsgc2VsZi5fX2FkYXB0ZXJOYW1lIF0uZmluZE9uZS5jYWxsKCBzZWxmLCBxdWVyeSwgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXMgKSB7XHJcblx0XHRcdGlmICggX2Vycm9yICYmICEoIF9lcnJvciBpbnN0YW5jZW9mIEVycm9yICkgKSB7XHJcblx0XHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBpcy5lbXB0eSggX3JlcyApICkge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoIGlzLmFycmF5KCBfcmVzICkgKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBzZWxmLmNyZWF0ZSggX3Jlc1sgMCBdICk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHNlbGYuY3JlYXRlKCBfcmVzICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdmaW5kT25lJywgX2Vycm9yLCByZXN1bHQgKTtcclxuXHJcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlc3VsdCApO1xyXG5cdFx0fSApO1xyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS4kdXJsID0gZnVuY3Rpb24gKCBfdXJsICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRiYXNlID0gaXMuZW1wdHkoIHNlbGYuJGJhc2VVcmwoKSApID8gJycgOiBzZWxmLiRiYXNlVXJsKCksXHJcblx0XHRcdG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcclxuXHRcdFx0dXJsID0gX3VybCB8fCBzZWxmLl9fdXJsIHx8ICcnLFxyXG5cdFx0XHRlbmRwb2ludCA9IGJhc2UgKyBuYW1lICsgKCBpcy5lbXB0eSggdXJsICkgPyAnJyA6ICcvJyArIHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApICk7XHJcblxyXG5cdFx0c2VsZi5fX3VybCA9IHVybC50cmltKCkucmVwbGFjZSggL15cXC8vLCAnJyApO1xyXG5cclxuXHRcdHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF91cmwgKSA/IGVuZHBvaW50IDogc2VsZjtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuX19hZGFwdGVyID0gYWRhcHRlcjtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLiRiYXNlVXJsID0gZnVuY3Rpb24gKCBfYmFzZSApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0dXJsID0gY2FzdCggX2Jhc2UsICdzdHJpbmcnLCBzZWxmLl9fYmFzZVVybCB8fCAnJyApO1xyXG5cclxuXHRcdHNlbGYuX19iYXNlVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvKFxcL3xcXHMpKyQvZywgJycgKSB8fCBkZWZhdWx0Q29uZmlndXJhdGlvbi5iYXNlVXJsIHx8ICcnO1xyXG5cclxuXHRcdHJldHVybiBpcy5ub3QuYS5zdHJpbmcoIF9iYXNlICkgPyBzZWxmLl9fYmFzZVVybCA6IHNlbGY7XHJcblx0fTtcclxuXHJcblx0TW9sZHkucHJvdG90eXBlLiRmaW5kID0gZnVuY3Rpb24gKCBfcXVlcnksIF9jYWxsYmFjayApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0ZWd1aWQgPSBndWlkLmdlbmVyYXRlKCksXHJcblx0XHRcdHVybCA9IHNlbGYuJHVybCgpLFxyXG5cdFx0XHRtZXRob2QgPSAnZmluZCcsXHJcblx0XHRcdHJlc3VsdCA9IFtdLFxyXG5cdFx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcclxuXHRcdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9xdWVyeSApID8gX3F1ZXJ5IDogaXMuYS5mdW5jKCBfY2FsbGJhY2sgKSA/IF9jYWxsYmFjayA6IGhlbHBlcnMubm9vcDtcclxuXHJcblx0XHRzZWxmLmVtaXQoICdidXN5JywgZWd1aWQgKTtcclxuXHRcdHNlbGYuZW1pdCggJ3ByZWZpbmQnLCB7XHJcblx0XHRcdG1vbGR5OiBzZWxmLFxyXG5cdFx0XHRtZXRob2Q6IG1ldGhvZCxcclxuXHRcdFx0cXVlcnk6IHF1ZXJ5LFxyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0c2VsZi5fX2FkYXB0ZXJbIHNlbGYuX19hZGFwdGVyTmFtZSBdLmZpbmQuY2FsbCggc2VsZiwgcXVlcnksIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xyXG5cclxuXHRcdFx0aWYgKCBfZXJyb3IgJiYgISggX2Vycm9yIGluc3RhbmNlb2YgX2Vycm9yICkgKSB7XHJcblx0XHRcdFx0X2Vycm9yID0gbmV3IEVycm9yKCAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBpcy5hcnJheSggX3JlcyApICkge1xyXG5cdFx0XHRcdF9yZXMuZm9yRWFjaCggZnVuY3Rpb24gKCBfZGF0YSApIHtcclxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKCBzZWxmLmNyZWF0ZSggX2RhdGEgKSApO1xyXG5cdFx0XHRcdH0gKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCggc2VsZi5jcmVhdGUoIF9kYXRhICkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHJlcyA9IGNhc3QoIHJlc3VsdCBpbnN0YW5jZW9mIEJhc2VNb2RlbCB8fCBpcy5hbi5hcnJheSggcmVzdWx0ICkgPyByZXN1bHQgOiBudWxsLCAnYXJyYXknLCBbXSApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdidXN5OmRvbmUnLCBlZ3VpZCApO1xyXG5cdFx0XHRzZWxmLmVtaXQoICdmaW5kJywgX2Vycm9yLCByZXMgKTtcclxuXHJcblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKCBfZXJyb3IsIHJlcyApO1xyXG5cclxuXHRcdH0gKTtcclxuXHR9O1xyXG5cclxuXHRNb2xkeS5wcm90b3R5cGUuJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKCBvYmosIGtleSwgdmFsdWUgKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRleGlzdGluZ1ZhbHVlID0gb2JqWyBrZXkgXSB8fCB2YWx1ZSxcclxuXHRcdFx0bWV0YWRhdGEgPSBzZWxmLl9fbWV0YWRhdGFbIGtleSBdO1xyXG5cclxuXHRcdGlmICggIW9iai5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgfHwgIW9iai5fX2F0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoIGtleSApICkge1xyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5TW9sZHkgfHwgbWV0YWRhdGEudmFsdWVJc0FuQXJyYXlTdHJpbmcgKSB7XHJcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlcy50eXBlID0gbWV0YWRhdGEudmFsdWU7XHJcblx0XHRcdFx0bWV0YWRhdGEuYXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBtZXRhZGF0YS52YWx1ZUlzQW5BcnJheU1vbGR5O1xyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyA9IG1ldGFkYXRhLnZhbHVlSXNBbkFycmF5U3RyaW5nO1xyXG5cdFx0XHRcdG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBtZXRhZGF0YS5hdHRyaWJ1dGVzWyAnZGVmYXVsdCcgXSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG1ldGFkYXRhLnZhbHVlSXNBU3RhdGljTW9sZHkgKSB7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBuZXcgTW9sZHkoIG1ldGFkYXRhLnZhbHVlLm5hbWUsIG1ldGFkYXRhLnZhbHVlICkuY3JlYXRlKCBleGlzdGluZ1ZhbHVlICksXHJcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdH0gKTtcclxuXHJcblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggbWV0YWRhdGEuYXR0cmlidXRlVHlwZUlzQW5BcnJheSApIHtcclxuXHJcblx0XHRcdFx0dmFyIGFycmF5ID0gb2JzZXJ2YWJsZUFycmF5KCBbXSApLFxyXG5cdFx0XHRcdFx0YXR0cmlidXRlVHlwZSA9IG1ldGFkYXRhLmF0dHJpYnV0ZUFycmF5VHlwZUlzQVN0cmluZyB8fCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSA/IG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZVsgMCBdIDogJyonO1xyXG5cclxuXHRcdFx0XHRtZXRhZGF0YS5hdHRyaWJ1dGVzLmFycmF5T2ZBVHlwZSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggb2JqLCBrZXksIHtcclxuXHRcdFx0XHRcdHZhbHVlOiBhcnJheSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gb2JqWyBrZXkgXTtcclxuXHJcblx0XHRcdFx0WyAncHVzaCcsICd1bnNoaWZ0JyBdLmZvckVhY2goIGZ1bmN0aW9uICggX21ldGhvZCApIHtcclxuXHRcdFx0XHRcdGFycmF5Lm9uKCBfbWV0aG9kLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApLFxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlcyA9IFtdO1xyXG5cdFx0XHRcdFx0XHRhcmdzLmZvckVhY2goIGZ1bmN0aW9uICggX2l0ZW0gKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBtb2xkeSA9IG5ldyBNb2xkeSggYXR0cmlidXRlVHlwZVsgJ25hbWUnIF0sIGF0dHJpYnV0ZVR5cGUgKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YSA9IGlzLmFuLm9iamVjdCggX2l0ZW0gKSA/IF9pdGVtIDogbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0dmFsdWVzLnB1c2goIG1vbGR5LmNyZWF0ZSggZGF0YSApICk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlcy5wdXNoKCBjYXN0KCBfaXRlbSwgYXR0cmlidXRlVHlwZSwgbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYXJyYXlbICdfXycgKyBfbWV0aG9kIF0uYXBwbHkoIGFycmF5LCB2YWx1ZXMgKTtcclxuXHRcdFx0XHRcdH0gKTtcclxuXHRcdFx0XHR9ICk7XHJcblxyXG5cdFx0XHRcdGlmICggZXhpc3RpbmdWYWx1ZSAmJiBleGlzdGluZ1ZhbHVlLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdFx0XHRleGlzdGluZ1ZhbHVlLmZvckVhY2goIGZ1bmN0aW9uICggbyApIHtcclxuXHRcdFx0XHRcdFx0b2JqWyBrZXkgXS5wdXNoKCBvICk7XHJcblx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIG9iaiwga2V5LCB7XHJcblx0XHRcdFx0XHRnZXQ6IGhlbHBlcnMuZ2V0UHJvcGVydHkoIGtleSApLFxyXG5cdFx0XHRcdFx0c2V0OiBoZWxwZXJzLnNldFByb3BlcnR5KCBrZXkgKSxcclxuXHRcdFx0XHRcdGVudW1lcmFibGU6IHRydWVcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG9iai5fX2F0dHJpYnV0ZXNbIGtleSBdID0gbWV0YWRhdGEuYXR0cmlidXRlcztcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIGV4aXN0aW5nVmFsdWUgIT09IHZvaWQgMCApIHsgLy9pZiBleGlzdGluZyB2YWx1ZVxyXG5cdFx0XHRvYmpbIGtleSBdID0gZXhpc3RpbmdWYWx1ZTtcclxuXHRcdH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBvYmpbIGtleSBdICkgJiYgbWV0YWRhdGEuYXR0cmlidXRlcy5vcHRpb25hbCA9PT0gZmFsc2UgJiYgaXMubm90Lm51bGxPclVuZGVmaW5lZCggbWV0YWRhdGEuYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSApIHtcclxuXHRcdFx0b2JqWyBrZXkgXSA9IG1ldGFkYXRhLmF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdO1xyXG5cdFx0fSBlbHNlIGlmICggaXMuZW1wdHkoIG9ialsga2V5IF0gKSAmJiBtZXRhZGF0YS5hdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcclxuXHRcdFx0aWYgKCBtZXRhZGF0YS5hdHRyaWJ1dGVUeXBlSXNBbkFycmF5IHx8IG1ldGFkYXRhLmF0dHJpYnV0ZVR5cGVJc0FuSW5zdGFudGlhdGVkTW9sZHkgKSB7XHJcblx0XHRcdFx0b2JqLl9fZGF0YVsga2V5IF0gPSBvYmpbIGtleSBdO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9iai5fX2RhdGFbIGtleSBdID0gaXMuZW1wdHkoIG1ldGFkYXRhLmF0dHJpYnV0ZXMudHlwZSApID8gdW5kZWZpbmVkIDogY2FzdCggdW5kZWZpbmVkLCBtZXRhZGF0YS5hdHRyaWJ1dGVzLnR5cGUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdE1vbGR5LnByb3RvdHlwZS4kcHJvcGVydHkgPSBmdW5jdGlvbiAoIF9rZXksIF92YWx1ZSApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0YXR0cmlidXRlcyA9IG5ldyBoZWxwZXJzLmF0dHJpYnV0ZXMoIF9rZXksIF92YWx1ZSApLFxyXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5ID0gaXMuYS5zdHJpbmcoIGF0dHJpYnV0ZXMudHlwZSApICYmIC9tb2xkeS8udGVzdCggYXR0cmlidXRlcy50eXBlICksXHJcblx0XHRcdGF0dHJpYnV0ZVR5cGVJc0FuQXJyYXkgPSBpcy5hbi5hcnJheSggYXR0cmlidXRlcy50eXBlICksXHJcblx0XHRcdHZhbHVlSXNBbkFycmF5TW9sZHkgPSBpcy5hbi5hcnJheSggX3ZhbHVlICkgJiYgaGFzS2V5KCBfdmFsdWVbIDAgXSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApLFxyXG5cdFx0XHR2YWx1ZUlzQW5BcnJheVN0cmluZyA9IGlzLmFuLmFycmF5KCBfdmFsdWUgKSAmJiBpcy5hLnN0cmluZyggX3ZhbHVlWyAwIF0gKSxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBTW9sZHkgPSBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5ICYmIGhhc0tleSggYXR0cmlidXRlcy50eXBlWyAwIF0sICdwcm9wZXJ0aWVzJywgJ29iamVjdCcgKSxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nID0gYXR0cmlidXRlVHlwZUlzQW5BcnJheSAmJiBpcy5hLnN0cmluZyggYXR0cmlidXRlcy50eXBlWyAwIF0gKSAmJiBpcy5ub3QuZW1wdHkoIGF0dHJpYnV0ZXMudHlwZVsgMCBdICksXHJcblx0XHRcdHZhbHVlSXNBU3RhdGljTW9sZHkgPSBoYXNLZXkoIF92YWx1ZSwgJ3Byb3BlcnRpZXMnLCAnb2JqZWN0JyApO1xyXG5cclxuXHRcdHNlbGYuX19tZXRhZGF0YVsgX2tleSBdID0ge1xyXG5cdFx0XHRhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxyXG5cdFx0XHR2YWx1ZTogX3ZhbHVlLFxyXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5OiBhdHRyaWJ1dGVUeXBlSXNBbkluc3RhbnRpYXRlZE1vbGR5LFxyXG5cdFx0XHRhdHRyaWJ1dGVUeXBlSXNBbkFycmF5OiBhdHRyaWJ1dGVUeXBlSXNBbkFycmF5LFxyXG5cdFx0XHR2YWx1ZUlzQW5BcnJheU1vbGR5OiB2YWx1ZUlzQW5BcnJheU1vbGR5LFxyXG5cdFx0XHR2YWx1ZUlzQW5BcnJheVN0cmluZzogdmFsdWVJc0FuQXJyYXlTdHJpbmcsXHJcblx0XHRcdGF0dHJpYnV0ZUFycmF5VHlwZUlzQU1vbGR5OiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FNb2xkeSxcclxuXHRcdFx0YXR0cmlidXRlQXJyYXlUeXBlSXNBU3RyaW5nOiBhdHRyaWJ1dGVBcnJheVR5cGVJc0FTdHJpbmcsXHJcblx0XHRcdHZhbHVlSXNBU3RhdGljTW9sZHk6IHZhbHVlSXNBU3RhdGljTW9sZHlcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHNlbGY7XHJcblx0fTtcclxuXHJcblx0ZW1pdHRlciggTW9sZHkucHJvdG90eXBlICk7XHJcblxyXG5cdHJldHVybiBNb2xkeTtcclxuXHJcbn07Il19
(17)
});
