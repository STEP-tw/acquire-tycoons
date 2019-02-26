const _ = require('lodash');
const TurnManager = require('./turn_manager.js');
const {
  getTileWithCorporationName,
  flatPosition,
  getCorporationData,
  buyStocks,
  distributeReward,
  getStockHoldersByCount,
  getStocksCount
} = require('../util.js');
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

  getUnincorporatedTiles() {
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

  getUnincorporatedNeighbors(tile) {
    return this.unIncorporatedTiles.filter(unIncorporatedTile =>
      tile.isNeighbor(unIncorporatedTile)
    );
  }

  getIncorporatedNeighbors(tile) {
    return this.corporations.reduce((incorporatedNeighbors, corporation) => {
      const neighbors = corporation
        .getTiles()
        .filter(corporationTile => tile.isNeighbor(corporationTile));
      return incorporatedNeighbors.concat(neighbors);
    }, []);
  }

  getInActiveCorporations() {
    return this.corporations.filter(corporation => {
      return !corporation.isActive();
    });
  }

  isAdjacentTo(tile, corporation) {
    return corporation.tiles.some(incorporatedTile =>
      tile.isNeighbor(incorporatedTile)
    );
  }

  areCorporationsAdjacentTo(tile) {
    return this.corporations.filter(corporation =>
      this.isAdjacentTo(tile, corporation)
    );
  }

  getCorporationAdjacentTo(tile) {
    return this.corporations.find(this.isAdjacentTo.bind(null, tile));
  }

  getConnectedNeighbors(tile, allNeighbor = []) {
    const neighbors = this.getUnincorporatedNeighbors(tile).filter(
      tile => !allNeighbor.includes(tile)
    );
    if (neighbors.length == 0) {
      return allNeighbor;
    }
    allNeighbor = allNeighbor.concat(neighbors);
    for (let neighbor of neighbors) {
      allNeighbor = this.getConnectedNeighbors(neighbor, allNeighbor);
    }
    return allNeighbor;
  }

  growCorporation(tile, allConnectedTiles) {
    const corporation = this.getCorporationAdjacentTo(tile);
    this.removeUnIncorporatedTile(allConnectedTiles);
    corporation.concatTiles(allConnectedTiles.concat(tile));
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
    this.checkGameEnd();
  }

  addToUnincorporatedTiles(tile) {
    this.unIncorporatedTiles = this.unIncorporatedTiles.concat(tile);
  }

  getAdjacentTiles(tile) {
    const unIncorporatedNeighbors = this.getUnincorporatedNeighbors(tile);
    const incorporatedNeighbors = this.getIncorporatedNeighbors(tile);
    return unIncorporatedNeighbors.concat(incorporatedNeighbors);
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

    const adjacentTiles = this.getAdjacentTiles(tile);
    let status = { error: false, message: '' };
    this.lastPlacedTile = tile;
    this.getActivityLog().addLog(
      `${player.getName()} placed tile ${tileValue} on board`
    );

    if (adjacentTiles.length) {
      status = this.foundOrGrowCorporation(tile);
      return status;
    }
    this.updatePlayer(tile);
    this.addToUnincorporatedTiles(tile);
    this.checkGameEnd();
    return status;
  }

  foundOrGrowCorporation(tile) {
    const hasGrownCorporation = this.getCorporationAdjacentTo(tile);
    const inActiveCorporations = this.getInActiveCorporations();
    const status = { error: false, message: '' };

    const allConnectedTiles = this.getConnectedNeighbors(tile);
    this.updateStack(tile, allConnectedTiles);

    if (hasGrownCorporation) {
      this.getCurrentPlayer().removeTile(tile.getPosition());
      this.getCurrentPlayer().updateLog(`You placed tile on ${tile.getValue()}`);
      this.growCorporation(tile, allConnectedTiles);
      this.checkGameEnd();
      return status;
    }

    if (inActiveCorporations.length) {
      this.getCurrentPlayer().removeTile(tile.getPosition());
      this.getCurrentPlayer().updateLog(`You placed tile on ${tile.getValue()}`);
      this.changeActionToFoundCorporation(inActiveCorporations);
      return status;
    }

    const log = `You can't place ${tile.getValue()} place any other tile`;
    this.getCurrentPlayer().updateLog(log);
    return { error: true, message: log };
  }

  getStockHolders(corporationName) {
    return this.players.filter(player => player.hasStocksOf(corporationName));
  }

  distributeMajorityMinority(corporationName) {
    const corporation = this.getCorporation(corporationName);
    const majorityStockHolderBonus = corporation.getMajority();
    const minorityStockHolderBonus = corporation.getMinority();
    const stockHolders = this.getStockHolders(corporationName);
    const stocksCountList = stockHolders.map(
      getStocksCount.bind(null, corporationName)
    );

    const uniqueStocksCountList = _.uniq(stocksCountList);
    const sortedStocksCountList = _.sortBy(uniqueStocksCountList);
    const majorStocksCount = _.last(sortedStocksCountList);

    const majorStockHolders = getStockHoldersByCount(
      corporationName,
      stockHolders,
      majorStocksCount
    );

    if (majorStockHolders.length > 1 || stockHolders.length == 1) {
      const majorityReward =
        (majorityStockHolderBonus + minorityStockHolderBonus) /
        majorStockHolders.length;
      distributeReward(majorStockHolders, majorityReward);
      return;
    }
    distributeReward(majorStockHolders, majorityStockHolderBonus);
    const minorStocksCount = _.nth(sortedStocksCountList, -2);
    const minorStockHolders = getStockHoldersByCount(
      corporationName,
      stockHolders,
      minorStocksCount
    );
    const minorityReward = minorityStockHolderBonus / minorStockHolders.length;
    distributeReward(minorStockHolders, minorityReward);
  }

  getResults() {
    this.getActiveCorporations().forEach(corporation => {
      this.players.forEach(player => player.sellAllStocks(corporation));
      this.distributeMajorityMinority(corporation.getName());
    });
    const sortedPlayers = _.sortBy(this.players, 'money').reverse();
    const results = sortedPlayers.map((player, index) => ({
      playerName: player.getName(),
      money: player.getMoney(),
      rank: index + 1
    }));
    return results;
  }

  getActiveCorporations() {
    return this.corporations.filter(corporation => corporation.isActive());
  }

  hasEnded() {
    const activeCorporations = this.getActiveCorporations();
    if (activeCorporations.length < 1) {
      return false;
    }

    const areAllCorporationsSafe = activeCorporations.every(
      corporation => corporation.getSize() >= 11
    );

    const isAnyCorporationAbove41 = activeCorporations.some(
      corporation => corporation.getSize() >= 41
    );
    return areAllCorporationsSafe || isAnyCorporationAbove41;
  }

  checkGameEnd() {
    if (this.hasEnded()) {
      const gameResults = this.getResults();
      this.turnManager.changeAction({ name: 'END_GAME', data: gameResults });
      this.turnManager.setActionGlobal();
      return;
    }
    this.changeActionToBuyStocks();
  }

  updatePlayer(tile) {
    this.getCurrentPlayer().removeTile(tile.getPosition());
    this.getCurrentPlayer().updateLog(`You placed tile on ${tile.getValue()}`);
  }

  updateStack(tile, adjacentTiles) {
    this.turnManager.addStack('placedTile', tile);
    this.turnManager.addStack('adjacentTile', adjacentTiles);
  }

  changeActionToFoundCorporation(corporations) {
    const action = { name: 'FOUND_CORPORATION', data: corporations };
    this.turnManager.changeAction(action);
  }

  generateBoard() {
    const corporationsDetail = this.corporations.reduce(
      (initial, corporation) =>
        initial.concat(getTileWithCorporationName(corporation)),
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
    this.changeTurn();
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
    if (this.getInActiveCorporations().length == 7) {
      this.changeTurn();
      return;
    }
    const currentPlayer = this.getCurrentPlayer();
    const buyStocksData = {};

    buyStocksData.money = currentPlayer.getMoney();
    buyStocksData.corporations = this.getActiveCorporationsData();
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
