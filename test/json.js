var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'json', function () {

	it( 'should return the raw JSON representaiton of the model', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.name = 'David';
		personMoldy.age = '34';

		var data = personMoldy.$json();

		data.should.eql( {
			id: undefined,
			name: 'David',
			age: 34
		} );

	} );

	it( 'should return all properties even when they have not been set', function () {
		var personMoldy = Moldy.create( 'person' )
			.$property( 'name' )
			.$property( 'age' );

		var data = personMoldy.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id', undefined );
		data.should.have.a.property( 'name', undefined );
		data.should.have.a.property( 'age', undefined );

	} );

	it( 'should handle optional properties', function () {
		var personMoldy = Moldy.create( 'person' )
			.$property( 'name' )
			.$property( 'age', {
				optional: true
			} );

		var data = personMoldy.$json();

		Object.keys( data ).should.have.a.lengthOf( 2 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.not.have.a.property( 'age' );

		personMoldy.age = 34;

		data = personMoldy.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.have.a.property( 'age', 34 );

	} );

	it( 'should handle optional properties with defaults', function () {
		var personMoldy = Moldy.create( 'person' )
			.$property( 'name' )
			.$property( 'age', {
				optional: true,
				default: 0
			} );

		var data = personMoldy.$json();

		Object.keys( data ).should.have.a.lengthOf( 2 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.not.have.a.property( 'age' );

	} );

	it( 'should handle properties with defaults', function () {
		var personMoldy = Moldy.create( 'person' )
			.$property( 'name' )
			.$property( 'age', {
				default: 0
			} );

		var data = personMoldy.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.have.a.property( 'age', 0 );

	} );

	it( 'should handle properties with object types', function () {
		var personMoldy = Moldy.create( 'person', {} )
			.$property( 'name' )
			.$property( 'age' )
			.$property( 'address', {
				type: 'object'
			} );

		personMoldy.address = {
			suburb: 'warner',
			country: 'australia'
		};

		var data = personMoldy.$json();

		data.should.eql( {
			id: undefined,
			name: null,
			age: null,
			address: {
				suburb: 'warner',
				country: 'australia'
			}
		} );

	} );

} );