'use strict';
// Frame pipeline: world layer (+ gold mask) → light only on gold (per leaf square) → flashes → vignette → speech scroll.
// Adapted from the Lemo-Opuscar Gilded Illumination engine (MIT).

let FR, FRg, MC, MCg, OCC, OCCg, OCCd = null;
function resetCtx(g) { if (g.reset) g.reset(); g.__gp = g.__sp = g.__paint = g.__gf = g.__gff = null; }

function lightAt(lights, x, y) {
  let v = 0; for (const L of lights) {
    if (L.type === 'r') { const d = Math.hypot(x - L.x, y - L.y) / L.r; if (d < 1) v += L.a * Math.pow(1 - d, 1.4); }
    else if (L.type === 'b') { const d = ((x - L.x) * L.nx + (y - L.y) * L.ny) / L.w; v += L.a * Math.exp(-d * d); }
    else if (L.type === 'o') { const d = (Math.hypot(x - L.x, y - L.y) - L.rad) / L.w; v += L.a * Math.exp(-d * d); }
  } return v;
}
const SCR_LS = .6;
let GW, GWg, GWD, GWI;
function glintPass(M, lights, amb) {
  if (!lights.length && amb <= 0) { if (GWD) GWD.fill(0); return; }
  const md = MCg.getImageData(0, 0, W, H).data, img = ctx.getImageData(0, 0, W, H), fd = img.data;
  if (!GW) { GW = cnv(W / 4, H / 4); GWg = GW.getContext('2d'); GWD = new Float32Array(W / 4 * H / 4); GWI = GWg.createImageData(W / 4, H / 4); }
  GWD.fill(0); const QW = W / 4;
  const inv = M.inverse(), ia = inv.a, ib = inv.b, ic = inv.c, id = inv.d, ie = inv.e, iff = inv.f;
  const Ls = lights.map(L => ({ ...L, r2: L.r ? L.r * L.r : 0 }));
  let ci = 1e9, cj = 1e9, nx = 1, ny = 0, th = 0, fam = 0, tone = 0, ox = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = (y * W + x) * 4, A = md[p + 3]; if (A < 6) continue;
      const wx = ia * x + ic * y + ie, wy = ib * x + id * y + iff;
      const j = Math.floor(wy / LS), ro = rowOff(j), i = Math.floor((wx + ro) / LS);
      if (i !== ci || j !== cj) { ci = i; cj = j; ox = ro; th = leafTilt(i, j); nx = Math.cos(th); ny = Math.sin(th); const fa = .5 + .5 * Math.cos(th - .9); fam = fa * fa * fa * fa; tone = leafTone(i, j); }
      const lu = (wx + ox) / LS - i - .5, lv = wy / LS - j - .5, cup = 1 + .55 * (lu * nx + lv * ny);
      let R = amb * (.55 + .55 * fam);
      for (let k = 0; k < Ls.length; k++) { const L = Ls[k];
        if (L.type === 'r') { const dx = wx - L.x, dy = wy - L.y, d2 = dx * dx + dy * dy; if (d2 >= L.r2) continue; const d = Math.sqrt(d2), v = L.a * Math.pow(1 - d / L.r, 1.4);
          let f = .5 + .5 * (dx * nx + dy * ny) / (d + 1e-3); f *= f; R += v * (.5 + .75 * f); }
        else if (L.type === 'b') { const dd = ((wx - L.x) * L.nx + (wy - L.y) * L.ny) / L.w; if (dd > 3 || dd < -3) continue; const v = L.a * Math.exp(-dd * dd);
          let f = .5 + .5 * Math.cos(dd * 1.9 + th); f *= f; R += v * (.45 + .8 * f); }
        else { const dx = wx - L.x, dy = wy - L.y, dd = (Math.sqrt(dx * dx + dy * dy) - L.rad) / L.w; if (dd > 3 || dd < -3) continue; const v = L.a * Math.exp(-dd * dd);
          let f = .5 + .5 * Math.cos(dd * 2.2 + th); f *= f; R += v * (.5 + .8 * f); }
      }
      if (R < .004) continue;
      const k = A / 255 * Math.min(R * cup, 2.2) * (.9 + .2 * tone);
      if (k > .6) GWD[(y >> 2) * QW + (x >> 2)] += (k - .6);
      const f = .82 * (1 - Math.exp(-1.15 * k)), r0 = fd[p], g0 = fd[p + 1], b0 = fd[p + 2];
      fd[p] = Math.min(255, r0 * (1 + .5 * k) + (250 - r0) * f); fd[p + 1] = Math.min(232, g0 * (1 + .45 * k) + (204 - g0) * f); fd[p + 2] = Math.min(150, b0 * (1 + .2 * k) + (96 - b0) * f);
    }
  }
  ctx.putImageData(img, 0, 0);
}
function glowPass(gain) {
  if (!GWD) return; const n = GWD.length, d = GWI.data;
  for (let i = 0; i < n; i++) { const v = Math.min(1, GWD[i] / 16 * gain); d[i * 4] = 255; d[i * 4 + 1] = 196; d[i * 4 + 2] = 110; d[i * 4 + 3] = 255 * v * v; }
  GWg.putImageData(GWI, 0, 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'blur(10px)'; ctx.globalAlpha = .5; ctx.drawImage(GW, 0, 0, W, H);
  ctx.filter = 'blur(36px)'; ctx.globalAlpha = .45; ctx.drawImage(GW, 0, 0, W, H);
  ctx.restore();
}
function hidden(M, x, y) { if (!OCCd) return false; const q = new DOMPoint(x, y).matrixTransform(M), X = Math.round(q.x), Y = Math.round(q.y); if (X < 0 || Y < 0 || X >= W || Y >= H) return false; return OCCd[(Y * W + X) * 4 + 3] > 100; }
function flashes(M, lights) {
  ctx.setTransform(M); ctx.globalCompositeOperation = 'lighter'; const z = Math.hypot(M.a, M.b);
  for (const p of GP) {
    const v = lightAt(lights, p.x, p.y) * p.k; if (v < .55 || hidden(M, p.x, p.y)) continue; const a = clamp((v - .55) * 1.4), r = Math.min(p.r * (.4 + .45 * a), 160 / z);
    const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * .5); rg.addColorStop(0, `rgba(255,246,215,${.4 * a})`); rg.addColorStop(1, 'rgba(255,232,160,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(p.x, p.y, r * .5, 0, TAU); ctx.fill();
    ctx.fillStyle = `rgba(255,250,232,${.8 * a})`;
    for (const an of [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]) { const rr = an % (Math.PI / 2) ? r * .45 : r; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(an + .2); ctx.beginPath(); ctx.moveTo(-rr, 0); ctx.quadraticCurveTo(0, -rr * .06, rr, 0); ctx.quadraticCurveTo(0, rr * .06, -rr, 0); ctx.fill(); ctx.restore(); }
  }
  ctx.globalCompositeOperation = 'source-over';
}

// ---------------------------------------------------------------- the speech scroll: fixed at bottom centre, one width for the film
function subAt(t) {
  let cur = null, idx = -1; SUBS.forEach((s, i) => { if (t >= s[0] - .25 && t < s[1] + .35) { cur = s; idx = i; } });
  if (!cur) return null;
  const prev = SUBS[idx - 1], next = SUBS[idx + 1];
  const joinedIn = prev && cur[0] - prev[1] < .9, joinedOut = next && next[0] - cur[1] < .9;
  const open = (joinedIn ? 1 : eo(seg(t, cur[0] - .25, cur[0] + .1))) * (joinedOut ? 1 : 1 - ss(seg(t, cur[1] + .05, cur[1] + .35)));
  return { s: cur, open, prev: joinedIn ? prev : null };
}
let BANDW = 0;
const SUBFONT = 'italic 34px FellI';
function bandWidth(g) { if (!BANDW) { g.font = SUBFONT; SUBS.forEach(s => { BANDW = Math.max(BANDW, g.measureText(s[2]).width); }); } return BANDW; }
function drawBanderole(g, t) {
  const A = subAt(t); if (!A || A.open <= 0) return;
  const s = A.s, open = A.open;
  g.setTransform(1, 0, 0, 1, 0, 0); setZoom(1);
  const cx = W / 2, cy = 984, hw = (bandWidth(g) / 2 + 60) * open, h = 76;
  for (const sd of [-1, 1]) { const ex = cx + sd * hw; const tail = P2(q => { q.moveTo(ex - sd * 6, cy - h / 2 + 16); q.lineTo(ex + sd * 56, cy - h / 2 + 26); q.lineTo(ex + sd * 34, cy + 3); q.lineTo(ex + sd * 62, cy + h / 2 + 16); q.lineTo(ex - sd * 6, cy + h / 2 - 5); q.closePath(); });
    g.fillStyle = '#d8c69c'; g.fill(tail); rimShade(g, tail, '#a8926a', 7); g.strokeStyle = INK; g.lineWidth = 3; g.lineJoin = 'round'; g.stroke(tail);
    const fold = P2(q => { q.moveTo(ex - sd * 3, cy + h / 2 - 5); q.lineTo(ex - sd * 3, cy + h / 2 + 11); q.lineTo(ex + sd * 22, cy + h / 2 + 2); q.closePath(); }); g.fillStyle = '#8a7552'; g.fill(fold); g.lineWidth = 2; g.stroke(fold); }
  const band = P2(q => { q.moveTo(cx - hw, cy - h / 2); q.bezierCurveTo(cx - hw * .4, cy - h / 2 - 8, cx + hw * .4, cy - h / 2 + 7, cx + hw, cy - h / 2); q.lineTo(cx + hw, cy + h / 2);
    q.bezierCurveTo(cx + hw * .4, cy + h / 2 + 7, cx - hw * .4, cy + h / 2 - 8, cx - hw, cy + h / 2); q.closePath(); });
  g.fillStyle = VELL; g.fill(band); g.save(); g.clip(band); g.globalAlpha = .5; g.fillStyle = g.__sp || (g.__sp = g.createPattern(SPKC, 'repeat')); g.fillRect(cx - hw, cy - h, hw * 2, h * 2); g.restore();
  rimShade(g, band, '#c9b386', 8); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(band);
  g.strokeStyle = 'rgba(255,252,238,.75)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - hw + 12, cy - h / 2 + 6); g.lineTo(cx + hw - 12, cy - h / 2 + 5); g.stroke();
  const write = (S, wipe, alpha) => { g.save(); g.globalAlpha = alpha * clamp((open - .2) / .3); g.clip(band); g.beginPath(); g.rect(cx - hw, 0, hw * 2 * wipe, H); g.clip();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = SUBFONT; g.fillStyle = '#4a2c16'; g.fillText(S[2], cx, cy + 2); g.restore();
    if (wipe >= 1) { g.font = SUBFONT; const w2 = g.measureText(S[2]).width; TX.push({ id: 'sub' + S[0], text: S[2], x0: cx - w2 / 2, y0: cy - 20, x1: cx + w2 / 2, y1: cy + 22 }); } };
  if (A.prev && t < s[0]) write(A.prev, 1, 1 - ss(seg(t, s[0] - .25, s[0] - .02)));
  if (t >= s[0]) write(s, eo(seg(t, s[0], s[0] + .5)), 1);
}

// ---------------------------------------------------------------- one frame
function render(tf) {
  tf = clamp(tf, 0, DUR - 1e-4); TX = []; GP = [];
  const S = shotAt(tf);
  resetCtx(FRg); MCg.setTransform(1, 0, 0, 1, 0, 0); MCg.clearRect(0, 0, W, H);
  MK = { g: MCg, pre: new DOMMatrix(), col: '#fff' };
  const M = camMatrix(S.c); setZoom(S.c.z); FRg.setTransform(M); DIM = S.dim ?? 1;
  FRg.fillStyle = ULTRA_D; FRg.fillRect(-1e5, -1e5, 2e5, 2e5);
  S.draw(FRg);
  OCCd = null;
  if (S.overlay) { OCCg.setTransform(1, 0, 0, 1, 0, 0); OCCg.clearRect(0, 0, W, H); FRg.setTransform(1, 0, 0, 1, 0, 0); setZoom(1); S.overlay(FRg, OCCg); setZoom(S.c.z);
    OCCd = OCCg.getImageData(0, 0, W, H).data; }
  FRg.setTransform(1, 0, 0, 1, 0, 0); FRg.save(); FRg.globalCompositeOperation = 'multiply'; FRg.globalAlpha = .14; FRg.fillStyle = FRg.createPattern(GRAINC, 'repeat'); FRg.fillRect(0, 0, W, H); FRg.restore();
  MK = null;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.drawImage(FR, 0, 0);
  if (S.night > 0) { ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = S.night; ctx.fillStyle = 'rgb(150,158,206)'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  const lamps = S.lamps || [];
  ctx.setTransform(M); ctx.globalCompositeOperation = 'screen';
  for (const L of lamps) { const rr = L[2] || 380, a = L[3] ?? 1; const rg = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], rr); rg.addColorStop(0, `rgba(255,190,110,${.3 * a})`); rg.addColorStop(.4, `rgba(220,150,80,${.11 * a})`); rg.addColorStop(1, 'rgba(200,140,80,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(L[0], L[1], rr, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over'; ctx.setTransform(1, 0, 0, 1, 0, 0);
  const lights = S.lights || [];
  glintPass(M, lights, S.amb || 0);
  glowPass(.35);
  flashes(M, lights);
  ctx.setTransform(M); ctx.globalCompositeOperation = 'lighter';
  for (const L of lamps) { const a = L[3] ?? 1, rr = 70; const rg = ctx.createRadialGradient(L[0], L[1], 0, L[0], L[1], rr); rg.addColorStop(0, `rgba(255,220,150,${.45 * a})`); rg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(L[0], L[1], rr, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over'; ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (S.top) { setZoom(1); S.top(ctx); }
  const v = ctx.createRadialGradient(W * .5, H * .45, H * .42, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(${S.night > .5 ? '10,12,40,.4' : '40,20,5,.24'})`);
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  drawBanderole(ctx, tf);
}
