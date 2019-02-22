const Game = require('./models/game');
const Player = require('./models/player');
const { initializeGame } = require('./util.js');
const ActivityLog = require('./models/log');

const fetchLog = function(req, res) {
  let { gameId } = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  let logs = game.activityLog.getLogs();
  res.send(logs);
};

const hostGame = function(req, res) {
  let { host, totalPlayers } = req.body;
  let game = new Game(totalPlayers, res.app.random, new ActivityLog());
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
    res.send({ error: true, message: `No Such Game with ID ${gameID}` });
    return;
  }

  const game = gameManager.getGameById(gameID);

  if (game.isFull()) {
    res.send({ error: true, message: 'Sorry! Game has already started.' });
    return;
  }

  let playerId = game.getNextPlayerId();
  let player = new Player(playerName, playerId);
  game.addPlayer(player);
  res.cookie('gameId', `${gameID}`);
  res.cookie('playerId', `${playerId}`);
  res.send({ error: false, message: '' });
  if (game.isFull()) {
    initializeGame(game);
  }
};

const validateGameSession = function(req, res, next) {
  if (!res.app.urlsToValidateGame.includes(req.url)) {
    next();
    return;
  }
  const { gameId, playerId } = req.cookies;
  const game = res.app.gameManager.getGameById(gameId);
  if (!game) {
    return res.send({ error: true, message: `No Such Game with ID ${gameId}` });
  }

  const player = game.getPlayerById(playerId);
  if (!player) {
    return res.send({
      error: true,
      message: `No Such Player with ID ${playerId}`
    });
  }

  req.game = game;
  next();
};

const validateTurn = function(req, res, next) {
  if (!res.app.urlsToValidateTurn.includes(req.url)) {
    next();
    return;
  }

  const { playerId } = req.cookies;
  const game = req.game;
  if (!game.isCurrentPlayer(playerId)) {
    return res.send({ error: true, message: 'It\'s not your turn' });
  }
  next();
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
  const { gameId, playerId } = req.cookies;
  const game = res.app.gameManager.getGameById(gameId);
  const gameData = game.getDetails(playerId);
  res.send(gameData);
};

const placeTile = function(req, res) {
  let { tileValue } = req.body;
  let { playerId } = req.cookies;
  let game = req.game;
  const player = game.getPlayerById(playerId);
  const tile = player.findTileByValue(tileValue);
  if (!tile) {
    return res.send({
      error: true,
      message: `You don't have ${tileValue} tile`
    });
  }
  game.placeTile(tile);
  player.removeTile(tile.getPosition());
  player.updateLog(`You placed tile on ${tileValue}`);
  game
    .getActivityLog()
    .addLog(`${player.getName()} placed tile ${tileValue} on board`);
  game.changeTurn();
  res.send({ error: false, message: '' });
};

module.exports = {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  fetchLog,
  serveGameData,
  placeTile,
  validateGameSession,
  validateTurn
};
