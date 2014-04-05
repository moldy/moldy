var is = require( 'sc-is' ),
	cast = require( 'sc-cast' ),
	hasKey = require( 'sc-haskey' ),
	helpers = require( './helpers' ),
	merge = require( 'sc-merge' ),
	emitter = require( 'emitter-component' ),
	useify = require( 'sc-useify' ),
	request = require( './request' ),
	observableArray = require( 'sg-observable-array' );

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

	self.__baseUrl = url.trim().replace( /(\/|\s)+$/g, '' );

	return is.not.a.string( _base ) ? self.__baseUrl : self;
};

Moldy.prototype.$clone = function ( _data ) {
	var self = this,
		data = cast( _data, 'object', {} ),
		newMoldy = new Moldy( self.__name, {
			baseUrl: self.__baseUrl,
			headers: self.__headers,
			key: self.__key,
			keyless: self.__keyless,
			url: self.__url
		} );

	Object.keys( self.__attributes ).forEach( function ( _propertyKey ) {
		newMoldy.$property( _propertyKey, merge( self.__attributes[ _propertyKey ] ) );
		newMoldy[ _propertyKey ] = data[ _propertyKey ]
	} );

	return newMoldy;
};

Moldy.prototype.$collection = function ( _query ) {
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
		self.emit( 'collection', _error, _res );
		callback.apply( self, arguments );
	} );

};

Moldy.prototype.$destroy = function ( _callback ) {
	var self = this,
		isDirty = self.$isDirty(),
		data = self.$json(),
		url = self.$url() + ( self.__keyless ? '' : '/' + self[ self.__key ] ),
		method = 'delete',
		callback = is.a.func( _callback ) ? _callback : helpers.noop;

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
			callback.apply( self, arguments );
		} );
	} else {
		callback.apply( self, [ new Error( 'This moldy cannot be destroyed because it has not been saved to the server yet.' ) ] );
	}

};

Moldy.prototype.$data = function ( _data ) {
	var self = this,
		data = is.object( _data ) ? _data : {};

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
		callback = is.a.func( _query ) ? _query : is.a.func( _callback ) ? _callback : helpers.noop;

	self.emit( 'preget', {
		moldy: self,
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

Moldy.prototype.$headers = function ( _headers ) {
	this.__headers = is.an.object( _headers ) ? _headers : this.__headers;
	return is.not.an.object( _headers ) ? this.__headers : this;
};

Moldy.prototype.$isDirty = function () {
	return is.empty( this[ this.__key ] );
};

Moldy.prototype.$isValid = function () {
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
		} else if ( is.not.an.object( data[ _key ] ) ) {
			json[ _key ] = data[ _key ];
		} else if ( data[ _key ] instanceof Moldy ) {
			json[ _key ] = data[ _key ].$json();
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
		base = is.empty( self.__baseUrl ) ? '' : self.__baseUrl,
		name = is.empty( self.__name ) ? '' : '/' + self.__name.trim().replace( /^\//, '' ),
		url = _url || self.__url || '',
		endpoint = base + name + ( is.empty( url ) ? '' : '/' + url.trim().replace( /^\//, '' ) );

	self.__url = url.trim().replace( /^\//, '' );

	return is.not.a.string( _url ) ? endpoint : self;
};

emitter( Moldy.prototype );
useify( Moldy );

exports = module.exports = Moldy;

/**
 * Expose built in middleware
 */
// exports.schema = require( './middleware/schema.middleware' );
// exports.ajax = require( './middleware/ajax.middleware' );