var extend = require('extend');
module.exports = function(){

	var actions = [];

	var db = {};

	var DummyAdapter = function () {};
	DummyAdapter.prototype = {
		name: 'dummy'
	};
	[
		'find',
		'destroy'
	].forEach( function ( key ) {
		DummyAdapter.prototype[ key ] = function () {
			actions.push( {
				action: key,
				arguments: arguments
			} );
			arguments[ arguments.length - 1 ]();
		};
	} );

	DummyAdapter.prototype.create = function(thing, cb){
		actions.push( {
			action: 'create',
			arguments: arguments
		} );
		var id = Math.round(Math.random()*1e6);
		db[id] = extend(true, {id: id}, thing);
		cb(null, db[id]);
	};

	DummyAdapter.prototype.save = function(thing, cb){
			actions.push( {
				action: 'update',
				arguments: arguments
			} );
			db[thing.id] = extend(true, db[thing.id], thing);
			cb(null, db[thing.id]);
	};

	DummyAdapter.prototype.findOne = function(thing, cb){
		actions.push( {
			action: 'findOne',
			arguments: arguments
		} );
		var foundThing = db[thing.id];
		cb(null, extend(true, {}, foundThing));
	};

	return {
		actions: actions,
		adapter: new DummyAdapter()
	};

};
