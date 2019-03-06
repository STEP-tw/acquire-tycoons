class TurnManager {
  constructor(orderedPlayerIds, currentPlayerIndex = 0) {
    this.orderedPlayerIds = orderedPlayerIds;
    this.currentPlayerIndex = currentPlayerIndex;
    this.currentPlayerAction = new Object();
    this.stack = new Object();
    this.isActionGlobal = false;
  }

  setActionGlobal() {
    this.isActionGlobal = true;
  }

  isCurrentPlayer(id) {
    return (
      this.isActionGlobal ||
      this.orderedPlayerIds[this.currentPlayerIndex] == id
    );
  }

  changeTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.orderedPlayerIds.length;
    // this.resetStack();
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

  resetStack() {
    this.stack = new Object();
  }
}

module.exports = TurnManager;
