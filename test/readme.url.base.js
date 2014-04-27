var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'A model\'s url aka endpoint', function () {

	it( 'A url (endpoint) is automatically generated based on the `Moldy` name, key, `$url()` and `$baseUrl()`', function () {
		var Person = Moldy.extend( 'person', {
			baseUrl: '/api'
		} );

		var personMoldy = Person.create();

		Person.$url().should.eql( '/api/person' );

		/**
		 * The url can be changed using either `base()` or `url()`
		 */
		Person.$url( 'v1' );
		Person.$url().should.eql( '/api/person/v1' );

	} );

} );