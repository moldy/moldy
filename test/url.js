var Model = require( '../src' ),
	should = require( 'should' );

describe( 'url', function () {

	it( 'should be empty', function () {
		var personModel = new Model();
		personModel.$url().should.eql( '' );
	} );

	it( 'should be the name', function () {
		var personModel = new Model( 'person' );
		personModel.$url().should.eql( '/person' );
	} );

	it( 'should be the base and the name', function () {
		var personModel = new Model( 'person' ).$baseUrl( '/api/' );
		personModel.$url().should.eql( '/api/person' );

		personModel.$baseUrl( 'http://domain.com/api' );
		personModel.$url().should.eql( 'http://domain.com/api/person' );
	} );

} );