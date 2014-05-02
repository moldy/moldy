var config = require( './config.json' ),
  moldyApi = {
    adapters: {
      __default: void 0
    },
    use: function ( adapter ) {

      if( !adapter || !adapter.name || !adapter.create || !adapter.find || !adapter.findOne || !adapter.save || !adapter.destroy ) {
        throw new Error( 'Invalid Adapter' );
      }

      if( !this.adapters.__default ) {
        this.adapters.__default = adapter;
      }

      this.adapters[ adapter.name ] = adapter;
    }
  };

var ModelFactory = require( './moldy' )( require( './model' ), config.defaults, moldyApi.adapters );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;