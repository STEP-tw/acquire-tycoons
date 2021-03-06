const generateAddButton = function(document, id, updater, survivingCorpStocks,survivingCorporationName) {
  const addButtonAttributes = {
    className: 'btn-default',
    innerText: '+',
    onclick: increaseSellAndTradeCount.bind(
      null,
      document,
      id,
      updater,
      survivingCorpStocks,
      survivingCorporationName
    )
  };
  return createElement(document, 'button', addButtonAttributes);
};

const generateSubButton = function(document, id, updater) {
  const subButtonAttributes = {
    className: 'btn-default',
    innerText: '-',
    onclick: decreaseSellAndTradeCount.bind(null, document, id, updater)
  };
  return createElement(document, 'button', subButtonAttributes);
};

const decreaseSellAndTradeCount = function(document, id, updater) {
  const msgDiv = document.getElementById('error-msg-at-sell-trade');
  msgDiv.innerText = '';

  const countSpan = document.getElementById(id);
  let count = +countSpan.innerText;

  if (count <= 0) {
    msgDiv.innerText = 'You are already at 0';
    return;
  }
  count -= updater;
  countSpan.innerText = count;
};

const increaseSellAndTradeCount = function(
  document,
  id,
  updater,
  survivingCorpStocks,
  survivingCorporationName
) {
  const msgDiv = document.getElementById('error-msg-at-sell-trade');
  msgDiv.innerText = '';
  const countSpan = document.getElementById(id);
  let count = +countSpan.innerText;
  if (exceededStocksUpperLimit(document, updater)) {
    msgDiv.innerText = "You don't have enough stocks";
    return;
  }

  if (updater == 2 && count/2 == survivingCorpStocks) {
    msgDiv.innerText = `Stocks of ${survivingCorporationName} are not available`;
    return;
  }

  count += updater;
  countSpan.innerText = count;
};

const exceededStocksUpperLimit = function(document, updater) {
  const defunctStocks = +document.getElementById('total-defunct-stocks')
    .innerText;
  const sellStocks = +document.getElementById('sell-stocks-count').innerText;
  const tradeStocks = +document.getElementById('trade-stocks-count').innerText;
  return sellStocks + tradeStocks + updater > defunctStocks;
};

const displayMergingCorporations = function(
  document,
  defunctCorporation,
  survivingCorporation
) {
  const headerDiv = document.getElementById('sell-trade-header');
  headerDiv.innerText = `${survivingCorporation} acquires ${defunctCorporation}`;
};

const getSellAndTradeRow = function(
  document,
  actionName,
  actionId,
  survivingCorpStocks,
  survivingCorporationName
) {
  const sellAndTradeRow = document.createElement('tr');

  const sellAndTradeHeadingTd = createElement(document, 'td', {
    innerText: actionName
  });

  const stockSelectorAttrs = { className: 'selected-stocks-count' };
  const stockSelectorTd = createElement(document, 'td', stockSelectorAttrs);

  let updater = 1;
  if (actionName == 'Trade') {
    updater = 2;
  }

  const subButton = generateSubButton(document, actionId, updater);
  const addButton = generateAddButton(
    document,
    actionId,
    updater,
    survivingCorpStocks,
    survivingCorporationName
  );

  const stocksCountAttribute = { id: actionId, innerText: 0 };
  const stocksCountSpan = createElement(document, 'span', stocksCountAttribute);

  const stockSelectorElements = [subButton, stocksCountSpan, addButton];
  appendChildren(stockSelectorTd, stockSelectorElements);

  const sellAndTradeRowElements = [sellAndTradeHeadingTd, stockSelectorTd];
  appendChildren(sellAndTradeRow, sellAndTradeRowElements);
  return sellAndTradeRow;
};

const displaySellTradeDetails = function(document, survivingCorpStocks,survivingCorporationName) {
  const sellTradeBody = document.getElementById('sell-trade-body');
  sellTradeBody.innerText = '';
  const tradeRow = getSellAndTradeRow(
    document,
    'Trade',
    'trade-stocks-count',
    survivingCorpStocks,
    survivingCorporationName
  );

  const sellRow = getSellAndTradeRow(
    document,
    'Sell',
    'sell-stocks-count',
    survivingCorpStocks,
    survivingCorporationName
  );
  const sellTradeElements = [tradeRow, sellRow];
  appendChildren(sellTradeBody, sellTradeElements);
};

const displayDefunctStocks = function(
  document,
  stocks,
  defunctCorporationName
) {
  document.getElementById(
    'defunct-corp-name'
  ).innerText = defunctCorporationName;
  document.getElementById('total-defunct-stocks').innerText = stocks;
};

const saveSellAndTradeDetails = function(document, sellTradeData) {
  const doneButton = document.getElementById('sell-trade-done-button');
  const holdAllButton = document.getElementById('hold-stocks-button');

  doneButton.onclick = sellAndTradeStocks.bind(null, document, sellTradeData);
  holdAllButton.onclick = holdAllStocks.bind(null, document, sellTradeData);
};

const holdAllStocks = function(document, data) {
  data.sellCount = 0;
  data.tradeCount = 0;
  finalizeSellingAndTrading(document, data);
  fetchGameData(document);
};

const modifyTradeAndSellData = function(document, data) {
  const tradeCount = +document.getElementById('trade-stocks-count').innerText;
  const sellCount = +document.getElementById('sell-stocks-count').innerText;
  data.sellCount = sellCount;
  data.tradeCount = tradeCount;
};

const sellAndTradeStocks = function(document, data) {
  modifyTradeAndSellData(document, data);
  finalizeSellingAndTrading(document, data);
  fetchGameData(document);
};

const finalizeSellingAndTrading = function(document, data) {
  document.getElementById('error-msg-at-sell-trade').innerText = '';
  closeOverlay(document, 'sell-trade-overlay');

  const postDetails = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  };

  fetch('/confirm-sellAndTrade', postDetails)
    .then(res => {
      return res.json();
    })
    .then(({ error, message }) => {
      if (error) {
        displayStatus(document, message);
        return;
      }
    });
};

const generateSellTradeContainer = function(document, sellTradeData) {
  const {
    defunctCorporationName,
    survivingCorporationName,
    defunctCorpStocks,
    survivingCorpStocks
  } = sellTradeData;

  document.getElementById('sell-trade-overlay').style.display = 'flex';
  displayErrorMessage(document, 'error-msg-at-sell-trade', '');
  displaySellTradeDetails(document, survivingCorpStocks,survivingCorporationName);

  displayMergingCorporations(
    document,
    defunctCorporationName,
    survivingCorporationName
  );

  displayDefunctStocks(document, defunctCorpStocks, defunctCorporationName);
  saveSellAndTradeDetails(document, sellTradeData);
};
