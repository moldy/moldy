var Model = require( '../src' ),
	should = require( 'should' );

describe( 'collection', function () {

	it( 'To get a collection', function ( _done ) {
		var personModel = new Model( 'person', 'guid' )
			.property( 'name' )
			.base( 'http://localhost:3000/api' );

		personModel.collection( function ( _error, _people ) {

			if ( _error ) {
				return _done( _error );
			}

			_people.should.be.an.Array.with.a.lengthOf( 3 );

			_people.forEach( function ( _person ) {
				_person.should.be.a.Model;
			} );

			_done();

		} );

	} );

} );