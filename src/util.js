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
  const foundingTile = corporation.getFoundingTile();
  return corporation.getTiles().map(tile => {
    return {
      id: tile.getValue(),
      corporation: name,
      isFoundingTile: foundingTile == tile
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

const createError = function(error, message) {
  return { error, message };
};

const createTrueError = createError.bind(null, true);
const createFalseError = createError.bind(null, false, '');

const createReplaceLog = function(unPlayableTiles, newTiles) {
  const unPlayableTileValues = unPlayableTiles
    .map(tile => tile.getValue())
    .join(',');
  const newTileValues = newTiles.map(tile => tile.getValue()).join(',');
  const log = `Your unplayable tiles ${unPlayableTileValues} are replaced with ${newTileValues}`;
  return log;
};

const getStatusLog = function(
  sellCount,
  tradeCount,
  totalDefunctStocks,
  currentPriceOfDefunctStock,
  survivingCorporationName
) {
  const gettingStocksAfterTrading = tradeCount / 2;
  const sellingStocksMoney = sellCount * currentPriceOfDefunctStock;
  const holdCount = totalDefunctStocks - (sellCount + tradeCount);

  let firstAnd = 'and ';
  let secondAnd = 'and ';

  let sellingMsg = `got $${sellingStocksMoney}`;

  let singularPluralChar = gettingStocksAfterTrading > 1 ? 's' : '';

  let tradingMsg = `got ${gettingStocksAfterTrading} stock${singularPluralChar} of ${survivingCorporationName}`;

  singularPluralChar = holdCount > 1 ? 's' : '';

  let holdingMsg = `held ${holdCount} stock${singularPluralChar}`;

  let messages = updateMsg(sellingMsg, firstAnd, sellCount);
  sellingMsg = messages.msg;
  firstAnd = messages.andMsg;

  messages = updateMsg(tradingMsg, secondAnd, gettingStocksAfterTrading);
  tradingMsg = messages.msg;
  secondAnd = messages.andMsg;

  messages = updateMsg(holdingMsg, secondAnd, holdCount);
  holdingMsg = messages.msg;
  secondAnd = messages.andMsg;

  if (gettingStocksAfterTrading == 0 && holdCount == 0) {
    firstAnd = '';
  }

  return `You ${sellingMsg} ${firstAnd}${tradingMsg} ${secondAnd}${holdingMsg}`;
};

const updateMsg = function(msg, andMsg, count) {
  if (count == 0) {
    msg = '';
    andMsg = '';
  }
  return { msg, andMsg };
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
  getStocksCount,
  createTrueError,
  createFalseError,
  createReplaceLog,
  getStatusLog
};
