'use strict';
// The Last Emperor's Crown: one timeline, eleven shots, the speech scroll and the sound cues.
// Times are film seconds. timing.js (written from the measured voice) may override T and SUBS.

let T = { open: 0, court: 6, river: 13, meerut: 20.5, rise: 21.6, push4: 24.2, ride: 28.5, wipe5: 31.0, touch: 34.5, TOUCH: 35.4, cutw: 37.6,
  siege: 41.5, breach: 46.6, tomb: 50.5, cush: 54.5, sea: 59, tear: 63.0, rise2: 64.2, plq: 67, rake: 73.5, end: 78 };
let SUBS = [
  [0.8, 5.6, 'In 1857, the Mughal emperor ruled an empire the size of one fort.'],
  [6.3, 9.4, 'Bahadur Shah Zafar was 81, and a poet.'], [9.5, 12.7, 'His crown was gold. His power was gone.'],
  [13.2, 15.4, 'India was run by a trading company,'], [15.4, 17.6, 'the British East India Company,'], [17.6, 20.0, 'and it paid him a pension.'],
  [20.8, 24.2, 'Then, at Meerut, Indian soldiers in the Company’s own army rose up.'],
  [24.6, 28.2, 'The spark: cartridges rumoured to be greased with cow and pig fat.'],
  [28.8, 31.2, 'They rode through the night to Delhi,'], [31.3, 34.0, 'and asked the old emperor to lead them.'],
  [36.2, 37.4, 'He said yes.'], [37.6, 41.0, 'For four months, the last Mughal was an emperor again.'],
  [41.8, 43.6, 'The Company struck back.'], [43.7, 45.8, 'It besieged Delhi all summer,'], [45.9, 48.4, 'and in September stormed the walls.'],
  [50.8, 53.6, 'Zafar surrendered at his ancestor’s tomb.'],
  [55.2, 57.6, 'The next day, his sons were shot.'],
  [59.3, 61.8, 'He was exiled to Rangoon, in Burma.'], [62.4, 63.9, 'But the Company fell too:'], [64.0, 66.6, 'in 1858, the British Crown took India from it.'],
  [67.6, 70.6, 'Zafar died in 1862, in an unmarked grave.'], [71.0, 73.4, '331 years of Mughal rule'], [73.5, 75.8, 'had ended in a single summer.'],
];
if (window.TIMING) { Object.assign(T, window.TIMING.T); SUBS = window.TIMING.SUBS; }
let DUR = T.end;

const camT = (keys) => { const f = track(keys.map(([t, x, y, z, r]) => [t, [x, y, Math.log(z), r || 0]])); return t => { const v = f(t); return { x: v[0], y: v[1], z: Math.exp(v[2]), r: v[3] }; }; };
const screenOverlay = (draw) => (g, og) => { draw(g, false); draw(og, true); };

// ---------------------------------------------------------------- 1. the gold ground and the first stroke
function shotOpen(t) {
  const X = lerp(-820, 820, eio(seg(t, .5, 3.4)));
  return { c: { x: 960, y: 540, z: lerp(1, 1.07, ss(seg(t, 3, 6))), r: 0 }, dim: .82,
    draw(g) {
      leaf(g, P2(q => q.rect(-300, -300, 2520, 1680)), [-300, -300, 2520, 1680], { line: false, rim: false });
      g.save(); g.translate(960, 930); const clip = P2(q => { q.moveTo(-900, 200); q.lineTo(X, 200);
        for (let y = 200; y > -520; y -= 24) q.lineTo(X + Math.sin(y * .07) * 18 + (h2(y | 0, 3) - .5) * 26, y); q.lineTo(-900, -520); q.closePath(); }); g.clip(clip); g.translate(-960, -930);
      fort(g, 960, 930, .95); g.restore();
      if (X > -800 && X < 800) { const bx = 960 + X * .95, p = P2(q => q.ellipse(bx, 760, 16, 120, .05, 0, TAU)); g.fillStyle = rgba(VERM, .55); g.fill(p); }
      titleScroll(g, 960, 150, 'THE LAST EMPEROR', seg(t, 2.6, 3.1), seg(t, 3.0, 3.8));
    },
    lights: [{ type: 'b', x: lerp(-300, 2300, seg(t, 0, 4.2)), y: 540, nx: .96, ny: -.28, w: 170, a: .28 * Math.sin(Math.PI * seg(t, 0, 4.2)) }] };
}

// ---------------------------------------------------------------- the court: a cusped arch on a gold ground, the emperor writing
function drawCourt(g, t, o = {}) {
  panelWall(g, -200, -100, 2120, 840);
  const a = cuspArch(960, 800, 720, 380, 9, .05);
  const frameP = P2(q => q.rect(560, a.apex - 70, 800, 800 - a.apex + 70)); paint(g, frameP, SAND_L, SAND, 10);
  for (let k = 0; k < 2; k++) { const bx = k ? 1320 : 600; for (let y = a.apex - 40; y < 790; y += 40) triad(g, bx, y, 3, .85); }
  leaf(g, a.path, [600, a.apex, 720, 800 - a.apex], { lw: 3, rimW: 7 });
  g.save(); g.clip(a.path); g.fillStyle = 'rgba(100,54,6,.5)'; for (let y = a.apex + 30; y < 800; y += 34) for (let x = 610 + ((y / 34) % 2) * 17; x < 1320; x += 34) { g.beginPath(); g.arc(x, y, 1.8, 0, TAU); g.fill(); } g.restore();
  g.strokeStyle = 'rgba(255,248,236,.9)'; g.lineWidth = 2.6 * LWH; g.save(); g.translate(960, 800); g.scale(1.06, 1.03); g.translate(-960, -800); g.stroke(a.path); g.restore();
  gpush(960, a.apex + 120, 260, 1); gpush(700, 600, 200, .8); gpush(1220, 600, 200, .8);
  carpet(g, -200, 800, 2120, 1300);
  const takht = P2(q => q.rect(700, 770, 520, 46)); paint(g, takht, MARBLE, MARBLE_D, 8); leafCord(g, polyPath([[704, 772], [1216, 772]]), 6, { ink: 2 });
  for (let x = 730; x < 1200; x += 60) { const inl = P2(q => q.rect(x, 784, 30, 20)); paint(g, inl, VERDI, VERDI_D, 3, 1.4); }
  if (o.cushions) { cushion(g, 790, 770, 150, 84, VERM, VERM_D); cushion(g, 960, 770, 150, 84, ULTRA, ULTRA_D); cushion(g, 1130, 770, 150, 84, ROSE, ROSE_D); return; }
  cushion(g, 820, 770, 120, 110, VERM, VERM_D);
  if (o.emperor !== false) emperor(g, 935, 770, 1.35, { t, halo: o.haloDim, dim: o.crownDim });
}
const camCourt = camT([[6, 958, 600, .86], [9.5, 952, 520, 1.08], [13, 948, 500, 1.2]]);
function shotCourt(t) {
  const fs = lerp(1, 2.7, ei(seg(t, 6.2, 9.4)));
  return { c: camCourt(t), dim: 1,
    draw(g) { drawCourt(g, t, { haloDim: 1, crownDim: 1 }); },
    overlay: fs < 2.65 ? screenOverlay((g, occ) => { g.save(); g.translate(W / 2, H * .55); g.scale(fs, fs); g.translate(-W / 2, -H * .55);
      const a = cuspArch(W / 2, H + 40, 1180, 720, 9, .05), p = P2(q => { q.rect(-3000, -3000, 8000, 8000); q.addPath(a.path); });
      if (occ) { g.fillStyle = '#000'; g.fill(p, 'evenodd'); } else { g.fillStyle = VERM; g.fill(p, 'evenodd'); g.save(); g.clip(p, 'evenodd'); g.strokeStyle = VERM_D; g.lineWidth = 26; g.stroke(a.path); g.restore(); leafCord(g, a.path, 10, { ink: 3, nomask: true }); ink(g, a.path, 2.6); for (let k = 0; k < 18; k++) { const q = alongPath([[W / 2 - 590, H + 40], [W / 2 - 590, 300], [W / 2, -120], [W / 2 + 590, 300], [W / 2 + 590, H + 40]], arclen([[W / 2 - 590, H + 40], [W / 2 - 590, 300], [W / 2, -120], [W / 2 + 590, 300], [W / 2 + 590, H + 40]]), k * 190); triad(g, q.x + (q.x < W / 2 ? -40 : 40), q.y, 4, .85); } }
      g.restore(); }) : null };
}

// ---------------------------------------------------------------- the river: the emperor in his balcony, the Company outside the walls
const camRiver = camT([[13, 470, 800, 1.55], [14.6, 520, 790, 1.4], [18.6, 1720, 760, .62], [20.5, 1760, 760, .6]]);
const BOWL = [445, 868], COIN0 = [1702, 742];
function warehouse(g, x, by) {
  const body = P2(q => q.rect(x - 200, by - 260, 400, 260)); paint(g, body, MARBLE, MARBLE_D, 12);
  const ped = P2(q => { q.moveTo(x - 220, by - 260); q.lineTo(x, by - 360); q.lineTo(x + 220, by - 260); q.closePath(); }); paint(g, ped, MARBLE, MARBLE_D, 10);
  for (let k = -3; k <= 3; k++) { const col = P2(q => q.rect(x + k * 54 - 9, by - 240, 18, 240)); paint(g, col, WHITE, MARBLE_D, 4, 1.8); }
  const door = P2(q => q.rect(x - 34, by - 130, 68, 130)); paint(g, door, WOOD, WOOD_D, 5);
  flag(g, x, by - 360, 200, 'company', 0);
}
function bales(g, x, by) {
  for (const [dx, dy, w, h] of [[-70, 0, 90, 70], [30, 0, 90, 70], [-20, -70, 90, 66]]) { const p = P2(q => q.rect(x + dx - w / 2, by + dy - h, w, h)); paint(g, p, OCHRE_D, WOOD_D, 6); g.strokeStyle = WOOD_D; g.lineWidth = 3; g.beginPath(); g.moveTo(x + dx, by + dy - h); g.lineTo(x + dx, by + dy); g.moveTo(x + dx - w / 2, by + dy - h / 2); g.lineTo(x + dx + w / 2, by + dy - h / 2); g.stroke(); }
  const chest = P2(q => q.rect(x + 100, by - 60, 110, 60)); paint(g, chest, WOOD, WOOD_D, 6);
  const coins = P2(q => { q.moveTo(x + 104, by - 60); q.quadraticCurveTo(x + 155, by - 100, x + 206, by - 60); q.closePath(); }); leaf(g, coins, [x + 104, by - 100, 102, 40], { lw: 1.8, rimW: 3 }); gpush(x + 155, by - 75, 60, 1);
}
function shotRiver(t) {
  const ct = seg(t, 15.7, 16.9), cx = lerp(COIN0[0], BOWL[0], ct), cy = lerp(COIN0[1], BOWL[1] - 8, ct) - Math.sin(Math.PI * ct) * 420, landed = t > 16.9;
  return { c: camRiver(t), dim: 1,
    draw(g) {
      nightSky(g, -600, -700, 4600, 1100, 11);
      const bank = P2(q => q.rect(-600, 1000, 3100, 1200)); paint(g, bank, VERD, VERD_D, 0);
      waves(g, 2350, 880, 4600, 2200, t);
      const shore = P2(q => { q.moveTo(2240, 1000); q.quadraticCurveTo(2340, 900, 2420, 880); q.lineTo(2420, 2200); q.lineTo(2240, 2200); q.closePath(); }); paint(g, shore, VERD, VERD_D, 10);
      const R = mulberry(4); for (const x of [1230, 1330, 2200]) tree(g, x, 1010, 70, R); cypress(g, 1420, 1010, 260);
      fort(g, 700, 1000, 1, { balcony: -300, inBalcony(g2, bx, by2) {
        emperor(g2, bx - 22, by2, .38, { t, halo: undefined, dim: 1 });
        const bowl = P2(q => { q.moveTo(bx + 30, by2 - 4); q.quadraticCurveTo(bx + 46, by2 + 10, bx + 62, by2 - 4); q.closePath(); }); leaf(g2, bowl, [bx + 30, by2 - 6, 32, 16], { lw: 1.4, rimW: 2 });
        if (landed) { const c2 = P2(q => q.ellipse(bx + 46, by2 - 5, 7, 3, 0, 0, TAU)); leaf(g2, c2, [bx + 39, by2 - 9, 14, 8], { lw: 1.2, rimW: 1, dim: .2 }); } } });
      warehouse(g, 1960, 1000); bales(g, 1520, 1010);
      soldier(g, 1680, 1012, .95, { brit: true, t, raise: 0, sword: true, lift: t < 15.7 ? .4 + .6 * ss(seg(t, 15.1, 15.6)) : 1 - .6 * ss(seg(t, 15.8, 16.4)) });
      ship(g, 3100, 960, .9, t, 'company');
      if (t > 15.7 && !landed) { const c = P2(q => q.arc(cx, cy, 9, 0, TAU)); leaf(g, c, [cx - 9, cy - 9, 18, 18], { lw: 1.4, rimW: 2, dim: .2 }); gpush(cx, cy, 30, 1); }
    },
    lights: t > 15.6 && t < 17.6 ? [{ type: 'r', x: landed ? BOWL[0] : cx, y: landed ? BOWL[1] : cy, r: 130, a: landed ? 1.1 * (1 - seg(t, 16.9, 17.6)) : .9 }] : [] };
}
function ship(g, x, y, s, t, fl, o = {}) {   // an East Indiaman under sail, facing right
  const bob = Math.sin(t * 1.6) * 5;
  g.save(); g.translate(x, y + bob); g.scale(s, s); g.rotate(Math.sin(t * 1.3) * .015);
  for (const [mx, mh] of [[-120, 360], [10, 420], [130, 330]]) {
    const mast = P2(q => q.rect(mx - 5, -mh, 10, mh)); paint(g, mast, WOOD, WOOD_D, 3, 1.8);
    for (const [y0, w, h] of [[-mh + 40, mh * .36, mh * .22], [-mh * .62, mh * .48, mh * .3]]) { const sail = P2(q => { q.moveTo(mx - w / 2, y0); q.lineTo(mx + w / 2, y0); q.quadraticCurveTo(mx + w / 2 + 16, y0 + h / 2, mx + w / 2, y0 + h); q.lineTo(mx - w / 2, y0 + h); q.quadraticCurveTo(mx - w / 2 + 16, y0 + h / 2, mx - w / 2, y0); q.closePath(); }); paint(g, sail, WHITE, MARBLE_D, 9, 2); hiLine(g, [[mx - w / 2 + 12, y0 + 10], [mx - w / 2 + 18, y0 + h - 10]], 2, .7); }
  }
  if (fl) flag(g, 10, -420, 90, fl, t);
  if (o.awning) { const aw = P2(q => { q.moveTo(-60, -40); q.quadraticCurveTo(-20, -96, 20, -96); q.quadraticCurveTo(60, -96, 80, -40); q.closePath(); }); paint(g, aw, VERM, VERM_D, 6); emperor(g, 0, -20, .26, { pose: 'stand', crown: false, hold: 0, t }); }
  const hull = P2(q => { q.moveTo(-230, -40); q.lineTo(230, -50); q.bezierCurveTo(220, 10, 190, 50, 140, 60); q.lineTo(-170, 60); q.bezierCurveTo(-210, 40, -226, 0, -230, -40); q.closePath(); });
  paint(g, hull, WOOD, WOOD_D, 12);
  const stripe = P2(q => { q.moveTo(-226, -22); q.lineTo(226, -30); q.lineTo(222, -14); q.lineTo(-220, -6); q.closePath(); }); paint(g, stripe, VERM, VERM_D, 3, 1.6);
  for (let k = -5; k <= 5; k++) { const p = P2(q => q.rect(k * 34 - 7, 6, 14, 12)); paint(g, p, INK, null, 0, 1.2); }
  g.restore();
}

// ---------------------------------------------------------------- Meerut: a row of sepoys at night, a lamp, a cartridge held up
const camMeerut = (t) => t < T.push4 ? { x: 960, y: 560, z: lerp(1, 1.05, seg(t, T.meerut, T.push4)), r: 0 } : camT([[T.push4, 960, 560, 1.05], [T.push4 + 1.6, 1068, 492, 3.0], [T.ride, 1072, 486, 3.15]])(t);
function lampPost(g, x, by, h, t) {
  const post = P2(q => q.rect(x - 6, by - h, 12, h)); paint(g, post, WOOD, WOOD_D, 3, 1.8);
  const arm = P2(q => q.rect(x - 4, by - h, 60, 8)); paint(g, arm, WOOD, WOOD_D, 2, 1.6);
  const cage = P2(q => { q.moveTo(x + 36, by - h + 8); q.lineTo(x + 74, by - h + 8); q.lineTo(x + 70, by - h + 70); q.lineTo(x + 40, by - h + 70); q.closePath(); });
  g.fillStyle = 'rgba(30,30,80,.6)'; g.fill(cage); leafCord(g, cage, 4, { ink: 2 });
  const f = flame(g, x + 55, by - h + 62, .9, t, 3); gpush(x + 55, by - h + 40, 60, 1);
  return [x + 55, by - h + 45];
}
function shotMeerut(t) {
  let L = null;
  return { c: camMeerut(t), dim: 1, night: .5,
    draw(g) {
      nightSky(g, -300, -300, 2300, 900, 21, { moon: [1640, 170, 56] });
      const bar = P2(q => q.rect(-300, 470, 2600, 340)); paint(g, bar, LILAC, LILAC_D, 14);
      for (let x = -260; x < 2300; x += 150) { const a = cuspArch(x + 60, 790, 90, 150, 5); paint(g, a.path, ULTRA_D, null, 0, 2); }
      const roof = P2(q => q.rect(-300, 440, 2600, 34)); paint(g, roof, LILAC_L, LILAC, 6); pearlLine(g, [[-280, 457], [2280, 457]], 22, 2.2, .8);
      const gr = P2(q => q.rect(-300, 800, 2600, 500)); paint(g, gr, VERD_D, '#122e18', 0);
      const R = mulberry(9); whiteTriads(g, R, -300, 830, 2300, 1100, 60, 2.2, .5);
      L = lampPost(g, 1150, 820, 370, t);
      const rz = popS(seg(t, T.rise, T.rise + .9) * 1.4);
      [[470, .98], [640, 1.0], [810, .97], [1330, 1.0], [1480, .96]].forEach(([x, k], i) => soldier(g, x, 820, 1.1 * k, { t, raise: clamp(rz - i * .05) }));
      soldier(g, 1000, 820, 1.15, { t, cartridge: true });
    },
    get lamps() { return [[1205, 495, 420, .9 + .1 * Math.sin(t * 13)]]; },
    lights: [{ type: 'r', x: 1205, y: 478, r: 260, a: .75 + .08 * Math.sin(t * 11) }] };
}

// ---------------------------------------------------------------- the ride to Delhi: the same riders twice in one picture
const camRide = (t) => ({ x: lerp(1250, 4150, eio(seg(t, T.ride, T.touch))), y: 700, z: 1.0, r: 0 });
function shotRide(t) {
  const dx = 70 * (t - T.ride);
  return { c: camRide(t), dim: 1, night: .5,
    draw(g) {
      nightSky(g, -400, -300, 5800, 760, 31, { moon: [2700, 160, 60] });
      const hills = P2(q => { q.moveTo(-400, 760); for (let x = -400; x <= 5800; x += 120) q.lineTo(x, 650 - 40 * Math.abs(Math.sin(x * .0021)) - 30 * Math.abs(Math.sin(x * .0057))); q.lineTo(5800, 760); q.closePath(); }); paint(g, hills, LILAC_L, LILAC, 12);
      const plain = P2(q => q.rect(-400, 740, 6200, 700)); paint(g, plain, VERD, VERD_D, 0);
      const road = P2(q => { q.moveTo(-400, 905); q.bezierCurveTo(1500, 860, 3000, 950, 5800, 880); q.lineTo(5800, 940); q.bezierCurveTo(3000, 1010, 1500, 920, -400, 965); q.closePath(); }); paint(g, road, '#c9bfa8', '#9d917a', 8);
      const R = mulberry(41); whiteTriads(g, R, -400, 760, 5800, 1300, 220, 2.2, .55);
      for (let x = 200; x < 4400; x += 380 + 120 * R()) { if (R() < .5) tree(g, x, 840 + 20 * R(), 50 + 20 * R(), R); else cypress(g, x, 850, 160 + 60 * R()); }
      fort(g, 4950, 860, .55);
      for (const base of [1150, 3250]) [[0, 0], [-170, 30], [-330, -10]].forEach(([ox, oy], i) => rider(g, base + dx + ox, 935 + oy, 1.2, t + i * .37 + base * .001, i === 1 ? WOOD : LILAC, i === 1 ? WOOD_D : LILAC_D));
    },
    overlay: t > T.wipe5 && t < T.wipe5 + 1.2 ? screenOverlay((g, occ) => { const u = seg(t, T.wipe5, T.wipe5 + 1.2), x = lerp(W + 500, -700, u); g.save();
      const p = P2(q => { q.moveTo(x - 300, H + 50); q.bezierCurveTo(x - 330, H * .5, x - 160, -200, x, -260); q.bezierCurveTo(x + 160, -200, x + 330, H * .5, x + 300, H + 50); q.closePath(); });
      if (occ) { g.fillStyle = '#000'; g.fill(p); } else { setZoom(.6); g.fillStyle = VERD_D; g.fill(p); rimShade(g, p, '#0e2614', 40); ink(g, p, 4); for (let k = 0; k < 9; k++) triad(g, x - 120 + (k % 3) * 120, 160 + k * 90, 5, .7); } g.restore(); }) : null };
}

// ---------------------------------------------------------------- the touch: a torch to the crown, the gold lights for the only time
const CROWN = [944, 410], TIP = [903, 432];
const camTouch = (t) => t < T.cutw ? { x: lerp(905, 925, seg(t, T.touch, T.cutw)), y: 420, z: lerp(2.5, 2.62, seg(t, T.touch, T.cutw)), r: 0 } : { x: 960, y: lerp(520, 505, seg(t, T.cutw, T.siege)), z: lerp(.98, 1.05, seg(t, T.cutw, T.siege)), r: 0 };
function shotTouch(t) {
  const lit = ss(seg(t, T.TOUCH, T.TOUCH + 1.2)), wide = t >= T.cutw;
  const tip = [lerp(700, TIP[0], eio(seg(t, T.touch, T.TOUCH))), lerp(560, TIP[1], eio(seg(t, T.touch, T.TOUCH)))];
  const lights = [];
  if (t > T.TOUCH) { const r1 = (t - T.TOUCH) * 520, fade = 1 - seg(t, T.TOUCH + .4, T.TOUCH + 2.2); lights.push({ type: 'o', x: TIP[0], y: TIP[1], rad: r1, w: 30, a: .75 * fade }, { type: 'o', x: TIP[0], y: TIP[1], rad: Math.max(0, r1 - 170), w: 26, a: .55 * fade });
    lights.push({ type: 'r', x: CROWN[0], y: CROWN[1], r: 130, a: .85 * lit });
    for (let k = 0; k < 14; k++) { const an = -Math.PI / 2 + k / 14 * TAU, v = ss(seg(t, T.TOUCH + .3 + k * .07, T.TOUCH + .6 + k * .07)); lights.push({ type: 'r', x: 942 + Math.cos(an) * 70, y: 466 + Math.sin(an) * 70, r: 70, a: .7 * v }); }
    if (wide) lights.push({ type: 'b', x: lerp(400, 1600, seg(t, T.cutw, T.siege)), y: 500, nx: .95, ny: -.3, w: 260, a: .55 }); }
  return { c: camTouch(t), dim: lerp(1, .55, lit), amb: wide ? .12 : 0,
    draw(g) {
      drawCourt(g, t, {});
      soldier(g, 610, 800, 1.3, { t, reach: true, lift: 1 });
      const hand = [610 + 54 * 1.3, 800 - 248 * 1.3];
      const st = polyPath([hand, [tip[0] - 6, tip[1] + 14]]); g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 9 + 3 * LWK; g.stroke(st); g.strokeStyle = WOOD; g.lineWidth = 9; g.stroke(st);
      flame(g, tip[0], tip[1] + 14, 1.2, t, 1);
      if (wide) { soldier(g, 1380, 805, 1.25, { t, dir: -1, raise: .6 }); }
    },
    get lamps() { return [[tip[0], tip[1], 300, 1]]; }, lights };
}

// ---------------------------------------------------------------- the siege: the Company's guns on the ridge, the breach
const camSiege = camT([[T.siege, 2980, 820, .95, 0], [T.siege + 1.8, 2860, 830, .92, -.01], [T.breach + .2, 1760, 830, .95, -.03], [T.tomb, 1755, 820, 1.02, -.028]]);
const FIRE = () => [T.siege + 1.0, T.siege + 1.9, T.siege + 3.0, T.siege + 3.9, T.breach - .7, T.breach];
function shotSiege(t) {
  const guns = [[2720, 905], [2960, 900], [3200, 905]], fires = FIRE(), br = seg(t, T.breach + .8, T.breach + 1.9);
  return { c: camSiege(t), dim: 1, night: lerp(.45, .7, seg(t, T.siege, T.tomb)),
    draw(g) {
      nightSky(g, -400, -400, 4400, 1100, 51);
      for (let i = 0; i < 6; i++) { const x = 300 + i * 270, d = onionDome(x, 720, 150, 150); paint(g, d, MARBLE, MARBLE_D, 10); finial(g, x, 570, 1.4); if (i % 2) { const m = P2(q => q.rect(x + 100 - 10, 480, 20, 240)); paint(g, m, MARBLE, MARBLE_D, 4, 1.8); chhatri(g, x + 100, 480, 40); } }
      const wall = P2(q => { q.rect(-400, 720, 2500, 340); if (br > 0) { const k = br; q.moveTo(1640, 715); q.lineTo(1700, 760 + 80 * k); q.lineTo(1660, 840 + 120 * k); q.lineTo(1760, 900 + 100 * k); q.lineTo(1860, 830 + 110 * k); q.lineTo(1830, 760 + 60 * k); q.lineTo(1880, 715); q.closePath(); } });
      g.save(); paint(g, wall, SAND, SAND_D, 14); g.restore();
      if (br > 0) { const gap = P2(q => { const k = br; q.moveTo(1640, 715); q.lineTo(1700, 760 + 80 * k); q.lineTo(1660, 840 + 120 * k); q.lineTo(1760, 900 + 100 * k); q.lineTo(1860, 830 + 110 * k); q.lineTo(1830, 760 + 60 * k); q.lineTo(1880, 715); q.closePath(); }); paint(g, gap, ULTRA_D, null, 0, 2.4); }
      g.strokeStyle = 'rgba(255,240,226,.5)'; g.lineWidth = 2 * LWH; for (let y = 760; y < 1060; y += 46) { g.beginPath(); g.moveTo(-380, y); g.lineTo(2080, y); g.stroke(); }
      merlons(g, -400, br > .1 ? 1630 : 2100, 720, 40, SAND, SAND_D); if (br > .1) merlons(g, 1890, 2100, 720, 40, SAND, SAND_D);
      const bast = P2(q => { q.moveTo(1980, 1060); q.lineTo(2000, 700); q.lineTo(2160, 680); q.lineTo(2200, 1060); q.closePath(); }); paint(g, bast, SAND, SAND_D, 12); merlons(g, 2000, 2160, 700, 32, SAND, SAND_D);
      const cr = seg(t, T.breach, T.breach + .8); if (cr > 0) { g.strokeStyle = INK; g.lineWidth = 3 * LWK; g.beginPath(); const pts = [[1760, 1050], [1740, 960], [1780, 900], [1730, 820], [1770, 740]]; const n = Math.ceil(pts.length * cr); pts.slice(0, n).forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
      for (let i = 0; i < 7; i++) { const u = seg(t, T.breach + .8 + i * .08, T.breach + 1.6 + i * .08); if (u <= 0) continue; const R = mulberry(i * 13 + 3), x0 = 1660 + R() * 200, y0 = 700 + R() * 80, x = x0 + (R() - .5) * 80 * u, y = y0 + 360 * u * u, s = 26 + R() * 18; g.save(); g.translate(x, Math.min(y, 1050 - s)); g.rotate(u * (R() - .5) * 4); const st = P2(q => q.rect(-s / 2, -s / 2, s, s * .7)); paint(g, st, SAND, SAND_D, 5, 2); g.restore(); }
      const gr = P2(q => q.rect(-400, 1050, 4800, 500)); paint(g, gr, VERD_D, '#122e18', 0);
      const R = mulberry(52), sp = []; for (let i = 0; i < 9; i++) sp.push([2420 + i * 170 + R() * 60, 960, 90 + R() * 70, 180 + R() * 220, (R() - .5) * .3]);
      sp.sort((a, b) => b[3] - a[3]).forEach(([x, by, w, h, l]) => { const p = polyPath(spirePts(x, by, w, h, l, R), true); paint(g, p, LILAC, LILAC_D, 12); hiLine(g, [[x - w * .3, by - h * .2], [x - w * .1 + l * h * .6, by - h * .8]], 2.2, .6); });
      const ledge = P2(q => q.rect(2560, 905, 1200, 200)); paint(g, ledge, LILAC_L, LILAC, 10);
      flag(g, 3420, 905, 360, 'company', t);
      guns.forEach(([x, y], i) => { const lastF = fires.filter((f, k) => k % 3 === i && f <= t).pop(), rec = lastF !== undefined ? Math.exp(-(t - lastF) * 6) : 0; g.save(); g.translate(x, y); g.scale(-1, 1); cannon(g, 0, 0, .9, rec); g.restore();
        soldier(g, x + 120, y + 4, .62, { brit: true, t, dir: -1 }); });
      fires.forEach((f, k) => { if (t < f) return; const [x, y] = guns[k % 3], mx = x - 116 * .9, my = y - 80 * .9, u = t - f;
        if (u < .18) { const fl = P2(q => star8(q, mx - 20, my, 46 * (1 - u * 3), .4, .2, 6)); g.fillStyle = VERM_L; g.fill(fl); ink(g, fl, 1.6); g.fillStyle = 'rgba(255,250,236,.95)'; g.beginPath(); g.arc(mx - 20, my, 12, 0, TAU); g.fill(); }
        if (u < 3.2) { const k2 = ss(u / 1.2); scallopCloud(g, mx - 60 - u * 50, my - 20 - u * 60, 70 + 150 * k2, .6 + .7 * k2, '#e9e9f2', 'rgba(120,120,150,.6)'); } });
      if (br > 0) { const dust = scallopCloud(g, 1760, 760 - br * 60, 220 + br * 160, .8 + br * .5, '#d9c9b8', 'rgba(140,100,80,.6)'); void dust; }
    },
    lights: FIRE().filter(f => t > f && t < f + .4).map((f, k) => ({ type: 'r', x: 2600, y: 820, r: 500, a: .5 * (1 - (t - f) / .4) })) };
}

// ---------------------------------------------------------------- the tomb: the emperor gives up his crown
const camTomb = camT([[T.tomb, 965, 900, 1.6], [T.tomb + 2.5, 960, 690, 1.05], [T.cush, 960, 650, .98]]);
function shotTomb(t) {
  return { c: camTomb(t), dim: 1, night: .45,
    draw(g) {
      nightSky(g, -400, -400, 2400, 960, 61);
      const gr = P2(q => q.rect(-400, 900, 2800, 600)); paint(g, gr, VERD, VERD_D, 0);
      const walk = P2(q => { q.moveTo(860, 900); q.lineTo(1060, 900); q.lineTo(1300, 1400); q.lineTo(620, 1400); q.closePath(); }); paint(g, walk, '#c9bfa8', '#9d917a', 8);
      for (const x of [300, 520, 1400, 1620]) cypress(g, x, 905, 230);
      tomb(g, 960, 900, .95);
      emperor(g, 895, 1010, .55, { pose: 'stand', crown: false, handCrown: true, hold: ss(seg(t, T.tomb + .6, T.tomb + 1.8)), dim: 1, t });
      soldier(g, 1065, 1012, .56, { brit: true, dir: -1, sword: true, lift: .15, t });
      soldier(g, 1160, 1004, .5, { brit: true, dir: -1, t }); soldier(g, 1230, 1008, .5, { brit: true, dir: -1, t });
    } };
}

// ---------------------------------------------------------------- three empty cushions
function shotCush(t) {
  return { c: { x: 960, y: 520, z: lerp(1, 1.04, seg(t, T.cush, T.sea)), r: 0 }, dim: 1, night: .38,
    draw(g) { drawCourt(g, t, { cushions: true }); } };
}

// ---------------------------------------------------------------- the sea: exile; the Company's flag torn down, the Crown's raised
const camSea = (t) => ({ x: lerp(1150, 3250, eio(seg(t, T.sea + .4, T.tear + .6))), y: 560, z: .86, r: 0 });
function shotSea(t) {
  const tear = seg(t, T.tear, T.tear + 1.0), rise = seg(t, T.rise2, T.rise2 + 1.3);
  return { c: camSea(t), dim: 1, night: .3,
    draw(g) {
      nightSky(g, -400, -400, 4800, 760, 71, { moon: [3700, 150, 54] });
      const hill = P2(q => { q.moveTo(2850, 760); q.bezierCurveTo(3000, 600, 3300, 560, 3600, 580); q.bezierCurveTo(3900, 600, 4300, 640, 4800, 700); q.lineTo(4800, 800); q.lineTo(2850, 800); q.closePath(); }); paint(g, hill, VERD, VERD_D, 14);
      const R = mulberry(72); for (const x of [3650, 3800, 4050]) tree(g, x, 610, 44, R);
      if (tear < 1) { g.save(); if (tear > 0) { g.translate(3400 + 120, 300 + tear * tear * 520); g.rotate(tear * 1.4); g.translate(-3400 - 120, -300); g.globalAlpha = 1 - ss(seg(tear, .7, 1)); } flag(g, 3400, 640, 340, 'company', t); g.restore(); }
      if (tear > 0) { const pole = P2(q => q.rect(3396, 300, 8, 340)); paint(g, pole, WOOD, WOOD_D, 3, 1.8); finial(g, 3400, 300, 1); }
      if (t > T.rise2) { g.save(); const lower = (1 - eo(rise)) * 230; flag(g, 3400, 640, 340, 'union', t, { lower }); g.restore(); }
      waves(g, -400, 720, 4800, 1500, t);
      ship(g, 900 + 190 * (t - T.sea), 860, .62, t, null, { awning: true });
    } };
}

// ---------------------------------------------------------------- the end: the crown alone on its plaque, one band of light
function shotPlq(t) {
  const rk = seg(t, T.rake, T.rake + 2.6);
  return { c: { x: 960, y: 540, z: lerp(1, 1.035, seg(t, T.plq, T.end)), r: 0 }, dim: lerp(1, .7, ss(seg(t, T.rake, T.rake + 1))), night: .15,
    draw(g) {
      ultraGround(g, -200, -200, 2320, 1480, .5);
      const R = mulberry(81); whiteTriads(g, R, 60, 60, 1860, 1020, 50, 2.4, .5);
      for (let i = 0; i < 12; i++) { const x = 100 + R() * 1720, y = 90 + R() * 880; if (Math.abs(x - 960) < 420 && y < 860) continue; goldStar(g, x, y, 12 + R() * 10, { rot: R() }); }
      cushion(g, 960, 600, 360, 80, VERM, VERM_D);
      crown(g, 960, 548, 3.1, {});
      plaque(g, 960, 760, 780, 150, seg(t, T.plq + 1.2, T.plq + 1.8), seg(t, T.plq + 1.8, T.plq + 2.8), seg(t, T.plq + 2.8, T.plq + 3.4));
      border(g, 0, 0, 1920, 1080, ss(seg(t, T.plq, T.plq + 1.6)));
    },
    lights: rk > 0 && rk < 1 ? [{ type: 'b', x: lerp(560, 1400, rk), y: 400, nx: .94, ny: -.34, w: 130, a: 1.25 * Math.sin(Math.PI * rk) }] : [], amb: .05 * ss(seg(t, T.rake + 1, T.end)) };
}

// ---------------------------------------------------------------- shots
function shotAt(t) {
  if (t < T.court) return shotOpen(t);
  if (t < T.river) return shotCourt(t);
  if (t < T.meerut) return shotRiver(t);
  if (t < T.ride) return shotMeerut(t);
  if (t < T.touch) return shotRide(t);
  if (t < T.siege) return shotTouch(t);
  if (t < T.tomb) return shotSiege(t);
  if (t < T.cush) return shotTomb(t);
  if (t < T.sea) return shotCush(t);
  if (t < T.plq) return shotSea(t);
  return shotPlq(t);
}

// ---------------------------------------------------------------- sound cues (window.EV)
function buildEvents() {
  const ev = [], E = (t, type, o = {}) => ev.push({ t: +t.toFixed(3), type, ...o });
  E(.5, 'brush'); E(3.0, 'title'); E(T.court, 'cut'); E(T.court + .4, 'quill'); E(T.river, 'cut'); E(15.7, 'toss'); E(16.9, 'coin');
  E(T.meerut, 'cut_night'); E(T.rise, 'muskets'); E(T.push4, 'push'); E(T.ride, 'gallop'); E(T.wipe5 + .5, 'wipe');
  E(T.touch, 'torch'); E(T.TOUCH, 'touch'); E(T.cutw, 'cut_wide');
  E(T.siege, 'cut'); FIRE().forEach(f => E(f, 'cannon')); E(T.breach, 'crack'); E(T.breach + .8, 'collapse');
  E(T.tomb, 'cut_tomb'); E(T.tomb + .6, 'offer'); E(T.cush, 'cut_still'); E(T.cush + .5, 'bell_far');
  E(T.sea, 'cut_sea'); E(T.tear, 'tear'); E(T.rise2, 'flag_rise');
  E(T.plq, 'border'); E(T.plq + 1.8, 'write'); E(T.rake + .6, 'rake_bell'); E(T.end - 1.5, 'fade');
  SUBS.forEach((s, i) => E(s[0], 'sub', { i }));
  return ev.sort((a, b) => a.t - b.t);
}

(async () => {
  await Promise.all(['64px Uncial', '40px Fell', 'italic 34px FellI'].map(f => document.fonts.load(f, 'a')));
  GOLDC = makeGold(); GOLDF = makeGoldFine(512, 3, 1); GOLDFF = makeGoldFine(1024, 9, 1.6); SPKC = makeSpk(); GRAINC = makeGrain(); PAINTC = makePaint();
  FR = cnv(W, H); FRg = FR.getContext('2d'); OCC = cnv(W, H); OCCg = OCC.getContext('2d', { willReadFrequently: true }); MC = cnv(W, H); MCg = MC.getContext('2d', { willReadFrequently: true });
  window.DUR = DUR; window.render = render; window.EV = buildEvents(); window.SUBS = SUBS; window.T = T;
  window.TEXTS = t => { render(t); return TX.map(o => ({ ...o })); };
  render(Q.get('t') ? +Q.get('t') : 36.5); window.READY = true;
})();
