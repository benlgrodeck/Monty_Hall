'use strict';
const $ = id => document.getElementById(id);
const storageKey = 'monty-hall-results-v1';
const emptyStats = () => ({ switch: { wins: 0, rounds: 0 }, stay: { wins: 0, rounds: 0 } });
let stats = emptyStats();
let canSave = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && ['switch', 'stay'].every(s => saved[s] && Number.isSafeInteger(saved[s].wins) && Number.isSafeInteger(saved[s].rounds) && saved[s].wins >= 0 && saved[s].rounds >= saved[s].wins)) stats = saved;
} catch { canSave = false; }
let round = MontyHall.createRound();
const doorButtons = [...document.querySelectorAll('[data-door]')];
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(stats)); canSave = true; } catch { canSave = false; }
}
function renderStats() {
  for (const strategy of ['switch', 'stay']) {
    const { wins, rounds } = stats[strategy];
    const rate = rounds ? wins / rounds * 100 : 0;
    $(strategy + '-rate').textContent = rounds ? rate.toFixed(1) + '%' : '—';
    $(strategy + '-bar').style.width = rate + '%';
    $(strategy + '-count').textContent = `${wins} ${wins === 1 ? 'win' : 'wins'} / ${rounds} ${rounds === 1 ? 'round' : 'rounds'}`;
  }
  const total = stats.switch.rounds + stats.stay.rounds;
  $('total').textContent = `${total} played`;
  $('round').textContent = `Round ${total + (round.phase === 'done' ? 0 : 1)}`;
  $('storage-note').textContent = canSave ? 'Saved in this browser. Only your completed rounds count.' : 'Browser storage is unavailable. Results last only until you leave this page.';
}
function render() {
  const done = round.phase === 'done';
  doorButtons.forEach((button, door) => {
    const open = done || round.opened === door;
    const content = door === round.car ? 'Car' : 'Goat';
    button.disabled = round.phase !== 'pick';
    button.className = 'door' + (door === round.initial ? ' selected' : '') + (open ? ' open' : '') + (done && door === round.car ? ' winner' : '');
    button.querySelector('.prize').textContent = open ? (door === round.car ? '🚗' : '🐐') : '';
    const label = done ? (door === round.final ? 'Your final choice' : door === round.initial ? 'Your first pick' : 'Revealed') : door === round.opened ? 'Host opened' : door === round.initial ? 'Your first pick' : 'Choose door';
    button.querySelector('.door-label').textContent = label;
    button.setAttribute('aria-label', `Door ${door + 1}${open ? ': ' + content : ''}. ${label}`);
  });
  $('choices').hidden = round.phase !== 'decide';
  $('next-area').hidden = !done;
  if (round.phase === 'pick') {
    $('heading').textContent = 'Pick your first door.';
    $('message').textContent = 'A car is hidden behind one door. Which one will you choose?';
  } else if (round.phase === 'decide') {
    const other = [0, 1, 2].find(d => d !== round.initial && d !== round.opened);
    $('heading').textContent = 'One goat down. Your move.';
    $('message').textContent = `You picked door ${round.initial + 1}. The host opened door ${round.opened + 1} to reveal a goat. Keep your pick or switch?`;
    $('stay').textContent = `Stay with door ${round.initial + 1}`;
    $('switch').textContent = `Switch to door ${other + 1}`;
  } else {
    $('heading').textContent = round.won ? 'You won the car!' : 'A goat this time!';
    $('message').textContent = `You ${round.strategy === 'switch' ? 'switched to' : 'stayed with'} door ${round.final + 1}. The car was behind door ${round.car + 1}. Your ${round.strategy} record has been updated.`;
  }
  renderStats();
}
function chooseDoor(door) { round = MontyHall.pick(round, door); render(); $('stay').focus(); }
function decide(strategy) {
  round = MontyHall.finish(round, strategy);
  stats[strategy].rounds++;
  if (round.won) stats[strategy].wins++;
  save(); render(); $('next').focus();
}
doorButtons.forEach((button, door) => button.addEventListener('click', () => chooseDoor(door)));
$('stay').addEventListener('click', () => decide('stay'));
$('switch').addEventListener('click', () => decide('switch'));
$('next').addEventListener('click', () => { round = MontyHall.createRound(); render(); doorButtons[0].focus(); });
$('reset').addEventListener('click', () => { $('reset-confirm').hidden = false; $('reset').hidden = true; $('cancel-reset').focus(); });
function closeReset() { $('reset-confirm').hidden = true; $('reset').hidden = false; $('reset').focus(); }
$('cancel-reset').addEventListener('click', closeReset);
$('confirm-reset').addEventListener('click', () => { stats = emptyStats(); round = MontyHall.createRound(); save(); render(); closeReset(); $('stats-status').textContent = 'Results cleared. A new round is ready.'; });
render();
// Optional browser agent integration; ordinary browsers need no extra API.
if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'read_monty_hall_results', description: 'Read the player’s completed switch and stay statistics.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: () => JSON.parse(JSON.stringify(stats))
    })).catch(() => {});
  } catch { /* Optional API unavailable. */ }
}
