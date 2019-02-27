module.exports = {
  array: [
    //initial tiles are 2A,5A,3B,2C
    1, 3, 12, 22,
    // player1 tiles are 1A,6A,7A,8A,9A,2B
    0, 2, 2,2,2,6,
    // player2 tiles are 4A,10A,11A,12A,1B,4B
    1,1,1,1,1,1,
    //player3 tiles are 1C,5B,6B,7B,8B,9B
    1, 1, 1, 1, 1,4,
    // player4 tiles are 3A
    0, 0, 0, 0, 0, 0
  ],

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