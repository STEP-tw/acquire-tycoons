const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');
const expect = require('chai').expect;
const sinon = require('sinon');
const tilesData = require('../../src/data/tiles_data.json');
const levelsData = require('../../src/data/level_data.json');
const corporationData = require('../../src/data/corporations_data.json');
const { getCorporations, getFaceDownCluster } = require('../../src/util.js');
const ActivityLog = require('../../src/models/activity_log.js');
const Tile = require('../../src/models/tile.js');

describe('Game', function() {
  let game;
  beforeEach(function() {
    const random = sinon.stub();
    random.returns(0);
    const maxPlayers = 4;
    const mockedDate = sinon.useFakeTimers().Date;
    game = new Game(maxPlayers, random, new ActivityLog(mockedDate));
    const playerId = game.getNextPlayerId();
    const player = new Player('Dhiru', playerId);
    game.addPlayer(player);
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
      expect(game.getunIncorporatedTiles()).to.have.length(4);
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
    beforeEach(() => {
      const player1 = new Player('Swagata', 1);
      const player2 = new Player('Gayatri', 2);
      const player3 = new Player('Arnab', 3);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
    });
    describe('initialize', function() {
      it('getUnincorpratedTiles', function() {
        expect(game.getunIncorporatedTiles()).to.have.length(4);
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
      it('should return canFoundCorporation true when provided tile adjacent to unIncorporated tile', function() {
        const unIncorporatedTile = new Tile({ row: 0, column: 1 }, '2A');
        const placedTile = new Tile({ row: 1, column: 1 }, '2B');
        game.resetUnincorporatedTiles();
        game.addToUnincorporatedTiles(unIncorporatedTile);

        const expectedOutput = {
          canFoundCorporation: true,
          canGrowCorporation: false
        };

        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
      });

      it('should return canGrowCorporation true when provided tile adjacent to incorporated tile', function() {
        const incorporatedTile = new Tile({ row: 0, column: 0 }, '1A');
        const placedTile = new Tile({ row: 0, column: 1 }, '2A');
        game.corporations[0].addTile(incorporatedTile);
        const expectedOutput = {
          canFoundCorporation: false,
          canGrowCorporation: true
        };

        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
      });

      it('should return canGrowCorporation and canFoundCorporation false when provided tile not adjacent to incorporated tile and not founding any corporation', function() {
        const incorporatedTile = new Tile({ row: 0, column: 0 }, '1A');
        const placedTile = new Tile({ row: 5, column: 0 }, '1F');
        game.corporations[0].addTile(incorporatedTile);
        const expectedOutput = {
          canFoundCorporation: false,
          canGrowCorporation: false
        };
        expect(game.placeTile(placedTile)).to.deep.equal(expectedOutput);
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
    describe('growCorporation', function() {
      it('should add provided tile to the corporation\'s tile when tile is adjacent to corporation\'s tile', function() {
        game.corporations[0].tiles = [];
        const incorporatedTile = new Tile({ row: 0, column: 6 }, '7A');
        const placedTile = new Tile({ row: 0, column: 7 }, '8A');
        game.corporations[0].addTile(incorporatedTile);
        game.growCorporation(placedTile);
        const actualOutput = game.corporations[0].getTiles();
        const expectedOutput = [
          {
            corporation: 'Quantum',
            id: '7A'
          },
          {
            corporation: 'Quantum',
            id: '8A'
          }
        ];
        expect(actualOutput).to.deep.equal(expectedOutput);
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
      it('should change the action to buy stocks', function() {
        game.changeActionToBuyStocks();
        const action = game.turnManager.getAction(0);
        expect(action.name).to.equal('BUY_STOCKS');
        expect(action.data.money).to.equal(6000);
        expect(action.data.maximumLimit).to.equal(3);
        expect(action.data.canBuy).false;
      });
      it('should change the action to buy stocks', function() {
        game.corporations[0].addTile('4A');
        game.changeActionToBuyStocks();
        const action = game.turnManager.getAction(0);
        expect(action.name).to.equal('BUY_STOCKS');
        expect(action.data.money).to.equal(6000);
        expect(action.data.maximumLimit).to.equal(3);
        expect(action.data.canBuy).true;
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
        const currentPlayer = game.getCurrentPlayer();
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
  });
});
