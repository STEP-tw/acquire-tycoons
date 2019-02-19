const {Game} = require('./models/game');
const {Player} = require('./models/player');
const {initializeGame} = require('./util.js');

const addUtility = function(requiredFunctions, req, res, next) {
  req.app = {};
  Object.keys(requiredFunctions).forEach(
    funcRef => (req.app[funcRef] = requiredFunctions[funcRef])
  );
  next();
};

const hostGame = function(req, res) {
  let {host, totalPlayers} = req.body;
  let game = new Game(totalPlayers, req.app.random);
  let hostPlayer = new Player(host);
  let playerId = game.addPlayer(hostPlayer);
  res.app.gameManager.addGame(game);
  let gameId = res.app.gameManager.getLatestId();
  res.cookie('gameId', `${gameId}`);
  res.cookie('playerId', `${playerId}`);
  res.send({gameId});
};

const joinGame = function(req, res) {
  const {gameID, playerName} = req.body;
  const {gameManager} = res.app;

  if (!gameManager.doesGameExist(gameID)) {
    res.send({error: true, message: `No Such Game with ID ${gameID}`});
    return;
  }

  const game = gameManager.getGameById(gameID);

  if (game.isFull()) {
    res.send({error: true, message: 'Sorry! Game has already started.'});
    return;
  }

  const player = new Player(playerName);
  let playerId = game.addPlayer(player);
  if (game.isFull()) {
    initializeGame(game);
  }
  res.cookie('gameId', `${gameID}`);
  res.cookie('playerId', `${playerId}`);
  res.send({error: false, message: ''});
};

const getGameStatus = function(req, res) {
  let {gameId} = req.cookies;
  let game = res.app.gameManager.getGameById(gameId);
  let gameStatus = game.isFull();
  let totalJoinedPlayers = game.getPlayersCount();
  res.send({isStarted: gameStatus, totalJoinedPlayers});
};

const renderGamePage = function(req, res) {
  const {gameId} = req.cookies;
  if (!res.app.gameManager.doesGameExist(gameId)) {
    res.redirect('/');
    return;
  }
  res.render('game.html', {gameId});
};

const serveGameData = function(req, res) {
  const gameData = {
    board: [
      {id: '5A', corporation: 'unincorporated'},
      {id: '5B', corporation: 'unincorporated'},
      {id: '11B', corporation: 'unincorporated'},
      {id: '8I', corporation: 'unincorporated'}
    ],
    corporations: [
      {
        name: 'Quantum',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      },
      {
        name: 'Phoenix',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      },
      {
        name: 'Fusion',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      },
      {
        name: 'Hydra',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      },
      {
        name: 'America',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      },
      {
        name: 'Zeta',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      },
      {
        name: 'Sackson',
        size: 0,
        marketPrice: 0,
        availableStocks: 25
      }
    ],
    players: {
      playerNames: ['Arnab', 'Dheeraj', 'Swagata', 'Sai'],
      currPlayerIndex: 0
    },
    player: {
      tiles: ['1B', '2C', '3F', '4G', '10C', '11D'],
      stocks: [],
      money: 6000,
      status: 'Welcome'
    }
  };

  res.send(gameData);
};

module.exports = {
  hostGame,
  joinGame,
  getGameStatus,
  renderGamePage,
  serveGameData,
  addUtility
};
