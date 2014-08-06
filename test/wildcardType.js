var _ = require( 'underscore' ),
	is = require( 'sc-is' ),
	Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'date', function () {

	var crazyValues = {
		values: [
			[ 1, 2 ],
			[], {}, {
				a: 'a',
				b: 'b'
			},
			true, false, new Date( 1997, 7, 29 ), 0, 1, -1, 0.1, -1.1, 11000000, '', 'chicken', null, undefined
		],
		expected: [
			[ 1, 2 ],
			[], {}, {
				a: 'a',
				b: 'b'
			},
			true, false, new Date( 1997, 7, 29 ), 0, 1, -1, 0.1, -1.1, 11000000, '', 'chicken', null, undefined
		]
	};

	var personMoldy = Moldy.extend( 'person', {
		keyless: true,
		properties: {
			crazyWithADefault: {
				type: '*',
				default: ''
			},
			crazyWithoutADefault: {
				type: '*'
			}
		}
	} ).create();

	_.each( [ 'crazyWithADefault', 'crazyWithoutADefault' ], function ( _property ) {
		_.each( crazyValues.values, function ( _value, _i ) {
			it( 'should be able to set a type to `*`', function () {
				personMoldy[ _property ] = _value;
				should( personMoldy[ _property ] ).eql( crazyValues.expected[ _i ] );
			} );
		} );
	} );

} );