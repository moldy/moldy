var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'get', function () {

	it( 'To get by id, give an object with the id', function ( _done ) {
		var personMoldy = new Moldy( 'person', 'guid' )
			.$property( 'name' )
			.$baseUrl( 'http://localhost:3000/api' );

		personMoldy.$get( {
			guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
		}, function ( _error, _res ) {

			if ( _error ) {
				return _done( _error );
			}

			_done();

		} );

	} );

} );