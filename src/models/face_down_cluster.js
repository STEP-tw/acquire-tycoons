class FaceDownCluster {
  constructor(tiles) {
    this.tiles = tiles;
  }

  getTile(index) {
    return this.tiles.splice(index, 1).pop();
  }

  getStrength() {
    return this.tiles.length;
  }

  removeTiles(predicate){
    this.tiles = this.tiles.filter(predicate);
  }
}

module.exports = FaceDownCluster;
