var Moldy = require('../src'), should = require('should');
var schema = {
  'properties': {
    'body': 'string',
    'endTime': {
			'type': 'string',
			'default': "five"
		},
    'location': {
			'type': 'number',
			'default': 5
		},
    'actions': {
      'keyless': true,
      'properties': {
        'sit': {
          'type': 'number',
          'default': 5
        },
        'stand': {
          'type': 'number',
          'default': 5
        }
      }
    }
  }
};
describe('diff', function () {
  it('should diff', function () {
    var postMoldy = Moldy.extend('post', schema).create();
    postMoldy.body = 'cheese';
    postMoldy.actions.sit = 12;
    var diff = postMoldy.$json(true);

		diff.should.eql({
			body: 'cheese',
			actions: {
				sit: 12
			}
		});
  });
});
