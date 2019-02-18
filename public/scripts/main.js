const createElement = function(tagName) {
  return document.createElement(tagName);
};

const addTag = function(tagName, content) {
  return `<${tagName}>${content}</${tagName}>`;
};

const createWaitingDivHtml = function(json) {
  let line = `Your gameId is ${json.gameId}.
    waiting for other players to join...`;
  let waitingHtml = addTag('p', line);
  return waitingHtml;
};

const createWaitingDiv = function(json) {
  let waitingDiv = createElement('div');
  waitingDiv.id = 'waiting-div';
  waitingDiv.innerHTML = createWaitingDivHtml(json);
  return waitingDiv;
};

const getElement = function(element) {
  return document.getElementById(element);
};

const fetchGameId = function(requestData) {
  fetch('/host-game', requestData)
    .then(response => response.json())
    .then(json => {
      getElement('body').replaceWith(createWaitingDiv(json));
    });
};

const hostGame = function() {
  let host = getElement('host-name').value;
  let totalPlayers = getElement('total-players').value;
  if (host) {
    let requestData = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({host, totalPlayers})
    };
    fetchGameId(requestData);
    return;
  }
  document.getElementById('error-message').innerText = 'empty host name';
};

const displayHostingDiv = function() {
  getElement('home-page').style.display = 'none';
  getElement('hosting-div').style.display = 'flex';
};

const initialize = function() {
  getElement('hosting-div').style.display = 'none';
};

window.onload = initialize;
