module.exports = function ( Moldy ) {
	return function ( done ) {
		if ( !GLOBAL.server ) {
			GLOBAL.server = require( process.cwd() + '/bin/www' );
		} else {
			GLOBAL.server.restart();
		}
		Moldy.use( require( 'moldy-ajax-adapter' ) );
		var port = process.env.PORT || 3000;
		Moldy.defaults.baseUrl = 'http://localhost:' + port + '/api';
		setTimeout( done, 500 );
	};
};
