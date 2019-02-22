const Tile = require('./models/tile.js');
const FaceDownCluster = require('./models/face_down_cluster.js');
const corpoarationsData = require('./data/corporations_data.json');
const levelsData = require('./data/level_data.json');
const tilesData = require('./data/tiles_data.json');
const Level = require('./models/level.js');
const Corporation = require('./models/corporation.js');

const random = function(length) {
  return Math.floor(Math.random() * length);
};

const getCorporations = function(corpoarationsData, levelsData) {
  return corpoarationsData.map(corpoarationData => {
    return createCorporationInstance(corpoarationData, levelsData);
  });
};

const getFaceDownCluster = function(tilesData) {
  const tiles = tilesData.map(({ position, value }) => {
    return new Tile(position, value);
  });
  return new FaceDownCluster(tiles);
};

const initializeGame = function(game) {
  const corporations = getCorporations(corpoarationsData, levelsData);
  const faceDownCluster = getFaceDownCluster(tilesData);
  game.initialize(corporations, faceDownCluster);
};

const getLevelName = function(levelId) {
  return 'level-' + levelId;
};

const getLevelData = function(levelsData, levelId) {
  const levelName = getLevelName(levelId);
  return levelsData[levelName];
};

const createCorporationInstance = function({ name, levelId }, levelsData) {
  const levelData = getLevelData(levelsData, levelId);
  const level = new Level(levelData);
  return new Corporation(name, level);
};

const flatPosition = function(position) {
  return position.row * 12 + position.column;
};

const buyStocks = function(player, corporation, noOfStocks) {
  const currentPrice = corporation.getCurrentStockPrice();
  const moneyToDeduct = noOfStocks * currentPrice;
  player.deductMoney(moneyToDeduct);
  player.addStocks({ name: corporation.getName(), numberOfStock: noOfStocks });
  corporation.deductStocks(noOfStocks);
};

const getCorporationData = function(corporation) {
  return {
    name: corporation.getName(),
    currentPrice: corporation.getCurrentStockPrice(),
    stocks: corporation.getStocks()
  };
};

module.exports = {
  random,
  initializeGame,
  getFaceDownCluster,
  getCorporations,
  createCorporationInstance,
  flatPosition,
  buyStocks,
  getCorporationData
};
