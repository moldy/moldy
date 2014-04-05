var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'isValid', function () {

	it( 'should be invalid with no type and no value', function () {
		var personMoldy = new Moldy( 'person', {
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.$isValid().should.not.be.ok;
		personMoldy.name = 'David';
		personMoldy.$isValid().should.not.be.ok;
		personMoldy.age = '30';
		personMoldy.$isValid().should.be.ok;

	} );

	it( 'should be able to handle it when the model contains an array of a primitive type', function () {
		var personMoldy = new Moldy( 'person', {
			properties: {
				name: 'string',
				tags: [ 'string' ]
			}
		} );

		personMoldy.$isValid().should.not.be.ok;
		personMoldy.name = 'David';
		personMoldy.$isValid().should.not.be.ok;
		personMoldy.tags.push( 1 );
		personMoldy.$isValid().should.be.ok;

	} );

	it( 'should be able to handle it when the model contains an array of a model type', function () {
		var personMoldy = new Moldy( 'person', {
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

		personMoldy.$isValid().should.not.be.ok;
		personMoldy.name = 'David';
		personMoldy.$isValid().should.not.be.ok;
		personMoldy.tags.push( 'guy' );
		personMoldy.$isValid().should.not.be.ok;
		personMoldy.tags[ 0 ].name = 'guy';
		personMoldy.$isValid().should.be.ok;

	} );

	it( 'should be able to handle it when the model contains an array of a model type with an optional variation', function () {
		var personMoldy = new Moldy( 'person', {
			properties: {
				name: 'string',
				tags: {
					type: [ {
						keyless: true,
						properties: {
							name: {
								type: 'string',
								optional: true
							}
						}
					} ]
				}
			}
		} );

		personMoldy.$isValid().should.not.be.ok;
		personMoldy.name = 'David';
		personMoldy.$isValid().should.not.be.ok;
		personMoldy.tags.push( 'guy' );
		personMoldy.$isValid().should.be.ok;

	} );

} );