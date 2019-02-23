class TurnManager {
  constructor(orderedPlayerIds, currentPlayerIndex = 0) {
    this.orderedPlayerIds = orderedPlayerIds;
    this.currentPlayerIndex = currentPlayerIndex;
    this.currentPlayerAction = {};
    this.stack = {};
  }

  changeTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.orderedPlayerIds.length;
  }

  isCurrentPlayer(id) {
    return this.orderedPlayerIds[this.currentPlayerIndex] == id;
  }

  changeAction(action) {
    this.currentPlayerAction = action;
  }

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex;
  }

  getAction(playerId) {
    if (this.isCurrentPlayer(playerId)) {
      return this.currentPlayerAction;
    }
    return { name: 'DO_NOTHING', data: {} };
  }

  addStack(key, value) {
    this.stack[key] = value;
  }

  getStack() {
    return this.stack;
  }
}

module.exports = TurnManager;
