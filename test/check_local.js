// Headless check against a local http server: level 1 loads, its words are valid and solvable. URL=http://127.0.0.1:8765/ node check_local.js
const { chromium } = require('playwright-core'); const path = require('path'); const fs = require('fs');
const url = process.env.URL || 'http://127.0.0.1:8765/'; const SHOTS = process.env.SHOTS || path.join(__dirname, '..', 'screens');
const VALID = new Set(JSON.parse(fs.readFileSync(process.env.VALID || '/tmp/cv_valid.json', 'utf8')));
const sleep = ms => new Promise(r => setTimeout(r, ms)); let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail++; };
(async () => {

  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const page = await b.newPage({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const resp = await page.goto(url); ok(resp.status() === 200, 'HTTP 200 ' + url);
  await page.evaluate(() => localStorage.clear()); await page.reload(); await sleep(1200);
  ok(await page.evaluate(() => document.title.includes('Чӑваш сӑмахӗ')), 'title');
  await page.screenshot({ path: path.join(SHOTS, 'local_tutorial.png') });
  await page.click('#tutSkip').catch(() => {}); await sleep(300);
  await page.screenshot({ path: path.join(SHOTS, 'local_home.png') });
  await page.evaluate(() => chavashSamakhe.startGame('main', 0)); await sleep(1500);
  const lv = await page.evaluate(() => chavashSamakhe.game.lv); ok(lv && lv.id === 1, 'level 1 loaded: letters ' + lv.l + ', words ' + lv.w.map(x => x[0]).join(', '));
  const bg = await page.evaluate(() => document.getElementById('bg').style.backgroundImage); ok(/ch01\.webp/.test(bg), 'chapter 1 photo background ' + bg.slice(0, 60));
  const cnt = s => { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return m; };
  for (const [w] of lv.w) { const a = cnt(w), L = cnt(lv.l); ok(Object.keys(a).every(k => a[k] <= (L[k] || 0)) && VALID.has(w) && !!lv.g[w], `word ${w} valid (in dictionary, from letters, gloss «${(lv.g[w] || [''])[0]}»)`); }
  await page.screenshot({ path: path.join(SHOTS, 'local_level1.png') });
  for (const [w] of lv.w.slice(0, -1)) { await page.evaluate(w => chavashSamakhe.submit(w, []), w); await sleep(250); }
  await page.screenshot({ path: path.join(SHOTS, 'local_level1_progress.png') });
  await page.evaluate(w => chavashSamakhe.submit(w, []), lv.w[lv.w.length - 1][0]); await sleep(2500);
  ok(await page.evaluate(() => !!(chavashSamakhe.state.done || {})[0]), 'level 1 solved');
  await page.screenshot({ path: path.join(SHOTS, 'local_level1_win.png') });
  await page.evaluate(() => chavashSamakhe.startGame('main', 299)); await sleep(1500); await page.screenshot({ path: path.join(SHOTS, 'local_level300.png') });
  await page.evaluate(() => chavashSamakhe.openMap && chavashSamakhe.openMap()); await sleep(1000); await page.screenshot({ path: path.join(SHOTS, 'local_map.png') });
  ok(errs.length === 0, 'no JS errors ' + errs.join(' | '));
  await b.close(); console.log(fail ? fail + ' FAILED' : 'ALL PASSED'); process.exit(fail ? 1 : 0);
})();
