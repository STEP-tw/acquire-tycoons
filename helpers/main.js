const mergerBigSmall = require('./merger_big_small.js');
const mergerSmallBig = require('./merger_small_big.js');
const merger2SameSizeCorp = require('./merger_2_same_size_corp.js');
const generateIndexes = require('./util.js');
// const merger_of_3corps = require('./merger_of_3corps.js');
const merger4SameSize = require('./merger_4_same_size.js');

const replaceUnplayableTiles = require('./replace_unplayable_tiles');

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

const randomGenerator = function(values) {
  const array = generateIndexes(values);
  let index = -1;
  return function(length) {
    index++;
    if (array[index] != undefined) {
      return array[index];
    }
    return Math.floor(Math.random() * length);
  };
};

const mergerBigSmallTest = () =>
  runGame(randomGenerator(mergerBigSmall.array), mergerBigSmall.processes);
const mergerSmallBigTest = () =>
  runGame(randomGenerator(mergerSmallBig.array), mergerSmallBig.processes);
const merger2SameSizeCorpTest = () =>
  runGame(
    randomGenerator(merger2SameSizeCorp.array),
    merger2SameSizeCorp.processes
  );
// const merger3CorpTest = () =>
//   runGame(randomGenerator(merger_of_3corps.array), merger_of_3corps.processes);
const merger4SameSizeCorpTest = () =>
  runGame(randomGenerator(merger4SameSize.array), merger4SameSize.processes);
const replaceUnplayableTilesTest = () =>
  runGame(
    randomGenerator(replaceUnplayableTiles.array),
    replaceUnplayableTiles.processes
  );

module.exports = {
  mergerBigSmallTest,
  mergerSmallBigTest,
  merger2SameSizeCorpTest,
  merger4SameSizeCorpTest,
  // merger3CorpTest,
  replaceUnplayableTilesTest
};
