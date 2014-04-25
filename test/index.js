var Moldy = require( '../src' ),
  should = require( 'should' );

require( './setup' )( Moldy )();

describe( 'save', function () {

  //before( require( './setup' )( Moldy ) );

  it( 'instantiate using', function ( _done ) {
    var Person = Moldy.extend( 'person' );
    var personMoldy  = Person.create( );


    personMoldy.$save( function ( _error, _res ) {
      _done( _error );
    } );

  } );

} );