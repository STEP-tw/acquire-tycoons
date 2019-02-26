const validateGameSession = function(req, res, next) {
  if (!res.app.urlsToValidateGame.includes(req.url)) {
    next();
    return;
  }
  const { gameId, playerId } = req.cookies;
  const game = res.app.gameManager.getGameById(gameId);
  if (!game) {
    return res.send({ error: true, message: `No Such Game with ID ${gameId}` });
  }

  const player = game.getPlayerById(playerId);
  if (!player) {
    return res.send({
      error: true,
      message: `No Such Player with ID ${playerId}`
    });
  }

  req.game = game;
  next();
};

const validateTurn = function(req, res, next) {
  if (!res.app.urlsToValidateTurn.includes(req.url)) {
    next();
    return;
  }

  const { playerId } = req.cookies;
  const game = req.game;
  if (!game.isCurrentPlayer(playerId)) {
    return res.send({ error: true, message: 'It\'s not your turn' });
  }
  next();
};

module.exports = { validateGameSession, validateTurn };
