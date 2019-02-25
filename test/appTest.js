/*eslint-disable */

const request = require('supertest');
const GameManager = require('../src/models/game_manager.js');
const Game = require('../src/models/game.js');
const Player = require('../src/models/player.js');
const Tile = require('../src/models/tile.js');
const ActivityLog = require('../src/models/activity_log.js');
const sinon = require('sinon');
const { expect } = require('chai');
const { initializeGame } = require('../src/util.js');

const app = require('../src/app.js');

const mockedDate = sinon.useFakeTimers().Date;
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
    const game = new Game(3, random, new ActivityLog(mockedDate));
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
    const game = new Game(3, () => 0, new ActivityLog(mockedDate));
    const hostId = game.getNextPlayerId();
    const host = new Player('Arnab', hostId);
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

  it('should render gamepage with `waiting to join all players` message when game is not yet started', function(done) {
    request(app)
      .get('/game')
      .set('Cookie', [`gameId=${gameID}`])
      .expect(/Waiting for/)
      .expect(200, done);
  });

  it('should render gamepage with `Loading game` message when game is already started', function(done) {
    const game = app.gameManager.getGameById(gameID);
    const player2Id = game.getNextPlayerId();
    const player2 = new Player('Dheeraj', player2Id);
    const player3Id = game.getNextPlayerId();
    const player3 = new Player('Suman', player3Id);
    game.addPlayer(player2);
    game.addPlayer(player3);
    initializeGame(game);
    request(app)
      .get('/game')
      .set('Cookie', [`gameId=${gameID}`])
      .expect(/Loading/)
      .expect(200, done);
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
    const game = new Game(3, random, new ActivityLog(mockedDate));
    const host = new Player('Arnab', 1);
    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();
  });

  it('should send game data', function(done) {
    const game = app.gameManager.getGameById(1);
    const player2 = new Player('Dheeraj', 2);
    game.addPlayer(player2);
    const player3 = new Player('Srushti', 3);
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
    let playerId;
    beforeEach(function() {
      app.gameManager = new GameManager();
      const game = new Game(3, null, new ActivityLog(mockedDate));
      playerId = game.getNextPlayerId();
      const host = new Player('Dheeraj', playerId);
      game.addPlayer(host);
      app.gameManager.addGame(game);
      game.activityLog.addLog('You got 6000rs');
      gameID = app.gameManager.getLatestId();
    });

    it('should fetch all the logs from the activty log', function(done) {
      request(app)
        .get('/log')
        .set('Cookie', [`gameId=${gameID}; playerId=${playerId}`])
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect([
          { log: 'You got 6000rs', timeStamp: '1970-01-01T00:00:00.000Z' }
        ])
        .expect(200, done);
    });
    it('should fetch all the logs from the activty log', function(done) {
      request(app)
        .get('/log')
        .set('Cookie', [`gameId=${gameID}; playerId=1`])
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect({ error: true, message: 'No Such Player with ID 1' })
        .expect(200, done);
    });
  });
});

describe('GET /place-tile', function() {
  let gameID, firstTileOfHost, game, player2;
  beforeEach(function() {
    const random = () => 0;
    app.gameManager = new GameManager();
    game = new Game(3, random, new ActivityLog(mockedDate));

    const host = new Player('Arnab', 0);
    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();

    player2 = new Player('Dheeraj', 1);
    game.addPlayer(player2);
    const player3 = new Player('Srushti', 2);
    game.addPlayer(player3);

    initializeGame(game);
    firstTileOfHost = host.tiles[0];
  });

  it('should provide error when gameId cookie is not valid', function(done) {
    request(app)
      .post('/place-tile')
      .set('Cookie', ['gameId=12;playerId=1'])
      .send({ tileValue: firstTileOfHost.getValue() })
      .expect({ error: true, message: 'No Such Game with ID 12' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it('should provide error message when tile is not valid', function(done) {
    request(app)
      .post('/place-tile')
      .set('Cookie', [`gameId=${gameID}`, `playerId=0`])
      .send({ tileValue: '12B' })
      .expect({ error: true, message: "You don't have 12B tile" })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it('should provide error when gameId cookie is not valid', function(done) {
    request(app)
      .post('/place-tile')
      .set('Cookie', [`gameId=${gameID}`, 'playerId=1'])
      .send({ tileValue: player2.tiles[5].getValue() })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it('should not provide error when gameId cookie is valid, given tile is unIncorporatedTile', function(done) {
    game.changeTurn();
    request(app)
      .post('/place-tile')
      .set('Cookie', [`gameId=${gameID}`, 'playerId=1'])
      .send({ tileValue: player2.tiles[0].getValue() })
      .expect('{"error":false,"message":""}')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it('should not provide error when gameId cookie is valid, given tile can grow corporation', function(done) {
    const tile1 = new Tile({ row: 2, column: 1 }, '2C');
    const tile2 = new Tile({ row: 3, column: 1 }, '2D');
    game.corporations[0].addTile(tile1);
    game.corporations[0].addTile(tile2);
    request(app)
      .post('/place-tile')
      .set('Cookie', [`gameId=${gameID}`, 'playerId=1'])
      .send({ tileValue: player2.tiles[4].getValue() })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it("should provide error when playerId cookie doesn't match with current player id", function(done) {
    request(app)
      .post('/place-tile')
      .set('Cookie', [`gameId=${gameID};playerId=2`])
      .send({ tileValue: '5A' })
      .expect({ error: true, message: "It's not your turn" })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });
});

describe('POST /establish-corporation', function() {
  let gameID, game;
  beforeEach(function() {
    const random = () => 0;
    app.gameManager = new GameManager();
    game = new Game(3, random, new ActivityLog(mockedDate));
    const host = new Player('Arnab', 0);

    game.addPlayer(host);
    app.gameManager.addGame(game);
    gameID = app.gameManager.getLatestId();

    const player2 = new Player('Dheeraj', 1);
    game.addPlayer(player2);
    const player3 = new Player('Srushti', 2);
    game.addPlayer(player3);

    initializeGame(game);
    game.turnManager.addStack(
      'placedTile',
      new Tile({ row: 0, column: 4 }, '5A')
    );
    game.turnManager.addStack('adjacentTile', [
      new Tile({ row: 0, column: 0 }, '1A'),
      new Tile({ row: 0, column: 1 }, '2A'),
      new Tile({ row: 0, column: 2 }, '3A'),
      new Tile({ row: 0, column: 3 }, '4A'),
      new Tile({ row: 0, column: 5 }, '6A')
    ]);
  });

  it('should provide gameData to establish selected corporation', function(done) {
    request(app)
      .post('/establish-corporation')
      .set('Cookie', [`gameId=${gameID}`, 'playerId=0'])
      .send({ corporationName: 'Sackson' })
      .expect(200, done);
  });
});
