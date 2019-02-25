const saveBuyingDetails = function(document, details) {
  const doneButton = document.getElementById('done-button');
  doneButton.onclick = buyStocks.bind(null, details);
};

const buyStocks = function(details) {
  selectedCorps = details.corporations.filter(corp => corp.selectedStocks != 0);
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
  document.getElementById('overlay-buy-stock').style.display = 'none';
  fetchGameData(document);
};

const displayBuyStocksMoney = function(document, details) {
  document.getElementById('buy-stocks-money').innerText = `$${details.money}`;
};

const createName = function(document, name) {
  const nameTd = document.createElement('td');
  nameTd.innerText = name;
  return nameTd;
};

const createAvailableStocks = function(document, corporation) {
  const availableStocksTd = document.createElement('td');
  availableStocksTd.innerText = corporation.stocks;
  availableStocksTd.id = `available-${corporation.name}-shares`;
  return availableStocksTd;
};

const createPrice = function(document, price) {
  const priceTd = document.createElement('td');
  priceTd.innerText = price;
  return priceTd;
};

const upperStockLimitExceeds = function(details) {
  return details.totalSelectedStock == 3;
};

const lowerStockLimitExceeds = function(corporation) {
  return corporation.selectedStocks < 1;
};

const isMoneyLow = function(corporation, details) {
  return details.money < corporation.currentPrice;
};

const sum = function(x, y) {
  return x + y;
};

const sub = function(x, y) {
  return x - y;
};

const updateInnerText = function(id, text) {
  const element = document.getElementById(id);
  element.innerText = text;
};

const calculateStocksAndPrice = function(
  document,
  corporation,
  details,
  firstFunc,
  secondFunc
) {
  const currentAvailableStocks = firstFunc(+corporation.stocks, 1);
  const currentSelectedStocks = secondFunc(+corporation.selectedStocks, 1);
  const remainingMoney = `$${firstFunc(
    +details.money,
    +corporation.currentPrice
  )}`;

  updateInnerText(
    `available-${corporation.name}-shares`,
    currentAvailableStocks
  );
  updateInnerText(`selected-${corporation.name}-shares`, currentSelectedStocks);
  updateInnerText(`buy-stocks-money`, remainingMoney);

  corporation.selectedStocks = secondFunc(+corporation.selectedStocks, 1);
  corporation.stocks = firstFunc(+corporation.stocks, 1);
  details.money = firstFunc(+details.money, +corporation.currentPrice);
  details.totalSelectedStock = secondFunc(+details.totalSelectedStock, 1);
};

const corporationStocksLacks = function(corporation) {
  return corporation.stocks <= 0;
};

const increaseSelectedStock = function(document, corporation, details) {
  let errorMsg = '';
  document.getElementById('error-msg-at-buying').innerText = errorMsg;

  if (upperStockLimitExceeds(details)) {
    errorMsg = 'You can only buy 3 at a time.';
    document.getElementById('error-msg-at-buying').innerText = errorMsg;
    return;
  }

  if (corporationStocksLacks(corporation)) {
    errorMsg = 'Sorry! No stocks available to buy';
    document.getElementById('error-msg-at-buying').innerText = errorMsg;
    return;
  }

  if (isMoneyLow(corporation, details)) {
    errorMsg = 'Insufficient money';
    document.getElementById('error-msg-at-buying').innerText = errorMsg;
    return;
  }

  calculateStocksAndPrice(document, corporation, details, sub, sum);
};

const decreaseSelectedStock = function(document, corporation, details) {
  document.getElementById('error-msg-at-buying').innerText = '';

  if (lowerStockLimitExceeds(corporation)) {
    const errorMsg = 'You are already at 0.';
    document.getElementById('error-msg-at-buying').innerText = errorMsg;
    return;
  }

  calculateStocksAndPrice(document, corporation, details, sum, sub);
};

const createShareDealings = function(document, corporation, details) {
  const shareDealings = document.createElement('td');
  const subButton = document.createElement('button');
  subButton.innerText = '-';
  subButton.onclick = decreaseSelectedStock.bind(
    null,
    document,
    corporation,
    details
  );
  const addButton = document.createElement('button');
  addButton.innerText = '+';
  addButton.onclick = increaseSelectedStock.bind(
    null,
    document,
    corporation,
    details
  );

  const shares = document.createElement('span');
  shares.id = `selected-${corporation.name}-shares`;
  shares.innerText = corporation['selectedStocks'];
  shareDealings.appendChild(subButton);
  shareDealings.appendChild(shares);
  shareDealings.appendChild(addButton);
  return shareDealings;
};

const createCorpRow = function(document, corporation, details) {
  const row = document.createElement('tr');
  const name = createName(document, corporation.name);
  const availableStocks = createAvailableStocks(document, corporation);
  const price = createPrice(document, corporation.currentPrice);
  const shareDealings = createShareDealings(document, corporation, details);
  row.appendChild(name);
  row.appendChild(availableStocks);
  row.appendChild(price);
  row.appendChild(shareDealings);
  return row;
};

const displayCorporation = function(document, details) {
  const body = document.getElementById('buy-stocks-body');
  body.innerHTML = '';
  details.corporations.forEach(corporation => {
    corporation['selectedStocks'] = 0;
    details.totalSelectedStock = 0;
    const row = createCorpRow(document, corporation, details);
    body.appendChild(row);
  });
};

const generateBuyStockContainer = function(document, details) {
  document.getElementById('overlay-buy-stock').style.display = 'flex';

  displayBuyStocksMoney(document, details);
  displayCorporation(document, details);
  saveBuyingDetails(document, details);
};
