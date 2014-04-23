var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'data', function () {

  it( 'should set the data', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        name: {
          type: 'string',
          default: 'David'
        },
        age: {
          type: 'number',
          default: 30
        }
      }
    } ).create();

    personMoldy.should.have.a.property( 'age' ).and.be.a.Number.and.eql( 30 );
    personMoldy.should.have.a.property( 'name' ).and.be.a.String.and.eql( 'David' );

    personMoldy.$data( {
      name: 'Max',
      age: '1',
      invalidKey: true
    } );

    Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 3 );
    personMoldy.should.have.a.property( 'age' ).and.be.a.Number.and.eql( 1 );
    personMoldy.should.have.a.property( 'name' ).and.be.a.String.and.eql( 'Max' );
    personMoldy.should.not.have.a.property( 'invalidKey' );

  } );


} );