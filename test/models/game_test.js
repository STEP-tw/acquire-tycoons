const expect = require('chai').expect;
const sinon = require('sinon');

const tilesData = require('../../src/data/tiles_data.json');
const levelsData = require('../../src/data/level_data.json');
const corporationData = require('../../src/data/corporations_data.json');

const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');
const ActivityLog = require('../../src/models/activity_log.js');
const Tile = require('../../src/models/tile.js');

const { getCorporations, getFaceDownCluster } = require('../../src/util.js');

const {
  mergerBigSmallTest,
  mergerSmallBigTest,
  merger2SameSizeCorpTest,
  merger4SameSizeCorpTest,
  replaceUnplayableTilesTest
} = require('../../helpers/main.js');

const generateTiles = function(row, noOfTiles) {
  return new Array(noOfTiles).fill(row).map((elem, index) => {
    return new Tile({ row: 0, column: index }, index + 1 + elem);
  });
};

describe('Game', function() {
  let game, player1;
  beforeEach(function() {
    const random = sinon.stub();
    random.returns(0);
    const maxPlayers = 4;
    const mockedDate = sinon.useFakeTimers().Date;
    game = new Game(maxPlayers, random, new ActivityLog(mockedDate));
    const playerId = game.getNextPlayerId();
    player1 = new Player('Dhiru', playerId);
    game.addPlayer(player1);
  });

  describe('Before Initialize', function() {
    it('addPlayer: should add player to game', function() {
      const playerId = game.getNextPlayerId();
      const player = new Player('Sai', playerId);
      game.addPlayer(player);
      expect(game.getNextPlayerId()).to.equal(2);
    });

    it('should return false when current player number is not equal to maximum player number', function() {
      expect(game.isFull()).to.equal(false);
    });
  });

  describe('initialize', function() {
    it('getUnincorpratedTiles', function() {
      const player1 = new Player('Swagata', 1);
      const player2 = new Player('Gayatri', 2);
      const player3 = new Player('Arnab', 3);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.getUnincorporatedTiles()).to.have.length(4);
    });

    it('getPlayersInitialTiles', function() {
      const player1 = new Player('Swagata', 1);
      const player2 = new Player('Gayatri', 2);
      const player3 = new Player('Arnab', 3);
      game.addPlayer(player1, 1);
      game.addPlayer(player2, 2);
      game.addPlayer(player3, 3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.players[1].getTiles()).to.have.length(6);
    });

    describe('isFull', function() {
      it('should return true when current player number is equal to maximum player number', function() {
        const player1 = new Player('Swagata', 1);
        const player2 = new Player('Gayatri', 2);
        const player3 = new Player('Arnab', 3);
        game.addPlayer(player1);
        game.addPlayer(player2);
        game.addPlayer(player3);
        expect(game.isFull()).to.equal(true);
      });

      it('should return false when current player number is not equal to maximum player number', function() {
        expect(game.isFull()).to.equal(false);
      });
    });
  });

  describe('getGameStatus', function() {
    beforeEach(() => {
      const player1 = new Player('Swagata', 1);
      const player2 = new Player('Gayatri', 2);
      const player3 = new Player('Arnab', 3);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
    });

    it('should return false when game is not initialized', function() {
      expect(game.getGameStatus()).false;
    });

    it('should return true when game is initialized', function() {
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.getGameStatus()).true;
    });
  });

  describe('provideNewTile', function() {
    it('should change the player turn and add log for next player', function() {
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster([]);
      game.initialize(corporations, faceDownCluster);
      game.provideNewTile();
      expect(game.getCurrentPlayer().tiles).to.have.length(0);
    });
  });

  describe('After Initialize', function() {
    let player2, player3, player4;
    beforeEach(() => {
      player2 = new Player('Swagata', 1);
      player3 = new Player('Gayatri', 2);
      player4 = new Player('Arnab', 3);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
    });

    describe('initialize', function() {
      it('getUnincorpratedTiles', function() {
        expect(game.getUnincorporatedTiles()).to.have.length(4);
      });

      it('getPlayersInitialTiles', function() {
        expect(game.players[1].getTiles()).to.have.length(6);
      });

      it('getRandomTile', function() {
        expect(game.getRandomTile()).to.deep.equal({
          position: {
            row: 2,
            column: 4
          },
          value: '5C'
        });
      });
    });

    describe('placeTile', function() {
      it('should change action to FOUND_CORPORATION when current player placing a tile', function() {
        const placedTile = '5A';
        const expectedOutput = {
          error: false,
          message: ''
        };

        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
        expect(player1.tiles.length).to.equal(5);
        expect(game.turnManager.getAction(0).name).to.equal(
          'FOUND_CORPORATION'
        );
        expect(game.getCurrentPlayer()).to.deep.equal(player1);
      });

      it('should change action to DO_NOTHING when someone else places a tile', function() {
        const placedTile = '5A';
        const expectedOutput = {
          error: false,
          message: ''
        };

        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
        expect(player1.tiles.length).to.equal(5);
        expect(game.turnManager.getAction(2).name).to.equal('DO_NOTHING');
        expect(game.getCurrentPlayer().getLog()).to.equal(
          'You placed tile on 5A'
        );
        expect(game.getCurrentPlayer()).to.deep.equal(player1);
      });

      it("should return error when player doesn't contains a tile", function() {
        const placedTile = '2A';
        const expectedOutput = {
          error: true,
          message: `You don't have ${placedTile} tile`
        };

        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
        expect(player1.tiles.length).to.equal(6);
        expect(game.getCurrentPlayer().getLog()).to.equal("It's your turn");
        expect(game.turnManager.getAction(0).name).to.equal('PLACE_A_TILE');
        expect(game.turnManager.isCurrentPlayer(0)).true;
      });

      it('should change action to DO_NOTHING and change turn, for placing unincorporated tile', function() {
        const placedTile = '6A';
        const expectedOutput = {
          error: false,
          message: ''
        };

        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
        expect(player1.tiles.length).to.equal(6);
        expect(game.getCurrentPlayer().getLog()).to.equal("It's your turn");
        expect(game.turnManager.getAction(0).name).to.equal('DO_NOTHING');
        expect(game.getCurrentPlayer()).to.deep.equal(player2);
      });

      it('should grow the corporation if the placed tile is adjacent to the corporation and action should change to buy stocks', function() {
        const tile1 = new Tile(
          {
            row: 1,
            column: 4
          },
          '5B'
        );

        const tile2 = new Tile(
          {
            row: 1,
            column: 5
          },
          '6B'
        );

        game.corporations[0].addTile(tile1);
        game.corporations[0].addTile(tile2);
        const placedTile = '6A';
        game.placeTile(placedTile);

        expect(player1.tiles.length).to.equal(5);
        expect(game.corporations[0].tiles.length).to.equal(3);
        expect(game.getCurrentPlayer().getLog()).to.equal(
          'You placed tile on 6A'
        );
        expect(game.getCurrentPlayer()).to.deep.equal(player1);
        expect(game.turnManager.getAction(0).name).to.equal('BUY_STOCKS');
      });

      it("should add all connected tiles to the corporation's tile when tile is adjacent to corporation's tile", function() {
        game.corporations[0].tiles = [];

        const unincorporatedTile1 = new Tile({ row: 0, column: 8 }, '9A');
        const unincorporatedTile2 = new Tile({ row: 1, column: 8 }, '9B');

        const incorporatedTile1 = new Tile({ row: 0, column: 6 }, '7A');
        const incorporatedTile2 = new Tile({ row: 0, column: 5 }, '6A');

        const placedTile = '8A';

        game.corporations[0].addTile(incorporatedTile1);
        game.corporations[0].addTile(incorporatedTile2);

        game.addToUnincorporatedTiles([
          unincorporatedTile1,
          unincorporatedTile2
        ]);

        game.placeTile(placedTile);
        const actualOutput = game.corporations[0].getTiles();
        const expectedOutput = [
          {
            position: { row: 0, column: 6 },
            value: '7A'
          },
          {
            position: { row: 0, column: 5 },
            value: '6A'
          },
          {
            position: { row: 0, column: 8 },
            value: '9A'
          },
          {
            position: { row: 1, column: 8 },
            value: '9B'
          },
          {
            position: { row: 0, column: 7 },
            value: '8A'
          }
        ];
        expect(actualOutput).to.deep.equal(expectedOutput);
      });

      it('should not allow to place a tile when player try to establish 8th corporation', function() {
        const corp1Tile = new Tile({ row: 2, column: 3 }, '4C');
        const corp4Tile = new Tile({ row: 2, column: 5 }, '6C');
        const corp2Tile = new Tile({ row: 2, column: 7 }, '8C');
        const corp3Tile = new Tile({ row: 2, column: 9 }, '10C');
        const corp5Tile = new Tile({ row: 2, column: 11 }, '12C');
        const corp6Tile = new Tile({ row: 4, column: 11 }, '12E');
        const corp7Tile = new Tile({ row: 6, column: 11 }, '12G');

        game.corporations[0].addTile(corp1Tile);
        game.corporations[1].addTile(corp2Tile);
        game.corporations[2].addTile(corp3Tile);
        game.corporations[3].addTile(corp4Tile);
        game.corporations[4].addTile(corp5Tile);
        game.corporations[5].addTile(corp6Tile);
        game.corporations[6].addTile(corp7Tile);

        const actualOutput = game.placeTile('5A');
        const log = `You can't place 5A place any other tile`;
        const expectedOutput = { error: true, message: log };

        expect(actualOutput).to.deep.equal(expectedOutput);
        expect(game.getCurrentPlayer().getTiles().length).to.equal(6);
        expect(game.getCurrentPlayer()).to.deep.equal(player1);
        expect(game.getCurrentPlayer().getLog()).to.equal(
          "You can't place 5A place any other tile"
        );
        expect(game.turnManager.getAction(0).name).to.equal('PLACE_A_TILE');
      });
    });

    describe('getCorporationsDetail', function() {
      it('should return current details of corporation', function() {
        const expectedOutput = [
          {
            name: 'Quantum',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          },
          {
            name: 'Phoenix',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          },
          {
            name: 'Fusion',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          },
          {
            name: 'Hydra',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          },
          {
            name: 'America',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          },
          {
            name: 'Zeta',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          },
          {
            name: 'Sackson',
            size: 0,
            marketPrice: 0,
            availableStocks: 25
          }
        ];
        expect(game.getCorporationsDetail()).to.deep.equal(expectedOutput);
      });
    });

    describe('removeUnIncorporatedTile', function() {
      it('should remove given tiles from unIncorporated tiles', function() {
        let tile = new Tile({ row: 0, column: 0 }, '1A');
        game.removeUnIncorporatedTile([tile]);
        expect(game.getUnincorporatedTiles().length).to.equals(3);
      });
    });

    describe('getCorporation', function() {
      it('should return corporation of given name', function() {
        let actualOutput = game.getCorporation('Hydra');
        expect(actualOutput.name).to.equal('Hydra');
        expect(actualOutput.tiles.length).to.equal(0);
        expect(actualOutput.availableStocks).to.equal(25);
      });
    });

    describe('areCorporationsAdjacentTo', function() {
      it('should return all the corporations that are adjacent to given tile', function() {
        game.corporations[0].addTile(new Tile({ row: 3, column: 3 }, '4D'));
        let actualOutput = game.areCorporationsAdjacentTo(
          new Tile({ row: 3, column: 4 }, '5D')
        );
        expect(actualOutput.length).to.equal(1);
      });
    });

    describe('getDetails', function() {
      it('should return details', function() {
        expect(game.getDetails(1).board).to.have.length(4);
      });
    });

    describe('getCurrentPlayer', function() {
      it('should return the current player as 0 when initialized', function() {
        expect(game.getCurrentPlayer().getId()).to.equals(0);
      });
    });

    describe('changeTurn', function() {
      it('should change the player turn and add log for next player', function() {
        game.changeTurn();
        expect(game.getCurrentPlayer().getId()).to.equal(1);
        expect(game.getCurrentPlayer().log).to.equals(`It's your turn`);
      });
    });

    describe('getActiveCorporationsData', function() {
      it('should return empty array when no corporation is Active', function() {
        expect(game.getActiveCorporationsData()).to.deep.equal([]);
      });
      it('should return the Sackson corporation Details', function() {
        const sackson = game.corporations[6];
        sackson.addTile('4A');
        sackson.addTile('5A');
        expect(game.getActiveCorporationsData()).to.deep.equal([
          { name: 'Sackson', currentPrice: 200, stocks: 25 }
        ]);
      });
    });

    describe('changeActionToBuyStocks', function() {
      it("shouldn't change the action to buy stocks when there are no active corporation and change the turn", function() {
        game.changeActionToBuyStocks();
        const action = game.turnManager.getAction(0);
        expect(action.name).to.equal('DO_NOTHING');
        const currentPlayerAction = game.turnManager.getAction(1);
        expect(currentPlayerAction.name).to.equal('PLACE_A_TILE');
      });
      it('should change the action to buy stocks', function() {
        game.corporations[0].addTile('4A');
        game.changeActionToBuyStocks();
        const action = game.turnManager.getAction(0);
        expect(action.name).to.equal('BUY_STOCKS');
        expect(action.data.money).to.equal(6000);
      });
    });

    describe('buyStocks', function() {
      it(`shouldn't buy stocks when the current player don't want to buy anything`, function() {
        game.buyStocks({});
        const currentPlayer = game.getCurrentPlayer();
        expect(currentPlayer.getStocks()).to.deep.equal({
          Phoenix: 0,
          Quantum: 0,
          Fusion: 0,
          Hydra: 0,
          America: 0,
          Zeta: 0,
          Sackson: 0
        });
      });
      it(`should buy stocks when the current player want to buy`, function() {
        game.buyStocks({ Zeta: 2 });
        const currentPlayer = game.players[0];
        expect(currentPlayer.getStocks()).to.deep.equal({
          Phoenix: 0,
          Quantum: 0,
          Fusion: 0,
          Hydra: 0,
          America: 0,
          Zeta: 2,
          Sackson: 0
        });
      });
    });

    describe('establishCorporation', function() {
      it('should found a coporation of given name', function() {
        game.turnManager.addStack(
          'placedTile',
          new Tile({ row: 0, column: 1 }, '2A')
        );
        game.turnManager.addStack('adjacentTile', [
          new Tile({ row: 0, column: 2 }, '3A')
        ]);
        game.establishCorporation('Hydra');
        expect(game.corporations[3].tiles.length).to.equal(2);
        expect(game.getUnincorporatedTiles().length).to.equal(2);
      });

      it('should grow corporation and includes all connected unincorporated tiles to the corporation', function() {
        game.turnManager.addStack(
          'placedTile',
          new Tile({ row: 0, column: 4 }, '5A')
        );
        game.turnManager.addStack('adjacentTile', [
          new Tile({ row: 0, column: 0 }, '1A'),
          new Tile({ row: 0, column: 1 }, '2A'),
          new Tile({ row: 0, column: 2 }, '3A'),
          new Tile({ row: 0, column: 3 }, '4A'),
          new Tile({ row: 0, column: 5 }, '6A')
        ]);
        game.establishCorporation('Sackson');
        expect(game.corporations[6].tiles.length).to.equal(6);
        expect(game.getCurrentPlayer()).to.deep.equal(player1);
        expect(game.turnManager.getAction(0).name).to.equal('BUY_STOCKS');
      });
    });

    describe('getConnectedNeighbors', () => {
      it('should give list of all connected neighbors of given tile', () => {
        const placeTile = new Tile({ row: 0, column: 4 }, '5A');
        const expectedNeighbor = [
          { position: { row: 0, column: 3 }, value: '4A' },
          { position: { row: 0, column: 2 }, value: '3A' },
          { position: { row: 0, column: 1 }, value: '2A' },
          { position: { row: 0, column: 0 }, value: '1A' }
        ];
        expect(game.getConnectedNeighbors(placeTile)).to.deep.equal(
          expectedNeighbor
        );
      });
    });

    describe('getStockHolders', function() {
      it("shouldn't provide any stock holders of given corporation at beginning", function() {
        expect(game.getStockHolders('Sackson')).to.length(0);
      });

      it('should provide (all the stock holders of given corporation', function() {
        player1.addStocks({ name: 'Sackson', numberOfStock: 2 });
        player2.addStocks({ name: 'Sackson', numberOfStock: 2 });
        expect(game.getStockHolders('Sackson')).to.length(2);
      });
    });

    describe('distributeMajorityMinority', function() {
      it('should distribute stock holder bonuses to single stock holder if there is only single stock holder of the corporation', function() {
        game.corporations[6].addTile(new Tile({ row: 1, column: 1 }, '2B'));
        game.corporations[6].addTile(new Tile({ row: 1, column: 2 }, '3B'));
        player1.addStocks({ name: 'Sackson', numberOfStock: 2 });
        game.distributeMajorityMinority('Sackson');
        expect(player1.getMoney()).to.equal(9000);
      });

      it('should distribute majority bonus to majorStockHolder and minority bonus to minor stock holder if there are single major and minor stockholder', function() {
        game.corporations[6].addTile(new Tile({ row: 1, column: 1 }, '2B'));
        game.corporations[6].addTile(new Tile({ row: 1, column: 2 }, '3B'));
        player1.addStocks({ name: 'Sackson', numberOfStock: 2 });
        player2.addStocks({ name: 'Sackson', numberOfStock: 1 });
        game.distributeMajorityMinority('Sackson');
        expect(player1.getMoney()).to.equal(8000);
        expect(player2.getMoney()).to.equal(7000);
      });

      it('should distribute average of majority bonus and minority bonus if there are more than one major stock holders', function() {
        game.corporations[6].addTile(new Tile({ row: 1, column: 1 }, '2B'));
        game.corporations[6].addTile(new Tile({ row: 1, column: 2 }, '3B'));
        player1.addStocks({ name: 'Sackson', numberOfStock: 2 });
        player2.addStocks({ name: 'Sackson', numberOfStock: 2 });
        game.distributeMajorityMinority('Sackson');
        expect(player1.getMoney()).to.equal(7500);
        expect(player2.getMoney()).to.equal(7500);
      });

      it('should distribute average of minority bonus if there are more than one minor stock holder', function() {
        game.corporations[6].addTile(new Tile({ row: 1, column: 1 }, '2B'));
        game.corporations[6].addTile(new Tile({ row: 1, column: 2 }, '3B'));
        player1.addStocks({ name: 'Sackson', numberOfStock: 2 });
        player2.addStocks({ name: 'Sackson', numberOfStock: 1 });
        player3.addStocks({ name: 'Sackson', numberOfStock: 1 });
        game.distributeMajorityMinority('Sackson');
        expect(player1.getMoney()).to.equal(8000);
        expect(player2.getMoney()).to.equal(6500);
        expect(player3.getMoney()).to.equal(6500);
      });
    });

    describe('hasEnded', function() {
      let cause = 'All active corporations are safe !';

      it('should return false when initialized', function() {
        expectedOutput = {
          gameEnded: false
        };
        expect(game.hasEnded()).to.deep.equal(expectedOutput);
      });

      it('should return true if the active corporation is safe', function() {
        game.corporations[0].tiles = generateTiles('A', 11);
        expectedOutput = {
          gameEnded: true,
          cause
        };
        expect(game.hasEnded()).to.deep.equal(expectedOutput);
      });

      it('should return true if all the active corporations are safe', function() {
        expectedOutput = {
          gameEnded: true,
          cause
        };
        game.corporations[0].tiles = generateTiles('A', 11);
        game.corporations[3].tiles = generateTiles('D', 11);
        expect(game.hasEnded()).to.deep.equal(expectedOutput);
      });

      it('should return false if there is any active corporation size less than 11', function() {
        expectedOutput = {
          gameEnded: false,
          cause
        };
        game.corporations[0].tiles = generateTiles('A', 10);
        game.corporations[2].tiles = generateTiles('C', 11);
        expect(game.hasEnded()).to.deep.equal(expectedOutput);
      });

      it('should return true if there is any active corporation size more than 40', function() {
        expectedOutput = {
          gameEnded: true,
          cause: `Size of ${game.corporations[0].getName()} exceeds 40 !`
        };

        game.corporations[0].tiles = generateTiles('A', 11);
        game.corporations[0].tiles = game.corporations[0].tiles.concat(
          generateTiles('B', 11)
        );
        game.corporations[0].tiles = game.corporations[0].tiles.concat(
          generateTiles('C', 11)
        );
        game.corporations[0].tiles = game.corporations[0].tiles.concat(
          generateTiles('D', 11)
        );

        game.corporations[1].tiles = generateTiles('E', 9);
        expect(game.hasEnded()).to.deep.equal(expectedOutput);
      });
    });

    describe('checkGameEnd', function() {
      it('should change the action to BUY_STOCKS if the game has not ended', function() {
        game.corporations[0].tiles = generateTiles('A', 9);
        game.checkGameEnd();
        expect(game.turnManager.getAction(0).name).to.equal('BUY_STOCKS');
      });

      it('should change the action to END_GAME if all active corps are safe', function() {
        const cause = 'All active corporations are safe !';
        const expectedOutput = {
          playersEndStatus: [
            { name: 'Arnab', money: 6000, rank: 1 },
            { name: 'Gayatri', money: 6000, rank: 2 },
            { name: 'Swagata', money: 6000, rank: 3 },
            { name: 'Dhiru', money: 6000, rank: 4 }
          ],
          cause
        };
        game.corporations[0].tiles = generateTiles('A', 11);
        game.checkGameEnd();
        expect(player1.getLog()).to.equal(`Game ends. ${cause}`);
        expect(player2.getLog()).to.equal(`Game ends. ${cause}`);
        expect(player3.getLog()).to.equal(`Game ends. ${cause}`);
        expect(player4.getLog()).to.equal(`Game ends. ${cause}`);
        expect(game.turnManager.getAction(0).name).to.equal('END_GAME');
        expect(game.turnManager.getAction(0).data).to.deep.equal(
          expectedOutput
        );
      });

      it('should change the action to END_GAME if size of any corp is more than 40', function() {
        const cause = `Size of ${game.corporations[0].getName()} exceeds 40 !`;
        const expectedOutput = {
          playersEndStatus: [
            { name: 'Arnab', money: 6000, rank: 1 },
            { name: 'Gayatri', money: 6000, rank: 2 },
            { name: 'Swagata', money: 6000, rank: 3 },
            { name: 'Dhiru', money: 6000, rank: 4 }
          ],
          cause
        };

        game.corporations[0].concatTiles(generateTiles('A', 11));
        game.corporations[0].concatTiles(generateTiles('B', 11));
        game.corporations[0].concatTiles(generateTiles('C', 11));
        game.corporations[0].concatTiles(generateTiles('D', 11));
        game.checkGameEnd();

        expect(player1.getLog()).to.equal(`Game ends. ${cause}`);
        expect(player2.getLog()).to.equal(`Game ends. ${cause}`);
        expect(player3.getLog()).to.equal(`Game ends. ${cause}`);
        expect(player4.getLog()).to.equal(`Game ends. ${cause}`);

        expect(game.turnManager.getAction(0).name).to.equal('END_GAME');
        expect(game.turnManager.getAction(0).data).to.deep.equal(
          expectedOutput
        );
      });
    });

    describe('sellAndTradeStocks', function() {
      it('should change action to buy stocks after selling and trading of stocks', function() {
        const defunctCorporationName = 'Phoenix';
        const survivingCorporationName = 'Quantum';
        const tradeCount = 2;
        const sellCount = 2;
        const currentPriceOfDefunctStock = 400;

        const sellAndTradeDetails = {
          defunctCorporationName,
          survivingCorporationName,
          tradeCount,
          sellCount,
          currentPriceOfDefunctStock
        };

        const tile1 = new Tile(
          {
            row: 1,
            column: 4
          },
          '5B'
        );

        const tile2 = new Tile(
          {
            row: 1,
            column: 5
          },
          '6B'
        );

        game.corporations[0].addTile(tile1);
        game.corporations[0].addTile(tile2);

        player1.addStocks({ name: 'Phoenix', numberOfStock: 4 });
        player1.addStocks({ name: 'Quantum', numberOfStock: 2 });

        game.sellAndTradeStocks(sellAndTradeDetails);

        expect(player1.getStocksOf(survivingCorporationName)).to.equal(3);
        expect(game.turnManager.getAction(0).name).to.equal('BUY_STOCKS');
      });
    });
  });
});

describe('merger of two different size corporations', function() {
  it('should merge defunct corporation to surviving corporation', function() {
    const game = mergerBigSmallTest();
    const survivingCorpTiles = [
      { position: { row: 0, column: 0 }, value: '1A' },
      { position: { row: 0, column: 1 }, value: '2A' },
      { position: { row: 1, column: 0 }, value: '1B' },
      { position: { row: 0, column: 3 }, value: '4A' },
      { position: { row: 0, column: 4 }, value: '5A' },
      { position: { row: 1, column: 2 }, value: '3B' },
      { position: { row: 0, column: 2 }, value: '3A' }
    ];
    game.placeTile('3A');
    expect(game.getCorporation('Quantum').isActive()).true;
    expect(game.getCorporation('Phoenix').isActive()).false;
    expect(game.getCorporation('Quantum').getTiles()).to.deep.equal(
      survivingCorpTiles
    );
  });

  it('should merge defunct corporation to surviving corporation ', function() {
    const game = mergerSmallBigTest();
    game.placeTile('3A');
    const survivingCorpTiles = [
      { position: { row: 0, column: 0 }, value: '1A' },
      { position: { row: 0, column: 1 }, value: '2A' },
      { position: { row: 1, column: 0 }, value: '1B' },
      { position: { row: 1, column: 1 }, value: '2B' },
      { position: { row: 0, column: 3 }, value: '4A' },
      { position: { row: 0, column: 4 }, value: '5A' },
      { position: { row: 1, column: 3 }, value: '4B' },
      { position: { row: 0, column: 2 }, value: '3A' }
    ];
    expect(game.getCorporation('Quantum').isActive()).false;
    expect(game.getCorporation('Phoenix').isActive()).true;
    expect(game.getCorporation('Phoenix').getTiles()).to.deep.equal(
      survivingCorpTiles
    );
  });
});

describe('Two same size copopration merger', function() {
  it('should ask to select surviving corporation', function() {
    const game = merger2SameSizeCorpTest();
    game.placeTile('3A');
    expect(game.turnManager.getAction(0).name).to.equal(
      'SELECT_SURVIVING_CORPORATION'
    );
  });
});

describe('Four same size copopration merger', function() {
  let game;
  beforeEach(function() {
    game = merger4SameSizeCorpTest();
  });

  it('should ask to select surviving corporation', function() {
    game.placeTile('4D');
    expect(game.turnManager.getAction(0).name).to.equal(
      'SELECT_SURVIVING_CORPORATION'
    );
  });

  it('should ask to select defunct corporation', function() {
    game.placeTile('4D');
    const survivingCorporation = game.getCorporation('Hydra');
    game.continueMerging(survivingCorporation);
    expect(game.turnManager.getAction(0).name).to.equal(
      'SELECT_DEFUNCT_CORPORATION'
    );
  });

  it('should merge selected surviving and defunct corporation', function() {
    game.placeTile('4D');
    const survivingCorporation = game.getCorporation('Hydra');
    game.continueMerging(survivingCorporation);
    const defunctCorporation = game.getCorporation('Phoenix');
    game.mergeCorporations(survivingCorporation, defunctCorporation);

    expect(defunctCorporation.getSize()).to.equal(0);
    expect(survivingCorporation.getSize()).to.equal(6);
  });
});

describe('replaceUnplayableTiles', function() {
  let game;
  beforeEach(() => {
    game = replaceUnplayableTilesTest();
  });

  it('should remove all the unplayable tiles from the player when it is changing the turn', function() {
    expect(game.players[0].tiles.some(tile => tile.isSameValue('4A'))).true;
    game.placeTile('3D');
    game.buyStocks({});
    expect(game.players[0].tiles.some(tile => tile.isSameValue('4A'))).false;
  });

  it('should change the live status bar of player after replacing tiles', function() {
    game.placeTile('3D');
    game.buyStocks({});
    const replacedTile = game
      .getCurrentPlayer()
      .getTiles()[5]
      .getValue();
    const expectedLog =
      `Your unplayable tiles 4A are replaced with ` + replacedTile;
    expect(game.getCurrentPlayer().getLog()).to.equal(expectedLog);
  });
});
