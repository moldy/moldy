var Model = require('../src'),
	should = require('should');

describe('save', function() {

	it('To save the model, call `save()`. If the model is `dirty` (has not been saved to the server and therefore does not have a valid `key`) then the http method will be POST. If the model has been saved, then the http method will be PUT', function(_done) {
		var personModel = new Model('person')
			.property('name')
			.base('http://localhost:3000/api');

		personModel.name = 'David';

		personModel.save(function(_error, _res) {

			if (_error) {
				return _done(_error);
			}

			personModel.should.eql(_res);
			personModel.should.have.a.property('id');
			personModel.name = 'Mr David';

			personModel.save(function(_error, _res) {

				personModel.should.eql(_res);
				_done(_error);

			});

		});

	});

});