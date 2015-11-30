var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'meta', function () {

	it( 'should expose meta data to the developer', function () {
		var personMoldy = Moldy.extend( 'person', {
			meta: {
				anything: 'something'
			},
			properties: {}
		} ).create( {} );

		personMoldy.__moldy.should.have.a.property( '__meta' ).which.is.a.Object().and.eql( {
			anything: 'something'
		} );

	} );

	it( 'should have a default meta of empty object', function () {
		var personMoldy = Moldy.extend( 'person', {
			properties: {}
		} ).create( {} );

		personMoldy.__moldy.should.have.a.property( '__meta' ).which.is.a.Object().and.eql( {} );

	} );

	it( 'should not care if meta is not an object', function () {
		var personMoldy = Moldy.extend( 'person', {
			meta: 42,
			properties: {}
		} ).create( {} );

		personMoldy.__moldy.should.have.a.property( '__meta' ).which.is.a.Number().and.eql( 42 );

	} );


} );
