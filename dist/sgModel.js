!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sgModel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

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
var is = _dereq_( 'sc-is' ),
	cast = _dereq_( 'sc-cast' ),
	hasKey = _dereq_( 'sc-haskey' ),
	helpers = _dereq_( './helpers' ),
	merge = _dereq_( 'sc-merge' ),
	emitter = _dereq_( 'emitter-component' ),
	useify = _dereq_( 'sc-useify' ),
	request = _dereq_( './request' );

var Model = function ( _name, _properties ) {
	var self = this,
		properties = is.an.object( _properties ) ? _properties : {};

	Object.defineProperties( self, {
		__model: {
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
			value: cast( properties[ 'headers' ], 'object', {} ),
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
			value: _name || ''
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

Model.prototype.$baseUrl = function ( _base ) {
	var self = this,
		url = cast( _base, 'string', self.__baseUrl || '' );

	self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' );

	return is.not.a.string( _base ) ? self.__baseUrl : self;
};

Model.prototype.$collection = function ( _query ) {
	var self = this,
		url = self.$url(),
		method = 'get',
		query = is.an.object( _query ) ? _query : {},
		callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop;

	self.emit( 'precollection', {
		model: self,
		method: method,
		query: query,
		url: url,
		callback: callback
	} );

	request( self, query, method, url, function ( _error, _res ) {
		self.emit( 'collection', _error, _res );
		callback.apply( self, arguments );
	} );

};

Model.prototype.$destroy = function ( _callback ) {
	var self = this,
		isDirty = self.$isDirty(),
		data = self.$json(),
		url = self.$url() + ( self.__keyless ? '' : '/' + self[ self.__key ] ),
		method = 'delete',
		callback = is.a.func( _callback ) ? _callback : helpers.noop;

	self.emit( 'predestroy', {
		model: self,
		data: data,
		method: method,
		url: url,
		callback: callback
	} );

	if ( !isDirty ) {
		request( self, data, method, url, function () {

			self.emit( 'destroy', self );

			self.__destroyed = true;
			callback.apply( self, arguments );
		} );
	} else {
		callback.apply( self, [ new Error( 'This model cannot be destroyed because it has not been saved to the server yet.' ) ] );
	}

};

Model.prototype.$data = function ( _data ) {
	var self = this,
		data = is.object( _data ) ? _data : {};

	Object.keys( data ).forEach( function ( _key ) {
		if ( self.__attributes.hasOwnProperty( _key ) ) {
			self[ _key ] = data[ _key ];
		}
	} );

	return self;
};

Model.prototype.$clone = function ( _data ) {
	var self = this,
		data = cast( _data, 'object', {} ),
		newModel = new Model( self.__name, {
			baseUrl: self.__baseUrl,
			headers: self.__headers,
			key: self.__key,
			keyless: self.__keyless,
			url: self.__url
		} );

	Object.keys( self.__attributes ).forEach( function ( _propertyKey ) {
		newModel.$property( _propertyKey, merge( self.__attributes[ _propertyKey ] ) );
		newModel[ _propertyKey ] = data[ _propertyKey ]
	} );

	return newModel;
};

Model.prototype.$get = function ( _query, _callback ) {
	var self = this,
		url = self.$url(),
		method = 'get',
		query = is.an.object( _query ) ? _query : {},
		callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop;

	self.emit( 'preget', {
		model: self,
		method: method,
		query: query,
		url: url,
		callback: callback
	} );

	request( self, query, method, url, function ( _error, _res ) {
		self.emit( 'get', _error, _res );
		callback.apply( self, arguments );
	} );

};

Model.prototype.$headers = function ( _headers ) {
	this.__headers = is.an.object( _headers ) ? _headers : this.__headers;
	return is.not.an.object( _headers ) ? this.__headers : this;
};

Model.prototype.$isDirty = function () {
	return is.empty( this[ this.__key ] );
};

Model.prototype.$isValid = function () {
	var self = this,
		isValid = true;

	Object.keys( self.__attributes ).forEach( function ( _key ) {

		if ( self.$isDirty() && _key === self.__key ) {
			return;
		}

		var value = self[ _key ],
			attributes = self.__attributes[ _key ],
			type = attributes.type,
			isRequired = attributes.optional ? false : true,
			hasNoDefault = is.nullOrUndefined( attributes[ 'default' ] ),
			isNullOrUndefined = self.__keyless ? false : is.nullOrUndefined( value ),
			typeIsWrong = is.not.empty( type ) ? is.not.a[ type ]( value ) : isNullOrUndefined;

		if ( isRequired && typeIsWrong ) {
			isValid = false;
		}

	} );

	return isValid;
};

Model.prototype.$json = function () {
	var data = this.__data,
		json = {};

	Object.keys( data ).forEach( function ( _key ) {
		if ( is.not.an.object( data[ _key ] ) ) {
			json[ _key ] = data[ _key ];
		} else if ( data[ _key ] instanceof Model ) {
			json[ _key ] = data[ _key ].$json();
		}
	} );

	return json;
};

Model.prototype.$property = function ( _key, _value ) {
	var self = this,
		attributes = new helpers.attributes( _key, _value ),
		existingValue = self[ _key ];

	if ( !self.hasOwnProperty( _key ) || !self.__attributes.hasOwnProperty( _key ) ) {

		if ( attributes.type === 'model' ) {
			Object.defineProperty( self, _key, {
				enumerable: true,
				value: attributes[ 'default' ]
			} );
			self.__data[ _key ] = self[ _key ];
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
		self.__data[ _key ] = is.empty( attributes.type ) ? undefined : cast( undefined, attributes.type );
	}

	return self;
};

Model.prototype.$save = function ( _callback ) {
	var self = this,
		error = null,
		isDirty = self.$isDirty(),
		data = self.$json(),
		url = self.$url() + ( !isDirty && !self.__keyless ? '/' + self[ self.__key ] : '' ),
		method = isDirty ? 'post' : 'put',
		callback = is.a.func( _callback ) ? _callback : helpers.noop;

	self.emit( 'presave', {
		model: self,
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

Model.prototype.$url = function ( _url ) {
	var self = this,
		base = is.empty( self.__baseUrl ) ? '' : self.__baseUrl,
		name = is.empty( self.__name ) ? '' : '/' + self.__name.trim().replace( /^\//, '' ),
		url = _url || self.__url || '',
		endpoint = base + name + ( is.empty( url ) ? '' : '/' + url.trim().replace( /^\//, '' ) );

	self.__url = url.trim().replace( /^\//, '' );

	return is.not.a.string( _url ) ? endpoint : self;
};

emitter( Model.prototype );
useify( Model );

module.exports = Model;
},{"./helpers":18,"./request":19,"emitter-component":1,"sc-cast":2,"sc-haskey":5,"sc-is":7,"sc-merge":13,"sc-useify":16}],18:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
	cast = _dereq_( 'sc-cast' ),
	merge = _dereq_( 'sc-merge' );

exports.attributes = function ( _key, _value ) {
	var value;

	if ( is.a.string( _value ) ) {
		value = {
			type: _value
		};
	} else if ( is.an.object( _value ) && _value[ '__model' ] === true ) {
		value = {
			type: 'model',
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
},{"sc-cast":2,"sc-is":7,"sc-merge":13}],19:[function(_dereq_,module,exports){
var is = _dereq_( 'sc-is' ),
	cast = _dereq_( 'sc-cast' ),
	hasKey = _dereq_( 'sc-haskey' );

module.exports = function ( _model, _data, _method, _url, _callback ) {
	var model = _model,
		items = [],
		isDirty = model.$isDirty();

	model.middleware( 'adapter', function ( _error, _response ) {
		var error = _error,
			response = _response;

		if ( error && !( error instanceof Error ) ) {
			error = new Error( 'An unknown error occurred' );
		}

		if ( !error && isDirty && is.object( response ) && !hasKey( response, model.__key ) ) {
			error = new Error( 'The response from the server did not contain a valid `' + model.__key + '`' );
		}

		if ( !error && isDirty && is.object( response ) ) {
			model[ model.__key ] = response[ model.__key ];
		}

		if ( !error ) {
			if ( is.array( response ) ) {

				response.forEach( function ( _data ) {
					items.push( model.$clone( _data ) );
				} );

				model = items;

			} else if ( is.object( response ) ) {

				Object.keys( response ).forEach( function ( _key ) {
					if ( model.hasOwnProperty( _key ) ) {
						model[ _key ] = response[ _key ];
					}
				} );

			}
		}

		_callback && _callback( error, model );

	}, _model, _data, _method, _url );

};

},{"sc-cast":2,"sc-haskey":5,"sc-is":7}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvc2cvc2ctbW9kZWwvbm9kZV9tb2R1bGVzL3NjLWNhc3QvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1jYXN0L25vZGVfbW9kdWxlcy9zYy1jb250YWlucy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvc2cvc2ctbW9kZWwvbm9kZV9tb2R1bGVzL3NjLWd1aWQvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1oYXNrZXkvbm9kZV9tb2R1bGVzL3R5cGUtY29tcG9uZW50L2luZGV4LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtaXMvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL2VtcHR5LmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9ndWlkLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtaXMvaXNlcy9udWxsb3J1bmRlZmluZWQuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1pcy9pc2VzL3R5cGUuanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy1pcy90eXBlLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9ub2RlX21vZHVsZXMvc2MtbWVyZ2UvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy11c2VpZnkvY29uZmlnLmpzb24iLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL25vZGVfbW9kdWxlcy9zYy11c2VpZnkvaW5kZXguanMiLCIvVXNlcnMvZGF2aWR0c3VqaS9Ecm9wYm94L1NpdGVzL3NnL3NnLW1vZGVsL3NyYy9mYWtlX2VkYWE4OWMyLmpzIiwiL1VzZXJzL2RhdmlkdHN1amkvRHJvcGJveC9TaXRlcy9zZy9zZy1tb2RlbC9zcmMvaGVscGVycy9pbmRleC5qcyIsIi9Vc2Vycy9kYXZpZHRzdWppL0Ryb3Bib3gvU2l0ZXMvc2cvc2ctbW9kZWwvc3JjL3JlcXVlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1tldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG5cbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgc2VsZi5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwidmFyIGNvbnRhaW5zID0gcmVxdWlyZSggXCJzYy1jb250YWluc1wiICksXG4gIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICk7XG5cbnZhciBjYXN0ID0gZnVuY3Rpb24gKCBfdmFsdWUsIF9jYXN0VHlwZSwgX2RlZmF1bHQsIF92YWx1ZXMsIF9hZGRpdGlvbmFsUHJvcGVydGllcyApIHtcblxuICB2YXIgcGFyc2VkVmFsdWUsXG4gICAgY2FzdFR5cGUgPSBfY2FzdFR5cGUsXG4gICAgdmFsdWUsXG4gICAgdmFsdWVzID0gaXMuYW4uYXJyYXkoIF92YWx1ZXMgKSA/IF92YWx1ZXMgOiBbXTtcblxuICBzd2l0Y2ggKCB0cnVlICkge1xuICBjYXNlICggL2Zsb2F0fGludGVnZXIvLnRlc3QoIGNhc3RUeXBlICkgKTpcbiAgICBjYXN0VHlwZSA9IFwibnVtYmVyXCI7XG4gICAgYnJlYWs7XG4gIH1cblxuICBpZiAoIGlzLmFbIGNhc3RUeXBlIF0oIF92YWx1ZSApIHx8IGNhc3RUeXBlID09PSAnKicgKSB7XG5cbiAgICB2YWx1ZSA9IF92YWx1ZTtcblxuICB9IGVsc2Uge1xuXG4gICAgc3dpdGNoICggdHJ1ZSApIHtcblxuICAgIGNhc2UgY2FzdFR5cGUgPT09IFwiYXJyYXlcIjpcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XG4gICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKCBfdmFsdWUgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGlzLm5vdC5hbi5hcnJheSggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoICggZSApIHtcbiAgICAgICAgaWYgKCBpcy5ub3QubnVsbE9yVW5kZWZpbmVkKCBfdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IFsgX3ZhbHVlIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJib29sZWFuXCI6XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gL14odHJ1ZXwxfHl8eWVzKSQvaS50ZXN0KCBfdmFsdWUudG9TdHJpbmcoKSApID8gdHJ1ZSA6IHVuZGVmaW5lZDtcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgaWYgKCBpcy5ub3QuYS5ib29sZWFuKCB2YWx1ZSApICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSAvXihmYWxzZXwtMXwwfG58bm8pJC9pLnRlc3QoIF92YWx1ZS50b1N0cmluZygpICkgPyBmYWxzZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuXG4gICAgICB9XG5cbiAgICAgIHZhbHVlID0gaXMuYS5ib29sZWFuKCB2YWx1ZSApID8gdmFsdWUgOiB1bmRlZmluZWQ7XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBjYXN0VHlwZSA9PT0gXCJkYXRlXCI6XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZSggX3ZhbHVlICk7XG4gICAgICAgIHZhbHVlID0gaXNOYU4oIHZhbHVlLmdldFRpbWUoKSApID8gdW5kZWZpbmVkIDogdmFsdWU7XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge31cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcInN0cmluZ1wiOlxuXG4gICAgICB0cnkge1xuXG4gICAgICAgIHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLnVuZGVmaW5lZCggdmFsdWUgKSApIHtcbiAgICAgICAgICB0aHJvdyBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKCBlICkge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSBfdmFsdWUudG9TdHJpbmcoKVxuICAgICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGNhc3RUeXBlID09PSBcIm51bWJlclwiOlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoIF92YWx1ZSApO1xuICAgICAgICBpZiAoIGlzLm5vdC5hLm51bWJlciggdmFsdWUgKSB8fCBpc05hTiggdmFsdWUgKSApIHtcbiAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoIGUgKSB7XG4gICAgICAgIHZhbHVlID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgICAgY2FzZSBfY2FzdFR5cGUgPT09IFwiaW50ZWdlclwiOlxuICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoIHZhbHVlICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGNhc3QoIEpTT04ucGFyc2UoIF92YWx1ZSApLCBjYXN0VHlwZSApXG4gICAgICB9IGNhdGNoICggZSApIHt9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgfVxuXG4gIH1cblxuICBpZiAoIHZhbHVlcy5sZW5ndGggPiAwICYmICFjb250YWlucyggdmFsdWVzLCB2YWx1ZSApICkge1xuICAgIHZhbHVlID0gdmFsdWVzWyAwIF07XG4gIH1cblxuICByZXR1cm4gaXMubm90LnVuZGVmaW5lZCggdmFsdWUgKSA/IHZhbHVlIDogaXMubm90LnVuZGVmaW5lZCggX2RlZmF1bHQgKSA/IF9kZWZhdWx0IDogbnVsbDtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0OyIsInZhciBjb250YWlucyA9IGZ1bmN0aW9uICggZGF0YSwgaXRlbSApIHtcbiAgdmFyIGZvdW5kT25lID0gZmFsc2U7XG5cbiAgaWYgKCBBcnJheS5pc0FycmF5KCBkYXRhICkgKSB7XG5cbiAgICBkYXRhLmZvckVhY2goIGZ1bmN0aW9uICggYXJyYXlJdGVtICkge1xuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgaXRlbSA9PT0gYXJyYXlJdGVtICkge1xuICAgICAgICBmb3VuZE9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSApO1xuXG4gIH0gZWxzZSBpZiAoIE9iamVjdCggZGF0YSApID09PSBkYXRhICkge1xuXG4gICAgT2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuICAgICAgaWYgKCBmb3VuZE9uZSA9PT0gZmFsc2UgJiYgZGF0YVsga2V5IF0gPT09IGl0ZW0gKSB7XG4gICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH0gKTtcblxuICB9XG4gIHJldHVybiBmb3VuZE9uZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29udGFpbnM7IiwidmFyIGd1aWRSeCA9IFwiez9bMC05QS1GYS1mXXs4fS1bMC05QS1GYS1mXXs0fS00WzAtOUEtRmEtZl17M30tWzAtOUEtRmEtZl17NH0tWzAtOUEtRmEtZl17MTJ9fT9cIjtcblxuZXhwb3J0cy5nZW5lcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgdmFyIGd1aWQgPSBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoIC9beHldL2csIGZ1bmN0aW9uICggYyApIHtcbiAgICB2YXIgciA9ICggZCArIE1hdGgucmFuZG9tKCkgKiAxNiApICUgMTYgfCAwO1xuICAgIGQgPSBNYXRoLmZsb29yKCBkIC8gMTYgKTtcbiAgICByZXR1cm4gKCBjID09PSBcInhcIiA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKCAxNiApO1xuICB9ICk7XG4gIHJldHVybiBndWlkO1xufTtcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICggc3RyaW5nICkge1xuICB2YXIgcnggPSBuZXcgUmVnRXhwKCBndWlkUngsIFwiZ1wiICksXG4gICAgbWF0Y2hlcyA9ICggdHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIiA/IHN0cmluZyA6IFwiXCIgKS5tYXRjaCggcnggKTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG1hdGNoZXMgKSA/IG1hdGNoZXMgOiBbXTtcbn07XG5cbmV4cG9ydHMuaXNWYWxpZCA9IGZ1bmN0aW9uICggZ3VpZCApIHtcbiAgdmFyIHJ4ID0gbmV3IFJlZ0V4cCggZ3VpZFJ4ICk7XG4gIHJldHVybiByeC50ZXN0KCBndWlkICk7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICksXG4gIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGhhc0tleSggb2JqZWN0LCBrZXlzLCBrZXlUeXBlICkge1xuXG4gIG9iamVjdCA9IHR5cGUoIG9iamVjdCApID09PSBcIm9iamVjdFwiID8gb2JqZWN0IDoge30sIGtleXMgPSB0eXBlKCBrZXlzICkgPT09IFwiYXJyYXlcIiA/IGtleXMgOiBbXTtcbiAga2V5VHlwZSA9IHR5cGUoIGtleVR5cGUgKSA9PT0gXCJzdHJpbmdcIiA/IGtleVR5cGUgOiBcIlwiO1xuXG4gIHZhciBrZXkgPSBrZXlzLmxlbmd0aCA+IDAgPyBrZXlzLnNoaWZ0KCkgOiBcIlwiLFxuICAgIGtleUV4aXN0cyA9IGhhcy5jYWxsKCBvYmplY3QsIGtleSApIHx8IG9iamVjdFsga2V5IF0gIT09IHZvaWQgMCxcbiAgICBrZXlWYWx1ZSA9IGtleUV4aXN0cyA/IG9iamVjdFsga2V5IF0gOiB1bmRlZmluZWQsXG4gICAga2V5VHlwZUlzQ29ycmVjdCA9IHR5cGUoIGtleVZhbHVlICkgPT09IGtleVR5cGU7XG5cbiAgaWYgKCBrZXlzLmxlbmd0aCA+IDAgJiYga2V5RXhpc3RzICkge1xuICAgIHJldHVybiBoYXNLZXkoIG9iamVjdFsga2V5IF0sIGtleXMsIGtleVR5cGUgKTtcbiAgfVxuXG4gIHJldHVybiBrZXlzLmxlbmd0aCA+IDAgfHwga2V5VHlwZSA9PT0gXCJcIiA/IGtleUV4aXN0cyA6IGtleUV4aXN0cyAmJiBrZXlUeXBlSXNDb3JyZWN0O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBvYmplY3QsIGtleXMsIGtleVR5cGUgKSB7XG5cbiAga2V5cyA9IHR5cGUoIGtleXMgKSA9PT0gXCJzdHJpbmdcIiA/IGtleXMuc3BsaXQoIFwiLlwiICkgOiBbXTtcblxuICByZXR1cm4gaGFzS2V5KCBvYmplY3QsIGtleXMsIGtleVR5cGUgKTtcblxufTsiLCJcbi8qKlxuICogdG9TdHJpbmcgcmVmLlxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogUmV0dXJuIHRoZSB0eXBlIG9mIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHZhbCl7XG4gIHN3aXRjaCAodG9TdHJpbmcuY2FsbCh2YWwpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOiByZXR1cm4gJ2Z1bmN0aW9uJztcbiAgICBjYXNlICdbb2JqZWN0IERhdGVdJzogcmV0dXJuICdkYXRlJztcbiAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOiByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzogcmV0dXJuICdhcmd1bWVudHMnO1xuICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzogcmV0dXJuICdhcnJheSc7XG4gIH1cblxuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKHZhbCA9PT0gT2JqZWN0KHZhbCkpIHJldHVybiAnb2JqZWN0JztcblxuICByZXR1cm4gdHlwZW9mIHZhbDtcbn07XG4iLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi9pc2VzL3R5cGVcIiApLFxuICBpcyA9IHtcbiAgICBhOiB7fSxcbiAgICBhbjoge30sXG4gICAgbm90OiB7XG4gICAgICBhOiB7fSxcbiAgICAgIGFuOiB7fVxuICAgIH1cbiAgfTtcblxudmFyIGlzZXMgPSB7XG4gIFwiYXJndW1lbnRzXCI6IFsgXCJhcmd1bWVudHNcIiwgdHlwZSggXCJhcmd1bWVudHNcIiApIF0sXG4gIFwiYXJyYXlcIjogWyBcImFycmF5XCIsIHR5cGUoIFwiYXJyYXlcIiApIF0sXG4gIFwiYm9vbGVhblwiOiBbIFwiYm9vbGVhblwiLCB0eXBlKCBcImJvb2xlYW5cIiApIF0sXG4gIFwiZGF0ZVwiOiBbIFwiZGF0ZVwiLCB0eXBlKCBcImRhdGVcIiApIF0sXG4gIFwiZnVuY3Rpb25cIjogWyBcImZ1bmN0aW9uXCIsIFwiZnVuY1wiLCBcImZuXCIsIHR5cGUoIFwiZnVuY3Rpb25cIiApIF0sXG4gIFwibnVsbFwiOiBbIFwibnVsbFwiLCB0eXBlKCBcIm51bGxcIiApIF0sXG4gIFwibnVtYmVyXCI6IFsgXCJudW1iZXJcIiwgXCJpbnRlZ2VyXCIsIFwiaW50XCIsIHR5cGUoIFwibnVtYmVyXCIgKSBdLFxuICBcIm9iamVjdFwiOiBbIFwib2JqZWN0XCIsIHR5cGUoIFwib2JqZWN0XCIgKSBdLFxuICBcInJlZ2V4cFwiOiBbIFwicmVnZXhwXCIsIHR5cGUoIFwicmVnZXhwXCIgKSBdLFxuICBcInN0cmluZ1wiOiBbIFwic3RyaW5nXCIsIHR5cGUoIFwic3RyaW5nXCIgKSBdLFxuICBcInVuZGVmaW5lZFwiOiBbIFwidW5kZWZpbmVkXCIsIHR5cGUoIFwidW5kZWZpbmVkXCIgKSBdLFxuICBcImVtcHR5XCI6IFsgXCJlbXB0eVwiLCByZXF1aXJlKCBcIi4vaXNlcy9lbXB0eVwiICkgXSxcbiAgXCJudWxsb3J1bmRlZmluZWRcIjogWyBcIm51bGxPclVuZGVmaW5lZFwiLCBcIm51bGxvcnVuZGVmaW5lZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9udWxsb3J1bmRlZmluZWRcIiApIF0sXG4gIFwiZ3VpZFwiOiBbIFwiZ3VpZFwiLCByZXF1aXJlKCBcIi4vaXNlcy9ndWlkXCIgKSBdXG59XG5cbk9iamVjdC5rZXlzKCBpc2VzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cbiAgdmFyIG1ldGhvZHMgPSBpc2VzWyBrZXkgXS5zbGljZSggMCwgaXNlc1sga2V5IF0ubGVuZ3RoIC0gMSApLFxuICAgIGZuID0gaXNlc1sga2V5IF1bIGlzZXNbIGtleSBdLmxlbmd0aCAtIDEgXTtcblxuICBtZXRob2RzLmZvckVhY2goIGZ1bmN0aW9uICggbWV0aG9kS2V5ICkge1xuICAgIGlzWyBtZXRob2RLZXkgXSA9IGlzLmFbIG1ldGhvZEtleSBdID0gaXMuYW5bIG1ldGhvZEtleSBdID0gZm47XG4gICAgaXMubm90WyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hWyBtZXRob2RLZXkgXSA9IGlzLm5vdC5hblsgbWV0aG9kS2V5IF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApID8gZmFsc2UgOiB0cnVlO1xuICAgIH1cbiAgfSApO1xuXG59ICk7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGlzO1xuZXhwb3J0cy50eXBlID0gdHlwZTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoXCIuLi90eXBlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gIHZhciBlbXB0eSA9IGZhbHNlO1xuXG4gIGlmICggdHlwZSggdmFsdWUgKSA9PT0gXCJudWxsXCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICBlbXB0eSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwib2JqZWN0XCIgKSB7XG4gICAgZW1wdHkgPSBPYmplY3Qua2V5cyggdmFsdWUgKS5sZW5ndGggPT09IDA7XG4gIH0gZWxzZSBpZiAoIHR5cGUoIHZhbHVlICkgPT09IFwiYm9vbGVhblwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IGZhbHNlO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcIm51bWJlclwiICkge1xuICAgIGVtcHR5ID0gdmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IC0xO1xuICB9IGVsc2UgaWYgKCB0eXBlKCB2YWx1ZSApID09PSBcImFycmF5XCIgfHwgdHlwZSggdmFsdWUgKSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBlbXB0eSA9IHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIHJldHVybiBlbXB0eTtcblxufTsiLCJ2YXIgZ3VpZCA9IHJlcXVpcmUoIFwic2MtZ3VpZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCB2YWx1ZSApIHtcbiAgcmV0dXJuIGd1aWQuaXNWYWxpZCggdmFsdWUgKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoIHZhbHVlICkge1xuXHRyZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gdm9pZCAwO1xufTsiLCJ2YXIgdHlwZSA9IHJlcXVpcmUoIFwiLi4vdHlwZVwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfdHlwZSApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xuICAgIHJldHVybiB0eXBlKCBfdmFsdWUgKSA9PT0gX3R5cGU7XG4gIH1cbn0iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggdmFsICkge1xuICBzd2l0Y2ggKCB0b1N0cmluZy5jYWxsKCB2YWwgKSApIHtcbiAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgIHJldHVybiAnZnVuY3Rpb24nO1xuICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICByZXR1cm4gJ2RhdGUnO1xuICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgIHJldHVybiAncmVnZXhwJztcbiAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzpcbiAgICByZXR1cm4gJ2FyZ3VtZW50cyc7XG4gIGNhc2UgJ1tvYmplY3QgQXJyYXldJzpcbiAgICByZXR1cm4gJ2FycmF5JztcbiAgfVxuXG4gIGlmICggdmFsID09PSBudWxsICkgcmV0dXJuICdudWxsJztcbiAgaWYgKCB2YWwgPT09IHVuZGVmaW5lZCApIHJldHVybiAndW5kZWZpbmVkJztcbiAgaWYgKCB2YWwgPT09IE9iamVjdCggdmFsICkgKSByZXR1cm4gJ29iamVjdCc7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWw7XG59OyIsInZhciB0eXBlID0gcmVxdWlyZSggXCJ0eXBlLWNvbXBvbmVudFwiICk7XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBkZWVwID0gdHlwZSggYXJnc1sgMCBdICkgPT09IFwiYm9vbGVhblwiID8gYXJncy5zaGlmdCgpIDogZmFsc2UsXG4gICAgb2JqZWN0cyA9IGFyZ3MsXG4gICAgcmVzdWx0ID0ge307XG5cbiAgb2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiAoIG9iamVjdG4gKSB7XG5cbiAgICBpZiAoIHR5cGUoIG9iamVjdG4gKSAhPT0gXCJvYmplY3RcIiApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyggb2JqZWN0biApLmZvckVhY2goIGZ1bmN0aW9uICgga2V5ICkge1xuICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIG9iamVjdG4sIGtleSApICkge1xuICAgICAgICBpZiAoIGRlZXAgJiYgdHlwZSggb2JqZWN0blsga2V5IF0gKSA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgICByZXN1bHRbIGtleSBdID0gbWVyZ2UoIGRlZXAsIHt9LCByZXN1bHRbIGtleSBdLCBvYmplY3RuWyBrZXkgXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFsga2V5IF0gPSBvYmplY3RuWyBrZXkgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gKTtcblxuICB9ICk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcImRlZmF1bHRzXCI6IHtcblx0XHRcIm1pZGRsZXdhcmVLZXlcIjogXCJhbGxcIlxuXHR9XG59IiwidmFyIGlzID0gcmVxdWlyZSggXCJzYy1pc1wiICksXG4gIGNvbmZpZyA9IHJlcXVpcmUoIFwiLi9jb25maWcuanNvblwiICksXG4gIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcblxudmFyIHVzZWlmeUZ1bmN0aW9uID0gZnVuY3Rpb24gKCBmdW5jdGlvbnMsIGtleSwgZm4gKSB7XG4gIGlmICggaXMubm90LmVtcHR5KCBrZXkgKSAmJiBpcy5hLnN0cmluZygga2V5ICkgKSB7XG4gICAgaWYgKCBpcy5ub3QuYW4uYXJyYXkoIGZ1bmN0aW9uc1sga2V5IF0gKSApIHtcbiAgICAgIGZ1bmN0aW9uc1sga2V5IF0gPSBbXTtcbiAgICB9XG4gICAgaWYgKCBpcy5hLmZ1bmMoIGZuICkgKSB7XG4gICAgICBmdW5jdGlvbnNbIGtleSBdLnB1c2goIGZuICk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbnNbIGtleSBdO1xuICB9XG59XG5cbnZhciBVc2VpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZnVuY3Rpb25zID0ge1xuICAgIGFsbDogW11cbiAgfTtcbn07XG5cblVzZWlmeS5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSxcbiAgICBrZXkgPSBpcy5hLnN0cmluZyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBjb25maWcuZGVmYXVsdHMubWlkZGxld2FyZUtleSxcbiAgICBmbiA9IGlzLmEuZnVuYyggYXJnc1sgMCBdICkgPyBhcmdzLnNoaWZ0KCkgOiBub29wO1xuXG4gIHVzZWlmeUZ1bmN0aW9uKCBzZWxmLmZ1bmN0aW9ucywga2V5LCBmbiApO1xufTtcblxuVXNlaWZ5LnByb3RvdHlwZS5taWRkbGV3YXJlID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBzZWxmID0gdGhpcyxcbiAgICBjdXJyZW50RnVuY3Rpb24gPSAwLFxuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICksXG4gICAgbWlkZGxld2FyZUtleSA9IGlzLmEuc3RyaW5nKCBhcmdzWyAwIF0gKSAmJiBpcy5hLmZ1bmMoIGFyZ3NbIDEgXSApID8gYXJncy5zaGlmdCgpIDogY29uZmlnLmRlZmF1bHRzLm1pZGRsZXdhcmVLZXksXG4gICAgY2FsbGJhY2sgPSBpcy5hLmZ1bmMoIGFyZ3NbIDAgXSApID8gYXJncy5zaGlmdCgpIDogbm9vcDtcblxuICB1c2VpZnlGdW5jdGlvbiggc2VsZi5mdW5jdGlvbnMsIG1pZGRsZXdhcmVLZXkgKTtcblxuICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm4gPSBzZWxmLmZ1bmN0aW9uc1sgbWlkZGxld2FyZUtleSBdWyBjdXJyZW50RnVuY3Rpb24rKyBdLFxuICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKTtcblxuICAgIGlmICggIWZuICkge1xuICAgICAgY2FsbGJhY2suYXBwbHkoIHNlbGYuY29udGV4dCwgYXJncyApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmdzLnB1c2goIG5leHQgKTtcbiAgICAgIGZuLmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcbiAgICB9XG5cbiAgfTtcblxuICBuZXh0LmFwcGx5KCBzZWxmLmNvbnRleHQsIGFyZ3MgKTtcblxufTtcblxuVXNlaWZ5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICggbWlkZGxld2FyZUtleSApIHtcbiAgaWYgKCBpcy5hLnN0cmluZyggbWlkZGxld2FyZUtleSApICYmIGlzLm5vdC5lbXB0eSggbWlkZGxld2FyZUtleSApICkge1xuICAgIHRoaXMuZnVuY3Rpb25zWyBtaWRkbGV3YXJlS2V5IF0gPSBbXTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZ1bmN0aW9ucyA9IHtcbiAgICAgIGFsbDogW11cbiAgICB9O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICggX29iamVjdE9yRnVuY3Rpb24gKSB7XG5cbiAgdmFyIHVzZWlmeSA9IG5ldyBVc2VpZnkoKTtcblxuICBpZiAoIGlzLmFuLm9iamVjdCggX29iamVjdE9yRnVuY3Rpb24gKSApIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBfb2JqZWN0T3JGdW5jdGlvbiwge1xuXG4gICAgICBcInVzZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXNlaWZ5LnVzZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgICAgICByZXR1cm4gX29iamVjdE9yRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwibWlkZGxld2FyZVwiOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXNlaWZ5Lm1pZGRsZXdhcmUuYXBwbHkoIHVzZWlmeSwgYXJndW1lbnRzICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIFwidXNlaWZ5XCI6IHtcbiAgICAgICAgdmFsdWU6IHVzZWlmeVxuICAgICAgfVxuXG4gICAgfSApO1xuXG4gICAgdXNlaWZ5LmNvbnRleHQgPSBfb2JqZWN0T3JGdW5jdGlvbjtcblxuICB9IGVsc2UgaWYgKCBpcy5hLmZuKCBfb2JqZWN0T3JGdW5jdGlvbiApICkge1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24ucHJvdG90eXBlLm1pZGRsZXdhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB1c2VpZnkuY29udGV4dCA9IHRoaXM7XG4gICAgICB1c2VpZnkubWlkZGxld2FyZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICB9O1xuXG4gICAgX29iamVjdE9yRnVuY3Rpb24udXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdXNlaWZ5LnVzZS5hcHBseSggdXNlaWZ5LCBhcmd1bWVudHMgKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBfb2JqZWN0T3JGdW5jdGlvbi51c2VpZnkgPSB1c2VpZnk7XG5cbiAgfVxuXG59OyIsInZhciBpcyA9IHJlcXVpcmUoICdzYy1pcycgKSxcblx0Y2FzdCA9IHJlcXVpcmUoICdzYy1jYXN0JyApLFxuXHRoYXNLZXkgPSByZXF1aXJlKCAnc2MtaGFza2V5JyApLFxuXHRoZWxwZXJzID0gcmVxdWlyZSggJy4vaGVscGVycycgKSxcblx0bWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICksXG5cdGVtaXR0ZXIgPSByZXF1aXJlKCAnZW1pdHRlci1jb21wb25lbnQnICksXG5cdHVzZWlmeSA9IHJlcXVpcmUoICdzYy11c2VpZnknICksXG5cdHJlcXVlc3QgPSByZXF1aXJlKCAnLi9yZXF1ZXN0JyApO1xuXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoIF9uYW1lLCBfcHJvcGVydGllcyApIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdHByb3BlcnRpZXMgPSBpcy5hbi5vYmplY3QoIF9wcm9wZXJ0aWVzICkgPyBfcHJvcGVydGllcyA6IHt9O1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCBzZWxmLCB7XG5cdFx0X19tb2RlbDoge1xuXHRcdFx0dmFsdWU6IHRydWVcblx0XHR9LFxuXHRcdF9fYXR0cmlidXRlczoge1xuXHRcdFx0dmFsdWU6IHt9LFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9fYmFzZVVybDoge1xuXHRcdFx0dmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICdiYXNlVXJsJyBdLCAnc3RyaW5nJywgJycgKSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0fSxcblx0XHRfX2RhdGE6IHtcblx0XHRcdHZhbHVlOiB7fSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0fSxcblx0XHRfX2Rlc3Ryb3llZDoge1xuXHRcdFx0dmFsdWU6IGZhbHNlLFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9LFxuXHRcdF9faGVhZGVyczoge1xuXHRcdFx0dmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICdoZWFkZXJzJyBdLCAnb2JqZWN0Jywge30gKSxcblx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0fSxcblx0XHRfX2tleToge1xuXHRcdFx0dmFsdWU6IGNhc3QoIHByb3BlcnRpZXNbICdrZXknIF0sICdzdHJpbmcnLCAnaWQnICkgfHwgJ2lkJyxcblx0XHRcdHdyaXRhYmxlOiB0cnVlXG5cdFx0fSxcblx0XHRfX2tleWxlc3M6IHtcblx0XHRcdHZhbHVlOiBwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSA9PT0gdHJ1ZVxuXHRcdH0sXG5cdFx0X19uYW1lOiB7XG5cdFx0XHR2YWx1ZTogX25hbWUgfHwgJydcblx0XHR9LFxuXHRcdF9fdXJsOiB7XG5cdFx0XHR2YWx1ZTogY2FzdCggcHJvcGVydGllc1sgJ3VybCcgXSwgJ3N0cmluZycsICcnICksXG5cdFx0XHR3cml0YWJsZTogdHJ1ZVxuXHRcdH0sXG5cdFx0YnVzeToge1xuXHRcdFx0dmFsdWU6IGZhbHNlLFxuXHRcdFx0d3JpdGFibGU6IHRydWVcblx0XHR9XG5cdH0gKTtcblxuXHRpZiAoICFwcm9wZXJ0aWVzWyAna2V5bGVzcycgXSApIHtcblx0XHRzZWxmLiRwcm9wZXJ0eSggc2VsZi5fX2tleSApO1xuXHR9XG5cblx0T2JqZWN0LmtleXMoIGNhc3QoIHByb3BlcnRpZXNbICdwcm9wZXJ0aWVzJyBdLCAnb2JqZWN0Jywge30gKSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcblx0XHRzZWxmLiRwcm9wZXJ0eSggX2tleSwgcHJvcGVydGllc1sgJ3Byb3BlcnRpZXMnIF1bIF9rZXkgXSApO1xuXHR9ICk7XG5cblx0c2VsZi5vbiggJ3ByZXNhdmUnLCBoZWxwZXJzLnNldEJ1c3koIHNlbGYgKSApO1xuXHRzZWxmLm9uKCAnc2F2ZScsIGhlbHBlcnMudW5zZXRCdXN5KCBzZWxmICkgKTtcblxuXHRzZWxmLm9uKCAncHJlZGVzdHJveScsIGhlbHBlcnMuc2V0QnVzeSggc2VsZiApICk7XG5cdHNlbGYub24oICdkZXN0cm95JywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xuXG5cdHNlbGYub24oICdwcmVnZXQnLCBoZWxwZXJzLnNldEJ1c3koIHNlbGYgKSApO1xuXHRzZWxmLm9uKCAnZ2V0JywgaGVscGVycy51bnNldEJ1c3koIHNlbGYgKSApO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuJGJhc2VVcmwgPSBmdW5jdGlvbiAoIF9iYXNlICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0dXJsID0gY2FzdCggX2Jhc2UsICdzdHJpbmcnLCBzZWxmLl9fYmFzZVVybCB8fCAnJyApO1xuXG5cdHNlbGYuX19iYXNlVXJsID0gdXJsLnRyaW0oKS5yZXBsYWNlKCAvKFxcL3xcXHMpKyQvZywgJycgKTtcblxuXHRyZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfYmFzZSApID8gc2VsZi5fX2Jhc2VVcmwgOiBzZWxmO1xufTtcblxuTW9kZWwucHJvdG90eXBlLiRjb2xsZWN0aW9uID0gZnVuY3Rpb24gKCBfcXVlcnkgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHR1cmwgPSBzZWxmLiR1cmwoKSxcblx0XHRtZXRob2QgPSAnZ2V0Jyxcblx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcblx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xuXG5cdHNlbGYuZW1pdCggJ3ByZWNvbGxlY3Rpb24nLCB7XG5cdFx0bW9kZWw6IHNlbGYsXG5cdFx0bWV0aG9kOiBtZXRob2QsXG5cdFx0cXVlcnk6IHF1ZXJ5LFxuXHRcdHVybDogdXJsLFxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHR9ICk7XG5cblx0cmVxdWVzdCggc2VsZiwgcXVlcnksIG1ldGhvZCwgdXJsLCBmdW5jdGlvbiAoIF9lcnJvciwgX3JlcyApIHtcblx0XHRzZWxmLmVtaXQoICdjb2xsZWN0aW9uJywgX2Vycm9yLCBfcmVzICk7XG5cdFx0Y2FsbGJhY2suYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuXHR9ICk7XG5cbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kZGVzdHJveSA9IGZ1bmN0aW9uICggX2NhbGxiYWNrICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0aXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxuXHRcdHVybCA9IHNlbGYuJHVybCgpICsgKCBzZWxmLl9fa2V5bGVzcyA/ICcnIDogJy8nICsgc2VsZlsgc2VsZi5fX2tleSBdICksXG5cdFx0bWV0aG9kID0gJ2RlbGV0ZScsXG5cdFx0Y2FsbGJhY2sgPSBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xuXG5cdHNlbGYuZW1pdCggJ3ByZWRlc3Ryb3knLCB7XG5cdFx0bW9kZWw6IHNlbGYsXG5cdFx0ZGF0YTogZGF0YSxcblx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHR1cmw6IHVybCxcblx0XHRjYWxsYmFjazogY2FsbGJhY2tcblx0fSApO1xuXG5cdGlmICggIWlzRGlydHkgKSB7XG5cdFx0cmVxdWVzdCggc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c2VsZi5lbWl0KCAnZGVzdHJveScsIHNlbGYgKTtcblxuXHRcdFx0c2VsZi5fX2Rlc3Ryb3llZCA9IHRydWU7XG5cdFx0XHRjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG5cdFx0fSApO1xuXHR9IGVsc2Uge1xuXHRcdGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBbIG5ldyBFcnJvciggJ1RoaXMgbW9kZWwgY2Fubm90IGJlIGRlc3Ryb3llZCBiZWNhdXNlIGl0IGhhcyBub3QgYmVlbiBzYXZlZCB0byB0aGUgc2VydmVyIHlldC4nICkgXSApO1xuXHR9XG5cbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kZGF0YSA9IGZ1bmN0aW9uICggX2RhdGEgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRkYXRhID0gaXMub2JqZWN0KCBfZGF0YSApID8gX2RhdGEgOiB7fTtcblxuXHRPYmplY3Qua2V5cyggZGF0YSApLmZvckVhY2goIGZ1bmN0aW9uICggX2tleSApIHtcblx0XHRpZiAoIHNlbGYuX19hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KCBfa2V5ICkgKSB7XG5cdFx0XHRzZWxmWyBfa2V5IF0gPSBkYXRhWyBfa2V5IF07XG5cdFx0fVxuXHR9ICk7XG5cblx0cmV0dXJuIHNlbGY7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuJGNsb25lID0gZnVuY3Rpb24gKCBfZGF0YSApIHtcblx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdGRhdGEgPSBjYXN0KCBfZGF0YSwgJ29iamVjdCcsIHt9ICksXG5cdFx0bmV3TW9kZWwgPSBuZXcgTW9kZWwoIHNlbGYuX19uYW1lLCB7XG5cdFx0XHRiYXNlVXJsOiBzZWxmLl9fYmFzZVVybCxcblx0XHRcdGhlYWRlcnM6IHNlbGYuX19oZWFkZXJzLFxuXHRcdFx0a2V5OiBzZWxmLl9fa2V5LFxuXHRcdFx0a2V5bGVzczogc2VsZi5fX2tleWxlc3MsXG5cdFx0XHR1cmw6IHNlbGYuX191cmxcblx0XHR9ICk7XG5cblx0T2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfcHJvcGVydHlLZXkgKSB7XG5cdFx0bmV3TW9kZWwuJHByb3BlcnR5KCBfcHJvcGVydHlLZXksIG1lcmdlKCBzZWxmLl9fYXR0cmlidXRlc1sgX3Byb3BlcnR5S2V5IF0gKSApO1xuXHRcdG5ld01vZGVsWyBfcHJvcGVydHlLZXkgXSA9IGRhdGFbIF9wcm9wZXJ0eUtleSBdXG5cdH0gKTtcblxuXHRyZXR1cm4gbmV3TW9kZWw7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuJGdldCA9IGZ1bmN0aW9uICggX3F1ZXJ5LCBfY2FsbGJhY2sgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHR1cmwgPSBzZWxmLiR1cmwoKSxcblx0XHRtZXRob2QgPSAnZ2V0Jyxcblx0XHRxdWVyeSA9IGlzLmFuLm9iamVjdCggX3F1ZXJ5ICkgPyBfcXVlcnkgOiB7fSxcblx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX3F1ZXJ5ICkgPyBfcXVlcnkgOiBpcy5hLmZ1bmMoIF9jYWxsYmFjayApID8gX2NhbGxiYWNrIDogaGVscGVycy5ub29wO1xuXG5cdHNlbGYuZW1pdCggJ3ByZWdldCcsIHtcblx0XHRtb2RlbDogc2VsZixcblx0XHRtZXRob2Q6IG1ldGhvZCxcblx0XHRxdWVyeTogcXVlcnksXG5cdFx0dXJsOiB1cmwsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdH0gKTtcblxuXHRyZXF1ZXN0KCBzZWxmLCBxdWVyeSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuXHRcdHNlbGYuZW1pdCggJ2dldCcsIF9lcnJvciwgX3JlcyApO1xuXHRcdGNhbGxiYWNrLmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcblx0fSApO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuJGhlYWRlcnMgPSBmdW5jdGlvbiAoIF9oZWFkZXJzICkge1xuXHR0aGlzLl9faGVhZGVycyA9IGlzLmFuLm9iamVjdCggX2hlYWRlcnMgKSA/IF9oZWFkZXJzIDogdGhpcy5fX2hlYWRlcnM7XG5cdHJldHVybiBpcy5ub3QuYW4ub2JqZWN0KCBfaGVhZGVycyApID8gdGhpcy5fX2hlYWRlcnMgOiB0aGlzO1xufTtcblxuTW9kZWwucHJvdG90eXBlLiRpc0RpcnR5ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gaXMuZW1wdHkoIHRoaXNbIHRoaXMuX19rZXkgXSApO1xufTtcblxuTW9kZWwucHJvdG90eXBlLiRpc1ZhbGlkID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0aXNWYWxpZCA9IHRydWU7XG5cblx0T2JqZWN0LmtleXMoIHNlbGYuX19hdHRyaWJ1dGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuXG5cdFx0aWYgKCBzZWxmLiRpc0RpcnR5KCkgJiYgX2tleSA9PT0gc2VsZi5fX2tleSApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgdmFsdWUgPSBzZWxmWyBfa2V5IF0sXG5cdFx0XHRhdHRyaWJ1dGVzID0gc2VsZi5fX2F0dHJpYnV0ZXNbIF9rZXkgXSxcblx0XHRcdHR5cGUgPSBhdHRyaWJ1dGVzLnR5cGUsXG5cdFx0XHRpc1JlcXVpcmVkID0gYXR0cmlidXRlcy5vcHRpb25hbCA/IGZhbHNlIDogdHJ1ZSxcblx0XHRcdGhhc05vRGVmYXVsdCA9IGlzLm51bGxPclVuZGVmaW5lZCggYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSxcblx0XHRcdGlzTnVsbE9yVW5kZWZpbmVkID0gc2VsZi5fX2tleWxlc3MgPyBmYWxzZSA6IGlzLm51bGxPclVuZGVmaW5lZCggdmFsdWUgKSxcblx0XHRcdHR5cGVJc1dyb25nID0gaXMubm90LmVtcHR5KCB0eXBlICkgPyBpcy5ub3QuYVsgdHlwZSBdKCB2YWx1ZSApIDogaXNOdWxsT3JVbmRlZmluZWQ7XG5cblx0XHRpZiAoIGlzUmVxdWlyZWQgJiYgdHlwZUlzV3JvbmcgKSB7XG5cdFx0XHRpc1ZhbGlkID0gZmFsc2U7XG5cdFx0fVxuXG5cdH0gKTtcblxuXHRyZXR1cm4gaXNWYWxpZDtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS4kanNvbiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGRhdGEgPSB0aGlzLl9fZGF0YSxcblx0XHRqc29uID0ge307XG5cblx0T2JqZWN0LmtleXMoIGRhdGEgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIF9rZXkgKSB7XG5cdFx0aWYgKCBpcy5ub3QuYW4ub2JqZWN0KCBkYXRhWyBfa2V5IF0gKSApIHtcblx0XHRcdGpzb25bIF9rZXkgXSA9IGRhdGFbIF9rZXkgXTtcblx0XHR9IGVsc2UgaWYgKCBkYXRhWyBfa2V5IF0gaW5zdGFuY2VvZiBNb2RlbCApIHtcblx0XHRcdGpzb25bIF9rZXkgXSA9IGRhdGFbIF9rZXkgXS4kanNvbigpO1xuXHRcdH1cblx0fSApO1xuXG5cdHJldHVybiBqc29uO1xufTtcblxuTW9kZWwucHJvdG90eXBlLiRwcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0YXR0cmlidXRlcyA9IG5ldyBoZWxwZXJzLmF0dHJpYnV0ZXMoIF9rZXksIF92YWx1ZSApLFxuXHRcdGV4aXN0aW5nVmFsdWUgPSBzZWxmWyBfa2V5IF07XG5cblx0aWYgKCAhc2VsZi5oYXNPd25Qcm9wZXJ0eSggX2tleSApIHx8ICFzZWxmLl9fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSggX2tleSApICkge1xuXG5cdFx0aWYgKCBhdHRyaWJ1dGVzLnR5cGUgPT09ICdtb2RlbCcgKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIHtcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0dmFsdWU6IGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdXG5cdFx0XHR9ICk7XG5cdFx0XHRzZWxmLl9fZGF0YVsgX2tleSBdID0gc2VsZlsgX2tleSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIF9rZXksIHtcblx0XHRcdFx0Z2V0OiBoZWxwZXJzLmdldFByb3BlcnR5KCBfa2V5ICksXG5cdFx0XHRcdHNldDogaGVscGVycy5zZXRQcm9wZXJ0eSggX2tleSApLFxuXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlXG5cdFx0XHR9ICk7XG5cdFx0fVxuXHRcdHNlbGYuX19hdHRyaWJ1dGVzWyBfa2V5IF0gPSBhdHRyaWJ1dGVzO1xuXHR9XG5cblx0aWYgKCBleGlzdGluZ1ZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0c2VsZlsgX2tleSBdID0gZXhpc3RpbmdWYWx1ZTtcblx0fSBlbHNlIGlmICggaXMuZW1wdHkoIHNlbGZbIF9rZXkgXSApICYmIGF0dHJpYnV0ZXMub3B0aW9uYWwgPT09IGZhbHNlICYmIGlzLm5vdC5udWxsT3JVbmRlZmluZWQoIGF0dHJpYnV0ZXNbICdkZWZhdWx0JyBdICkgKSB7XG5cdFx0c2VsZlsgX2tleSBdID0gYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF07XG5cdH0gZWxzZSBpZiAoIGlzLmVtcHR5KCBzZWxmWyBfa2V5IF0gKSAmJiBhdHRyaWJ1dGVzLm9wdGlvbmFsID09PSBmYWxzZSApIHtcblx0XHRzZWxmLl9fZGF0YVsgX2tleSBdID0gaXMuZW1wdHkoIGF0dHJpYnV0ZXMudHlwZSApID8gdW5kZWZpbmVkIDogY2FzdCggdW5kZWZpbmVkLCBhdHRyaWJ1dGVzLnR5cGUgKTtcblx0fVxuXG5cdHJldHVybiBzZWxmO1xufTtcblxuTW9kZWwucHJvdG90eXBlLiRzYXZlID0gZnVuY3Rpb24gKCBfY2FsbGJhY2sgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRlcnJvciA9IG51bGwsXG5cdFx0aXNEaXJ0eSA9IHNlbGYuJGlzRGlydHkoKSxcblx0XHRkYXRhID0gc2VsZi4kanNvbigpLFxuXHRcdHVybCA9IHNlbGYuJHVybCgpICsgKCAhaXNEaXJ0eSAmJiAhc2VsZi5fX2tleWxlc3MgPyAnLycgKyBzZWxmWyBzZWxmLl9fa2V5IF0gOiAnJyApLFxuXHRcdG1ldGhvZCA9IGlzRGlydHkgPyAncG9zdCcgOiAncHV0Jyxcblx0XHRjYWxsYmFjayA9IGlzLmEuZnVuYyggX2NhbGxiYWNrICkgPyBfY2FsbGJhY2sgOiBoZWxwZXJzLm5vb3A7XG5cblx0c2VsZi5lbWl0KCAncHJlc2F2ZScsIHtcblx0XHRtb2RlbDogc2VsZixcblx0XHRkYXRhOiBkYXRhLFxuXHRcdG1ldGhvZDogbWV0aG9kLFxuXHRcdHVybDogdXJsLFxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHR9ICk7XG5cblx0cmVxdWVzdCggc2VsZiwgZGF0YSwgbWV0aG9kLCB1cmwsIGZ1bmN0aW9uICggX2Vycm9yLCBfcmVzICkge1xuXHRcdHNlbGYuZW1pdCggJ3NhdmUnLCBfZXJyb3IsIF9yZXMgKTtcblx0XHRjYWxsYmFjay5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG5cdH0gKTtcblxufTtcblxuTW9kZWwucHJvdG90eXBlLiR1cmwgPSBmdW5jdGlvbiAoIF91cmwgKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHRiYXNlID0gaXMuZW1wdHkoIHNlbGYuX19iYXNlVXJsICkgPyAnJyA6IHNlbGYuX19iYXNlVXJsLFxuXHRcdG5hbWUgPSBpcy5lbXB0eSggc2VsZi5fX25hbWUgKSA/ICcnIDogJy8nICsgc2VsZi5fX25hbWUudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSxcblx0XHR1cmwgPSBfdXJsIHx8IHNlbGYuX191cmwgfHwgJycsXG5cdFx0ZW5kcG9pbnQgPSBiYXNlICsgbmFtZSArICggaXMuZW1wdHkoIHVybCApID8gJycgOiAnLycgKyB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKSApO1xuXG5cdHNlbGYuX191cmwgPSB1cmwudHJpbSgpLnJlcGxhY2UoIC9eXFwvLywgJycgKTtcblxuXHRyZXR1cm4gaXMubm90LmEuc3RyaW5nKCBfdXJsICkgPyBlbmRwb2ludCA6IHNlbGY7XG59O1xuXG5lbWl0dGVyKCBNb2RlbC5wcm90b3R5cGUgKTtcbnVzZWlmeSggTW9kZWwgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDsiLCJ2YXIgaXMgPSByZXF1aXJlKCAnc2MtaXMnICksXG5cdGNhc3QgPSByZXF1aXJlKCAnc2MtY2FzdCcgKSxcblx0bWVyZ2UgPSByZXF1aXJlKCAnc2MtbWVyZ2UnICk7XG5cbmV4cG9ydHMuYXR0cmlidXRlcyA9IGZ1bmN0aW9uICggX2tleSwgX3ZhbHVlICkge1xuXHR2YXIgdmFsdWU7XG5cblx0aWYgKCBpcy5hLnN0cmluZyggX3ZhbHVlICkgKSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiBfdmFsdWVcblx0XHR9O1xuXHR9IGVsc2UgaWYgKCBpcy5hbi5vYmplY3QoIF92YWx1ZSApICYmIF92YWx1ZVsgJ19fbW9kZWwnIF0gPT09IHRydWUgKSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiAnbW9kZWwnLFxuXHRcdFx0ZGVmYXVsdDogX3ZhbHVlXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHZhbHVlID0gX3ZhbHVlO1xuXHR9XG5cblx0cmV0dXJuIG1lcmdlKCB7XG5cdFx0bmFtZTogX2tleSB8fCAnJyxcblx0XHR0eXBlOiAnJyxcblx0XHRkZWZhdWx0OiBudWxsLFxuXHRcdG9wdGlvbmFsOiBmYWxzZVxuXHR9LCB2YWx1ZSApO1xufTtcblxuZXhwb3J0cy5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fX2RhdGFbIF9rZXkgXTtcblx0fVxufTtcblxuZXhwb3J0cy5zZXRCdXN5ID0gZnVuY3Rpb24gKCBfc2VsZiApIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRfc2VsZi5idXN5ID0gdHJ1ZTtcblx0fVxufTtcblxuZXhwb3J0cy5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uICggX2tleSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uICggX3ZhbHVlICkge1xuXHRcdHZhciBzZWxmID0gdGhpcyxcblx0XHRcdGF0dHJpYnV0ZXMgPSBzZWxmLl9fYXR0cmlidXRlc1sgX2tleSBdLFxuXHRcdFx0dmFsdWUgPSBhdHRyaWJ1dGVzLnR5cGUgPyBjYXN0KCBfdmFsdWUsIGF0dHJpYnV0ZXMudHlwZSwgYXR0cmlidXRlc1sgJ2RlZmF1bHQnIF0gKSA6IF92YWx1ZTtcblxuXHRcdGlmICggc2VsZi5fX2RhdGFbIF9rZXkgXSAhPT0gdmFsdWUgKSB7XG5cdFx0XHRzZWxmLmVtaXQoICdjaGFuZ2UnLCBzZWxmLl9fZGF0YVsgX2tleSBdLCB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdHNlbGYuX19kYXRhWyBfa2V5IF0gPSB2YWx1ZTtcblx0fVxufTtcblxuZXhwb3J0cy51bnNldEJ1c3kgPSBmdW5jdGlvbiAoIF9zZWxmICkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdF9zZWxmLmJ1c3kgPSBmYWxzZTtcblx0fVxufTtcblxuZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gKCkge307IiwidmFyIGlzID0gcmVxdWlyZSggJ3NjLWlzJyApLFxuXHRjYXN0ID0gcmVxdWlyZSggJ3NjLWNhc3QnICksXG5cdGhhc0tleSA9IHJlcXVpcmUoICdzYy1oYXNrZXknICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCBfbW9kZWwsIF9kYXRhLCBfbWV0aG9kLCBfdXJsLCBfY2FsbGJhY2sgKSB7XG5cdHZhciBtb2RlbCA9IF9tb2RlbCxcblx0XHRpdGVtcyA9IFtdLFxuXHRcdGlzRGlydHkgPSBtb2RlbC4kaXNEaXJ0eSgpO1xuXG5cdG1vZGVsLm1pZGRsZXdhcmUoICdhZGFwdGVyJywgZnVuY3Rpb24gKCBfZXJyb3IsIF9yZXNwb25zZSApIHtcblx0XHR2YXIgZXJyb3IgPSBfZXJyb3IsXG5cdFx0XHRyZXNwb25zZSA9IF9yZXNwb25zZTtcblxuXHRcdGlmICggZXJyb3IgJiYgISggZXJyb3IgaW5zdGFuY2VvZiBFcnJvciApICkge1xuXHRcdFx0ZXJyb3IgPSBuZXcgRXJyb3IoICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkJyApO1xuXHRcdH1cblxuXHRcdGlmICggIWVycm9yICYmIGlzRGlydHkgJiYgaXMub2JqZWN0KCByZXNwb25zZSApICYmICFoYXNLZXkoIHJlc3BvbnNlLCBtb2RlbC5fX2tleSApICkge1xuXHRcdFx0ZXJyb3IgPSBuZXcgRXJyb3IoICdUaGUgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyIGRpZCBub3QgY29udGFpbiBhIHZhbGlkIGAnICsgbW9kZWwuX19rZXkgKyAnYCcgKTtcblx0XHR9XG5cblx0XHRpZiAoICFlcnJvciAmJiBpc0RpcnR5ICYmIGlzLm9iamVjdCggcmVzcG9uc2UgKSApIHtcblx0XHRcdG1vZGVsWyBtb2RlbC5fX2tleSBdID0gcmVzcG9uc2VbIG1vZGVsLl9fa2V5IF07XG5cdFx0fVxuXG5cdFx0aWYgKCAhZXJyb3IgKSB7XG5cdFx0XHRpZiAoIGlzLmFycmF5KCByZXNwb25zZSApICkge1xuXG5cdFx0XHRcdHJlc3BvbnNlLmZvckVhY2goIGZ1bmN0aW9uICggX2RhdGEgKSB7XG5cdFx0XHRcdFx0aXRlbXMucHVzaCggbW9kZWwuJGNsb25lKCBfZGF0YSApICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRtb2RlbCA9IGl0ZW1zO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBpcy5vYmplY3QoIHJlc3BvbnNlICkgKSB7XG5cblx0XHRcdFx0T2JqZWN0LmtleXMoIHJlc3BvbnNlICkuZm9yRWFjaCggZnVuY3Rpb24gKCBfa2V5ICkge1xuXHRcdFx0XHRcdGlmICggbW9kZWwuaGFzT3duUHJvcGVydHkoIF9rZXkgKSApIHtcblx0XHRcdFx0XHRcdG1vZGVsWyBfa2V5IF0gPSByZXNwb25zZVsgX2tleSBdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0X2NhbGxiYWNrICYmIF9jYWxsYmFjayggZXJyb3IsIG1vZGVsICk7XG5cblx0fSwgX21vZGVsLCBfZGF0YSwgX21ldGhvZCwgX3VybCApO1xuXG59O1xuIl19
(17)
});
