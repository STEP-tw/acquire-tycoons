const {Game} = require('../../src/models/game');
const {Player} = require('../../src/models/player');
const expect = require('chai').expect;
const sinon = require('sinon');
const tilesData = require('../../src/data/tiles_data.json');
const levelsData = require('../../src/data/level_data.json');
const corporationData = require('../../src/data/corporations_data.json');
const {getCorporations, getFaceDownCluster} = require('../../src/util.js');

describe('Game', function() {
  let game;
  beforeEach(function() {
    const random = sinon.stub();
    random.returns(0);
    const maxPlayers = 4;
    game = new Game(maxPlayers, random);
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

  describe('initialize', function() {
    it('getUnincorpratedTiles', function() {
      const player1 = new Player('Swagata');
      const player2 = new Player('Gayatri');
      const player3 = new Player('Arnab');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.getUnincorporatedTiles()).to.have.length(4);
    });

    it('getPlayersInitialTiles', function() {
      const player1 = new Player('Swagata');
      const player2 = new Player('Gayatri');
      const player3 = new Player('Arnab');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.players[1].getTiles()).to.have.length(6);
    });

    it('getRandomTile', function() {
      const player1 = new Player('Swagata');
      const player2 = new Player('Gayatri');
      const player3 = new Player('Arnab');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.getRandomTile()).to.deep.equal({
        position: {
          row: 2,
          column: 4
        },
        value: '5C'
      });
    });
  });

  describe('getGameStatus', function() {
    it('should return false when game is not initialized', function() {
      const player1 = new Player('Swagata');
      const player2 = new Player('Gayatri');
      const player3 = new Player('Arnab');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      expect(game.getGameStatus()).false;
    });

    it('should return true when game is initialized', function() {
      const player1 = new Player('Swagata');
      const player2 = new Player('Gayatri');
      const player3 = new Player('Arnab');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      const corporations = getCorporations(corporationData, levelsData);
      const faceDownCluster = getFaceDownCluster(tilesData);
      game.initialize(corporations, faceDownCluster);
      expect(game.getGameStatus()).true;
    });
  });
});
