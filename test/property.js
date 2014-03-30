var Model = require( '../src' ),
	should = require( 'should' );

describe( 'property', function () {

	it( 'set properties using $property', function () {
		var personModel = new Model( 'person' )
			.$property( 'name', {
				type: 'string',
				default: 'David'
			} )
			.$property( 'age', {
				type: 'number',
				default: 30
			} )
			.$property( 'active', 'boolean' );

		Object.keys( personModel.$json() ).should.have.a.lengthOf( 4 );
		personModel.should.have.a.property( 'age' ).and.be.a.Number;
		personModel.should.have.a.property( 'name' ).and.be.a.String;

		personModel.active = 'y';
		personModel.should.have.a.property( 'active' ).and.be.a.Boolean.and.eql( true );
	} );

	it( 'set properties using the arguments when instantiating', function () {
		var personModel = new Model( 'person', {
			properties: {
				'name': {
					type: 'string',
					default: 'David'
				},
				'age': {
					type: 'number',
					default: 30
				},
				'active': 'boolean'
			}
		} );


		Object.keys( personModel.$json() ).should.have.a.lengthOf( 4 );
		personModel.should.have.a.property( 'name' ).and.be.a.String;
		personModel.should.have.a.property( 'age' ).and.be.a.Number;

		personModel.active = 'y';
		personModel.should.have.a.property( 'active' ).and.be.a.Boolean.and.eql( true );
	} );

	it( 'set a property on a manually added key', function () {
		var personModel = new Model( 'person', {
			properties: {
				'name': {
					type: 'string',
					default: 'David'
				},
				'age': {
					type: 'number',
					default: 30
				}
			}
		} );

		personModel.active = 'true';

		Object.keys( personModel.$json() ).should.have.a.lengthOf( 3 );
		personModel.should.have.a.property( 'name' ).and.be.a.String;
		personModel.should.have.a.property( 'age' ).and.be.a.Number;

		personModel.$property( 'active', {
			type: 'boolean'
		} );

		personModel.active.should.be.true;
	} );

	it( 'should not set a key if keyless', function () {
		var personModel = new Model( 'person', {
			keyless: true,
			properties: {
				name: ''
			}
		} );

		personModel.should.not.have.a.property( 'id' );

	} );

	describe( 'child models', function () {

		it( 'should be able to define a model for a property i.e. child model', function () {
			var addressModel = new Model( 'address', {
				keyless: true,
				properties: {
					'street': {
						type: 'string',
						default: 'hemlock'
					},
					'suburb': 'string',
					'country': {
						optional: true
					}
				}
			} );

			var personModel = new Model( 'person', {
				properties: {
					'name': {
						type: 'string',
						default: 'David'
					},
					'age': {
						type: 'number',
						default: 30
					},
					'address': {
						type: 'model',
						default: addressModel
					}
				}
			} );

			Object.keys( personModel.$json() ).should.have.a.lengthOf( 4 );
			personModel.should.have.a.property( 'name' ).and.be.a.String;
			personModel.should.have.a.property( 'age' ).and.be.a.Number;
			personModel.address.street.should.eql( 'hemlock' );

			// ensuring a `model` type cannot be overriden
			personModel.address = 'wat';

			var personModelJson = personModel.$json();

			personModelJson.should.eql( {
				id: undefined,
				name: 'David',
				age: 30,
				address: {
					street: 'hemlock',
					suburb: null
				}
			} );

		} );

	} );

} );