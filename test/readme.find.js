var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'find', function () {

	it( 'To find an array of models', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: 'string'
			}
		} );

		Person.$find( function ( _error, _people ) {

			if ( _error ) {
				return _done( _error );
			}

			_people.should.be.an.Array.with.a.lengthOf( 3 );

			_people.forEach( function ( _person ) {
				_person.should.be.a.Moldy;
			} );

			_done();

		} );

	} );

} );