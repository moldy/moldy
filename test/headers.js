var Model = require( '../src' ),
	should = require( 'should' );

describe( 'headers', function () {

	it( 'should be able to add headers', function () {
		var personModel = new Model( 'person' )
			.property( 'name' )
			.headers( {
				'X-API-KEY': 'ec5c6970-a8e3-4294-ef78-48043e88d05b'
			} );

		personModel.headers().should.eql( {
			'X-API-KEY': 'ec5c6970-a8e3-4294-ef78-48043e88d05b'
		} );

	} );
} );