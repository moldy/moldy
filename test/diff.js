var Moldy = require( '../src' ),
	should = require( 'should' ),
	async = require( 'async' ),
	dummy = require( './adapter/dummy' )();

Moldy.use( dummy.adapter );

var schema = {
	'properties': {
		'body': 'string',
		'endTime': {
			'type': 'string',
			'default': 'five'
		},
		'location': {
			'type': 'number',
			'default': 5
		},
		'queue': {
			'type': 'array',
			'default': [ 4, 8, 15, 16, 23, 42 ]
		},
		'actions': {
			'keyless': true,
			'properties': {
				'sit': {
					'type': 'number',
					'default': 5
				},
				'stand': {
					'type': 'number',
					'default': 5
				}
			}
		}
	}
};
describe( 'diff', function () {
	beforeEach( function ( _done ) {
		dummy.actions.length = 0;
		_done();
	} );

	it( 'should diff', function () {
		var postMoldy = Moldy.extend( 'post', schema ).create();
		postMoldy.body = 'cheese';
		postMoldy.actions.sit = 12;
		var diff = JSON.parse( JSON.stringify( postMoldy.$json( {
			diff: true
		} ) ) );

		diff.should.eql( {
			body: 'cheese',
			queue: [ 4, 8, 15, 16, 23, 42 ],
			actions: {
				sit: 12
			}
		} );
	} );

	it( 'Diff should be cleared after save', function ( _done ) {
		var moldo = Moldy.extend( 'person', {
			properties: {
				didOtherStuff: 'boolean'
			}
		} ).create();

		moldo.$json( {
			diff: true
		} ).should.eql( {
			id: undefined
		} );
		moldo.didOtherStuff = true;
		moldo.$json( {
			diff: true
		} ).should.eql( {
			id: undefined,
			didOtherStuff: true
		} );
		moldo.$update( function ( _error, _person ) {
			( typeof moldo.$json( {
				diff: true
			} ).didOtherStuff ).should.eql( 'undefined' );
			moldo.didOtherStuff.should.eql( true );
			return _done( _error, _person );
		} );
	} );

	it( 'should create for new id-less item.', function ( _done ) {
		var personMoldy = Moldy.extend( '2', {
			properties: {
				name: 'string',
				job: {
					default: 'unemployed'
				}
			}
		} ).create();
		personMoldy.name = 'David';

		// The diff should only return what's changed.
		personMoldy.$json( {
			diff: true
		} ).should.eql( {
			id: undefined,
			name: 'David'
		} );

		personMoldy.$update( function ( _error, _res ) {
			// the actual action should be a 'create' which sets all values for the
			// first time (including `job`)
			dummy.actions.length.should.eql( 1 );
			dummy.actions[ 0 ].action.should.eql( 'create' );
			dummy.actions[ 0 ].arguments[ 0 ].should.eql( {
				id: undefined,
				name: 'David',
				job: 'unemployed'
			} );
			_done();
		} );
	} );

	it( 'should work within independent moldys updating at the same time.', function ( _done ) {
		var schema = {
			properties: {
				name: '',
				didStuff: '',
				alsoDidStuff: ''
			}
		};

		var sampleData;

		// This runs synchronous with the dummy adapter.

		async.waterfall( [
			function ( _done ) {
				sampleData = Moldy.extend( 'person', schema ).create( {
					name: 'Jill Lizards'
				} );
				sampleData.$save( function () {
					_done();
				} );
			},
			function ( _done ) {
				var personMoldy = Moldy.extend( 'person', schema );
				personMoldy.$findOne( {
					id: sampleData.id
				}, function ( _err, _found ) {
					_found.$json( {
						diff: true
					} ).should.eql( {
						id: sampleData.id
					} );
					_found.didStuff = true;
					_found.$json( {
						diff: true
					} ).should.eql( {
						id: sampleData.id,
						didStuff: true
					} );
					_done( null, _found );
				} );
			},
			function ( _person1, _done ) {
				var personMoldy = Moldy.extend( 'person', schema );
				personMoldy.$findOne( {
					id: sampleData.id
				}, function ( _err, _found ) {
					_found.$json( {
						diff: true
					} ).should.eql( {
						id: sampleData.id
					} );
					_found.alsoDidStuff = true;
					_found.$json( {
						diff: true
					} ).should.eql( {
						id: sampleData.id,
						alsoDidStuff: true
					} );
					_done( null, _person1, _found );
				} );
			},
			function ( _personRef1, _personRef2, _callback ) {
				_personRef1.$update( function ( _error, _personRef1Updated ) {
					( _personRef1 === _personRef1Updated ).should.eql( true );
					_personRef1.$json( {
						diff: true
					} ).should.eql( {
						id: sampleData.id
					} );
					return _callback( _error, _personRef1, _personRef2 );
				} );
			},
			function ( _personRef1, _personRef2, _callback ) {
				_personRef2.$update( function ( _error, _personRef2Updated ) {
					( _personRef2 === _personRef2Updated ).should.eql( true );
					_personRef2.$json().should.eql( {
						id: sampleData.id,
						didStuff: true,
						alsoDidStuff: true,
						name: sampleData.name
					} );
					_personRef2.$json( {
						diff: true
					} ).should.eql( {
						id: sampleData.id
					} );

					return _done( _error );
				} );
			},
		], function ( _err ) {
			_done();
		} );

	} );

} );
