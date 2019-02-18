const express = require('express');
const cookieParser = require('cookie-parser');
const GameManager = require('./models/game_manager');
const Game = require('./models/game');
const Player = require('./models/player');

const app = express();
app.gameManager = new GameManager();

const game = new Game(4);
const host = new Player('Dheeraj');
game.addPlayer(host);
app.gameManager.addGame(game);

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

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.post('/join-game', joinGame);
app.use(express.static('public'));

module.exports = app;
