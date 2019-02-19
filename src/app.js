const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  serveGameData,
  addUtility
} = require('./handlers');
const GameManager = require('./models/game_manager');
const { random } = require('./util.js');
const requiredFunctions = {
  random: random
};

const app = express();
app.gameManager = new GameManager();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.random = random;
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/game', renderGamePage);
app.use(addUtility.bind(null, requiredFunctions));
app.post('/join-game', joinGame);
app.get('/game-data', serveGameData);
app.post('/host-game', hostGame);
app.get('/game-status', getGameStatus);
app.use(express.static('public'));

module.exports = app;
