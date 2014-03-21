var Model = require('../src'),
	should = require('should');

describe('Property Attributes', function() {

	describe('type & default', function() {

		it('Properties can by strongly typed. If a type has been defined, values are cast to that type automatically. If a value cannot be cast to a type then the value will be set to `null` or the `default` if it has been defined', function() {
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

		});

	});

	describe('optional', function() {

		it('Properties can be optional. By making a property optional, `isValid()` and `toJson()` will ignore it if is has not been set', function() {
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

		});

	});

});