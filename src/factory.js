var helpers = require("./helpers/index");

module.exports = function ( Moldy ) {

  var ModelFactory = function ( _name, _properties ) {
    this._name = _name;
    this._properties = _properties;
  };

  ModelFactory.prototype.schema = function ( schema ) {
    this.schema = schema;
  };

  ModelFactory.prototype.proto = function ( proto ) {
    this.proto = proto;
  };

  ModelFactory.prototype.create = function ( _initial ) {
    var properties = this._properties || {},
        Klass = Moldy;

    if( this.proto ) {
      helpers.extend( properties.proto, this.proto );
    }

    if( this.schema ) {
      helpers.extend( properties.properties, this.schema );
    }

    properties.initial = _initial;

    if( properties.proto ) {
      Klass = Moldy.extend( properties.proto || {} );
    }

    return new Klass( this._name, properties );
  };

  return ModelFactory;

};