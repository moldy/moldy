var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'keyless', function () {

  it( 'keyless model', function () {
    var personMoldy = Moldy.create( 'person', {
      keyless: true,
      properties: {
        name: 'string'
      }
    } );

    personMoldy.name = 6;

    Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 1 );
    personMoldy.name.should.equal( '6' );
    personMoldy.should.not.have.a.property( 'id' );

  } );

  it( 'keyless model is always $isDirty', function () {
    var personMoldy = Moldy.create( 'person', {
      keyless: true,
      properties: {
        name: 'string'
      }
    } );

    personMoldy.$isDirty().should.be.true;
    personMoldy.name = 'David';
    personMoldy.$isDirty().should.be.true;

  } );

  it( 'keyless model $isValid', function () {
    var personMoldy = Moldy.create( 'person', {
      keyless: true,
      properties: {
        name: 'string'
      }
    } );

    personMoldy.$isValid().should.be.false;
    personMoldy.name = 'David';
    personMoldy.$isValid().should.be.true;
  } );

} );