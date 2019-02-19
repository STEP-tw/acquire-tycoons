class Game {
  constructor(maxPlayers, random) {
    this.maxPlayers = maxPlayers;
    this.random = random;
    this.players = {};
    this.latestPlayerId = 0;
    this.corporations;
    this.faceDownCluster;
    this.uninCorporatedTiles = [];
    this.isStarted = false;
  }

  addPlayer(player) {
    this.latestPlayerId += 1;
    this.players[this.latestPlayerId] = player;
    return this.latestPlayerId;
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
    return tiles;
  }

  getInitialTiles() {
    this.uninCorporatedTiles = this.getNRandomTiles(this.latestPlayerId);
  }

  getInitialTilesForPlayer() {
    Object.keys(this.players).forEach(player => {
      const tiles = this.getNRandomTiles(6);
      tiles.forEach(tile => this.players[player].addTile(tile));
    });
  }

  initialize(corporations, faceDownCluster) {
    this.faceDownCluster = faceDownCluster;
    this.corporations = corporations;
    this.getInitialTiles();
    this.getInitialTilesForPlayer();
    this.isStarted = true;
  }

  getPlayersCount() {
    return Object.keys(this.players).length;
  }

  getUnincorporatedTiles() {
    return this.uninCorporatedTiles;
  }

  isFull() {
    return this.getPlayersCount() == this.maxPlayers;
  }

  getGameStatus() {
    return this.isStarted;
  }
}

module.exports = {Game};
