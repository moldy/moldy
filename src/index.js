var config = require( './config.json' ),
  moldyApi = {
    adapters: {
      __default: {}
    },
    use: function ( adapter ) {
      this.adapters.__default = adapter;
      console.log( this.adapters.__default )
      console.log( "====" )
    }
  };
//useify = require( 'useify' );

//useify( moldyApi );

var ModelFactory = require( './moldy' )( require( './model' ), config.defaults, moldyApi.adapters );

moldyApi.extend = function ( _name, _properties ) {
  return new ModelFactory( _name, _properties );
};

exports = module.exports = moldyApi;
exports.defaults = config.defaults;