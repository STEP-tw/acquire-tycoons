const makeValuesArray = function(initial, final) {
  const arraySize = final - initial + 1;
  const values = new Array(arraySize).fill(0);
  return values.map((zero, index) => initial + index + zero);
};

class CorporationSizeInfo {
  constructor({
    lowerLimit = 0,
    upperLimit = 0,
    stockPrice = 0,
    majority = 0,
    minority = 0
  }) {
    this.values = makeValuesArray(lowerLimit, upperLimit);
    this.stockPrice = stockPrice;
    this.majority = majority;
    this.minority = minority;
  }

  isValueIncluded(value) {
    return this.values.includes(value);
  }

  getStockPrice() {
    return this.stockPrice;
  }

  getMajority() {
    return this.majority;
  }

  getMinority() {
    return this.minority;
  }
}

class Level {
  constructor(
    corporationSizes,
    defaultCorporationInfo = new CorporationSizeInfo({})
  ) {
    this.corporationSizes = corporationSizes;
    this.defaultCorporationInfo = defaultCorporationInfo;
  }

  findSize(size) {
    return (
      this.corporationSizes.find(corporationSizeInfo =>
        corporationSizeInfo.isValueIncluded(size)
      ) || this.defaultCorporationInfo
    );
  }

  getStockPrice(size) {
    return this.findSize(size).getStockPrice();
  }

  getMajority(size) {
    return this.findSize(size).getMajority();
  }

  getMinority(size) {
    return this.findSize(size).getMinority();
  }
}

const getLevel = function(levelSizesData) {
  const corporationSizes = levelSizesData.map(
    corporationSizeData => new CorporationSizeInfo(corporationSizeData)
  );
  return new Level(corporationSizes);
};

module.exports = {
  makeValuesArray,
  getLevel,
  Level,
  CorporationSizeInfo
};
