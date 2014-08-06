module.exports = function ( Moldy ) {
	return function ( done ) {
		if ( !GLOBAL.server ) {
			GLOBAL.server = require( process.cwd() + '/bin/www' );
		} else {
			GLOBAL.server.restart();
		}
		Moldy.use( require( 'moldy-ajax-adapter' ) );
		Moldy.defaults.baseUrl = 'http://localhost:3000/api';
		setTimeout( done, 500 );
	};
};