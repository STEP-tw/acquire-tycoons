class Tile {
  constructor(position, value) {
    this.position = position;
    this.value = value;
  }

  isNeighbour(tile) {
    return this.getNeighbours().some(position => {
      return isSamePositions(tile.position, position);
    });
  }

  getNeighbours() {
    const { row, column } = this.position;
    return [
      {
        row: row + 1,
        column: column
      },
      {
        row: row - 1,
        column: column
      },
      {
        row: row,
        column: column + 1
      },
      {
        row: row,
        column: column - 1
      }
    ];
  }

  getValue() {
    return this.value;
  }

  getPosition() {
    return this.position;
  }

  isSameValue(value) {
    return this.value == value;
  }

  isSamePosition(position) {
    return isSamePositions(this.position, position);
  }
}

const isSamePositions = function(position1, position2) {
  return position1.row == position2.row && position1.column == position2.column;
};

module.exports = Tile;
