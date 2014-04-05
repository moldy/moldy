var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'headers', function () {

	it( 'should be able to add headers', function () {
		var personMoldy = new Moldy( 'person', {
			headers: {
				'X-API-KEY': 'ec5c6970-a8e3-4294-ef78-48043e88d05b'
			},
			properties: {
				name: ''
			}
		} );

		personMoldy.$headers().should.eql( {
			'X-API-KEY': 'ec5c6970-a8e3-4294-ef78-48043e88d05b'
		} );

	} );
} );