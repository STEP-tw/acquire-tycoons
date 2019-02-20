const { Player } = require('../../src/models/player.js');
const { Tile } = require('../../src/models/tile.js');
const { expect } = require('chai');

describe('Player', function() {
  let player;
  beforeEach(() => {
    player = new Player('abc');
  });
  describe('getStocks', function() {
    it('should return stocks of player', function() {
      const expectedOutput = {
        Phoenix: 0,
        Quantum: 0,
        Fusion: 0,
        Hydra: 0,
        America: 0,
        Zeta: 0,
        Sackson: 0
      };
      expect(player.getStocks()).to.deep.equal(expectedOutput);
    });
  });

  describe('getTiles', function() {
    it('should return tiles of player', function() {
      const expectedOutput = [];
      expect(player.getTiles()).to.deep.equal(expectedOutput);
    });
  });

  describe('getMoney', function() {
    it('should return money of player', function() {
      const expectedOutput = 6000;
      expect(player.getMoney()).to.equal(expectedOutput);
    });
  });

  describe('addMoney', function() {
    it('should add given money to the player\'s money', function() {
      const expectedOutput = 6050;
      player.addMoney(50);
      expect(player.getMoney()).to.equal(expectedOutput);
    });
  });

  describe('deductMoney', function() {
    it('should add given money to the player\'s money', function() {
      const expectedOutput = 5950;
      player.deductMoney(50);
      expect(player.getMoney()).to.equal(expectedOutput);
    });
  });

  describe('addTile', function() {
    it('should add given money to the player\'s money', function() {
      const position = { row: 1, column: 1 };
      const value = '1A';
      const tile = new Tile(position, value);
      player.addTile(tile);
      const expectedOutput = [{ position: { row: 1, column: 1 }, value: '1A' }];
      expect(player.getTiles()).to.deep.equal(expectedOutput);
    });
  });

  describe('removeTile', function() {
    it('should remove tile from player\'s tile', function() {
      let position = { row: 1, column: 1 };
      let value = '1A';
      let tile = new Tile(position, value);
      player.addTile(tile);

      position = { row: 1, column: 1 };
      value = '1A';
      tile = new Tile(position, value);
      player.removeTile(tile);
      const expectedOutput = [];
      expect(player.getTiles()).to.deep.equal(expectedOutput);
    });
  });

  describe('addStocks', function() {
    it('should add stocks to the player\'s stocks', function() {
      const stock = { name: 'Sackson', numberOfStock: 4 };
      player.addStocks(stock);
      const expectedOutput = {
        Phoenix: 0,
        Quantum: 0,
        Fusion: 0,
        Hydra: 0,
        America: 0,
        Zeta: 0,
        Sackson: 4
      };

      expect(player.getStocks()).to.deep.equal(expectedOutput);
    });
  });

  describe('deductStocks', function() {
    it('should deduct stocks from the player\'s stocks', function() {
      let stock = { name: 'Sackson', numberOfStock: 4 };
      player.addStocks(stock);

      stock = { name: 'Sackson', numberOfStock: 2 };
      player.deductStocks(stock);
      const expectedOutput = {
        Phoenix: 0,
        Quantum: 0,
        Fusion: 0,
        Hydra: 0,
        America: 0,
        Zeta: 0,
        Sackson: 2
      };

      expect(player.getStocks()).to.deep.equal(expectedOutput);
    });
  });

  describe('findTile', function() {
    it('should return true if tile is present in player\'s tile', function() {
      const position = { row: 1, column: 1 };
      const value = '1A';
      const tile = new Tile(position, value);
      player.addTile(tile);

      expect(player.findTile(position)).to.equal(0);
    });
  });

  describe('getDetails', function() {
    it('should return all the details related to player', function() {
      expect(player.getDetails()).to.deep.equal({
        name: 'abc',
        status: 'Welcome abc',
        money: 6000,
        stocks: [],
        tiles: []
      });
    });
  });
});
