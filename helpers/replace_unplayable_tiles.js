const initialTiles = ['1A', '2A', '3A', '5A'];
const p1Tiles = ['1B', '3B', '1C', '4A', '1D', '6C'];
const p2Tiles = ['2B', '4B', '5B', '2C', '7C', '5D'];
const p3Tiles = ['6A', '9A', '4C', '3C', '6D', '6B'];
const p4Tiles = ['7A', '10A', '7B', '4D', '3D', '5C'];

module.exports = {
  array: initialTiles.concat(p1Tiles, p2Tiles, p3Tiles, p4Tiles),
  processes: [
    {
      id: 'placeTile',
      data: '1B',
      comment: 'Player1 places tile 1B'
    },
    {
      id: 'establishCorporation',
      data: 'Quantum',
      comment: 'Player1 establish Quantum'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player1 buy 3 stocks of Quantum'
    },
    {
      id: 'placeTile',
      data: '2B',
      comment: 'Player2 places tile 2B'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 3 },
      comment: 'Player2 buy 3 of Quantum'
    },
    {
      id: 'placeTile',
      data: '6A',
      comment: 'Player3 places tile 6A'
    },
    {
      id: 'establishCorporation',
      data: 'Phoenix',
      comment: 'Player3 establish Phoenix'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 2, Quantum: 1 },
      comment: 'Player3 buy 2-Phoenix 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '7A',
      comment: 'Player4 places tile 7A'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 3 },
      comment: 'Player4 buy 3-Pheonix'
    },
    {
      id: 'placeTile',
      data: '3B',
      comment: 'Player1 places tile 3B'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 2, Quantum: 1 },
      comment: 'Player1 buy 2-Phoenix 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '5B',
      comment: 'Player2 places tile 5B'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1 },
      comment: 'Player2 buy 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '6B',
      comment: 'Player3 places tile 6B'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1 },
      comment: 'Player3 buy 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '7B',
      comment: 'Player4 places tile 7B'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1 },
      comment: 'Player4 buy 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '1C',
      comment: 'Player1 places tile 1C'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1 },
      comment: 'Player1 buy 1-Quantum'
    },
    {
      id: 'placeTile',
      data: '2C',
      comment: 'Player2 places tile 2C'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player2 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '3C',
      comment: 'Player3 places tile 3C'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player3 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '5C',
      comment: 'Player4 places tile 5C'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player4 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '6C',
      comment: 'Player1 places tile 6C'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player1 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '7C',
      comment: 'Player2 places tile 7C'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player2 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '9A',
      comment: 'Player3 places tile 9A'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player3 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '10A',
      comment: 'Player4 places tile 10A'
    },
    {
      id: 'establishCorporation',
      data: 'Zeta',
      comment: 'Player4 establishes corporation Zeta'
    },
    {
      id: 'buyStocks',
      data: { Zeta: 1 },
      comment: 'Player4 buy 1-Zeta'
    },
    {
      id: 'placeTile',
      data: '1D',
      comment: 'Player1 places tile 1D'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1 },
      comment: 'Player1 buy 1-Phoenix'
    },
    {
      id: 'placeTile',
      data: '5D',
      comment: 'Player2 places tile 5D'
    },
    {
      id: 'buyStocks',
      data: { Zeta: 1 },
      comment: 'Player2 buy 1-Zeta'
    },
    {
      id: 'placeTile',
      data: '6D',
      comment: 'Player3 places tile 6D'
    },
    {
      id: 'buyStocks',
      data: { Zeta: 1 },
      comment: 'Player3 buy 1-Zeta'
    }
  ]
};
