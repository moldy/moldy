var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'A model\'s url aka endpoint', function () {

	it( 'A url (endpoint) is automatically generated based on the `Moldy` name, key, `$url()` and `$baseUrl()`', function () {
		var personMoldy = new Moldy( 'person', {
			baseUrl: '/api'
		} );

		personMoldy.$url().should.eql( '/api/person' );

		/**
		 * The url can be changed using either `base()` or `url()`
		 */
		personMoldy.$url( 'v1' );
		personMoldy.$url().should.eql( '/api/person/v1' );

	} );

} );