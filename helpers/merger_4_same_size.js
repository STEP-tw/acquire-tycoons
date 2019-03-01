const initialTiles = ['4B', '1D', '5D', '4E'];
const p1Tiles = ['4A','4D','3D','9A','11B','10G'];
const p2Tiles = ['2D','4C','1A','2B','5G','6H'];
const p3Tiles = ['6D','4F','3C','4I','7A','7B'];
const p4Tiles = ['4G','7D'];

module.exports = {
  array: initialTiles.concat(p1Tiles,p2Tiles,p3Tiles,p4Tiles),
  processes: [
    {
      id:'placeTile',
      data:'4A',
      comment: 'player1 places 4A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Quantum',
      comment: 'player1 establishes Quantum'
    },
    {
      id: 'buyStocks',
      data:{ Quantum:3 },
      comment:'player1 bought 3-Quantum'
    },
    {
      id:'placeTile',
      data:'4C',
      comment: 'player2 places 4C tile'
    },
    {
      id:'buyStocks',
      data:{ Quantum:3 },
      comment: 'player2 bought 3-Quantum'
    },
    {
      id:'placeTile',
      data:'6D',
      comment:'player3 places 6D tile'
    },
    {
      id:'establishCorporation',
      data:'Phoenix',
      comment: 'player3 establishes Phoenix'
    },
    {
      id:'buyStocks',
      data:{ Quantum:1,Phoenix:2 },
      comment:'player3 bought 1-Quantum 2-Phoenix'
    },
    {
      id:'placeTile',
      data:'7D',
      comment: 'player4 places 7D tile'
    },
    {
      id:'buyStocks',
      data: { Quantum: 1, Phoenix: 2 },
      comment: 'player4 bought 1-Quantum 2-Phoenix'
    },
    {
      id:'placeTile',
      data:'3D',
      comment: 'player1 places 3D tile'
    },
    {
      id: 'establishCorporation',
      data: 'Zeta',
      comment: 'player1 establishes Zeta'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1, Zeta:2 },
      comment: 'player1 bought 1-Phoenix 2-Zeta'
    },
    {
      id: 'placeTile',
      data: '2D',
      comment: 'player2 places 2D tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1, Zeta: 2 },
      comment: 'player2 bought 1-Phoenix 2-Zeta'
    },
    {
      id: 'placeTile',
      data: '4F',
      comment: 'player3 places 4F tile'
    },
    {
      id: 'establishCorporation',
      data: 'Hydra',
      comment: 'player3 establishes Hydra'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1, Hydra: 2 },
      comment: 'player3 bought 1-Phoenix 2-Hydra'
    },
    {
      id: 'placeTile',
      data: '4G',
      comment: 'player4 places 4G tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1, Hydra: 2 },
      comment: 'player3 bought 1-Phoenix 2-Hydra'
    }
  ]
};