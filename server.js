/**
 * Module dependencies.
 */

var express = require( 'express' ),
	bodyParser = require( 'body-parser' ),
	logger = require( 'morgan' ),
	debug = require( 'debug' )( process.env.APP_NAME );

var _ = require( 'underscore' ),
	guid = require( 'sc-guid' ),
	dummy = require( './test/dummy' );

var app = express();

// app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
	extended: false
} ) );

app.get( '/api/person/:id', function ( _req, _res ) {
	var person = _.findWhere( dummy.data.people, {
		guid: _req.params.id
	} );
	_res.json( person );
} );

app.get( '/api/person', function ( _req, _res ) {
	_res.json( dummy.data.people );
} );

app.post( '/api/person', function ( _req, _res ) {
	_req.body.guid = guid.generate();
	_res.json( _req.body );
} );

app.put( '/api/person/:id', function ( _req, _res ) {
	_res.json( _req.body );
} );

app.delete( '/api/person/:id', function ( _req, _res ) {
	_res.json();
} );

app.post( '/empty-body/*', function ( _req, _res ) {
	_res.send( 200 ).end();
} );

app.post( '/400/*', function ( _req, _res ) {
	_res.send( 400 ).end();
} );

app.post( '/404/*', function ( _req, _res ) {
	_res.send( 404 ).end();
} );

app.post( '/500/*', function ( _req, _res ) {
	_res.send( 500 ).end();
} );

app.set( 'port', process.env.PORT || 3000 );

var server = app.listen( app.get( 'port' ), function () {
	debug( 'Express server listening on port ' + server.address().port );
} );

module.exports = app;