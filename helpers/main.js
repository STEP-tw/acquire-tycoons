const merge = require('./merger.js');
const merge_small_big = require('./merge_small_big.js');

const Game = require('../src/models/game.js');
const ActivityLog = require('../src/models/activity_log.js');
const Player = require('../src/models/player.js');
const initialiseGame = require('../src/util.js').initializeGame;

const addPlayers = function (game) {
  game.addPlayer(new Player('dheeraj', 0));
  game.addPlayer(new Player('swagata', 1));
  game.addPlayer(new Player('arnab', 2));
  game.addPlayer(new Player('gayatri', 3));
};

const runGame = function (random, processes) {
  const game = new Game(4, random, new ActivityLog(Date));
  addPlayers(game);
  initialiseGame(game);
  processes.forEach(process => {
    game[process.id](process.data);
  });
  return game;
};

const merger = () => runGame(merge.random(), merge.processes);
const merger_small_big = () => runGame(merge_small_big.random(), merge_small_big.processes);

module.exports = {
  merger,
  merger_small_big
};