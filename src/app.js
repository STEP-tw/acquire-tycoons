const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  fetchLog,
  serveGameData,
  placeTile,
  validateGameSession,
  validateTurn
} = require('./handlers');
const GameManager = require('./models/game_manager');
const { random } = require('./util.js');

const app = express();
app.gameManager = new GameManager();
app.random = random;
app.urlsToValidateGame = ['/game-status', '/place-tile', '/game-data', '/log'];
app.urlsToValidateTurn = ['/place-tile'];
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(validateGameSession);
app.use(validateTurn);
app.get('/game', renderGamePage);
app.post('/join-game', joinGame);
app.post('/host-game', hostGame);
app.post('/place-tile', placeTile);
app.get('/game-status', getGameStatus);
app.get('/log', fetchLog);
app.get('/game-data', serveGameData);
app.use(express.static('public'));

module.exports = app;
