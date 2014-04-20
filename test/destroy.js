var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'destroy', function () {

  it( 'should destroy', function ( _done ) {
    var personMoldy = Moldy.create( 'person', {
      key: 'guid',
      properties: {
        name: 'string',
        age: 'number'
      }
    } );

    personMoldy.$get( function ( _error ) {
      personMoldy.__destroyed.should.be.false;
      personMoldy.$destroy( function ( _error ) {
        personMoldy.__destroyed.should.be.true;
        _done( _error );
      } );
    } );

  } );

  it( 'should fail destroying a dirty moldy', function ( _done ) {
    var personMoldy = Moldy.create( 'person', {
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

  it( 'should remove the `key` after being destroying', function ( _done ) {
    var personMoldy = Moldy.create( 'person', {
      key: 'guid',
      properties: {
        name: 'string',
        age: 'number'
      }
    } );

    personMoldy.$get( function () {
      personMoldy.$destroy( function () {
        should( personMoldy.guid ).be.empty;
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
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function () {
          personMoldy.$baseUrl().should.equal( Moldy.defaults.baseUrl );
          _done();
        } );
      } );

    } );

    it( '$clone still works however the `key` should', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema ),
        originalPersonJson;

      personMoldy.$get( function () {
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
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function () {
          personMoldy.$collection( function ( _error, _res ) {
            _res.should.be.an.Array;
            _done( _error );
          } );
        } );
      } );

    } );

    it( '$destroy should fail', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function () {
          personMoldy.$destroy( function ( _error ) {
            _error.should.be.an.Error;
            _done();
          } );
        } );
      } );

    } );

    it( '$data should return an Error', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function ( _error ) {
          var data = personMoldy.$data( {
            a: 'a'
          } );

          data.should.be.an.Error;
          _done( _error );
        } );
      } );

    } );

    it( '$get should remove the __destroyed flag and populate the object with the new data', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function ( _error ) {
          personMoldy.$get( {
            guid: '2bc0282f-d441-430f-8aa5-64f268cec762'
          }, function ( _error, _res ) {
            personMoldy.name.should.equal( 'Ericka Murray' );
            _done( _error );
          } );
        } );
      } );

    } );

    it( '$headers still works', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function ( _error ) {
          personMoldy.$headers().should.be.an.Object;
          _done( _error );
        } );
      } );
    } );

    it( '$isDirty returns true', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function ( _error ) {
          personMoldy.$isDirty().should.be.true;
          _done( _error );
        } );
      } );
    } );

    it( '$isValid returns false', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function ( _error ) {
          personMoldy.$isValid().should.be.false;
          _done( _error );
        } );
      } );
    } );

    it( '$json returns the data however the `key` should be `undefined`', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
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
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.should.not.have.a.property( 'gender' );
        personMoldy.$destroy( function ( _error ) {
          personMoldy.$property( 'gender', 'string' );
          personMoldy.should.have.a.property( 'gender' );
          personMoldy.$get( function ( _error ) {
            personMoldy.gender.should.equal( 'male' );
            _done( _error );
          } );
        } );
      } );
    } );

    it( '$save still works - should create a new record and therefore have a new `key`', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        var oldGuid = personMoldy.guid;
        personMoldy.$destroy( function ( _error ) {
          personMoldy.name = 'David';
          personMoldy.$save( function ( _error ) {
            personMoldy.name.should.equal( 'David' );
            personMoldy.guid.should.not.equal( oldGuid );
            _done( _error );
          } );
        } );
      } );
    } );

    it( '$url still works', function ( _done ) {
      var personMoldy = Moldy.create( 'person', schema );

      personMoldy.$get( function () {
        personMoldy.$destroy( function ( _error ) {
          personMoldy.$url().should.equal( Moldy.defaults.baseUrl + '/' + personMoldy.__name );
          _done( _error );
        } );
      } );
    } );

  } );

} );