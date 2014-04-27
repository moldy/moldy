module.exports = function ( Moldy ) {
  return function () {
    Moldy.use( require( 'moldy-ajax-adapter' ) );
    Moldy.defaults.baseUrl = 'http://localhost:3000/api';
  };
};