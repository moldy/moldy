var Model = require( '../src' ),
	should = require( 'should' );

describe( 'save', function () {

	it( 'should handle an empty body', function ( _done ) {
		var personModel = new Model( 'person' )
			.$baseUrl( 'http://localhost:3000/empty-body' );

		personModel.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

	it( 'should handle a 4xx response', function ( _done ) {
		var personModel = new Model( 'person' )
			.$baseUrl( 'http://localhost:3000/400' );

		personModel.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

	it( 'should handle a 4xx response', function ( _done ) {
		var personModel = new Model( 'person' )
			.$baseUrl( 'http://localhost:3000/404' );

		personModel.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

	it( 'should handle a 5xx response', function ( _done ) {
		var personModel = new Model( 'person' )
			.$baseUrl( 'http://localhost:3000/500' );

		personModel.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

} );