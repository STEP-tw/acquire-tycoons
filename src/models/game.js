const TurnManager = require('./turn_manager.js');
const { flatPosition, getCorporationData, buyStocks } = require('../util.js');
class Game {
  constructor(maxPlayers, random, activityLog) {
    this.maxPlayers = maxPlayers;
    this.random = random;
    this.players = [];
    this.corporations;
    this.faceDownCluster;
    this.unIncorporatedTiles = [];
    this.isStarted = false;
    this.activityLog = activityLog;
    this.lastPlacedTile = {
      getValue: () => {
        return;
      }
    };
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getNextPlayerId() {
    return this.players.length;
  }

  removeUnIncorporatedTile(tiles) {
    tiles.forEach(tile => {
      this.unIncorporatedTiles = this.unIncorporatedTiles.filter(
        unIncorporatedTile => {
          return unIncorporatedTile.value != tile.value;
        }
      );
    });
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
    this.unIncorporatedTiles = tiles;
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

  getunIncorporatedTiles() {
    return this.unIncorporatedTiles;
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

  getCorporation(name) {
    return this.corporations
      .filter(corporation => corporation.name == name)
      .pop();
  }

  getAdjacent(tile) {
    let adjacentTiles = this.unIncorporatedTiles.filter(unIncorporatedTile =>
      tile.isNeighbour(unIncorporatedTile)
    );
    return adjacentTiles;
  }

  getInActiveCorporations() {
    return this.corporations.filter(corporation => {
      return !corporation.isActive();
    });
  }

  canFoundCorporation() {
    const inActiveCorporations = this.getInActiveCorporations();
    return inActiveCorporations.length > 0;
  }

  isAdjacentTo(tile, corporation) {
    let temp = corporation.tiles.some(incorporatedTile =>
      tile.isNeighbour(incorporatedTile)
    );
    return temp;
  }

  areCorporationsAdjacentTo(tile) {
    let corporationsAdjacent = this.corporations.filter(corporation =>
      this.isAdjacentTo(tile, corporation)
    );
    return corporationsAdjacent;
  }

  getCorporationAdjacentTo(tile) {
    return this.corporations.find(this.isAdjacentTo.bind(null, tile));
  }

  growCorporation(tile) {
    let adjacentUnIncorporatedTiles = this.getAdjacent(tile);
    this.removeUnIncorporatedTile(adjacentUnIncorporatedTiles.concat(tile));
    const corporation = this.getCorporationAdjacentTo(tile);
    corporation.concatTiles(adjacentUnIncorporatedTiles.concat(tile));
  }

  establishCorporation(corporationName) {
    const player = this.getCurrentPlayer();
    const corporation = this.getCorporation(corporationName);
    const stack = this.turnManager.getStack();
    const placedTile = stack['placedTile'];
    const adjacentTile = stack['adjacentTile'];
    corporation.addTile(placedTile);
    this.removeUnIncorporatedTile(adjacentTile.concat(placedTile));
    corporation.concatTiles(adjacentTile);
    player.addStocks({ name: corporationName, numberOfStock: 1 });
    corporation.deductStocks(1);
    this.activityLog.addLog(
      `${player.getName()} established ${corporationName}`
    );
    this.changeTurn();
  }

  addToUnincorporatedTiles(tile) {
    this.unIncorporatedTiles.push(tile);
  }

  placeTile(tileValue) {
    const player = this.getCurrentPlayer();
    const tile = player.findTileByValue(tileValue);
    if (!tile) {
      return {
        error: true,
        message: `You don't have ${tileValue} tile`
      };
    }
    this.lastPlacedTile = tile;
    const adjacentTile = this.getAdjacent(tile);

    this.turnManager.addStack('placedTile', tile);
    this.turnManager.addStack('adjacentTile', adjacentTile);
    const inActiveCorporations = this.getInActiveCorporations();
    const growingCorporation = this.getCorporationAdjacentTo(tile);
    const canFoundCorporation =
      adjacentTile.length >= 1 &&
      inActiveCorporations.length > 0 &&
      growingCorporation == undefined;
    const canGrowCorporation = growingCorporation != undefined;

    player.removeTile(tile.getPosition());
    player.updateLog(`You placed tile on ${tileValue}`);
    this.getActivityLog().addLog(
      `${player.getName()} placed tile ${tileValue} on board`
    );

    if (canFoundCorporation) {
      const corporations = this.getInActiveCorporations();
      this.changeActionToFoundCorporation(corporations);
      return { error: false, message: '' };
    }

    if (canGrowCorporation) {
      this.growCorporation(tile);
    }

    if (!canGrowCorporation) {
      this.addToUnincorporatedTiles(tile);
    }

    this.changeTurn();
    return { error: false, message: '' };
  }

  changeActionToFoundCorporation(corporations) {
    const action = { name: 'FOUND_CORPORATION', data: corporations };
    this.turnManager.changeAction(action);
  }

  generateBoard() {
    const corporationsDetail = this.corporations.reduce(
      (initial, corporation) => initial.concat(corporation.getTiles()),
      []
    );
    const unIncorporatedDetail = this.unIncorporatedTiles.map(tile => {
      const corporation = 'unIncorporated';
      return {
        id: tile.getValue(),
        corporation
      };
    });
    return corporationsDetail.concat(unIncorporatedDetail);
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

  buyStocks(stockDetails) {
    const player = this.getCurrentPlayer();
    Object.keys(stockDetails).forEach(corporationName => {
      const noOfStocks = stockDetails[corporationName];
      const corporation = this.corporations.find(
        corporation => corporation.getName() == corporationName
      );
      buyStocks(player, corporation, noOfStocks);
    });
  }

  getActiveCorporationsData() {
    return this.corporations.reduce((corporations, corporation) => {
      if (!corporation.getStatus()) {
        return corporations;
      }
      const corporationData = getCorporationData(corporation);
      return corporations.concat(corporationData);
    }, []);
  }

  changeActionToBuyStocks() {
    const currentPlayer = this.getCurrentPlayer();
    const buyStocksData = {};

    buyStocksData.money = currentPlayer.getMoney();
    buyStocksData.corporations = this.getActiveCorporationsData();
    buyStocksData.maximumLimit = 3;
    buyStocksData.canBuy = buyStocksData.corporations.length ? true : false;
    this.turnManager.changeAction({ name: 'BUY_STOCKS', data: buyStocksData });
  }

  getDetails(playerId) {
    const board = this.generateBoard();
    const corporations = this.getCorporationsDetail();
    const players = this.getTurnData();
    const player = this.getPlayerDetails(playerId);
    const action = this.turnManager.getAction(playerId);
    const lastPlacedTileId = this.lastPlacedTile.getValue();
    return { board, corporations, players, player, action, lastPlacedTileId };
  }

  getPlayers() {
    return this.players;
  }
}

module.exports = Game;
