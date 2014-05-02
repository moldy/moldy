var config = require( './config.json' ),
  moldyApi = {
    adapters: {
      __default: {}
    },
    use: function ( adapter ) {

      if( !adapter || !adapter.create || !adapter.find || !adapter.findOne || !adapter.save || !adapter.destroy ) {
        throw new Error( "Invalid Adapter" );
      }

      this.adapters.__default = adapter;
    }
  };

var ModelFactory = require( './moldy' )( require( './model' ), config.defaults, moldyApi.adapters );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;