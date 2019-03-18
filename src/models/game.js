const _ = require('lodash');
const TurnManager = require('./turn_manager.js');
const {
  getTileWithCorporationName,
  flatPosition,
  getCorporationData,
  buyStocks,
  getStockHoldersByCount,
  getStocksCount,
  createTrueError,
  createFalseError,
  createReplaceLog,
  getStatusLog
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
    this.playerCounterAfterMerger = 1;
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
        `${player.getName()} got tile ${tile.getValue()}`,
        `INITIAL_TILE`
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
    this.activityLog.addLog(
      `It's ${currentPlayer.getName()}'s turn`,
      `SWITCH_TURN`
    );
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
        availableStocks: corporation.getStocks(),
        status: corporation.isActive()
      };
    });
    return corporationsDetail;
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

  getCorporationsAdjacentTo(tile) {
    return this.corporations.filter(this.isAdjacentTo.bind(null, tile));
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

  growCorporation() {
    const { adjacentTile, placedTile } = this.turnManager.getStack();
    const corporation = this.getCorporationsAdjacentTo(placedTile).pop();
    this.removeUnIncorporatedTile(adjacentTile);
    corporation.concatTiles(adjacentTile.concat(placedTile));
    this.checkGameEnd();
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
      `${player.getName()} established ${corporationName}`,
      `ESTABLISH_CORPORATION`
    );
    this.checkGameEnd();
  }

  addToUnincorporatedTiles(tile) {
    this.unIncorporatedTiles = this.unIncorporatedTiles.concat(tile);
  }

  isGrowingCorporation(tile) {
    return this.getCorporationsAdjacentTo(tile).length == 1;
  }

  isMerger(tile) {
    return this.getCorporationsAdjacentTo(tile).length > 1;
  }

  isFoundingCorporation(tile) {
    return (
      !this.isMerger(tile) &&
      this.getUnincorporatedNeighbors(tile).length > 0 &&
      !this.isGrowingCorporation(tile)
    );
  }

  isFounding8thCorporation(tile) {
    return (
      !this.isMerger(tile) &&
      this.isFoundingCorporation(tile) &&
      this.getInActiveCorporations().length == 0
    );
  }

  validatePlacedTile(tile) {
    const log = `You can't place ${tile.getValue()} place any other tile`;
    this.getCurrentPlayer().updateLog(log);
    return createTrueError(log);
  }

  isUnplayableTile(tile) {
    const adjacentCorporations = this.getCorporationsAdjacentTo(tile);
    const safeCorporations = adjacentCorporations.filter(corporation =>
      corporation.isSafe()
    );
    return safeCorporations.length > 1;
  }

  placeTile(tileValue) {
    const player = this.getCurrentPlayer();
    const tile = player.findTileByValue(tileValue);

    if (!tile) {
      const message = `You don't have ${tileValue} tile`;
      return createTrueError(message);
    }

    let placedUnincorporatedTile = true;
    let log = `${player.getName()} placed tile ${tileValue} on board`;

    if (this.isFounding8thCorporation(tile)) {
      return this.validatePlacedTile(tile);
    }

    this.updatePlayer(tile);
    this.updateGameStatus(tile, log);
    this.updateStack(tile);

    if (this.isGrowingCorporation(tile)) {
      this.growCorporation();
      placedUnincorporatedTile = false;
    }

    if (this.isMerger(tile)) {
      this.initiateMerger();
      placedUnincorporatedTile = false;
    }

    if (this.isFoundingCorporation(tile)) {
      this.foundCorporation();
      placedUnincorporatedTile = false;
    }

    if (placedUnincorporatedTile) {
      this.addToUnincorporatedTiles(tile);
      this.changeActionToBuyStocks();
    }

    return createFalseError();
  }

  initiateMerger() {
    const { placedTile } = this.turnManager.getStack();
    const mergingCorporations = this.getCorporationsAdjacentTo(placedTile);
    this.turnManager.addStack('mergingCorporations', mergingCorporations);
    const largestCorporations = this.getLargestCorporationsBySize(
      mergingCorporations
    );
    if (largestCorporations.length > 1) {
      this.actionSelectSurviving(largestCorporations);
      return;
    }
    const survivingCorporation = largestCorporations[0];
    this.continueMerging(survivingCorporation);
  }

  getLargestCorporationsBySize(corporations) {
    const corporationSizes = corporations.map(corporation =>
      corporation.getSize()
    );
    const sortedCorporationSizes = _.sortBy(corporationSizes);
    const uniqCorporationSizes = _.uniq(sortedCorporationSizes);
    const largestSize = _.last(uniqCorporationSizes);
    const largestCorporations = this.filterCorporationsBySize(
      corporations,
      largestSize
    );
    return largestCorporations;
  }

  continueMerging(survivingCorporation) {
    this.turnManager.addStack('survivingCorporation', survivingCorporation);
    const { mergingCorporations } = this.turnManager.getStack();
    const defunctCorporations = this.getDefunctCorporations(
      mergingCorporations,
      survivingCorporation
    );
    const largestCorporations = this.getLargestCorporationsBySize(
      defunctCorporations
    );
    const defunctCorporation = largestCorporations[0];

    if (largestCorporations.length > 1) {
      this.actionSelectDefunct(largestCorporations);
      return;
    }

    this.mergeCorporations(survivingCorporation, defunctCorporation);
  }

  actionSelectDefunct(corporations) {
    const action = { name: 'SELECT_DEFUNCT_CORPORATION', data: corporations };
    this.turnManager.changeAction(action);
  }

  getDefunctCorporations(mergingCorporations, survivingCorporation) {
    return mergingCorporations.filter(
      corporation => corporation.getName() != survivingCorporation.getName()
    );
  }

  actionSelectSurviving(corporations) {
    const action = { name: 'SELECT_SURVIVING_CORPORATION', data: corporations };
    this.turnManager.changeAction(action);
  }

  filterCorporationsBySize(corporations, size) {
    return corporations.filter(corporation => corporation.getSize() == size);
  }

  updatePlayer(tile) {
    this.getCurrentPlayer().removeTile(tile.getPosition());
    this.getCurrentPlayer().updateLog(`You placed tile on ${tile.getValue()}`);
  }

  updateStack(tile) {
    const allConnectedTiles = this.getConnectedNeighbors(tile);
    this.turnManager.addStack('placedTile', tile);
    this.turnManager.addStack('adjacentTile', allConnectedTiles);
  }

  updateGameStatus(tile, log) {
    this.activityLog.addLog(log, `PLACE_TILE`);
    this.lastPlacedTile = tile;
  }

  foundCorporation() {
    const inActiveCorporations = this.getInActiveCorporations();
    this.changeActionToFoundCorporation(inActiveCorporations);
  }

  getStockHolders(corporationName) {
    return this.players.filter(player => player.hasStocksOf(corporationName));
  }

  distributeReward(stockHolders, reward, rewardName, defunctCorporationName) {
    const roundedReward = Math.ceil(reward / 100) * 100;
    stockHolders.forEach(stockHolder => {
      stockHolder.addMoney(roundedReward);
      this.activityLog.addLog(
        `${
          stockHolder.name
        } got ${roundedReward} as ${rewardName} of ${defunctCorporationName}`,
        `DISTRIBUTE_REWARD`
      );
    });
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
      this.distributeReward(
        majorStockHolders,
        majorityReward,
        'majority and minority bonus',
        corporationName
      );
      return;
    }
    this.distributeReward(
      majorStockHolders,
      majorityStockHolderBonus,
      'majority bonus',
      corporationName
    );
    const minorStocksCount = _.nth(sortedStocksCountList, -2);
    const minorStockHolders = getStockHoldersByCount(
      corporationName,
      stockHolders,
      minorStocksCount
    );
    const minorityReward = minorityStockHolderBonus / minorStockHolders.length;
    this.distributeReward(
      minorStockHolders,
      minorityReward,
      'minority bonus',
      corporationName
    );
  }

  getActiveCorporations() {
    return this.corporations.filter(corporation => corporation.isActive());
  }

  getResults() {
    this.getActiveCorporations().forEach(corporation => {
      this.distributeMajorityMinority(corporation.getName());
      this.players.forEach(player => {
        player.sellAllStocks(corporation);
      });
    });
    const sortedPlayers = _.sortBy(this.players, 'money').reverse();
    const results = sortedPlayers.map((player, index) => ({
      name: player.getName(),
      money: player.getMoney(),
      rank: index + 1
    }));
    return results;
  }

  hasEnded() {
    const activeCorporations = this.getActiveCorporations();

    if (activeCorporations.length == 0) {
      return { gameEnded: false };
    }

    let cause = 'All active corporations are safe !';

    const areAllCorporationsSafe = activeCorporations.every(
      corporation => corporation.getSize() >= 11
    );

    const corporationAbove41 = activeCorporations.find(
      corporation => corporation.getSize() >= 41
    );

    if (corporationAbove41) {
      cause = `Size of ${corporationAbove41.getName()} exceeds 40 !`;
    }

    const gameEnded = areAllCorporationsSafe || corporationAbove41 != undefined;
    return { gameEnded, cause };
  }

  checkGameEnd() {
    const { gameEnded, cause } = this.hasEnded();
    if (!gameEnded) {
      this.changeActionToBuyStocks();
      return;
    }

    const gameResults = {
      playersEndStatus: this.getResults(),
      cause
    };
    this.players.forEach(player => player.updateLog(`Game ends. ${cause}`));
    this.turnManager.changeAction({ name: 'END_GAME', data: gameResults });
    this.turnManager.setActionGlobal();
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
    }
  }

  changeTurn() {
    this.provideNewTile();
    this.turnManager.changeTurn();
    this.turnManager.resetStack();
    this.turnManager.changeAction({ name: 'PLACE_A_TILE', data: {} });
    this.faceDownCluster.removeTiles(tile => !this.isUnplayableTile(tile));
    this.updateTurnLog();
    this.replaceUnplayableTiles();
  }

  buyStocks(stockDetails) {
    const player = this.getCurrentPlayer();
    let totalNumberOfStocks = 0;
    Object.keys(stockDetails).forEach(corporationName => {
      const noOfStocks = stockDetails[corporationName];
      totalNumberOfStocks += noOfStocks;
      const corporation = this.corporations.find(
        corporation => corporation.getName() == corporationName
      );
      buyStocks(player, corporation, noOfStocks);
    });
    let buyMsg = `${player.getName()} bought stocks`;

    if (!totalNumberOfStocks) {
      buyMsg = `${player.getName()} haven't bought stocks`;
    }
    this.activityLog.addLog(buyMsg, 'BUY_STOCKS');

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
    const buyStocksData = new Object();

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
    const logs = this.activityLog.getLogs();
    return {
      board,
      corporations,
      players,
      player,
      action,
      lastPlacedTileId,
      logs
    };
  }

  getPlayers() {
    return this.players;
  }

  mergeCorporations(surviving, defunct) {
    const { mergingCorporations } = this.turnManager.getStack();
    const defunctCorporationName = defunct.getName();
    const survivingCorporationName = surviving.getName();
    const { adjacentTile } = this.turnManager.getStack();
    const currentPriceOfDefunctStock = defunct.getCurrentStockPrice();
    const survivingCorpStocks = surviving.getStocks();

    const defunctTiles = defunct.getTiles();
    this.removeUnIncorporatedTile(adjacentTile);

    this.activityLog.addLog(
      `${defunctCorporationName} merged with ${survivingCorporationName}`,
      `MERGER`
    );
    this.distributeMajorityMinority(defunctCorporationName);
    defunct.resetTiles();
    surviving.concatTiles(defunctTiles);
    _.remove(
      mergingCorporations,
      corporation => defunct.getName() == corporation.getName()
    );

    const sellTradeData = {
      survivingCorporationName,
      defunctCorporationName,
      survivingCorpStocks,
      currentPriceOfDefunctStock
    };

    this.changeActionToSellAndTrade(sellTradeData);
  }

  changeActionToSellAndTrade(sellTradeData) {
    const currentPlayer = this.getCurrentPlayer();
    const defunctCorpStocks = currentPlayer.getStocksOf(
      sellTradeData.defunctCorporationName
    );
    sellTradeData.defunctCorpStocks = defunctCorpStocks;
    this.turnManager.changeAction({ name: 'SELL_TRADE', data: sellTradeData });
  }

  updateSellAndTradeLog(currentPlayer, sellCount, tradeCount) {
    let sellMsg = `didn't sell any stocks`;
    let tradeMsg = `didn't trade any stocks`;
    if (sellCount) {
      sellMsg = `sold ${sellCount} stocks`;
    }
    if (tradeCount) {
      tradeMsg = `traded ${tradeCount} stocks`;
    }
    this.activityLog.addLog(
      `${currentPlayer.getName()} ${sellMsg} and ${tradeMsg}`,
      `TRADE_STOCKS`
    );
  }

  sellAndTradeStocks(sellAndTradeDetails) {
    const {
      sellCount,
      tradeCount,
      defunctCorporationName,
      survivingCorporationName,
      currentPriceOfDefunctStock
    } = sellAndTradeDetails;

    const gettingStocksAfterTrading = tradeCount / 2;
    const sellingStocksMoney = sellCount * currentPriceOfDefunctStock;

    // updating player's log
    const currentPlayer = this.getCurrentPlayer();
    const totalDefunctStocks = currentPlayer.getStocksOf(
      defunctCorporationName
    );

    let log = getStatusLog(
      sellCount,
      tradeCount,
      totalDefunctStocks,
      currentPriceOfDefunctStock,
      survivingCorporationName
    );

    if (totalDefunctStocks != 0) {
      currentPlayer.updateLog(log);
    }

    this.updateSellAndTradeLog(currentPlayer, sellCount, tradeCount);

    currentPlayer.deductStocks(defunctCorporationName, sellCount);
    currentPlayer.addMoney(sellingStocksMoney);
    currentPlayer.tradeStocks(
      survivingCorporationName,
      defunctCorporationName,
      tradeCount
    );

    const defunctCorporation = this.getCorporation(defunctCorporationName);
    const defunctCorporationStocks = sellCount + tradeCount;
    defunctCorporation.addStocks(defunctCorporationStocks);
    const survivingCorporation = this.getCorporation(survivingCorporationName);
    survivingCorporation.deductStocks(gettingStocksAfterTrading);
    const survivingCorpStocks = survivingCorporation.getStocks();
    if (this.getPlayerCounterAfterMerger() == this.maxPlayers) {
      this.resetPlayerCounterAfterMerger();
      this.turnManager.changeTurn();
      const {
        mergingCorporations,
        adjacentTile,
        placedTile
      } = this.turnManager.getStack();
      if (mergingCorporations.length > 1) {
        this.continueMerging(survivingCorporation);
        return;
      }
      survivingCorporation.concatTiles(adjacentTile.concat(placedTile));
      this.checkGameEnd();
      return;
    }

    const data = {
      defunctCorporationName,
      survivingCorporationName,
      currentPriceOfDefunctStock,
      survivingCorpStocks
    };

    this.updatePlayerCounterAfterMerger();
    this.turnManager.changeTurn();
    this.changeActionToSellAndTrade(data);
  }

  replaceUnplayableTiles() {
    const player = this.getCurrentPlayer();
    const playerTiles = player.getTiles();
    const unPlayableTiles = playerTiles.filter(tile =>
      this.isUnplayableTile(tile)
    );
    if (unPlayableTiles.length == 0) {
      return;
    }
    const newTiles = this.getNRandomTiles(unPlayableTiles.length);
    const log = createReplaceLog(unPlayableTiles, newTiles);
    player.updateLog(log);
    unPlayableTiles.forEach(tile => player.removeTile(tile.getPosition()));
    newTiles.forEach(tile => player.addTile(tile));
  }

  getPlayerCounterAfterMerger() {
    return this.playerCounterAfterMerger;
  }

  updatePlayerCounterAfterMerger() {
    this.playerCounterAfterMerger++;
  }

  resetPlayerCounterAfterMerger() {
    this.playerCounterAfterMerger = 1;
  }
}

module.exports = Game;
