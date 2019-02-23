const createElement = function (document, tagName) {
	return document.createElement(tagName);
};

const generateBoardIds = function (rowIds, columnIds) {
	return rowIds.map(row => {
		return columnIds.map(column => '' + column + row);
	});
};

const generateIds = function (length) {
	return new Array(length).fill('').map((elem, index) => elem + (index + 1));
};

const appendChilds = function (mainDiv, childs) {
	childs.forEach(child => {
		mainDiv.appendChild(child);
	});
};

const objectMapper = function (object, mapper) {
	return Object.keys(object).map(key => mapper(key, object[key]));
};

const setAttribute = function (tag, attribute, value) {
	tag[attribute] = value;
};

const createTagWithAttributes = function (document, tagName, attributes) {
	const tag = createElement(document, tagName);
	objectMapper(attributes, setAttribute.bind(null, tag));
	return tag;
};

const createCell = function (document, id) {
	const attributes = {
		id: id,
		innerText: id
	};
	return createTagWithAttributes(document, 'td', attributes);
};

const createRow = function (document, rowIds) {
	const row = createElement(document, 'tr');
	const cells = rowIds.map(createCell.bind(null, document));
	appendChilds(row, cells);
	return row;
};

const createTableBody = function (document) {
	const rowIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
	const columnIds = generateIds(12);
	const cellIds = generateBoardIds(rowIds, columnIds);
	const body = createElement(document, 'tbody');
	const rows = cellIds.map(createRow.bind(null, document));
	appendChilds(body, rows);
	return body;
};

const createGameBoard = function (document) {
	const table = createElement(document, 'table');
	const tableBody = createTableBody(document);
	table.appendChild(tableBody);
	setAttribute(table, 'className', 'board');
	return table;
};

const displayBoard = function (document, tiles) {
	tiles.forEach(({ id, corporation }) => {
		const cell = document.getElementById(id);
		setAttribute(cell, 'className', corporation);
		cell.style.border = '1px solid black';
	});
};

const initializeBoard = function (document) {
	const board = createGameBoard(document);
	const gameBoardDiv = document.getElementById('game-board');
	gameBoardDiv.appendChild(board);
};

const createPlayerDiv = function (document, player) {
	const attributes = {
		innerText: player
	};
	return createTagWithAttributes(document, 'div', attributes);
};

const displayPlayers = function (document, { playerNames, currentPlayerIndex }) {
	const playersDiv = document.getElementById('players');
	playersDiv.innerHTML = '';
	const players = playerNames.map(createPlayerDiv.bind(null, document));
	setAttribute(players[currentPlayerIndex], 'className', 'currentTurn');
	appendChilds(playersDiv, players);
};

const createCorporationCell = function (document, name, value) {
	const attributes = {
		innerText: value
	};
	return createTagWithAttributes(document, 'td', attributes);
};

const createCorporationRow = function (document, corporationData) {
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

const displayCorporations = function (document, corporationsData) {
	const corporationsDiv = document.getElementById('corporations');
	corporationsDiv.innerHTML = '';
	const corporations = corporationsData.map(
		createCorporationRow.bind(null, document)
	);
	appendChilds(corporationsDiv, corporations);
};

const displayMoney = function (document, money) {
	const moneyHolder = document.getElementById('money');
	setAttribute(moneyHolder, 'innerText', money);
};

const displayStatus = function (document, statusMsg) {
	const statusDiv = document.getElementById('status');
	setAttribute(statusDiv, 'innerText', statusMsg);
};

const disablePlayerTiles = function (document) {
	const tiles = document.getElementById('tiles').children;
	for (const tile of tiles) {
		tile.className = 'tile disabled';
		tile.onclick = '';
	}
};

const placeTile = function (document) {
	const tile = event.target;
	const tileValue = tile.id;
	disablePlayerTiles(document);
	(async function () {
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
	})();
};

const createCorporationsHtml = function (corporations) {
	const corporationNames = corporations.map(corporation => corporation.name);
	return corporationNames
		.map(
			name =>
				`<button id="${name}-btn" class="${name} ${name}-btn"  
        onclick="foundSelectedCorporation('${name}')">${name}</button>`
		)
		.join('');
};

const foundSelectedCorporation = function (corporationName) {
	closeOverlay('found-corporation-overlay');
	fetch('/establish-corporation', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({ corporationName })
	}).then(() => {
		fetchGameData(document);
	});
};

const foundCorporation = function (document, corporations) {
	document.getElementById('found-corporation-overlay').style.display = 'flex';
	document.getElementById('found-corporation-overlay').style.zIndex = 0;
	document.getElementById('found-corporation').style.display = 'flex';
	const corporationsHtml = createCorporationsHtml(corporations);
	document.getElementById('corporation-btns').innerHTML = corporationsHtml;
};

const getTileButton = function (document, tile) {
	const attributes = {
		className: 'tile disabled',
		id: tile,
		innerText: tile
	};
	return createTagWithAttributes(document, 'button', attributes);
};

const displayTiles = function (document, tilesData) {
	const tilesDiv = document.getElementById('tiles');
	tilesDiv.innerHTML = '';
	const tiles = tilesData.map(getTileButton.bind(null, document));
	appendChilds(tilesDiv, tiles);
};

const createLabel = function (document, key, value) {
	return createTagWithAttributes(document, 'label', { innerText: value });
};

const createStockDiv = function (document, stockDetail) {
	const attributes = { className: stockDetail.name };
	const stockDiv = createTagWithAttributes(document, 'div', attributes);
	const stockLabels = objectMapper(
		stockDetail,
		createLabel.bind(null, document)
	);
	appendChilds(stockDiv, stockLabels);
	return stockDiv;
};

const displayStocks = function (document, stockDetails) {
	const stocksDiv = document.getElementById('stocks');
	stocksDiv.innerHTML = '';
	const stocks = stockDetails.map(createStockDiv.bind(null, document));
	appendChilds(stocksDiv, stocks);
};

const highlightLastPlacedTile = function (document, tileId) {
	if (tileId == undefined) return;
	document.getElementById(tileId).style.border = '2px solid red';
};

const displayGame = function (document, gameData) {
	displayBoard(document, gameData.board);
	displayPlayers(document, gameData.players);
	displayCorporations(document, gameData.corporations);
	displayMoney(document, gameData.player.money);
	displayTiles(document, gameData.player.tiles);
	displayStocks(document, gameData.player.stocks);
	displayStatus(document, gameData.player.status);
	highlightLastPlacedTile(document, gameData.lastPlacedTileId);
};

const removeWaitingArea = function (document) {
	const waitingArea = document.getElementById('waiting-area');
	setTimeout(() => waitingArea.remove(), 500);
};

const showGameContainer = function (document) {
	const gameContainer = document.getElementById('game-container');
	gameContainer.style.display = 'block';
	const header = document.getElementById('game-header');
	header.style.display = 'flex';
};

const setOnClickForTiles = function (document) {
	const tiles = document.getElementById('tiles').children;
	for (const tile of tiles) {
		tile.className = 'tile enabled';
		tile.onclick = placeTile.bind(null, document);
	}
};

const performAction = function (id, document, action) {
	if (action.name != 'DO_NOTHING') clearInterval(id);
	const actions = {
		PLACE_A_TILE: setOnClickForTiles,
		FOUND_CORPORATION: foundCorporation,
		DO_NOTHING: () => { },
		BUY_STOCKS: generateBuyStockContainer
	};
	actions[action.name](document, action.data);
};

const fetchGameData = function (document) {
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

const showJoinedPlayerNames = function (document, playerNames) {
	const joinedPlayerNamesContainer = document.getElementById(
		'joined-player-names'
	);
	joinedPlayerNamesContainer.innerHTML = '';
	playerNames.forEach(playerName => {
		const playerNameHolder = createElement(document, 'p');
		playerNameHolder.innerText = `${playerName} joined the game.`;
		joinedPlayerNamesContainer.appendChild(playerNameHolder);
	});
};

const checkGameStatus = function (document) {
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

const initialize = function (document) {
	initializeBoard(document);
	const header = document.getElementById('game-header');
	header.style.display = 'none';
	checkGameStatus(document);
	document.getElementById('activity-log-icon').onclick = showLog;
};

const createLogHtml = function ({ log, timeStamp }) {
	const div = createElement(document, 'div');
	setAttribute(div, 'className', 'log-message');

	const logSpan = createElement(document, 'span');
	logSpan.innerText = log;

	const timeSpan = createElement(document, 'span');
	const localeTime = new Date(timeStamp).toLocaleTimeString('en-US');
	timeSpan.innerText = localeTime;

	div.appendChild(logSpan);
	div.appendChild(timeSpan);

	return div;
};

const closeOverlay = function (id) {
	document.getElementById(id).style.display = 'none';
	document.getElementById(id).style.zIndex = 1;
};

const showLog = function () {
	document.getElementById('overlay').style.display = 'flex';
	document.getElementById('overlay').style.zIndex = 0;
	document.getElementById('close-overlay-btn').onclick = closeOverlay.bind(
		null,
		'overlay'
	);

	fetch('/log')
		.then(response => response.json())
		.then(logsData => {
			let logs = logsData.map(createLogHtml);

			const activityLog = document.getElementById('activity-log-body');
			activityLog.innerHTML = '';

			appendChilds(activityLog, logs);
		});
};


// buy stocks

const saveBuyingDetails = function (document, details) {
	const doneButton = document.getElementById('done-button');
	doneButton.onclick = buyStocks.bind(null, details);
}

const buyStocks = function (details) {
	selectedCorps = details.corporations.filter(corp => corp.selectedStocks != 0);
	const data = new Object();
	selectedCorps.forEach(corp => {
		data[corp.name] = corp.selectedStocks;
	});

	const postDetails = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(data)
	}


	fetch('/confirm-buy', postDetails)
		.then(res => res.json())
		.then(({ error, message }) => {
			if (error) {
				displayStatus(document, message);
				return;
			}
		})
	document.getElementById('overlay-buy-stock').style.display = 'none';
	fetchGameData(document);
}

const displayBuyStocksMoney = function (document, details) {
	document.getElementById('buy-stocks-money').innerText = `$${details.money}`;
}

const createName = function (document, name) {
	const nameTd = document.createElement('td');
	nameTd.innerText = name;
	return nameTd;
}

const createAvailableStocks = function (document, corporation) {
	const availableStocksTd = document.createElement('td');
	availableStocksTd.innerText = corporation.stocks;
	availableStocksTd.id = `available-${corporation.name}-shares`
	return availableStocksTd;
}

const createPrice = function (document, price) {
	const priceTd = document.createElement('td');
	priceTd.innerText = price;
	return priceTd;
}

const upperStockLimitExceeds = function (details) {
	return details.totalSelectedStock == 3;
}

const lowerStockLimitExceeds = function (corporation) {
	return corporation.selectedStocks < 1;
}

const isMoneyLow = function (corporation, details) {
	return details.money < corporation.currentPrice;

}

const sum = function (x, y) {
	return x + y;
}

const sub = function (x, y) {
	return x - y;
}

const updateInnerText = function (id, text) {
	const element = document.getElementById(id);
	element.innerText = text;
}

const calculateStocksAndPrice = function (document, corporation, details, firstFunc, secondFunc) {
	const currentAvailableStocks = firstFunc(+corporation.stocks, 1);
	const currentSelectedStocks = secondFunc(+corporation.selectedStocks, 1);
	const remainingMoney = `$${firstFunc(+details.money, +corporation.currentPrice)}`;

	updateInnerText(`available-${corporation.name}-shares`, currentAvailableStocks);
	updateInnerText(`selected-${corporation.name}-shares`, currentSelectedStocks);
	updateInnerText(`buy-stocks-money`, remainingMoney);


	corporation.selectedStocks = secondFunc(+corporation.selectedStocks, 1);
	corporation.stocks = firstFunc(+corporation.stocks, 1);
	details.money = firstFunc(+details.money, +corporation.currentPrice);
	details.totalSelectedStock = secondFunc(+details.totalSelectedStock, 1);
}

const corporationStocksLacks = function (corporation) {
	return corporation.stocks <= 0;
}

const increaseSelectedStock = function (document, corporation, details) {
	let errorMsg = "";
	document.getElementById('error-msg-at-buying').innerText = errorMsg;


	if (upperStockLimitExceeds(details)) {
		errorMsg = "You can only buy 3 at a time.";
		document.getElementById('error-msg-at-buying').innerText = errorMsg;
		return;
	}

	if (corporationStocksLacks(corporation)) {
		errorMsg = "Sorry! No stocks available to buy";
		document.getElementById('error-msg-at-buying').innerText = errorMsg;
		return;
	}

	if (isMoneyLow(corporation, details)) {
		errorMsg = "Insufficient money"
		document.getElementById('error-msg-at-buying').innerText = errorMsg;
		return;
	}

	calculateStocksAndPrice(document, corporation, details, sub, sum);
}

const decreaseSelectedStock = function (document, corporation, details) {
	document.getElementById('error-msg-at-buying').innerText = "";

	if (lowerStockLimitExceeds(corporation)) {
		const errorMsg = "You are already at 0.";
		document.getElementById('error-msg-at-buying').innerText = errorMsg;
		return;
	}

	calculateStocksAndPrice(document, corporation, details, sum, sub);
}


const createShareDealings = function (document, corporation, details) {
	const shareDealings = document.createElement('td');
	const subButton = document.createElement('button');
	subButton.innerText = '-';
	subButton.onclick = decreaseSelectedStock.bind(null, document, corporation, details);
	const addButton = document.createElement('button');
	addButton.innerText = '+';
	addButton.onclick = increaseSelectedStock.bind(null, document, corporation, details);

	const shares = document.createElement('span');
	shares.id = `selected-${corporation.name}-shares`;
	shares.innerText = corporation['selectedStocks'];
	shareDealings.appendChild(subButton);
	shareDealings.appendChild(shares);
	shareDealings.appendChild(addButton);
	return shareDealings;
}

const createCorpRow = function (document, corporation, details) {
	const row = document.createElement('tr');
	const name = createName(document, corporation.name);
	const availableStocks = createAvailableStocks(document, corporation)
	const price = createPrice(document, corporation.currentPrice);
	const shareDealings = createShareDealings(document, corporation, details);
	row.appendChild(name);
	row.appendChild(availableStocks);
	row.appendChild(price);
	row.appendChild(shareDealings);
	return row;
}

const displayCorporation = function (document, details) {
	const body = document.getElementById('buy-stocks-body');
	body.innerHTML = '';
	details.corporations.forEach(corporation => {
		corporation['selectedStocks'] = 0;
		details.totalSelectedStock = 0;
		const row = createCorpRow(document, corporation, details);
		body.appendChild(row);
	})
}

const generateBuyStockContainer = function (document, details) {
	document.getElementById('overlay-buy-stock').style.display = 'flex';

	displayBuyStocksMoney(document, details);
	displayCorporation(document, details);
	saveBuyingDetails(document, details);
}

window.onload = initialize.bind(null, document);
