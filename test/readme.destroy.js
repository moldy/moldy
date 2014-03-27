var Model = require( '../src' ),
	should = require( 'should' );

describe( 'destroy', function () {

	it( 'To destroy a model, call `destroy()`', function ( _done ) {
		var personModel = new Model( 'person' )
			.property( 'name' )
			.base( 'http://localhost:3000/api' );

		personModel.name = 'David';

		personModel.save( function ( _error, _res ) {

			if ( _error ) {
				return _done( _error );
			}

			personModel.destroy( function ( _error, _res ) {

				_done( _error );

			} );

		} );

	} );

} );