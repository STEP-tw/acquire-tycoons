const { expect } = require('chai');

const { random } = require('../../src/util.js');

describe('random', function() {
  it('testing Math.random', () => {
    expect(random(1)).to.equal(0);
  });
});
