/*
  after finishing the array elements(tiles) in random
  it will give the number by Math.random
*/

const merge_small_big = {
  random: function () {
    const array = [
      // initial tiles are 2A,5A,1B,4B
      1, 3, 10, 12,
      //player1 tiles are 1A,6A,7A,8A,9A,10A
      0, 2, 2, 2, 2, 2,
      //player2 tiles are 2B,3B,11A,12A,5B,6B
      4, 2, 2, 2, 2, 2,
      // player3 tiles are 4A,7B,8B,9B,10B,11B
      1, 1, 1, 1, 1, 1,
      //player4 tiles are 3A which is for testing
      0];
    let index = -1;
    return function (length) {
      index++;
      if (array[index] != undefined) {return array[index];}
      return Math.floor(Math.random() * length);
    };
  },
  processes: [
    {
      id: 'placeTile',
      data: '1A',
      comments: 'Player1 places 1A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Phoenix',
      /* there is already initial tile(2A,1B) placed on the board
        so that player can establish corporation
      */
      comments: 'Player1 establish Quantum corporation'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comments: 'Player1 bought 3 Quantum stocks'
    },
    {
      id: 'placeTile',
      data: '2B',
      comments: 'Player2 places 2B tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comments: 'Player2 bought 3 Quantum stocks'
    },
    {
      id: 'placeTile',
      data: '4A',
      comments: 'Player3 places 4A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Quantum',
      /* there is already initial tile(5A,4B) placed on the board
        so that player can establish corporation
      */
      comments: 'Player3 establishing Pheonix corporation'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 2, Phoenix: 1 },
      comments: 'Player3 bought 2 Quantum and 1Pheonix stocks'
    }
  ]
};

module.exports = merge_small_big;