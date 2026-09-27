/* Pure game rules, shared by the browser and the tests. */
(function (root) {
  'use strict';
  function createRound(random = Math.random) {
    return { car: Math.floor(random() * 3), initial: null, opened: null, final: null, phase: 'pick' };
  }
  function pick(round, door, random = Math.random) {
    if (round.phase !== 'pick' || !Number.isInteger(door) || door < 0 || door > 2) throw new Error('Choose an available door.');
    const goats = [0, 1, 2].filter(d => d !== door && d !== round.car);
    return { ...round, initial: door, opened: goats[Math.floor(random() * goats.length)], phase: 'decide' };
  }
  function finish(round, strategy) {
    if (round.phase !== 'decide' || !['switch', 'stay'].includes(strategy)) throw new Error('Choose switch or stay after picking a door.');
    const final = strategy === 'stay' ? round.initial : [0, 1, 2].find(d => d !== round.initial && d !== round.opened);
    return { ...round, final, strategy, won: final === round.car, phase: 'done' };
  }
  const api = { createRound, pick, finish };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MontyHall = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
