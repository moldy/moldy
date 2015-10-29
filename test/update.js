var Moldy = require( '../src' ),
	should = require( 'should' ),
	express = require( 'express' ),
	bodyParser = require( 'body-parser' );

var port = ( process.env.PORT + 1 ) || 3001;
var server = 'http://localhost:' + port;

var schema = {
	properties: {
		age: 'number',
		actions: {
			'keyless': true,
			'properties': {
				'sit': {
					'type': 'number',
					'default': 5
				},
				'stand': {
					'type': 'number',
					'default': 5
				}
			}
		}
	},
	baseUrl: server + '/echo'
};



describe( 'update', function () {
	var app, server, lastRequest;
	before( function () {
		// set up a quick Request server so we can see what Moldy is sending.
		require( './setup' )( Moldy )();
		app = express();
		app.use( bodyParser.json() );
		app.all( '/*', function ( _req, _res ) {
			lastRequest = _req.body;
			_res.json();
		} );
		server = app.listen( port );
	} );
	after( function () {
		server.close();
		require( './setup/teardown' )();
	} );

	it( 'should only update the changed properties', function ( _done ) {
		var personMoldy = Moldy.extend( 'person', schema ).create();
		personMoldy.age = 12;
		personMoldy.actions.sit = 12;
		personMoldy.$update( function ( _error, _moldy, _res ) {
			lastRequest.should.eql( {
				age: 12,
				actions: {
					sit: 12
				}
			} );
			_done();
		} );
	} );

} );
