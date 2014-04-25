var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'isValid', function () {

  it( 'should be invalid with no type and no value', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        name: 'string',
        age: 'number'
      }
    } ).create();

    personMoldy.$isValid().should.not.be.ok;
    personMoldy.name = 'David';
    personMoldy.$isValid().should.not.be.ok;
    personMoldy.age = '30';
    personMoldy.$isValid().should.be.ok;

  } );
 it( 'should be able to handle it when the model contains an array of a primitive type', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        name: 'string',
        tags: [ 'string' ]
      }
    } ).create();

    personMoldy.$isValid().should.not.be.ok;
    personMoldy.name = 'David';
    personMoldy.$isValid().should.not.be.ok;
    personMoldy.tags.push( 1 );
    personMoldy.$isValid().should.be.ok;

  } );
  it( 'should be able to handle it when the model contains an array of a model type', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        //name: 'string',
        tags: [ {
          keyless: true,
          properties: {
            name: 'string'
          }
        } ]
      }
    } ).create();

    personMoldy.$isValid().should.not.be.ok;
    personMoldy.name = 'David';
    personMoldy.$isValid().should.not.be.ok;
    personMoldy.tags.push( 'guy' );
    personMoldy.$isValid().should.not.be.ok;
    personMoldy.tags[ 0 ].name = 'guy';
    personMoldy.$isValid().should.be.ok;

  } );

  it( 'should be able to handle it when the model contains an array of a model type with an optional variation', function () {
    var personMoldy = Moldy.extend( 'person', {
      properties: {
        name: 'string',
        tags: {
          type: [ {
            keyless: true,
            properties: {
              name: {
                type: 'string',
                optional: true
              }
            }
          } ]
        }
      }
    } ).create();

    personMoldy.$isValid().should.not.be.ok;
    personMoldy.name = 'David';
    personMoldy.$isValid().should.not.be.ok;
    personMoldy.tags.push( 'guy' );
    personMoldy.$isValid().should.be.ok;

  } );

} );