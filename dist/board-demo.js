'use strict';
/* Interactive planning-board example for the homepage.
   Sample data only: four machines, four orders, one working week.
   Drag a job (or focus it and use the arrow keys) to see which later jobs are
   pushed back and which orders would run late, then apply or cancel the change. */
(() => {
  const host = document.querySelector('[data-board-demo]');
  const section = document.getElementById('board-demo');
  if (!host || !section) return;

  const SLOTS_PER_DAY = 8;            // 08:00–16:00
  const DAYS = 6;                     // Mon–Fri plus the following Monday
  const HORIZON = SLOTS_PER_DAY * DAYS;

  const MACHINES = [
    { id: 'NC-01', type: 'turning' },
    { id: 'NC-02', type: 'turning' },
    { id: 'MC-01', type: 'milling' },
    { id: 'QC-01', type: 'inspection' },
  ];
  // Planned maintenance, per machine index: [start, end)
  const MAINTENANCE = { 1: [[16, 20]] };

  const ORDERS = {
    A: { id: 'DR-024', due: 24 },
    B: { id: 'FL-108', due: 24 },
    C: { id: 'SH-311', due: 32 },
    D: { id: 'HB-207', due: 40 },
  };

  // key, order, step index, type, machine index, start, duration (in hours)
  const INITIAL = [
    ['A1', 'A', 0, 'turning', 0, 0, 6], ['A2', 'A', 1, 'milling', 2, 6, 8], ['A3', 'A', 2, 'inspection', 3, 14, 3],
    ['B1', 'B', 0, 'turning', 1, 0, 5], ['B2', 'B', 1, 'milling', 2, 14, 6], ['B3', 'B', 2, 'inspection', 3, 20, 3],
    ['C1', 'C', 0, 'turning', 0, 6, 8], ['C2', 'C', 1, 'milling', 2, 20, 6], ['C3', 'C', 2, 'inspection', 3, 26, 3],
    ['D1', 'D', 0, 'turning', 1, 5, 7], ['D2', 'D', 1, 'milling', 2, 26, 8], ['D3', 'D', 2, 'inspection', 3, 34, 3],
  ].map(([key, order, seq, type, m, start, dur]) => ({ key, order, seq, type, m, start, dur }));

  const TEXT = {
    en: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Mon'], nextWeek: 'next week', machine: 'Machine',
      type: { turning: 'Turning', milling: 'Milling', inspection: 'Inspection' },
      part: { A: 'Diffuser ring', B: 'Flange', C: 'Shaft', D: 'Hub' },
      maintenance: 'Maintenance',
      due: (d) => `Due ${d}`, finishes: (t) => `Finishes ${t}`,
      onTime: 'On time', late: (h) => `${h} h late`,
      idle: 'Every order is on time.',
      idleLate: (list) => `Running late: <strong>${list}</strong>.`,
      preview: (n) => `<b>Preview.</b> ${n === 1 ? '1 other job moves' : `${n} other jobs move`} later.`,
      previewNone: '<b>Preview.</b> No other jobs are affected.',
      previewLate: (list) => ` <strong>${list}</strong> would miss ${list.includes(',') ? 'their deadlines' : 'its deadline'}.`,
      previewOk: ' Every order still finishes on time.',
      noFit: 'That move doesn’t fit in this week.',
      apply: 'Apply change', cancel: 'Cancel', undo: 'Undo', reset: 'Reset',
      foot: 'Sample data. Working day 08:00–16:00. Drag a job, or select it and use the arrow keys.',
      opLabel: (o, s, m, t) => `${o}, ${s}, on ${m}, starts ${t}. Use arrow keys to move.`,
      board: 'Example production plan',
    },
    ja: {
      days: ['月', '火', '水', '木', '金', '月'], nextWeek: '翌週', machine: '設備',
      type: { turning: '旋削', milling: 'フライス', inspection: '検査' },
      part: { A: 'ディフューザーリング', B: 'フランジ', C: 'シャフト', D: 'ハブ' },
      maintenance: 'メンテナンス',
      due: (d) => `納期 ${d}`, finishes: (t) => `完了 ${t}`,
      onTime: '納期内', late: (h) => `${h}時間遅れ`,
      idle: 'すべての受注が納期内です。',
      idleLate: (list) => `遅れている受注：<strong>${list}</strong>`,
      preview: (n) => `<b>プレビュー。</b>ほかに${n}件の工程が後ろにずれます。`,
      previewNone: '<b>プレビュー。</b>ほかの工程への影響はありません。',
      previewLate: (list) => `<strong>${list}</strong> が納期に間に合わなくなります。`,
      previewOk: 'すべての受注は納期内です。',
      noFit: 'この週には収まりません。',
      apply: '変更を適用', cancel: 'キャンセル', undo: '元に戻す', reset: 'リセット',
      foot: 'サンプルデータ。稼働時間 8:00〜16:00。工程をドラッグするか、選択して矢印キーで動かせます。',
      opLabel: (o, s, m, t) => `${o}、${s}、${m}、開始 ${t}。矢印キーで移動できます。`,
      board: '生産計画のサンプル',
    },
  };

  let lang = document.documentElement.lang === 'ja' ? 'ja' : 'en';
  const t = () => TEXT[lang];

  const clone = (ops) => ops.map((o) => ({ ...o }));
  let committed = clone(INITIAL);
  let pending = null;      // { ops, key, invalid }
  const history = [];

  /* ---------- scheduling ---------- */
  const end = (o) => o.start + o.dur;
  const clearOfMaintenance = (m, start, dur) => {
    let s = start;
    for (const [a, b] of MAINTENANCE[m] || []) if (s < b && s + dur > a) s = b;
    return s;
  };
  const compatible = (op) => MACHINES.map((mc, i) => (mc.type === op.type ? i : -1)).filter((i) => i >= 0);

  // Push-right rescheduling: the moved job keeps its slot; anything it collides with,
  // and anything that then no longer fits or follows it in an order, moves later.
  function resolve(ops, pinKey) {
    const pin = ops.find((o) => o.key === pinKey);
    for (const o of ops) {
      if (o !== pin && o.m === pin.m && o.start < end(pin) && end(o) > pin.start) o.start = end(pin);
    }
    for (let guard = 0; guard < 100; guard++) {
      let changed = false;
      for (const order of Object.keys(ORDERS)) {
        const steps = ops.filter((o) => o.order === order).sort((a, b) => a.seq - b.seq);
        for (let i = 1; i < steps.length; i++) {
          if (steps[i].start < end(steps[i - 1])) { steps[i].start = end(steps[i - 1]); changed = true; }
        }
      }
      MACHINES.forEach((_, m) => {
        const list = ops.filter((o) => o.m === m)
          .sort((a, b) => a.start - b.start || (b === pin) - (a === pin) || a.key.localeCompare(b.key));
        let cursor = 0;
        for (const o of list) {
          const s = clearOfMaintenance(m, Math.max(o.start, cursor), o.dur);
          if (s !== o.start) { o.start = s; changed = true; }
          cursor = end(o);
        }
      });
      if (!changed) break;
    }
    return ops;
  }

  function propose(key, start, m) {
    const ops = clone(committed);
    const op = ops.find((o) => o.key === key);
    const prev = ops.find((o) => o.order === op.order && o.seq === op.seq - 1);
    if (compatible(op).includes(m)) op.m = m;
    op.start = clearOfMaintenance(op.m, Math.max(0, prev ? end(prev) : 0, Math.round(start)), op.dur);
    resolve(ops, key);
    const same = ops.every((o, i) => o.start === committed[i].start && o.m === committed[i].m);
    if (same) { pending = null; return; }
    if (ops.some((o) => end(o) > HORIZON)) { pending = { ...(pending || { ops: clone(committed), key }), invalid: true }; return; }
    pending = { ops, key, invalid: false };
  }

  /* ---------- formatting ---------- */
  const clock = (h) => `${h}:00`;
  const startTime = (s) => `${t().days[Math.floor(s / SLOTS_PER_DAY)]} ${clock(8 + (s % SLOTS_PER_DAY))}`;
  const endTime = (e) => (e % SLOTS_PER_DAY === 0
    ? `${t().days[e / SLOTS_PER_DAY - 1]} ${clock(16)}`
    : `${t().days[Math.floor(e / SLOTS_PER_DAY)]} ${clock(8 + (e % SLOTS_PER_DAY))}`);
  const finish = (ops, order) => Math.max(...ops.filter((o) => o.order === order).map(end));
  const lateOrders = (ops) => Object.keys(ORDERS).filter((k) => finish(ops, k) > ORDERS[k].due);

  /* ---------- DOM ---------- */
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const pct = (slots) => `${(slots / HORIZON) * 100}%`;
  const rowTop = (m) => `calc(var(--bd-row) * ${m} + 8px)`;

  const board = el('div', 'bd-board'); board.setAttribute('role', 'group');
  const scroll = el('div', 'bd-scroll'); const grid = el('div', 'bd-grid');
  const labels = el('div', 'bd-labels'); const right = el('div');
  const headLabel = el('div', 'bd-head'); const days = el('div', 'bd-head bd-days');
  const lanes = el('div', 'bd-lanes');
  labels.append(headLabel);
  const machineEls = MACHINES.map((mc) => { const n = el('div', 'bd-machine'); labels.append(n); lanes.append(el('div', 'bd-lane')); return n; });
  lanes.append(el('div', 'bd-daylines'), el('div', 'bd-next'));
  const maintEls = [];
  Object.entries(MAINTENANCE).forEach(([m, spans]) => spans.forEach(([a, b]) => {
    const n = el('div', 'bd-maint'); n.style.left = pct(a); n.style.width = pct(b - a); n.style.top = rowTop(+m);
    lanes.append(n); maintEls.push(n);
  }));
  const ghosts = new Map(); const opEls = new Map();
  INITIAL.forEach((o) => {
    const g = el('div', 'bd-ghost'); g.dataset.order = o.order; g.hidden = true; lanes.append(g); ghosts.set(o.key, g);
  });
  INITIAL.forEach((o) => {
    const b = el('button', 'bd-op', '<b></b><i></i>'); b.type = 'button'; b.dataset.order = o.order; b.dataset.key = o.key;
    lanes.append(b); opEls.set(o.key, b);
  });
  right.append(days, lanes); grid.append(labels, right); scroll.append(grid); board.append(scroll);

  const side = el('div', 'bd-side');
  const status = el('p', 'bd-status'); status.setAttribute('aria-live', 'polite');
  const actions = el('div', 'bd-actions');
  const mkBtn = (cls) => { const b = el('button', `bd-btn ${cls}`); b.type = 'button'; actions.append(b); return b; };
  const applyBtn = mkBtn('bd-btn-primary'), cancelBtn = mkBtn(''), undoBtn = mkBtn(''), resetBtn = mkBtn('');
  const orderList = el('ul', 'bd-orders');
  const orderEls = Object.keys(ORDERS).map((k) => {
    const li = el('li', '', '<span class="bd-chip"></span><b></b><span class="bd-pill"></span><small></small>');
    li.dataset.order = k; orderList.append(li); return li;
  });
  const foot = el('p', 'bd-foot');
  side.append(status, actions, orderList, foot);
  host.append(board, side);

  let dragKey = null;

  function render() {
    const L = t();
    const ops = pending && !pending.invalid ? pending.ops : (pending ? pending.ops : committed);
    board.setAttribute('aria-label', L.board);
    headLabel.textContent = L.machine;
    days.innerHTML = L.days.map((d, i) => `<span>${d}${i === DAYS - 1 ? `<small>${L.nextWeek}</small>` : ''}</span>`).join('');
    machineEls.forEach((n, i) => { n.innerHTML = `<strong>${MACHINES[i].id}</strong><span>${L.type[MACHINES[i].type]}</span>`; });
    maintEls.forEach((n) => { n.textContent = L.maintenance; });

    ops.forEach((o, i) => {
      const was = committed[i]; const moved = o.start !== was.start || o.m !== was.m;
      const b = opEls.get(o.key); const g = ghosts.get(o.key);
      b.style.left = pct(o.start); b.style.width = pct(o.dur); b.style.top = rowTop(o.m);
      b.classList.toggle('is-moved', moved); b.classList.toggle('is-narrow', o.dur <= 3); b.classList.toggle('is-dragging', dragKey === o.key);
      b.firstChild.textContent = ORDERS[o.order].id; b.lastChild.textContent = L.type[o.type];
      b.setAttribute('aria-label', L.opLabel(ORDERS[o.order].id, L.type[o.type], MACHINES[o.m].id, startTime(o.start)));
      g.hidden = !moved;
      if (moved) { g.style.left = pct(was.start); g.style.width = pct(was.dur); g.style.top = rowTop(was.m); }
    });

    const late = lateOrders(ops); const names = (list) => list.map((k) => ORDERS[k].id).join(', ');
    let html;
    if (pending && pending.invalid) html = L.noFit;
    else if (pending) {
      const others = ops.filter((o, i) => o.key !== pending.key && (o.start !== committed[i].start || o.m !== committed[i].m)).length;
      html = (others ? L.preview(others) : L.previewNone) + (late.length ? L.previewLate(names(late)) : L.previewOk);
    } else html = late.length ? L.idleLate(names(late)) : L.idle;
    status.innerHTML = html; status.classList.toggle('is-late', late.length > 0 || !!(pending && pending.invalid));

    const showPreview = !!pending && !pending.invalid;
    applyBtn.textContent = L.apply; cancelBtn.textContent = L.cancel; undoBtn.textContent = L.undo; resetBtn.textContent = L.reset;
    applyBtn.hidden = cancelBtn.hidden = !showPreview;
    undoBtn.hidden = resetBtn.hidden = showPreview;
    undoBtn.disabled = history.length === 0;
    resetBtn.disabled = history.length === 0;

    orderEls.forEach((li) => {
      const k = li.dataset.order; const f = finish(ops, k); const over = f - ORDERS[k].due;
      li.querySelector('b').innerHTML = `${ORDERS[k].id} <span>${L.part[k]}</span>`;
      li.querySelector('small').textContent = `${L.due(L.days[ORDERS[k].due / SLOTS_PER_DAY - 1])} · ${L.finishes(endTime(f))}`;
      const pill = li.querySelector('.bd-pill'); pill.textContent = over > 0 ? L.late(over) : L.onTime; pill.classList.toggle('is-late', over > 0);
      li.classList.toggle('is-changed', f !== finish(committed, k));
    });
    foot.textContent = L.foot;
  }

  /* ---------- interaction ---------- */
  const current = (key) => (pending && pending.key === key && !pending.invalid ? pending.ops : committed).find((o) => o.key === key);

  lanes.addEventListener('pointerdown', (ev) => {
    const b = ev.target.closest('.bd-op'); if (!b || ev.button > 0) return;
    const key = b.dataset.key; const base = committed.find((o) => o.key === key);
    const rect = lanes.getBoundingClientRect(); const slotW = rect.width / HORIZON;
    const rowH = rect.height / MACHINES.length; const x0 = ev.clientX; let moved = false;
    b.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) < 4 && Math.abs(e.clientY - ev.clientY) < 4) return;
      moved = true; dragKey = key;
      const row = Math.min(MACHINES.length - 1, Math.max(0, Math.floor((e.clientY - rect.top) / rowH)));
      propose(key, base.start + dx / slotW, compatible(base).includes(row) ? row : base.m);
      render();
    };
    const up = () => {
      b.removeEventListener('pointermove', move); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up);
      dragKey = null; if (pending && pending.invalid) pending = null; render();
    };
    b.addEventListener('pointermove', move); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
  });

  lanes.addEventListener('keydown', (ev) => {
    const b = ev.target.closest('.bd-op'); if (!b) return;
    const key = b.dataset.key; const op = current(key); const rows = compatible(op);
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') propose(key, op.start + (ev.key === 'ArrowRight' ? 1 : -1), op.m);
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      const next = rows[rows.indexOf(op.m) + (ev.key === 'ArrowDown' ? 1 : -1)];
      if (next == null) return; propose(key, op.start, next);
    } else if (ev.key === 'Enter' && pending && !pending.invalid) { ev.preventDefault(); apply(); return; }
    else if (ev.key === 'Escape' && pending) { pending = null; render(); return; }
    else return;
    ev.preventDefault();
    if (pending && pending.invalid) { render(); pending = null; return; }
    render();
  });

  function apply() {
    if (!pending || pending.invalid) return;
    history.push(committed); committed = pending.ops; pending = null; render();
  }
  applyBtn.addEventListener('click', () => { apply(); undoBtn.focus(); });
  cancelBtn.addEventListener('click', () => { pending = null; render(); });
  undoBtn.addEventListener('click', () => { if (history.length) { committed = history.pop(); pending = null; render(); } });
  resetBtn.addEventListener('click', () => { committed = clone(INITIAL); history.length = 0; pending = null; render(); });

  window.addEventListener('soma:language', (ev) => { lang = ev.detail === 'ja' ? 'ja' : 'en'; render(); });

  section.hidden = false;
  render();
})();
