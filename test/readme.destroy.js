var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'destroy', function () {

	//before( require( './setup' )( Moldy ) );

	it( 'To destroy a model, call `destroy()`', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: 'string'
			}
		} ).create();

		personMoldy.name = 'David';

		personMoldy.$save( function ( _error, _res ) {

			if ( _error ) {
				return _done( _error );
			}

			personMoldy.$destroy( function ( _error, _res ) {

				personMoldy.$isDirty().should.be.true;
				//personMoldy.$isValid().should.be.false; -- DO NOT GET WHY SHOULD BE FALSE
				//personMoldy.__destroyed.should.be.true;
				_done( _error );

			} );

		} );

	} );

} );