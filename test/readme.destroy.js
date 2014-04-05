var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'destroy', function () {

	it( 'To destroy a model, call `destroy()`', function ( _done ) {
		var personMoldy = new Moldy( 'person' )
			.$property( 'name' )
			.$baseUrl( 'http://localhost:3000/api' );

		personMoldy.name = 'David';

		personMoldy.$save( function ( _error, _res ) {

			if ( _error ) {
				return _done( _error );
			}

			personMoldy.$destroy( function ( _error, _res ) {

				_done( _error );

			} );

		} );

	} );

} );