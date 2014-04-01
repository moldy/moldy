var is = require( 'sc-is' ),
	cast = require( 'sc-cast' ),
	hasKey = require( 'sc-haskey' );

module.exports = function ( _model, _data, _method, _url, _callback ) {
	var model = _model,
		items = [],
		responseShouldContainAnId = hasKey( _data, model.__key ) && is.not.empty( _data[ model.__key ] ) && /get/.test( _method ),
		isDirty = model.$isDirty();

	model.middleware( 'adapter', function ( _error, _response ) {
		var args = Array.prototype.slice.call( arguments ),
			error = _error === model ? null : args.shift(),
			response = args.shift();

		if ( error && !( error instanceof Error ) ) {
			error = new Error( 'An unknown error occurred' );
		}

		if ( !error && isDirty && is.object( response ) && ( responseShouldContainAnId && !hasKey( response, model.__key ) ) ) {
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
			} else {
				model.$data( response );
			}
		}

		_callback && _callback( error, model );

	}, _model, _data, _method, _url );

};