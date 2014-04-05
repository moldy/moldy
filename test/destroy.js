var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'destroy', function () {

	it( 'should fail destroying a dirty moldy', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.$destroy( function ( _error, _res ) {
			_error.should.be.an.Error;
			should.not.exist( _res );
			_done();
		} );

	} );

} );