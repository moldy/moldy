var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'collection', function () {

  //before( require( './setup' )( Moldy ) );

  it( 'To get a collection', function ( _done ) {
    var personMoldy = Moldy.extend( 'person', {
      key: 'guid',
      properties: {
        name: 'string'
      }
    } ).create();

    personMoldy.$collection( function ( _error, _people ) {

      if ( _error ) {
        return _done( _error );
      }

      _people.should.be.an.Array.with.a.lengthOf( 3 );

      _people.forEach( function ( _person ) {
        _person.should.be.a.Moldy;
      } );

      _done();

    } );

  } );

} );