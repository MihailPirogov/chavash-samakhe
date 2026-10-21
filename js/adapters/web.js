/* Plain-web adapter: Yandex Advertising Network (РСЯ) web units, same placements as the Android app.
 * Loaded ONLY in the public web build (index.html <!--webads--> block; stripped from Yandex Games / Android builds).
 * IDs: window.WEB_ADS = {bannerId, fullscreenId} from js/ads_web.js. Each unit is independent; empty ID = that ad is off.
 * - banner -> regular block rendered into #webAdBanner (fixed bottom strip; #app shrinks via html.withBanner, never covers UI)
 * - interstitial -> Fullscreen unit (app keeps its caps: every 3rd win, >=150 s, same as Android)
 * - rewarded -> no web rewarded format: Fullscreen unit, hint granted after onClose; if the ad is blocked/unfilled/errors
 *   the hint is still granted (graceful fallback, the player tapped "watch" in good faith). Gameplay is never blocked.
 * Consistent with /workspace/mari-wow/js/adapters/web.js. */
(function () {
  if (window.YaGames || window.AndroidBridge || window.RELEASE) return;   // platform separation (release = Android/YG builds)          // platform separation
  if (/[?&]adsim=1\b/.test(location.search) && !window.RELEASE) return;  // ad simulation takes precedence in tests
  const W = window.WEB_ADS || {}; const CFG = { banner: String(W.bannerId || '').trim(), fullscreen: String(W.fullscreenId || '').trim() };
  if (!CFG.banner && !CFG.fullscreen) return;                  // no IDs -> no ads, no context.js
  window.yaContextCb = window.yaContextCb || [];
  let loaded = null;   // null = pending, true = loader ok, false = blocked/failed
  const waiters = [];
  (function load() {
    const s = document.createElement('script'); s.async = true; s.src = 'https://yandex.ru/ads/system/context.js';
    const done = ok => { if (loaded !== null) return; loaded = ok; waiters.splice(0).forEach(f => f(ok)); };
    s.onload = () => done(!!(window.Ya && Ya.Context && Ya.Context.AdvManager));
    s.onerror = () => done(false);
    setTimeout(() => done(!!(window.Ya && Ya.Context && Ya.Context.AdvManager)), 10000);
    (document.head || document.documentElement).appendChild(s);
  })();
  const ready = () => loaded !== null ? Promise.resolve(loaded) : new Promise(r => waiters.push(r));
  const mgr = () => (window.Ya && Ya.Context && Ya.Context.AdvManager) || null;
  const plat = () => { try { const p = mgr().getPlatform(); if (p) return p === 'desktop' ? 'desktop' : 'touch'; } catch (e) {}
    return (matchMedia('(pointer: coarse)').matches || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) ? 'touch' : 'desktop'; };
  const log = (...a) => { if (!window.RELEASE) try { console.info('[webads]', ...a); } catch (e) {} };

  /* ---- bottom banner (renderTo #webAdBanner) ---- */
  let bannerWanted = false, bannerLive = false;
  const bannerCls = on => document.documentElement.classList.toggle('withBanner', on);
  function renderBanner() {
    const M = mgr(); if (!M || !bannerWanted || bannerLive) return;
    bannerLive = true;
    try {
      window.yaContextCb.push(() => {
        if (!bannerWanted) { bannerLive = false; return; }
        try {
          let el = document.getElementById('webAdBanner');
          if (!el) { el = document.createElement('div'); el.id = 'webAdBanner'; document.body.appendChild(el); }
          el.hidden = false;
          M.render({ blockId: CFG.banner, renderTo: 'webAdBanner',
            onRender: () => { if (bannerWanted) bannerCls(true); },
            onError: d => { log('banner', d && d.code); bannerCls(false); } });
        } catch (e) { bannerLive = false; }
      });
    } catch (e) { bannerLive = false; }
  }
  function destroyBanner() {
    bannerCls(false); const el = document.getElementById('webAdBanner'); if (el) { el.hidden = true; el.innerHTML = ''; }
    if (!bannerLive) return; bannerLive = false;
    try { const M = mgr(); M && M.destroy && M.destroy({ blockId: CFG.banner }); } catch (e) {}
  }

  /* ---- Fullscreen ---- */
  let fsBusy = false;
  function showFullscreen() {
    if (fsBusy || !CFG.fullscreen) return Promise.resolve(false);
    fsBusy = true;
    return ready().then(ok => new Promise(res => {
      const M = mgr(); if (!ok || !M) return res(false);
      let shown = false, fin = false, t1, t2;
      const end = v => { if (fin) return; fin = true; clearTimeout(t1); clearTimeout(t2); if (shown) try { Platform.audio.resume('ad'); } catch (e) {} res(v); };
      t1 = setTimeout(() => { if (!shown) end(false); }, 5000);          // no fill / silent -> continue the game
      try {
        window.yaContextCb.push(() => {
          try {
            M.render({ blockId: CFG.fullscreen, type: 'fullscreen', platform: plat(),
              onRender: () => { if (fin) return; shown = true; clearTimeout(t1); try { Platform.audio.suspend('ad'); } catch (e) {}
                t2 = setTimeout(() => end(true), 90000); },                // safety cap if onClose never fires
              onClose: () => end(true),
              onError: d => { log('fullscreen', d && d.code); if (!d || d.type !== 'warning') end(false); } });
          } catch (e) { end(false); }
        });
      } catch (e) { end(false); }
    })).catch(() => false).finally(() => { fsBusy = false; });
  }

  Platform.use({
    name: 'web',
    ads: {
      rewardedAvailable() { return !!CFG.fullscreen; },   // if the ad is blocked/unfilled the hint is granted at once
      async showRewarded() { await showFullscreen(); return true; },   // reward always granted (after close, or at once on no-fill)
      interstitialAvailable() { return !!CFG.fullscreen && loaded !== false; },
      async showInterstitial() { await showFullscreen(); },
      bannerAvailable() { return !!CFG.banner && loaded !== false; },
      showBanner() { bannerWanted = true; ready().then(ok => ok && renderBanner()); },
      hideBanner() { bannerWanted = false; destroyBanner(); },
    },
  });
})();
