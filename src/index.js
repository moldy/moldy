var config = require( './config.json' ),
  moldyApi = {},
  useify = require( 'sc-useify' );

useify( moldyApi );

var Moldy = require( './moldy' )( config.defaults, moldyApi.middleware );
var ModelFactory = require( './factory' )( Moldy );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;