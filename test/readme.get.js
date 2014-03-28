var Model = require( '../src' ),
	should = require( 'should' );

describe( 'get', function () {

	it( 'To get by id, give an object with the id', function ( _done ) {
		var personModel = new Model( 'person', 'guid' )
			.$property( 'name' )
			.$base( 'http://localhost:3000/api' );

		personModel.$get( {
			guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
		}, function ( _error, _res ) {

			if ( _error ) {
				return _done( _error );
			}

			_done();

		} );

	} );

} );