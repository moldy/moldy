var Model = require( '../src' ),
	should = require( 'should' );

describe( 'isValid', function () {

	it( 'should be invalid with no type and no value', function () {
		var personModel = new Model( 'person', {
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personModel.$isValid().should.not.be.ok;
		personModel.name = 'David';
		personModel.$isValid().should.not.be.ok;
		personModel.age = '30';
		personModel.$isValid().should.be.ok;

	} );

	it( 'should be able to handle it when the model contains an array of a primitive type', function () {
		var personModel = new Model( 'person', {
			properties: {
				name: 'string',
				tags: [ 'string' ]
			}
		} );

		personModel.$isValid().should.not.be.ok;
		personModel.name = 'David';
		personModel.$isValid().should.not.be.ok;
		personModel.tags.push( 1 );
		personModel.$isValid().should.be.ok;

	} );

	it( 'should be able to handle it when the model contains an array of a model type', function () {
		var personModel = new Model( 'person', {
			properties: {
				name: 'string',
				tags: [ {
					keyless: true,
					properties: {
						name: 'string'
					}
				} ]
			}
		} );

		personModel.$isValid().should.not.be.ok;
		personModel.name = 'David';
		personModel.$isValid().should.not.be.ok;
		personModel.tags.push( 'guy' );
		personModel.$isValid().should.not.be.ok;
		personModel.tags[ 0 ].name = 'guy';
		personModel.$isValid().should.be.ok;

	} );

} );