const Tile = require('./models/tile.js');
const FaceDownCluster = require('./models/face_down_cluster.js');
const Level = require('./models/level.js');
const Corporation = require('./models/corporation.js');

const corporationsData = require('./data/corporations_data.json');
const tilesData = require('./data/tiles_data.json');
const levelsData = require('./data/level_data.json');

const random = function(length) {
  return Math.floor(Math.random() * length);
};

const getCorporations = function(corporationsData, levelsData) {
  return corporationsData.map(corporationData => {
    return createCorporationInstance(corporationData, levelsData);
  });
};

const getTileWithCorporationName = function(corporation) {
  const name = corporation.getName();
  return corporation.getTiles().map(tile => {
    return {
      id: tile.getValue(),
      corporation: name
    };
  });
};

const getFaceDownCluster = function(tilesData) {
  const tiles = tilesData.map(({ position, value }) => {
    return new Tile(position, value);
  });
  return new FaceDownCluster(tiles);
};

const initializeGame = function(game) {
  const corporations = getCorporations(corporationsData, levelsData);
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

const distributeReward = function(stockHolders, reward) {
  stockHolders.forEach(stockHolder => stockHolder.addMoney(reward));
};

const getStockHoldersByCount = function(
  corporationName,
  stockHolders,
  stocksCount
) {
  return stockHolders.filter(
    stockHolder => stockHolder.getStocksOf(corporationName) == stocksCount
  );
};

const getStocksCount = function(corporationName, stockHolder) {
  return stockHolder.getStocksOf(corporationName);
};

module.exports = {
  random,
  initializeGame,
  getFaceDownCluster,
  getCorporations,
  createCorporationInstance,
  flatPosition,
  buyStocks,
  getCorporationData,
  getTileWithCorporationName,
  getStockHoldersByCount,
  distributeReward,
  getStocksCount
};
