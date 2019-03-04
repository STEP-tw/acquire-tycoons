class Player {
  constructor(name, id) {
    this.id = id;
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
    this.log = 'Welcome ' + this.name;
    this.initialTile = '';
  }

  getLog() {
    return this.log;
  }

  setInitialTile(tile) {
    this.initialTile = tile;
  }

  getId() {
    return this.id;
  }

  isSame(id) {
    return this.id == id;
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  findTile(position) {
    return this.tiles.findIndex(tile => tile.isSamePosition(position));
  }

  findTileByValue(value) {
    return this.tiles.find(tile => tile.isSameValue(value));
  }

  removeTile(position) {
    const tileIndex = this.findTile(position);
    this.tiles.splice(tileIndex, 1);
  }

  updateLog(newLog) {
    this.log = newLog;
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

  addStocks({ name, numberOfStock }) {
    this.stocks[name] += numberOfStock;
  }

  deductStocks(name, numberOfStock) {
    this.stocks[name] -= numberOfStock;
  }

  getStocks() {
    return this.stocks;
  }

  getStockDetails() {
    const stocks = Object.keys(this.stocks).map(name => {
      const value = this.stocks[name];
      return { name, value };
    });
    return stocks.filter(stock => stock.value != 0);
  }

  getName() {
    return this.name;
  }

  getDetails() {
    const name = this.name;
    const money = this.money;
    const stocks = this.getStockDetails();
    const tiles = this.tiles.map(tile => tile.getValue());
    const status = this.log;
    return { name, money, stocks, tiles, status };
  }

  hasStocksOf(corporationName) {
    return this.stocks[corporationName] > 0;
  }

  sellStocks(corporation, numberOfStocks) {
    this.stocks[corporation.getName()] -= numberOfStocks;
    const sellingPrice = numberOfStocks * corporation.getCurrentStockPrice();
    corporation.addStocks(numberOfStocks);
    this.addMoney(sellingPrice);
  }

  sellAllStocks(corporation) {
    this.sellStocks(corporation, this.stocks[corporation.getName()]);
  }

  getStocksOf(corporationName) {
    return this.stocks[corporationName];
  }

  tradeStocks(survivingCorporationName, defunctCorporationName, numberOfStocks) {
    this.stocks[survivingCorporationName] += numberOfStocks / 2;
    this.stocks[defunctCorporationName] -= numberOfStocks;
  }
}

module.exports = Player;
