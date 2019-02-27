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
    // if (error) {
    //   displayPlayerStatus(document, message);
    //   return;
    // }
    disablePlayerTiles(document);
    tile.style.opacity = 0;
    fetchGameData(document);
  })();
};

const disablePlayerTiles = function(document) {
  const tiles = document.getElementById('player-tiles-container').children;
  for (const tile of tiles) {
    tile.classList.add('disabled');
    tile.onclick = '';
  }
};

const createElement = function(document, elementName, attributes) {
  const element = document.createElement(elementName);
  Object.keys(attributes).forEach(attribute => {
    element[attribute] = attributes[attribute];
  });
  return element;
};

const appendChildren = function(container, children) {
  children.forEach(child => container.appendChild(child));
};

const generateGameBoard = function(document) {
  const gameBoardContainer = document.getElementById('game-board-container');

  const boardAttributes = { className: 'game-board' };
  const board = createElement(document, 'table', boardAttributes);

  const boardBody = document.createElement('tbody');
  board.appendChild(boardBody);

  const rowAlphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const columnNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const boardRows = rowAlphabets.map(rowAlphabet => {
    const cells = columnNumbers.map(columnNumber => {
      const cellValue = columnNumber + rowAlphabet;
      const cellAttributes = {
        className: 'board-tile',
        innerText: cellValue,
        id: `board-tile-${cellValue}`
      };
      return createElement(document, 'td', cellAttributes);
    });

    const row = document.createElement('tr');
    appendChildren(row, cells);
    return row;
  });

  appendChildren(boardBody, boardRows);
  gameBoardContainer.appendChild(board);
};

const getClassNameForCorporation = function(corporation) {
  const tileClasses = {
    unIncorporated: 'unincorporated-tile',
    Hydra: 'hydra-color',
    Zeta: 'zeta-color',
    Sackson: 'sackson-color',
    America: 'america-color',
    Fusion: 'fusion-color',
    Phoenix: 'phoenix-color',
    Quantum: 'quantum-color'
  };

  return tileClasses[corporation];
};

const displayBoard = function(document, boardTiles, lastPlacedTileId) {
  boardTiles.forEach(tileData => {
    const { id, corporation } = tileData;
    const tile = document.getElementById(`board-tile-${id}`);
    tile.className = 'board-tile';
    tile.classList.add(getClassNameForCorporation(corporation));
  });

  if (!lastPlacedTileId) {
    return;
  }

  const lastPlacedTile = document.getElementById(
    `board-tile-${lastPlacedTileId}`
  );

  lastPlacedTile.classList.add('last-placed-tile');
};

const createTableCell = function(document, cellValue) {
  const cell = document.createElement('td');
  cell.innerText = cellValue;
  return cell;
};

const displayCorporationDetails = function(document, corporations) {
  const corporationDetailsBody = document.getElementById(
    'corporation-details-body'
  );

  corporations.forEach(corporation => {
    const { name, size, marketPrice, availableStocks } = corporation;

    const rowAttributes = { className: getClassNameForCorporation(name) };
    const corporationRow = createElement(document, 'tr', rowAttributes);

    const nameCell = createTableCell(document, name);
    const sizeCell = createTableCell(document, size);
    const marketPriceCell = createTableCell(document, marketPrice);
    const availableStocksCell = createTableCell(document, availableStocks);

    const rowCells = [nameCell, sizeCell, marketPriceCell, availableStocksCell];
    appendChildren(corporationRow, rowCells);
    corporationDetailsBody.appendChild(corporationRow);
  });
};

const displayPlayers = function(document, playersData) {
  const playerNamesContainer = document.getElementById(
    'player-names-container'
  );

  const { playerNames, currentPlayerIndex } = playersData;
  const playerNameHolders = playerNames.map(playerName => {
    const holderAttributes = {
      className: 'player-name',
      innerText: playerName
    };

    const playerNameHolder = createElement(document, 'div', holderAttributes);

    return playerNameHolder;
  });

  const currentPlayerHolder = playerNameHolders[currentPlayerIndex];
  currentPlayerHolder.classList.add('current-player');

  appendChildren(playerNamesContainer, playerNameHolders);
};

const greetPlayer = function(document, name) {
  const playerNameHeader = document.getElementById('player-name');
  playerNameHeader.innerText = `Hi ${name}!`;
};

const displayPlayerTiles = function(document, tileValues) {
  const tilesContainer = document.getElementById('player-tiles-container');
  tileValues.forEach(tileValue => {
    const tileAttributes = {
      className: 'player-tile disabled',
      innerText: tileValue,
      id: tileValue
    };
    const tile = createElement(document, 'div', tileAttributes);
    tilesContainer.appendChild(tile);
  });
};

const showGameResults = function(id, document, gameResults) {
  clearInterval(id);
  const gameResultsHtml = gameResults
    .map(gameResult => {
      const { playerName, rank, money } = gameResult;
      return `<tr><td>${rank}</td><td>${playerName}</td><td>${money}</td></tr>`;
    })
    .join('');
  document.getElementById('game-end-overlay').style.display = 'flex';
  document.getElementById('game-end-overlay').style.zIndex = 0;
  document.getElementById('game-results-body').innerHTML = gameResultsHtml;
};

const displayPlayerMoney = function(document, money) {
  const playerMoneyHolder = document.getElementById('player-money');
  playerMoneyHolder.innerText = `$${money}`;
};

const displayPlayerStocks = function(document, stocks) {
  const playerStocksContainer = document.getElementById(
    'player-stocks-container'
  );

  stocks.forEach(stock => {
    const { name, value } = stock;

    const stockContainerAttributes = { className: `player-stock` };
    const stockContainer = createElement(
      document,
      'div',
      stockContainerAttributes
    );

    stockContainer.classList.add(getClassNameForCorporation(name));

    const corporationNameHolder = document.createElement('p');
    corporationNameHolder.innerText = name;

    const stockCountAttributes = { className: 'stock-count', innerText: value };
    const stockCountHolder = createElement(
      document,
      'div',
      stockCountAttributes
    );

    stockContainer.appendChild(corporationNameHolder);
    stockContainer.appendChild(stockCountHolder);

    playerStocksContainer.appendChild(stockContainer);
  });
};

const displayPlayerStatus = function(document, status) {
  const playerLogContainer = document.getElementById('player-log');
  playerLogContainer.innerText = status;
};

const clearGameScreen = function(document) {
  const playerLogContainer = document.getElementById('player-log');
  const playerStocksContainer = document.getElementById(
    'player-stocks-container'
  );
  const playerMoneyHolder = document.getElementById('player-money');
  const tilesContainer = document.getElementById('player-tiles-container');
  const playerNamesContainer = document.getElementById(
    'player-names-container'
  );
  const corporationDetailsBody = document.getElementById(
    'corporation-details-body'
  );
  const activityLog = document.getElementById('activity-log');

  const gameElements = [
    activityLog,
    playerLogContainer,
    playerStocksContainer,
    playerMoneyHolder,
    tilesContainer,
    playerNamesContainer,
    corporationDetailsBody
  ];

  gameElements.forEach(gameElement => (gameElement.innerHTML = ''));
};

const displayActivityLog = function(document, logs) {
  let activityLog = document.getElementById('activity-log');
  logs.map(({ log, timeStamp }) => {
    let logItem = document.createElement('li');
    const messageAttributes = { className: 'activity-log-msg', innerText: log };
    const messageContainer = createElement(document, 'span', messageAttributes);

    const localeTime = new Date(timeStamp).toLocaleTimeString('en-IN');
    const timeAttributes = {
      className: 'activity-log-time',
      innerText: localeTime
    };

    const timeHolder = createElement(document, 'span', timeAttributes);

    logItem.appendChild(messageContainer);
    logItem.appendChild(timeHolder);

    activityLog.appendChild(logItem);
  });
};

const displayPlayerInformation = function(document, playerData) {
  const { name, tiles, money, stocks, status } = playerData;
  greetPlayer(document, name);
  displayPlayerTiles(document, tiles);
  displayPlayerMoney(document, money);
  displayPlayerStocks(document, stocks);
  displayPlayerStatus(document, status);
};

const displayGame = function(document, gameData) {
  displayActivityLog(document, gameData.logs);
  displayBoard(document, gameData.board, gameData.lastPlacedTileId);
  displayCorporationDetails(document, gameData.corporations);
  displayPlayers(document, gameData.players);
  displayPlayerInformation(document, gameData.player);
};

const removeWaitingArea = function(document) {
  const waitingArea = document.getElementById('waiting-area');
  setTimeout(() => waitingArea.remove(), 500);
};

const showGameContainer = function(document) {
  const gameContainer = document.getElementById('game-container');
  gameContainer.style.display = 'block';
  const header = document.getElementById('game-header');
  header.style.display = 'flex';
};

const setOnClickForTiles = function(document) {
  const tiles = document.getElementById('player-tiles-container').children;
  for (const tile of tiles) {
    tile.classList.remove('disabled');
    tile.onclick = placeTile.bind(null, document);
  }
};

const performAction = function(id, document, action) {
  if (action.name != 'DO_NOTHING') clearInterval(id);
  const actions = {
    PLACE_A_TILE: setOnClickForTiles,
    FOUND_CORPORATION: showEstablishCorporationPopup,
    DO_NOTHING: () => {},
    BUY_STOCKS: generateBuyStockContainer,
    END_GAME: showGameResults.bind(null, id)
  };
  actions[action.name](document, action.data);
};

const fetchGameData = function(document) {
  const gameDataIntervalId = setInterval(() => {
    fetch('/game-data', { method: 'GET', credentials: 'same-origin' })
      .then(response => response.json())
      .then(gameData => {
        showGameContainer(document);
        clearGameScreen(document);
        displayGame(document, gameData);
        performAction(gameDataIntervalId, document, gameData.action);
      });
  }, 1000);
};

const showJoinedPlayerNames = function(document, playerNames) {
  const joinedPlayerNamesContainer = document.getElementById(
    'joined-player-names'
  );
  joinedPlayerNamesContainer.innerHTML = '';
  playerNames.forEach(playerName => {
    const playerNameHolder = document.createElement('p');
    playerNameHolder.innerText = `${playerName} joined the game.`;
    joinedPlayerNamesContainer.appendChild(playerNameHolder);
  });
};

const checkGameStatus = function(document) {
  const gameStatusIntervalId = setInterval(() => {
    fetch('/game-status', {
      method: 'GET',
      credentials: 'same-origin'
    })
      .then(response => response.json())
      .then(data => {
        const { isStarted, playerNames } = data;
        showJoinedPlayerNames(document, playerNames);
        if (isStarted) {
          removeWaitingArea(document);
          fetchGameData(document);
          clearInterval(gameStatusIntervalId);
          return;
        }
        document.getElementById('joined-player-names').style.display = 'block';
      });
  }, 2000);
};

const initialize = function(document) {
  generateGameBoard(document);
  const header = document.getElementById('game-header');
  header.style.display = 'none';
  checkGameStatus(document);
};

window.onload = initialize.bind(null, document);
