const Corporation = require('../../src/models/corporation.js');
const { createCorporationInstance } = require('../../src/util.js');
const Level = require('../../src/models/level.js');
const { expect } = require('chai');
const Tile = require('../../src/models/tile.js');

describe('Corporation', function() {
  let corporation;
  beforeEach(() => {
    const levelData = [
      {
        upperLimit: 2,
        lowerLimit: 2,
        majority: 3000,
        minority: 1500,
        marketPrice: 200
      },
      {
        upperLimit: 6,
        lowerLimit: 3,
        majority: 4000,
        minority: 2000,
        marketPrice: 400
      }
    ];

    const level = new Level(levelData);
    corporation = new Corporation('Sackson', level);
  });

  describe('getSize', function() {
    it('should return size of corporation', function() {
      expect(corporation.getSize()).to.equal(0);
    });
  });

  describe('getMajority', function() {
    it('should return majority of corporation', function() {
      corporation.tiles = ['1A', '2B', '3F'];
      expect(corporation.getMajority()).to.equal(4000);
    });

    it('should return majority of corporation of size less than 2', function() {
      corporation.tiles = ['1A'];
      expect(corporation.getMajority()).to.equal(0);
    });
  });

  describe('getMinority', function() {
    it('should return minority of corporation', function() {
      corporation.tiles = ['1A', '2B', '3F'];
      expect(corporation.getMinority()).to.equal(2000);
    });

    it('should return minority of corporation of size less than 2', function() {
      corporation.tiles = ['1A'];
      expect(corporation.getMinority()).to.equal(0);
    });
  });

  describe('getCurrentStockPrice', function() {
    it('should return current stock price', function() {
      corporation.tiles = ['1A', '2B', '3F'];
      expect(corporation.getCurrentStockPrice()).to.equal(400);
    });

    it('should return stock price of corporation of size less than 2', function() {
      corporation.tiles = ['1A'];
      expect(corporation.getCurrentStockPrice()).to.equal(0);
    });
  });
});

describe(' createCorporationInstance', function() {
  let corporation;
  beforeEach(() => {
    const levelsData = {
      'level-1': [
        {
          upperLimit: 2,
          lowerLimit: 2,
          majority: 3000,
          minority: 1500,
          marketPrice: 200
        },
        {
          upperLimit: 6,
          lowerLimit: 3,
          majority: 4000,
          minority: 2000,
          marketPrice: 400
        }
      ]
    };
    corporation = createCorporationInstance(
      { name: 'Sackson', levelId: 1 },
      levelsData
    );
  });

  describe('getSize', function() {
    it('should return size of corporation', function() {
      expect(corporation.getSize()).to.equal(0);
    });
  });

  describe('getMajority', function() {
    it('should return majority of corporation', function() {
      corporation.tiles = ['1A', '2B', '3F'];
      expect(corporation.getMajority()).to.equal(4000);
    });

    it('should return majority of corporation of size less than 2', function() {
      corporation.tiles = ['1A'];
      expect(corporation.getMajority()).to.equal(0);
    });
  });

  describe('getMinority', function() {
    it('should return minority of corporation', function() {
      corporation.tiles = ['1A', '2B', '3F'];
      expect(corporation.getMinority()).to.equal(2000);
    });

    it('should return minority of corporation of size 0', function() {
      corporation.tiles = [];
      expect(corporation.getMinority()).to.equal(0);
    });
  });

  describe('getCurrentStockPrice', function() {
    it('should return current stock price', function() {
      corporation.tiles = ['1A', '2B', '3F'];
      expect(corporation.getCurrentStockPrice()).to.equal(400);
    });

    it('should return stock price of corporation of size less than 2', function() {
      corporation.tiles = ['1A'];
      expect(corporation.getCurrentStockPrice()).to.equal(0);
    });
  });

  describe('getTiles', function() {
    it('should return tiles which ', function() {
      const position = {
        row: 0,
        column: 2
      };
      const value = '3A';
      const tile = new Tile(position, value);
      corporation.addTile(tile);
      const expectedOutput = [
        {
          position: {
            row: 0,
            column: 2
          },
          value: '3A'
        }
      ];
      expect(corporation.getTiles()).to.deep.equal(expectedOutput);
    });
  });

  describe('addStocks', function() {
    it('should add stocks in the corporation', function() {
      corporation.addStocks(3);
      expect(corporation.getStocks()).to.equal(28);
    });
  });
  describe('deductStocks', function() {
    it('should deduct stocks in the corporation', function() {
      corporation.deductStocks(3);
      expect(corporation.getStocks()).to.equal(22);
    });
  });

  describe('isActive', function() {
    it('should return false when it doesn\'t contains any tiles', function() {
      expect(corporation.isActive()).false;
    });
    it('should return true when it doesn\'t contains any tiles', function() {
      const position = {
        row: 0,
        column: 2
      };
      const value = '3A';
      const tile = new Tile(position, value);
      corporation.addTile(tile);
      expect(corporation.isActive()).true;
    });
  });

  describe('doesContains', function() {
    it('should return true when corporation contains provided tile', function() {
      const position = {
        row: 0,
        column: 2
      };
      const value = '3A';
      const tile = new Tile(position, value);
      corporation.addTile(tile);
      const tile2 = new Tile(position, value);
      expect(corporation.doesContains(tile2)).true;
    });
  });
});
