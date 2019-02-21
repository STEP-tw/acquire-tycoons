const TurnManager = require('./turn_manager.js');

const flatPosition = function(position) {
  return position.row * 12 + position.column;
};

class Game {
  constructor(maxPlayers, random, activityLog) {
    this.maxPlayers = maxPlayers;
    this.random = random;
    this.players = [];
    this.corporations;
    this.faceDownCluster;
    this.uninCorporatedTiles = [];
    this.isStarted = false;
    this.activityLog = activityLog;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getNextPlayerId() {
    return this.players.length;
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
    const tiles = this.getNRandomTiles(this.getNextPlayerId());
    this.uninCorporatedTiles = tiles;
    for (let index = 0; index < tiles.length; index++) {
      const player = this.players[index];
      const tile = tiles[index];
      player.setInitialTile(tiles[index]);
      this.activityLog.addLog(
        `${player.getName()} got tile ${tile.getValue()}`
      );
    }
  }

  getInitialTilesForPlayer() {
    this.players.forEach(player => {
      const tiles = this.getNRandomTiles(6);
      tiles.forEach(tile => player.addTile(tile));
    });
  }

  orderPlayer() {
    this.players.sort((player1, player2) => {
      const player1Tile = flatPosition(player1.initialTile.position);
      const player2Tile = flatPosition(player2.initialTile.position);
      return player1Tile - player2Tile;
    });
  }

  initialize(corporations, faceDownCluster) {
    this.faceDownCluster = faceDownCluster;
    this.corporations = corporations;
    this.getInitialTiles();
    this.getInitialTilesForPlayer();
    this.orderPlayer();
    const orderedPlayerIds = this.players.map(player => player.getId());
    this.turnManager = new TurnManager(orderedPlayerIds);
    this.turnManager.changeAction({ name: 'PLACE_A_TILE', data: {} });
    this.isStarted = true;
  }

  getUnincorporatedTiles() {
    return this.uninCorporatedTiles;
  }

  isFull() {
    return this.getNextPlayerId() == this.maxPlayers;
  }

  getGameStatus() {
    return this.isStarted;
  }

  getTurnData() {
    const playerNames = this.players.map(player => player.getName());
    const currentPlayerIndex = this.turnManager.getCurrentPlayerIndex();
    return {
      playerNames,
      currentPlayerIndex
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

  getActivityLog() {
    return this.activityLog;
  }

  getPlayerById(id) {
    return this.players.find(player => player.isSame(id));
  }

  getPlayerDetails(playerId) {
    const player = this.getPlayerById(playerId);
    return player.getDetails();
  }

  placeTile(tile) {
    this.uninCorporatedTiles.push(tile);
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

  changeTurn() {
    this.turnManager.changeTurn();
    this.turnManager.changeAction({ name: 'PLACE_A_TILE', data: {} });
  }
  getDetails(playerId) {
    const board = this.generateBoard();
    const corporations = this.getCorporationsDetail();
    const players = this.getTurnData();
    const player = this.getPlayerDetails(playerId);
    const action = this.turnManager.getAction(playerId);
    return { board, corporations, players, player, action };
  }
}

module.exports = Game;
