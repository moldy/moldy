var Model = require( '../src' ),
	should = require( 'should' );

Model.use( Model.ajax );

describe( 'save', function () {

	it( 'instantiate using', function ( _done ) {
		var personModel = new Model( 'person' )
			.$baseUrl( 'http://localhost:3000/empty-body' );

		personModel.$save( function ( _error, _res ) {
			_done( _error );
		} );

	} );

} );