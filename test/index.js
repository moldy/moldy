var Moldy = require( '../src' ),
	should = require( 'should' );

Moldy.use( require( 'moldy-ajax-adapter' ) );
Moldy.defaults.baseUrl = 'http://localhost:3000/api';

describe( 'save', function () {

	it( 'instantiate using', function ( _done ) {
		var personMoldy = new Moldy( 'person' );

		personMoldy.$save( function ( _error, _res ) {
			_done( _error );
		} );

	} );

} );