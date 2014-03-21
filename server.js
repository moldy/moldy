/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var guid = require('sc-guid');

app.post('/api/person', function(_req, _res) {
	_req.body.id = guid.generate();
	_res.json(_req.body);
});

app.put('/api/person/:id', function(_req, _res) {
	_res.json(_req.body);
});

app.del('/api/person/:id', function(_req, _res) {
	_res.json();
});

app.post('/empty-body/*', function(_req, _res) {
	_res.send(200);
});

app.post('/400/*', function(_req, _res) {
	_res.send(400);
});

app.post('/404/*', function(_req, _res) {
	_res.send(404);
});

app.post('/500/*', function(_req, _res) {
	_res.send(500);
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});