var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'clear', function () {

  it( 'should clear all the values the data', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        name: 'string',
        age: 'number',
        tags: [ 'string' ],
        car: {
          type: 'object',
          default: {

          }
        },
        address: {
          keyless: true,
          properties: {
            country: 'string',
            state: 'string',
            details: {
              keyless: true,
              properties: {
                type: {
                  type: 'string',
                  default: 'house'
                },
                residential: 'boolean'
              }
            }
          }
        },
        friends: [ {
          keyless: true,
          properties: {
            name: 'string',
            age: {
              type: 'number',
              default: 0
            }
          }
        } ],

      }
    } ).create();

    personMoldy.id = 1;
    personMoldy.name = 'david';
    personMoldy.age = '33';
    personMoldy.tags.push( 'family' );
    personMoldy.tags.push( 'guy' );
    personMoldy.car = {
      gotWheels: true,
      type: 'hatch'
    };
    personMoldy.address.country = 'australia';
    personMoldy.address.state = 'qld';
    personMoldy.address.details.residential = true;
    personMoldy.friends.push( {
      name: 'max',
      age: '1'
    } );
    personMoldy.friends.push( {
      name: 'leonie'
    } );

    personMoldy.$json().should.eql( {
      id: 1,
      name: 'david',
      age: 33,
      tags: [ 'family', 'guy' ],
      car: {
        gotWheels: true,
        type: 'hatch'
      },
      address: {
        country: 'australia',
        state: 'qld',
        details: {
          type: 'house',
          residential: true
        }
      },
      friends: [ {
        name: 'max',
        age: 1
      }, {
        name: 'leonie',
        age: 0
      } ]
    } );

    personMoldy.$clear();

    personMoldy.$json().should.eql( {
      id: undefined,
      name: null,
      age: null,
      tags: [],
      car: {},
      address: {
        country: null,
        state: null,
        details: {
          type: 'house',
          residential: null
        }
      },
      friends: []
    } );

    personMoldy.id = 1;
    personMoldy.name = 'david';
    personMoldy.age = '33';
    personMoldy.tags.push( 'family' );
    personMoldy.tags.push( 'guy' );
    personMoldy.car = {
      gotWheels: true,
      type: 'hatch'
    };
    personMoldy.address.country = 'australia';
    personMoldy.address.state = 'qld';
    personMoldy.address.details.residential = true;
    personMoldy.friends.push( {
      name: 'max',
      age: '1'
    } );
    personMoldy.friends.push( {
      name: 'leonie'
    } );

    personMoldy.$json().should.eql( {
      id: 1,
      name: 'david',
      age: 33,
      tags: [ 'family', 'guy' ],
      car: {
        gotWheels: true,
        type: 'hatch'
      },
      address: {
        country: 'australia',
        state: 'qld',
        details: {
          type: 'house',
          residential: true
        }
      },
      friends: [ {
        name: 'max',
        age: 1
      }, {
        name: 'leonie',
        age: 0
      } ]
    } );

  } );


} );
