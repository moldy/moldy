var Model = require( '../src' ),
	should = require( 'should' );

describe( 'isDirty', function () {

	it( 'should be dirty if the `key` is empty', function () {
		var personModel = new Model( 'person' )
			.property( 'name' );

		personModel.isDirty().should.be.ok;

	} );

	it( 'should _not_ be dirty if the `key` is not empty', function () {
		var personModel = new Model( 'person' )
			.property( 'name' );

		personModel.id = 1;

		personModel.isDirty().should.be.not.ok;

	} );

} );