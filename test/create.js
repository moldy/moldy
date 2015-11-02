var Moldy = require( '../src' ),
	should = require( 'should' ),
	dummy = require('./adapter/dummy')();

Moldy.use( dummy.adapter );

describe( 'Create', function () {
	it( 'should call "create" on first save.', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', {
			properties: {
				name: 'string'
			}
		} ).create();
		personMoldy.name = 'David';
		personMoldy.$save( function ( _error, _res ) {
			console.log(dummy.actions[0].action);
			dummy.actions.length.should.eql(1);
			dummy.actions[0].action.should.eql('create');
			dummy.actions[0].arguments[0].should.eql({
				id: undefined,
				name: 'David'
			});
			_done();
		} );
	} );
} );
