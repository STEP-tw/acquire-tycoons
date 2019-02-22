class Corporation {
  constructor(name, level) {
    this.name = name;
    this.tiles = [];
    this.availableStocks = 25;
    this.isFound = false;
    this.level = level;
  }

  toggleFound() {
    this.isFound = true;
  }

  getFoundStatus() {
    return this.isFound;
  }

  getSize() {
    return this.tiles.length;
  }

  deductStocks(noOfStocks) {
    this.availableStocks -= noOfStocks;
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

  doesContains(placedTile) {
    return this.tiles.some(tile => tile.position == placedTile.position);
  }
}

module.exports = Corporation;
