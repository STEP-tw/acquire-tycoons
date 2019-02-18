const Game = require('../../src/models/game');
const Player = require('../../src/models/player');
const expect = require('chai').expect;

describe('Game', function() {
  let game;
  beforeEach(function() {
    const maxPlayers = 4;
    game = new Game(maxPlayers);
    const player = new Player('Dhiru');
    game.addPlayer(player);
  });
  it('addPlayer: should add player to game', function() {
    expect(game.players)
      .to.have.property('1')
      .to.have.property('name')
      .to.equal('Dhiru');
  });
  it('getPlayersCount: should return current number of players', function() {
    expect(game.getPlayersCount()).to.equal(1);
  });

  describe('isFull', function() {
    it('should return true when current player number is equal to maximum player number', function() {
      const player1 = new Player('Swagata');
      const player2 = new Player('Gayatri');
      const player3 = new Player('Arnab');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      expect(game.isFull()).to.equal(true);
    });

    it('should return false when current player number is not equal to maximum player number', function() {
      expect(game.isFull()).to.equal(false);
    });
  });
});
