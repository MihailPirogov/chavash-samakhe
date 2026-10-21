// Web РСЯ ads: (1) empty IDs -> no context.js, no ads, no errors; (2) mocked IDs + mocked context.js -> banner renderTo after tutorial,
// fullscreen on 3rd win >=150 s, rewarded hint after onClose, hint still given when the ad errors. URL=http://127.0.0.1:8765/
const { chromium } = require('playwright-core');
const url = process.env.URL || 'http://127.0.0.1:8765/';
const sleep = ms => new Promise(r => setTimeout(r, ms)); let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail++; };
const MOCK = `window.__ya=[];window.Ya={Context:{AdvManager:{getPlatform(){return 'touch'},destroy(o){__ya.push(['destroy',o.blockId])},
 render(o){__ya.push([o.type||'banner',o.blockId,o.renderTo||'']);setTimeout(()=>{if(window.__yaFail&&o.type==='fullscreen'){o.onError&&o.onError({type:'error',code:'x'});return}
 if(o.renderTo){document.getElementById(o.renderTo).textContent='AD';o.onRender&&o.onRender()}else{o.onRender&&o.onRender();setTimeout(()=>o.onClose&&o.onClose(),300)}},50)}}}};
 (window.yaContextCb||[]).forEach(f=>f());window.yaContextCb={push:f=>f()};`;
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  // 1) empty IDs
  { const p = await b.newPage(); const errs = [], reqs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => reqs.push(r.url()));
    await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload(); await sleep(1200);
    await p.evaluate(() => chavashSamakhe.tutSkip()); await sleep(300);
    ok(!reqs.some(u => u.includes('context.js')), 'empty IDs: context.js not loaded');
    ok(await p.evaluate(() => !Platform.ads.bannerAvailable() && !Platform.ads.interstitialAvailable() && !Platform.ads.rewardedAvailable() && document.getElementById('bAd').hidden && !document.getElementById('webAdBanner')), 'empty IDs: no ads, 🎬 hidden as before');
    ok(errs.length === 0, 'empty IDs: no console errors ' + errs.join(' | ')); await p.close(); }
  // 2) mocked IDs
  const ctx = await b.newContext({ viewport: { width: 412, height: 860 } });
  await ctx.route('**/js/ads_web.js*', r => r.fulfill({ contentType: 'text/javascript', body: "window.WEB_ADS={bannerId:'R-A-TEST-1',fullscreenId:'R-A-TEST-2'};" }));
  await ctx.route('https://yandex.ru/ads/system/context.js', r => r.fulfill({ contentType: 'text/javascript', body: MOCK }));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload(); await sleep(1500);
  ok(await p.evaluate(() => !(window.__ya || []).length), 'no ads during tutorial');
  await p.evaluate(() => chavashSamakhe.tutSkip()); await sleep(500);
  const ya = () => p.evaluate(() => window.__ya.slice());
  ok((await ya()).some(x => x[0] === 'banner' && x[1] === 'R-A-TEST-1' && x[2] === 'webAdBanner'), 'banner render(renderTo:webAdBanner) after tutorial');
  ok(await p.evaluate(() => document.documentElement.classList.contains('withBanner') && document.getElementById('app').getBoundingClientRect().bottom <= document.getElementById('webAdBanner').getBoundingClientRect().top + 0.5), 'banner below #app, not covering game');
  const win = async i => { await p.evaluate(i => chavashSamakhe.startGame('main', i), i); await sleep(700);
    const w = await p.evaluate(() => chavashSamakhe.game.lv.w.map(x => x[0])); for (const x of w) await p.evaluate(x => chavashSamakhe.submit(x, []), x); await sleep(2200);
    if (await p.$('#wNext')) { await p.click('#wNext'); await sleep(900); } else await p.evaluate(() => chavashSamakhe.closeModal()); await sleep(600); };
  const fsCount = async () => (await ya()).filter(x => x[0] === 'fullscreen').length;
  await win(0); await win(1);
  ok(await fsCount() === 0, 'no fullscreen after 2 wins');
  await win(2); ok(await fsCount() === 0, 'no fullscreen on 3rd win before 150 s');
  // pretend 150 s passed: shift Date.now
  await p.evaluate(() => { const d = Date.now; const off = 200000; Date.now = () => d() + off; });
  await win(3); await win(4); await win(5); await sleep(800);
  ok(await fsCount() === 1, 'fullscreen fired on 3rd win after 150 s (count ' + await fsCount() + ')');
  // rewarded hint
  await p.evaluate(() => chavashSamakhe.startGame('main', 10)); await sleep(800);
  const hints = () => p.evaluate(() => chavashSamakhe.game.hints.size);
  let h0 = await hints(); await p.click('#bAd'); await sleep(200); await p.click('#adGo'); await sleep(150);
  ok(await hints() === h0, 'rewarded: no hint before ad closes');
  await sleep(800); ok(await hints() === h0 + 1 && await fsCount() === 2, 'rewarded: fullscreen shown, hint given after onClose');
  await p.evaluate(() => window.__yaFail = true); h0 = await hints(); await p.click('#bAd'); await sleep(200); await p.click('#adGo'); await sleep(800);
  ok(await hints() === h0 + 1, 'rewarded: ad error -> hint still given (graceful fallback)');
  ok(errs.length === 0, 'mocked IDs: no console errors ' + errs.join(' | '));
  await b.close(); console.log(fail ? fail + ' FAILED' : 'ALL PASSED'); process.exit(fail ? 1 : 0);
})();
