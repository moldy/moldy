var Model = require( './' ),
	request = require( 'superagent' ),
	is = require( 'sc-is' ),
	hasKey = require( 'sc-haskey' );

module.exports = function ( _model, _data, _method, _url, _callback ) {
	var method = /delete/i.test( _method ) ? 'del' : _method,
		model = _model,
		data = _data,
		url = _url,
		isDirty = model.isDirty(),
		modelKey,
		error;

	if ( /get/i.test( method ) && hasKey( data, model.__key ) && new RegExp( data[ model.__key ] ).test( url ) === false ) {
		modelKey = data[ model.__key ];
		delete data[ model.__key ];
		url += '/' + modelKey;
	}

	request[ method ]( url )[ /get/i.test( method ) ? 'query' : 'send' ]( data )
		.set( model.headers() )
		.type( 'json' )
		.accept( 'json' )
		.end( function ( _error, _res ) {
			var res = is.an.object( _res ) ? _res : {},
				items = [],
				body = hasKey( _res, 'body' ) && ( is.object( _res.body ) || is.array( _res.body ) ) ? _res.body : null;

			if ( res[ 'ok' ] !== true ) {
				error = new Error( 'The response from the server was not OK' );
			}

			if ( body === null ) {
				error = new Error( 'The response from the server contained an empty body' );
			}

			if ( !error && isDirty && is.object( body ) && !hasKey( body, model.__key ) ) {
				error = new Error( 'The response from the server did not contain a valid `' + model.__key + '`' );
			}

			if ( !error && isDirty && is.object( body ) ) {
				model[ model.__key ] = body[ model.__key ];
			}

			if ( is.array( body ) ) {

				body.forEach( function ( _data ) {
					items.push( model.clone( _data ) );
				} );

				model = items;

			} else if ( is.object( body ) ) {

				Object.keys( body ).forEach( function ( _key ) {
					if ( model.hasOwnProperty( _key ) ) {
						model[ _key ] = body[ _key ];
					}
				} );

			}

			_callback && _callback( error, model );
		} );

}