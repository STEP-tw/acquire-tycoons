const request = require('supertest');
const GameManager = require('../src/models/game_manager');
const { Game } = require('../src/models/game');
const { Player } = require('../src/models/player');
const { ActivityLog } = require('../src/models/log');
const { expect } = require('chai');
const { initializeGame } = require('../src/util.js');

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
    const random = () => 0;
    app.gameManager = new GameManager();
    const game = new Game(3, random);
    const host = new Player('Arnab');
    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();
  });

  it('Should add player to game provided correct game and game is not full', function(done) {
    request(app)
      .post('/join-game')
      .send({ playerName: 'Dheeraj', gameID })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({ error: false, message: '' })
      .expect(200, done);
  });

  it('Should provide error message if gameID entered is wrong', function(done) {
    request(app)
      .post('/join-game')
      .send({ playerName: 'Dheeraj', gameID: '10' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({ error: true, message: 'No Such Game with ID 10' })
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
      .send({ playerName: 'Sai', gameID })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({ error: true, message: 'Sorry! Game has already started.' })
      .expect(200, done);
  });

  it('should initialize the game when all players joined game', function(done) {
    request(app)
      .post('/join-game')
      .send({ playerName: 'Sai', gameID })
      .end(() => {
        request(app)
          .post('/join-game')
          .send({ playerName: 'srushti', gameID })
          .end(() => {
            const game = app.gameManager.getGameById(1);
            expect(game.getGameStatus()).true;
            done();
          });
      });
  });
});

describe('POST /host-game', function() {
  it('should return response for the url(( /host-game', function(done) {
    request(app)
      .post('/host-game')
      .send({ host: 'gayatri', totalPlayers: 4 })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });
});

describe('GET /game-status', function() {
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

describe('GET /game-data', function() {
  let gameID;
  beforeEach(function() {
    const random = () => 0;
    app.gameManager = new GameManager();
    const game = new Game(3, random);
    const host = new Player('Arnab');
    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();
  });

  it('should send game data', function(done) {
    const game = app.gameManager.getGameById(1);
    const player2 = new Player('Dheeraj');
    game.addPlayer(player2);
    const player3 = new Player('Srushti');
    game.addPlayer(player3);
    initializeGame(game);

    request(app)
      .get('/game-data')
      .set('Cookie', [`gameId=${gameID}`, 'playerId=1'])
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  describe('GET /log', function() {
    let gameID;
    beforeEach(function() {
      app.gameManager = new GameManager();
      const game = new Game(3, null, new ActivityLog());
      app.gameManager.addGame(game);
      gameID = app.gameManager.getLatestId();
    });

    it('should fetch all the logs from the activty log', function(done) {
      request(app)
        .get('/log')
        .set('Cookie', [`gameId=${gameID}`])
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
  });
});
