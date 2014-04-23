var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'headers', function () {

  it( 'should be able to add headers', function () {
    var personMoldy = Moldy.extend( 'person', {
      headers: {
        'X-API-KEY': 'ec5c6970-a8e3-4294-ef78-48043e88d05b'
      },
      properties: {
        name: ''
      }
    } ).create();

    personMoldy.$headers().should.eql( {
      'X-API-KEY': 'ec5c6970-a8e3-4294-ef78-48043e88d05b'
    } );

  } );

  it( 'should be able to set the headers at a global level', function () {

    Moldy.defaults.headers = {
      'identity': '8d1a4f19-9796-49de-9f54-03da30a92242'
    };

    var personMoldy = Moldy.extend( 'person', {
      headers: {
        'chicken': 'tasty'
      }
    } ).create( );

    personMoldy.$headers().should.eql( {
      'chicken': 'tasty',
      'identity': '8d1a4f19-9796-49de-9f54-03da30a92242'
    } );

    Moldy.defaults.headers = {};

  } );
} );