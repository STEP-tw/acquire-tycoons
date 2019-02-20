const isInrange = function(range, value) {
  return range.upperLimit >= value && range.lowerLimit <= value;
};

class Level {
  constructor(corporationSizes) {
    this.corporationSizes = corporationSizes;
    this.defaultCorporationInfo = { stockPrice: 0, majority: 0, minority: 0 };
  }

  findSize(size) {
    return (
      this.corporationSizes.find(corporationSizeInfo => {
        return isInrange(corporationSizeInfo, size);
      }) || this.defaultCorporationInfo
    );
  }

  getStockPrice(size) {
    return this.findSize(size).stockPrice;
  }

  getMajority(size) {
    return this.findSize(size).majority;
  }

  getMinority(size) {
    return this.findSize(size).minority;
  }
}

module.exports = Level;
