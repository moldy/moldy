var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'url', function () {

  it( 'should be empty', function () {
    var personMoldy = Moldy.extend();
    personMoldy.$url().should.eql( Moldy.defaults.baseUrl );
  } );

  it( 'should be the name', function () {
    var personMoldy = Moldy.extend( 'person' );
    personMoldy.$url().should.eql( personMoldy.$baseUrl() + '/person' );
  } );

  it( 'should be the base and the name', function () {
    var personMoldy = Moldy.extend( 'person' ).$baseUrl( '/api/' );
    personMoldy.$url().should.eql( '/api/person' );

    personMoldy.$baseUrl( 'http://domain.com/api' );
    personMoldy.$url().should.eql( 'http://domain.com/api/person' );
  } );

} );