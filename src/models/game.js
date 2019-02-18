class Game {
  constructor(noOfPlayers) {
    this.noOfPlayers = noOfPlayers;
    this.players = new Object();
    this.corporations = new Array();
    this.incorporatedTiles = new Array();
    this.currentTurn = new Object();
    this.faceDownCluster = new Object();
    this.latestPlayerId = 0;
  }
  addPlayer(player) {
    this.latestPlayerId += 1;
    this.players[this.latestPlayerId] = player;
  }
}

module.exports = Game;
