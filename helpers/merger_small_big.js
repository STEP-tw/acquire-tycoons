const initialTiles = ['2A', '5A', '1B', '4B'];
const p1Tiles = ['1A', '6A', '7A', '8A', '9A', '3A'];
const p2Tiles = ['2B', '3B', '11A', '12A', '5B', '6B'];
const p3Tiles = ['4A', '7B', '8B', '9B', '10B', '11B'];
const p4Tiles = ['1I'];

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
    },
    {
      id: 'placeTile',
      data: '1I',
      comments: 'Player4 places 1I tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1, Phoenix: 1 },
      comments: 'Player4 bought 1 Quantum and 1 Pheonix stocks'
    }
  ]
};
