const {createCorporationInstance} = require('./models/corporation.js');
const {Tile} = require('./models/tile.js');
const {FaceDownCluster} = require('./models/face_down_cluster.js');
const corpoarationsData = require('./data/corporations_data.json');
const levelsData = require('./data/level_data.json');
const tilesData = require('./data/tiles_data.json');

const random = function(length) {
  return Math.floor(Math.random() * length);
};

const getCorporations = function(corpoarationsData, levelsData) {
  return corpoarationsData.map(corpoarationData => {
    return createCorporationInstance(corpoarationData, levelsData);
  });
};

const getFaceDownCluster = function(tilesData) {
  const tiles = tilesData.map(({position, value}) => {
    return new Tile(position, value);
  });
  return new FaceDownCluster(tiles);
};

const initializeGame = function(game) {
  const corporations = getCorporations(corpoarationsData, levelsData);
  const faceDownCluster = getFaceDownCluster(tilesData);
  game.initialize(corporations, faceDownCluster);
};

module.exports = {
  random,
  initializeGame,
  getFaceDownCluster,
  getCorporations
};
