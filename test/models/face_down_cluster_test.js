const {expect} = require('chai');

const {FaceDownCluster} = require('../../src/models/face_down_cluster.js');
const {Tile} = require('../../src/models/tile.js');

describe('FaceDownCluster', function() {
  describe('getRandomTile', function() {
    it('should return a tile and remove it from cluster', function() {
      const position = {row: 1, column: 1};
      const value = '1A';
      const tile = new Tile(position, value);
      const random = function() {
        return 0;
      };
      const cluster = new FaceDownCluster([tile], random);

      expect(cluster.getTile(random())).to.deep.equal({
        position: {row: 1, column: 1},
        value: '1A'
      });
    });
  });
});
