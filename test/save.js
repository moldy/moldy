var Moldy = require( '../src' ),
	should = require( 'should' );

var server = 'http://localhost:' + ( process.env.PORT || 3000 );

describe( 'save', function () {

	before( require( './setup' )( Moldy ) );
	after( require( './setup/teardown' ) );

	it( 'should handle an empty body', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			baseUrl: server + '/empty-body'
		} ).create();

		personMoldy.$save( function ( _error, _res ) {
			_done( _error );
		} );

	} );

	it( 'should handle a 4xx response', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			baseUrl: server + '/400'
		} ).create();

		personMoldy.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

	it( 'should handle a 4xx response', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			baseUrl: server + '/404'
		} ).create();

		personMoldy.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

	it( 'should handle a 5xx response', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			baseUrl: server + '/500'
		} ).create();

		personMoldy.$save( function ( _error, _res ) {
			_error.should.be.an.instanceOf( Error );
			_done();
		} );

	} );

} );
