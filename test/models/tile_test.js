const { expect } = require('chai');

const Tile = require('../../src/models/tile.js');

describe('Tile', function() {
  let tile;
  beforeEach(() => {
    const position = { row: 1, column: 1 };
    const value = '1A';
    tile = new Tile(position, value);
  });
  describe('isNeighbor', function() {
    it('should return true when provided tile is adjacent to column of any other tile', function() {
      const adjacentPosition = { row: 1, column: 2 };
      const neighborTile = new Tile(adjacentPosition);

      expect(tile.isNeighbor(neighborTile)).true;
    });

    it('should return true when provided tile is adjacent to row of any other tile', function() {
      const adjacentPosition = { row: 2, column: 1 };
      const neighborTile = new Tile(adjacentPosition);

      expect(tile.isNeighbor(neighborTile)).true;
    });

    it('should return false when provided tile is not adjacent to any other tile', function() {
      const adjacentPosition = { row: 2, column: 2 };
      const neighborTile = new Tile(adjacentPosition);

      expect(tile.isNeighbor(neighborTile)).false;
    });
  });

  describe('isSamePosition', function() {
    it('should return true when the position of tile equal the given position', function() {
      const anotherPosition = { row: 1, column: 1 };

      expect(tile.isSamePosition(anotherPosition)).true;
    });

    it('should return false when the position of tile equal the given position', function() {
      const anotherPosition = { row: 2, column: 1 };

      expect(tile.isSamePosition(anotherPosition)).false;
    });
  });

  describe('getNeighbors', function() {
    it('should return all the neighboring positions', function() {
      const expectedOutput = [
        { row: 2, column: 1 },
        { row: 0, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 0 }
      ];

      expect(tile.getNeighbors()).to.deep.equal(expectedOutput);
    });
  });

  describe('isSameValue', function() {
    it('should return true if value of tile equals given value', function() {
      expect(tile.isSameValue('1A')).true;
    });
  });

  describe('getValue', function() {
    it('should return true if value of tile equals given value', function() {
      expect(tile.getValue()).to.equal('1A');
    });
  });
});
