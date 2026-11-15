// Regression (11.2026): with two identical letters on the wheel the word must count whichever copy the player uses.
// Covers: other copy (string match), coming back onto an already used copy (its free twin is taken), grazing the near copy on
// the way to the far one ("саан" -> "сан"), bonus words, letters flying into the grid, mouse (desktop browser) + touch.
// Usage: node dup_letters.js  [ROOT=/path/to/build | URL=https://...]
const { chromium } = require('playwright-core'); const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ROOT = process.env.URL || ('file://' + (process.env.ROOT || path.resolve(__dirname, '..')) + '/index.html');
let fails = 0; const check = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
async function run(mode) {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext(mode === 'mouse' ? { viewport: { width: 1280, height: 800 } } : { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page); const errs = []; page.on('pageerror', e => errs.push(e.message));
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  const down = async (x, y) => { if (mode === 'mouse') { await page.mouse.move(x, y); await page.mouse.down(); } else await touch('touchStart', x, y); };
  const move = (x, y) => mode === 'mouse' ? page.mouse.move(x, y) : touch('touchMove', x, y);
  const up = () => mode === 'mouse' ? page.mouse.up() : touch('touchEnd');
  const xyOf = () => page.evaluate(() => chavashSamakhe.game.letterEls.map(e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }));
  // swipe through tile centres in order (straight segments)
  async function swipe(ord) { const xy = await xyOf(); await down(...xy[ord[0]]);
    for (let k = 1; k < ord.length; k++) { const [x0, y0] = xy[ord[k - 1]], [x1, y1] = xy[ord[k]]; for (let t = 1; t <= 10; t++) await move(x0 + (x1 - x0) * t / 10, y0 + (y1 - y0) * t / 10); await sleep(10); }
    const typed = await page.evaluate(() => document.getElementById('word').textContent); await up(); await sleep(150); return typed; }
  const open = async id => { await page.evaluate(i => { const s = chavashSamakhe.state; s.cur = null; chavashSamakhe.startGame('main', i); }, id); await sleep(900); };
  const reset = () => page.evaluate(() => { chavashSamakhe.game.found.clear(); chavashSamakhe.game.bonus.clear(); chavashSamakhe.closeModal(); });
  const has = w => page.evaluate(w => chavashSamakhe.game.found.has(w) || chavashSamakhe.game.bonus.has(w), w);
  await page.goto(ROOT); await page.evaluate(() => localStorage.clear()); await page.reload(); await sleep(800);
  await page.evaluate(() => chavashSamakhe.tutSkip());
  // level 416: wheel «саанне» (0 с, 1 а, 2 а, 3 н, 4 н, 5 е); grid асанне, анне, ана; bonus аса, сан, сана
  await open(415);
  const L = await page.evaluate(() => chavashSamakhe.game.letters.join(''));
  check(L === 'саанне', `${mode}: level 416 wheel = ${L}`);
  const cases = [
    ['ана', [2, 4, 1], 'grid word, 2nd «а» first'],
    ['ана', [1, 4, 2], 'grid word, 1st «а» first'],
    ['ана', [1, 4, 1], 'grid word, back onto the USED «а» (twin taken)'],
    ['ана', [2, 4, 2], 'grid word, back onto the used 2nd «а»'],
    ['анне', [2, 3, 4, 5], 'grid word via 2nd «а»'],
    ['асанне', [2, 0, 1, 3, 4, 5], 'grid word, «а» copies swapped'],
    ['сан', [0, 1, 2, 3], 'bonus word, grazing 1st «а» on the way to 2nd («саан»)'],
    ['сан', [0, 2, 3], 'bonus word via 2nd «а»'],
    ['аса', [2, 0, 2], 'bonus word, back onto the used «а»'],
    ['сана', [0, 2, 4, 1], 'bonus word, copies swapped'],
  ];
  for (const [w, o, what] of cases) { await reset(); const typed = await swipe(o); check(await has(w), `${mode}: ${w} ${JSON.stringify(o)} — ${what} (typed «${typed}»)`); }
  // letters fly into the grid and the cells show the word (no broken animation with the other copy)
  await reset(); await page.evaluate(() => { document.querySelectorAll('#grid .cell').forEach(c => { c.classList.remove('found'); c.textContent = ''; }); });
  await swipe([2, 4, 1]); await sleep(1200);
  const cellsOk = await page.evaluate(() => { const g = chavashSamakhe.game, t = g.lv.w.find(x => x[0] === 'ана');
    const cells = []; for (let i = 0; i < 3; i++) cells.push(t[3] === 'h' ? [t[1], t[2] + i] : [t[1] + i, t[2]]);
    return cells.map(([r, c]) => g.cells[r + ',' + c].el.textContent).join('') === 'ана' && !document.querySelector('#fly .flyl'); });
  check(cellsOk, `${mode}: «ана» via other copy revealed in the grid, fly layer cleaned`);
  // direct API: any index order with the same string counts (idx only drives the fly animation)
  await reset(); await page.evaluate(() => chavashSamakhe.submit('анне', [2, 4, 3, 5])); await sleep(700);
  check(await has('анне'), `${mode}: submit('анне', other copies) counts`);
  // a real non-word stays rejected
  await reset(); const t2 = await swipe([5, 0, 3]); check(!(await page.evaluate(() => chavashSamakhe.game.found.size + chavashSamakhe.game.bonus.size)), `${mode}: non-word «${t2}» rejected`);
  check(errs.length === 0, `${mode}: no JS errors ` + errs.slice(0, 2).join(' | '));
  await b.close();
}
(async () => { await run('touch'); await run('mouse');
  console.log(fails ? `DUP LETTERS TEST FAILED (${fails})` : 'DUP LETTERS TEST PASSED'); process.exit(fails ? 1 : 0); })();
