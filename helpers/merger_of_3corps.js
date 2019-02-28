const initialTiles = ['1B', '5B', '1C', '3D'];
const p1Tiles = ['1A','3A','2A','4A','5A','6A'];
const p2Tiles = ['2B', '3C', '7A', '8A', '9A', '10A'];
const p3Tiles = ['3B', '4B', '11A', '12A', '7B', '8B'];
const p4Tiles = ['6B'];

module.exports = {
  array: initialTiles.concat(p1Tiles, p2Tiles, p3Tiles, p4Tiles),
  processes:[
    {
      id: 'placeTile',
      data: '1A',
      comment: 'Player1 places tile 1A'
    },
    {
      id : 'establishCorporation',
      data : 'Quantum',
      comment: 'Player1 establish Quantum'
    },
    {
      id: 'buyStocks',
      data: { 'Quantum': 3 },
      comment: 'Player1 buy 3 stocks of Quantum'
    },
    {
      id: 'placeTile',
      data: '2B',
      comment: 'Player2 places tile 2B'
    },
    {
      id: 'buyStocks',
      data: { 'Quantum': 3 },
      comment: 'Player2 buy 3 of Quantum'
    },
    {
      id: 'placeTile',
      data: '4B',
      comment: 'Player3 places tile 4B'
    },
    {
      id: 'establishCorporation',
      data: 'Phoenix',
      comment: 'Player3 establish Phoenix'
    },
    {
      id: 'buyStocks',
      data: { 'Phoenix': 2, 'Quantum': 1 },
      comment: 'Player3 buy 2-Phoenix 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '6B',
      comment: 'Player4 places tile 6B'
    },
    {
      id: 'buyStocks',
      data: { 'Phoenix': 3 },
      comment: 'Player4 buy 3-Pheonix'
    },
    {
      id: 'placeTile',
      data: '3A',
      comment: 'Player1 places tile 3A'
    },
    {
      id : 'buyStocks',
      data: { 'Phoenix': 2, 'Quantum': 1 },
      comment: 'Player1 buy 2-Phoenix 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '3C',
      comment: 'Player2 places tile 3C'
    },
    {
      id: 'establishCorporation',
      data: 'Zeta',
      comment: 'Player2 establish Zeta'
    },
    {
      id: 'buyStocks',
      data: { 'Zeta': 3 },
      comment: 'Player2 buy 3-Zeta'
    }
  ]
};
