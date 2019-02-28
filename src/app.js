const express = require('express');
const cookieParser = require('cookie-parser');
const {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  serveGameData,
  placeTile,
  validateGameSession,
  validateTurn,
  establishCorporation,
  buyStocks
} = require('./handlers');
const GameManager = require('./models/game_manager');
const { random } = require('./util.js');
const morgan = require('morgan');

const app = express();
app.gameManager = new GameManager();
app.random = random;
app.urlsToValidateGame = [
  '/game-status',
  '/place-tile',
  '/game-data',
  '/log',
  '/establish-corporation',
  '/confirm-buy'
];
app.urlsToValidateTurn = [
  '/place-tile',
  '/establish-corporation',
  '/confirm-buy'
];
app.set('view engine', 'ejs');
morgan.token('cookies', function (req) { return req.headers['cookie']; });
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.cookies(req,res)
  ].join(' ');
}));
app.use(express.json());
app.use(validateGameSession);
app.use(validateTurn);
app.get('/game', renderGamePage);
app.post('/join-game', joinGame);
app.post('/host-game', hostGame);
app.post('/place-tile', placeTile);
app.get('/game-status', getGameStatus);
app.get('/game-data', serveGameData);
app.post('/establish-corporation', establishCorporation);
app.post('/confirm-buy', buyStocks);
app.use(express.static('public'));

module.exports = app;
