const initialTiles = ['2A', '5A', '1B', '5B'];
const p1Tiles = ['1A', '3A', '6A', '7A', '8A', '3C'];
const p2Tiles = ['4A', '10A', '11A', '12A', '3B', '6B'];
const p3Tiles = ['2B', '7B', '8B', '9B', '10B', '11B'];
const p4Tiles = ['4B', '12B', '1C', '2C', '9A', '4C'];

module.exports = {
  array: initialTiles.concat(p1Tiles, p2Tiles, p3Tiles, p4Tiles),

  processes: [
    {
      id: 'placeTile',
      data: '1A',
      comment: 'Player1 places 1A tile'
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
      id: 'establishCorporation',
      data: 'Hydra',
      comment: 'Player2 establish corporation Hydra'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 2, Hydra: 1 },
      comment: 'Player2 buy 1 stock of Hydra and 2 stock of Phoenix'
    },
    {
      id: 'placeTile',
      data: '2B',
      comment: 'Player3 places 2B tile'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 2, Hydra: 1 },
      comment: 'Player3 buy stocks of 2-Phoenix 1-Hydra'
    },
    {
      id: 'placeTile',
      data: '4B',
      comment: 'Player4 places 4B tile'
    },
    {
      id: 'buyStocks',
      data: { Hydra: 3 },
      comment: 'player4 buy stocks of 3-Hydra'
    },
    {
      id: 'placeTile',
      data: '3C',
      comment: 'Player1 places 3C tile'
    },
    {
      id: 'buyStocks',
      data: { Hydra: 3 },
      comment: 'player1 buy stocks of 3-Hydra'
    }
  ]
};
