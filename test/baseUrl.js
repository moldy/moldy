var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'baseUrl', function () {

  it( 'should set the baseUrl', function () {
    var personMoldy = Moldy.create( 'person', {
      baseUrl: '/api'
    } );

    personMoldy.$baseUrl().should.eql( '/api' );
    personMoldy.$baseUrl( '/api/v2' );
    personMoldy.$baseUrl().should.eql( '/api/v2' );

  } );

} );