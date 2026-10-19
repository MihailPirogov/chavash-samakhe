/* Procedural SVG art for «Чӑваш сӑмахӗ»: Chuvashia landscapes (Atăl/Volga, Sura, forests, meadows, birch groves, villages with carved
   window frames and painted gates, a festive Akatuy pole with embroidered towels, tall meadow herbs) in a Chuvash folk style:
   geometric counted-thread embroidery (rhombuses, stepped diamonds, zigzags, chevrons) in red, black, linen white and gold.
   Deliberately NO religious imagery: no churches, chapels, crosses (no cross-shaped motifs either), domes, spires or idols; the moon is always full.
   All original code. */
(function () {
  'use strict';
  function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  // traditional colours
  const C = { green: '#1f1517', green2: '#120c0d', black: '#1f1517', leaf: '#2f8a4e', red: '#b8202f', red2: '#7a0f1c', gold: '#e0ad3a', gold2: '#b8841c',
    cream: '#f6efe2', white: '#fffaf2', blue: '#2a7fa8', brown: '#8a5a32', plum: '#5a1f3a' };
  const P = {   // sky top/bottom, sun, far, mid, near, ground, acc + features
    meadow:   { sky: ['#5ab8cf', '#f6efd6'], sun: '#ffd970', far: '#8fbf8f', mid: '#4f9a5c', near: '#2b7a46', ground: '#1d5e38', acc: C.red, flowers: 1, trees: 'birch' },
    forest:   { sky: ['#3f9ab4', '#e8efd8'], sun: '#ffe7a0', far: '#5f9078', mid: '#2a6a4c', near: '#174d36', ground: '#0f3b29', acc: C.gold, trees: 'forest', flowers: .4 },
    lake:     { sky: ['#3a8fc0', '#eef3e0'], sun: '#fff0b8', far: '#5c9488', mid: '#2e6c5a', near: '#1c5244', ground: '#123d32', acc: C.cream, trees: 'pine', lake: 1, lilies: 1 },
    river:    { sky: ['#62b4d4', '#fbf0d4'], sun: '#ffd970', far: '#9cbc94', mid: '#5c9a62', near: '#367a4a', ground: '#255c38', acc: C.red, trees: 'birch', river: 1, flowers: .5 },
    atal:     { sky: ['#4aa6cf', '#fbeccc'], sun: '#ffd060', far: '#a6b896', mid: '#6f9a68', near: '#3f7a4c', ground: '#2a5e3a', acc: C.gold, atal: 1, boat: 1, gulls: 1 },
    hills:    { sky: ['#58a8cc', '#fde6c0'], sun: '#ffc860', far: '#b4ab92', mid: '#88a26e', near: '#567f50', ground: '#3a6040', acc: C.gold, trees: 'birch', herbs: .5 },
    field:    { sky: ['#7cc4e6', '#fff1c8'], sun: '#ffd34a', far: '#bfc884', mid: '#e0b950', near: '#cf9a34', ground: '#9c6c22', acc: C.red, wheat: 1, stacks: 1 },
    grove:    { sky: ['#8fd0dc', '#f8f4e0'], sun: '#ffffff', far: '#a8d0a0', mid: '#72b46c', near: '#46924e', ground: '#2f7440', acc: C.red, trees: 'birch', flowers: 1 },
    village:  { sky: ['#f4a868', '#fde8c4'], sun: '#fff0b0', far: '#b89a7a', mid: '#7c8a58', near: '#4c6040', ground: '#30402c', acc: C.gold, houses: 1, trees: 'birch' },
    city:     { sky: ['#4f9fcc', '#fbeed2'], sun: '#ffd970', far: '#a4b89a', mid: '#6a9466', near: '#3d744a', ground: '#28583a', acc: C.gold, atal: 1, houses: 1, flowers: .4 },
    akatuy: { sky: ['#5cbde0', '#fff4d6'], sun: '#ffd34a', far: '#9cc890', mid: '#5eaa60', near: '#348546', ground: '#226436', acc: C.red, akatuy: 1, flowers: .7, trees: 'birch' },
    herbs:    { sky: ['#6ab0d0', '#fbe8c8'], sun: '#ffcf68', far: '#b0b48c', mid: '#8aa266', near: '#5c8048', ground: '#3e6034', acc: C.gold, herbs: 1, flowers: .3 },
    autumn:   { sky: ['#e0995a', '#fbe6c0'], sun: '#fff0c0', far: '#c8904a', mid: '#b0602c', near: '#7e3c20', ground: '#552818', acc: C.gold, trees: 'oak', leaves: 1 },
    winter:   { sky: ['#86b6d8', '#f2f6fa'], sun: '#ffffff', far: '#cddcea', mid: '#a8c4dc', near: '#e8f0f8', ground: '#ffffff', acc: C.red, trees: 'pinesnow', snow: 1 },
    spring:   { sky: ['#7ccbe6', '#f6fbe8'], sun: '#fff2b0', far: '#a6d49c', mid: '#74c072', near: '#4aa258', ground: '#358444', acc: C.red, trees: 'birch', flowers: 1.3 },
    summer:   { sky: ['#2fa0da', '#cdeefc'], sun: '#ffe060', far: '#7cc088', mid: '#46a05a', near: '#287e44', ground: '#1c6034', acc: C.gold, trees: 'oak', flowers: 1.1 },
    night:    { sky: ['#06182a', '#1c4258'], sun: '#f6eccc', far: '#1d3e4c', mid: '#14323c', near: '#0d262e', ground: '#071a20', acc: C.gold, trees: 'pine', stars: 1, moon: 1, lights: 1 },
    sunset:   { sky: ['#3c2448', '#f59a52'], sun: '#ffcf70', far: '#7c4658', mid: '#52304a', near: '#341f34', ground: '#211424', acc: C.gold, atal: 1, trees: 'pine' },
    dawn:     { sky: ['#eeb2a8', '#fff0d6'], sun: '#ffffff', far: '#c4aab2', mid: '#98a0a4', near: '#6c8884', ground: '#4c6864', acc: C.cream, trees: 'birch', mist: 1, river: 1 },
  };
  const f1 = n => Math.round(n * 10) / 10;
  function wave(r, y, amp, w, h, n) {
    let d = `M0 ${h} L0 ${f1(y)}`; const step = w / n;
    for (let i = 1; i <= n; i++) { const x = i * step; d += ` Q ${f1(x - step / 2)} ${f1(y - amp * (0.4 + r()))} ${f1(x)} ${f1(y + (r() - .5) * amp * .6)}`; }
    return d + ` L${w} ${h} Z`;
  }
  /* ---------- folk motifs ---------- */
  const ST = (c, w) => `stroke="${c}" stroke-width="${w || 1.2}" stroke-dasharray="${(w || 1.2) * 1.6} ${(w || 1.2) * 1.2}" stroke-linecap="round"`;   // chain-stitch outline
  function stepFlower(x, y, s, col, opt) {      // embroidered flower: stem, two angular leaves, stepped rhombus head with an inner rhombus
    const o = opt || {}, lf = o.leaf || C.leaf, st = o.stitch || C.gold;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s / 20 * 100) / 100})">` +
      `<path d="M0 0 V-20" stroke="${lf}" stroke-width="2" fill="none"/>` +
      `<path d="M0 -4 L-10 -10 L-8 -14 Z M0 -8 L10 -14 L8 -18 Z" fill="${lf}"/>` +
      `<path d="M0 -40 L4 -36 L8 -32 L4 -28 L0 -22 L-4 -28 L-8 -32 L-4 -36 Z" fill="${col}" ${ST(st, .9)}/>` +
      `<path d="M0 -35 L3 -31.5 L0 -28 L-3 -31.5 Z" fill="${st}"/></g>`;
  }
  function rosetteFlower(x, y, s, col, opt) {  // eight-petal geometric rosette of small rhombuses
    const o = opt || {}, lf = o.leaf || C.leaf, st = o.stitch || C.gold;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s / 20 * 100) / 100})"><path d="M0 0 V-16" stroke="${lf}" stroke-width="2" fill="none"/>` +
      `<path d="M0 -5 L-8 -11 L-6 -14 Z M0 -8 L8 -14 L6 -17 Z" fill="${lf}"/>`;
    for (let i = 0; i < 8; i++) g += `<path d="M0 -26 L2.4 -31 L0 -36 L-2.4 -31 Z" fill="${i % 2 ? st : col}" transform="rotate(${i * 45 + 22.5} 0 -26)"/>`;
    return g + `<path d="M0 -29 L3 -26 L0 -23 L-3 -26 Z" fill="${C.black}"/></g>`;
  }
  function bloom(x, y, s, col) {           // round rosette flower (meadow)
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s / 20 * 100) / 100})"><path d="M0 0 L0 -14" stroke="${C.leaf}" stroke-width="2"/>`;
    for (let i = 0; i < 6; i++) g += `<ellipse cx="0" cy="-23" rx="2.6" ry="5" fill="${col}" transform="rotate(${i * 60} 0 -18)"/>`;
    return g + `<circle cx="0" cy="-18" r="2.6" fill="${C.gold}"/></g>`;
  }
  function folkSun(x, y, r, col, rays) {   // sun rosette with petal rays
    let g = `<g transform="translate(${f1(x)} ${f1(y)})">`;
    if (rays) for (let i = 0; i < 12; i++) g += `<path d="M0 ${-r - 4} C${r * .22} ${-r - 10} ${r * .1} ${-r - 20} 0 ${-r - 24} C${-r * .1} ${-r - 20} ${-r * .22} ${-r - 10} 0 ${-r - 4} Z" fill="${col}" opacity=".55" transform="rotate(${i * 30})"/>`;
    g += `<circle r="${r}" fill="${col}"/>`;
    if (rays) g += `<circle r="${r * .72}" fill="none" ${ST('#fff', 1.4)} opacity=".7"/>`;
    return g + '</g>';
  }
  function cloud(x, y, w, op) {             // scalloped cloud with a curl
    const h = w * .3;
    return `<g opacity="${op}" fill="#fffaf0"><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w * .5)}" ry="${f1(h * .55)}"/><circle cx="${f1(x - w * .2)}" cy="${f1(y - h * .35)}" r="${f1(h * .55)}"/>` +
      `<circle cx="${f1(x + w * .12)}" cy="${f1(y - h * .55)}" r="${f1(h * .7)}"/><path d="M${f1(x + w * .05)} ${f1(y - h * .5)} q ${f1(h * .3)} -${f1(h * .3)} ${f1(h * .45)} 0 q -${f1(h * .1)} ${f1(h * .25)} -${f1(h * .3)} ${f1(h * .1)}" fill="none" stroke="${C.gold}" stroke-width="1.4" opacity=".55"/></g>`;
  }
  function pine(x, y, s, col, snow) {
    let g = `<g fill="${col}"><rect x="${f1(x - s * .05)}" y="${f1(y - s * .2)}" width="${f1(s * .1)}" height="${f1(s * .22)}" fill="#3a2a1a"/>`;
    for (let k = 0; k < 3; k++) { const yy = y - s * (.15 + k * .27), ww = s * (.4 - k * .1); g += `<path d="M${f1(x - ww)} ${f1(yy)} L${f1(x)} ${f1(yy - s * .4)} L${f1(x + ww)} ${f1(yy)} Z"/>`; if (snow) g += `<path d="M${f1(x - ww * .45)} ${f1(yy - s * .22)} L${f1(x)} ${f1(yy - s * .4)} L${f1(x + ww * .45)} ${f1(yy - s * .22)} Z" fill="#fff" opacity=".92"/>`; }
    return g + '</g>';
  }
  function birch(x, y, s, leaf, r) {
    let g = `<rect x="${f1(x - s * .03)}" y="${f1(y - s)}" width="${f1(s * .06)}" height="${f1(s)}" fill="#f6f1e6"/>`;
    for (let k = 0; k < 5; k++) g += `<rect x="${f1(x - s * .03)}" y="${f1(y - s * (.15 + k * .17))}" width="${f1(s * (.025 + r() * .035))}" height="${f1(s * .018)}" fill="#2a2a2a"/>`;
    return g + `<ellipse cx="${f1(x)}" cy="${f1(y - s * .95)}" rx="${f1(s * .26)}" ry="${f1(s * .4)}" fill="${leaf}" opacity=".95"/>`;
  }
  function oak(x, y, s, leaf, r, acc) {
    let g = `<path d="M${f1(x - s * .05)} ${f1(y)} L${f1(x - s * .03)} ${f1(y - s * .55)} L${f1(x + s * .03)} ${f1(y - s * .55)} L${f1(x + s * .05)} ${f1(y)} Z" fill="#4a3220"/>`;
    for (let k = 0; k < 4; k++) g += `<circle cx="${f1(x + (r() - .5) * s * .5)}" cy="${f1(y - s * (.62 + r() * .3))}" r="${f1(s * (.2 + r() * .1))}" fill="${leaf}"/>`;
    if (acc) for (let k = 0; k < 4; k++) g += `<circle cx="${f1(x + (r() - .5) * s * .6)}" cy="${f1(y - s * (.6 + r() * .35))}" r="${f1(s * .03)}" fill="${acc}"/>`;
    return g;
  }
  function house(x, y, s, r) {            // Chuvash village house: log walls, carved window frames, painted gate (хапха)
    const wall = ['#9a6a3c', '#a8743e', '#7f5a36'][Math.floor(r() * 3)], roof = ['#3a2a2c', '#2f6d8a', C.red2][Math.floor(r() * 3)], trim = [C.cream, '#7cc8d8', C.gold][Math.floor(r() * 3)];
    const w = s, h = s * .62;
    let g = `<g><rect x="${f1(x)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" fill="${wall}"/>`;
    for (let k = 1; k < 5; k++) g += `<line x1="${f1(x)}" y1="${f1(y - h * k / 5)}" x2="${f1(x + w)}" y2="${f1(y - h * k / 5)}" stroke="#00000033" stroke-width="1"/>`;
    g += `<path d="M${f1(x - w * .08)} ${f1(y - h)} L${f1(x + w / 2)} ${f1(y - h - w * .42)} L${f1(x + w * 1.08)} ${f1(y - h)} Z" fill="${roof}"/>` +
      `<path d="M${f1(x + w * .2)} ${f1(y - h - 1)} L${f1(x + w / 2)} ${f1(y - h - w * .3)} L${f1(x + w * .8)} ${f1(y - h - 1)} Z" fill="${trim}" opacity=".9"/>` +
      `<circle cx="${f1(x + w / 2)}" cy="${f1(y - h - w * .13)}" r="${f1(w * .06)}" fill="${wall}"/>`;
    for (const wx of [.18, .58]) {
      const X = x + w * wx, Y = y - h * .78, ww = w * .24, wh = h * .42;
      g += `<path d="M${f1(X - 2)} ${f1(Y)} q ${f1(ww / 2 + 2)} -${f1(wh * .45)} ${f1(ww + 4)} 0 Z" fill="${trim}"/><rect x="${f1(X)}" y="${f1(Y)}" width="${f1(ww)}" height="${f1(wh)}" fill="#ffe6a0" stroke="${trim}" stroke-width="2.5"/>` +
        `<line x1="${f1(X + ww / 2)}" y1="${f1(Y)}" x2="${f1(X + ww / 2)}" y2="${f1(Y + wh)}" stroke="${trim}" stroke-width="1.6"/><rect x="${f1(X - 2)}" y="${f1(Y + wh)}" width="${f1(ww + 4)}" height="2.5" fill="${trim}"/>`;
    }
    // gate with an arched top and a sun-ray pattern
    const gx = x + w + s * .08, gw = s * .55, gh = s * .62, gc = ['#3a2a2c', '#2f7f9a', C.red][Math.floor(r() * 3)];
    g += `<rect x="${f1(gx)}" y="${f1(y - gh)}" width="${f1(gw)}" height="${f1(gh)}" fill="${gc}"/><path d="M${f1(gx - 2)} ${f1(y - gh)} Q ${f1(gx + gw / 2)} ${f1(y - gh - gw * .55)} ${f1(gx + gw + 2)} ${f1(y - gh)} Z" fill="${gc}"/>`;
    for (let k = 0; k < 7; k++) { const a = Math.PI * (1 + (k + .5) / 7); g += `<line x1="${f1(gx + gw / 2)}" y1="${f1(y - gh)}" x2="${f1(gx + gw / 2 + Math.cos(a) * gw * .42)}" y2="${f1(y - gh + Math.sin(a) * gw * .35)}" stroke="${C.gold}" stroke-width="1.4"/>`; }
    g += `<circle cx="${f1(gx + gw / 2)}" cy="${f1(y - gh)}" r="${f1(gw * .09)}" fill="${C.gold}"/><line x1="${f1(gx + gw / 2)}" y1="${f1(y - gh)}" x2="${f1(gx + gw / 2)}" y2="${f1(y)}" stroke="#00000044" stroke-width="1.2"/>` +
      `<rect x="${f1(gx + gw * .12)}" y="${f1(y - gh * .7)}" width="${f1(gw * .28)}" height="${f1(gh * .4)}" fill="none" stroke="${C.gold}" stroke-width="1.2"/><rect x="${f1(gx + gw * .6)}" y="${f1(y - gh * .7)}" width="${f1(gw * .28)}" height="${f1(gh * .4)}" fill="none" stroke="${C.gold}" stroke-width="1.2"/>`;
    return g + '</g>';
  }
  function festPole(x, yb, h, r) {        // Akatuy festival pole with embroidered towels (тутӑр) and bunting
    let g = `<g><line x1="${f1(x)}" y1="${f1(yb)}" x2="${f1(x)}" y2="${f1(yb - h)}" stroke="#7a5230" stroke-width="5"/><circle cx="${f1(x)}" cy="${f1(yb - h)}" r="5" fill="${C.gold}"/>`;
    for (let i = 0; i < 5; i++) {
      const a = -0.9 + i * .45, len = h * (.22 + r() * .06), x2 = x + Math.sin(a) * 22, y0 = yb - h + 8;
      g += `<path d="M${f1(x)} ${f1(y0)} Q ${f1(x + Math.sin(a) * 14)} ${f1(y0 + len * .5)} ${f1(x2)} ${f1(y0 + len)}" stroke="${C.white}" stroke-width="10" fill="none"/>` +
        `<path d="M${f1(x2 - 3.5)} ${f1(y0 + len - 6)} L${f1(x2 + 3.5)} ${f1(y0 + len - 6)}" stroke="${C.red}" stroke-width="5"/><path d="M${f1(x2 - 3.5)} ${f1(y0 + len - 12)} L${f1(x2 + 3.5)} ${f1(y0 + len - 12)}" stroke="${C.black}" stroke-width="2.5"/>`;
    }
    return g + '</g>';
  }
  function bunting(x0, y0, x1, y1, sag, r) {
    let g = `<path d="M${f1(x0)} ${f1(y0)} Q ${f1((x0 + x1) / 2)} ${f1((y0 + y1) / 2 + sag)} ${f1(x1)} ${f1(y1)}" stroke="#5a3a20" stroke-width="1.2" fill="none"/>`;
    const cols = [C.red, C.gold, C.black, C.cream];
    for (let i = 1; i < 12; i++) {
      const t = i / 12, x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * (x0 + x1) / 2 + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * ((y0 + y1) / 2 + sag) + t * t * y1;
      g += `<path d="M${f1(x - 5)} ${f1(y)} L${f1(x + 5)} ${f1(y)} L${f1(x)} ${f1(y + 11)} Z" fill="${cols[i % 4]}"/>`;
    }
    return g;
  }
  function herbStem(x, yb, h, col, r) {      // tall meadow umbellifer with umbrella heads
    let g = `<path d="M${f1(x)} ${f1(yb)} Q ${f1(x + (r() - .5) * 10)} ${f1(yb - h / 2)} ${f1(x + (r() - .5) * 6)} ${f1(yb - h)}" stroke="${col}" stroke-width="2.2" fill="none"/>`;
    const tx = x + (r() - .5) * 6, ty = yb - h;
    for (let k = 0; k < 9; k++) { const a = Math.PI * (1.1 + k * .1); g += `<line x1="${f1(tx)}" y1="${f1(ty)}" x2="${f1(tx + Math.cos(a) * 12)}" y2="${f1(ty + Math.sin(a) * 9)}" stroke="${col}" stroke-width="1"/><circle cx="${f1(tx + Math.cos(a) * 12)}" cy="${f1(ty + Math.sin(a) * 9)}" r="2" fill="#fff4d0"/>`; }
    return g;
  }
  function lily(x, y, s) {                    // water lily on a pad
    let g = `<ellipse cx="${f1(x)}" cy="${f1(y + s * .25)}" rx="${f1(s * 1.1)}" ry="${f1(s * .32)}" fill="#2f7a4a"/>`;
    for (let i = -2; i <= 2; i++) g += `<ellipse cx="${f1(x + i * s * .22)}" cy="${f1(y - s * .05)}" rx="${f1(s * .16)}" ry="${f1(s * .42)}" fill="#fffaf0" transform="rotate(${i * 18} ${f1(x + i * s * .22)} ${f1(y + s * .2)})"/>`;
    return g + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s * .14)}" fill="${C.gold}"/>`;
  }
  function snowflake(x, y, s) {               // snowflake: six arms with rhombus ends
    let g = `<g transform="translate(${f1(x)} ${f1(y)})" stroke="#fff" stroke-width="1.3" fill="#fff" opacity=".85">`;
    for (let i = 0; i < 6; i++) g += `<g transform="rotate(${i * 60})"><line x1="0" y1="0" x2="0" y2="${f1(-s)}"/><path d="M0 ${f1(-s)} l ${f1(s * .18)} ${f1(-s * .25)} l ${f1(-s * .18)} ${f1(s * .08)} l ${f1(-s * .18)} ${f1(-s * .08)} Z"/></g>`;
    return g + '</g>';
  }
  /* ---------- scene ---------- */
  function scene(theme, seed, wide) {
    const p = P[theme] || P.meadow, r = rng(seed * 9973 + 7), W = wide ? 800 : 400, H = 800, id = 'g' + theme + seed + (wide ? 'w' : '');
    const fx = x => x * W / 400;   // horizontal scale
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
      `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>` +
      `<radialGradient id="${id}g"><stop offset="0" stop-color="${p.sun}" stop-opacity=".85"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[0]}"/></linearGradient></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;
    if (p.stars) for (let i = 0; i < 90 * W / 400; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H * .5)}" r="${f1(r() * 1.6 + .3)}" fill="#fff" opacity="${f1(.4 + r() * .6)}"/>`;
    const sx = fx(80 + r() * 240), sy = 150 + r() * 110;
    s += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="120" fill="url(#${id}g)"/>`;
    s += p.moon ? `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="30" fill="${p.sun}"/><circle cx="${f1(sx - 8)}" cy="${f1(sy - 6)}" r="6" fill="#00000010"/><circle cx="${f1(sx + 9)}" cy="${f1(sy + 7)}" r="4" fill="#00000010"/>`   // full moon only
                : folkSun(sx, sy, 32, p.sun, theme !== 'winter' && theme !== 'dawn');
    if (!p.stars) for (let i = 0; i < 4 * W / 400; i++) s += cloud(r() * W, 70 + r() * 210, 60 + r() * 60, f1(.55 + r() * .35));
    s += `<path d="${wave(r, 440, 60, W, H, Math.round(4 * W / 400))}" fill="${p.far}"/>`;
    if (p.mist) s += `<rect y="410" width="${W}" height="90" fill="#fff" opacity=".35"/>`;
    // Atăl / Volga: wide river with the high far bank
    const riverY = p.atal ? 520 : 0;
    if (p.atal) {
      s += `<path d="M0 470 C ${fx(80)} 430, ${fx(160)} 455, ${fx(230)} 440 S ${fx(360)} 420, ${W} 450 L${W} 520 L0 520 Z" fill="${p.far}"/>`;
      s += `<rect y="505" width="${W}" height="110" fill="url(#${id}w)" opacity=".95"/>`;
      for (let i = 0; i < 18 * W / 400; i++) s += `<rect x="${f1(r() * W)}" y="${f1(512 + r() * 95)}" width="${f1(20 + r() * 60)}" height="2" fill="#fff" opacity=".55" rx="1"/>`;
      if (p.boat) { const bx = fx(60 + r() * 260); s += `<g><path d="M${f1(bx - 26)} 556 L${f1(bx + 26)} 556 L${f1(bx + 18)} 566 L${f1(bx - 18)} 566 Z" fill="${C.red2}"/><path d="M${f1(bx)} 554 L${f1(bx)} 512 L${f1(bx + 22)} 552 Z" fill="${C.cream}"/><path d="M${f1(bx - 2)} 552 L${f1(bx - 2)} 520 L${f1(bx - 18)} 552 Z" fill="${C.white}" opacity=".9"/></g>`; }
    }
    if (p.lights) for (let i = 0; i < 6; i++) { const hx = fx(40 + i * 36), hh = 14 + r() * 8; s += `<path d="M${f1(hx)} 470 v-${f1(hh)} l${f1(13)} -10 l${f1(13)} 10 v${f1(hh)} Z" fill="#0b1a20"/>`; }   // village roofs at night
    if (p.gulls) for (let i = 0; i < 5; i++) { const gx = r() * W, gy = 300 + r() * 100; s += `<path d="M${f1(gx - 7)} ${f1(gy)} q 4 -5 7 0 q 3 -5 7 0" stroke="#fff" stroke-width="1.6" fill="none"/>`; }
    s += `<path d="${wave(r, p.atal ? 600 : 505, 42, W, H, Math.round(6 * W / 400))}" fill="${p.mid}"/>`;
    // tree line
    if (p.trees && p.trees !== 'none') for (let i = 0; i < 26 * W / 400; i++) {
      const x = i * 16 + r() * 8, y = (p.atal ? 610 : 512) + r() * 22, sz = 28 + r() * 34;
      const kind = p.trees === 'forest' ? (r() < .6 ? 'pine' : 'oak') : p.trees === 'mixed' ? (r() < .5 ? 'pine' : 'birch') : p.trees;
      if (kind === 'pine' || kind === 'pinesnow') s += pine(x, y, sz, p.near, kind === 'pinesnow');
      else if (kind === 'birch') s += birch(x, y, sz * .9, p.near, r);
      else if (kind === 'oak') s += oak(x, y, sz * .9, theme === 'autumn' ? ['#c4602a', '#e0952e', '#a0401e'][i % 3] : p.near, r, theme === 'autumn' ? C.red : null);
    }
    if (p.lake) {
      s += `<path d="M0 600 C ${fx(100)} 580, ${fx(300)} 590, ${W} 600 L${W} 712 L0 712 Z" fill="url(#${id}w)" opacity=".9"/>`;
      for (let i = 0; i < 14 * W / 400; i++) s += `<rect x="${f1(r() * W)}" y="${f1(606 + r() * 100)}" width="${f1(20 + r() * 50)}" height="2" fill="#fff" opacity=".5" rx="1"/>`;
      if (p.lilies) for (let i = 0; i < 5 * W / 400; i++) s += lily(fx(30) + r() * (W - fx(60)), 640 + r() * 60, 9 + r() * 5);
      for (let i = 0; i < 16 * W / 400; i++) { const x = r() * W; s += `<path d="M${f1(x)} 716 q ${f1((r() - .5) * 8)} -30 ${f1((r() - .5) * 10)} -${f1(36 + r() * 20)}" stroke="#2f5a30" stroke-width="2" fill="none"/>`; }
    }
    if (p.river) {
      s += `<path d="M0 640 C ${fx(120)} 600, ${fx(260)} 690, ${W} 620 L${W} 700 C ${fx(260)} 760, ${fx(120)} 660, 0 720 Z" fill="url(#${id}w)" opacity=".92"/>`;
      for (let i = 0; i < 10; i++) s += `<rect x="${f1(r() * W)}" y="${f1(645 + r() * 60)}" width="${f1(18 + r() * 40)}" height="2" fill="#fff" opacity=".55" rx="1"/>`;
    }
    if (p.houses) { const n = Math.round(3 * W / 400); for (let i = 0; i < n; i++) s += house(fx(10) + i * (W - fx(10)) / n + r() * 6, 650 + r() * 10, 64 + r() * 10, r); }
    if (p.herbs) { const n = Math.round((p.herbs >= 1 ? 22 : 9) * W / 400); for (let i = 0; i < n; i++) s += herbStem(r() * W, 690 + r() * 40, 110 + r() * 120, '#6a5a2a', r); }
    if (p.akatuy) {
      const px = fx(200); s += bunting(-10, 430, px, 300, 40, r) + bunting(px, 300, W + 10, 440, 40, r) + festPole(px, 650, 360, r);
      for (let i = 0; i < 3; i++) s += bunting(fx(20 + i * 10), 520 + i * 30, W - fx(20), 525 + i * 32, 18, r);
    }
    s += `<path d="${wave(r, p.atal ? 690 : p.lake || p.river ? 720 : 650, 28, W, H, Math.round(5 * W / 400))}" fill="${p.ground}"/>`;
    if (p.wheat) { for (let i = 0; i < 10 * W / 400; i++) s += `<path d="M${f1(-50 + i * 60)} ${H} L${f1(150 + i * 40)} 560" stroke="${p.near}" stroke-width="10" opacity=".35"/>`;
      for (let i = 0; i < 50 * W / 400; i++) { const x = r() * W, y = 690 + r() * 110; s += `<path d="M${f1(x)} ${f1(y)} l 0 -22" stroke="#e8c050" stroke-width="1.6"/><ellipse cx="${f1(x)}" cy="${f1(y - 25)}" rx="2.2" ry="5" fill="#f4d060"/>`; } }
    if (p.stacks) for (let i = 0; i < 3 * W / 400; i++) { const x = fx(40) + r() * (W - fx(80)), y = 600 + r() * 30, z = 22 + r() * 10; s += `<path d="M${f1(x - z)} ${f1(y)} Q ${f1(x - z)} ${f1(y - z * 1.6)} ${f1(x)} ${f1(y - z * 1.7)} Q ${f1(x + z)} ${f1(y - z * 1.6)} ${f1(x + z)} ${f1(y)} Z" fill="#d8a83e"/><path d="M${f1(x - z * .7)} ${f1(y - z * .6)} L${f1(x + z * .7)} ${f1(y - z * .6)}" stroke="#a87a26" stroke-width="2"/>`; }
    // foreground ornamental flowers (embroidery style)
    if (p.flowers) {
      const n = Math.round(14 * p.flowers * W / 400), cols = [C.red, C.gold, C.cream, '#d8406a', C.red2];
      for (let i = 0; i < n; i++) {
        const x = r() * W, y = 705 + r() * 100, z = 24 + r() * 18, k = r(), col = cols[Math.floor(r() * cols.length)];
        s += k < .4 ? stepFlower(x, y, z, col) : k < .7 ? rosetteFlower(x, y, z, col) : bloom(x, y, z * .8, col);
      }
    }
    if (p.leaves) for (let i = 0; i < 30 * W / 400; i++) { const x = r() * W, y = r() * H, a = r() * 180; s += `<path d="M0 -7 C4 -4 4 4 0 7 C-4 4 -4 -4 0 -7 Z" fill="${r() < .5 ? C.gold : '#d0602a'}" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})" opacity=".85"/>`; }
    if (p.snow) { for (let i = 0; i < 70 * W / 400; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(1 + r() * 2)}" fill="#fff" opacity=".85"/>`; for (let i = 0; i < 6 * W / 400; i++) s += snowflake(r() * W, 60 + r() * 600, 7 + r() * 6); }
    if (p.lights) for (let i = 0; i < 20 * W / 400; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(560 + r() * 220)}" r="${f1(1 + r() * 1.5)}" fill="#ffe680" opacity="${f1(.4 + r() * .5)}"/>`;
    const sc = theme === 'night' || theme === 'sunset' ? [C.gold, C.cream] : [C.cream, C.gold];
    s += `<g opacity=".5">${tree(34, 150, 3.2, sc[0], C.red, sc[1])}${tree(W - 34, 150, 3.2, sc[0], C.red, sc[1])}</g>`;
    return s + '</svg>';
  }
  /* ---------- UI ornament: Chuvash counted-thread embroidery (тӗрӗ) ----------
     Every motif is stitched from small squares on a cell grid, as in Chuvash counted embroidery: step-rhombuses (with forked "horns"),
     octagonal rosettes, zigzag running stitch, rhombus-chain tree of life. Red-black on linen with gold. No cross-shaped or floral motifs. */
  const f2 = v => Math.round(v * 100) / 100;
  function cells(list, s, col, ox, oy) {   // [[i,j]…] -> one path of square stitches of size s centred at (ox, oy)
    if (!list.length) return ''; const h = s * .9; let d = '';
    for (const [i, j] of list) d += `M${f2(ox + i * s - h / 2)} ${f2(oy + j * s - h / 2)}h${f2(h)}v${f2(h)}h${f2(-h)}z`;
    return `<path d="${d}" fill="${col}"/>`;
  }
  function rhC(n) { const o = []; for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) if (Math.abs(i) + Math.abs(j) === n) o.push([i, j]); return o; }      // rhombus outline
  function rhF(n) { const o = []; for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) if (Math.abs(i) + Math.abs(j) <= n) o.push([i, j]); return o; }       // filled rhombus (n=0 dot, n>=2 rhombus)
  function horns(n) { return [[n + 1, -1], [n + 1, 1], [n + 2, -2], [n + 2, 2], [-n - 1, -1], [-n - 1, 1], [-n - 2, -2], [-n - 2, 2]]; }                     // forked ends at the side tips
  function octC(n) {   // octagon outline
    const k = Math.floor(n / 2), inn = (i, j) => Math.abs(i) <= n && Math.abs(j) <= n && Math.abs(i) + Math.abs(j) <= n + k, o = [];
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) if (inn(i, j) && (!inn(i + 1, j) || !inn(i - 1, j) || !inn(i, j + 1) || !inn(i, j - 1))) o.push([i, j]);
    return o;
  }
  // step-rhombus motif: outline col, solid rhombus core col2; horns = forked side tips
  function stepRh(x, y, n, s, col, col2, h) { return cells(rhC(n), s, col, x, y) + (n >= 4 ? cells(rhF(n - 2), s, col2, x, y) : cells([[0, 0]], s, col2, x, y)) + (h ? cells(horns(n), s, col, x, y) : ''); }
  // octagonal rosette: octagon outline col, inner rhombus col2, centre col
  function rosette(x, y, n, s, col, col2) { const k = Math.max(1, n - 2); return cells(octC(n), s, col, x, y) + cells(rhC(k), s, col2, x, y) + (k >= 2 ? cells([[0, 0]], s, col, x, y) : ''); }
  // tree of life: trunk = chain of rhombuses, diagonal (V) branches ending in small rhombuses, rosette crown, stepped base (height ≈ 30 cells)
  function tree(x, y, s, col, col2, col3) {
    let g = cells([[-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [-1, -2], [0, -2], [1, -2]], s, col, x, y);
    for (let k = 0; k < 4; k++) {
      const cy = y - (5 + k * 6) * s; g += stepRh(x, cy, 2, s, col, col2);
      const b = []; for (let t = 1; t <= 3 - (k > 2 ? 1 : 0); t++) b.push([2 + t, -1 - t], [-2 - t, -1 - t]);
      g += cells(b, s, col, x, cy) + cells(rhC(2), s, col3 || col2, x + (6 - (k > 2 ? 1 : 0)) * s, cy - (5 - (k > 2 ? 1 : 0)) * s) + cells(rhC(2), s, col3 || col2, x - (6 - (k > 2 ? 1 : 0)) * s, cy - (5 - (k > 2 ? 1 : 0)) * s);
    }
    return g + rosette(x, y - 31 * s, 3, s, col, col2);
  }
  function ornamentTile(col, col2, size) {   // square tile: horned step-rhombus
    const z = size || 24;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${z}" height="${z}" viewBox="0 0 24 24">` + stepRh(12, 12, 4, 1.9, col, col2, true) + `</svg>`;
  }
  // тӗрӗ band (repeat-x tile 64×20): stitched edge rows, zigzag running stitch, red step-rhombus + black/gold octagonal rosette
  function bandSvg(col, col2, bg) {
    const s = 1.6, zz = [], edge = [];
    for (let i = 0; i < 40; i++) { const x = i * s + s / 2; if (!(x > 8 && x < 25) && !(x > 40 && x < 57)) zz.push([i, [0, -1, -2, -1, 0, 1, 2, 1][i % 8]]); if (i % 2 === 0) edge.push([i, 0]); }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="20" viewBox="0 0 64 20">` + (bg ? `<rect width="64" height="20" fill="${bg}"/>` : '') +
      cells(edge, s, col, s / 2, 1.2) + cells(edge, s, col, s / 2, 18.8) + cells(zz, s, col, s / 2, 10) +
      stepRh(16.8, 10, 3, s, col2, col) + rosette(48.8, 10, 3, s, col, col2) + `</svg>`;
  }
  // panel corner (48×48): double stitched L frame, octagonal rosette, small rhombuses along the edges; pos = tl|tr|bl|br
  function cornerSvg(col, col2, pos) {
    const t = { tl: '', tr: 'translate(48 0) scale(-1 1)', bl: 'translate(0 48) scale(1 -1)', br: 'translate(48 48) scale(-1 -1)' }[pos] || '';
    const L1 = [], L2 = [];
    for (let i = 0; i < 22; i++) { L1.push([i, 0], [0, i]); if (i % 2 === 0 && i > 1) L2.push([i, 2], [2, i]); }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g transform="${t}">` +
      cells(L1, 2, col, 3, 3) + cells(L2, 2, col2, 3, 3) + rosette(18, 18, 4, 1.6, col, col2) +
      stepRh(34, 9, 2, 1.4, col2, col) + stepRh(9, 34, 2, 1.4, col2, col) + `</g></svg>`;
  }
  // tree of life as a standalone image (win screen, map) 60×110
  function treeSvg(col, col2, col3) { return `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="110" viewBox="0 0 60 110">` + tree(30, 104, 2.8, col, col2, col3) + `</svg>`; }
  // letter-wheel frame: black rim with gold rule, linen embroidered band (alternating red step-rhombuses and black octagonal rosettes on a gold zigzag), black inner rule
  function wheelSvg() {
    const N = 16, Rm = 44, s = .82;
    let g = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs><radialGradient id="wc" cx=".5" cy=".38"><stop offset="0" stop-color="#fffaf2"/><stop offset=".7" stop-color="#f6efe2"/><stop offset="1" stop-color="#eadfc8"/></radialGradient></defs>`;
    g += `<circle r="50" fill="${C.black}"/><circle r="49.1" fill="none" stroke="${C.gold}" stroke-width=".9"/><circle r="48.2" fill="${C.cream}"/><circle r="39.8" fill="${C.black}"/><circle r="38.7" fill="url(#wc)"/><circle r="39.25" fill="none" stroke="${C.gold}" stroke-width=".35"/>`;
    for (let k = 0; k < N; k++) g += `<g transform="rotate(${f2((k + .5) / N * 360)}) translate(0 ${-Rm})">` + stepRh(0, 0, 2, s, C.gold2, C.red) + cells([[-4, 0], [4, 0]], s, C.gold2, 0, 0) + `</g>`;
    for (let k = 0; k < N * 4; k++) { const a = (k + .5) / (N * 4) * 360; g += `<rect x="-.4" y="-47.6" width=".8" height=".8" fill="${C.red}" transform="rotate(${f2(a)})"/><rect x="-.4" y="-41.2" width=".8" height=".8" fill="${C.red}" transform="rotate(${f2(a)})"/>`; }
    for (let k = 0; k < N; k++) g += `<g transform="rotate(${f2(k / N * 360)}) translate(0 ${-Rm})">` + (k % 2 ? rosette(0, 0, 4, s, C.black, C.red) : stepRh(0, 0, 4, s, C.red, C.gold2)) + `</g>`;
    return g + `</svg>`;
  }
  // app icon: embroidered medallion (red/black ring) with a stepped rhombus and two rosettes on linen
  function iconSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><radialGradient id="ib" cx=".5" cy=".4"><stop offset="0" stop-color="#d0303a"/><stop offset="1" stop-color="${C.red2}"/></radialGradient></defs>` +
      `<rect width="512" height="512" rx="112" fill="url(#ib)"/><rect x="22" y="22" width="468" height="468" rx="94" fill="none" ${ST(C.gold, 4)}/>` +
      `<g transform="translate(256 256) scale(4.3)">` + wheelSvg().replace(/^<svg[^>]*>/, '').replace('</svg>', '') + `<circle r="40" fill="${C.cream}"/></g>` +
      `<g transform="translate(256 256)"><path d="M0 -120 L45 -75 L90 0 L45 75 L0 120 L-45 75 L-90 0 L-45 -75 Z" fill="${C.red}"/><path d="M0 -70 L70 0 L0 70 L-70 0 Z" fill="${C.black}"/><path d="M0 -36 L36 0 L0 36 L-36 0 Z" fill="${C.gold}"/><path d="M0 -14 L14 0 L0 14 L-14 0 Z" fill="${C.red}"/></g></svg>`;
  }
  function uri(svg) { return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")'; }
  const cache = {};
  window.Art = {
    themes: Object.keys(P), palette: t => P[t] || P.meadow, colors: C,
    scene, bg(theme, seed, wide) { const k = theme + ':' + seed + (wide ? ':w' : ''); return cache[k] || (cache[k] = uri(scene(theme, seed, wide))); },
    ornament(col, col2, size) { return uri(ornamentTile(col || C.gold, col2 || C.red, size)); },
    band(col, col2, bg) { return uri(bandSvg(col || C.gold, col2 || C.red, bg)); },
    corner(pos, col, col2) { return uri(cornerSvg(col || C.gold, col2 || C.red, pos)); },
    wheel() { return uri(wheelSvg()); }, tree(col, col2, col3) { return uri(treeSvg(col || C.gold, col2 || C.red, col3 || C.cream)); }, iconSvg,
  };
})();
