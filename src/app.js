const express = require('express');
const cookieParser = require('cookie-parser');
const {hostGame, joinGame} = require('./handlers');
const GameManager = require('./models/game_manager');

const app = express();
app.gameManager = new GameManager();

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.post('/join-game', joinGame);
app.post('/host-game', hostGame);
app.use(express.static('public'));

module.exports = app;
