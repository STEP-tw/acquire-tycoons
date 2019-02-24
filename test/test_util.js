const Tile = require('../src/models/tile.js');
const FaceDownCluster = require('../src/models/face_down_cluster.js');
const Level = require('../src/models/level.js');
const Corporation = require('../src/models/corporation.js');

const corporationsData = require('../src/data/corporations_data.json');
const levelsData = require('../src/data/level_data.json');
const tilesData = require('../src/data/tiles_data.json');

const getLevelData = function(levelsData, levelId) {
  const levelName = getLevelName(levelId);
  return levelsData[levelName];
};

const getLevelName = function(levelId) {
  return 'level-' + levelId;
};

const initializeGame = function(game) {
  const corporations = getCorporations(corporationsData, levelsData);
  const faceDownCluster = getFaceDownCluster(tilesData);
  game.initialize(corporations, faceDownCluster);
};

const getCorporations = function(corporationsData, levelsData) {
  return corporationsData.map(corpoarationData => {
    return createCorporationInstance(corpoarationData, levelsData);
  });
};

const getFaceDownCluster = function(tilesData) {
  const tiles = tilesData.map(({ position, value }) => {
    return new Tile(position, value);
  });
  return new FaceDownCluster(tiles);
};

const createCorporationInstance = function({ name, levelId }, levelsData) {
  const levelData = getLevelData(levelsData, levelId);
  const level = new Level(levelData);
  return new Corporation(name, level);
};

module.exports = {
  getFaceDownCluster,
  getCorporations,
  createCorporationInstance,
  initializeGame
};
