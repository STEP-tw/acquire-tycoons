const initialTiles = ['2A', '5A', '1B', '3B'];
const p1Tiles = ['1A', '6A', '8A', '10A', '11A', '3A'];
const p2Tiles = ['4A', '2B', '4B', '5B', '6B', '7B'];
const p3Tiles = ['7A', '8B', '9B', '10B', '11B', '12B'];
const p4Tiles = ['1I'];

// 3A is the merger tile

module.exports = {
  array: initialTiles.concat(p1Tiles, p2Tiles, p3Tiles, p4Tiles),

  processes: [
    {
      id: 'placeTile',
      data: '1A',
      comments: 'Player1 places 1A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Quantum',
      /* there is already initial tile(2A,1B) placed on the board
        so that player can establish corporation
      */
      comments: 'Player1 establish Quantum corporation'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3, Phoenix: 2 },
      comments: 'Player1 bought 3 Quantum stocks'
    },
    {
      id: 'placeTile',
      data: '4A',
      comments: 'Player2 places 4A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Phoenix',
      comments: 'Player2 establish Pheonix corporation'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 18, Phoenix: 2 },
      comments: 'Player2 bought 2-Quantum and 1-Phoenix stocks'
    },
    {
      id: 'placeTile',
      data: '7A',
      comments: 'Player3 places 7A tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1, Phoenix: 2 },
      comments: 'Player3 bought 1 Quantum and 1Pheonix stocks'
    },
    {
      id: 'placeTile',
      data: '1I',
      comments: 'Player4 places 1I tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1, Phoenix: 2 },
      comments: 'Player4 bought 1 Quantum and 1 Pheonix stocks'
    }
  ]
};
