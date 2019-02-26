class Corporation {
  constructor(name, level) {
    this.name = name;
    this.tiles = [];
    this.availableStocks = 25;
    this.level = level;
  }

  isActive() {
    return this.tiles.length != 0;
  }

  getSize() {
    return this.tiles.length;
  }

  concatTiles(tiles) {
    this.tiles = this.tiles.concat(tiles);
  }

  getMajority() {
    const size = this.getSize();
    return this.level.getMajority(size);
  }

  getMinority() {
    const size = this.getSize();
    return this.level.getMinority(size);
  }

  getStatus() {
    return this.tiles.length != 0;
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

  addStocks(noOfStocks) {
    this.availableStocks += noOfStocks;
  }

  deductStocks(noOfStocks) {
    this.availableStocks -= noOfStocks;
  }

  getTiles() {
    return this.tiles;
  }

  doesContains(placedTile) {
    return this.tiles.some(tile => tile.position == placedTile.position);
  }

  resetTiles(){
    this.tiles = [];
  }
}

module.exports = Corporation;
