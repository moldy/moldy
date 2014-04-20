var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'array of a type', function () {

	it( 'an array of booleans', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				tags: {
					type: [ 'boolean' ],
					default: false
				}
			}
		} );

		personMoldy.tags.push( true, false );
		personMoldy.tags.unshift( 'y', 'n' );
		personMoldy.tags.unshift( 'true' );
		personMoldy.tags.push( undefined );

		personMoldy.tags.should.eql( [ true, true, false, true, false, false ] );
		personMoldy.tags.shift();
		personMoldy.tags.should.eql( [ true, false, true, false, false ] );
	} );

	it( 'an array of numbers', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				tags: {
					type: [ 'number' ],
					default: 100
				}
			}
		} );

		personMoldy.tags.push( 4, 5 );
		personMoldy.tags.unshift( '2', '3' );
		personMoldy.tags.unshift( '1' );
		personMoldy.tags.push( undefined );

		personMoldy.tags.should.eql( [ 1, 2, 3, 4, 5, 100 ] );
		personMoldy.tags.shift();
		personMoldy.tags.should.eql( [ 2, 3, 4, 5, 100 ] );
	} );

	it( 'an array of objects', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				tags: {
					type: [ 'object' ],
					default: {}
				}
			}
		} );

		personMoldy.tags.push( '{}', '{"c":"c"}' );
		personMoldy.tags.unshift( {
			a: 'a'
		}, {
			b: 'b'
		} );
		personMoldy.tags.unshift( {} );
		personMoldy.tags.push( undefined );

		personMoldy.tags.should.eql( [ {}, {
			a: 'a'
		}, {
			b: 'b'
		}, {}, {
			c: 'c'
		}, {} ] );
		personMoldy.tags.shift();
		personMoldy.tags.should.eql( [ {
			a: 'a'
		}, {
			b: 'b'
		}, {}, {
			c: 'c'
		}, {} ] );
	} );

	it( 'an array of strings', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				tags: {
					type: [ 'string' ],
					default: 'empty'
				}
			}
		} );

		personMoldy.tags.push( 4, 5 );
		personMoldy.tags.unshift( 2, 3 );
		personMoldy.tags.unshift( 1 );
		personMoldy.tags.push( undefined );

		personMoldy.tags.should.eql( [ '1', '2', '3', '4', '5', 'empty' ] );
		personMoldy.tags.shift();
		personMoldy.tags.should.eql( [ '2', '3', '4', '5', 'empty' ] );
	} );

	it( 'an array of models', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				tags: {
					type: [ {
						name: 'person',
						properties: {
							name: 'string',
							age: 'number'
						}
					} ],
					default: {
						name: 'Nameless',
						age: 0
					}
				}
			}
		} );

		personMoldy.tags.push( {
			name: 'david',
			age: '30'
		} );

		personMoldy.tags.should.be.an.Array;
		personMoldy.tags[ 0 ].should.be.a.Moldy;
		personMoldy.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: 'david',
			age: 30
		} );

		personMoldy.tags.push( null );

		personMoldy.tags[ 1 ].should.be.an.Object;
		personMoldy.tags[ 1 ].$json().should.eql( {
			id: undefined,
			name: 'Nameless',
			age: 0
		} );

		personMoldy.tags.shift();
		personMoldy.tags.should.have.a.lengthOf( 1 );
		personMoldy.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: 'Nameless',
			age: 0
		} );

	} );

	it( 'an array of models defined directly as the value', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				tags: [ {
					properties: {
						name: 'string',
						age: 'number'
					}
				} ]
			}
		} );

		personMoldy.tags.push( {
			name: 'david',
			age: '30'
		} );

		personMoldy.tags.should.be.an.Array;
		personMoldy.tags[ 0 ].should.be.a.Moldy;
		personMoldy.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: 'david',
			age: 30
		} );

		personMoldy.tags.push( null );

		personMoldy.tags[ 1 ].should.be.an.Object;
		personMoldy.tags[ 1 ].$json().should.eql( {
			id: undefined,
			name: null,
			age: null
		} );

		personMoldy.tags.shift();
		personMoldy.tags.should.have.a.lengthOf( 1 );
		personMoldy.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: null,
			age: null
		} );

	} );

	it( 'should handle an array of a type when given JSON to $data', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				name: 'string',
				guests: [ {
					keyless: true,
					properties: {
						name: 'string',
						age: 'number'
					}
				} ]
			}
		} );

		personMoldy.$data( {
			name: 100,
			guests: [ {
				name: 'David',
				age: '30'
			}, {
				name: 'Glen',
				age: '20'
			} ]
		} );

		personMoldy.guests[ 0 ].should.be.a.Moldy;
		personMoldy.guests[ 1 ].should.be.a.Moldy;

		personMoldy.guests.push( {
			age: '10'
		} );

		personMoldy.$json().should.eql( {
			id: undefined,
			name: '100',
			guests: [ {
				name: 'David',
				age: 30
			}, {
				name: 'Glen',
				age: 20
			}, {
				name: null,
				age: 10
			} ]
		} );

	} );

	it( 'should handle an array of a model with an optional object', function () {
		var personMoldy = Moldy.create( 'person', {
			properties: {
				name: 'string',
				guests: [ {
					keyless: true,
					properties: {
						name: 'string',
						age: 'number',
						address: {
							type: 'object',
							optional: true
						}
					}
				} ]
			}
		} );

		personMoldy.guests.push( {
			name: 'david'
		} );

		personMoldy.$json().should.eql( {
			id: undefined,
			name: null,
			guests: [ {
				name: 'david',
				age: null
			} ]
		} );

		personMoldy.$json().should.eql( {
			id: undefined,
			name: null,
			guests: [ {
				name: 'david',
				age: null
			} ]
		} );

		personMoldy.guests.push( {
			name: 'max',
			address: {
				suburb: 'warner',
				country: 'australia'
			}
		} );

		personMoldy.$json().should.eql( {
			id: undefined,
			name: null,
			guests: [ {
				name: 'david',
				age: null
			}, {
				name: 'max',
				age: null,
				address: {
					suburb: 'warner',
					country: 'australia'
				}
			} ]
		} );

	} );

} );
