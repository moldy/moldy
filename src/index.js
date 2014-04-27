var config = require( './config.json' ),
  moldyApi = {},
  useify = require( 'useify' );

useify( moldyApi );

var ModelFactory = require( './moldy' )( require( './model' ), config.defaults, moldyApi.middleware );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;