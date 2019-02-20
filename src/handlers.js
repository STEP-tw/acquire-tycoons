const Game = require('./models/game');
const Player = require('./models/player');
const { initializeGame } = require('./util.js');
const { ActivityLog } = require('./models/log');

const fetchLog = function(req, res) {
  let { gameId } = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  let logs = game.activityLog.getLogs();
  res.send(logs);
};

const hostGame = function(req, res) {
  let { host, totalPlayers } = req.body;
  let game = new Game(totalPlayers, res.app.random, new ActivityLog());
  let hostPlayer = new Player(host);
  let playerId = game.addPlayer(hostPlayer);
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

  const player = new Player(playerName);
  let playerId = game.addPlayer(player);
  res.cookie('gameId', `${gameID}`);
  res.cookie('playerId', `${playerId}`);
  res.send({ error: false, message: '' });
  if (game.isFull()) {
    initializeGame(game);
  }
};

const getGameStatus = function(req, res) {
  let { gameId } = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  let gameStatus = game.isFull();
  let totalJoinedPlayers = game.getPlayersCount();
  res.send({ isStarted: gameStatus, totalJoinedPlayers });
};

const renderGamePage = function(req, res) {
  const { gameId } = req.cookies;
  if (!res.app.gameManager.doesGameExist(gameId)) {
    res.redirect('/');
    return;
  }
  res.render('game.html', { gameId });
};

const serveGameData = function(req, res) {
  const { gameId, playerId } = req.cookies;
  const game = res.app.gameManager.getGameById(gameId);
  const gameData = game.getDetails(playerId);
  res.send(gameData);
};

const placeTile = function(req, res) {
  let { tileValue } = req.body;
  let { gameId, playerId } = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  if (!game) {
    return res.send({ error: true, message: `No Such Game with ID ${gameId}` });
  }
  const player = game.getPlayerById(playerId);
  const tile = player.findTileByValue(tileValue);
  game.placeTile(tile);
  player.removeTile(tile.getPosition());
  player.updateLog(`You placed tile on ${tileValue}`);
  game
    .getActivityLog()
    .addLog(`${player.getName()} placed tile ${tileValue} on board`);
  res.send({ error: false, message: '' });
};

module.exports = {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  fetchLog,
  serveGameData,
  placeTile
};
