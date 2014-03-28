var Model = require( '../src' ),
	guid = require( 'sc-guid' ),
	should = require( 'should' );

describe( 'sg-model', function () {

	it( 'Create a Model', function () {
		var personModel = new Model( 'person' )
			.$property( 'id' )
			.$property( 'name' )
			.$property( 'age' );

		personModel.should.have.a.property( 'id', null );
		personModel.should.have.a.property( 'name', null );
		personModel.should.have.a.property( 'age', null );

	} );

	require( './readme.property' );
	require( './readme.url.base' );
	require( './readme.get' );
	require( './readme.collection' );
	require( './readme.save' );
	require( './readme.destroy' );

} );