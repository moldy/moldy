var Moldy = require( '../src' ),
  guid = require( 'sc-guid' ),
  should = require( 'should' );

describe( 'moldy', function () {

  it( 'Create a Moldy', function () {
    var personMoldy = Moldy.extend( 'person' ).create()
      .$property( 'id' )
      .$property( 'name' )
      .$property( 'age' );

    personMoldy.should.have.a.property( 'id', null );
    personMoldy.should.have.a.property( 'name', null );
    personMoldy.should.have.a.property( 'age', null );

  } );

  require( './readme.property' );
  require( './readme.url.base' );
  require( './readme.get' );
  require( './readme.collection' );
  require( './readme.save' );
  require( './readme.destroy' );

} );