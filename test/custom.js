var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'custom', function () {

	it( 'should expose custom data to the developer', function () {
		var personMoldy = Moldy.extend( 'person', {
			custom: {
				anything: 'something'
			},
			properties: {}
		} ).create( {} );

		personMoldy.__moldy.should.have.a.property( '__custom' ).which.is.a.Object().and.eql( {
			anything: 'something'
		} );

	} );

	it( 'should have a default custom of empty object', function () {
		var personMoldy = Moldy.extend( 'person', {
			properties: {}
		} ).create( {} );

		personMoldy.__moldy.should.have.a.property( '__custom' ).which.is.a.Object().and.eql( {} );

	} );

	it( 'should not care if custom is not an object', function () {
		var personMoldy = Moldy.extend( 'person', {
			custom: 42,
			properties: {}
		} ).create( {} );

		personMoldy.__moldy.should.have.a.property( '__custom' ).which.is.a.Number().and.eql( 42 );

	} );


} );
