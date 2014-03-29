module.exports = function ( _model, _data, _method, _url, _callback ) {
	var model = _model;

	model.middleware( 'adapter', function ( _error, _response ) {
		var error = _error,
			response = _response;

		if ( error && typeof error !== Error ) {
			error = new Error( 'An unknown error occurred' );
		}

		_callback && _callback( error, response );

	}, _model, _data, _method, _url );

};