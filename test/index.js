var Moldy = require( '../src' ),
	should = require( 'should' );

Moldy.use( require( 'moldy-adapter-ajax' ) );

describe( 'save', function () {

	it( 'instantiate using', function ( _done ) {
		var personMoldy = new Moldy( 'person' )
			.$baseUrl( 'http://localhost:3000/empty-body' );

		personMoldy.$save( function ( _error, _res ) {
			_done( _error );
		} );

	} );

} );