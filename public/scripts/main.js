const joinGame = function() {
  const gameID = document.getElementById('game-id').value;
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
      const messageBox = document.getElementById('msg');
      messageBox.innerText = 'Waiting for other players to join...';
      if (error) {
        messageBox.innerText = message;
        return;
      }
      document.getElementById('join-game-box').style.display = 'none';
    });
};

window.onload = function() {
  const joinGameButton = document.getElementById('join-game-btn');
  joinGameButton.onclick = joinGame;
};
