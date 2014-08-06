var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'save', function () {

	before( require( './setup' )( Moldy ) );
	after( require( './setup/teardown' ) );

	it( 'To save the model, call `save()`. If the model is `dirty` (has not been saved to the server and therefore does not have a valid `key`) then the http method will be POST. If the model has been saved, then the http method will be PUT', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			properties: {
				name: 'string'
			}
		} ).create();

		personMoldy.name = 'David';

		personMoldy.$save( function ( _error, _res ) {

			if ( _error ) {
				return _done( _error );
			}

			personMoldy.$json().should.eql( _res.$json() );
			personMoldy.should.have.a.property( 'id' );
			personMoldy.name = 'Mr David';

			personMoldy.$save( function ( _error, _res ) {

				personMoldy.should.eql( _res );
				_done( _error );

			} );

		} );

	} );

} );