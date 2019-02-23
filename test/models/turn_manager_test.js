const { expect } = require('chai');

const TurnManager = require('../../src/models/turn_manager.js');

describe('TurnManager', function() {
  let turnManager;
  beforeEach(() => {
    const orderedPlayerIds = [5, 6, 3, 2, 4, 1];
    turnManager = new TurnManager(orderedPlayerIds);
  });

  it('When initiating turn manager: should set turn to index 0', function() {
    expect(turnManager.getCurrentPlayerIndex()).to.equal(0);
  });

  it('changeTurn: should change to turn to next player', function() {
    turnManager.changeTurn();
    expect(turnManager.getCurrentPlayerIndex()).to.equal(1);
  });

  it('isCurrentPlayer: should return true if current player id is same as given player id', function() {
    turnManager.changeTurn();
    expect(turnManager.isCurrentPlayer(6)).to.equal(true);
  });

  it('isCurrentPlayer: should return false if current player id is not same as given player id', function() {
    turnManager.changeTurn();
    expect(turnManager.isCurrentPlayer(5)).to.equal(false);
  });

  it('getAction: should return action as `DO_NOTHING` if current player id is not same as given player id', function() {
    expect(turnManager.getAction(6)).to.deep.equal({
      name: 'DO_NOTHING',
      data: {}
    });
  });

  it('getAction: should return defined action if current player id is same as given player id', function() {
    turnManager.changeAction({ name: 'PLACE_A_TILE', data: {} });
    expect(turnManager.getAction(5)).to.deep.equal({
      name: 'PLACE_A_TILE',
      data: {}
    });
  });

  it('getStack: should return stack', function() {
    expect(turnManager.getStack()).to.deep.equal({});
  });
});
