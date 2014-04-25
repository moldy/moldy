var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'save', function () {

  //before( require( './setup' )( Moldy ) );

  it( 'should handle an empty body', function ( _done ) {
    var personMoldy = Moldy.extend( 'person', {
      baseUrl: 'http://localhost:3000/empty-body'
    } ).create();

    personMoldy.$save( function ( _error, _res ) {
      _done( _error );
    } );

  } );

  it( 'should handle a 4xx response', function ( _done ) {
    var personMoldy = Moldy.extend( 'person', {
      baseUrl: 'http://localhost:3000/400'
    } ).create();

    personMoldy.$save( function ( _error, _res ) {
      _error.should.be.an.instanceOf( Error );
      _done();
    } );

  } );

  it( 'should handle a 4xx response', function ( _done ) {
    var personMoldy = Moldy.extend( 'person', {
      baseUrl: 'http://localhost:3000/404'
    } ).create();

    personMoldy.$save( function ( _error, _res ) {
      _error.should.be.an.instanceOf( Error );
      _done();
    } );

  } );

  it( 'should handle a 5xx response', function ( _done ) {
    var personMoldy = Moldy.extend( 'person', {
      baseUrl: 'http://localhost:3000/500'
    } ).create();

    personMoldy.$save( function ( _error, _res ) {
      _error.should.be.an.instanceOf( Error );
      _done();
    } );

  } );

} );