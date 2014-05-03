var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'find', function () {

  it( 'To find by `id` or `key`, give an object with appropriate conditions', function ( _done ) {
    var personMoldy = Moldy.extend( 'person', {
      key: 'guid',
      properties: {
        name: ''
      }
    } );

    personMoldy.$findOne( {
      guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
    }, function ( _error, _res ) {

      if ( _error ) {
        return _done( _error );
      }

      _done();

    } );

  } );

  it( 'If an adapter responds with an array the first item will be returned', function ( _done ) {
    var Person = Moldy.extend( 'person', {
      key: 'guid',
      properties: {
        name: ''
      }
    } );

    /**
     * In this example the end point GET `http://localhost:3000/api` returns an array of items.
     * Moldy will return the first item out of the array. If you need to return an array you can
     * use the $collection method.
     */
    Person.$findOne( function ( _error, _res ) {

      if ( _error ) {
        return _done( _error );
      }

      _res.should.not.be.an.Array;

      _done();

    } );

  } );

} );