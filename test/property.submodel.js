var Model = require( '../src' ),
	should = require( 'should' );

describe( 'properties with sub models', function () {

	it( 'sub model', function () {
		var personModel = new Model( 'person', {
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
		} );

		personModel.car.should.be.a.Model;
		personModel.car.make = 'honda';
		personModel.car.year = '2010';

		personModel.car.year.should.equal( 2010 );

	} );

	it( 'sub sub model', function () {
		var personModel = new Model( 'person', {
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
		} );


		personModel.$data( {
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

		personModel.car.should.be.a.Model;
		personModel.car.make = 'honda';
		personModel.car.model = '';
		personModel.car.year = '2010';

		personModel.car.accessories.should.be.a.Model;
		personModel.car.accessories.hasWheels.should.be.true;
		personModel.car.accessories.isPainted.should.be.false;

		personModel.car.accessories.engine.should.be.a.Model;
		personModel.car.accessories.engine.size.should.equal( '2l' );
		personModel.car.accessories.engine.cylinders.should.equal( 4 );

		personModel.$json().should.eql( {
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