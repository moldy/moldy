var request = require( 'superagent' ),
  cast = require( 'sc-cast' ),
  is = require( 'sc-is' ),
  hasKey = require( 'sc-haskey' );

var req = function ( _moldy, _data, _method, _url, _callback ) {
  var method = /delete/i.test( _method ) ? 'del' : _method,
    data = cast( _data, 'object', {} ),
    url = _url,
    error;

  if ( /get/i.test( method ) && hasKey( data, _moldy.__key ) && new RegExp( data[ _moldy.__key ] ).test( url ) === false ) {
    url += '/' + data[ _moldy.__key ];
    delete data[ _moldy.__key ];
  }


  request[ method ]( url )[ /get/i.test( method ) ? 'query' : 'send' ]( data )
    .set( _moldy.$headers() )
    .type( 'json' )
    .accept( 'json' )
    .end( function ( _error, _res ) {
      var res = is.an.object( _res ) ? _res : {},
        body = hasKey( _res, 'body' ) && ( is.object( _res.body ) || is.array( _res.body ) ) ? _res.body : null;

      if ( res.ok !== true ) {
        error = new Error( 'The response from the server was not OK' );
      }

      if ( body === null ) {
        error = new Error( 'The response from the server contained an empty body' );
      }

      if ( _callback ) {
        _callback( error, body );
      }

    } );

};

module.exports = {
  name: "ajax",
  create: function ( data, done ) {
    req( this, data, 'post', this.$url(), done );
  },
  findOne: function ( query, done ) {
    req( this, query, 'get', this.$url(), done );
  },
  find: function ( query, done ) {
    req( this, query, 'get', this.$url(), done );
  },
  save: function ( data, done ) {
    var url = this.$url() + ( this.__keyless ? '' : '/' + data[ this.__key ] );

    req( this, data, 'put', url, done );
  },
  destroy: function ( data, done ) {
    var url = this.$url() + ( this.__keyless ? '' : '/' + data[ this.__key ] );

    req( this, data, 'delete', url, done );
  }
};