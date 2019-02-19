class FaceDownCluster {
  constructor(tiles, randomNumberGenerator) {
    this.tiles = tiles;
    this.random = randomNumberGenerator;
  }

  getTile(index) {
    return this.tiles.splice(index, 1).pop();
  }

  getStrength() {
    return this.tiles.length;
  }
}

module.exports = {FaceDownCluster};
