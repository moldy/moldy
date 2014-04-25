var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'properties with sub models', function () {

  it( 'sub model', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        'name': 'string',
        'car': {
          keyless: true,
          properties: {
            make: 'string',
            model: {
              type: 'string',
              default: ''
            },
            year: 'number'
          }
        }
      }
    } ).create();

    personMoldy.car.should.be.a.Moldy;
    personMoldy.car.make = 'honda';
    personMoldy.car.year = '2010';

    personMoldy.car.year.should.equal( 2010 );

  } );

  it( 'sub sub model', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        'name': 'string',
        'car': {
          keyless: true,
          properties: {
            make: 'string',
            model: {
              type: 'string',
              default: ''
            },
            year: 'number',
            accessories: {
              keyless: true,
              properties: {
                hasWheels: {
                  type: 'boolean',
                  default: true
                },
                isPainted: {
                  type: 'boolean',
                  default: false
                },
                engine: {
                  keyless: true,
                  properties: {
                    size: 'string',
                    cylinders: 'number'
                  }
                }
              }
            }
          }
        }
      }
    } ).create();


    personMoldy.$data( {
      name: 'david',
      car: {
        make: 'honda',
        year: '2010',
        accessories: {
          engine: {
            size: '2l',
            cylinders: '4'
          }
        }
      }
    } );

    personMoldy.car.should.be.a.Moldy;
    personMoldy.car.make = 'honda';
    personMoldy.car.model = '';
    personMoldy.car.year = '2010';

    personMoldy.car.accessories.should.be.a.Moldy;
    personMoldy.car.accessories.hasWheels.should.be.true;
    personMoldy.car.accessories.isPainted.should.be.false;

    personMoldy.car.accessories.engine.should.be.a.Moldy;
    personMoldy.car.accessories.engine.size.should.equal( '2l' );
    personMoldy.car.accessories.engine.cylinders.should.equal( 4 );

    personMoldy.$json().should.eql( {
      id: undefined,
      name: 'david',
      car: {
        make: 'honda',
        model: '',
        year: 2010,
        accessories: {
          hasWheels: true,
          isPainted: false,
          engine: {
            size: '2l',
            cylinders: 4
          }
        }
      }
    } );

  } );

} );