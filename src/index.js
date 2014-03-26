var is = require('sc-is'),
	cast = require('sc-cast'),
	hasKey = require('sc-haskey'),
	merge = require('sc-merge'),
	emitter = require('emitter-component'),
	request = require('./request.ajax.js');

var noop = function() {};

var Attributes = function(_key, _value) {
	return merge({
		name: _key || '',
		type: '',
		default: null,
		optional: false
	}, _value);
}

var getProperty = function(_key) {
	return function() {
		return this.__data[_key];
	}
};

var setProperty = function(_key) {
	return function(_value) {
		var self = this,
			attributes = self.__attributes[_key],
			value = attributes.type ? cast(_value, attributes.type, attributes['default']) : _value;

		if (self.__data[_key] !== value) {
			self.emit('change', self.__data[_key], value);
		}

		self.__data[_key] = value;
	}
};

var setBusy = function(_self) {
	return function() {
		_self.busy = true;
	}
}

var unsetBusy = function(_self) {
	return function() {
		_self.busy = false;
	}
}

var Model = function(_name, _key) {
	var self = this;

	Object.defineProperties(self, {
		__attributes: {
			value: {},
			writable: true
		},
		__base: {
			value: '',
			writable: true
		},
		__data: {
			value: {},
			writable: true
		},
		__destroyed: {
			value: false,
			writable: true
		},
		__headers: {
			value: {},
			writable: true
		},
		__key: {
			value: _key || 'id',
			writable: true
		},
		__name: {
			value: _name || ''
		},
		__url: {
			value: '',
			writable: true
		},
		busy: {
			value: false,
			writable: true
		}
	});

	self.property(self.__key);

	self.on('presave', setBusy(self));
	self.on('save', unsetBusy(self));

	self.on('predestroy', setBusy(self));
	self.on('destroy', unsetBusy(self));

	self.on('preget', setBusy(self));
	self.on('get', unsetBusy(self));

};

Model.prototype.base = function(_base) {
	var self = this,
		url = is.empty(_base) ? '' : _base;

	self.__base = url.trim().replace(/(\/|\s)+$/g, '');

	return is.not.a.string(_base) ? self.__base : self;
};

Model.prototype.collection = function(_query) {
	var self = this,
		url = self.url(),
		method = 'get',
		query = is.an.object(_query) ? _query : {},
		callback = is.a.func(_query) ? _query : is.a.func(_callback) ? _callback : noop;

	self.emit('precollection', {
		model: self,
		method: method,
		query: query,
		url: url,
		callback: callback
	});

	request(self, query, method, url, function(_error, _res) {
		self.emit('collection', _error, _res);
		callback.apply(self, arguments);
	});

};

Model.prototype.destroy = function(_callback) {
	var self = this,
		isDirty = self.isDirty(),
		data = self.json(),
		url = self.url() + '/' + self[self.__key],
		method = 'delete',
		callback = is.a.func(_callback) ? _callback : noop;

	self.emit('predestroy', {
		model: self,
		data: data,
		method: method,
		url: url,
		callback: callback
	});

	if (!isDirty) {
		request(self, data, method, url, function() {

			self.emit('destroy', self);

			self.__destroyed = true;
			callback.apply(self, arguments);
		});
	} else {
		callback.apply(self, [new Error('This model cannot be destroyed because it has not been saved to the server yet.')]);
	}

};

Model.prototype.data = function(_data) {
	var self = this,
		data = is.object(_data) ? _data : {};

	Object.keys(data).forEach(function(_key) {
		self.property(_key, _data[_key]);
	});

	return self;
};

Model.prototype.clone = function(_data) {
	var self = this,
		newModel = new Model(self.__name, self.__key)
			.base(self.__base)
			.headers(self.__headers)
			.url(self.__url);

	Object.keys(self.__attributes).forEach(function(_propertyKey) {
		newModel.property(_propertyKey, merge(self.__attributes[_propertyKey]));
	});

	newModel.data(_data);

	return newModel;
};

Model.prototype.get = function(_query, _callback) {
	var self = this,
		url = self.url(),
		method = 'get',
		query = is.an.object(_query) ? _query : {},
		callback = is.a.func(_query) ? _query : is.a.func(_callback) ? _callback : noop;

	self.emit('preget', {
		model: self,
		method: method,
		query: query,
		url: url,
		callback: callback
	});

	request(self, query, method, url, function(_error, _res) {
		self.emit('get', _error, _res);
		callback.apply(self, arguments);
	});

};

Model.prototype.json = function() {
	return this.__data;
};

Model.prototype.headers = function(_headers) {
	this.__headers = is.an.object(_headers) ? _headers : this.__headers;
	return is.not.an.object(_headers) ? this.__headers : this;
};

Model.prototype.isDirty = function() {
	return is.empty(this[this.__key]);
};

Model.prototype.isValid = function() {
	var self = this,
		isValid = true;

	Object.keys(self.__attributes).forEach(function(_key) {

		if (self.isDirty() && _key === self.__key) {
			return;
		}

		var value = self[_key],
			attributes = self.__attributes[_key],
			type = attributes.type,
			isRequired = attributes.optional ? false : true,
			hasNoDefault = is.nullOrUndefined(attributes['default']),
			isNullOrUndefined = is.nullOrUndefined(value),
			typeIsWrong = is.not.empty(type) ? is.not.a[type](value) : isNullOrUndefined;

		if (isRequired && typeIsWrong) {
			isValid = false;
		}

	});

	return isValid;
};

Model.prototype.key = function(_key) {
	this.__key = _key;
	return this;
};

Model.prototype.property = function(_key, _value) {
	var self = this,
		attributes = new Attributes(_key, _value);

	if (!self.hasOwnProperty(_key)) {
		Object.defineProperty(self, _key, {
			get: getProperty(_key),
			set: setProperty(_key),
			enumerable: true
		});
		self.__attributes[_key] = attributes;
	}

	if (attributes.optional === false && is.not.nullOrUndefined(attributes['default'])) {
		self[_key] = attributes['default'];
	} else if (attributes.optional === false) {
		self.__data[_key] = is.empty(attributes.type) ? undefined : cast(undefined, attributes.type);
	}

	return self;
};

Model.prototype.save = function(_callback) {
	var self = this,
		error = null,
		isDirty = self.isDirty(),
		data = self.json(),
		url = self.url() + (!isDirty ? '/' + self[self.__key] : ''),
		method = isDirty ? 'post' : 'put',
		callback = is.a.func(_callback) ? _callback : noop;

	self.emit('presave', {
		model: self,
		data: data,
		method: method,
		url: url,
		callback: callback
	});

	request(self, data, method, url, function(_error, _res) {
		self.emit('save', _error, _res);
		callback.apply(self, arguments);
	});

};

Model.prototype.url = function(_url) {
	var self = this,
		base = is.empty(self.__base) ? '' : self.__base,
		name = is.empty(self.__name) ? '' : '/' + self.__name.trim().replace(/^\//, ''),
		url = _url || self.__url || '',
		endpoint = base + name + (is.empty(url) ? '' : '/' + url.trim().replace(/^\//, ''));

	self.__url = url.trim().replace(/^\//, '');

	return is.not.a.string(_url) ? endpoint : self;
};

emitter(Model.prototype);

module.exports = Model;