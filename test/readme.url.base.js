var Model = require( '../src' ),
	should = require( 'should' );

describe( 'A model\'s url aka endpoint', function () {

	it( 'A url (endpoint) is automatically generated based on the `Model` name, key, `$url()` and `$baseUrl()`', function () {
		var personModel = new Model( 'person' )
			.$property( 'id', {
				default: '46'
			} )
			.$property( 'name' );

		personModel.$url().should.eql( '/person' );

		/**
		 * The url can be changed using either `base()` or `url()`
		 */
		personModel.$url( 'v1' );
		personModel.$url().should.eql( '/person/v1' );

		personModel.$baseUrl( '/api' );
		personModel.$url().should.eql( '/api/person/v1' );

	} );

} );