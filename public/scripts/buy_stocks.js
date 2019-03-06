const saveBuyingDetails = function (document, buyStocksData) {
  const doneButton = document.getElementById('done-button');
  doneButton.onclick = buyStocks.bind(null, buyStocksData);
};

const buyStocks = function (buyStocksData) {
  selectedCorps = buyStocksData.corporations.filter(
    corp => corp.selectedStocks != 0
  );
  const data = new Object();
  selectedCorps.forEach(corp => {
    data[corp.name] = corp.selectedStocks;
  });

  const postDetails = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  };

  fetch('/confirm-buy', postDetails)
    .then(res => res.json())
    .then(({ error, message }) => {
      if (error) {
        displayStatus(document, message);
        return;
      }
    });
  document.getElementById('buy-stocks-overlay').style.display = 'none';
  fetchGameData(document);
};

const displayBuyStocksMoney = function (document, money) {
  document.getElementById('buy-stocks-money').innerText = `You have $${money}`;
};

const displayErrorMessage = function (document, message) {
  document.getElementById('error-msg-at-buying').innerText = message;
};

const createName = function (document, name) {
  const nameAttributes = { className: `left-aligned-cell`, innerText: name };
  const nameTd = createElement(document, 'td', nameAttributes);
  return nameTd;
};

const createAvailableStocks = function (document, corporation) {
  const availableStocksAttrs = {
    className: 'right-aligned-cell',
    innerText: corporation.stocks,
    id: `available-${corporation.name}-shares`
  };
  const availableStocksTd = createElement(document, 'td', availableStocksAttrs);
  return availableStocksTd;
};

const createPrice = function (document, price) {
  const priceAttrs = { className: 'right-aligned-cell', innerText: price };
  const priceTd = createElement(document, 'td', priceAttrs);
  return priceTd;
};

const upperStockLimitExceeds = function (buyStocksData) {
  return buyStocksData.totalSelectedStock == 3;
};

const lowerStockLimitExceeds = function (corporation) {
  return corporation.selectedStocks < 1;
};

const isMoneyLow = function (corporation, buyStocksData) {
  return buyStocksData.money < corporation.currentPrice;
};

const sum = function (x, y) {
  return x + y;
};

const sub = function (x, y) {
  return x - y;
};

const updateInnerText = function (id, text) {
  const element = document.getElementById(id);
  element.innerText = text;
};

const calculateStocksAndPrice = function (
  document,
  corporation,
  buyStocksData,
  firstCalculator,
  secondCalculator
) {
  const currentAvailableStocks = firstCalculator(+corporation.stocks, 1);
  const currentSelectedStocks = secondCalculator(
    +corporation.selectedStocks,
    1
  );
  const remainingMoney = firstCalculator(
    +buyStocksData.money,
    +corporation.currentPrice
  );

  updateInnerText(
    `available-${corporation.name}-shares`,
    currentAvailableStocks
  );
  updateInnerText(`selected-${corporation.name}-shares`, currentSelectedStocks);
  displayBuyStocksMoney(document, remainingMoney);

  corporation.selectedStocks = secondCalculator(+corporation.selectedStocks, 1);
  corporation.stocks = firstCalculator(+corporation.stocks, 1);
  buyStocksData.money = firstCalculator(
    +buyStocksData.money,
    +corporation.currentPrice
  );
  buyStocksData.totalSelectedStock = secondCalculator(
    +buyStocksData.totalSelectedStock,
    1
  );
};

const corporationStocksLacks = function (corporation) {
  return corporation.stocks <= 0;
};

const increaseSelectedStock = function (document, corporation, buyStocksData) {
  displayErrorMessage(document, '');
  if (upperStockLimitExceeds(buyStocksData)) {
    displayErrorMessage(document, 'You can only buy 3 at a time.');
    return;
  }

  if (corporationStocksLacks(corporation)) {
    displayErrorMessage(document, 'Sorry! No stocks available to buy');
    return;
  }

  if (isMoneyLow(corporation, buyStocksData)) {
    displayErrorMessage(document, 'Insufficient money');
    return;
  }

  calculateStocksAndPrice(document, corporation, buyStocksData, sub, sum);
};

const decreaseSelectedStock = function (document, corporation, buyStocksData) {
  displayErrorMessage(document, '');
  if (lowerStockLimitExceeds(corporation)) {
    displayErrorMessage(document, 'You are already at 0.');
    return;
  }
  calculateStocksAndPrice(document, corporation, buyStocksData, sum, sub);
};

const createShareDealings = function (document, corporation, buyStocksData) {
  const shareDealings = document.createElement('td');
  shareDealings.className = 'selected-stocks-count';
  const subButtonAttributes = {
    className: 'buy-stocks-button',
    innerText: '-',
    onclick: decreaseSelectedStock.bind(
      null,
      document,
      corporation,
      buyStocksData
    )
  };
  const subButton = createElement(document, 'button', subButtonAttributes);

  const addButtonAttributes = {
    className: 'buy-stocks-button',
    innerText: '+',
    onclick: increaseSelectedStock.bind(
      null,
      document,
      corporation,
      buyStocksData
    )
  };
  const addButton = createElement(document, 'button', addButtonAttributes);

  const shares = document.createElement('span');
  shares.id = `selected-${corporation.name}-shares`;
  shares.innerText = corporation['selectedStocks'];
  shareDealings.appendChild(subButton);
  shareDealings.appendChild(shares);
  shareDealings.appendChild(addButton);
  return shareDealings;
};

const createCorpRow = function (document, corporation, buyStocksData) {
  const row = createElement(document,'tr',{className:`${corporation.name.toLowerCase()}-color`});
  const name = createName(document, corporation.name);
  const availableStocks = createAvailableStocks(document, corporation);
  const price = createPrice(document, corporation.currentPrice);
  const shareDealings = createShareDealings(
    document,
    corporation,
    buyStocksData
  );
  row.appendChild(name);
  row.appendChild(availableStocks);
  row.appendChild(price);
  row.appendChild(shareDealings);
  return row;
};

const displayCorporation = function (document, buyStocksData) {
  const body = document.getElementById('buy-stocks-body');
  body.innerHTML = '';
  buyStocksData.corporations.forEach(corporation => {
    corporation['selectedStocks'] = 0;
    buyStocksData.totalSelectedStock = 0;
    const row = createCorpRow(document, corporation, buyStocksData);
    body.appendChild(row);
  });
};

const generateBuyStockContainer = function (document, buyStocksData) {
  document.getElementById('buy-stocks-overlay').style.display = 'flex';
  displayErrorMessage(document, '');
  displayBuyStocksMoney(document, buyStocksData.money);
  displayCorporation(document, buyStocksData);
  saveBuyingDetails(document, buyStocksData);
};
