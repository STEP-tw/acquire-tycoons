const initialTiles = ['2A', '5A', '3B', '2C'];
const p1Tiles = ['1A', '6A', '7A', '8A', '9A', '2B'];
const p2Tiles = ['4A', '10A', '11A', '12A', '1B', '4B'];
const p3Tiles = ['1C', '5B', '6B', '7B', '8B', '9B'];
const p4Tiles = ['3A'];

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
      data: '1C',
      comment: 'Player3 places 1C tile'
    },
    {
      id: 'establishCorporation',
      data: 'Sackson',
      comment: 'Player3 establish corporation Sackson'
    },
    {
      id: 'buyStocks',
      data: { Phoenix: 1, Hydra: 1, Sackson : 1 },
      comment: 'Player3 buy stocks of 1-Phoenix 1-Hydra and 1-Sackson'
    },
  ]
};