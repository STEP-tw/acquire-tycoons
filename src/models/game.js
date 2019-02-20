class Game {
  constructor(maxPlayers, random, activityLog) {
    this.maxPlayers = maxPlayers;
    this.random = random;
    this.players = {};
    this.latestPlayerId = 0;
    this.corporations;
    this.faceDownCluster;
    this.uninCorporatedTiles = [];
    this.isStarted = false;
    this.activityLog = activityLog;
  }

  addPlayer(player) {
    this.latestPlayerId += 1;
    this.players[this.latestPlayerId] = player;
    return this.latestPlayerId;
  }

  getRandomTile() {
    const clusterStrength = this.faceDownCluster.getStrength();
    const randomIndexOfTile = this.random(clusterStrength);
    return this.faceDownCluster.getTile(randomIndexOfTile);
  }

  getNRandomTiles(numberOfTiles) {
    const tiles = [];
    for (let index = 0; index < numberOfTiles; index++) {
      const tile = this.getRandomTile();
      tiles.push(tile);
    }
    return tiles;
  }

  getInitialTiles() {
    this.uninCorporatedTiles = this.getNRandomTiles(this.latestPlayerId);
  }

  getInitialTilesForPlayer() {
    Object.keys(this.players).forEach(player => {
      const tiles = this.getNRandomTiles(6);
      tiles.forEach(tile => this.players[player].addTile(tile));
    });
  }

  initialize(corporations, faceDownCluster) {
    this.faceDownCluster = faceDownCluster;
    this.corporations = corporations;
    this.getInitialTiles();
    this.getInitialTilesForPlayer();
    this.isStarted = true;
  }

  getPlayersCount() {
    return Object.keys(this.players).length;
  }

  getUnincorporatedTiles() {
    return this.uninCorporatedTiles;
  }

  isFull() {
    return this.getPlayersCount() == this.maxPlayers;
  }

  getGameStatus() {
    return this.isStarted;
  }

  getTurnData() {
    const playerNames = Object.keys(this.players).map(playerId =>
      this.players[playerId].getName()
    );
    return {
      playerNames,
      currPlayerIndex: 0
    };
  }

  getCorporationsDetail() {
    const corporationsDetail = this.corporations.map(corporation => {
      return {
        name: corporation.getName(),
        size: corporation.getSize(),
        marketPrice: corporation.getCurrentStockPrice(),
        availableStocks: corporation.getStocks()
      };
    });
    return corporationsDetail;
  }

  getPlayerDetails(playerId) {
    return this.players[playerId].getDetails();
  }

  generateBoard() {
    const corporationsDetail = this.corporations.reduce(
      (initial, corporation) => initial.concat(corporation.getTiles()),
      []
    );
    const uninCorporatedDetail = this.uninCorporatedTiles.map(tile => {
      const corporation = 'unincorporated';
      return {
        id: tile.getValue(),
        corporation
      };
    });
    return corporationsDetail.concat(uninCorporatedDetail);
  }

  getDetails(playerId) {
    const board = this.generateBoard();
    const corporations = this.getCorporationsDetail();
    const players = this.getTurnData();
    const player = this.getPlayerDetails(playerId);
    return { board, corporations, players, player };
  }
}

module.exports = { Game };
