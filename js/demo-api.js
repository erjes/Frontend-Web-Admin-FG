/*
 * demo-api.js — "server palsu" untuk demo statis NexoraProperty.
 *
 * Kenapa ada: aplikasi aslinya memanggil FastAPI/server.py lewat /api/*.
 * Demo ini harus jalan tanpa backend (GitHub Pages), jadi satu-satunya seam
 * jaringan — window.fetch — diganti router in-memory yang memakai bentuk
 * respons identik dengan backend sungguhan. UI tidak diubah sama sekali,
 * sehingga yang dilihat client adalah aplikasi yang sesungguhnya.
 *
 * Kaidah yang ditiru dari backend:
 *  - RBAC: peran tanpa izin menerima 403 dengan { error } yang tampil di UI.
 *  - SoD: pengusul rencana tidak boleh menyetujui rencananya sendiri.
 *  - Immutability: rencana yang sudah disetujui terkunci; perubahan = versi baru.
 *  - Audit append-only: setiap mutasi menambah entri jejak audit.
 *  - Integritas bukti: setiap kuitansi wajib membawa hash SHA-256 64 hex.
 *
 * Status demo: seluruh data sintetis dan disimpan di localStorage.
 */
(function () {
  "use strict";

  const STORE_KEY = "nxdemo.state.v1";
  const realFetch = window.fetch ? window.fetch.bind(window) : null;
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const nowISO = () => new Date().toISOString();
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const rupiah = (n) => "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID");
  const id = (p) => p + "-" + Math.random().toString(16).slice(2, 10);
  const sum = (arr, f) => arr.reduce((a, x) => a + (Number(f(x)) || 0), 0);

  /* Server hanya memvalidasi bentuk hash; perhitungan dilakukan klien (js/sha256.js). */
  const isSha256 = (h) => typeof h === "string" && /^[0-9a-f]{64}$/i.test(h);

  /* ---------------------------------------------------------------- state */

  function freshState() {
    const seed = clone(window.DEMO_SEED || {});
    seed.expenses = (seed.expenses || []).map((e) => Object.assign({ verified_by: null, verified_by_name: null, verification_notes: null, rejection_reason: null }, e));
    seed.activities = (seed.activities || []).map((a) => Object.assign({ approval_logs: [] }, a));
    return seed;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.activities && parsed.users) return parsed;
      }
    } catch (_) { /* rusak → seed ulang */ }
    return freshState();
  }

  let state = loadState();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  /* -------------------------------------------------------------- helpers */

  const users = () => state.users || [];
  const userById = (uid) => users().find((u) => u.id === uid) || null;
  const matrix = () => state.role_matrix || {};
  const permits = (role) => matrix()[role] || {};
  const can = (role, flag) => Boolean(permits(role)[flag]);

  function tokenFor(uid) { return "demo." + uid + "." + Math.random().toString(16).slice(2, 8); }
  function userIdFromToken(tok) {
    if (!tok) return null;
    const clean = String(tok).replace(/^Bearer\s+/i, "").trim();
    const parts = clean.split(".");
    return parts[0] === "demo" && parts[1] ? parts[1] : null;
  }

  let sessionUserId = null;
  function currentUser(headers) {
    const auth = headers && (headers.Authorization || headers.authorization);
    const fromHeader = userIdFromToken(auth);
    const uid = fromHeader || sessionUserId;
    return uid ? userById(uid) : null;
  }

  const ok = (body, status) => ({ status: status || 200, body });
  const fail = (status, message) => ({ status, body: { error: message } });

  function requireUser(headers) {
    const u = currentUser(headers);
    if (!u) return { error: fail(401, "Autentikasi diperlukan. Silakan masuk kembali.") };
    return { user: u };
  }

  function audit(user, entityType, entityId, action, details) {
    state.audit_logs = state.audit_logs || [];
    state.audit_logs.unshift({
      id: id("aud"),
      actor_id: user ? user.id : null,
      actor_name: user ? user.full_name : "Sistem",
      actor_role: user ? user.role : "SYSTEM",
      entity_type: entityType,
      entity_id: entityId,
      action,
      details: details || {},
      created_at: nowISO(),
    });
  }

  /* --------------------------------------------------------- domain queries */

  const isLoDisbursement = (d) =>
    (d.items || []).some((it) => isLoItem(it));

  function isLoItem(item) {
    const bi = (state.budget_items || []).find((b) => b.id === item.budget_item_id);
    return (bi && bi.category === "LO_OPERATIONAL") || /panjar/i.test(item.budget_item_name || "");
  }

  function loPartsOf(d) {
    return (d.items || []).filter(isLoItem);
  }

  function expensesOf(activityId) {
    return (state.expenses || []).filter((e) => !activityId || e.activity_id === activityId);
  }

  function advancesOf(activityId) {
    const out = [];
    (state.disbursements || []).forEach((d) => {
      if (activityId && d.activity_id !== activityId) return;
      if (!["TRANSFERRED", "PAID", "SETTLED"].includes(d.status)) return;
      loPartsOf(d).forEach((it) => out.push({ disbursement: d, item: it }));
    });
    return out;
  }

  /** Mesin validasi L1/L2/L3 — ditampilkan sebagai alasan per item. */
  function validateExpense(exp) {
    const flags = [];
    const act = (state.activities || []).find((a) => a.id === exp.activity_id);
    const item = (state.budget_items || []).find((b) => b.id === exp.budget_item_id);

    if (act && exp.transaction_date) {
      if (exp.transaction_date < act.start_date || exp.transaction_date > act.end_date) {
        flags.push({ code: "L2_DATE_WINDOW", label: "Tanggal transaksi di luar rentang kegiatan", severity: "warning" });
      }
    }
    if (item && Number(exp.amount) > Number(item.total_price)) {
      flags.push({ code: "L1_OVER_BUDGET", label: "Nominal melampaui pagu pos anggaran (" + rupiah(item.total_price) + ")", severity: "danger" });
    }
    const dupNo = (state.expenses || []).filter((e) => e.id !== exp.id && exp.receipt_number && e.receipt_number === exp.receipt_number);
    if (dupNo.length) {
      flags.push({ code: "L3_DUPLICATE_RECEIPT", label: "Nomor kuitansi sudah dipakai " + dupNo[0].expense_code, severity: "danger" });
    }
    const dupHash = (state.expenses || []).filter((e) => e.id !== exp.id && exp.receipt_hash && e.receipt_hash === exp.receipt_hash);
    if (dupHash.length) {
      flags.push({ code: "L3_DUPLICATE_HASH", label: "Hash berkas identik dengan " + dupHash[0].expense_code, severity: "danger" });
    }
    if (!exp.receipt_hash || !/^[0-9a-f]{64}$/i.test(exp.receipt_hash)) {
      flags.push({ code: "L3_NO_HASH", label: "Bukti belum berstempel SHA-256", severity: "danger" });
    }
    return flags;
  }

  const expenseWithFlags = (e) => Object.assign({}, e, { flags: validateExpense(e), has_flags: validateExpense(e).length > 0 });

  function dashboardMetrics() {
    const acts = state.activities || [];
    const dsb = state.disbursements || [];
    const totalPagu = sum(acts, (a) => a.total_budget);
    const transferred = dsb.filter((d) => ["TRANSFERRED", "PAID", "SETTLED"].includes(d.status));

    const payroll = sum(transferred.filter((d) => !isLoDisbursement(d)), (d) => d.total_amount);
    const loAdvance = sum(
      transferred.filter(isLoDisbursement),
      (d) => sum(loPartsOf(d), (it) => it.amount)
    );
    const realized = sum((state.expenses || []).filter((e) => e.status !== "REJECTED"), (e) => e.amount);
    const cashOnHand = Math.max(loAdvance - realized, 0);

    return {
      total_pagu_allocated: totalPagu,
      direct_payroll_disbursed: payroll,
      lo_advance_active: loAdvance,
      lo_cash_on_hand: cashOnHand,
      lo_expenses_realized: realized,
      unsettled_advances_count: advancesOf(null).filter((a) => a.item.status !== "SETTLED").length,
      realization_percentage: totalPagu ? Math.round((realized / totalPagu) * 10000) / 100 : 0,
      remaining_treasury_cash: totalPagu - payroll - loAdvance,
      active_users_count: users().length,
      immutable_audit_events: (state.audit_logs || []).length,
    };
  }

  function cashbook(activityId) {
    const adv = advancesOf(activityId || null);
    const exps = expensesOf(activityId || null);
    const advance = sum(adv, (a) => a.item.amount);
    const submitted = sum(exps.filter((e) => ["SUBMITTED", "VERIFIED"].includes(e.status)), (e) => e.amount);
    const verified = sum(exps.filter((e) => e.status === "VERIFIED"), (e) => e.amount);
    const rejected = sum(exps.filter((e) => e.status === "REJECTED"), (e) => e.amount);

    const ledger = [];
    adv.forEach((a) => ledger.push({
      id: a.item.id,
      entry_type: "ADVANCE_INFLOW",
      direction: "IN",
      date: a.disbursement.transfer_date || a.disbursement.created_at.slice(0, 10),
      timestamp: a.disbursement.created_at,
      code: a.disbursement.disbursement_code,
      title: "Pencairan panjar: " + a.item.budget_item_name,
      vendor_name: a.disbursement.created_by_name,
      amount: a.item.amount,
      status: a.item.status,
    }));
    exps.forEach((e) => ledger.push({
      id: e.id,
      entry_type: "EXPENSE_OUTFLOW",
      direction: "OUT",
      date: e.transaction_date,
      timestamp: e.created_at || e.transaction_date,
      code: e.expense_code,
      title: e.description,
      vendor_name: e.vendor_name,
      amount: e.amount,
      status: e.status,
    }));
    ledger.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

    const act = activityId ? (state.activities || []).find((a) => a.id === activityId) : null;
    const overdue = act && act.end_date < todayISO() && advance - verified > 0;

    return {
      activity: act ? { id: act.id, code: act.code, title: act.title, start_date: act.start_date, end_date: act.end_date } : null,
      lo_user: userById("usr-lo-01"),
      total_advance_received: advance,
      total_expenses_submitted: submitted,
      total_expenses_verified: verified,
      total_expenses_rejected: rejected,
      remaining_cash_on_hand: advance - submitted,
      outstanding_settlement_balance: advance - verified,
      ledger,
      advances_count: adv.length,
      expenses_count: exps.length,
      has_overdue_unsettled_advances: Boolean(overdue),
      overdue_warnings: overdue ? [{ activity_code: act.code, outstanding: advance - verified }] : [],
    };
  }

  function settlementPreview(itemId) {
    const item = (state.disbursement_items || []).find((i) => i.id === itemId)
      || (state.disbursements || []).flatMap((d) => d.items || []).find((i) => i.id === itemId);
    if (!item) return null;
    const disbursement = (state.disbursements || []).find((d) => (d.items || []).some((i) => i.id === itemId));
    const exps = (state.expenses || []).filter((e) => e.disbursement_item_id === itemId);
    const verified = sum(exps.filter((e) => e.status === "VERIFIED"), (e) => e.amount);
    const pending = exps.filter((e) => e.status === "SUBMITTED");
    return {
      disbursement_item_id: itemId,
      activity_id: disbursement ? disbursement.activity_id : null,
      advance_amount: item.amount,
      verified_expense_amount: verified,
      pending_expense_amount: sum(pending, (e) => e.amount),
      unreviewed_count: pending.length,
      remaining_cash_to_return: item.amount - verified,
      current_status: item.status,
      returned_amount: item.returned_amount || 0,
      can_settle: pending.length === 0 && item.status !== "SETTLED",
      expenses: exps.map(expenseWithFlags),
    };
  }

  function accountabilityReport(activityId) {
    const act = (state.activities || []).find((a) => a.id === activityId);
    if (!act) return null;
    const items = (state.budget_items || []).filter((b) => b.activity_id === activityId);
    const dsb = (state.disbursements || []).filter((d) => d.activity_id === activityId);
    const exps = expensesOf(activityId).map(expenseWithFlags);

    const breakdown = items.map((b) => {
      const payroll = sum(
        dsb.filter((d) => ["TRANSFERRED", "PAID"].includes(d.status)),
        (d) => sum((d.items || []).filter((i) => i.budget_item_id === b.id), (i) => i.amount)
      );
      const realized = sum(exps.filter((e) => e.status === "VERIFIED" && e.budget_item_id === b.id), (e) => e.amount);
      const totalRealized = payroll + realized;
      return {
        budget_item_id: b.id,
        item_name: b.item_name,
        category: b.category_label || b.category,
        quantity: b.quantity,
        unit: b.unit,
        unit_price: b.unit_price,
        budget_pagu: b.total_price,
        realized_payroll: payroll,
        realized_expenses: realized,
        total_realized: totalRealized,
        variance: b.total_price - totalRealized,
        realization_percentage: b.total_price ? Math.round((totalRealized / b.total_price) * 10000) / 100 : 0,
      };
    });

    const totalPayroll = sum(breakdown, (b) => b.realized_payroll);
    const totalExpenses = sum(breakdown, (b) => b.realized_expenses);
    const totalRealized = totalPayroll + totalExpenses;
    const flagged = exps.filter((e) => e.has_flags);

    return {
      activity: { id: act.id, code: act.code, title: act.title, status: act.status, version: act.version },
      financial_summary: {
        total_budget: act.total_budget,
        total_realized_payroll: totalPayroll,
        total_realized_expenses: totalExpenses,
        total_realized: totalRealized,
        realization_percentage: act.total_budget ? Math.round((totalRealized / act.total_budget) * 10000) / 100 : 0,
        remaining_budget: act.total_budget - totalRealized,
      },
      validation_summary: { flagged_expenses_count: flagged.length, flagged_expenses: flagged.map((e) => e.expense_code) },
      budget_breakdown: breakdown,
      payroll_items: dsb.flatMap((d) => (d.items || []).map((i) => Object.assign({ disbursement_code: d.disbursement_code, status: d.status, transfer_date: d.transfer_date }, i))),
      expenses: exps,
      settlement: cashbook(act.id),
      audit_trail: (state.audit_logs || []).filter((l) => l.entity_id === act.id || (l.details && l.details.activity_id === act.id)).slice(0, 20),
    };
  }

  function drillDown(entityType, entityId) {
    const t = String(entityType).toUpperCase();
    function buildTimeline(eid, extraCodes) {
      const match = (l) =>
        l.entity_id === eid ||
        (extraCodes && extraCodes.includes(l.entity_id)) ||
        (l.details && (l.details.code === eid || l.details.activity_id === eid || (extraCodes && extraCodes.includes(l.details.code))));
      return (state.audit_logs || [])
        .filter(match)
        .map((l) => ({
          action: l.action,
          timestamp: l.created_at,
          actor: l.actor_name || "Sistem",
          role: l.actor_role || "-",
          details: l.details || {},
        }));
    }

    if (t === "EXPENSE") {
      const e = (state.expenses || []).find((x) => x.id === entityId || x.expense_code === entityId);
      if (!e) return null;
      const tl = buildTimeline(e.id, [e.expense_code]);
      return { entity_type: "EXPENSE", entity_id: e.id, title: e.vendor_name + " · " + e.expense_code, amount: e.amount, proof_hash: e.receipt_hash, data: expenseWithFlags(e), timeline: tl, approval_history: tl };
    }
    if (t === "DISBURSEMENT_ITEM") {
      const d = (state.disbursements || []).find((x) => (x.items || []).some((i) => i.id === entityId));
      const i = d && d.items.find((x) => x.id === entityId);
      if (!i) return null;
      const tl = buildTimeline(i.id, [d.id, d.disbursement_code]);
      return { entity_type: "DISBURSEMENT_ITEM", entity_id: i.id, title: i.beneficiary_name + " · " + d.disbursement_code, amount: i.amount, proof_hash: d.transfer_receipt_hash || null, data: Object.assign({ disbursement_code: d.disbursement_code, transfer_date: d.transfer_date }, i), timeline: tl, approval_history: tl };
    }
    const a = (state.activities || []).find((x) => x.id === entityId || x.code === entityId);
    if (!a) return null;
    const tl = buildTimeline(a.id, [a.code]);
    return { entity_type: "ACTIVITY", entity_id: a.id, title: a.code + " · " + a.title, amount: a.total_budget, proof_hash: null, data: a, timeline: tl, approval_history: a.approval_logs || [] };
  }

  /* ------------------------------------------------------------------- CSV */

  function csvFor(activityId) {
    const rep = accountabilityReport(activityId);
    if (!rep) return { csv_data: "", filename: "kosong.csv" };
    const rows = [["Kode Kegiatan", "Uraian Pos", "Pagu", "Realisasi Payroll", "Realisasi Kuitansi", "Total Realisasi", "Selisih"]];
    rep.budget_breakdown.forEach((b) => rows.push([rep.activity.code, b.item_name, b.budget_pagu, b.realized_payroll, b.realized_expenses, b.total_realized, b.variance]));
    rows.push([]);
    rows.push(["Total", "", rep.financial_summary.total_budget, rep.financial_summary.total_realized_payroll, rep.financial_summary.total_realized_expenses, rep.financial_summary.total_realized, rep.financial_summary.remaining_budget]);
    const csv = rows.map((r) => r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"').join(";")).join("\r\n");
    return { csv_data: "\uFEFF" + csv, filename: "LPJ-" + rep.activity.code + ".csv" };
  }

  function htmlFor(activityId) {
    const rep = accountabilityReport(activityId);
    if (!rep) return { html_content: "<p>Kegiatan tidak ditemukan.</p>" };
    const rows = rep.budget_breakdown.map((b) => `<tr><td>${b.item_name}</td><td style="text-align:right">${rupiah(b.budget_pagu)}</td><td style="text-align:right">${rupiah(b.realized_payroll)}</td><td style="text-align:right">${rupiah(b.realized_expenses)}</td><td style="text-align:right">${rupiah(b.variance)}</td></tr>`).join("");
    return {
      html_content: `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><title>LPJ ${rep.activity.code}</title>
<style>body{font-family:Inter,system-ui,sans-serif;color:#0f172a;padding:40px;max-width:900px;margin:0 auto}h1{font-size:20px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border-bottom:1px solid #e2e8f0;padding:8px;text-align:left}th{background:#f2f7ff}</style></head>
<body><h1>Laporan Pertanggungjawaban ${rep.activity.code}</h1><p>${rep.activity.title}</p>
<p>Pagu ${rupiah(rep.financial_summary.total_budget)} · Realisasi ${rupiah(rep.financial_summary.total_realized)} (${rep.financial_summary.realization_percentage}%)</p>
<table><thead><tr><th>Pos Anggaran</th><th>Pagu</th><th>Payroll</th><th>Kuitansi</th><th>Selisih</th></tr></thead><tbody>${rows}</tbody></table>
<p style="margin-top:24px;font-size:11px;color:#64748b">Dokumen demo — data sintetis. Dihasilkan ${new Date().toLocaleString("id-ID")}.</p></body></html>`,
    };
  }

  /* ---------------------------------------------------------------- router */

  function parseBody(init) {
    try { return init && init.body ? JSON.parse(init.body) : {}; } catch (_) { return {}; }
  }

  function route(method, rawPath, init, headers) {
    const qIndex = rawPath.indexOf("?");
    const path = qIndex >= 0 ? rawPath.slice(0, qIndex) : rawPath;
    const query = new URLSearchParams(qIndex >= 0 ? rawPath.slice(qIndex + 1) : "");
    const body = parseBody(init);
    const seg = path.replace(/^.*\/api\//, "/api/").split("/").filter(Boolean); // ['api', ...]
    const p = seg.slice(1); // buang 'api'
    const M = method.toUpperCase();

    /* ---- auth ---- */
    if (M === "POST" && p[0] === "auth" && p[1] === "login") {
      const email = String(body.email || "").toLowerCase().trim();
      const u = users().find((x) => x.email.toLowerCase() === email);
      if (!u || body.password !== "password123") {
        return fail(401, "Kredensial tidak valid. Periksa kembali email atau kata sandi.");
      }
      sessionUserId = u.id;
      audit(u, "AUTH", u.id, "USER_LOGIN", { email: u.email, role: u.role });
      save();
      return ok({ access_token: tokenFor(u.id), token_type: "bearer", user: u });
    }
    if (M === "GET" && p[0] === "auth" && p[1] === "demo-accounts") {
      return ok({ accounts: users(), demo_accounts: users(), default_password_hint: "password123" });
    }
    if (M === "GET" && p[0] === "auth" && p[1] === "me") {
      const r = requireUser(headers); if (r.error) return r.error;
      return ok({ user: r.user });
    }
    if (M === "GET" && p[0] === "users") {
      const r = requireUser(headers); if (r.error) return r.error;
      return ok({ users: users(), role_matrix: matrix() });
    }

    /* ---- butuh sesi untuk sisanya ---- */
    const r = requireUser(headers);
    if (r.error) return r.error;
    const user = r.user;

    if (M === "GET" && p[0] === "health") return ok({ status: "ok", mode: "demo" });

    if (M === "GET" && p[0] === "dashboard" && p[1] === "summary") {
      return ok({ active_user: user, metrics: dashboardMetrics(), principles: [
        "Rencana disetujui bersifat immutable; perubahan wajib lewat amendment berversi.",
        "Setiap bukti kuitansi wajib berstempel hash SHA-256 sebelum direkonsiliasi.",
        "Pemisahan tugas: pengusul tidak boleh menyetujui rencananya sendiri.",
      ] });
    }

    /* ---- activities ---- */
    if (p[0] === "activities") {
      if (M === "GET" && p.length === 1) {
        const list = (state.activities || []).map((a) => Object.assign({}, a, {
          budget_items: (state.budget_items || []).filter((b) => b.activity_id === a.id),
          approval_logs: a.approval_logs || [],
        }));
        return ok({ activities: list, categories: state.categories || {} });
      }
      const actId = p[1];
      const act = (state.activities || []).find((a) => a.id === actId || a.code === actId);

      if (M === "POST" && p.length === 1) {
        if (!can(user.role, "can_create_plan")) return fail(403, "Peran " + user.role + " tidak memiliki kewenangan membuat Rencana Kegiatan & RAB (khusus PJ).");
        const seq = String((state.activities || []).length).padStart(3, "0");
        const newAct = {
          id: id("act"), code: body.code || "ACT-2026-" + seq,
          title: body.title, description: body.description || "",
          start_date: body.start_date, end_date: body.end_date,
          total_budget: 0, status: "DRAFT", version: 1, is_locked: false,
          created_by: user.id, created_by_name: user.full_name,
          assigned_lo_id: body.assigned_lo_id || "usr-lo-01", assigned_lo_name: "M. Farhan Pratama",
          approval_logs: [], created_at: nowISO(), updated_at: nowISO(),
        };
        state.activities.unshift(newAct);
        replaceBudgetItems(newAct.id, body.budget_items || []);
        audit(user, "ACTIVITY", newAct.id, "CREATE_ACTIVITY", { code: newAct.code, title: newAct.title });
        save();
        return ok({ activity: withBudget(newAct) }, 201);
      }
      if (!act) return fail(404, "Kegiatan tidak ditemukan.");

      if (M === "GET" && p.length === 2) return ok({ activity: withBudget(act) });
      if (M === "GET" && p[2] === "cashbook") return ok({ cashbook: cashbook(act.id) });
      if (M === "GET" && p[2] === "accountability-report") return ok({ report: accountabilityReport(act.id) });
      if (M === "GET" && p[2] === "export-csv") return ok(csvFor(act.id));
      if (M === "GET" && p[2] === "export-html") return ok(htmlFor(act.id));

      if (M === "POST" && p[2] === "evidences") {
        if (!can(user.role, "can_upload_field_receipt") && user.role !== "LO") return fail(403, "Peran " + user.role + " tidak memiliki izin mencatat bukti lapangan.");
        const fileHash = body.file_hash || body.receipt_hash;
        if (!isSha256(fileHash)) return fail(422, "Bukti wajib memiliki hash SHA-256 (64 karakter heksadesimal) yang dihitung dari isi berkas.");
        const ev = {
          id: id("ev"), activity_id: act.id, expense_id: body.expense_id || null,
          file_name: body.file_name || "bukti.jpg", file_type: body.file_type || "image/jpeg",
          file_hash: fileHash,
          latitude: body.latitude || null, longitude: body.longitude || null,
          uploaded_by: user.id, uploaded_by_name: user.full_name, created_at: nowISO(),
        };
        state.evidences = state.evidences || [];
        state.evidences.unshift(ev);
        audit(user, "ACTIVITY", act.id, "UPLOAD_EVIDENCE", { file_name: ev.file_name, hash: ev.file_hash });
        save();
        return ok({ evidence: ev }, 201);
      }

      if (M === "PUT" && p.length === 2) {
        if (act.status === "APPROVED" || act.is_locked) return fail(409, "Rencana yang sudah disetujui terkunci. Gunakan amendment berversi untuk mengubahnya.");
        if (!can(user.role, "can_create_plan") && user.id !== act.created_by) return fail(403, "Hanya pengusul yang dapat menyunting rencana ini.");
        Object.assign(act, { title: body.title || act.title, description: body.description || act.description, start_date: body.start_date || act.start_date, end_date: body.end_date || act.end_date, updated_at: nowISO() });
        if (Array.isArray(body.budget_items)) replaceBudgetItems(act.id, body.budget_items);
        audit(user, "ACTIVITY", act.id, "UPDATE_ACTIVITY", { code: act.code });
        save();
        return ok({ activity: withBudget(act) });
      }

      if (M === "POST" && p[2] === "amend") {
        if (!can(user.role, "can_amend_plan")) return fail(403, "Peran " + user.role + " tidak berwenang mengajukan amendemen (khusus PJ).");
        act.version = Number(act.version || 1) + 1;
        act.status = "REVISION_REQUIRED";
        act.is_locked = false;
        act.updated_at = nowISO();
        act.approval_logs = act.approval_logs || [];
        act.approval_logs.push({ id: id("apl"), activity_id: act.id, actor_id: user.id, actor_name: user.full_name, actor_role: user.role, action: "AMEND", notes: body.reason || "Amendemen rencana", version: act.version, created_at: nowISO() });
        if (Array.isArray(body.budget_items)) replaceBudgetItems(act.id, body.budget_items);
        audit(user, "ACTIVITY", act.id, "AMEND_ACTIVITY", { code: act.code, version: act.version, reason: body.reason || "" });
        save();
        return ok({ activity: withBudget(act) });
      }

      if (M === "POST" && p[2] === "submit") {
        if (!can(user.role, "can_submit_plan") && user.role !== "ADMIN") return fail(403, "Peran " + user.role + " tidak berwenang mengirim rencana.");
        if (!["DRAFT", "REVISION_REQUIRED"].includes(act.status)) return fail(409, "Rencana berstatus " + act.status + " tidak dapat dikirim ulang.");
        act.status = "SUBMITTED"; act.is_locked = true; act.updated_at = nowISO();
        act.approval_logs = act.approval_logs || [];
        act.approval_logs.push({ id: id("apl"), activity_id: act.id, actor_id: user.id, actor_name: user.full_name, actor_role: user.role, action: "SUBMIT", notes: "Diajukan untuk telaah", version: act.version, created_at: nowISO() });
        audit(user, "ACTIVITY", act.id, "SUBMIT_ACTIVITY", { code: act.code });
        save();
        return ok({ activity: withBudget(act) });
      }

      if (M === "POST" && p[2] === "review") {
        if (!can(user.role, "can_approve_plan")) return fail(403, "Peran " + user.role + " tidak memiliki kewenangan menelaah (khusus SV).");
        if (act.created_by === user.id) return fail(403, "Pemisahan tugas dilanggar: pengusul tidak boleh menyetujui rencananya sendiri.");
        const decision = String(body.decision || "").toUpperCase();
        const approve = decision.startsWith("APPROVE");
        act.status = approve ? "APPROVED" : "REVISION_REQUIRED";
        act.is_locked = approve;
        act.updated_at = nowISO();
        act.approval_logs = act.approval_logs || [];
        act.approval_logs.push({ id: id("apl"), activity_id: act.id, actor_id: user.id, actor_name: user.full_name, actor_role: user.role, action: approve ? "APPROVE" : "REQUEST_REVISION", notes: body.notes || "", version: act.version, created_at: nowISO() });
        audit(user, "ACTIVITY", act.id, approve ? "APPROVE_ACTIVITY" : "REQUEST_REVISION", { code: act.code, notes: body.notes || "" });
        save();
        return ok({ activity: withBudget(act) });
      }
    }

    /* ---- bank accounts ---- */
    if (p[0] === "bank-accounts") {
      if (M === "GET") return ok({ bank_accounts: state.bank_accounts || [] });
      if (M === "POST") {
        if (!["FINANCE", "ADMIN"].includes(user.role)) return fail(403, "Hanya Bendahara atau Admin yang dapat mendaftarkan rekening.");
        const acc = { id: id("ba"), beneficiary_name: body.beneficiary_name, bank_name: body.bank_name, account_number: body.account_number, tax_id_npwp: body.tax_id_npwp || null, user_id: body.user_id || null, created_at: nowISO() };
        state.bank_accounts = state.bank_accounts || [];
        state.bank_accounts.unshift(acc);
        audit(user, "BANK_ACCOUNT", acc.id, "CREATE_BANK_ACCOUNT", { beneficiary: acc.beneficiary_name });
        save();
        return ok({ bank_account: acc }, 201);
      }
    }

    /* ---- disbursements ---- */
    if (p[0] === "disbursements") {
      if (M === "GET" && p.length === 1) return ok({ disbursements: state.disbursements || [] });
      if (M === "GET" && p[2] === "export-csv") {
        const d = (state.disbursements || []).find((x) => x.id === p[1]);
        if (!d) return fail(404, "Batch pencairan tidak ditemukan.");
        const rows = [["Kode", "Penerima", "Bank", "Rekening", "Nominal"]];
        (d.items || []).forEach((i) => rows.push([d.disbursement_code, i.beneficiary_name, i.bank_name, i.account_number, i.amount]));
        return ok({ csv_data: "\uFEFF" + rows.map((r) => r.map((c) => '"' + String(c == null ? "" : c) + '"').join(";")).join("\r\n"), filename: d.disbursement_code + ".csv" });
      }
      if (M === "POST" && p.length === 1) {
        if (!can(user.role, "can_disburse_funds")) return fail(403, "Peran " + user.role + " tidak memiliki wewenang pencairan dana (khusus Finance).");
        const act = (state.activities || []).find((a) => a.id === body.activity_id || a.code === body.activity_id);
        if (!act) return fail(404, "Kegiatan tidak ditemukan.");
        if (act.status !== "APPROVED") return fail(409, "Pencairan hanya untuk rencana yang sudah disetujui.");
        const items = (body.items || []).map((it) => {
          const bi = (state.budget_items || []).find((b) => b.id === it.budget_item_id) || {};
          return Object.assign({ id: id("dsbi"), disbursement_id: null, budget_item_name: bi.item_name || it.budget_item_name || "-", status: "PENDING" }, it);
        });
        const total = sum(items, (i) => i.amount);
        const cap = sum((state.budget_items || []).filter((b) => b.activity_id === act.id), (b) => b.total_price);
        if (total > cap) return fail(422, "Nominal pencairan " + rupiah(total) + " melampaui pagu kegiatan " + rupiah(cap) + ".");
        const seq = String((state.disbursements || []).length + 1).padStart(3, "0");
        const d = {
          id: id("dsb"), activity_id: act.id, activity_code: act.code, activity_title: act.title,
          activity_total_budget: act.total_budget, disbursement_code: "DSB-2026-" + seq,
          title: body.title || "Pencairan " + act.code, total_amount: total,
          status: "READY", transfer_date: null, created_by: user.id, created_by_name: user.full_name,
          approved_by: null, approved_by_name: null, items, items_count: items.length,
          created_at: nowISO(), updated_at: nowISO(),
        };
        items.forEach((i) => (i.disbursement_id = d.id));
        state.disbursements = state.disbursements || [];
        state.disbursements.unshift(d);
        audit(user, "DISBURSEMENT", d.id, "CREATE_DISBURSEMENT", { code: d.disbursement_code, amount: total });
        save();
        return ok({ disbursement: d }, 201);
      }
      if (M === "POST" && p[2] === "execute") {
        if (!can(user.role, "can_disburse_funds")) return fail(403, "Peran " + user.role + " tidak memiliki wewenang pencairan dana.");
        const d = (state.disbursements || []).find((x) => x.id === p[1]);
        if (!d) return fail(404, "Batch pencairan tidak ditemukan.");
        if (d.status !== "READY") return fail(409, "Batch berstatus " + d.status + " tidak dapat dieksekusi.");
        d.status = "TRANSFERRED";
        d.transfer_date = body.transfer_date || todayISO();
        d.transfer_reference_no = body.transfer_reference_no || null;
        d.transfer_receipt_hash = body.transfer_receipt_hash || "c0ffee" + Math.random().toString(16).slice(2).padEnd(58, "0");
        (d.items || []).forEach((i) => (i.status = "TRANSFERRED"));
        d.updated_at = nowISO();
        audit(user, "DISBURSEMENT", d.id, "EXECUTE_DISBURSEMENT", { code: d.disbursement_code, amount: d.total_amount });
        save();
        return ok({ disbursement: d });
      }
    }

    if (p[0] === "disbursement-items") {
      if (M === "GET" && p[2] === "settlement-preview") {
        const prev = settlementPreview(p[1]);
        if (!prev) return fail(404, "Item panjar tidak ditemukan.");
        return ok(prev);
      }
      if (M === "POST" && p[2] === "settle") {
        if (!can(user.role, "can_disburse_funds")) return fail(403, "Hanya Bendahara yang dapat menutup panjar.");
        const d = (state.disbursements || []).find((x) => (x.items || []).some((i) => i.id === p[1]));
        const item = d && d.items.find((i) => i.id === p[1]);
        if (!item) return fail(404, "Item panjar tidak ditemukan.");
        const pending = (state.expenses || []).filter((e) => e.disbursement_item_id === item.id && e.status === "SUBMITTED");
        if (pending.length) return fail(409, "Masih ada " + pending.length + " kuitansi belum diverifikasi.");
        item.status = "SETTLED";
        item.returned_amount = Number(body.returned_amount || 0);
        item.settled_at = nowISO();
        item.settlement_notes = body.settlement_notes || body.notes || null;
        audit(user, "DISBURSEMENT_ITEM", item.id, "SETTLE_ADVANCE", { returned_amount: item.returned_amount });
        save();
        return ok({ disbursement_item: item, preview: settlementPreview(item.id) });
      }
    }

    /* ---- expenses ---- */
    if (p[0] === "expenses") {
      if (M === "GET" && p.length === 1) {
        let list = expensesOf(query.get("activity_id") || null);
        const st = query.get("status");
        if (st) list = list.filter((e) => e.status === st);
        return ok({ expenses: list.map(expenseWithFlags) });
      }
      if (M === "POST" && p.length === 1) {
        if (!can(user.role, "can_upload_field_receipt") && user.role !== "LO") return fail(403, "Peran " + user.role + " tidak memiliki izin mencatat pengeluaran lapangan (khusus LO).");
        const act = (state.activities || []).find((a) => a.id === body.activity_id || a.code === body.activity_id);
        if (!act) return fail(404, "Kegiatan tidak ditemukan.");
        const hash = body.receipt_hash || body.file_hash;
        if (!isSha256(hash)) return fail(422, "Kuitansi wajib memiliki hash SHA-256 (64 karakter heksadesimal) yang dihitung dari isi berkas.");
        const seq = String((state.expenses || []).length + 1).padStart(3, "0");
        const exp = {
          id: id("exp"), activity_id: act.id, activity_code: act.code, activity_title: act.title,
          disbursement_item_id: body.disbursement_item_id || "dsbi-lo-01",
          budget_item_id: body.budget_item_id || null, budget_item_name: body.budget_item_name || "-",
          budget_category: body.budget_category || "LO_OPERATIONAL",
          user_id: user.id, user_name: user.full_name,
          expense_code: "EXP-2026-" + seq, vendor_name: body.vendor_name,
          description: body.description || "", amount: Number(body.amount) || 0,
          transaction_date: body.transaction_date || todayISO(),
          receipt_number: body.receipt_number || null, receipt_hash: hash,
          latitude: body.latitude || null, longitude: body.longitude || null,
          status: "SUBMITTED", verification_status: "PENDING",
          verified_by: null, verified_by_name: null, created_at: nowISO(),
        };
        state.expenses = state.expenses || [];
        state.expenses.unshift(exp);
        audit(user, "EXPENSE", exp.id, "SUBMIT_EXPENSE", { code: exp.expense_code, amount: exp.amount, hash: exp.receipt_hash });
        save();
        return ok({ expense: expenseWithFlags(exp) }, 201);
      }
      if (M === "POST" && p[2] === "verify") {
        if (!["SV", "FINANCE", "ADMIN"].includes(user.role)) return fail(403, "Peran " + user.role + " tidak memiliki izin verifikasi kuitansi (SV / Finance).");
        const e = (state.expenses || []).find((x) => x.id === p[1] || x.expense_code === p[1]);
        if (!e) return fail(404, "Kuitansi tidak ditemukan.");
        const decision = String(body.decision || body.status || "").toUpperCase();
        const approve = decision.indexOf("APPROVE") === 0 || decision === "VERIFIED";
        e.status = approve ? "VERIFIED" : "REJECTED";
        e.verification_status = approve ? "VERIFIED" : "REJECTED";
        e.verified_by = user.id;
        e.verified_by_name = user.full_name;
        e.verification_notes = body.notes || null;
        e.rejection_reason = approve ? null : (body.reason || body.notes || "Tidak memenuhi syarat");
        audit(user, "EXPENSE", e.id, approve ? "VERIFY_EXPENSE" : "REJECT_EXPENSE", { code: e.expense_code, notes: body.notes || "" });
        save();
        return ok({ expense: expenseWithFlags(e) });
      }
    }

    /* ---- cashbook ---- */
    if (M === "GET" && p[0] === "lo" && p[1] === "cashbook") {
      const actId = query.get("activity_id");
      if (user.role === "LO") return ok({ cashbook: cashbook(actId) });
      return ok({ cashbook: cashbook(actId) });
    }

    /* ---- audit ---- */
    if (M === "GET" && p[0] === "audit-logs") {
      if (!can(user.role, "can_view_audit_trail")) return fail(403, "Peran " + user.role + " tidak memiliki akses ke Audit Trail.");
      return ok({ audit_logs: state.audit_logs || [] });
    }
    if (M === "GET" && p[0] === "drill-down") {
      if (!can(user.role, "can_view_audit_trail")) {
        return fail(403, "Peran '" + user.role + "' tidak memiliki izin mengakses drill-down audit.");
      }
      const dd = drillDown(p[1], decodeURIComponent(p[2] || ""));
      if (!dd) return fail(404, "Entitas bukti tidak ditemukan.");
      return ok({ drill_down: dd, ...dd });
    }

    return fail(404, "Endpoint demo tidak tersedia: " + method + " " + path);
  }

  /* -------------------------------------------------- model kecil helpers */

  function replaceBudgetItems(activityId, items) {
    state.budget_items = (state.budget_items || []).filter((b) => b.activity_id !== activityId);
    const act = (state.activities || []).find((a) => a.id === activityId);
    (items || []).forEach((it, idx) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.unit_price) || 0;
      const cat = it.category || "CONSUMPTION";
      state.budget_items.push({
        id: it.id || id("rab-" + (idx + 1)),
        activity_id: activityId,
        category: cat,
        category_label: (state.categories || {})[cat] || cat,
        item_name: it.item_name || "Pos anggaran",
        quantity: qty, unit: it.unit || "Paket", unit_price: price, total_price: qty * price,
      });
    });
    if (act) {
      act.total_budget = sum(items || [], (it) => (Number(it.quantity) || 0) * (Number(it.unit_price) || 0));
      act.updated_at = nowISO();
    }
  }

  function withBudget(act) {
    return Object.assign({}, act, {
      budget_items: (state.budget_items || []).filter((b) => b.activity_id === act.id),
      approval_logs: act.approval_logs || [],
    });
  }

  /* ------------------------------------------------------- fetch intercept */

  function toResponse(result) {
    const payload = JSON.stringify(result.body === undefined ? {} : result.body);
    return new Response(payload, {
      status: result.status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : (input && input.url) || "";
    if (url.indexOf("/api/") === -1) {
      return realFetch ? realFetch(input, init) : Promise.reject(new Error("fetch tidak tersedia"));
    }
    const method = (init && init.method) || (input && input.method) || "GET";
    const headers = {};
    if (init && init.headers) {
      if (typeof init.headers.forEach === "function" && !Array.isArray(init.headers)) {
        init.headers.forEach((v, k) => (headers[k] = v));
      } else {
        Object.keys(init.headers).forEach((k) => (headers[k] = init.headers[k]));
      }
    }
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    let result;
    try {
      result = route(method, path, init || {}, headers);
    } catch (e) {
      result = { status: 500, body: { error: "Kesalahan demo: " + e.message } };
    }
    return Promise.resolve(toResponse(result));
  };

  /* -------------------------------------------------------------- kendali */

  window.DemoApi = {
    reset() {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem("gov_token");
      sessionUserId = null;
      state = freshState();
      save();
      location.reload();
    },
    inspect() { return state; },
    version: "1.0.0",
  };

  save();
  console.info("[demo] server palsu aktif — %d kegiatan, %d kuitansi, %d entri audit",
    (state.activities || []).length, (state.expenses || []).length, (state.audit_logs || []).length);
})();
