const Game = require('./models/game');
const Player = require('./models/player');

const hostGame = function(req, res) {
  let {host, totalPlayers} = req.body;
  let game = new Game(totalPlayers);
  let hostPlayer = new Player(host);
  let playerId = game.addPlayer(hostPlayer);
  res.app.gameManager.addGame(game);
  let gameId = res.app.gameManager.getLatestId();
  res.cookie('gameId', `${gameId}`);
  res.cookie('playerId', `${playerId}`);
  res.send({gameId});
};

const joinGame = function(req, res) {
  const {gameID, playerName} = req.body;
  const {gameManager} = res.app;

  if (!gameManager.doesGameExist(gameID)) {
    res.send({error: true, message: `No Such Game with ID ${gameID}`});
    return;
  }

  const game = gameManager.getGameById(gameID);

  if (game.isFull()) {
    res.send({error: true, message: 'Sorry! Game has already started.'});
    return;
  }

  const player = new Player(playerName);
  let playerId = game.addPlayer(player);
  res.cookie('gameId', `${gameID}`);
  res.cookie('playerId', `${playerId}`);
  res.send({error: false, message: ''});
};

const getGameStatus = function(req, res) {
  let {gameId} = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  let gameStatus = game.isFull();
  let totalJoinedPlayers = game.getPlayersCount();
  res.send({isStarted: gameStatus, totalJoinedPlayers});
};

module.exports = {hostGame, joinGame, getGameStatus};
