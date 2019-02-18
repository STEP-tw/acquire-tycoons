const Game = require('./models/game');
const Player = require('./models/player');

const hostGame = function(req, res) {
  let {host, totalPlayers} = req.body;
  let game = new Game(totalPlayers);
  let hostPlayer = new Player(host);
  game.addPlayer(hostPlayer);
  res.app.gameManager.addGame(game);
  let gameId = res.app.gameManager.getLatestId();
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
  game.addPlayer(player);
  res.send({error: false, message: ''});
};

module.exports = {hostGame, joinGame};
