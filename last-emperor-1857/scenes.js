'use strict';
// The painted world of 1857: fort, court, emperor and crown, sepoys, riders, the siege, the tomb, the ship, the plaque.
// Every shape: flat pigment + inner rim + ink + white lead. Every yellow is leaf.

const SAND = '#b5533c', SAND_D = '#7c3122', SAND_L = '#e08a6c';           // red sandstone (the forts, the tomb)
const COAT = '#a34a5c', COAT_D = '#6e2a3a', COAT_L = '#d98c9a';           // the Company's coats (rose madder)
const SKIN = '#b98262', SKIN_D = '#8a5a3e', SKIN_B = '#e2b99a', SKIN_BD = '#bb8e70';
const MARBLE = '#f1ece0', MARBLE_D = '#b9b4c4';

// ---------------------------------------------------------------- small helpers
function goldDisc(g, x, y, r, o = {}) { const p = P2(q => q.arc(x, y, r, 0, TAU)); leaf(g, p, [x - r, y - r, r * 2, r * 2], o); gpush(x, y, r * 2.4, o.k || 1); return p; }
function goldStar(g, x, y, r, o = {}) { const p = P2(q => star8(q, x, y, r, .42, o.rot || 0)); g.save(); g.translate(2, 3); g.fillStyle = 'rgba(6,10,40,.5)'; g.fill(p); g.restore(); leaf(g, p, [x - r, y - r, r * 2, r * 2], { lw: 1.6, rimW: 3, ...o }); gpush(x, y, r * 3, .9); }
function whiteTriads(g, R, x0, y0, x1, y1, n, r = 2.4, a = .7) { for (let i = 0; i < n; i++) triad(g, lerp(x0, x1, R()), lerp(y0, y1, R()), r, a, R() * TAU); }
function flame(g, x, y, s, t, seed = 0) {   // a painted flame: vermilion body, lighter tongue, white-lead core
  const f = Math.sin(t * 17 + seed) * .08 + Math.sin(t * 29 + seed * 2) * .05;
  const outer = P2(q => { q.moveTo(x - 13 * s, y); q.bezierCurveTo(x - 16 * s, y - 20 * s, x - 2 * s + f * 30 * s, y - 34 * s, x + f * 40 * s, y - 52 * s); q.bezierCurveTo(x + 6 * s, y - 32 * s, x + 18 * s, y - 18 * s, x + 13 * s, y); q.quadraticCurveTo(x, y + 8 * s, x - 13 * s, y); q.closePath(); });
  g.fillStyle = VERM; g.fill(outer); rimShade(g, outer, VERM_D, 4 * s); ink(g, outer, 1.8); maskErase(g, outer);
  const inner = P2(q => { q.moveTo(x - 6 * s, y - 2 * s); q.bezierCurveTo(x - 7 * s, y - 14 * s, x + f * 20 * s, y - 24 * s, x + f * 26 * s, y - 32 * s); q.bezierCurveTo(x + 6 * s, y - 18 * s, x + 8 * s, y - 8 * s, x + 6 * s, y - 2 * s); q.closePath(); });
  g.fillStyle = VERM_L; g.fill(inner);
  g.fillStyle = 'rgba(255,250,236,.95)'; g.beginPath(); g.ellipse(x, y - 8 * s, 3.4 * s, 7 * s, f, 0, TAU); g.fill();
  return [x + f * 20 * s, y - 20 * s];
}
function scallopCloud(g, x, y, w, s = 1, col = '#eef0f8', rim = 'rgba(110,140,210,.65)') {   // scalloped cloud / smoke puff
  const n = Math.max(4, Math.round(w / 40)), p = P2(q => { q.moveTo(x - w / 2, y);
    for (let i = 0; i < n; i++) { const a = x - w / 2 + w * i / n, b = x - w / 2 + w * (i + 1) / n, hh = (24 + 22 * Math.sin((i + .5) / n * Math.PI)) * s; q.bezierCurveTo(a, y - hh, b, y - hh, b, y); }
    q.bezierCurveTo(x + w / 2 - 10, y + 22 * s, x - w / 2 + 10, y + 22 * s, x - w / 2, y); q.closePath(); });
  g.fillStyle = col; g.fill(p); rimShade(g, p, rim, 12 * s); ink(g, p, 2.2); maskErase(g, p);
  return p;
}
function tree(g, x, y, r, R) {   // round-crowned tree: verdigris body, rim, ink, white-lead triads
  const trunk = P2(q => { q.moveTo(x - r * .1, y); q.lineTo(x - r * .06, y - r * 1.1); q.lineTo(x + r * .06, y - r * 1.1); q.lineTo(x + r * .1, y); q.closePath(); });
  paint(g, trunk, WOOD, WOOD_D, 4);
  const crown = P2(q => { const n = 9; for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI * 2, rr = r * (1 + .08 * Math.sin(i * 2.3)); const px = x + Math.cos(a) * rr, py = y - r * 1.5 + Math.sin(a) * rr * .85; i ? q.quadraticCurveTo(x + Math.cos(a - .35) * rr * 1.12, y - r * 1.5 + Math.sin(a - .35) * rr * .95, px, py) : q.moveTo(px, py); } q.closePath(); });
  paint(g, crown, VERD, VERD_D, 12);
  for (let i = 0; i < 7; i++) triad(g, x + (R() - .5) * r * 1.3, y - r * 1.5 + (R() - .5) * r * 1.1, 2.4, .8, R() * TAU);
}
function cypress(g, x, y, h) {
  const p = P2(q => { q.moveTo(x, y - h); q.bezierCurveTo(x + h * .16, y - h * .7, x + h * .14, y - h * .2, x + h * .05, y); q.lineTo(x - h * .05, y); q.bezierCurveTo(x - h * .14, y - h * .2, x - h * .16, y - h * .7, x, y - h); q.closePath(); });
  paint(g, p, VERD_D, '#122e18', 8); hiLine(g, [[x - h * .03, y - h * .9], [x - h * .09, y - h * .5], [x - h * .06, y - h * .15]], 2, .55);
}
function waves(g, x0, y0, x1, y1, t = 0, sp = 46) {   // a sea of scallops: azure ground, darker scallop lines, white-lead crests
  const p = P2(q => q.rect(x0, y0, x1 - x0, y1 - y0)); g.fillStyle = AZUR; g.fill(p);
  g.save(); g.clip(p);
  for (let j = 0, y = y0 + 20; y < y1 + sp; y += sp * .62, j++) {
    const off = (j % 2) * sp / 2 + Math.sin(t * 1.3 + j) * 6;
    g.strokeStyle = AZUR_D; g.lineWidth = 2.6 * LWK; g.beginPath();
    for (let x = x0 - sp + off; x < x1 + sp; x += sp) { g.moveTo(x, y); g.arc(x + sp / 2, y, sp / 2, Math.PI, 0); }
    g.stroke();
    g.fillStyle = 'rgba(255,252,240,.8)'; for (let x = x0 - sp + off; x < x1 + sp; x += sp) { g.beginPath(); g.arc(x + sp / 2, y - sp / 2 + 3, 2.2 * Math.sqrt(LWH), 0, TAU); g.fill(); }
  }
  g.restore(); maskErase(g, p);
}

// ---------------------------------------------------------------- architecture
function cuspArch(cx, by, w, spring, lobes = 7, depth = .07) {   // a pointed, cusped (multifoil) arch opening: sides, then lobes along two arcs
  const R = w * .82, sy = by - spring, hw = w / 2, cLx = cx - hw + R, cRx = cx + hw - R, aA = Math.acos((cx - cLx) / R);
  const pts = []; const N = 60;
  for (let i = 0; i <= N; i++) { const a = Math.PI - (Math.PI - aA) * i / N; pts.push([cLx + R * Math.cos(a), sy - R * Math.sin(a)]); }
  for (let i = N - 1; i >= 0; i--) { const a = Math.PI - (Math.PI - aA) * i / N; pts.push([cRx - R * Math.cos(a), sy - R * Math.sin(a)]); }
  const L = arclen(pts), tot = L[L.length - 1], apex = sy - R * Math.sin(aA);
  return { apex, path: P2(q => { q.moveTo(cx - hw, by); q.lineTo(cx - hw, sy);
    for (let k = 0; k < lobes; k++) { const a = alongPath(pts, L, tot * k / lobes), b = alongPath(pts, L, tot * (k + 1) / lobes), m = alongPath(pts, L, tot * (k + .5) / lobes);
      const ix = m.x + (cx - m.x) * depth * 1.6, iy = m.y + (sy - m.y) * depth * 1.6; q.bezierCurveTo(lerp(a.x, ix, .9), lerp(a.y, iy, .9), lerp(b.x, ix, .9), lerp(b.y, iy, .9), b.x, b.y); }
    q.lineTo(cx + hw, by); q.closePath(); }) };
}
function onionDome(cx, by, w, h) { return P2(q => { q.moveTo(cx - w / 2, by); q.bezierCurveTo(cx - w * .62, by - h * .45, cx - w * .3, by - h * .8, cx, by - h); q.bezierCurveTo(cx + w * .3, by - h * .8, cx + w * .62, by - h * .45, cx + w / 2, by); q.closePath(); }); }
function finial(g, x, y, s) { const p = P2(q => { q.moveTo(x - 4 * s, y); q.lineTo(x - 2 * s, y - 22 * s); q.arc(x, y - 26 * s, 5 * s, Math.PI * .6, Math.PI * 2.4); q.lineTo(x + 1.5 * s, y - 40 * s); q.lineTo(x + 4 * s, y); q.closePath(); }); leaf(g, p, [x - 6 * s, y - 42 * s, 12 * s, 42 * s], { lw: 1.6, rimW: 2 }); gpush(x, y - 26 * s, 40 * s, .9); }
function chhatri(g, cx, by, w) {   // a domed kiosk: posts, a white dome, a gold finial
  const h = w * .7, base = P2(q => q.rect(cx - w / 2, by - 8, w, 8));
  paint(g, base, SAND, SAND_D, 4);
  for (const k of [-.38, 0, .38]) { const post = P2(q => q.rect(cx + k * w - 4, by - h * .55, 8, h * .55 - 8)); paint(g, post, SAND_L, SAND, 3, 1.8); }
  const eave = P2(q => { q.moveTo(cx - w * .62, by - h * .55); q.lineTo(cx + w * .62, by - h * .55); q.lineTo(cx + w * .5, by - h * .66); q.lineTo(cx - w * .5, by - h * .66); q.closePath(); }); paint(g, eave, SAND, SAND_D, 4, 1.8);
  const d = onionDome(cx, by - h * .66, w * .9, h * .6); paint(g, d, MARBLE, MARBLE_D, 7, 1.8);
  hiLine(g, [[cx - w * .25, by - h * .75], [cx - w * .18, by - h * 1.05]], 2, .8);
  finial(g, cx, by - h * 1.24, w / 60);
}
function merlons(g, x0, x1, y, mw, col, rim) {   // rounded Mughal battlements along a wall top
  for (let x = x0; x < x1 - mw * .5; x += mw * 1.25) { const p = P2(q => { q.moveTo(x, y); q.lineTo(x, y - mw * .6); q.quadraticCurveTo(x + mw / 2, y - mw * 1.25, x + mw, y - mw * .6); q.lineTo(x + mw, y); q.closePath(); }); paint(g, p, col, rim, 4, 1.8); }
}
// the fort: a long red wall, a gate block with a tall arch, two octagonal towers with kiosks, a row of small kiosks
// layers: {c: colour, k: ink, w: white lead} each 0..1 (painted in layers in the opening)
function fort(g, cx, by, sc = 1, o = {}) {
  g.save(); g.translate(cx, by); g.scale(sc, sc);
  const wallTop = -230, gw = 300, gtop = -400, tw = 110;
  const wall = P2(q => q.rect(-760, wallTop, 1520, -wallTop));
  paint(g, wall, SAND, SAND_D, 14);
  g.strokeStyle = 'rgba(255,240,226,.55)'; g.lineWidth = 2 * LWH; for (let y = wallTop + 40; y < 0; y += 46) { g.beginPath(); g.moveTo(-750, y); g.lineTo(750, y); g.stroke(); }
  for (let x = -720; x < 720; x += 120) { if (Math.abs(x) < gw / 2 + tw + 20) continue; const a = cuspArch(x + 40, -40, 46, 50, 5); paint(g, a.path, ULTRA_D, null, 0, 1.8); }
  merlons(g, -760, 760, wallTop, 34, SAND, SAND_D);
  for (const sd of [-1, 1]) {   // octagonal towers
    const tx = sd * (gw / 2 + tw / 2), tp = P2(q => q.rect(tx - tw / 2, gtop + 40, tw, -gtop - 40));
    paint(g, tp, SAND, SAND_D, 12);
    g.strokeStyle = SAND_D; g.lineWidth = 2.2; for (const k of [-.25, .25]) { g.beginPath(); g.moveTo(tx + k * tw, gtop + 44); g.lineTo(tx + k * tw, -4); g.stroke(); }
    hiLine(g, [[tx - tw * .4, gtop + 60], [tx - tw * .4, -20]], 2, .6);
    for (let y = gtop + 90; y < -40; y += 70) { const a = cuspArch(tx, y + 30, 30, 26, 5); paint(g, a.path, ULTRA_D, null, 0, 1.6); }
    chhatri(g, tx, gtop + 40, tw * 1.05);
  }
  const gate = P2(q => q.rect(-gw / 2, gtop + 70, gw, -gtop - 70)); paint(g, gate, SAND, SAND_D, 14);
  const frame = P2(q => q.rect(-gw * .36, gtop + 110, gw * .72, -gtop - 110)); g.strokeStyle = 'rgba(255,248,236,.85)'; g.lineWidth = 3 * LWH; g.stroke(frame);
  const ga = cuspArch(0, 0, gw * .5, 150, 9, .06); paint(g, ga.path, ULTRA_D, null, 0, 2.4);
  g.strokeStyle = 'rgba(255,248,236,.8)'; g.lineWidth = 2.2 * LWH; g.save(); g.translate(0, 0); g.scale(1.1, 1.06); g.stroke(cuspArch(0, 0, gw * .5, 150, 9, .06).path); g.restore();
  for (let i = 0; i < 5; i++) chhatri(g, -gw * .36 + gw * .72 * (i + .5) / 5, gtop + 70, 44);
  pearlLine(g, [[-gw / 2 + 10, gtop + 92], [gw / 2 - 10, gtop + 92]], 14, 2.2, .85);
  if (o.balcony) {   // a jharokha: a balcony with a curved roof where the emperor shows himself
    const bx = o.balcony, by2 = wallTop + 90;
    const shelf = P2(q => { q.moveTo(bx - 70, by2); q.lineTo(bx + 70, by2); q.lineTo(bx + 50, by2 + 30); q.lineTo(bx - 50, by2 + 30); q.closePath(); }); paint(g, shelf, MARBLE, MARBLE_D, 6);
    for (const k of [-60, 60]) { const post = P2(q => q.rect(bx + k - 5, by2 - 110, 10, 110)); paint(g, post, MARBLE, MARBLE_D, 3, 1.8); }
    const back = P2(q => q.rect(bx - 55, by2 - 108, 110, 108)); paint(g, back, ULTRA_D, null, 0, 1.6);
    if (o.inBalcony) o.inBalcony(g, bx, by2);
    const roof = P2(q => { q.moveTo(bx - 84, by2 - 104); q.bezierCurveTo(bx - 50, by2 - 150, bx + 50, by2 - 150, bx + 84, by2 - 104); q.quadraticCurveTo(bx, by2 - 124, bx - 84, by2 - 104); q.closePath(); });
    leaf(g, roof, [bx - 84, by2 - 150, 168, 46], { lw: 2, rimW: 4 }); gpush(bx, by2 - 130, 120, 1);
  }
  g.restore();
}

// ---------------------------------------------------------------- the crown (bottom centre at 0,0, ~60 wide; s scales)
function crown(g, x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot || 0);
  const d = o.dim;
  const cap = P2(q => { q.moveTo(-30, 0); q.bezierCurveTo(-36, -30, -16, -54, 0, -54); q.bezierCurveTo(16, -54, 36, -30, 30, 0); q.closePath(); });
  leaf(g, cap, [-36, -56, 72, 58], { dim: d, lw: 2, rimW: 4 });
  g.save(); g.clip(cap); g.strokeStyle = 'rgba(100,54,6,.55)'; g.lineWidth = 1.6; for (const k of [-.55, 0, .55]) { g.beginPath(); g.moveTo(k * 30, 0); g.quadraticCurveTo(k * 20, -40, 0, -54); g.stroke(); } g.restore();
  for (const k of [-.55, 0, .55]) pearlLine(g, catmull([[k * 28, -8], [k * 18, -34], [0, -50]], 4), 7, 1.5, .9);
  const band = P2(q => { q.moveTo(-33, -12); q.lineTo(33, -12); q.lineTo(31, 4); q.lineTo(-31, 4); q.closePath(); });
  leaf(g, band, [-34, -13, 68, 18], { dim: d, lw: 2, rimW: 3 });
  for (let i = 0; i < 5; i++) { const gx = -24 + i * 12, gem = P2(q => q.ellipse(gx, -4, 4.2, 5, 0, 0, TAU)); paint(g, gem, i % 2 ? VERDI : VERM, i % 2 ? VERDI_D : VERM_D, 2, 1.4); g.fillStyle = 'rgba(255,252,240,.9)'; g.beginPath(); g.arc(gx - 1.4, -6, 1.2, 0, TAU); g.fill(); }
  // the jigha: a jewelled plume at the front with a white heron feather
  const stem = P2(q => { q.moveTo(14, -44); q.quadraticCurveTo(22, -60, 20, -78); q.lineTo(24, -78); q.quadraticCurveTo(26, -58, 18, -42); q.closePath(); }); leaf(g, stem, [12, -80, 16, 40], { dim: d, lw: 1.5, rimW: 2 });
  const drop = P2(q => { q.moveTo(22, -94); q.bezierCurveTo(30, -86, 30, -76, 22, -74); q.bezierCurveTo(14, -76, 14, -86, 22, -94); q.closePath(); }); paint(g, drop, VERM, VERM_D, 3, 1.5);
  const fea = P2(q => { q.moveTo(22, -92); q.bezierCurveTo(10, -120, -14, -126, -30, -112); q.bezierCurveTo(-12, -114, 4, -108, 20, -86); q.closePath(); }); paint(g, fea, WHITE, MARBLE_D, 4, 1.4);
  g.strokeStyle = 'rgba(150,150,170,.8)'; g.lineWidth = 1; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(16 - k * 6, -96 - k * 3.5); g.lineTo(10 - k * 6, -104 - k * 3.2); g.stroke(); }
  g.restore();
  gpush(x, y - 30 * s, 90 * s, 1.2);
}
// a gold halo with punched rays behind a head
function halo(g, x, y, R, o = {}) {
  const ring = P2(q => q.arc(x, y, R + 9, 0, TAU)), disc = P2(q => q.arc(x, y, R, 0, TAU));
  paint(g, ring, VERM, VERM_D, 4);
  leaf(g, disc, [x - R, y - R, R * 2, R * 2], { lw: 2, rimW: 5, dim: o.dim });
  g.save(); g.clip(disc); g.strokeStyle = 'rgba(100,54,6,.5)'; g.lineWidth = 2;
  for (let a = 0; a < 28; a++) { const an = a / 28 * TAU; g.beginPath(); g.moveTo(x + Math.cos(an) * R * .3, y + Math.sin(an) * R * .3); g.lineTo(x + Math.cos(an) * R * .93, y + Math.sin(an) * R * .93); g.stroke(); }
  g.restore(); pearls(g, x, y, R + 4.5, 32, 2.2, .9);
  gpush(x, y - R * .4, R * 1.4, 1.1);
}

// ---------------------------------------------------------------- the emperor in profile, facing right
// pose: 'sit' (writing), 'stand' (crown held out in both hands). o.crown: draw crown on head; o.dim crown/halo dim; o.halo
function emperor(g, x, y, s, o = {}) {
  const pose = o.pose || 'sit', t = o.t || 0;
  g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s);
  const stand = pose === 'stand', hy = stand ? -262 : -218, hx = stand ? 6 : 10;
  if (o.halo !== undefined) halo(g, hx - 2, hy - 4, 74, { dim: o.halo });
  let body;
  if (stand) body = P2(q => { q.moveTo(-26, -232); q.bezierCurveTo(-46, -180, -52, -80, -66, 0); q.lineTo(62, 0); q.bezierCurveTo(46, -80, 42, -170, 30, -232); q.quadraticCurveTo(2, -240, -26, -232); q.closePath(); });
  else body = P2(q => { q.moveTo(-100, 0); q.bezierCurveTo(-104, -40, -60, -60, -50, -110); q.bezierCurveTo(-46, -150, -40, -180, -24, -188); q.quadraticCurveTo(4, -194, 30, -188); q.bezierCurveTo(44, -160, 42, -120, 46, -96); q.bezierCurveTo(80, -84, 116, -60, 118, -18); q.quadraticCurveTo(120, 0, 100, 0); q.closePath(); });
  paint(g, body, MARBLE, MARBLE_D, 12);
  hiLine(g, stand ? [[-30, -220], [-44, -120], [-58, -10]] : [[-30, -180], [-48, -110], [-88, -20]], 2.2, .8);
  g.strokeStyle = MARBLE_D; g.lineWidth = 2; g.beginPath(); if (stand) { g.moveTo(10, -150); g.quadraticCurveTo(18, -80, 20, -4); g.moveTo(-14, -150); g.quadraticCurveTo(-24, -80, -36, -4); } else { g.moveTo(-60, -40); g.quadraticCurveTo(10, -70, 100, -30); } g.stroke();
  // sash (patka), vermilion with a gold-cord edge
  const sash = stand ? P2(q => { q.moveTo(-34, -150); q.lineTo(38, -152); q.lineTo(38, -136); q.lineTo(-36, -134); q.closePath(); q.moveTo(14, -138); q.lineTo(26, -138); q.lineTo(30, -60); q.lineTo(16, -60); q.closePath(); })
    : P2(q => { q.moveTo(-44, -112); q.lineTo(42, -108); q.lineTo(44, -92); q.lineTo(-46, -96); q.closePath(); });
  paint(g, sash, VERM, VERM_D, 4, 2);
  pearlLine(g, stand ? [[-30, -143], [34, -144]] : [[-40, -104], [40, -100]], 9, 1.8, .85);
  // neck, head in profile, white beard, crown or turban
  const neck = P2(q => q.rect(hx - 10, hy + 18, 18, 22)); paint(g, neck, SKIN, null, 0, 1.6);
  const head = P2(q => { q.moveTo(hx - 22, hy - 18); q.bezierCurveTo(hx - 26, hy + 6, hx - 14, hy + 26, hx + 6, hy + 28); q.lineTo(hx + 20, hy + 20); q.lineTo(hx + 24, hy + 6); q.lineTo(hx + 31, hy + 2); q.lineTo(hx + 24, hy - 6); q.bezierCurveTo(hx + 24, hy - 22, hx + 10, hy - 30, hx - 4, hy - 30); q.quadraticCurveTo(hx - 18, hy - 28, hx - 22, hy - 18); q.closePath(); });
  paint(g, head, SKIN, SKIN_D, 5);
  const beard = P2(q => { q.moveTo(hx - 12, hy + 4); q.bezierCurveTo(hx - 10, hy + 30, hx, hy + 52, hx + 10, hy + 74); q.bezierCurveTo(hx + 16, hy + 52, hx + 24, hy + 34, hx + 22, hy + 12); q.quadraticCurveTo(hx + 10, hy + 18, hx - 12, hy + 4); q.closePath(); });
  paint(g, beard, WHITE, MARBLE_D, 5, 1.8);
  g.strokeStyle = 'rgba(160,160,180,.8)'; g.lineWidth = 1.3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(hx - 4 + k * 5, hy + 16); g.quadraticCurveTo(hx + 2 + k * 4, hy + 40, hx + 8 + k * 2, hy + 60 - k * 6); g.stroke(); }
  g.strokeStyle = '#3a2416'; g.lineWidth = 2; g.beginPath(); g.moveTo(hx + 8, hy - 8); g.quadraticCurveTo(hx + 14, hy - 11, hx + 20, hy - 8); g.stroke();
  g.fillStyle = '#2a1a10'; g.beginPath(); g.ellipse(hx + 14, hy - 3, 2, 2.6, 0, 0, TAU); g.fill();
  hiLine(g, [[hx + 7, hy - 13], [hx + 18, hy - 14]], 2.2, .9);
  if (o.crown !== false) crown(g, hx, hy - 22, .82, { dim: o.dim });
  else { const tur = P2(q => { q.moveTo(hx - 26, hy - 14); q.bezierCurveTo(hx - 30, hy - 46, hx + 20, hy - 50, hx + 26, hy - 14); q.quadraticCurveTo(hx, hy - 20, hx - 26, hy - 14); q.closePath(); }); paint(g, tur, MARBLE, MARBLE_D, 6, 2); }
  // arms
  if (stand) {
    const hold = o.hold ?? 1, hx2 = lerp(20, 70, hold), hy2 = lerp(-110, -168, hold);
    const arm = tubePath([[0, -218], [lerp(26, 34, hold), lerp(-160, -186, hold)], [hx2, hy2]], [20, 16, 13]);
    paint(g, arm, MARBLE, MARBLE_D, 5, 2);
    const hand = P2(q => q.arc(hx2 + 4, hy2, 8, 0, TAU)); paint(g, hand, SKIN, null, 0, 1.6);
    if (o.handCrown) crown(g, hx2 + 6, hy2 - 4, .66, { dim: o.dim });
  } else {
    const wr = Math.sin(t * 6) * 3;
    const arm = tubePath([[4, -176], [40, -118], [88 + wr, -98]], [22, 17, 13]); paint(g, arm, MARBLE, MARBLE_D, 5, 2);
    const page = P2(q => { q.moveTo(70, -88); q.lineTo(132, -100); q.lineTo(140, -78); q.lineTo(78, -66); q.closePath(); }); paint(g, page, VELL, '#c9b386', 4, 1.6);
    g.strokeStyle = 'rgba(74,44,22,.7)'; g.lineWidth = 1.2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(82, -84 + k * 6); g.lineTo(124 - k * 6, -95 + k * 6); g.stroke(); }
    const pen = polyPath([[90 + wr, -98], [116 + wr, -132]]); g.strokeStyle = INK; g.lineWidth = 3 + 2 * LWK; g.stroke(pen); g.strokeStyle = '#8a5a30'; g.lineWidth = 3; g.stroke(pen);
    const hand = P2(q => q.arc(92 + wr, -98, 9, 0, TAU)); paint(g, hand, SKIN, null, 0, 1.6);
  }
  g.restore();
}

// ---------------------------------------------------------------- soldiers of the Company's army, facing right (feet at 0,0; ~280 tall)
// o.brit: a British soldier (pale skin, black shako); o.raise 0..1 musket overhead; o.cartridge: hold a cartridge up; o.torch; o.sword
function soldier(g, x, y, s, o = {}) {
  const t = o.t || 0, rz = o.raise || 0;
  g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s);
  const skin = o.brit ? SKIN_B : SKIN, skinD = o.brit ? SKIN_BD : SKIN_D;
  for (const [lx, fx] of [[-10, -16], [10, 16]]) { const leg = tubePath([[lx, -118], [lx + (fx - lx) * .5, -60], [fx, -8]], [24, 20, 17]); paint(g, leg, o.brit ? '#e9e3d8' : WHITE, MARBLE_D, 5, 2); const sh = P2(q => q.ellipse(fx + 6, -4, 15, 7, 0, 0, TAU)); paint(g, sh, INK, null, 0, 1.4); }
  // musket held at the back shoulder (or raised)
  if (!o.torch && !o.sword && !o.reach) {
    const a0 = [-14, -60], a1 = [10, -300], b0 = [20, -210], b1 = [52, -470], p0 = [lerp(a0[0], b0[0], rz), lerp(a0[1], b0[1], rz)], p1 = [lerp(a1[0], b1[0], rz), lerp(a1[1], b1[1], rz)];
    const mus = polyPath([p0, p1]); g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 9 + 3 * LWK; g.stroke(mus); g.strokeStyle = WOOD; g.lineWidth = 9; g.stroke(mus);
    const bar = polyPath([[lerp(p0[0], p1[0], .45), lerp(p0[1], p1[1], .45)], [p1[0] + (p1[0] - p0[0]) * .08, p1[1] + (p1[1] - p0[1]) * .08]]); g.strokeStyle = ASH_D; g.lineWidth = 4; g.stroke(bar);
  }
  const coat = P2(q => { q.moveTo(-26, -216); q.quadraticCurveTo(0, -224, 26, -214); q.bezierCurveTo(30, -180, 30, -140, 32, -104); q.lineTo(-30, -104); q.bezierCurveTo(-30, -150, -32, -190, -26, -216); q.closePath(); });
  paint(g, coat, COAT, COAT_D, 9);
  const belts = P2(q => { q.moveTo(-24, -206); q.lineTo(26, -118); q.lineTo(18, -112); q.lineTo(-28, -196); q.closePath(); q.moveTo(22, -206); q.lineTo(-24, -118); q.lineTo(-16, -112); q.lineTo(26, -196); q.closePath(); });
  paint(g, belts, WHITE, MARBLE_D, 2, 1.4);
  for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(255,252,240,.9)'; g.beginPath(); g.arc(24, -196 + k * 22, 2.2, 0, TAU); g.fill(); }
  const cuff = P2(q => q.rect(-30, -112, 62, 8)); paint(g, cuff, o.brit ? INK : ULTRA, null, 0, 1.4);
  const neck = P2(q => q.rect(-6, -232, 14, 18)); paint(g, neck, skin, null, 0, 1.4);
  const hx = 4, hy = -252;
  const head = P2(q => { q.moveTo(hx - 18, hy - 8); q.bezierCurveTo(hx - 20, hy + 12, hx - 8, hy + 24, hx + 8, hy + 22); q.lineTo(hx + 18, hy + 10); q.lineTo(hx + 20, hy + 2); q.lineTo(hx + 26, hy - 2); q.lineTo(hx + 19, hy - 8); q.bezierCurveTo(hx + 18, hy - 22, hx - 12, hy - 26, hx - 18, hy - 8); q.closePath(); });
  paint(g, head, skin, skinD, 4);
  g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(hx + 11, hy - 4, 2, 0, TAU); g.fill();
  g.strokeStyle = '#2a1a10'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx + 12, hy + 8); g.quadraticCurveTo(hx + 18, hy + 6, hx + 20, hy + 10); g.stroke();
  if (o.brit) { const sk = P2(q => { q.moveTo(hx - 18, hy - 10); q.lineTo(hx - 16, hy - 52); q.lineTo(hx + 18, hy - 54); q.lineTo(hx + 20, hy - 10); q.closePath(); }); paint(g, sk, GALL, INK, 4, 2); const pk = P2(q => { q.moveTo(hx + 10, hy - 12); q.lineTo(hx + 32, hy - 6); q.lineTo(hx + 14, hy - 4); q.closePath(); }); paint(g, pk, INK, null, 0, 1.4); hiLine(g, [[hx - 10, hy - 48], [hx - 12, hy - 16]], 2, .5); }
  else { const tur = P2(q => { q.moveTo(hx - 22, hy - 6); q.bezierCurveTo(hx - 26, hy - 40, hx + 22, hy - 44, hx + 22, hy - 8); q.quadraticCurveTo(hx, hy - 14, hx - 22, hy - 6); q.closePath(); }); paint(g, tur, ULTRA, ULTRA_D, 6, 2); g.strokeStyle = 'rgba(255,252,240,.75)'; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(hx - 18 + k * 4, hy - 12 - k * 8); g.quadraticCurveTo(hx, hy - 20 - k * 8, hx + 18 - k * 2, hy - 12 - k * 8); g.stroke(); } }
  // front arm
  let hand;
  if (o.cartridge) { hand = [40, -270]; const arm = tubePath([[6, -206], [34, -224], hand], [18, 15, 12]); paint(g, arm, COAT, COAT_D, 5, 2); }
  else if (o.torch || o.sword || o.reach) { const lift = o.lift ?? 1; hand = [lerp(30, 54, lift), lerp(-150, -248, lift)]; const arm = tubePath([[6, -206], [lerp(30, 46, lift), lerp(-176, -214, lift)], hand], [18, 15, 12]); paint(g, arm, COAT, COAT_D, 5, 2); }
  else { hand = [lerp(18, 28, rz), lerp(-150, -300, rz)]; const arm = tubePath([[6, -206], [lerp(20, 30, rz), lerp(-170, -250, rz)], hand], [18, 15, 12]); paint(g, arm, COAT, COAT_D, 5, 2); }
  const hd = P2(q => q.arc(hand[0], hand[1], 7.5, 0, TAU)); paint(g, hd, skin, null, 0, 1.4);
  let tip = null;
  if (o.cartridge) {   // a paper cartridge, its twisted end, a smear of grease
    const c = P2(q => { q.moveTo(hand[0] - 6, hand[1] + 2); q.lineTo(hand[0] + 2, hand[1] - 56); q.lineTo(hand[0] + 16, hand[1] - 54); q.lineTo(hand[0] + 10, hand[1] + 4); q.closePath(); });
    paint(g, c, VELL, '#c9b386', 4, 1.6);
    const tw = P2(q => { q.moveTo(hand[0] + 2, hand[1] - 56); q.lineTo(hand[0] + 6, hand[1] - 68); q.lineTo(hand[0] + 12, hand[1] - 67); q.lineTo(hand[0] + 16, hand[1] - 54); q.closePath(); }); paint(g, tw, VELL, '#c9b386', 2, 1.4);
    g.fillStyle = 'rgba(160,110,50,.45)'; g.beginPath(); g.ellipse(hand[0] + 8, hand[1] - 34, 4, 10, .1, 0, TAU); g.fill();
    tip = [hand[0] + 9, hand[1] - 40];
  }
  if (o.torch) { const st = polyPath([[hand[0] - 14, hand[1] + 30], [hand[0] + 16, hand[1] - 40]]); g.strokeStyle = INK; g.lineWidth = 8 + 3 * LWK; g.stroke(st); g.strokeStyle = WOOD; g.lineWidth = 8; g.stroke(st); tip = flame(g, hand[0] + 17, hand[1] - 40, 1.2, t, x * .01); }
  if (o.sword) { const sw = polyPath([[hand[0], hand[1]], [hand[0] + 70, hand[1] - 70]]); g.strokeStyle = INK; g.lineWidth = 6 + 2 * LWK; g.stroke(sw); g.strokeStyle = ASH; g.lineWidth = 5; g.stroke(sw); }
  g.restore();
  if (tip) { const M = new DOMMatrix().translate(x, y).scale(s * (o.dir || 1), s), q = new DOMPoint(tip[0], tip[1]).matrixTransform(M); return [q.x, q.y]; }
  return null;
}

// ---------------------------------------------------------------- a rider at the gallop, facing right (hooves at 0,0)
function rider(g, x, y, s, t, col = LILAC, colD = LILAC_D) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const ph = t * 9, b = Math.sin(ph * 2) * 6;
  const leg = (hx, hy, a, k) => { const knee = [hx + Math.sin(a) * 36, hy + 44], hoof = [knee[0] + Math.sin(a + k) * 34, Math.min(0, knee[1] + 44)]; const p = tubePath([[hx, hy], knee, hoof], [18, 11, 9]); paint(g, p, col, colD, 4, 2); };
  leg(-60, -100 + b, Math.sin(ph) * .9, .5); leg(50, -100 + b, Math.sin(ph + 2.2) * .9, -.4);
  const body = P2(q => { q.moveTo(-88, -128 + b); q.bezierCurveTo(-90, -160 + b, -40, -168 + b, 20, -164 + b); q.bezierCurveTo(50, -164 + b, 62, -180 + b, 76, -214 + b); q.lineTo(96, -206 + b); q.lineTo(120, -170 + b); q.lineTo(108, -160 + b); q.lineTo(84, -178 + b); q.bezierCurveTo(78, -140 + b, 60, -100 + b, 20, -96 + b); q.bezierCurveTo(-30, -92 + b, -84, -96 + b, -88, -128 + b); q.closePath(); });
  paint(g, body, col, colD, 10);
  const tail = P2(q => { q.moveTo(-86, -134 + b); q.bezierCurveTo(-110, -130 + b, -126, -110 + b, -136, -90 + b); q.bezierCurveTo(-118, -104 + b, -104, -112 + b, -86, -120 + b); q.closePath(); }); paint(g, tail, INK, null, 0, 1.6);
  const mane = P2(q => { q.moveTo(70, -210 + b); q.bezierCurveTo(56, -196 + b, 44, -178 + b, 30, -166 + b); q.lineTo(50, -168 + b); q.bezierCurveTo(60, -180 + b, 70, -194 + b, 80, -206 + b); q.closePath(); }); paint(g, mane, INK, null, 0, 1.4);
  leg(-70, -110 + b, Math.sin(ph + 1.1) * .9, .5); leg(40, -110 + b, Math.sin(ph + 3.3) * .9, -.4);
  g.fillStyle = INK; g.beginPath(); g.arc(98, -196 + b, 3, 0, TAU); g.fill();
  const saddle = P2(q => q.rect(-30, -172 + b, 50, 14)); paint(g, saddle, VERM, VERM_D, 3, 1.6);
  hiLine(g, [[-70, -150 + b], [-20, -158 + b], [20, -156 + b]], 2, .6);
  g.restore();
  soldier(g, x - 4 * s, y - 88 * s + b * s, s * .72, { t, sword: true, lift: .8 + .2 * Math.sin(ph) });
  g.save(); g.translate(x, y); g.scale(s, s);
  const cloth = P2(q => { q.moveTo(-44, -176 + b); q.lineTo(30, -176 + b); q.lineTo(24, -118 + b); q.lineTo(-38, -118 + b); q.closePath(); }); paint(g, cloth, VERM, VERM_D, 5, 2);
  pearlLine(g, [[-36, -124 + b], [22, -124 + b]], 9, 1.8, .85);
  const thigh = tubePath([[10, -150 + b], [30, -112 + b], [24, -76 + b]], [16, 14, 12]); paint(g, thigh, WHITE, MARBLE_D, 4, 2);
  g.restore();
}

// ---------------------------------------------------------------- the Company's guns and flag
function cannon(g, x, y, s, rec = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const car = P2(q => { q.moveTo(-80, 0); q.lineTo(-60, -40); q.lineTo(40, -50); q.lineTo(50, -20); q.closePath(); }); paint(g, car, WOOD, WOOD_D, 6);
  const bar = tubePath([[-50 - rec * 20, -56], [110 - rec * 20, -78]], [30, 20], true, false); paint(g, bar, GALL, INK, 6, 2.2); hiLine(g, [[-40 - rec * 20, -66], [100 - rec * 20, -86]], 2, .55);
  const wh = P2(q => q.arc(-10, -20, 30, 0, TAU)); paint(g, wh, WOOD, WOOD_D, 6);
  g.strokeStyle = WOOD_D; g.lineWidth = 3; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; g.beginPath(); g.moveTo(-10, -20); g.lineTo(-10 + Math.cos(a) * 28, -20 + Math.sin(a) * 28); g.stroke(); }
  g.restore();
  return [x + 116 * s, y - 80 * s];
}
// a striped Company flag on a pole (or the British flag, kind 'union'); tear 0..1 tears the fly away
function flag(g, px, py, h, kind, t, o = {}) {
  const pole = P2(q => q.rect(px - 4, py - h, 8, h)); paint(g, pole, WOOD, WOOD_D, 3, 1.8);
  finial(g, px, py - h, 1);
  const fw = h * .6, fh = h * .38, top = py - h + 10 - (o.lower || 0);
  const wave = (u, v) => [px + 4 + u * fw, top + v * fh + Math.sin(u * 5 - t * 4) * 8 * u];
  const quad = (u0, v0, u1, v1) => P2(q => { const N = 8; for (let i = 0; i <= N; i++) { const p = wave(lerp(u0, u1, i / N), v0); i ? q.lineTo(p[0], p[1]) : q.moveTo(p[0], p[1]); } for (let i = N; i >= 0; i--) { const p = wave(lerp(u0, u1, i / N), v1); q.lineTo(p[0], p[1]); } q.closePath(); });
  const whole = quad(0, 0, 1, 1);
  g.save(); g.clip(whole);
  if (kind === 'union') {
    g.fillStyle = ULTRA; g.fill(whole);
    const c = wave(.5, .5), lw = fh * .2;
    const lines = (col, w, diag) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); if (diag) { const a = wave(0, 0), b = wave(1, 1), c2 = wave(0, 1), d = wave(1, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(c2[0], c2[1]); g.lineTo(d[0], d[1]); } else { const a = wave(0, .5), b = wave(1, .5), c2 = wave(.5, 0), d = wave(.5, 1); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(c2[0], c2[1]); g.lineTo(d[0], d[1]); } g.stroke(); };
    lines(WHITE, lw * 1.1, true); lines(VERM, lw * .4, true); lines(WHITE, lw * 1.6, false); lines(VERM, lw, false); void c;
  } else {
    g.fillStyle = WHITE; g.fill(whole); const a = wave(0, .5), b = wave(1, .5), c2 = wave(.42, 0), d = wave(.42, 1);
    g.strokeStyle = VERM; g.lineWidth = fh * .2; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(c2[0], c2[1]); g.lineTo(d[0], d[1]); g.stroke();
  }
  g.restore(); ink(g, whole, 2); maskErase(g, whole);
}

// ---------------------------------------------------------------- the tomb of the emperor's ancestor
function tomb(g, cx, by, s = 1) {
  g.save(); g.translate(cx, by); g.scale(s, s);
  const plinth = P2(q => q.rect(-600, -150, 1200, 150)); paint(g, plinth, SAND, SAND_D, 14);
  for (let i = 0; i < 13; i++) { const x = -560 + i * 93.3; const a = cuspArch(x + 46, -14, 54, 72, 5); paint(g, a.path, ULTRA_D, null, 0, 1.8); g.strokeStyle = 'rgba(255,248,236,.8)'; g.lineWidth = 2 * LWH; g.strokeRect(x + 12, -132, 68, 122); }
  const steps = P2(q => { q.moveTo(-90, 0); q.lineTo(-70, -150); q.lineTo(70, -150); q.lineTo(90, 0); q.closePath(); }); paint(g, steps, SAND_L, SAND, 6);
  g.strokeStyle = SAND_D; g.lineWidth = 2; for (let y = -140; y < 0; y += 18) { g.beginPath(); g.moveTo(-88 + (y + 150) * -.13, y); g.lineTo(88 - (y + 150) * -.13, y); g.stroke(); }
  for (const sd of [-1, 1]) chhatri(g, sd * 250, -380, 90);
  const block = P2(q => q.rect(-340, -380, 680, 230)); paint(g, block, SAND, SAND_D, 14);
  g.strokeStyle = 'rgba(255,248,236,.85)'; g.lineWidth = 3 * LWH; g.strokeRect(-330, -372, 660, 214);
  for (const sd of [-1, 1]) for (const k of [1, 2]) { const ax = sd * (70 + k * 85); const a = cuspArch(ax, -158, 60, 110, 5); paint(g, a.path, ULTRA_D, null, 0, 1.8); }
  const iwan = P2(q => q.rect(-90, -372, 180, 222)); paint(g, iwan, SAND_L, SAND, 6);
  const ia = cuspArch(0, -150, 130, 140, 7); paint(g, ia.path, ULTRA_D, null, 0, 2.2);
  g.strokeStyle = 'rgba(255,248,236,.85)'; g.lineWidth = 2.4 * LWH; g.strokeRect(-80, -364, 160, 210);
  const drum = P2(q => q.rect(-150, -440, 300, 60)); paint(g, drum, MARBLE, MARBLE_D, 8);
  g.strokeStyle = MARBLE_D; g.lineWidth = 2; for (let x = -130; x <= 130; x += 32) { g.beginPath(); g.moveTo(x, -436); g.lineTo(x, -384); g.stroke(); }
  const dome = onionDome(0, -440, 340, 300); paint(g, dome, MARBLE, MARBLE_D, 16);
  hiLine(g, [[-90, -480], [-80, -600], [-30, -700]], 3, .85);
  g.strokeStyle = MARBLE_D; g.lineWidth = 2; for (const k of [-.5, 0, .5]) { g.beginPath(); g.moveTo(k * 160, -442); g.quadraticCurveTo(k * 110, -640, 0, -740); g.stroke(); }
  finial(g, 0, -738, 2.2);
  for (const sd of [-1, 1]) { const m = P2(q => q.rect(sd * 340 - 14, -470, 28, 90)); paint(g, m, SAND, SAND_D, 4, 1.8); chhatri(g, sd * 340, -470, 48); }
  g.restore();
}

// ---------------------------------------------------------------- sky with gold stars, a crescent moon, white-lead dots
function nightSky(g, x0, y0, x1, y1, seed, o = {}) {
  ultraGround(g, x0, y0, x1 - x0, y1 - y0, .45);
  const R = mulberry(seed);
  whiteTriads(g, R, x0, y0, x1, y1, Math.round((x1 - x0) * (y1 - y0) / 30000), 2.2, .45);
  const n = Math.round((x1 - x0) / 260);
  for (let i = 0; i < n; i++) goldStar(g, lerp(x0, x1, (i + R()) / n), lerp(y0 + 40, y1 - 60, R()), 10 + R() * 12, { rot: R() });
  if (o.moon) { const [mx, my, mr] = o.moon; const c = P2(q => { q.arc(mx, my, mr, 0, TAU); q.arc(mx + mr * .45, my - mr * .2, mr * .86, 0, TAU, true); }); leaf(g, c, [mx - mr, my - mr, mr * 2, mr * 2], { rule: 'evenodd', lw: 2, rimW: 4 }); gpush(mx - mr * .5, my, mr * 2, 1); }
}
function cushion(g, x, y, w, h, col, colD) {
  const p = P2(q => { q.moveTo(x - w / 2, y); q.bezierCurveTo(x - w / 2 - 14, y - h * .5, x - w / 2, y - h, x - w / 2 + 16, y - h); q.lineTo(x + w / 2 - 16, y - h); q.bezierCurveTo(x + w / 2, y - h, x + w / 2 + 14, y - h * .5, x + w / 2, y); q.closePath(); });
  paint(g, p, col, colD, 12);
  hiLine(g, [[x - w / 2 + 10, y - h + 10], [x + w / 2 - 20, y - h + 8]], 2.4, .75);
  pearlLine(g, [[x - w / 2 + 8, y - 8], [x + w / 2 - 8, y - 8]], 12, 2, .85);
  for (const sd of [-1, 1]) { const ts = P2(q => { q.moveTo(x + sd * (w / 2 + 2), y - h * .5); q.lineTo(x + sd * (w / 2 + 14), y - h * .5 + 26); q.lineTo(x + sd * (w / 2 - 4), y - h * .5 + 26); q.closePath(); }); leaf(g, ts, [x + sd * w / 2 - 14, y - h * .5, 28, 28], { lw: 1.4, rimW: 2 }); }
}
function carpet(g, x0, y0, x1, y1) {
  const p = P2(q => q.rect(x0, y0, x1 - x0, y1 - y0)); paint(g, p, VERDI, VERDI_D, 16);
  const inner = P2(q => q.rect(x0 + 30, y0 + 22, x1 - x0 - 60, y1 - y0 - 44)); g.strokeStyle = VERM; g.lineWidth = 8; g.stroke(inner); g.strokeStyle = 'rgba(255,252,238,.7)'; g.lineWidth = 2; g.stroke(inner);
  const R = mulberry(7); for (let y = y0 + 50; y < y1 - 30; y += 34) for (let x = x0 + 60; x < x1 - 50; x += 64) triad(g, x + ((y / 34) % 2) * 32, y, 2.2, .75, R());
}
// painted wall panels with white-lead flowers in niches
function panelWall(g, x0, y0, x1, y1) {
  const p = P2(q => q.rect(x0, y0, x1 - x0, y1 - y0)); paint(g, p, SAND, SAND_D, 0);
  for (let x = x0 + 40; x < x1 - 100; x += 160) for (const [py, ph] of [[y0 + 60, 260], [y0 + 360, 200]]) {
    if (py + ph > y1) continue; const a = cuspArch(x + 60, py + ph, 120, ph * .62, 5); paint(g, a.path, SAND_D, null, 0, 2);
    g.strokeStyle = 'rgba(255,248,236,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 60, py + ph - 10); g.lineTo(x + 60, py + ph * .45); g.stroke();
    for (const [dx, dy] of [[-16, .62], [16, .62], [0, .45], [-12, .8], [12, .8]]) triad(g, x + 60 + dx, py + ph * dy, 3, .85);
  }
}

// ---------------------------------------------------------------- the end plaque and the border that grows from the corners
function border(g, x0, y0, x1, y1, k) {
  if (k <= 0) return; const b = 56, segL = 160, WW2 = x1 - x0, WH2 = y1 - y0;
  g.save(); g.translate(x0, y0);
  const L = k * WW2 * .52, Lh = k * WH2 * .52;
  const clipG = P2(q => { q.rect(-4, -4, L + 4, b + 4); q.rect(WW2 - L, -4, L + 4, b + 4); q.rect(-4, WH2 - b, L + 4, b + 4); q.rect(WW2 - L, WH2 - b, L + 4, b + 4); q.rect(-4, -4, b + 4, Lh + 4); q.rect(-4, WH2 - Lh, b + 4, Lh + 4); q.rect(WW2 - b, -4, b + 4, Lh + 4); q.rect(WW2 - b, WH2 - Lh, b + 4, Lh + 4); });
  const outer = P2(q => { q.rect(-4, -4, WW2 + 8, WH2 + 8); q.rect(b, b, WW2 - 2 * b, WH2 - 2 * b); });
  g.save(); g.clip(clipG); g.clip(outer, 'evenodd');
  const segs = []; for (let x = b; x < WW2 - b; x += segL) segs.push([x, 0, Math.min(segL, WW2 - b - x), b, 'h'], [x, WH2 - b, Math.min(segL, WW2 - b - x), b, 'h']);
  for (let y = b; y < WH2 - b; y += segL) segs.push([0, y, b, Math.min(segL, WH2 - b - y), 'v'], [WW2 - b, y, b, Math.min(segL, WH2 - b - y), 'v']);
  segs.forEach(([sx, sy, sw, sh, o]) => { const idx = o === 'h' ? Math.round((sx - b) / segL) : Math.round((sy - b) / segL), col = idx % 2 ? [VERM, VERM_D] : [ULTRA, ULTRA_D];
    const p = P2(q => q.rect(sx, sy, sw, sh)); g.fillStyle = col[0]; g.fill(p); rimShade(g, p, col[1], 7); maskErase(g, p);
    g.strokeStyle = 'rgba(255,252,238,.88)'; g.lineWidth = 2.4; g.beginPath();
    if (o === 'h') { const cy = sy + sh / 2; for (let x = sx + 10; x <= sx + sw - 10; x += 3) { const yy = cy + Math.sin((x - sx) / 40 * TAU) * 9; x === sx + 10 ? g.moveTo(x, yy) : g.lineTo(x, yy); } }
    else { const cx = sx + sw / 2; for (let y = sy + 10; y <= sy + sh - 10; y += 3) { const xx = cx + Math.sin((y - sy) / 40 * TAU) * 9; y === sy + 10 ? g.moveTo(xx, y) : g.lineTo(xx, y); } }
    g.stroke(); ink(g, p, 2); });
  for (let x = b; x <= WW2 - b; x += segL) for (const yy of [b / 2, WH2 - b / 2]) goldStar(g, x, yy, 16);
  for (let y = b; y <= WH2 - b; y += segL) for (const xx of [b / 2, WW2 - b / 2]) goldStar(g, xx, y, 16);
  for (const [cx, cy] of [[b / 2, b / 2], [WW2 - b / 2, b / 2], [b / 2, WH2 - b / 2], [WW2 - b / 2, WH2 - b / 2]]) { const sq = P2(q => q.rect(cx - b / 2, cy - b / 2, b, b)); leaf(g, sq, [cx - b / 2, cy - b / 2, b, b], { lw: 2.2, rimW: 5 }); const dot = P2(q => q.arc(cx, cy, 12, 0, TAU)); paint(g, dot, VERM, VERM_D, 3); pearls(g, cx, cy, 20, 12, 2, .9); }
  g.restore();
  const fil = (e, w) => { const p = new Path2D(); p.moveTo(e, e + Lh); p.lineTo(e, e); p.lineTo(e + L, e); p.moveTo(WW2 - e - L, e); p.lineTo(WW2 - e, e); p.lineTo(WW2 - e, e + Lh); p.moveTo(WW2 - e, WH2 - e - Lh); p.lineTo(WW2 - e, WH2 - e); p.lineTo(WW2 - e - L, WH2 - e); p.moveTo(e + L, WH2 - e); p.lineTo(e, WH2 - e); p.lineTo(e, WH2 - e - Lh); leafCord(g, p, w, { ink: 2.4 }); };
  fil(5, 8); fil(b - 1, 7);
  g.restore();
}
function plaque(g, cx, cy, w, h, k, wipe1, wipe2) {
  if (k <= 0) return; const hw = w / 2 * (.3 + .7 * eo(k)), hh = h / 2;
  const p = P2(q => { q.moveTo(cx - hw, cy - hh); q.lineTo(cx + hw, cy - hh); q.lineTo(cx + hw, cy + hh); q.lineTo(cx - hw, cy + hh); q.closePath(); });
  for (const sd of [-1, 1]) { const tail = P2(q => { q.moveTo(cx + sd * hw, cy - hh + 10); q.lineTo(cx + sd * (hw + 50), cy - hh + 22); q.lineTo(cx + sd * (hw + 30), cy); q.lineTo(cx + sd * (hw + 56), cy + hh + 12); q.lineTo(cx + sd * hw, cy + hh - 6); q.closePath(); }); paint(g, tail, '#d8c69c', '#a8926a', 7, 2.4); }
  g.fillStyle = VELL; g.fill(p); g.save(); g.clip(p); g.globalAlpha = .5; g.fillStyle = g.__sp || (g.__sp = g.createPattern(SPKC, 'repeat')); g.fillRect(cx - hw, cy - hh, hw * 2, hh * 2); g.restore();
  rimShade(g, p, '#c9b386', 9); ink(g, p, 2.4); maskErase(g, p);
  const wr = (txt, font, y, col, wp, id) => { if (wp <= 0) return; g.save(); g.font = font; const tw = g.measureText(txt).width; g.beginPath(); g.rect(cx - tw / 2 - 4, y - 80, (tw + 8) * wp, 120); g.clip(); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = col; g.fillText(txt, cx, y); g.restore(); if (wp >= 1) reg(id, txt, g, cx - tw / 2, y - 50, cx + tw / 2, y + 8); };
  wr('THE LAST MUGHAL', '58px Uncial', cy - 6, '#6e2414', wipe1, 'plq1');
  wr('1526  –  1857', '44px Fell', cy + 52, '#4a2c16', wipe2, 'plq2');
}
function titleScroll(g, cx, cy, txt, k, wipe) {
  if (k <= 0) return; g.font = '64px Uncial'; const tw = g.measureText(txt).width, hw = (tw / 2 + 50) * eo(k), h = 96;
  for (const sd of [-1, 1]) { const ex = cx + sd * hw; const tail = P2(q => { q.moveTo(ex - sd * 6, cy - h / 2 + 18); q.lineTo(ex + sd * 60, cy - h / 2 + 30); q.lineTo(ex + sd * 36, cy + 4); q.lineTo(ex + sd * 66, cy + h / 2 + 18); q.lineTo(ex - sd * 6, cy + h / 2 - 6); q.closePath(); }); paint(g, tail, '#d8c69c', '#a8926a', 7, 2.6); }
  const band = P2(q => { q.moveTo(cx - hw, cy - h / 2); q.bezierCurveTo(cx - hw * .4, cy - h / 2 - 10, cx + hw * .4, cy - h / 2 + 9, cx + hw, cy - h / 2); q.lineTo(cx + hw, cy + h / 2); q.bezierCurveTo(cx + hw * .4, cy + h / 2 + 9, cx - hw * .4, cy + h / 2 - 10, cx - hw, cy + h / 2); q.closePath(); });
  g.fillStyle = VELL; g.fill(band); rimShade(g, band, '#c9b386', 9); ink(g, band, 2.6); maskErase(g, band);
  if (wipe > 0) { g.save(); g.clip(band); g.beginPath(); g.rect(cx - hw, cy - h, hw * 2 * wipe, h * 2); g.clip(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#6e2414'; g.font = '64px Uncial'; g.fillText(txt, cx, cy + 4); g.restore(); if (wipe >= 1) reg('title', txt, g, cx - tw / 2, cy - 32, cx + tw / 2, cy + 32); }
}
