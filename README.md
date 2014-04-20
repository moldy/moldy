# TOC
   - [moldy](#moldy)
     - [Property Attributes](#moldy-property-attributes)
       - [Type & default](#moldy-property-attributes-type--default)
       - [Optional](#moldy-property-attributes-optional)
       - [Arrays of a type](#moldy-property-attributes-arrays-of-a-type)
     - [A model's url aka endpoint](#moldy-a-models-url-aka-endpoint)
     - [get](#moldy-get)
     - [collection](#moldy-collection)
     - [save](#moldy-save)
     - [destroy](#moldy-destroy)
<a name=""></a>
 
<a name="moldy"></a>
# moldy
Create a Moldy.

```js
var personMoldy = Moldy.create( 'person' )
  .$property( 'id' )
  .$property( 'name' )
  .$property( 'age' );
personMoldy.should.have.a.property( 'id', null );
personMoldy.should.have.a.property( 'name', null );
personMoldy.should.have.a.property( 'age', null );
```

<a name="moldy-property-attributes"></a>
## Property Attributes
<a name="moldy-property-attributes-type--default"></a>
### Type & default
Properties can by strongly typed. If a type has been defined, values are cast to that type automatically. If a value cannot be cast to a type then the value will be set to `null` or the `default` if it has been defined.

```js
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
```

<a name="moldy-property-attributes-optional"></a>
### Optional
Properties can be optional. By making a property optional, `isValid()` and `toJson()` will ignore it if is has not been set.

```js
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
```

<a name="moldy-property-attributes-arrays-of-a-type"></a>
### Arrays of a type
A property can be defined as `array` of a type like an `array` of `strings`, or an `array` of `numbers`.

```js
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
```

Array types can also be model schemas.

```js
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
```

<a name="moldy-a-models-url-aka-endpoint"></a>
## A model's url aka endpoint
A url (endpoint) is automatically generated based on the `Moldy` name, key, `$url()` and `$baseUrl()`.

```js
var personMoldy = Moldy.create( 'person', {
  baseUrl: '/api'
} );
personMoldy.$url().should.eql( '/api/person' );
/**
 * The url can be changed using either `base()` or `url()`
 */
personMoldy.$url( 'v1' );
personMoldy.$url().should.eql( '/api/person/v1' );
```

<a name="moldy-get"></a>
## get
To get by `id` or `key`, give an object with appropriate conditions.

```js
var personMoldy = Moldy.create( 'person', {
  key: 'guid',
  properties: {
    name: ''
  }
} );
personMoldy.$get( {
  guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
}, function ( _error, _res ) {
  if ( _error ) {
    return _done( _error );
  }
  _done();
} );
```

$get will only return a single entity. If an adapter responds with an array the first item will be returned.

```js
var personMoldy = Moldy.create( 'person', {
  key: 'guid',
  properties: {
    name: ''
  }
} );
/**
 * In this example the end point GET `http://localhost:3000/api` returns an array of items.
 * Moldy will return the first item out of the array. If you need to return an array you can
 * use the $collection method.
 */
personMoldy.$get( function ( _error, _res ) {
  if ( _error ) {
    return _done( _error );
  }
  _res.should.not.be.an.Array;
  _done();
} );
```

<a name="moldy-collection"></a>
## collection
<a name="moldy-save"></a>
## save
To save the model, call `save()`. If the model is `dirty` (has not been saved to the server and therefore does not have a valid `key`) then the http method will be POST. If the model has been saved, then the http method will be PUT.

```js
var personMoldy = Moldy.create( 'person', {
  properties: {
    name: 'string'
  }
} );
personMoldy.name = 'David';
personMoldy.$save( function ( _error, _res ) {
  if ( _error ) {
    return _done( _error );
  }
  personMoldy.should.eql( _res );
  personMoldy.should.have.a.property( 'id' );
  personMoldy.name = 'Mr David';
  personMoldy.$save( function ( _error, _res ) {
    personMoldy.should.eql( _res );
    _done( _error );
  } );
} );
```

<a name="moldy-destroy"></a>
## destroy
