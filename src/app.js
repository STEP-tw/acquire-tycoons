const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const GameManager = require('./models/game_manager');
app.gameManager = new GameManager();
const {hostGame} = require('./handlers');

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.post('/host-game', hostGame);
app.use(express.static('public'));

module.exports = app;
