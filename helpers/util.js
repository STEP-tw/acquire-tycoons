const generateCluster = function() {
  const characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return characters.reduce((result,character) => {
    const values = numbers.map(number => number + character);
    return result.concat(values);
  },[]);
};


const generateIndexes = function(values){
  const cluster = generateCluster();
  return values.map(value => {
    const index = cluster.indexOf(value);
    cluster.splice(index,1);
    return index;
  });
};

module.exports = generateIndexes;
