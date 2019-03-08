const initialTiles = ['1A','2A','8A','9A'];
const p1Tiles = ['3A','5A','1B','3B','5B','7A'];
const p2Tiles = ['4A','6A','2B','4B','8C','7C'];
const p3Tiles = ['10A','12A','9B','11B','2C','3C'];
const p4Tiles = ['11A','8B','10B','12B'];

module.exports = {
  array: initialTiles.concat(p1Tiles, p2Tiles, p3Tiles, p4Tiles),
  processes:[
    {
      id: 'placeTile',
      data: '3A',
      comment: 'Player1 places 3A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Phoenix',
      comment: 'Player1 establish corporation Phoenix'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 3 },
      comment: 'Player1 buy 3 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '4A',
      comment: 'Player2 places 4A tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 3 },
      comment: 'Player2 buy 3 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '10A',
      comment: 'Player3 places 10A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Quantum',
      comment: 'Player3 establish corporation Quantum'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player3 buy 3 stock of quantum corporation '
    },
    {
      id: 'placeTile',
      data: '11A',
      comment: 'Player4 places 11A tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player4 buy 3 stock of quantum corporation '
    },
    {
      id: 'placeTile',
      data: '5A',
      comment: 'Player1 places 5A tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 3 },
      comment: 'Player1 buy 3 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '6A',
      comment: 'Player2 places 6A tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 3 },
      comment: 'Player2 buy 3 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '12A',
      comment: 'Player3 places 12A tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player3 buy 3 stock of quantum corporation '
    },
    {
      id: 'placeTile',
      data: '8B',
      comment: 'Player4 places 8B tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player4 buy 3 stock of quantum corporation '
    },
    {
      id: 'placeTile',
      data: '1B',
      comment: 'Player1 places 1B tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 3 },
      comment: 'Player1 buy 3 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '2B',
      comment: 'Player2 places 2B tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 2 },
      comment: 'Player2 buy 2 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '9B',
      comment: 'Player3 places 9B tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player3 buy 3 stock of quantum corporation '
    },
    {
      id: 'placeTile',
      data: '10B',
      comment: 'Player4 places 10B tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 2 },
      comment: 'Player4 buy 2 stock of quantum corporation '
    },
    {
      id: 'placeTile',
      data: '3B',
      comment: 'Player1 places 3B tile'
    },
    {
      id: 'buyStocks',
      data: {},
      comment: 'Player1 didn"t bought anything'
    },
    {
      id: 'placeTile',
      data: '4B',
      comment: 'Player2 places 4B tile'
    },
    {
      id: 'buyStocks',
      data: {},
      comment: 'Player2 didn"t bought anything'
    },
    {
      id: 'placeTile',
      data: '11B',
      comment: 'Player3 places 11B tile'
    },
    {
      id: 'buyStocks',
      data: {},
      comment: 'Player3 didn"t bought anything'
    },
    {
      id: 'placeTile',
      data: '12B',
      comment: 'Player4 places 12B tile'
    },
    {
      id: 'buyStocks',
      data: {},
      comment: 'Player4 didn"t bought anything'
    },
    {
      id: 'placeTile',
      data: '5B',
      comment: 'Player1 places 5B tile'
    },
    {
      id: 'buyStocks',
      data: {},
      comment: 'Player1 didn"t bought anything'
    },
  ]
};