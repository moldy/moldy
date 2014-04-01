var Model = require( '../src' ),
	should = require( 'should' );

describe( 'array of a type', function () {

	it( 'an array of booleans', function () {
		var personModel = new Model( 'person', {
			properties: {
				tags: {
					type: [ 'boolean' ],
					default: false
				}
			}
		} );

		personModel.tags.push( true, false );
		personModel.tags.unshift( 'y', 'n' );
		personModel.tags.unshift( 'true' );
		personModel.tags.push( undefined );

		personModel.tags.should.eql( [ true, true, false, true, false, false ] );
		personModel.tags.shift();
		personModel.tags.should.eql( [ true, false, true, false, false ] );
	} );

	it( 'an array of numbers', function () {
		var personModel = new Model( 'person', {
			properties: {
				tags: {
					type: [ 'number' ],
					default: 100
				}
			}
		} );

		personModel.tags.push( 4, 5 );
		personModel.tags.unshift( '2', '3' );
		personModel.tags.unshift( '1' );
		personModel.tags.push( undefined );

		personModel.tags.should.eql( [ 1, 2, 3, 4, 5, 100 ] );
		personModel.tags.shift();
		personModel.tags.should.eql( [ 2, 3, 4, 5, 100 ] );
	} );

	it( 'an array of objects', function () {
		var personModel = new Model( 'person', {
			properties: {
				tags: {
					type: [ 'object' ],
					default: {}
				}
			}
		} );

		personModel.tags.push( '{}', '{"c":"c"}' );
		personModel.tags.unshift( {
			a: 'a'
		}, {
			b: 'b'
		} );
		personModel.tags.unshift( {} );
		personModel.tags.push( undefined );

		personModel.tags.should.eql( [ {}, {
			a: 'a'
		}, {
			b: 'b'
		}, {}, {
			c: 'c'
		}, {} ] );
		personModel.tags.shift();
		personModel.tags.should.eql( [ {
			a: 'a'
		}, {
			b: 'b'
		}, {}, {
			c: 'c'
		}, {} ] );
	} );

	it( 'an array of strings', function () {
		var personModel = new Model( 'person', {
			properties: {
				tags: {
					type: [ 'string' ],
					default: 'empty'
				}
			}
		} );

		personModel.tags.push( 4, 5 );
		personModel.tags.unshift( 2, 3 );
		personModel.tags.unshift( 1 );
		personModel.tags.push( undefined );

		personModel.tags.should.eql( [ '1', '2', '3', '4', '5', 'empty' ] );
		personModel.tags.shift();
		personModel.tags.should.eql( [ '2', '3', '4', '5', 'empty' ] );
	} );

	it( 'an array of models', function () {
		var personModel = new Model( 'person', {
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

		personModel.tags.push( {
			name: 'david',
			age: '30'
		} );

		personModel.tags.should.be.an.Array;
		personModel.tags[ 0 ].should.be.a.Model;
		personModel.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: 'david',
			age: 30
		} );

		personModel.tags.push( null );

		personModel.tags[ 1 ].should.be.an.Object;
		personModel.tags[ 1 ].$json().should.eql( {
			id: undefined,
			name: 'Nameless',
			age: 0
		} );

		personModel.tags.shift();
		personModel.tags.should.have.a.lengthOf( 1 );
		personModel.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: 'Nameless',
			age: 0
		} );

	} );

	it( 'an array of models defined directly as the value', function () {
		var personModel = new Model( 'person', {
			properties: {
				tags: [ {
					properties: {
						name: 'string',
						age: 'number'
					}
				} ]
			}
		} );

		personModel.tags.push( {
			name: 'david',
			age: '30'
		} );

		personModel.tags.should.be.an.Array;
		personModel.tags[ 0 ].should.be.a.Model;
		personModel.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: 'david',
			age: 30
		} );

		personModel.tags.push( null );

		personModel.tags[ 1 ].should.be.an.Object;
		personModel.tags[ 1 ].$json().should.eql( {
			id: undefined,
			name: null,
			age: null
		} );

		personModel.tags.shift();
		personModel.tags.should.have.a.lengthOf( 1 );
		personModel.tags[ 0 ].$json().should.eql( {
			id: undefined,
			name: null,
			age: null
		} );

	} );

	it( 'should handle an array of a type when given JSON to $data', function () {
		var personModel = new Model( 'person', {
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

		personModel.$data( {
			name: 100,
			guests: [ {
				name: 'David',
				age: '30'
			}, {
				name: 'Glen',
				age: '20'
			} ]
		} );

		personModel.guests[ 0 ].should.be.a.Model;
		personModel.guests[ 1 ].should.be.a.Model;

		personModel.guests.push( {
			age: '10'
		} );

		personModel.$json().should.eql( {
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

} );