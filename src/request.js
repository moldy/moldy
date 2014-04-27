var is = require( 'sc-is' ),
  cast = require( 'sc-cast' ),
  hasKey = require( 'sc-haskey' );
/**
 * Fetching the data
 * @param  {[type]} _moldy    [description]
 * @param  {[type]} _data     [description]
 * @param  {[type]} _method   [description]
 * @param  {[type]} _url      [description]
 * @param  {[type]} _callback [description]
 * @return {[type]}           [description]
 */
module.exports = function ( _moldy, instance, _data, _method, _url, _callback ) {
  var moldy = _moldy,
    result = [],
    method = ( _method === 'find' || _method === 'findOne' ) ? 'get' : _method,
    responseShouldContainAnId = hasKey( _data, moldy.__key ) && is.not.empty( _data[ moldy.__key ] ) && /get/.test( method ),
    isInstance = instance ? true : false,
    isDirty = isInstance ? instance.$isDirty() : false;

  moldy.__defaultMiddleware( function ( _error, _response ) {
    var args = Array.prototype.slice.call( arguments ),
      error = _error === moldy ? null : args.shift(),
      response = args.shift();

    if ( error && !( error instanceof Error ) ) {
      error = new Error( 'An unknown error occurred' );
    }

    if ( !error && isInstance && isDirty && is.object( response ) && ( responseShouldContainAnId && !hasKey( response, moldy.__key ) ) ) {
      error = new Error( 'The response from the server did not contain a valid `' + moldy.__key + '`' );
    }

    if ( !error && isDirty && isInstance && is.object( response ) ) {
      moldy[ moldy.__key ] = response[ moldy.__key ];
    }

    if ( !error ) {
      if ( !isInstance ) {
        if ( _method !== 'findOne' && is.array( response ) ) {

          response.forEach( function ( _data ) {

            result.push( moldy.create( _data ) );
          } );
        } else if ( _method === 'findOne' && is.array( response ) ) {
          result = moldy.create( response[ 0 ] );
        } else {
          result = moldy.create( response );
        }
      } else {
        instance.$data( response );
        result = instance;
      }
    }

    _callback && _callback( error, result );

  }, _moldy, _data, method, _url );

};