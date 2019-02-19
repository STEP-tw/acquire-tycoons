const {getLevel} = require('./data_handler.js');

class Corporation {
  constructor(name, level) {
    this.name = name;
    this.tiles = [];
    this.availableStocks = 25;
    this.isFound = false;
    this.level = level;
  }

  getSize() {
    return this.tiles.length;
  }

  getMajority() {
    const size = this.getSize();
    return this.level.getMajority(size);
  }

  getMinority() {
    const size = this.getSize();
    return this.level.getMinority(size);
  }

  getCurrentStockPrice() {
    const size = this.getSize();
    return this.level.getStockPrice(size);
  }

  getStocks() {
    return this.availableStocks;
  }

  getName() {
    return this.name;
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  getTiles() {
    const name = this.name;
    return this.tiles.map(tile => {
      return {
        id: tile.getValue(),
        corporation: name
      };
    });
  }
}

const getLevelName = function(levelId) {
  return 'level-' + levelId;
};

const getLevelData = function(levelsData, levelId) {
  const levelName = getLevelName(levelId);
  return levelsData[levelName];
};

const createCorporationInstance = function({name, levelId}, levelsData) {
  const levelData = getLevelData(levelsData, levelId);
  const level = getLevel(levelData);
  return new Corporation(name, level);
};

module.exports = {
  createCorporationInstance,
  getLevelData,
  getLevelName,
  Corporation
};
