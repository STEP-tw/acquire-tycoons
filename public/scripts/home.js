const setDisplay = function(elementId, display) {
  const element = document.getElementById(elementId);
  element.style.display = display;
};

const joinGame = function() {
  const gameID = document.getElementById('game-id-field').value;
  const playerName = document.getElementById('player-name').value;

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
        const errorMessageBox = document.getElementById('join-error-box');
        errorMessageBox.innerText = message;
        return;
      }
      setDisplay('join-game-form', 'none');
      setDisplay('waiting-area', 'flex');
      checkGameStatus();
      document.getElementById('game-id').innerText = `Game ID: ${gameId}`;
    });
};

const checkGameStatus = function() {
  setInterval(() => {
    fetch('/game-status', {
      method: 'GET',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(data => {
        const { isStarted } = data;
        if (isStarted) {
          document.location.href = '/game';
          return;
        }
      });
  }, 2000);
};

const fetchGameId = function(requestData) {
  fetch('/host-game', requestData)
    .then(response => response.json())
    .then(resData => {
      const { gameId } = resData;
      setDisplay('create-game-form', 'none');
      setDisplay('waiting-area', 'flex');
      checkGameStatus();
      document.getElementById('game-id').innerText = `Game ID: ${gameId}`;
    });
};

const hostGame = function() {
  let host = document.getElementById('host-name').value;
  let totalPlayers = document.getElementById('total-players').value;
  if (host) {
    let requestData = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, totalPlayers })
    };
    fetchGameId(requestData);
    return;
  }
};

const initialize = function() {
  setDisplay('create-game-form', 'none');
  setDisplay('join-game-form', 'none');
  setDisplay('waiting-area', 'none');

  const createGameButton = document.getElementById('create-game-btn');

  createGameButton.onclick = function() {
    setDisplay('game-options-container', 'none');
    setDisplay('create-game-form', 'flex');
  };

  const joinGameButton = document.getElementById('join-game-btn');

  joinGameButton.onclick = function() {
    setDisplay('game-options-container', 'none');
    setDisplay('join-game-form', 'flex');
  };

  //For join game form
  const joinGameButtonPrime = document.getElementById('join-game-button-prime');
  joinGameButtonPrime.onclick = joinGame;

  //For create game form
  const createGameButtonPrime = document.getElementById(
    'create-game-button-prime'
  );
  createGameButtonPrime.onclick = hostGame;
};

window.onload = initialize;
