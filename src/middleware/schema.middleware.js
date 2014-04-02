var superagent = require( 'superagent' ),
	is = require( 'sc-is' ),
	hasKey = require( 'sc-haskey' );

module.exports = function ( _model, _data, _method, _url, _next ) {

	if ( !_model[ '__schema' ] ) {

		superagent.get( _model.$url() + '/schema' ).end( function ( _error, _res ) {
			var error = _error,
				res = is.an.object( _res ) ? _res : {},
				body = hasKey( _res, 'body' ) && is.object( _res.body ) ? _res.body : {};

			if ( !error && res[ 'ok' ] !== true ) {
				error = new Error( 'The response from the server was not OK' );
			}

			if ( error ) {
				throw error;
			}

			Object.defineProperty( _model, '__schema', {
				value: body
			} );

			Object.keys( body ).forEach( function ( _key ) {

				if ( is.a.func( _model[ '$' + _key ] ) ) {
					_model[ '$' + _key ]( body[ _key ] );
				}

				if ( _key === 'properties' && is.object( body[ _key ] ) ) {
					Object.keys( body.properties ).forEach( function ( _propertyKey ) {
						var existingValue = _model[ _propertyKey ];
						_model.$property( _propertyKey, body.properties[ _propertyKey ] );
						if ( is.not.empty( existingValue ) ) {
							_model[ _propertyKey ] = existingValue;
						}
					} );
				}

			} );

			_next( _model, _data, _method, _url );

		} );

	} else {
		_next( _model, _data, _method, _url );
	}

};