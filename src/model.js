var cast = require( 'sc-cast' ),
	emitter = require( 'emitter-component' ),
	guid = require( 'sc-guid' ),
	hasKey = require( 'sc-haskey' ),
	helpers = require( './helpers' ),
	is = require( 'sc-is' ),
	extend = helpers.extendObject;

var Model = function ( _initial, _moldy ) {
	var self = this,
		initial = _initial || {};

	this.__moldy = _moldy;
	this.__isMoldy = true;
	this.__attributes = {};
	this.__data = {};
	this.__diff = {};
	this.__destroyed = false;

	if ( !self.__moldy.__keyless ) {
		self.__moldy.$defineProperty( self, self.__moldy.__key );
	}

	Object.keys( cast( self.__moldy.__metadata, 'object', {} ) ).forEach( function ( _key ) {
		self.__moldy.$defineProperty( self, _key, initial[ _key ] );
	} );

	// Reset the diff after all the properties have been defined.
	this.__diff = {};

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

Model.prototype.$json = function ( shouldDiff ) {
	var self = this,
		data = self.__data,
		json = {};

	Object.keys( data )
		.filter( function ( _key ) {
			// If we've requested a diff, only return the items that have changed.
			// Also return moldy items as they can keep their own diff state.
			return !shouldDiff ||
				_key === 'id' ||
				self.__data[ _key ] instanceof Array ||
				( data[ _key ] && data[ _key ].__moldy ) ||
				self.__diff[ _key ];
		} )
		.forEach( function ( _key ) {
			if ( is.an.array( data[ _key ] ) && data[ _key ][ 0 ] instanceof Model ) {
				json[ _key ] = [];
				data[ _key ].forEach( function ( _moldy ) {
					json[ _key ].push( _moldy.$json( shouldDiff ) );
				} );
			} else if ( is.a.date( data[ _key ] ) ) {
				json[ _key ] = data[ _key ].toISOString();
			} else {
				json[ _key ] = data[ _key ] instanceof Model ? data[ _key ].$json( shouldDiff ) : data[ _key ];
			}
		} );

	return json;
};

Model.prototype.$update = function ( _callback ) {
	this.$do( {
		method: 'save',
		isDirectOperation: false,
		data: this.$json( true )
	}, _callback );

};

Model.prototype.$save = function ( _data, _callback ) {
	var data = arguments[ 0 ];
	var callback = helpers.last( arguments );
	var isDirectOperation = is.a.object( data ) && is.not.a.func( data );

	this.$do( {
		method: this.$isDirty() ? 'create' : 'save',
		isDirectOperation: isDirectOperation,
		data: cast( data, 'object', this.$json() )
	}, callback );
};

Model.prototype.$do = function ( _options, _callback ) {
	var self = this,
		error = null,
		eguid = guid.generate(),
		data = _options.data,
		callback = helpers.last( arguments );

	callback = is.a.func( callback ) ? callback : helpers.noop;

	self.__destroyed = false;

	self.__moldy.emit( 'busy', eguid );
	self.emit( 'presave', {
		moldy: self,
		data: data,
		method: _options.method,
		callback: callback
	} );

	var responseShouldContainAnId = hasKey( data, self.__key ) && is.not.empty( data[ self.__key ] );

	var saveDone = function ( _error, _res ) {

		if ( _error && !( _error instanceof Error ) ) {
			_error = new Error( 'An unknown error occurred' );
		}

		if ( !_error && _options.isDirty && is.object( _res ) && ( responseShouldContainAnId && !hasKey( _res, self.__moldy.__key ) ) ) {
			_error = new Error( 'The response from the server did not contain a valid `' + self.__moldy.__key + '`' );
		}

		if ( !_error && _options.isDirty && is.object( _res ) ) {
			self.__moldy[ self.__moldy.__key ] = _res[ self.__moldy.__key ];
		}

		if ( !error ) {
			self.$data( _res, {
				mergeArrayOfAType: false
			} );
		}

		self.emit( 'save', _error, self );
		self.__moldy.emit( 'busy:done', eguid );

		callback && callback( _error, self, _res );
	};

	if ( !_options.isDirectOperation ) {
		self.__moldy.__adapter[ self.__moldy.__adapterName ][ _options.method ].call( self.__moldy, data, saveDone );
	} else {
		self.__moldy.__adapter[ self.__moldy.__adapterName ][ _options.method ].call( self.__moldy, data, _options.isDirectOperation, saveDone );
	}
};

emitter( Model.prototype );

Model.extend = extend;

exports = module.exports = Model;
