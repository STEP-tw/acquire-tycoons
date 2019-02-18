const Game = require('./models/game');
const Player = require('./models/player');

const hostGame = function(req, res) {
  let {host, totalPlayers} = req.body;
  let game = new Game(totalPlayers);
  let hostPlayer = new Player(host);
  game.addPlayer(hostPlayer);
  res.app.gameManager.addGame(game);
  let gameId = res.app.gameManager.getLatestId();
  res.send(JSON.stringify({gameId}), 200);
};

module.exports = {hostGame};
