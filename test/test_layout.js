// Layout fit test: game screen at many viewports, with/without a bottom banner reserve. Usage: OUT=dir node test_layout.js
const { chromium } = require('playwright-core'); const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..'), OUT = process.env.OUT || path.join(ROOT, 'shots', 'layout'); fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const sizes = [[320,568],[360,640],[360,780],[393,852],[412,915],[412,738],[768,1024],[800,1280]];
const banners = [0,50,60,90];
let fails = 0;
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w,h] of sizes) for (const ban of banners) for (const mode of ['android','web']) {
    if (ban === 0 && mode === 'web') continue;
    const vh = mode === 'android' ? h - ban : h;   // Android: native banner below WebView shrinks the viewport
    const ctx = await b.newContext({ viewport: { width: w, height: vh }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
    await p.goto('file://' + path.join(ROOT, 'index.html')); await p.evaluate(() => { localStorage.clear(); }); await p.reload(); await sleep(500);
    await p.evaluate(() => { try { chavashSamakhe.tutSkip(); } catch (e) {} });
    const lvIdx = await p.evaluate(() => { const L = chavashSamakhe.data.levels; let bi = 0, bs = 0; L.forEach((l, i) => { const s = Math.max(l.r, l.c * 0.8) ; if (s > bs) { bs = s; bi = i; } }); return bi; });
    await p.evaluate(i => { const s = chavashSamakhe.state; s.tut = { done: true, step: 0 }; chavashSamakhe.state = s; chavashSamakhe.startGame('level', i); }, lvIdx);
    if (mode === 'web') await p.evaluate(px => { document.documentElement.style.setProperty('--ad-h', px + 'px'); document.documentElement.classList.add('withBanner'); const d = document.createElement('div'); d.id = 'webAdBanner'; d.style.cssText = 'height:' + px + 'px;max-height:' + px + 'px;background:#ccc'; document.body.appendChild(d); window.dispatchEvent(new Event('resize')); }, ban);
    await sleep(900);
    await p.evaluate(() => { const s = document.getElementById('word'); s.textContent = 'КАУӐ'; });
    const r = await p.evaluate(() => {
      const R = id => document.getElementById(id).getBoundingClientRect();
      const top = document.querySelector('#scrGame .topbar').getBoundingClientRect();
      const g = R('grid'), pv = R('word'), wh = R('wheel'), app = R('app');
      const sides = [...document.querySelectorAll('#scrGame .gbtn')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect());
      const bot = Math.min(app.bottom, innerHeight);
      return { gT: g.top, gB: g.bottom, topB: top.bottom, pT: pv.top, pB: pv.bottom, wT: wh.top, wB: wh.bottom, bot, cell: document.querySelector('#grid .cell').getBoundingClientRect().width, sideB: Math.max(...sides.map(s => s.bottom)), landscape: innerWidth > innerHeight };
    });
    const land = r.landscape;
    const okk = r.gT >= r.topB - 1 && (land || r.gB <= r.pT + 1) && r.pB <= r.wT + 1 && r.wB <= r.bot + 1 && r.sideB <= r.bot + 1 && r.cell >= (r.bot < 560 ? 12 : 14);
    const name = `${w}x${h}_${mode}_${ban}`;
    console.log((okk ? 'PASS ' : 'FAIL ') + name + ' ' + JSON.stringify(r)); if (!okk) fails++;
    try { await p.screenshot({ path: path.join(OUT, name + ".png"), timeout: 60000 }); } catch (e) { console.log("  (no shot " + name + ")"); } await ctx.close();
  }
  await b.close(); console.log(fails ? fails + ' FAIL' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
