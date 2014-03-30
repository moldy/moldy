var Model = require( '../src' ),
	should = require( 'should' );

describe( 'keyless', function () {

	it( 'keyless model', function () {
		var personModel = new Model( 'person', {
			keyless: true,
			properties: {
				name: 'string'
			}
		} );

		personModel.name = 6;

		Object.keys( personModel.$json() ).should.have.a.lengthOf( 1 );
		personModel.name.should.equal( '6' );
		personModel.should.not.have.a.property( 'id' );

	} );

	it( 'keyless model is always $isDirty', function () {
		var personModel = new Model( 'person', {
			keyless: true,
			properties: {
				name: 'string'
			}
		} );

		personModel.$isDirty().should.be.true;
		personModel.name = 'David';
		personModel.$isDirty().should.be.true;

	} );

	it( 'keyless model $isValid', function () {
		var personModel = new Model( 'person', {
			keyless: true,
			properties: {
				name: 'string'
			}
		} );

		personModel.$isValid().should.be.false;
		personModel.name = 'David';
		personModel.$isValid().should.be.true;
	} );

} );