var superagent = require( 'superagent' ),
	cast = require( 'sc-cast' ),
	is = require( 'sc-is' ),
	hasKey = require( 'sc-haskey' );

module.exports = function ( _model, _data, _method, _url, _callback ) {
	var method = /delete/i.test( _method ) ? 'del' : _method,
		model = _model,
		data = cast( _data, 'object', {} ),
		url = _url,
		error;

	if ( /get/i.test( method ) && hasKey( data, model.__key ) && new RegExp( data[ model.__key ] ).test( url ) === false ) {
		url += '/' + data[ model.__key ];
		delete data[ model.__key ];
	}

	superagent[ method ]( url )[ /get/i.test( method ) ? 'query' : 'send' ]( data )
		.set( model.$headers() )
		.type( 'json' )
		.accept( 'json' )
		.end( function ( _error, _res ) {
			var res = is.an.object( _res ) ? _res : {},
				body = hasKey( _res, 'body' ) && ( is.object( _res.body ) || is.array( _res.body ) ) ? _res.body : null;

			if ( res[ 'ok' ] !== true ) {
				error = new Error( 'The response from the server was not OK' );
			}

			if ( body === null ) {
				error = new Error( 'The response from the server contained an empty body' );
			}

			_callback && _callback( error, body );

		} );

}