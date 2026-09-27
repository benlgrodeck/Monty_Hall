const assert = require('node:assert/strict');
const { createRound, pick, finish } = require('./game.js');
let switchWins = 0, stayWins = 0;
for (let car = 0; car < 3; car++) {
  for (let initial = 0; initial < 3; initial++) {
    for (const hostRandom of [0, 0.9999]) {
      const round = pick(createRound(() => (car + 0.5) / 3), initial, () => hostRandom);
      assert.notEqual(round.opened, car, 'Host must never reveal car');
      assert.notEqual(round.opened, initial, 'Host must never open selected door');
      const switched = finish(round, 'switch');
      const stayed = finish(round, 'stay');
      assert.notEqual(switched.final, initial);
      assert.equal(stayed.final, initial);
      assert.equal(switched.won, !stayed.won);
      switchWins += Number(switched.won);
      stayWins += Number(stayed.won);
      assert.throws(() => finish(switched, 'switch'), 'Completed rounds cannot be counted twice');
    }
  }
}
assert.equal(switchWins, 12);
assert.equal(stayWins, 6);
assert.throws(() => finish(createRound(), 'stay'));
assert.throws(() => pick(createRound(), 3));
assert.throws(() => finish(pick(createRound(), 0), 'invalid'));
console.log('Passed: all car/initial-pick combinations and both host choices; switch wins 12/18, stay wins 6/18; invalid/repeated actions rejected.');
