# TOC
   - [sg-model](#sg-model)
     - [Property Attributes](#sg-model-property-attributes)
       - [type & default](#sg-model-property-attributes-type--default)
       - [optional](#sg-model-property-attributes-optional)
     - [A model's url aka endpoint](#sg-model-a-models-url-aka-endpoint)
     - [get](#sg-model-get)
     - [collection](#sg-model-collection)
     - [save](#sg-model-save)
     - [destroy](#sg-model-destroy)
<a name=""></a>
 
<a name="sg-model"></a>
# sg-model
Create a Model.

```js
var personModel = new Model('person')
	.property('id')
	.property('name')
	.property('age');
personModel.should.have.a.property('id', null);
personModel.should.have.a.property('name', null);
personModel.should.have.a.property('age', null);
```

<a name="sg-model-property-attributes"></a>
## Property Attributes
<a name="sg-model-property-attributes-type--default"></a>
### type & default
Properties can by strongly typed. If a type has been defined, values are cast to that type automatically. If a value cannot be cast to a type then the value will be set to `null` or the `default` if it has been defined.

```js
var personModel = new Model('person')
	.property('age', {
		type: 'number'
	})
	.property('active', {
		type: 'boolean',
		default: false
	})
	.property('tags', {
		type: 'array'
	});
/**
 * try to cast `age` to a `Number`
 */
personModel.age = '13';
personModel.age.should.equal(13).and.be.an.instanceOf(Number);
/**
 * try to cast `active` as a `Boolean`
 */
personModel.active = 1;
personModel.active.should.equal(true).and.be.an.instanceOf(Boolean);
/**
 * `active` is typed as a `Boolean` _and_ a `default` has been defined. When an
 * assigned value that cannot be cast as a `Boolean` is set then the `default` will
 * apply.
 */
personModel.active = 'this is not a boolean';
should(personModel.active).equal(false).and.be.an.instanceOf(Boolean);
/**
 * try to cast `tags` as an `Array`
 */
personModel.tags = 'lorem';
should(personModel.tags).eql(['lorem']).and.be.an.instanceOf(Array);
```

<a name="sg-model-property-attributes-optional"></a>
### optional
Properties can be optional. By making a property optional, `isValid()` and `toJson()` will ignore it if is has not been set.

```js
var personModel = new Model('person')
	.property('id')
	.property('name')
	.property('age', {
		type: 'number',
		optional: true
	})
	.property('active', {
		type: 'boolean',
		default: false
	})
	.property('tags', {
		type: 'array',
		optional: true
	});
/**
 * To ensure this `person` is valid we only need to set the `id` and `name` because
 * the other keys are either `optional` or have `defaults`.
 */
personModel.id = 1;
personModel.name = 'David';
personModel.isValid().should.be.ok;
```

<a name="sg-model-a-models-url-aka-endpoint"></a>
## A model's url aka endpoint
A url (endpoint) is automatically generated based on the `Model` name, key, `url()` and `base()`.

```js
var personModel = new Model('person')
	.property('id', {
		default: '46'
	})
	.property('name');
personModel.url().should.eql('/person');
/**
 * The url can be changed using either `base()` or `url()`
 */
personModel.url('v1');
personModel.url().should.eql('/person/v1');
personModel.base('/api');
personModel.url().should.eql('/api/person/v1');
```

<a name="sg-model-get"></a>
## get
To get by id, give an object with the id.

```js
var personModel = new Model('person', 'guid')
	.property('name')
	.base('http://localhost:3000/api');
personModel.get({
	guid: '5f55821f-3a28-45c3-b91d-7df927a863d8'
}, function(_error, _res) {
	if (_error) {
		return _done(_error);
	}
	_done();
});
```

<a name="sg-model-collection"></a>
## collection
To get a collection.

```js
var personModel = new Model('person', 'guid')
	.property('name')
	.base('http://localhost:3000/api');
personModel.collection(function(_error, _people) {
	if (_error) {
		return _done(_error);
	}
	_people.should.be.an.Array.with.a.lengthOf(3);
	_people.forEach(function(_person) {
		_person.should.be.a.Model;
	});
	_done();
});
```

<a name="sg-model-save"></a>
## save
To save the model, call `save()`. If the model is `dirty` (has not been saved to the server and therefore does not have a valid `key`) then the http method will be POST. If the model has been saved, then the http method will be PUT.

```js
var personModel = new Model('person')
	.property('name')
	.base('http://localhost:3000/api');
personModel.name = 'David';
personModel.save(function(_error, _res) {
	if (_error) {
		return _done(_error);
	}
	personModel.should.eql(_res);
	personModel.should.have.a.property('id');
	personModel.name = 'Mr David';
	personModel.save(function(_error, _res) {
		personModel.should.eql(_res);
		_done(_error);
	});
});
```

<a name="sg-model-destroy"></a>
## destroy
To destroy a model, call `destroy()`.

```js
var personModel = new Model('person')
	.property('name')
	.base('http://localhost:3000/api');
personModel.name = 'David';
personModel.save(function(_error, _res) {
	if (_error) {
		return _done(_error);
	}
	personModel.destroy(function(_error, _res) {
		_done(_error);
	});
});
```

