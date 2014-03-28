var Model = require( '../src' ),
	should = require( 'should' );

describe( 'get', function () {

	it( 'get by id', function ( _done ) {
		var personModel = new Model( 'person', 'guid' )
			.$property( 'name' )
			.$base( 'http://localhost:3000/api' );

		personModel.$get( {
			guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
		}, function ( _error, bennett ) {

			if ( _error ) {
				return _done( _error );
			}

			bennett.should.be.an.instanceOf( Model );
			bennett.name.should.eql( 'Bennett Sanchez' );
			bennett.name = 'Mr Bennett Sanchez';

			bennett.$save( function ( _error, _res ) {

				if ( _error ) {
					return _done( _error );
				}

				_done();

			} );

		} );

	} );

} );