const Game = require('./models/game.js');
const Player = require('./models/player.js');
const {
  initializeGame,
  createTrueError,
  createFalseError
} = require('./util.js');
const ActivityLog = require('./models/activity_log');
const { validateGameSession, validateTurn } = require('./validators');
// const requiredFunctionality = require('../helpers/main.js')
//   .merger4SameSizeCorpTest;

const hostGame = function(req, res) {
  let { host, totalPlayers } = req.body;
  let game = new Game(totalPlayers, res.app.random, new ActivityLog(Date));
  let playerId = game.getNextPlayerId();
  let hostPlayer = new Player(host, playerId);
  game.addPlayer(hostPlayer);
  res.app.gameManager.addGame(game);
  let gameId = res.app.gameManager.getLatestId();
  res.cookie('gameId', `${gameId}`);
  res.cookie('playerId', `${playerId}`);
  res.send({ gameId });
};

const joinGame = function(req, res) {
  const { gameID, playerName } = req.body;
  const { gameManager } = res.app;

  if (!gameManager.doesGameExist(gameID)) {
    res.send(createTrueError(`No Such Game with ID ${gameID}`));
    return;
  }

  const game = gameManager.getGameById(gameID);

  if (game.isFull()) {
    res.send(createTrueError('Sorry! Game has already started.'));
    return;
  }

  let playerId = game.getNextPlayerId();
  let player = new Player(playerName, playerId);
  game.addPlayer(player);
  res.cookie('gameId', `${gameID}`);
  res.cookie('playerId', `${playerId}`);
  res.send(createFalseError());
  if (game.isFull()) {
    // gamManager.games[gameID] = requiredFunctionality();
    initializeGame(game);
  }
};

const getGameStatus = function(req, res) {
  let { gameId } = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  let gameStatus = game.isFull();
  const playerNames = game.getPlayers().map(player => player.getName());
  res.send({ isStarted: gameStatus, playerNames });
};

const renderGamePage = function(req, res) {
  const { gameId } = req.cookies;
  if (!res.app.gameManager.doesGameExist(gameId)) {
    res.redirect('/');
    return;
  }
  const game = res.app.gameManager.getGameById(gameId);
  let message = 'Waiting for other players to join';
  if (game.isStarted) {
    message = 'Loading game...';
  }

  res.render('game', { gameId, message });
};

const serveGameData = function(req, res) {
  const { playerId } = req.cookies;
  const { game } = req;
  const gameData = game.getDetails(playerId);
  res.send(gameData);
};

const placeTile = function(req, res) {
  let { tileValue } = req.body;
  let game = req.game;
  const status = game.placeTile(tileValue);
  res.send(status);
};

const establishCorporation = function(req, res) {
  const { corporationName } = req.body;
  const game = req.game;
  game.establishCorporation(corporationName);
  res.end();
};

const buyStocks = function(req, res) {
  const details = req.body;
  const game = req.game;
  game.buyStocks(details);
  res.send(createFalseError());
};

const selectSurvivingCorporation = function(req, res) {
  const { corporationName } = req.body;
  const game = req.game;
  const survivingCorporation = game.getCorporation(corporationName);
  game.continueMerging(survivingCorporation);
  res.send(createFalseError());
};

const selectDefunctCorporation = function(req, res) {
  const { corporationName } = req.body;
  const game = req.game;
  const defunctCorporation = game.getCorporation(corporationName);
  const { survivingCorporation } = game.turnManager.getStack();
  game.mergeCorporations(survivingCorporation, defunctCorporation);
  res.send(createFalseError());
};

const sellAndTradeStocks = function(req, res) {
  const game = req.game;
  game.sellAndTradeStocks(req.body);
  res.send({ error: false, message: '' });
};

module.exports = {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  serveGameData,
  placeTile,
  validateGameSession,
  validateTurn,
  establishCorporation,
  buyStocks,
  selectSurvivingCorporation,
  selectDefunctCorporation,
  sellAndTradeStocks
};
