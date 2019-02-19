const request = require('supertest');

const GameManager = require('../src/models/game_manager');
const Game = require('../src/models/game');
const Player = require('../src/models/player');

const app = require('../src/app.js');

describe('GET /', function() {
  it('Should serve join game page', function(done) {
    request(app)
      .get('/')
      .expect(/[jJ]oin/)
      .expect(200, done);
  });
});

describe('POST /join-game', function() {
  let gameID;
  beforeEach(function() {
    app.gameManager = new GameManager();
    const game = new Game(3);
    const host = new Player('Arnab');
    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();
  });

  it('Should add player to game provided correct game and game is not full', function(done) {
    request(app)
      .post('/join-game')
      .send({playerName: 'Dheeraj', gameID})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({error: false, message: ''})
      .expect(200, done);
  });

  it('Should provide error message if gameID entered is wrong', function(done) {
    request(app)
      .post('/join-game')
      .send({playerName: 'Dheeraj', gameID: '10'})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({error: true, message: 'No Such Game with ID 10'})
      .expect(200, done);
  });

  it('Should provide error message if game is full', function(done) {
    const game = app.gameManager.getGameById(1);
    const player2 = new Player('Dheeraj');
    const player3 = new Player('Suman');
    game.addPlayer(player2);
    game.addPlayer(player3);

    request(app)
      .post('/join-game')
      .send({playerName: 'Sai', gameID})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({error: true, message: 'Sorry! Game has already started.'})
      .expect(200, done);
  });
});

describe('hostGame', function() {
  it('should return response for the url(( /host-game', function(done) {
    request(app)
      .post('/host-game')
      .send({host: 'gayatri', totalPlayers: 4})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });
});

describe('game-status', function() {
  it('should redirect to the /game url when all players will be joined', function(done) {
    request(app)
      .get('/game-status')
      .set('Cookie', ['gameId=1;playerId=2'])
      .expect(200, done);
  });
});

describe('GET /game', function() {
  let gameID;
  beforeEach(function() {
    app.gameManager = new GameManager();
    const game = new Game(3);
    const host = new Player('Arnab');
    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();
  });

  it('should redirect to / given gameId cookie is not present', function(done) {
    request(app)
      .get('/game')
      .expect('location', '/')
      .expect(302, done);
  });
  it('should redirect to / given gameId cookie is not valid', function(done) {
    request(app)
      .get('/game')
      .set('Cookie', ['gameId=10'])
      .expect('location', '/')
      .expect(302, done);
  });
  it('should render gamepage given gameId cookie is valid', function(done) {
    request(app)
      .get('/game')
      .set('Cookie', [`gameId=${gameID}`])
      .expect(/game-container/)
      .expect(200, done);
  });
});
