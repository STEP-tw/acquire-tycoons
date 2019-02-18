class Game {
  constructor(maxPlayers) {
    this.maxPlayers = maxPlayers;
    this.players = {};
    this.latestPlayerId = 0;
  }

  addPlayer(player) {
    this.latestPlayerId += 1;
    this.players[this.latestPlayerId] = player;
    return this.latestPlayerId;
  }

  getPlayersCount() {
    return Object.keys(this.players).length;
  }

  isFull() {
    return this.getPlayersCount() == this.maxPlayers;
  }
}

module.exports = Game;
