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
Create a Model.

```js
var personModel = new Model( 'person' )
	.$property( 'id' )
	.$property( 'name' )
	.$property( 'age' );
personModel.should.have.a.property( 'id', null );
personModel.should.have.a.property( 'name', null );
personModel.should.have.a.property( 'age', null );
```

<a name="moldy-property-attributes"></a>
## Property Attributes
<a name="moldy-property-attributes-type--default"></a>
### Type & default
Properties can by strongly typed. If a type has been defined, values are cast to that type automatically. If a value cannot be cast to a type then the value will be set to `null` or the `default` if it has been defined.

```js
var personModel = new Model( 'person' )
	.$property( 'age', {
		type: 'number'
	} )
	.$property( 'active', {
		type: 'boolean',
		default: false
	} )
	.$property( 'tags', {
		type: 'array'
	} );
/**
 * try to cast `age` to a `Number`
 */
personModel.age = '13';
personModel.age.should.equal( 13 ).and.be.an.instanceOf( Number );
/**
 * try to cast `active` as a `Boolean`
 */
personModel.active = 1;
personModel.active.should.equal( true ).and.be.an.instanceOf( Boolean );
/**
 * `active` is typed as a `Boolean` _and_ a `default` has been defined. When an
 * assigned value that cannot be cast as a `Boolean` is set then the `default` will
 * apply.
 */
personModel.active = 'this is not a boolean';
should( personModel.active ).equal( false ).and.be.an.instanceOf( Boolean );
/**
 * try to cast `tags` as an `Array`
 */
personModel.tags = 'lorem';
should( personModel.tags ).eql( [ 'lorem' ] ).and.be.an.instanceOf( Array );
```

<a name="moldy-property-attributes-optional"></a>
### Optional
Properties can be optional. By making a property optional, `isValid()` and `toJson()` will ignore it if is has not been set.

```js
var personModel = new Model( 'person' )
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
personModel.id = 1;
personModel.name = 'David';
personModel.$isValid().should.be.ok;
```

<a name="moldy-property-attributes-arrays-of-a-type"></a>
### Arrays of a type
A property can be defined as `array` of a type like an `array` of `strings`, or an `array` of `numbers`.

```js
var personModel = new Model( 'person' )
	.$property( 'id' )
	.$property( 'tags', {
		type: [ 'string' ]
	} );
/**
 * When defining an array of a type, the arrays are normal arrays however they have been
 * extended to allow hooks into the necessary methods for sanitization.
 */
personModel.tags.should.be.an.Array;
personModel.tags.should.have.a.property( 'length' ).and.be.a.Number;
personModel.tags.should.have.a.property( 'pop' ).and.be.a.Function;
personModel.tags.should.have.a.property( 'push' ).and.be.a.Function;
personModel.tags.should.have.a.property( 'reverse' ).and.be.a.Function;
personModel.tags.should.have.a.property( 'shift' ).and.be.a.Function;
personModel.tags.should.have.a.property( 'sort' ).and.be.a.Function;
personModel.tags.should.have.a.property( 'splice' ).and.be.a.Function;
personModel.tags.should.have.a.property( 'unshift' ).and.be.a.Function;
/**
 * Pushing a value - like normal
 */
personModel.tags.push( 'yellow' );
/**
 * We are pushing a `number` here to show how the value will be cast to a string
 */
personModel.tags.push( 1 );
/**
 * The value `1` is now a string
 */
personModel.tags[ 1 ].should.equal( '1' );
personModel.tags.should.have.a.lengthOf( 2 );
personModel.tags.should.eql( [ 'yellow', '1' ] );
/**
 * A gotcha for using primitive types in this context is that they are not sanitized
 * based on the schema if they are changed directly
 */
personModel.tags[ 1 ] = 1;
/**
 * Technically this should have cast the number `1` to a string but it was a design
 * decision not to add getters/setters to each item in an array. A santize method will
 * be added in the next version
 */
personModel.tags[ 1 ].should.equal( 1 );
```

Array types can also be model schemas.

```js
var personModel = new Model( 'person' )
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
personModel.cars.push( {
	make: 'honda',
	year: '2010'
} );
personModel.cars[ 0 ].$json().should.eql( {
	id: undefined,
	make: 'honda',
	model: '',
	year: 2010
} );
```

<a name="moldy-a-models-url-aka-endpoint"></a>
## A model's url aka endpoint
A url (endpoint) is automatically generated based on the `Model` name, key, `url()` and `base()`.

```js
var personModel = new Model( 'person' )
	.$property( 'id', {
		default: '46'
	} )
	.$property( 'name' );
personModel.$url().should.eql( '/person' );
/**
 * The url can be changed using either `base()` or `url()`
 */
personModel.$url( 'v1' );
personModel.$url().should.eql( '/person/v1' );
personModel.$baseUrl( '/api' );
personModel.$url().should.eql( '/api/person/v1' );
```

<a name="moldy-get"></a>
## get
<a name="moldy-collection"></a>
## collection
<a name="moldy-save"></a>
## save
<a name="moldy-destroy"></a>
## destroy
