var Moldy = require( '../src' ),
  should = require( 'should' );

describe( 'Property Attributes', function () {

  describe( 'Type & default', function () {

    it( 'Properties can by strongly typed. If a type has been defined, values are cast to that type automatically. If a value cannot be cast to a type then the value will be set to `null` or the `default` if it has been defined', function () {

      var personMoldy = Moldy.create( 'person', {
        properties: {
          'age': 'number',
          'active': {
            type: 'boolean',
            default: false
          },
          'tags': 'array'
        }
      } );

      /**
       * When a model's properties have been `typed` the assigned values are cast on the fly
       * to ensure the model's data remains sanitized.
       */

      /**
       * Cast a `string` for `age` to a `number`
       */
      personMoldy.age = '13';
      personMoldy.age.should.equal( 13 ).and.be.an.instanceOf( Number );

      /**
       * Cast a truthy `string` for `active` as a `boolean`
       */
      personMoldy.active = 'yes';
      personMoldy.active.should.equal( true ).and.be.an.instanceOf( Boolean );

      /**
       * `active` is typed as a `boolean` _and_ a `default` has been defined. When an
       * assigned value that cannot be cast as a `boolean` is set then the `default` will
       * apply.
       */
      personMoldy.active = 'this is not a boolean';
      should( personMoldy.active ).equal( false ).and.be.an.instanceOf( Boolean );

      /**
       * Cast a `string` for `tags` as an `array`
       */
      personMoldy.tags = 'lorem';
      should( personMoldy.tags ).eql( [ 'lorem' ] ).and.be.an.instanceOf( Array );

    } );

  } );

  // describe('')

  describe( 'Optional', function () {

    it( 'Properties can be optional. By making a property optional, `isValid()` and `toJson()` will ignore it if is has not been set', function () {
      var personMoldy = Moldy.create( 'person' )
        .$property( 'id' )
        .$property( 'name' )
        .$property( 'age', {
          type: 'number',
          optional: true
        } )
        .$property( 'active', {
          type: 'boolean',
          default: false
        } )
        .$property( 'tags', {
          type: 'array',
          optional: true
        } );

      /**
       * To ensure this `person` is valid we only need to set the `id` and `name` because
       * the other keys are either `optional` or have `defaults`.
       */
      personMoldy.id = 1;
      personMoldy.name = 'David';

      personMoldy.$isValid().should.be.ok;

    } );

  } );

  describe( 'Arrays of a type', function () {

    it( 'A property can be defined as `array` of a type like an `array` of `strings`, or an `array` of `numbers`', function () {
      var personMoldy = Moldy.create( 'person' )
        .$property( 'id' )
        .$property( 'tags', {
          type: [ 'string' ]
        } );

      /**
       * When defining an array of a type, the arrays are normal arrays however they have been
       * extended to allow hooks into the necessary methods for sanitization.
       */
      personMoldy.tags.should.be.an.Array;
      personMoldy.tags.should.have.a.property( 'length' ).and.be.a.Number;
      personMoldy.tags.should.have.a.property( 'pop' ).and.be.a.Function;
      personMoldy.tags.should.have.a.property( 'push' ).and.be.a.Function;
      personMoldy.tags.should.have.a.property( 'reverse' ).and.be.a.Function;
      personMoldy.tags.should.have.a.property( 'shift' ).and.be.a.Function;
      personMoldy.tags.should.have.a.property( 'sort' ).and.be.a.Function;
      personMoldy.tags.should.have.a.property( 'splice' ).and.be.a.Function;
      personMoldy.tags.should.have.a.property( 'unshift' ).and.be.a.Function;

      /**
       * Pushing a value - like normal
       */
      personMoldy.tags.push( 'yellow' );

      /**
       * We are pushing a `number` here to show how the value will be cast to a string
       */
      personMoldy.tags.push( 1 );

      /**
       * The value `1` is now a string
       */
      personMoldy.tags[ 1 ].should.equal( '1' );

      personMoldy.tags.should.have.a.lengthOf( 2 );
      personMoldy.tags.should.eql( [ 'yellow', '1' ] );

      /**
       * A gotcha for using primitive types in this context is that they are not sanitized
       * based on the schema if they are changed directly
       */
      personMoldy.tags[ 1 ] = 1;

      /**
       * Technically this should have cast the number `1` to a string but it was a design
       * decision not to add getters/setters to each item in an array. A santize method will
       * be added in the next version
       */
      personMoldy.tags[ 1 ].should.equal( 1 );

    } );

    it( 'Array types can also be model schemas', function () {
      var personMoldy = Moldy.create( 'person' )
        .$property( 'cars', {
          type: [ {
            name: 'car',
            properties: {
              make: 'string',
              model: {
                type: 'string',
                default: ''
              },
              year: 'number'
            }
          } ]
        } );

      /**
       * Note, we are missing the `model` key and the `year` is a string
       */
      personMoldy.cars.push( {
        make: 'honda',
        year: '2010'
      } );

      personMoldy.cars[ 0 ].$json().should.eql( {
        id: undefined,
        make: 'honda',
        model: '',
        year: 2010
      } );

    } );

  } );

} );