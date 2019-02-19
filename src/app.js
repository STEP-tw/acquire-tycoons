const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const morgan = require('morgan');
const {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  serveGameData
} = require('./handlers');
const GameManager = require('./models/game_manager');

const app = express();
app.gameManager = new GameManager();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(cookieParser());
app.use(morgan('short'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.get('/game', renderGamePage);
app.post('/join-game', joinGame);
app.get('/game-data', serveGameData);
app.post('/host-game', hostGame);
app.get('/game-status', getGameStatus);
app.use(express.static('public'));

module.exports = app;
