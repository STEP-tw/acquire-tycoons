const merger_big_small = require('./merger_big_small.js');
const merger_small_big = require('./merger_small_big_test.js');
// const merger_same_size_corp = require('./merger_same_size_corp.js');
// const merger_two_corp = require("./merger_two_corp.js");

const Game = require('../src/models/game.js');
const ActivityLog = require('../src/models/activity_log.js');
const Player = require('../src/models/player.js');
const initialiseGame = require('../src/util.js').initializeGame;

const addPlayers = function(game) {
  game.addPlayer(new Player('dheeraj', 0));
  game.addPlayer(new Player('swagata', 1));
  game.addPlayer(new Player('arnab', 2));
  game.addPlayer(new Player('gayatri', 3));
};

const runGame = function(random, processes) {
  const game = new Game(4, random, new ActivityLog(Date));
  addPlayers(game);
  initialiseGame(game);
  processes.forEach(process => {
    game[process.id](process.data);
  });
  return game;
};

const randomGenerator = function(array) {
  let index = -1;
  return function(length) {
    index++;
    if (array[index] != undefined) {
      return array[index];
    }
    return Math.floor(Math.random() * length);
  };
};
const merger_big_small_test = () =>
  runGame(randomGenerator(merger_big_small.array), merger_big_small.processes);
const merger_small_big_test = () =>
  runGame(randomGenerator(merger_small_big.array), merger_small_big.processes);

module.exports = {
  merger_big_small_test,
  merger_small_big_test
};
