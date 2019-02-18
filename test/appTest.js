const request = require('supertest');

const app = require('../src/app.js');

describe('app', () => {
  it('should return send not found for the url /bad', done => {
    request(app)
      .get('/bad')
      .expect(404)
      .end(done);
  });
});

// headers: { 'Content-Type': 'application/json' },

describe('hostGame', function() {
  it('should return response for the url(( /host-game', function(done) {
    request(app)
      .post('/host-game')
      .send(JSON.stringify({host: 'gayatri', totalPlayers: 4}))
      .set('Content-Type', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });
});
