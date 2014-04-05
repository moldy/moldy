var is = require( 'sc-is' ),
	cast = require( 'sc-cast' ),
	hasKey = require( 'sc-haskey' );

module.exports = function ( _moldy, _data, _method, _url, _callback ) {
	var moldy = _moldy,
		items = [],
		responseShouldContainAnId = hasKey( _data, moldy.__key ) && is.not.empty( _data[ moldy.__key ] ) && /get/.test( _method ),
		isDirty = moldy.$isDirty();

	moldy.middleware( function ( _error, _response ) {
		var args = Array.prototype.slice.call( arguments ),
			error = _error === moldy ? null : args.shift(),
			response = args.shift();

		if ( error && !( error instanceof Error ) ) {
			error = new Error( 'An unknown error occurred' );
		}

		if ( !error && isDirty && is.object( response ) && ( responseShouldContainAnId && !hasKey( response, moldy.__key ) ) ) {
			error = new Error( 'The response from the server did not contain a valid `' + moldy.__key + '`' );
		}

		if ( !error && isDirty && is.object( response ) ) {
			moldy[ moldy.__key ] = response[ moldy.__key ];
		}

		if ( !error ) {
			if ( is.array( response ) ) {
				response.forEach( function ( _data ) {
					items.push( moldy.$clone( _data ) );
				} );
				moldy = items;
			} else {
				moldy.$data( response );
			}
		}

		_callback && _callback( error, moldy );

	}, _moldy, _data, _method, _url );

};