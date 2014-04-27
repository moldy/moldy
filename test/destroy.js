var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'destroy', function () {

	//before( require( './setup' )( Moldy ) );

	it( 'should destroy', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		Person.$findOne( function ( _error, _res ) {
			var res = _res;
			res.__destroyed.should.be.false;
			res.$destroy( function ( _error ) {
				res.__destroyed.should.be.true;
				_done( _error );
			} );
		} );

	} );

	it( 'should fail destroying a dirty moldy', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		var personMoldy = Person.create();

		personMoldy.$destroy( function ( _error, _res ) {
			_error.should.be.an.Error;
			should.not.exist( _res );
			_done();
		} );

	} );

	it( 'should remove the `key` after being destroying', function ( _done ) {
		var Person = Moldy.extend( 'person', {
			key: 'guid',
			properties: {
				name: 'string',
				age: 'number'
			}
		} );

		Person.$findOne( function ( err, _res ) {
			var res = _res;
			res.$destroy( function () {
				should( res.guid ).be.empty;
				_done();
			} );
		} );

	} );

	describe( 'ensuring all methods handle gracefully after being destroyed', function () {

		var schema = {
			key: 'guid',
			properties: {
				name: 'string',
				age: 'number'
			}
		};

		it( '$baseUrl still works after destroyed', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );
			var personMoldy = Person.create();

			Person.$findOne( function () {
				personMoldy.$destroy( function () {
					Person.$baseUrl().should.equal( Moldy.defaults.baseUrl );
					_done();
				} );
			} );

		} );

		it( '$clone still works however the `key` should', function ( _done ) {
			var Person = Moldy.extend( 'person', schema ),
				originalPersonJson;

			Person.$findOne( function ( error, _res ) {
				var personMoldy = _res;
				originalPersonJson = personMoldy.$json();
				personMoldy.$destroy( function () {
					var newPerson = personMoldy.$clone(),
						newPersonJson = newPerson.$json();

					delete originalPersonJson.guid;
					delete newPersonJson.guid;

					originalPersonJson.should.eql( newPersonJson );

					_done();
				} );
			} );

		} );

		it( '$collection still works', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				personMoldy.$destroy( function () {
					Person.$find( function ( _error, _res ) {
						_res.should.be.an.Array;
						_done( _error );
					} );
				} );
			} );

		} );

		it( '$destroy should fail', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				personMoldy.$destroy( function () {
					personMoldy.$destroy( function ( _error ) {
						_error.should.be.an.Error;
						_done();
					} );
				} );
			} );

		} );

		it( '$data should return an Error', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;
				personMoldy.$destroy( function ( _error ) {
					var data = personMoldy.$data( {
						a: 'a'
					} );

					data.should.be.an.Error;
					_done( _error );
				} );
			} );

		} );

		it( 'findOne should remove the __destroyed flag and populate the object with the new data', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				personMoldy.$destroy( function ( _error ) {
					Person.$findOne( {
						guid: '2bc0282f-d441-430f-8aa5-64f268cec762'
					}, function ( _error, _res ) {
						_res.name.should.equal( 'Ericka Murray' );
						_done( _error );
					} );
				} );
			} );

		} );

		it( '$headers still works', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				personMoldy.$destroy( function ( _error ) {
					Person.$headers().should.be.an.Object;
					_done( _error );
				} );
			} );
		} );

		it( '$isDirty returns true', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;
				personMoldy.$destroy( function ( _error ) {
					personMoldy.$isDirty().should.be.true;
					_done( _error );
				} );
			} );
		} );

		it( '$isValid returns false', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				personMoldy.$destroy( function ( _error ) {
					personMoldy.$isValid().should.be.false;
					_done( _error );
				} );
			} );
		} );

		it( '$json returns the data however the `key` should be `undefined`', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				var json = personMoldy.$json();
				personMoldy.$destroy( function ( _error ) {
					personMoldy.$json().should.be.eql( {
						guid: undefined,
						name: 'Goodman Delgado',
						age: 30
					} );
					_done( _error );
				} );
			} );
		} );

		it( '$property still works', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;
				personMoldy.should.not.have.a.property( 'gender' );

				personMoldy.$destroy( function () {
					Person.$property( 'gender', 'string' );

					Person.$findOne( function ( _error, r ) {
						var p = r;
						p.should.have.a.property( 'gender' );
						p.gender.should.equal( 'male' );
						_done( _error );
					} );
				} );
			} );
		} );

		it( '$save still works - should create a new record and therefore have a new `key`', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				var oldGuid = personMoldy.guid;
				personMoldy.$destroy( function ( _error ) {
					personMoldy.name = 'David';
					personMoldy.$save( function ( _error ) {
						personMoldy.name.should.equal( 'David' );
						personMoldy.guid.should.exist;
						_done( _error );
					} );
				} );
			} );
		} );

		it( '$url still works', function ( _done ) {
			var Person = Moldy.extend( 'person', schema );

			Person.$findOne( function ( err, res ) {
				var personMoldy = res;

				personMoldy.$destroy( function ( _error ) {
					Person.$url().should.equal( Moldy.defaults.baseUrl + '/' + Person.__name );
					_done( _error );
				} );
			} );
		} );
	} );

} );