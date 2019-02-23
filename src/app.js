const express = require('express');
const cookieParser = require('cookie-parser');
const {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  fetchLog,
  serveGameData,
  placeTile,
  validateGameSession,
  validateTurn,
  establishCorporation,
  buyStocks
} = require('./handlers');
const GameManager = require('./models/game_manager');
const { random } = require('./util.js');

const app = express();
app.gameManager = new GameManager();
app.random = random;
app.urlsToValidateGame = [
  '/game-status',
  '/place-tile',
  '/game-data',
  '/log',
  '/establish-corporation'
];
app.urlsToValidateTurn = ['/place-tile', '/establish-corporation'];
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(req.url);
  // eslint-disable-next-line no-console
  console.log(req.cookies);
  next();
});
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
app.post('/establish-corporation', establishCorporation);
app.post('/confirm-buy', buyStocks);
app.use(express.static('public'));

module.exports = app;
