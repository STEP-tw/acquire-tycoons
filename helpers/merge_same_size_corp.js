module.exports = {
  array:[
    //initial tiles are 2A,5A,1B,5B
    1,3,10,13,
    // player1 tiles are 1A,3A,6A,7A,8A,9A
    0,0,1,1,1,1,
    // player2 tiles are 4A,10A,11A,12A,3B,6B
    0,0,0,0,1,2,
    //player3 tiles are 2B,7B,8B,9B,10B,11B
    0,1,1,1,1,1,
    // player4 tiles are 4B,12B,1C,2C,3C,4C
    0,0,0,0,0,0
  ],
  processes : [
    {
      id: 'placeTile',
      data: '1A',
      comment:'Player1 places 1A tile'
    },
    {
      id: 'establishCorporation',
      data: 'Phoenix',
      comment: 'Player1 establish corporation Phoenix'
    },
    {
      id: 'buyStocks',
      data: { Phoenix:3 },
      comment:'Player1 buy 3 stock of phoenix corporation '
    },
    {
      id: 'placeTile',
      data: '4A',
      comment:'Player2 places 4A tile'
    },
    {
      id:'establishCorporation',
      data:'Hydra',
      comment: 'Player2 establish corporation Hydra'
    },
    {
      id:'buyStocks',
      data:{ Phoenix : 2, Hydra : 1 },
      comment:'Player2 buy 1 stock of Hydra and 2 stock of Phoenix'
    },
    {
      id:'placeTile',
      data:'2B',
      comment:'Player3 places 2B tile'
    },
    {
      id:'buyStocks',
      data:{ Phoenix : 2, Hydra : 1 },
      comment: 'Player3 buy stocks of 2-Phoenix 1-Hydra'
    },
    {
      id:'placeTile',
      data:'4B',
      comment: 'Player4 places 4B tile'
    },
    {
      id:'buyStocks',
      data:{ Hydra : 3 },
      comment:'player4 buy stocks of 3-Hydra'
    }
  ]
};