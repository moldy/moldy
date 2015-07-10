var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'findOne', function () {

	before( require( './setup' )( Moldy ) );
	after( require( './setup/teardown' ) );

	it( 'findOne', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: ''
			}
		} );

		Person.$findOne( function ( _error, _res ) {
			var res = _res;

			res.should.not.be.an.Array();
			res.should.be.a.Moldy;
			res.$json().should.eql( {
				guid: '5a55a128-0ad7-49a5-801a-04a7030385ff',
				name: 'Goodman Delgado'
			} );
			_done( _error );
		} );
	} );

	it( 'findOne that does not exist', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: ''
			}
		} );

		Person.$findOne( {
			guid: 'wat'
		}, function ( _error, _res ) {
			var res = _res;

			should( _error ).eql( undefined );
			should( _res ).eql( undefined );

			_done( _error );
		} );
	} );

	it( 'findOne by id', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: ''
			}
		} );

		Person.$findOne( {
			guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
		}, function ( _error, bennett ) {

			if ( _error ) {
				return _done( _error );
			}

			bennett.name.should.eql( 'Bennett Sanchez' );
			bennett.name = 'Mr Bennett Sanchez';

			bennett.$save( _done );

		} );

	} );

	it( 'get with an array of a type', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: 'string',
				friends: [ {
					keyless: true,
					properties: {
						id: 'string',
						name: 'string',
						age: {
							type: 'number',
							default: 10
						}
					}
				} ]
			}
		} );

		Person.$findOne( function ( _error, res ) {
			var _res = res;

			_res.should.not.be.an.Array();
			_res.should.be.a.Moldy;

			_res.friends.should.be.an.Array;
			_res.friends[ 0 ].id.should.be.a.String().and.equal( '0' );
			_res.friends[ 0 ].name.should.be.a.String().and.equal( 'Blake Oneill' );
			_res.friends[ 0 ].age.should.be.a.Number().and.equal( 10 );
			_res.friends[ 1 ].id.should.be.a.String().and.equal( '1' );
			_res.friends[ 1 ].name.should.be.a.String().and.equal( 'Hardin Jenkins' );
			_res.friends[ 1 ].age.should.be.a.Number().and.equal( 10 );
			_res.friends[ 2 ].id.should.be.a.String().and.equal( '2' );
			_res.friends[ 2 ].name.should.be.a.String().and.equal( 'Kasey Jacobson' );
			_res.friends[ 2 ].age.should.be.a.Number().and.equal( 10 );
			_done( _error );
		} );

	} );

} );
