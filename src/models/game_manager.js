class GameManager {
  constructor() {
    this.games = new Object();
    this.latestGameId = 0;
  }

  addGame(game) {
    this.latestGameId += 1;
    this.games[this.latestGameId] = game;
  }

  getGameById(id) {
    return this.games[id];
  }

  doesGameExist(id) {
    return this.games[id] != undefined;
  }

  getLatestId() {
    return this.latestGameId;
  }
}

module.exports = GameManager;
