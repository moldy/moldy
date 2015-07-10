var Moldy = require( '../src' ),
	guid = require( 'sc-guid' ),
	should = require( 'should' );

describe( 'moldy', function () {

	it( 'Create a Moldy', function () {
		var personMoldy = Moldy.extend( 'person' )
			.$property( 'id' )
			.$property( 'name' )
			.$property( 'age' )
			.create();

		personMoldy.should.have.a.property( 'id', undefined );
		personMoldy.should.have.a.property( 'name', undefined );
		personMoldy.should.have.a.property( 'age', undefined );

	} );

	require( './readme.property' );
	require( './readme.url.base' );
	require( './readme.findOne' );
	require( './readme.find' );
	require( './readme.save' );
	require( './readme.destroy' );

} );
