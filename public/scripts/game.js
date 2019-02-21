const createElement = function(document, tagName) {
  return document.createElement(tagName);
};

const generateBoardIds = function(rowIds, columnIds) {
  return rowIds.map(row => {
    return columnIds.map(column => '' + column + row);
  });
};

const generateIds = function(length) {
  return new Array(length).fill('').map((elem, index) => elem + (index + 1));
};

const appendChilds = function(mainDiv, childs) {
  childs.forEach(child => {
    mainDiv.appendChild(child);
  });
};

const objectMapper = function(object, mapper) {
  return Object.keys(object).map(key => mapper(key, object[key]));
};

const setAttribute = function(tag, attribute, value) {
  tag[attribute] = value;
};

const createTagWithAttributes = function(document, tagName, attributes) {
  const tag = createElement(document, tagName);
  objectMapper(attributes, setAttribute.bind(null, tag));
  return tag;
};

const createCell = function(document, id) {
  const attributes = {
    id: id,
    innerText: id
  };
  return createTagWithAttributes(document, 'td', attributes);
};

const createRow = function(document, rowIds) {
  const row = createElement(document, 'tr');
  const cells = rowIds.map(createCell.bind(null, document));
  appendChilds(row, cells);
  return row;
};

const createTableBody = function(document) {
  const rowIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const columnIds = generateIds(12);
  const cellIds = generateBoardIds(rowIds, columnIds);
  const body = createElement(document, 'tbody');
  const rows = cellIds.map(createRow.bind(null, document));
  appendChilds(body, rows);
  return body;
};

const createGameBoard = function(document) {
  const table = createElement(document, 'table');
  const tableBody = createTableBody(document);
  table.appendChild(tableBody);
  setAttribute(table, 'className', 'board');
  return table;
};

const displayBoard = function(document, tiles) {
  tiles.forEach(({ id, corporation }) => {
    const cell = document.getElementById(id);
    setAttribute(cell, 'className', corporation);
    cell.style.border = '1px solid black';
  });
};

const initializeBoard = function(document) {
  const board = createGameBoard(document);
  const gameBoardDiv = document.getElementById('game-board');
  gameBoardDiv.appendChild(board);
};

const createPlayerDiv = function(document, player) {
  const attributes = {
    innerText: player
  };
  return createTagWithAttributes(document, 'div', attributes);
};

const displayPlayers = function(document, { playerNames, currentPlayerIndex }) {
  const playersDiv = document.getElementById('players');
  playersDiv.innerHTML = '';
  const players = playerNames.map(createPlayerDiv.bind(null, document));
  setAttribute(players[currentPlayerIndex], 'className', 'currentTurn');
  appendChilds(playersDiv, players);
};

const createCorporationCell = function(document, name, value) {
  const attributes = {
    innerText: value
  };
  return createTagWithAttributes(document, 'td', attributes);
};

const createCorporationRow = function(document, corporationData) {
  const tr = createTagWithAttributes(document, 'tr', {
    className: corporationData.name
  });
  const corporationCells = objectMapper(
    corporationData,
    createCorporationCell.bind(null, document)
  );
  appendChilds(tr, corporationCells);
  return tr;
};

const displayCorporations = function(document, corporationsData) {
  const corporationsDiv = document.getElementById('corporations');
  corporationsDiv.innerHTML = '';
  const corporations = corporationsData.map(
    createCorporationRow.bind(null, document)
  );
  appendChilds(corporationsDiv, corporations);
};

const displayMoney = function(document, money) {
  const moneyHolder = document.getElementById('money');
  setAttribute(moneyHolder, 'innerText', money);
};

const displayStatus = function(document, statusMsg) {
  const statusDiv = document.getElementById('status');
  setAttribute(statusDiv, 'innerText', statusMsg);
};

const placeTile = function(document) {
  const tile = event.target;
  const tileValue = tile.id;

  (async function() {
    const reqData = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ tileValue })
    };

    const response = await fetch('/place-tile', reqData);
    const { error, message } = await response.json();
    if (error) {
      displayStatus(document, message);
      return;
    }
    tile.style.opacity = 0;
    fetchGameData(document);
    setTimeout(() => {
      tile.remove();
    }, 1000);
  })();
};

const getTileButton = function(document, tile) {
  const attributes = {
    className: 'tile disabled',
    id: tile,
    innerText: tile
  };
  return createTagWithAttributes(document, 'button', attributes);
};

const displayTiles = function(document, tilesData) {
  const tilesDiv = document.getElementById('tiles');
  tilesDiv.innerHTML = '';
  const tiles = tilesData.map(getTileButton.bind(null, document));
  appendChilds(tilesDiv, tiles);
};

const createLabel = function(document, key, value) {
  return createTagWithAttributes(document, 'label', { innerText: value });
};

const createStockDiv = function(document, stockDetail) {
  const attributes = { className: stockDetail.name };
  const stockDiv = createTagWithAttributes(document, 'div', attributes);
  const stockLabels = objectMapper(
    stockDetail,
    createLabel.bind(null, document)
  );
  appendChilds(stockDiv, stockLabels);
  return stockDiv;
};

const displayStocks = function(document, stockDetails) {
  const stocksDiv = document.getElementById('stocks');
  stocksDiv.innerHTML = '';
  const stocks = stockDetails.map(createStockDiv.bind(null, document));
  appendChilds(stocksDiv, stocks);
};

const highlightLastPlacedTile = function(document, tileId) {
  document.getElementById(tileId).style.border = '2px solid red';
};

const displayGame = function(document, gameData) {
  displayBoard(document, gameData.board);
  displayPlayers(document, gameData.players);
  displayCorporations(document, gameData.corporations);
  displayMoney(document, gameData.player.money);
  displayTiles(document, gameData.player.tiles);
  displayStocks(document, gameData.player.stocks);
  displayStatus(document, gameData.player.status);
  highlightLastPlacedTile(document, gameData.lastPlacedTileId);
};

const removeWaitingArea = function(document) {
  const waitingArea = document.getElementById('waiting-area');
  waitingArea.parentNode.removeChild(waitingArea);
};

const showGameContainer = function(document) {
  const gameContainer = document.getElementById('game-container');
  gameContainer.style.display = 'block';
  const header = document.getElementById('game-header');
  header.style.display = 'flex';
};

const setOnClickForTiles = function(document) {
  const tiles = document.getElementById('tiles').children;
  for (const tile of tiles) {
    tile.className = 'tile enabled';
    tile.onclick = placeTile.bind(null, document);
  }
};

const performAction = function(id, document, action) {
  if (action.name != 'DO_NOTHING') clearInterval(id);
  const actions = {
    PLACE_A_TILE: setOnClickForTiles,
    DO_NOTHING: () => {}
  };
  actions[action.name](document, action.data);
};

const fetchGameData = function(document) {
  const gameDataIntervalId = setInterval(() => {
    fetch('/game-data', { method: 'GET', credentials: 'same-origin' })
      .then(response => response.json())
      .then(gameData => {
        showGameContainer(document);
        displayGame(document, gameData);
        performAction(gameDataIntervalId, document, gameData.action);
      });
  }, 1000);
};

const checkGameStatus = function(document) {
  const gameStatusIntervalId = setInterval(() => {
    fetch('/game-status', {
      method: 'GET',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(data => {
        const { isStarted } = data;
        if (isStarted) {
          removeWaitingArea(document);
          fetchGameData(document);
          clearInterval(gameStatusIntervalId);
          return;
        }
      });
  }, 2000);
};

const initialize = function(document) {
  initializeBoard(document);
  const header = document.getElementById('game-header');
  header.style.display = 'none';
  checkGameStatus(document);
  document.getElementById('activity-log-icon').onclick = showLog;
};

const createLogHtml = function({ log, time }) {
  const div = createElement(document, 'div');
  setAttribute(div, 'className', 'log-message');

  const logSpan = createElement(document, 'span');
  logSpan.innerText = log;

  const timeSpan = createElement(document, 'span');
  timeSpan.innerText = time;

  div.appendChild(logSpan);
  div.appendChild(timeSpan);

  return div;
};

const closeOverlay = function() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('overlay').style.zIndex = 1;
};

const showLog = function() {
  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('overlay').style.zIndex = 0;
  document.getElementById('close-overlay-btn').onclick = closeOverlay;

  fetch('/log')
    .then(response => response.json())
    .then(logsData => {
      let logs = logsData.map(createLogHtml);

      const activityLog = document.getElementById('activity-log-body');
      activityLog.innerHTML = '';

      appendChilds(activityLog, logs);
    });
};

window.onload = initialize.bind(null, document);
