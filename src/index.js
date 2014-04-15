var useify = require( 'sc-useify' ),
    defaultConfiguration = {
      baseUrl: '',
      headers: {}
    },
    moldyAPI = { };

useify( moldyAPI );

var Moldy = require( './moldy' )( defaultConfiguration, moldyAPI.middleware );

moldyAPI.create = function ( _name, _properties ) {
    return new Moldy( _name, _properties );
};

exports = module.exports = moldyAPI;

exports.defaults = defaultConfiguration
/**
 * Expose built in middleware
 */
// exports.schema = require( './middleware/schema.middleware' );
// exports.ajax = require( './middleware/ajax.middleware' );