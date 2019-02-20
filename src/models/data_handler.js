class CorporationSizeInfo {
  constructor({
    lowerLimit = 0,
    upperLimit = 0,
    stockPrice = 0,
    majority = 0,
    minority = 0
  }) {
    this.upperLimit = upperLimit;
    this.lowerLimit = lowerLimit;
    this.stockPrice = stockPrice;
    this.majority = majority;
    this.minority = minority;
  }

  isValueIncluded(value) {
    return this.upperLimit >= value && this.lowerLimit <= value;
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

module.exports = {
  Level,
  CorporationSizeInfo
};
