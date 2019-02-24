const { expect } = require('chai');
const levelsData = require('../../src/data/level_data.json');
const Level = require('../../src/models/level.js');
const Tile = require('../../src/models/tile.js');
const Corporation = require('../../src/models/corporation.js');
const { random, getTileWithCorporationName } = require('../../src/util.js');

describe('random', function() {
  it('testing Math.random', () => {
    expect(random(1)).to.equal(0);
  });
});

describe('getTileWithCorporationName', function() {
  const corporation = new Corporation('Sackson', new Level(levelsData));
  it('should return tile value with its corporation', function() {
    const position = {
      row: 0,
      column: 2
    };
    const value = '3A';
    const tile = new Tile(position, value);
    corporation.addTile(tile);
    const expectedOutput = [
      {
        id: '3A',
        corporation: 'Sackson'
      }
    ];
    expect(getTileWithCorporationName(corporation)).to.deep.equal(
      expectedOutput
    );
  });
});
