var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'get', function () {

	it( 'get', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			key: 'guid',
			properties: {
				name: ''
			}
		} );

		personMoldy.$get( function ( _error, _res ) {
			_res.should.not.be.an.Array.and.be.a.Moldy;
			_res.should.equal( personMoldy );
			_res.$json().should.eql( {
				guid: '5a55a128-0ad7-49a5-801a-04a7030385ff',
				name: 'Goodman Delgado'
			} )
			_done( _error );
		} );
	} );

	it( 'get by id', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			key: 'guid',
			properties: {
				name: ''
			}
		} );

		personMoldy.$get( {
			guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
		}, function ( _error, bennett ) {

			if ( _error ) {
				return _done( _error );
			}

			bennett.should.equal( personMoldy );
			bennett.should.be.an.instanceOf( Moldy );
			bennett.name.should.eql( 'Bennett Sanchez' );
			bennett.name = 'Mr Bennett Sanchez';

			bennett.$save( _done );

		} );

	} );

} );