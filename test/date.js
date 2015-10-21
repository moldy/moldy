var is = require( 'sc-is' ),
	Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'date', function () {

	it( 'should set the data', function () {
		var personMoldy = Moldy.extend( 'person', {
			keyless: true,
			properties: {
				dob: {
					type: 'date'
				}
			}
		} ).create( {
			dob: '13 Jun 2014'
		} );

		is.a.date( personMoldy.dob ).should.be.true;
		personMoldy.dob.should.eql( new Date( '13 Jun 2014' ) );

		personMoldy.dob = '10 June 2014';

		is.a.date( personMoldy.dob ).should.be.true;
		personMoldy.dob.should.eql( new Date( '10 June 2014' ) );

		personMoldy.$json().should.eql( {
			dob: (new Date('10 June 2014')).toISOString()
		} );

	} );

} );