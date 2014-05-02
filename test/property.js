var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'property', function () {

  it( 'set properties using $property', function () {
    var personMoldy = Moldy.extend( 'person' )
      .$property( 'name', {
        type: 'string',
        default: 'David'
      } )
      .$property( 'age', {
        type: 'number',
        default: 30
      } )
      .$property( 'active', 'boolean' )
      .create();

    Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 4 );
    personMoldy.should.have.a.property( 'age' ).and.be.a.Number;
    personMoldy.should.have.a.property( 'name' ).and.be.a.String;

    personMoldy.active = 'y';
    personMoldy.should.have.a.property( 'active' ).and.be.a.Boolean.and.eql( true );
  } );

  it( 'set properties using the arguments when instantiating', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        'name': {
          type: 'string',
          default: 'David'
        },
        'age': {
          type: 'number',
          default: 30
        },
        'active': 'boolean'
      }
    } ).create();


    Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 4 );
    personMoldy.should.have.a.property( 'name' ).and.be.a.String;
    personMoldy.should.have.a.property( 'age' ).and.be.a.Number;

    personMoldy.active = 'y';
    personMoldy.should.have.a.property( 'active' ).and.be.a.Boolean.and.eql( true );
  } );

  it( 'set a property on a manually added key', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        'name': {
          type: 'string',
          default: 'David'
        },
        'age': {
          type: 'number',
          default: 30
        }
      }
    } ).create();

    personMoldy.active = 'true';

    Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 3 );
    personMoldy.should.have.a.property( 'name' ).and.be.a.String;
    personMoldy.should.have.a.property( 'age' ).and.be.a.Number;

  } );

  it( 'should not set a key if keyless', function () {
    var personMoldy = Moldy.extend( 'person', {
      keyless: true,
      properties: {
        name: ''
      }
    } ).create();

    personMoldy.should.not.have.a.property( 'id' );

  } );

  describe( 'child models', function () {

    it( 'should be able to define a moldy for a property i.e. child moldy', function () {
      var addressMoldy = Moldy.extend( 'address', {
        keyless: true,
        properties: {
          'street': {
            type: 'string',
            default: 'hemlock'
          },
          'number': 'number',
          'suburb': 'string',
          'country': {
            optional: true
          }
        }
      } ).create();

      var personMoldy = Moldy.extend( 'person', {
        properties: {
          'name': {
            type: 'string',
            default: 'David'
          },
          'age': {
            type: 'number',
            default: 30
          },
          'address': {
            type: 'moldy',
            default: addressMoldy
          }
        }
      } ).create();

      personMoldy.address.number = '17';

      Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 4 );
      personMoldy.should.have.a.property( 'name' ).and.be.a.String;
      personMoldy.should.have.a.property( 'age' ).and.be.a.Number;
      personMoldy.address.street.should.eql( 'hemlock' );

      // ensuring a `moldy` type cannot be overriden
      personMoldy.address = 'wat';

      var personMoldyJson = personMoldy.$json();

      personMoldyJson.should.eql( {
        id: undefined,
        name: 'David',
        age: 30,
        address: {
          street: 'hemlock',
          number: 17,
          suburb: null
        }
      } );

    } );

    it( 'define a child moldy directly', function () {
      var addressMoldy = Moldy.extend( 'address', {
        keyless: true,
        properties: {
          'street': {
            type: 'string',
            default: 'hemlock'
          },
          'suburb': 'string',
          'country': {
            optional: true
          }
        }
      } ).create();

      var personMoldy = Moldy.extend( 'person', {
        properties: {
          'name': {
            type: 'string',
            default: 'David'
          },
          'age': {
            type: 'number',
            default: 30
          },
          'address': addressMoldy
        }
      } ).create();

      Object.keys( personMoldy.$json() ).should.have.a.lengthOf( 4 );
      personMoldy.should.have.a.property( 'name' ).and.be.a.String;
      personMoldy.should.have.a.property( 'age' ).and.be.a.Number;
      personMoldy.address.street.should.eql( 'hemlock' );

      // ensuring a `moldy` type cannot be overriden
      personMoldy.address = 'wat';

      var personMoldyJson = personMoldy.$json();

      personMoldyJson.should.eql( {
        id: undefined,
        name: 'David',
        age: 30,
        address: {
          street: 'hemlock',
          suburb: null
        }
      } );

    } );

  } );

} );