var Moldy = require( '../src' ),
	should = require( 'should' );

describe( 'defaults', function () {
	var Person = Moldy.extend( 'person', {
		properties: {
			name: {
				type: 'string',
				default: 'David'
			},
			role: {
				type: 'string',
				default: 'user',
				values: [ 'user', 'admin' ]
			}
		}
	} );

	it( 'should set a default role', function () {
		var stan = Person.create();
		stan.role.should.eql( 'user' );
	} );

	it( 'should only allow specific roles as defined the schema', function () {
		var stan = Person.create( {
			role: 'super'
		} );
		stan.role.should.eql( 'user' );
	} );

} );