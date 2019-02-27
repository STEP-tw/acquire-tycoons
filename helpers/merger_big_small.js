/*
  after finishing the array elements(tiles) in random
  it will give the number by Math.random
*/
module.exports = {
  array :[
    // initial tiles are 2A,5A,1B,3B
    1,3,10,11,
    //player1 tiles are 1A,6A,8A,10A,11A,12A
    0,2,3,3,3,3,
    //player2 tiles are 4A,2B,4B,5B,6B,7B
    1,2,2,2,2,2,
    //player3 tiles are 7A,8B,9B,10B,11B,12B
    1,1,1,1,1,1,
    // player4 tiles are 3A
    0
  ],
  processes : [
    {
      id:'placeTile',
      data:'1A',
      comments:'Player1 places 1A tile'
    },
    {
      id:'establishCorporation',
      data:'Quantum',
      /* there is already initial tile(2A,1B) placed on the board
        so that player can establish corporation
      */
      comments:'Player1 establish Quantum corporation'
    },
    {
      id:'buyStocks',
      data:{ Quantum:3 },
      comments:'Player1 bought 3 Quantum stocks'
    },
    {
      id:'placeTile',
      data:'4A',
      comments:'Player2 places 4A tile'
    },
    {
      id:'establishCorporation',
      data:'Phoenix',
      comments:'Player2 establish Pheonix corporation'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 2, Phoenix:1 },
      comments: 'Player2 bought 2-Quantum and 1-Phoenix stocks'
    },
    {
      id: 'placeTile',
      data: '7A',
      comments: 'Player3 places 7A tile'
    },
    {
      id: 'buyStocks',
      data: { Quantum: 1,Phoenix:1 },
      comments: 'Player3 bought 1 Quantum and 1Pheonix stocks'
    }
  ]
};