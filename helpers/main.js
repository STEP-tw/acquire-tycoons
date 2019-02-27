const initialMerge = require('./initialMerger.js');
const merge_small_big_test = require('./merge_small_big_test.js');
const merge_same_size_corp = require('./merge_same_size_corp.js');

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

const randomGenerator = function(array){
  let index = -1;
  return function(length){
    index++;
    if (array[index] != undefined) { return array[index]; }
    return Math.floor(Math.random() * length);
  };
};
const initialMerger = () => runGame(randomGenerator(initialMerge.array), initialMerge.processes);
const merger_small_big_test = () => runGame(randomGenerator(merge_small_big_test.array), merge_small_big_test.processes);
const merger_same_size_corp = () => runGame(randomGenerator(merge_same_size_corp.array),merge_same_size_corp.processes);

module.exports = {
  initialMerger,
  merger_small_big_test,
  merger_same_size_corp
};