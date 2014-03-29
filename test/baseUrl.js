var Model = require( '../src' ),
	should = require( 'should' );

describe( 'baseUrl', function () {

	it( 'should set the baseUrl', function () {
		var personModel = new Model( 'person', {
			baseUrl: '/api'
		} );

		personModel.$baseUrl().should.eql( '/api' );
		personModel.$baseUrl( '/api/v2' );
		personModel.$baseUrl().should.eql( '/api/v2' );

	} );

} );