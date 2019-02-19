class Player {
  constructor(name) {
    this.name = name;
    this.money = 6000;
    this.tiles = [];
    this.stocks = {
      Phoenix: 0,
      Quantum: 0,
      Fusion: 0,
      Hydra: 0,
      America: 0,
      Zeta: 0,
      Sackson: 0
    };
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  findTile(position) {
    return this.tiles.findIndex(tile => tile.isSamePosition(position));
  }

  removeTile(position) {
    const tileIndex = this.findTile(position);
    this.tiles.splice(tileIndex, 1);
  }

  getTiles() {
    return this.tiles;
  }

  addMoney(money) {
    this.money = this.money + money;
  }

  deductMoney(money) {
    this.money = this.money - money;
  }

  getMoney() {
    return this.money;
  }

  addStocks({name, numberOfStock}) {
    this.stocks[name] += numberOfStock;
  }

  deductStocks({name, numberOfStock}) {
    this.stocks[name] -= numberOfStock;
  }

  getStocks() {
    return this.stocks;
  }
}

module.exports = {Player};
