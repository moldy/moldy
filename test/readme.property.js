var Model = require( '../src' ),
	should = require( 'should' );

describe( 'Property Attributes', function () {

	describe( 'Type & default', function () {

		it( 'Properties can by strongly typed. If a type has been defined, values are cast to that type automatically. If a value cannot be cast to a type then the value will be set to `null` or the `default` if it has been defined', function () {
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

		} );

	} );

	// describe('')

	describe( 'Optional', function () {

		it( 'Properties can be optional. By making a property optional, `isValid()` and `toJson()` will ignore it if is has not been set', function () {
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

		} );

	} );

	describe( 'Arrays of a type', function () {

		it( 'A property can be defined as `array` of a type like an `array` of `strings`, or an `array` of `numbers`', function () {
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

		} );

		it( 'Array types can also be model schemas', function () {
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

		} );

	} );

} );