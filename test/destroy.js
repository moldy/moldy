var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'destroy', function () {

	it( 'should destroy', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			key: 'guid',
			baseUrl: 'http://localhost:3000/api',
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.$get( function ( _error ) {
			personMoldy.__destroyed.should.be.false;

			personMoldy.$destroy( function ( _error ) {

				personMoldy.__destroyed.should.be.true;
				personMoldy.$save( function ( _error, _res ) {
					_error.should.be.an.Error;
					_done();
				} );

			} );

		} );

	} );

	it( 'should fail destroying a dirty moldy', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.$destroy( function ( _error, _res ) {
			_error.should.be.an.Error;
			should.not.exist( _res );
			_done();
		} );

	} );

	it( 'should _not_ fail trying to get a $collection when destroyed because $collection returns an array', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			key: 'guid',
			baseUrl: 'http://localhost:3000/api',
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.$get( function () {
			personMoldy.$destroy( function () {
				personMoldy.$collection( function ( _error, _res ) {
					_res.should.be.an.Array;
					_done( _error );
				} );
			} );
		} );

	} );

	it( 'should fail trying to $get when destroyed', function ( _done ) {
		var personMoldy = new Moldy( 'person', {
			key: 'guid',
			baseUrl: 'http://localhost:3000/api',
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		personMoldy.$get( function () {
			personMoldy.$destroy( function () {
				personMoldy.$get( function ( _error ) {
					_error.should.be.an.Error;
					_done();
				} );
			} );
		} );

	} );

} );