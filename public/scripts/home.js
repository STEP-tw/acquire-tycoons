const setDisplay = function(elementId, display) {
  const element = document.getElementById(elementId);
  element.style.display = display;
};

const renderHome = function() {
  setDisplay('user-guide', 'none');
  setDisplay('join-game-form', 'none');
  setDisplay('create-game-form', 'none');
  setDisplay('game-options-container', 'flex');
  document.getElementById('game-id-field').value = '';
  document.getElementById('player-name').value = '';
  document.getElementById('host-name').value = '';
  document.getElementById('total-players').value = '0';
  document.getElementById('join-error-box').innerText = '';
  document.getElementById('host-error-box').innerText = '';
};

const showUserGuide = function() {
  setDisplay('game-options-container', 'none');
  setDisplay('user-guide', 'flex');
  document.getElementById('user-guide-back-btn').onclick = renderHome;
};

const joinGame = function() {
  const gameID = document.getElementById('game-id-field').value;
  const playerName = document.getElementById('player-name').value;
  const errorMessageBox = document.getElementById('join-error-box');

  if (!gameID || !playerName) {
    errorMessageBox.innerText = "Game Id or Player Name fields can't be empty!";
    return;
  }

  const body = JSON.stringify({ gameID, playerName });
  const requestData = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body
  };

  fetch('/join-game', requestData)
    .then(response => response.json())
    .then(resData => {
      const { error, message } = resData;
      if (error) {
        errorMessageBox.innerText = message;
        return;
      }
      setDisplay('join-game-form', 'none');
      window.location.href = '/game';
    });
};

const fetchGameId = function(requestData) {
  fetch('/host-game', requestData)
    .then(response => response.json())
    .then(resData => {
      setDisplay('create-game-form', 'none');
      window.location.href = '/game';
    });
};

const hostGame = function() {
  let host = document.getElementById('host-name').value;
  let totalPlayers = document.getElementById('total-players').value;
  const errorMessageBox = document.getElementById('host-error-box');

  if (!host || !parseInt(totalPlayers)) {
    errorMessageBox.innerText =
      "Host Name or total players field can't be empty!";
    return;
  }

  let requestData = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host, totalPlayers })
  };
  fetchGameId(requestData);
  return;
};

const initialize = function() {
  setDisplay('create-game-form', 'none');
  setDisplay('join-game-form', 'none');
  setDisplay('user-guide', 'none');

  const createGameButton = document.getElementById('create-game-btn');

  createGameButton.onclick = function() {
    setDisplay('game-options-container', 'none');
    setDisplay('create-game-form', 'flex');
    document.getElementById('host-game-back-btn').onclick = renderHome;
  };

  const joinGameButton = document.getElementById('join-game-btn');

  joinGameButton.onclick = function() {
    setDisplay('game-options-container', 'none');
    setDisplay('join-game-form', 'flex');
    document.getElementById('join-game-back-btn').onclick = renderHome;
  };

  //For join game form
  const joinGameButtonPrime = document.getElementById('join-game-button-prime');
  joinGameButtonPrime.onclick = joinGame;

  //For create game form
  const createGameButtonPrime = document.getElementById(
    'create-game-button-prime'
  );
  createGameButtonPrime.onclick = hostGame;

  const userGuideButton = document.getElementById('user-guide-btn');
  userGuideButton.onclick = showUserGuide;
};

window.onload = initialize;