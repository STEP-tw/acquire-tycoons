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
    return tiles.filter(tile => tile !== undefined);
  }

  getInitialTiles() {
    const tiles = this.getNRandomTiles(this.getNextPlayerId());
    this.uninCorporatedTiles = tiles;
    for (let index in tiles) {
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

  initiateTurnManager() {
    const orderedPlayerIds = this.players.map(player => player.getId());
    this.turnManager = new TurnManager(orderedPlayerIds);
    this.turnManager.changeAction({ name: 'PLACE_A_TILE', data: {} });
  }

  updateTurnLog() {
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.updateLog(`It's your turn`);
    this.activityLog.addLog(`It's ${currentPlayer.getName()}'s turn`);
  }

  initialize(corporations, faceDownCluster) {
    this.faceDownCluster = faceDownCluster;
    this.corporations = corporations;
    this.getInitialTiles();
    this.getInitialTilesForPlayer();
    this.orderPlayer();
    this.initiateTurnManager();
    this.updateTurnLog();
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

  isCurrentPlayer(id) {
    return this.turnManager.isCurrentPlayer(id);
  }

  getPlayerDetails(playerId) {
    const player = this.getPlayerById(playerId);
    return player.getDetails();
  }

  placeTile(tile) {
    this.uninCorporatedTiles.push(tile);
  }

  getLastTile() {
    return this.uninCorporatedTiles[this.uninCorporatedTiles.length - 1];
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

  getCurrentPlayer() {
    const currentPlayerIndex = this.turnManager.getCurrentPlayerIndex();
    return this.players[currentPlayerIndex];
  }

  provideNewTile() {
    const newTile = this.getRandomTile();
    const currentPlayer = this.getCurrentPlayer();
    if (newTile) {
      currentPlayer.addTile(newTile);
      this.activityLog.addLog(`${currentPlayer.getName()} got a new tile`);
      currentPlayer.updateLog(`You got ${newTile.getValue()} tile`);
    }
  }

  changeTurn() {
    this.provideNewTile();
    this.turnManager.changeTurn();
    this.turnManager.changeAction({ name: 'PLACE_A_TILE', data: {} });
    this.updateTurnLog();
  }

  getDetails(playerId) {
    const board = this.generateBoard();
    const corporations = this.getCorporationsDetail();
    const players = this.getTurnData();
    const player = this.getPlayerDetails(playerId);
    const action = this.turnManager.getAction(playerId);
    const lastPlacedTileId = this.getLastTile().getValue();
    return { board, corporations, players, player, action, lastPlacedTileId };
  }
}

module.exports = Game;
