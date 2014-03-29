var cast = require( 'sc-cast' ),
	merge = require( 'sc-merge' );

exports.attributes = function ( _key, _value ) {
	return merge( {
		name: _key || '',
		type: '',
		default: null,
		optional: false
	}, _value );
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