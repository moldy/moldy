var Model = require( '../src' ),
	should = require( 'should' );

describe( 'json', function () {

	it( 'should return the raw JSON representaiton of the model', function () {
		var personModel = new Model( 'person', {
			properties: {
				name: '',
				age: ''
			}
		} );

		personModel.name = 'David';
		personModel.age = 34;

		var data = personModel.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id', undefined );
		data.should.have.a.property( 'name', 'David' );
		data.should.have.a.property( 'age', 34 );

	} );

	it( 'should return all properties even when they have not been set', function () {
		var personModel = new Model( 'person' )
			.$property( 'name' )
			.$property( 'age' );

		var data = personModel.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id', undefined );
		data.should.have.a.property( 'name', undefined );
		data.should.have.a.property( 'age', undefined );

	} );

	it( 'should handle optional properties', function () {
		var personModel = new Model( 'person' )
			.$property( 'name' )
			.$property( 'age', {
				optional: true
			} );

		var data = personModel.$json();

		Object.keys( data ).should.have.a.lengthOf( 2 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.not.have.a.property( 'age' );

		personModel.age = 34;

		data = personModel.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.have.a.property( 'age', 34 )

	} );

	it( 'should handle optional properties with defaults', function () {
		var personModel = new Model( 'person' )
			.$property( 'name' )
			.$property( 'age', {
				optional: true,
				default: 0
			} );

		var data = personModel.$json();

		Object.keys( data ).should.have.a.lengthOf( 2 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.not.have.a.property( 'age' );

	} );

	it( 'should handle properties with defaults', function () {
		var personModel = new Model( 'person' )
			.$property( 'name' )
			.$property( 'age', {
				default: 0
			} );

		var data = personModel.$json();

		Object.keys( data ).should.have.a.lengthOf( 3 );

		data.should.have.a.property( 'id' );
		data.should.have.a.property( 'name' );
		data.should.have.a.property( 'age', 0 );

	} );

} );