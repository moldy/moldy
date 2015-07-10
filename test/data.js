var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'data', function () {

	it( 'should set the data', function () {
		var personMoldy = Moldy.extend( 'person', {
			properties: {
				name: {
					type: 'string',
					default: 'David'
				},
				age: {
					type: 'number',
					default: 30
				}
			}
		} ).proto( {
			fullName: function () {
				return this.name + this.age;
			}
		} ).create( {
			age: 31
		} );

		personMoldy.should.have.a.property( 'age' ).which.is.a.Number().and.eql( 31 );
		personMoldy.should.have.a.property( 'name' ).which.is.a.String().and.eql( 'David' );
		personMoldy.fullName.should.exist;
		personMoldy.fullName().should.equal( 'David31' );

		personMoldy.$data( {
			name: 'Max',
			age: '1',
			invalidKey: true
		} );

		Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 3 );
		personMoldy.should.have.a.property( 'age' ).which.is.a.Number().and.eql( 1 );
		personMoldy.should.have.a.property( 'name' ).which.is.a.String().and.eql( 'Max' );
		personMoldy.should.not.have.a.property( 'invalidKey' );

	} );


} );
