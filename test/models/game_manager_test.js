const GameManager = require('../../src/models/game_manager');
const { Game } = require('../../src/models/game');
const expect = require('chai').expect;

describe('Game Manager', () => {
  const maxPlayers = 4;
  const game = new Game(maxPlayers);
  const gameManager = new GameManager();
  gameManager.addGame(game);

  it('addGame : should add game with unique id', () => {
    expect(gameManager.games)
      .to.have.property('1')
      .instanceOf(Game);
  });
  describe('doesGameExist ', function() {
    it('should return true if the given id is valid', function() {
      expect(gameManager.doesGameExist(1)).to.equal(true);
    });
  });
});
