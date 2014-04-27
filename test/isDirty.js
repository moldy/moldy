var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'isDirty', function () {

  it( 'should be dirty if the `key` is empty', function () {
    var personMoldy = Moldy.extend( 'person' ).$property( 'name' ).create();

    personMoldy.$isDirty().should.be.ok;

  } );

  it( 'should _not_ be dirty if the `key` is not empty', function () {
    var personMoldy = Moldy.extend( 'person' ).$property( 'name' ).create();

    personMoldy.id = 1;

    personMoldy.$isDirty().should.be.not.ok;

  } );

} );