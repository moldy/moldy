var Model = require( '../src' ),
	should = require( 'should' );

describe( 'isValid', function () {

	it( 'should be invalid with no type and no value', function () {
		var personModel = new Model( 'person' )
			.property( 'name' );

		personModel.isValid().should.not.be.ok;
		personModel.name = 'David';
		personModel.isValid().should.be.ok;

	} );

} );