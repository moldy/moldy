var config = require( './config.json' ),
	moldyApi = {},
	useify = require( 'sc-useify' );

useify( moldyApi );

var Moldy = require( './moldy' )( config.defaults, moldyApi.middleware );

moldyApi.create = function ( _name, _properties ) {
	return new Moldy( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;