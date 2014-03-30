var Model = require( '../src' ),
	should = require( 'should' );

describe( 'data', function () {

	it( 'should set the data', function () {
		var personModel = new Model( 'person', {
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
		} );

		personModel.should.have.a.property( 'age' ).and.be.a.Number.and.eql( 30 );
		personModel.should.have.a.property( 'name' ).and.be.a.String.and.eql( 'David' );

		personModel.$data( {
			name: 'Max',
			age: '1',
			invalidKey: true
		} );

		Object.keys( personModel.$json() ).should.have.a.lengthOf( 3 );
		personModel.should.have.a.property( 'age' ).and.be.a.Number.and.eql( 1 );
		personModel.should.have.a.property( 'name' ).and.be.a.String.and.eql( 'Max' );
		personModel.should.not.have.a.property( 'invalidKey' );

	} );


} );