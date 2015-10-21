var Moldy = require( "../src" ),
	should = require( 'should' );

describe( 'types by references', function () {

	it( 'should not assign new defaults by reference (object)', function () {
		var schema = {
			properties: {
				age: 'number',
				active: {
					type: "*",
					default: {}
				},
				tags: 'array'
			}
		};

		var personMoldy1 = Moldy.extend( 'person', schema ).create();
		personMoldy1.active.bar = 1;

		var personMoldy2 = Moldy.extend( 'person', schema ).create();
		personMoldy2.active.foo = 2;

		should.not.exist( personMoldy1.active.foo );
		should.not.exist( personMoldy2.active.bar );

		should.exist( personMoldy1.active.bar );
		should.exist( personMoldy2.active.foo );

	} );

	it( 'should not assign new defaults by reference (array)', function () {
		var schema = {
			properties: {
				age: 'number',
				active: {
					type: "*",
					default: []
				},
				tags: 'array'
			}
		};

		var personMoldy1 = Moldy.extend( 'person', schema ).create();
		personMoldy1.active.push( 1 );

		var personMoldy2 = Moldy.extend( 'person', schema ).create();
		personMoldy2.active.push( 2 );
		personMoldy2.active.push( 3 );
		personMoldy2.active.push( 4 );


		personMoldy1.active.should.deepEqual( [ 1 ] );
		personMoldy2.active.should.deepEqual( [ 2, 3, 4 ] );

	} );
} );
