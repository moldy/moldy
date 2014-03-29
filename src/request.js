var is = require( 'sc-is' ),
	cast = require( 'sc-cast' ),
	hasKey = require( 'sc-haskey' );

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
