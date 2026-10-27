(function () {
  const state = {
    token: localStorage.getItem('gov_access_token') || null,
    user: null,
    activeModule: 'planning',
    demoAccounts: [],
    users: [],
    activities: [],
    selectedActivityId: null,
    disbursements: [],
    selectedDisbursementId: null,
    bankAccounts: [],
    auditLogs: [],
    searchQuery: '',
    modalRabItems: [],
    modalPayrollItems: [],
  };

  const escapeHtml = (str) => {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const formatRupiah = (amount) => {
    return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
  };

  const getInitials = (name) => {
    return (name || 'U')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'TRANSFERRED':
      case 'PAID':
      case 'COMPLETED':
      case 'SETTLED':
        return 'status-badge--success';
      case 'SUBMITTED':
      case 'IN_EXECUTION':
      case 'PENDING':
        return 'status-badge--scheduled';
      case 'REVISION_REQUIRED':
      case 'REJECTED':
        return 'status-badge--danger';
      default:
        return 'status-badge--warning';
    }
  };

  async function apiFetch(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }
    const response = await fetch(path, Object.assign({}, options, { headers }));
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Terjadi kesalahan pada permintaan API');
    }
    return data;
  }
  const apiRequest = apiFetch;

  async function loginWithCredentials(email, password) {
    const btn = document.getElementById('btnPrimaryCta');
    btn.setAttribute('data-state', 'loading');
    btn.textContent = '⟳ Memautentikasi...';

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      state.token = res.access_token;
      state.user = res.user;
      localStorage.setItem('gov_access_token', state.token);

      btn.setAttribute('data-state', 'success');
      btn.textContent = `✓ Aktif: ${res.user.role}`;
      setTimeout(() => {
        updatePrimaryCtaForRole(state.user);
      }, 800);

      await refreshWorkspaceData();
    } catch (err) {
      btn.setAttribute('data-state', 'error');
      btn.textContent = '⚠ Login Gagal';
      throw err;
    }
  }

  function updatePrimaryCtaForRole(user) {
    const btn = document.getElementById('btnPrimaryCta');
    btn.setAttribute('data-state', 'default');
    if (!user) return;
    const roleActions = {
      ADMIN: '+ Daftarkan Rekening',
      PJ: '+ Buat Rencana & RAB',
      SV: '✓ Telaah Pengajuan',
      FINANCE: '+ Buat Batch Payroll',
      LO: '📷 Unggah Struk Lapangan',
      AUDITOR: '⌸ Ekspor Jejak Audit',
    };
    btn.textContent = roleActions[user.role] || '+ Aksi Utama';
  }

  function switchModule(moduleName) {
    state.activeModule = moduleName;
    document.querySelectorAll('#sidebarNavList .nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.module === moduleName);
    });

    const planningSec = document.getElementById('planningSection');
    const payrollSec = document.getElementById('payrollSection');
    const directorySec = document.getElementById('directorySection');
    const loAdvanceSec = document.getElementById('loAdvanceSection');
    const reconciliationSec = document.getElementById('reconciliationSection');
    const auditSec = document.getElementById('auditSection');

    if (moduleName === 'payroll') {
      planningSec.style.display = 'none';
      payrollSec.style.display = 'block';
      directorySec.style.display = 'block';
      if (loAdvanceSec) loAdvanceSec.style.display = 'none';
      if (reconciliationSec) reconciliationSec.style.display = 'none';
      if (auditSec) auditSec.style.display = 'none';
      document.getElementById('activeBreadcrumb').textContent = 'Tata Kelola Kedinasan / Pencairan & Pencairan Dana (Ticket 04)';
      document.getElementById('pageHeading').textContent = 'Pencairan Dana & Direct Payroll Staf';
    } else if (moduleName === 'lo-advance') {
      planningSec.style.display = 'none';
      payrollSec.style.display = 'none';
      directorySec.style.display = 'none';
      if (loAdvanceSec) loAdvanceSec.style.display = 'block';
      if (reconciliationSec) reconciliationSec.style.display = 'none';
      if (auditSec) auditSec.style.display = 'none';
      document.getElementById('activeBreadcrumb').textContent = 'Tata Kelola Kedinasan / Panjar Operasional & Buku Kas LO (Ticket 05)';
      document.getElementById('pageHeading').textContent = 'Buku Kas Digital & Panjar Operasional LO';
      loadLoCashbook();
    } else if (moduleName === 'reconciliation') {
      planningSec.style.display = 'none';
      payrollSec.style.display = 'none';
      directorySec.style.display = 'none';
      if (loAdvanceSec) loAdvanceSec.style.display = 'none';
      if (reconciliationSec) reconciliationSec.style.display = 'block';
      if (auditSec) auditSec.style.display = 'none';
      document.getElementById('activeBreadcrumb').textContent = 'Tata Kelola Kedinasan / Rekonsiliasi Pengeluaran & Tutup Panjar (Ticket 07)';
      document.getElementById('pageHeading').textContent = 'Rekonsiliasi Pengeluaran Lapangan & Tutup Panjar LO (SPJ Kasir)';
      loadReconciliationView();
    } else if (moduleName === 'audit') {
      planningSec.style.display = 'none';
      payrollSec.style.display = 'none';
      directorySec.style.display = 'none';
      if (loAdvanceSec) loAdvanceSec.style.display = 'none';
      if (reconciliationSec) reconciliationSec.style.display = 'none';
      if (auditSec) auditSec.style.display = 'block';
      document.getElementById('activeBreadcrumb').textContent = 'Tata Kelola Kedinasan / Laporan Pertanggungjawaban & Jejak Audit (Ticket 08)';
      document.getElementById('pageHeading').textContent = 'Laporan Pertanggungjawaban (LPJ) & Jejak Audit';
      loadAccountabilityReport();
    } else if (moduleName === 'dashboard') {
      planningSec.style.display = 'none';
      payrollSec.style.display = 'none';
      directorySec.style.display = 'block';
      if (loAdvanceSec) loAdvanceSec.style.display = 'none';
      if (reconciliationSec) reconciliationSec.style.display = 'none';
      if (auditSec) auditSec.style.display = 'none';
      document.getElementById('activeBreadcrumb').textContent = 'Tata Kelola Kedinasan / Direktori Pejabat & Rekening Terdaftar';
      document.getElementById('pageHeading').textContent = 'Direktori Pengguna & Rekening Bank';
    } else {
      planningSec.style.display = 'block';
      payrollSec.style.display = 'none';
      directorySec.style.display = 'none';
      if (loAdvanceSec) loAdvanceSec.style.display = 'none';
      if (reconciliationSec) reconciliationSec.style.display = 'none';
      if (auditSec) auditSec.style.display = 'none';
      document.getElementById('activeBreadcrumb').textContent = 'Tata Kelola Kedinasan / Perencanaan & Approval Multi-Peran (Ticket 03)';
      document.getElementById('pageHeading').textContent = 'Perencanaan Kegiatan & Persetujuan SV';
    }
  }

  function renderSidebarAndHeader() {
    if (!state.user) return;
    document.getElementById('sidebarAvatar').textContent = getInitials(state.user.full_name);
    document.getElementById('sidebarUserName').textContent = state.user.full_name;
    document.getElementById('sidebarUserRole').textContent = `${state.user.role} · ${state.user.title}`;
    document.getElementById('activeRoleBadge').textContent = `Peran Aktif: ${state.user.role} (${state.user.role_label})`;

    const quickBar = document.getElementById('quickRoleBar');
    quickBar.innerHTML = '';
    state.demoAccounts.forEach((acc) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'role-pill' + (state.user && state.user.email === acc.email ? ' active' : '');
      pill.textContent = `${acc.role}: ${acc.full_name.split(',')[0].split('(')[0].trim()}`;
      pill.addEventListener('click', () => {
        loginWithCredentials(acc.email, 'password123');
      });
      quickBar.appendChild(pill);
    });
  }

  function renderPermissionChips() {
    const container = document.getElementById('permissionChips');
    container.innerHTML = '';
    if (!state.user || !state.user.permissions) return;

    const perms = state.user.permissions;
    const items = [
      { key: 'can_create_plan', label: 'Buat Rencana & Amendemen' },
      { key: 'can_approve_plan', label: 'Setujui Rencana (SV)' },
      { key: 'can_disburse_funds', label: 'Pencairan Gaji & Panjar' },
      { key: 'can_upload_field_receipt', label: 'Upload Kuitansi LO' },
      { key: 'can_view_audit_trail', label: 'Akses Audit Trail' },
      { key: 'can_override_approved_records', label: 'Timpa Dokumen Sah' },
    ];

    items.forEach((item) => {
      const allowed = Boolean(perms[item.key]);
      const chip = document.createElement('span');
      chip.className = 'chip-tag';
      chip.innerHTML = `
        <span class="chip-dot ${allowed ? 'chip-dot--on' : 'chip-dot--off'}"></span>
        <span>${escapeHtml(item.label)}: <strong>${allowed ? 'Ya' : 'Tidak'}</strong></span>
      `;
      container.appendChild(chip);
    });
  }

  function renderInfoPanelVersionBox() {
    const box = document.getElementById('infoPanelVersionBox');
    if (!box) return;
    const act = state.activities.find((a) => a.id === state.selectedActivityId);
    if (!act) {
      box.innerHTML = `<p class="breadcrumb">Pilih kegiatan untuk melihat riwayat versi.</p>`;
      return;
    }

    const amendLog = (act.approval_logs || []).find((l) => l.action === 'AMEND');
    let deltaHtml = '';
    if (amendLog && amendLog.snapshot) {
      const prevB = Number(amendLog.snapshot.previous_budget || 0);
      const newB = Number(amendLog.snapshot.new_total_budget || act.total_budget);
      const diff = newB - prevB;
      const sign = diff >= 0 ? '+' : '';
      deltaHtml = `
        <div class="audit-item" style="margin-top: 8px;">
          <div style="font-weight: 700; color: var(--status-warning-text);">
            Amendemen v${escapeHtml(amendLog.snapshot.previous_version)} → v${escapeHtml(amendLog.snapshot.new_version)}
          </div>
          <div class="mono-num breadcrumb" style="margin-top: 2px;">
            Pagu Lama: ${formatRupiah(prevB)}<br/>
            Pagu Baru: ${formatRupiah(newB)} (${sign}${formatRupiah(diff)})
          </div>
          <div class="breadcrumb" style="margin-top: 4px;">
            Alasan: ${escapeHtml(amendLog.notes)}
          </div>
        </div>
      `;
    }

    box.innerHTML = `
      <div class="chip-list">
        <span class="chip-tag">
          <span class="chip-dot ${act.is_locked ? 'chip-dot--on' : 'chip-dot--off'}"></span>
          <strong>${escapeHtml(act.code)} · Versi v${act.version}</strong>
        </span>
        <span class="status-badge ${statusBadgeClass(act.status)}">
          ${escapeHtml(act.status)}
        </span>
      </div>
      ${deltaHtml}
    `;
  }

  function renderActivitiesTable() {
    const tbody = document.getElementById('activitiesTableBody');
    tbody.innerHTML = '';
    document.getElementById('navBadgeActivities').textContent = String(state.activities.length);

    const q = state.searchQuery.toLowerCase();
    const filtered = state.activities.filter((act) => {
      if (!q) return true;
      return (
        act.code.toLowerCase().includes(q) ||
        act.title.toLowerCase().includes(q) ||
        act.status.toLowerCase().includes(q)
      );
    });

    if (!state.selectedActivityId && filtered.length > 0) {
      state.selectedActivityId = filtered[0].id;
    }

    const canEditPlan = Boolean(state.user && state.user.permissions && state.user.permissions.can_create_plan);
    const canApprovePlan = Boolean(state.user && state.user.permissions && state.user.permissions.can_approve_plan);

    filtered.forEach((act) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      if (act.id === state.selectedActivityId) {
        tr.style.background = 'rgba(37, 99, 235, 0.06)';
      }

      const editable = !act.is_locked && canEditPlan;
      const reviewable = act.status === 'SUBMITTED' && canApprovePlan;
      const amendable = act.status === 'APPROVED' && canEditPlan;

      let actionButtons = `<span class="breadcrumb">${act.is_locked ? 'Terkunci' : 'Khusus PJ'}</span>`;
      if (editable) {
        actionButtons = `
          <button type="button" class="role-pill active btn-submit-act" data-id="${escapeHtml(act.id)}">Ajukan (Submit)</button>
          <button type="button" class="role-pill btn-edit-act" data-id="${escapeHtml(act.id)}">Edit RAB</button>
        `;
      } else if (reviewable) {
        actionButtons = `
          <button type="button" class="role-pill active btn-quick-approve" data-id="${escapeHtml(act.id)}">✓ Telaah / Setujui</button>
        `;
      } else if (amendable) {
        actionButtons = `
          <button type="button" class="role-pill active btn-amend-act" data-id="${escapeHtml(act.id)}">⊕ Amendemen (v${act.version + 1})</button>
        `;
      }

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700;" class="mono-num">${escapeHtml(act.code)}</div>
          <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(act.title)}</div>
          <div class="breadcrumb">PJ: ${escapeHtml(act.created_by_name)}</div>
        </td>
        <td class="mono-num">
          <div>${escapeHtml(act.start_date)}</div>
          <div class="breadcrumb">s/d ${escapeHtml(act.end_date)}</div>
        </td>
        <td>
          <div>${escapeHtml(act.assigned_lo_name || '-')}</div>
        </td>
        <td class="mono-num" style="font-weight: 700;">
          ${formatRupiah(act.total_budget)}
        </td>
        <td>
          <span class="status-badge ${statusBadgeClass(act.status)}">
            ${escapeHtml(act.status)} · v${act.version}
          </span>
          <div class="breadcrumb" style="margin-top: 4px;">
            ${act.is_locked ? '🔒 Terkunci' : '✎ Terbuka'}
          </div>
        </td>
        <td>${actionButtons}</td>
      `;

      tr.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        state.selectedActivityId = act.id;
        renderActivitiesTable();
        renderSelectedActivityDetail();
        renderInfoPanelVersionBox();
      });

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-submit-act').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await submitActivityPlan(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.btn-edit-act').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const act = state.activities.find((a) => a.id === btn.getAttribute('data-id'));
        if (act) openActivityModal(act, 'edit');
      });
    });

    tbody.querySelectorAll('.btn-quick-approve').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.selectedActivityId = btn.getAttribute('data-id');
        renderActivitiesTable();
        renderSelectedActivityDetail();
        renderInfoPanelVersionBox();
      });
    });

    tbody.querySelectorAll('.btn-amend-act').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const act = state.activities.find((a) => a.id === btn.getAttribute('data-id'));
        if (act) openActivityModal(act, 'amend');
      });
    });

    renderSelectedActivityDetail();
    renderInfoPanelVersionBox();
  }

  function renderSelectedActivityDetail() {
    const container = document.getElementById('selectedActivityDetail');
    const act = state.activities.find((a) => a.id === state.selectedActivityId);
    if (!act) {
      container.innerHTML = `<p class="breadcrumb">Pilih salah satu kegiatan di atas untuk melihat rincian RAB.</p>`;
      return;
    }

    const canApprovePlan = Boolean(state.user && state.user.permissions && state.user.permissions.can_approve_plan);
    const canEditPlan = Boolean(state.user && state.user.permissions && state.user.permissions.can_create_plan);

    const rowsHtml = act.budget_items
      .map(
        (item, idx) => `
        <tr>
          <td class="mono-num">${idx + 1}</td>
          <td><span class="status-badge status-badge--scheduled">${escapeHtml(item.category)}</span></td>
          <td style="font-weight: 500;">${escapeHtml(item.item_name)}</td>
          <td class="mono-num">${item.quantity} ${escapeHtml(item.unit)}</td>
          <td class="mono-num">${formatRupiah(item.unit_price)}</td>
          <td class="mono-num" style="font-weight: 700;">${formatRupiah(item.total_price)}</td>
        </tr>
      `
      )
      .join('');

    let svPanelHtml = '';
    if (act.status === 'SUBMITTED' && canApprovePlan) {
      svPanelHtml = `
        <div style="margin-top: 16px; padding: 16px; border-radius: 16px; background: var(--bg-glass-card-nested); border: var(--border-glass-subtle);">
          <div class="panel-header-row" style="margin-bottom: 10px;">
            <div>
              <h4 class="card-header">Panel Keputusan Verifikator / Supervisor (SV)</h4>
              <p class="breadcrumb">Segregation of Duties (SoD) Aktif: Anda menelaah pengajuan milik ${escapeHtml(act.created_by_name)} (Versi v${act.version}).</p>
            </div>
            <span class="status-badge status-badge--scheduled">Menunggu Keputusan SV</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <input
              id="svReviewNotes"
              type="text"
              class="form-input"
              style="flex: 1; min-width: 240px;"
              placeholder="Catatan pengesahan atau alasan permintaan revisi (wajib jika meminta revisi)..."
            />
            <button id="btnSvApprove" type="button" class="btn-action" data-id="${escapeHtml(act.id)}">
              ✓ Setujui &amp; Sahkan (Approve)
            </button>
            <button id="btnSvRevision" type="button" class="role-pill" style="border-color: var(--status-danger-text); color: var(--status-danger-text); height: 44px; padding: 0 16px;" data-id="${escapeHtml(act.id)}">
              ↺ Kembalikan untuk Revisi
            </button>
          </div>
        </div>
      `;
    } else if (act.status === 'APPROVED' && canEditPlan) {
      svPanelHtml = `
        <div style="margin-top: 16px; padding: 14px 16px; border-radius: 16px; background: var(--status-success-bg); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-weight: 700; color: var(--status-success-text);">
              🔒 Dokumen Versi v${act.version} Telah Disahkan (Immutable Record)
            </div>
            <div class="breadcrumb">
              Dokumen yang telah disahkan tidak dapat ditimpa. Jika ada perubahan resmi, buat Amendemen baru (v${act.version + 1}).
            </div>
          </div>
          <button id="btnOpenAmendModal" type="button" class="btn-action" data-id="${escapeHtml(act.id)}">
            ⊕ Buat Amendemen Resmi (v${act.version + 1})
          </button>
        </div>
      `;
    }

    const approvalLogs = act.approval_logs || [];
    const approvalHistoryHtml =
      approvalLogs.length === 0
        ? `<p class="breadcrumb">Belum ada riwayat pengajuan atau persetujuan pada kegiatan ini.</p>`
        : `
          <div class="data-table-wrap" style="margin-top: 8px;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Versi</th>
                  <th>Aksi</th>
                  <th>Pejabat / Pelaku</th>
                  <th>Transisi Status</th>
                  <th>Catatan / Alasan Resmi</th>
                </tr>
              </thead>
              <tbody>
                ${approvalLogs
          .map(
            (log) => `
                  <tr>
                    <td class="mono-num" style="font-weight: 700;">v${log.version_number}</td>
                    <td><span class="status-badge ${statusBadgeClass(log.next_status)}">${escapeHtml(log.action)}</span></td>
                    <td>
                      <div style="font-weight: 600;">${escapeHtml(log.actor_name)}</div>
                      <div class="breadcrumb">${escapeHtml(log.actor_role)}</div>
                    </td>
                    <td class="mono-num breadcrumb">${escapeHtml(log.previous_status)} → <strong>${escapeHtml(log.next_status)}</strong></td>
                    <td>${escapeHtml(log.notes)}</td>
                  </tr>
                `
          )
          .join('')}
              </tbody>
            </table>
          </div>
        `;

    container.innerHTML = `
      <div class="panel-header-row">
        <div>
          <h3 class="card-header">Rincian RAB: ${escapeHtml(act.code)} — ${escapeHtml(act.title)} (Versi v${act.version})</h3>
          <p class="breadcrumb">${escapeHtml(act.description)}</p>
        </div>
        <span class="status-badge ${act.is_locked ? 'status-badge--success' : 'status-badge--warning'}">
          ${act.is_locked ? `🔒 Terkunci (${escapeHtml(act.status)} · v${act.version})` : '✎ Mode Terbuka (Dapat Diedit oleh PJ)'}
        </span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kategori Pos</th>
              <th>Uraian Komponen Anggaran</th>
              <th>Volume</th>
              <th>Harga Satuan</th>
              <th>Subtotal RAB</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      ${svPanelHtml}
      <div style="margin-top: 18px;">
        <h4 class="card-header" style="font-size: 14px;">Riwayat Keputusan Approval &amp; Amendemen Berversi</h4>
        ${approvalHistoryHtml}
      </div>
    `;

    const btnApprove = document.getElementById('btnSvApprove');
    if (btnApprove) {
      btnApprove.addEventListener('click', async () => {
        const notes = document.getElementById('svReviewNotes').value;
        await reviewActivityPlan(act.id, 'APPROVE', notes);
      });
    }

    const btnRev = document.getElementById('btnSvRevision');
    if (btnRev) {
      btnRev.addEventListener('click', async () => {
        const notes = document.getElementById('svReviewNotes').value;
        await reviewActivityPlan(act.id, 'REQUEST_REVISION', notes);
      });
    }

    const btnAmend = document.getElementById('btnOpenAmendModal');
    if (btnAmend) {
      btnAmend.addEventListener('click', () => {
        openActivityModal(act, 'amend');
      });
    }
  }

  // --- TICKET 04: DISBURSEMENTS & DIRECT PAYROLL FUNCTIONS ---
  function renderDisbursementsTable() {
    const tbody = document.getElementById('disbursementsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    document.getElementById('navBadgePayroll').textContent = String(state.disbursements.length);

    const q = state.searchQuery.toLowerCase();
    const filtered = state.disbursements.filter((d) => {
      if (!q) return true;
      return (
        d.disbursement_code.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        (d.activity_code || '').toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
      );
    });

    if (!state.selectedDisbursementId && filtered.length > 0) {
      state.selectedDisbursementId = filtered[0].id;
    }

    const canDisburse = Boolean(state.user && state.user.permissions && state.user.permissions.can_disburse_funds);

    filtered.forEach((d) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      if (d.id === state.selectedDisbursementId) {
        tr.style.background = 'rgba(37, 99, 235, 0.06)';
      }

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700;" class="mono-num">${escapeHtml(d.disbursement_code)}</div>
          <div style="font-weight: 600;">${escapeHtml(d.title)}</div>
          <div class="breadcrumb">Dibuat oleh: ${escapeHtml(d.created_by_name)}</div>
        </td>
        <td>
          <div style="font-weight: 600;" class="mono-num">${escapeHtml(d.activity_code || '-')}</div>
          <div class="breadcrumb">${escapeHtml(d.activity_title || '-')}</div>
        </td>
        <td class="mono-num" style="font-weight: 700;">
          ${formatRupiah(d.total_amount)}
        </td>
        <td>
          <div>${d.items_count} Rekening</div>
        </td>
        <td>
          <span class="status-badge ${statusBadgeClass(d.status)}">
            ${escapeHtml(d.status)}
          </span>
          <div class="breadcrumb mono-num" style="margin-top: 4px;">
            ${d.transfer_date ? escapeHtml(d.transfer_date) : 'Belum Ditransfer'}
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="role-pill btn-export-csv" data-id="${escapeHtml(d.id)}">Unduh CSV</button>
            ${d.status === 'DRAFT' && canDisburse
          ? `<button type="button" class="role-pill active btn-exec-disb" data-id="${escapeHtml(d.id)}">Eksekusi</button>`
          : `<span class="breadcrumb">${d.status === 'TRANSFERRED' ? '✓ Selesai' : 'Review'}</span>`
        }
          </div>
        </td>
      `;

      tr.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        state.selectedDisbursementId = d.id;
        renderDisbursementsTable();
        renderSelectedDisbursementDetail();
      });

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-export-csv').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportDisbursementCsv(btn.getAttribute('data-id'));
      });
    });

    tbody.querySelectorAll('.btn-exec-disb').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openExecuteModal(btn.getAttribute('data-id'));
      });
    });

    renderSelectedDisbursementDetail();
  }

  function renderSelectedDisbursementDetail() {
    const container = document.getElementById('selectedDisbursementDetail');
    if (!container) return;
    const d = state.disbursements.find((item) => item.id === state.selectedDisbursementId);
    if (!d) {
      container.innerHTML = `<p class="breadcrumb">Pilih salah satu batch pencairan untuk melihat rincian transfer.</p>`;
      return;
    }

    const canDisburse = Boolean(state.user && state.user.permissions && state.user.permissions.can_disburse_funds);

    const itemsHtml = d.items
      .map(
        (it, idx) => `
        <tr>
          <td class="mono-num">${idx + 1}</td>
          <td>
            <div style="font-weight: 600;">${escapeHtml(it.beneficiary_name)}</div>
            <div class="breadcrumb mono-num">${escapeHtml(it.bank_name)} · ${escapeHtml(it.account_number)}</div>
            ${it.tax_id_npwp ? `<div class="breadcrumb mono-num">NPWP: ${escapeHtml(it.tax_id_npwp)}</div>` : ''}
          </td>
          <td><span class="status-badge status-badge--scheduled">${escapeHtml(it.type)}</span></td>
          <td class="mono-num">${formatRupiah(it.amount)}</td>
          <td class="mono-num" style="color: var(--status-danger-text);">${formatRupiah(it.tax_deduction)}</td>
          <td class="mono-num" style="font-weight: 700; color: var(--status-success-text);">${formatRupiah(it.net_amount)}</td>
          <td>
            <div class="mono-num" style="font-weight: 600;">${escapeHtml(it.transfer_reference_no || '-')}</div>
            ${it.transfer_receipt_hash
            ? `<div class="status-badge status-badge--success mono-num" style="font-size: 10px; margin-top: 4px;" title="SHA-256: ${escapeHtml(it.transfer_receipt_hash)}">
                     Hash: ${escapeHtml(it.transfer_receipt_hash.slice(0, 14))}...
                   </div>`
            : '<span class="breadcrumb">Belum ada slip</span>'
          }
          </td>
        </tr>
      `
      )
      .join('');

    container.innerHTML = `
      <div class="panel-header-row">
        <div>
          <h3 class="card-header">Rincian Batch Transfer: ${escapeHtml(d.disbursement_code)} — ${escapeHtml(d.title)}</h3>
          <p class="breadcrumb">Kegiatan: ${escapeHtml(d.activity_code)} (${escapeHtml(d.activity_title)}) · Pembuat: ${escapeHtml(d.created_by_name)} ${d.approved_by_name ? `· Disahkan: ${escapeHtml(d.approved_by_name)}` : ''}</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="btnDetailExportCsv" type="button" class="role-pill active" data-id="${escapeHtml(d.id)}">Unduh CSV Instruksi Bank</button>
          ${d.status === 'DRAFT' && canDisburse
        ? `<button id="btnDetailExecute" type="button" class="btn-action" data-id="${escapeHtml(d.id)}">✓ Eksekusi &amp; Catat Bukti Bank</button>`
        : `<span class="status-badge status-badge--success">Status: ${escapeHtml(d.status)}</span>`
      }
        </div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Penerima &amp; Rekening</th>
              <th>Jenis</th>
              <th>Bruto</th>
              <th>Pajak (PPh)</th>
              <th>Net Transfer</th>
              <th>Bukti &amp; SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
    `;

    const btnCsv = document.getElementById('btnDetailExportCsv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => exportDisbursementCsv(d.id));
    }
    const btnExec = document.getElementById('btnDetailExecute');
    if (btnExec) {
      btnExec.addEventListener('click', () => openExecuteModal(d.id));
    }
  }

  async function exportDisbursementCsv(disbId) {
    try {
      const res = await apiFetch(`/api/disbursements/${disbId}/export-csv`);
      const blob = new Blob([res.csv_data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', res.filename || 'payroll-export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message);
    }
  }

  function renderBankAccountsTable() {
    const tbody = document.getElementById('bankAccountsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    state.bankAccounts.forEach((ba) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600;">${escapeHtml(ba.beneficiary_name)}</td>
        <td class="mono-num">${escapeHtml(ba.bank_name)} · <strong>${escapeHtml(ba.account_number)}</strong></td>
        <td class="mono-num">${escapeHtml(ba.tax_id_npwp || '-')}</td>
        <td><span class="breadcrumb">${ba.user_id ? 'Pengguna Sistem' : 'Pihak Luar'}</span></td>
        <td><span class="status-badge status-badge--success">Aktif</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function openNewPayrollModal() {
    const errEl = document.getElementById('payrollFormError');
    errEl.style.display = 'none';

    // Populate approved activities
    const actSelect = document.getElementById('disbActivitySelect');
    actSelect.innerHTML = '';
    const approvedActivities = state.activities.filter((a) => ['APPROVED', 'IN_EXECUTION', 'COMPLETED'].includes(a.status));
    if (approvedActivities.length === 0) {
      actSelect.innerHTML = `<option value="">Tidak ada kegiatan berstatus APPROVED</option>`;
    } else {
      approvedActivities.forEach((act) => {
        const opt = document.createElement('option');
        opt.value = act.id;
        opt.textContent = `${act.code} — ${act.title} (Pagu: ${formatRupiah(act.total_budget)})`;
        actSelect.appendChild(opt);
      });
    }

    state.modalPayrollItems = [
      {
        bank_account_id: state.bankAccounts[0] ? state.bankAccounts[0].id : '',
        type: 'PAYROLL_HONOR',
        amount: 10000000,
        tax_deduction: 500000,
        notes: 'Honorarium Narasumber Ahli',
      },
    ];

    renderModalPayrollRows();
    document.getElementById('newPayrollModal').style.display = 'flex';
  }

  function renderModalPayrollRows() {
    const container = document.getElementById('payrollItemsContainer');
    container.innerHTML = '';
    let netTotal = 0;

    state.modalPayrollItems.forEach((item, index) => {
      const gross = Number(item.amount) || 0;
      const tax = Number(item.tax_deduction) || 0;
      const net = Math.max(gross - tax, 0);
      netTotal += net;

      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '2fr 1.2fr 1fr 1fr 1.5fr auto';
      row.style.gap = '8px';
      row.style.alignItems = 'center';

      let bankOpts = state.bankAccounts
        .map(
          (ba) =>
            `<option value="${escapeHtml(ba.id)}" ${item.bank_account_id === ba.id ? 'selected' : ''}>
               ${escapeHtml(ba.beneficiary_name)} (${escapeHtml(ba.bank_name)})
             </option>`
        )
        .join('');

      row.innerHTML = `
        <select class="form-input disb-ba" data-idx="${index}">${bankOpts}</select>
        <select class="form-input disb-type" data-idx="${index}">
          <option value="PAYROLL_HONOR" ${item.type === 'PAYROLL_HONOR' ? 'selected' : ''}>PAYROLL_HONOR</option>
          <option value="LO_OPERATIONAL_ADVANCE" ${item.type === 'LO_OPERATIONAL_ADVANCE' ? 'selected' : ''}>LO_OPERATIONAL_ADVANCE</option>
        </select>
        <input type="number" min="1000" class="form-input disb-amt mono-num" data-idx="${index}" placeholder="Bruto (Rp)" value="${gross}" required />
        <input type="number" min="0" class="form-input disb-tax mono-num" data-idx="${index}" placeholder="Pajak (Rp)" value="${tax}" required />
        <input type="text" class="form-input disb-notes" data-idx="${index}" placeholder="Uraian honor..." value="${escapeHtml(item.notes)}" />
        <button type="button" class="btn-logout disb-del" data-idx="${index}" title="Hapus">✕</button>
      `;
      container.appendChild(row);
    });

    document.getElementById('modalPayrollCalculatedTotal').textContent = formatRupiah(netTotal);

    container.querySelectorAll('.disb-ba').forEach((el) => {
      el.addEventListener('change', (e) => {
        state.modalPayrollItems[Number(e.target.dataset.idx)].bank_account_id = e.target.value;
      });
    });
    container.querySelectorAll('.disb-type').forEach((el) => {
      el.addEventListener('change', (e) => {
        state.modalPayrollItems[Number(e.target.dataset.idx)].type = e.target.value;
      });
    });
    container.querySelectorAll('.disb-amt').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalPayrollItems[Number(e.target.dataset.idx)].amount = Number(e.target.value || 0);
        updateModalPayrollTotal();
      });
    });
    container.querySelectorAll('.disb-tax').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalPayrollItems[Number(e.target.dataset.idx)].tax_deduction = Number(e.target.value || 0);
        updateModalPayrollTotal();
      });
    });
    container.querySelectorAll('.disb-notes').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalPayrollItems[Number(e.target.dataset.idx)].notes = e.target.value;
      });
    });
    container.querySelectorAll('.disb-del').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (state.modalPayrollItems.length <= 1) return;
        state.modalPayrollItems.splice(Number(e.currentTarget.dataset.idx), 1);
        renderModalPayrollRows();
      });
    });
  }

  function updateModalPayrollTotal() {
    const netTotal = state.modalPayrollItems.reduce(
      (acc, item) => acc + Math.max((Number(item.amount) || 0) - (Number(item.tax_deduction) || 0), 0),
      0
    );
    document.getElementById('modalPayrollCalculatedTotal').textContent = formatRupiah(netTotal);
  }

  function openExecuteModal(disbId) {
    document.getElementById('execDisbursementId').value = disbId;
    document.getElementById('execRefNo').value = `TRX-${Date.now().toString(36).toUpperCase()}`;
    document.getElementById('execDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('execFileName').value = `slip-transfer-${disbId}.pdf`;
    document.getElementById('execReceiptContent').value = `Transfer terkonfirmasi oleh Bendahara pada ${new Date().toISOString()}`;
    document.getElementById('execFormError').style.display = 'none';
    document.getElementById('executeDisbursementModal').style.display = 'flex';
  }

  async function submitActivityPlan(actId) {
    try {
      await apiFetch(`/api/activities/${actId}/submit`, { method: 'POST', body: JSON.stringify({}) });
      state.selectedActivityId = actId;
      await refreshWorkspaceData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function reviewActivityPlan(actId, decision, notes) {
    try {
      await apiFetch(`/api/activities/${actId}/review`, {
        method: 'POST',
        body: JSON.stringify({ decision, notes }),
      });
      state.selectedActivityId = actId;
      await refreshWorkspaceData();
    } catch (err) {
      alert(err.message);
    }
  }

  function renderModalRabRows() {
    const container = document.getElementById('rabRowsContainer');
    container.innerHTML = '';
    let total = 0;

    state.modalRabItems.forEach((item, index) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
      total += subtotal;

      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1.3fr 2fr 0.7fr 0.8fr 1.2fr auto';
      row.style.gap = '8px';
      row.style.alignItems = 'center';

      row.innerHTML = `
        <select class="form-input rab-cat" data-idx="${index}">
          <option value="PAYROLL_HONOR" ${item.category === 'PAYROLL_HONOR' ? 'selected' : ''}>PAYROLL_HONOR</option>
          <option value="LO_OPERATIONAL" ${item.category === 'LO_OPERATIONAL' ? 'selected' : ''}>LO_OPERATIONAL</option>
          <option value="ACCOMMODATION" ${item.category === 'ACCOMMODATION' ? 'selected' : ''}>ACCOMMODATION</option>
          <option value="LOGISTICS" ${item.category === 'LOGISTICS' ? 'selected' : ''}>LOGISTICS</option>
          <option value="OTHER" ${item.category === 'OTHER' ? 'selected' : ''}>OTHER</option>
        </select>
        <input type="text" class="form-input rab-name" data-idx="${index}" placeholder="Uraian item..." value="${escapeHtml(item.item_name)}" required />
        <input type="number" min="1" class="form-input rab-qty mono-num" data-idx="${index}" value="${Number(item.quantity) || 1}" required />
        <input type="text" class="form-input rab-unit" data-idx="${index}" value="${escapeHtml(item.unit)}" required />
        <input type="number" min="1" step="any" class="form-input rab-price mono-num" data-idx="${index}" value="${Number(item.unit_price) || 0}" required />
        <button type="button" class="btn-logout rab-del" data-idx="${index}" title="Hapus baris">✕</button>
      `;
      container.appendChild(row);
    });

    document.getElementById('modalCalculatedTotal').textContent = formatRupiah(total);

    container.querySelectorAll('.rab-cat').forEach((el) => {
      el.addEventListener('change', (e) => {
        state.modalRabItems[Number(e.target.dataset.idx)].category = e.target.value;
      });
    });
    container.querySelectorAll('.rab-name').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalRabItems[Number(e.target.dataset.idx)].item_name = e.target.value;
      });
    });
    container.querySelectorAll('.rab-qty').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalRabItems[Number(e.target.dataset.idx)].quantity = Number(e.target.value || 0);
        updateModalTotalOnly();
      });
    });
    container.querySelectorAll('.rab-unit').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalRabItems[Number(e.target.dataset.idx)].unit = e.target.value;
      });
    });
    container.querySelectorAll('.rab-price').forEach((el) => {
      el.addEventListener('input', (e) => {
        state.modalRabItems[Number(e.target.dataset.idx)].unit_price = Number(e.target.value || 0);
        updateModalTotalOnly();
      });
    });
    container.querySelectorAll('.rab-del').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (state.modalRabItems.length <= 1) return;
        state.modalRabItems.splice(Number(e.currentTarget.dataset.idx), 1);
        renderModalRabRows();
      });
    });
  }

  function updateModalTotalOnly() {
    const total = state.modalRabItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
      0
    );
    document.getElementById('modalCalculatedTotal').textContent = formatRupiah(total);
  }

  function openActivityModal(activityToEdit = null, mode = 'create') {
    const errEl = document.getElementById('activityFormError');
    errEl.style.display = 'none';
    document.getElementById('editActivityMode').value = mode;
    const amendGroup = document.getElementById('amendReasonGroup');
    const saveBtn = document.getElementById('btnSaveDraftActivity');
    const codeInput = document.getElementById('actCode');

    if (activityToEdit && mode === 'amend') {
      document.getElementById('activityModalTitle').textContent = `Buat Amendemen Resmi: ${activityToEdit.code} (v${activityToEdit.version} → v${activityToEdit.version + 1})`;
      document.getElementById('activityModalSubtitle').textContent =
        'Versi sebelumnya beserta seluruh baris RAB disimpan utuh di snapshot persetujuan.';
      document.getElementById('editActivityId').value = activityToEdit.id;
      codeInput.value = activityToEdit.code;
      codeInput.disabled = true;
      document.getElementById('actTitle').value = activityToEdit.title;
      document.getElementById('actDescription').value = activityToEdit.description;
      document.getElementById('actStartDate').value = activityToEdit.start_date;
      document.getElementById('actEndDate').value = activityToEdit.end_date;
      document.getElementById('actAmendReason').value = '';
      amendGroup.style.display = 'flex';
      saveBtn.textContent = `Ajukan Amendemen v${activityToEdit.version + 1}`;
      state.modalRabItems = activityToEdit.budget_items.map((i) => ({
        category: i.category,
        item_name: i.item_name,
        quantity: i.quantity,
        unit: i.unit,
        unit_price: i.unit_price,
      }));
    } else if (activityToEdit) {
      document.getElementById('activityModalTitle').textContent = `Edit Kegiatan: ${activityToEdit.code}`;
      document.getElementById('activityModalSubtitle').textContent =
        'Total anggaran dihitung otomatis dari perkalian Kuantitas × Harga Satuan (Validasi L1).';
      document.getElementById('editActivityId').value = activityToEdit.id;
      codeInput.value = activityToEdit.code;
      codeInput.disabled = true;
      document.getElementById('actTitle').value = activityToEdit.title;
      document.getElementById('actDescription').value = activityToEdit.description;
      document.getElementById('actStartDate').value = activityToEdit.start_date;
      document.getElementById('actEndDate').value = activityToEdit.end_date;
      amendGroup.style.display = 'none';
      saveBtn.textContent = 'Simpan Perubahan Draft';
      state.modalRabItems = activityToEdit.budget_items.map((i) => ({
        category: i.category,
        item_name: i.item_name,
        quantity: i.quantity,
        unit: i.unit,
        unit_price: i.unit_price,
      }));
    } else {
      document.getElementById('activityModalTitle').textContent = 'Buat Usulan Kegiatan & Rincian RAB Baru';
      document.getElementById('activityModalSubtitle').textContent =
        'Total anggaran dihitung otomatis dari perkalian Kuantitas × Harga Satuan (Validasi L1).';
      document.getElementById('editActivityId').value = '';
      codeInput.value = `ACT-2026-00${state.activities.length + 1}`;
      codeInput.disabled = false;
      document.getElementById('actTitle').value = '';
      document.getElementById('actDescription').value = '';
      document.getElementById('actStartDate').value = '2026-11-20';
      document.getElementById('actEndDate').value = '2026-11-23';
      amendGroup.style.display = 'none';
      saveBtn.textContent = 'Simpan sebagai Draft';
      state.modalRabItems = [
        {
          category: 'PAYROLL_HONOR',
          item_name: 'Honorarium Narasumber & Tim Pelaksana',
          quantity: 4,
          unit: 'OJ',
          unit_price: 5000000,
        },
        {
          category: 'LO_OPERATIONAL',
          item_name: 'Panjar Operasional Lapangan LO',
          quantity: 1,
          unit: 'Paket',
          unit_price: 15000000,
        },
      ];
    }

    renderModalRabRows();
    document.getElementById('activityModal').style.display = 'flex';
  }

  function renderAuditFeed() {
    const feed = document.getElementById('auditTrailFeed');
    feed.innerHTML = '';
    document.getElementById('navBadgeAudit').textContent = String(state.auditLogs.length);

    if (state.user && state.user.permissions && !state.user.permissions.can_view_audit_trail) {
      feed.innerHTML = `<div class="audit-item breadcrumb">Peran ${escapeHtml(state.user.role)} hanya memiliki akses buku kas &amp; bukti lapangan (Audit Trail global dibatasi RBAC).</div>`;
      return;
    }

    state.auditLogs.slice(0, 12).forEach((log) => {
      const div = document.createElement('div');
      div.className = 'audit-item';
      const timeStr = new Date(log.created_at).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:600; color:var(--text-primary);">
          <span>${escapeHtml(log.action)}</span>
          <span class="mono-num breadcrumb">${escapeHtml(timeStr)}</span>
        </div>
        <div class="breadcrumb" style="margin-top:2px;">
          Pelaku: <strong>${escapeHtml(log.actor_name)}</strong> (${escapeHtml(log.actor_role)})
        </div>
      `;
      feed.appendChild(div);
    });
  }

  async function loadLoCashbook(activityId = null) {
    let url = '/api/lo/cashbook';
    if (activityId) {
      url += `?activity_id=${encodeURIComponent(activityId)}`;
    }
    const res = await apiFetch(url);
    const cb = res.cashbook;
    if (!cb) return;

    // Update Cashbook Filter Dropdown if not populated or preserve value
    const filterSelect = document.getElementById('loCashbookActivityFilter');
    if (filterSelect && state.activities && filterSelect.options.length <= 1) {
      state.activities.forEach((act) => {
        const opt = document.createElement('option');
        opt.value = act.id;
        opt.textContent = `${act.code} - ${act.title.substring(0, 32)}...`;
        filterSelect.appendChild(opt);
      });
      if (activityId) filterSelect.value = activityId;
    }

    // Update KPI cards
    document.getElementById('cbTotalAdvance').textContent = formatRupiah(cb.total_advance_received);
    document.getElementById('cbTotalExpenses').textContent = formatRupiah(cb.total_expenses_submitted);
    document.getElementById('cbRemainingCash').textContent = formatRupiah(cb.remaining_cash_on_hand);

    const badge = document.getElementById('cbCashBadge');
    if (cb.remaining_cash_on_hand <= 0 && cb.total_advance_received > 0) {
      badge.className = 'status-badge status-badge--error';
      badge.textContent = 'Kas Habis (Nihil)';
    } else if (cb.remaining_cash_on_hand < 1000000 && cb.remaining_cash_on_hand > 0) {
      badge.className = 'status-badge status-badge--revision';
      badge.textContent = 'Saldo Menipis';
    } else {
      badge.className = 'status-badge status-badge--success';
      badge.textContent = 'Saldo Kas Aktif';
    }

    // Overdue unsettled alert banner
    const alertBox = document.getElementById('loOverdueAlertBox');
    const alertText = document.getElementById('loOverdueAlertText');
    if (cb.has_overdue_unsettled_advances && cb.overdue_warnings.length > 0) {
      alertBox.style.display = 'block';
      alertText.textContent = `Terdapat ${cb.overdue_warnings.length} kegiatan lampau dengan panjar belum selesai: ` +
        cb.overdue_warnings.map(w => `${w.activity_code} (${formatRupiah(w.unsettled_amount)})`).join(', ') +
        '. Segera lengkapi bukti pengeluaran dan lakukan penyelesaian kasir (Ticket 07).';
    } else {
      alertBox.style.display = 'none';
    }

    // Update Right InfoPanel Cashbox
    document.getElementById('infoPanelRemainingCash').textContent = formatRupiah(cb.remaining_cash_on_hand);
    document.getElementById('infoPanelTotalAdvance').textContent = formatRupiah(cb.total_advance_received);
    document.getElementById('infoPanelTotalExpenses').textContent = formatRupiah(cb.total_expenses_submitted);

    // Render Ledger Table Body
    const tbody = document.getElementById('loCashbookTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!cb.ledger || cb.ledger.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">Belum ada mutasi penerimaan panjar atau pengeluaran kuitansi untuk kegiatan ini.</td></tr>`;
      return;
    }

    cb.ledger.forEach((tx) => {
      const tr = document.createElement('tr');
      const isIn = tx.direction === 'IN';
      const dirBadge = isIn
        ? `<span class="status-badge status-badge--success">Masuk (+)</span>`
        : `<span class="status-badge status-badge--revision">Keluar (-)</span>`;

      const statusBadge = tx.status === 'VERIFIED'
        ? `<span class="status-badge status-badge--success">VERIFIED</span>`
        : (tx.status === 'PAID'
          ? `<span class="status-badge status-badge--success">PAID</span>`
          : `<span class="status-badge status-badge--scheduled">${escapeHtml(tx.status)}</span>`);

      const hashPreview = tx.receipt_hash
        ? `<span class="mono-num breadcrumb" title="${escapeHtml(tx.receipt_hash)}">${escapeHtml(tx.receipt_hash.substring(0, 10))}...</span>`
        : `<span class="breadcrumb">-</span>`;

      tr.innerHTML = `
        <td class="mono-num">${escapeHtml(tx.date)}</td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            ${dirBadge}
            <strong class="mono-num" style="font-size:12px;">${escapeHtml(tx.code)}</strong>
          </div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${escapeHtml(tx.title)}</div>
          <div class="breadcrumb" style="font-size:11px;">Pihak/Vendor: <strong>${escapeHtml(tx.vendor_or_payee || '-')}</strong></div>
        </td>
        <td><span class="mono-num">${escapeHtml(tx.activity_code || '-')}</span></td>
        <td style="text-align:right; font-weight:600; color:#10b981;" class="mono-num">
          ${isIn ? formatRupiah(tx.inflow) : '-'}
        </td>
        <td style="text-align:right; font-weight:600; color:#f59e0b;" class="mono-num">
          ${!isIn ? formatRupiah(tx.outflow) : '-'}
        </td>
        <td style="text-align:right; font-weight:700; color:var(--primary);" class="mono-num">
          ${formatRupiah(tx.running_balance)}
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:2px;">
            ${statusBadge}
            <div style="font-size:10px;">SHA-256: ${hashPreview}</div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  async function refreshWorkspaceData() {
    const [summaryRes, activitiesRes, usersRes, disbRes, baRes] = await Promise.all([
      apiFetch('/api/dashboard/summary'),
      apiFetch('/api/activities'),
      apiFetch('/api/users'),
      apiFetch('/api/disbursements'),
      apiFetch('/api/bank-accounts'),
    ]);

    state.user = summaryRes.active_user;
    state.activities = activitiesRes.activities || [];
    state.users = usersRes.users || [];
    state.disbursements = disbRes.disbursements || [];
    state.bankAccounts = baRes.bank_accounts || [];

    if (state.user && state.user.permissions && state.user.permissions.can_view_audit_trail) {
      const auditRes = await apiFetch('/api/audit-logs');
      state.auditLogs = auditRes.audit_logs || [];
    } else {
      state.auditLogs = [];
    }

    document.getElementById('metricPagu').textContent = formatRupiah(summaryRes.metrics.total_pagu_allocated);
    document.getElementById('metricPayroll').textContent = formatRupiah(summaryRes.metrics.direct_payroll_disbursed);
    document.getElementById('metricLoAdvance').textContent = formatRupiah(summaryRes.metrics.lo_advance_active);

    // Update Right InfoPanel Cashbox
    if (summaryRes.metrics.lo_cash_on_hand !== undefined) {
      document.getElementById('infoPanelRemainingCash').textContent = formatRupiah(summaryRes.metrics.lo_cash_on_hand);
      document.getElementById('infoPanelTotalAdvance').textContent = formatRupiah(summaryRes.metrics.lo_advance_active);
      document.getElementById('infoPanelTotalExpenses').textContent = formatRupiah(summaryRes.metrics.lo_expenses_realized || 0);
    }

    renderSidebarAndHeader();
    renderPermissionChips();
    renderActivitiesTable();
    renderDisbursementsTable();
    renderBankAccountsTable();
    renderAuditFeed();
    updatePrimaryCtaForRole(state.user);
    applyRoleNavigation(state.user);

    if (state.activeModule === 'lo-advance') {
      const filterVal = document.getElementById('loCashbookActivityFilter')?.value;
      await loadLoCashbook(filterVal || null);
    }
  }

  /* RBAC: hanya modul yang berhak tampil di sidebar, sesuai matriks peran. */
  const MODULE_ROLES = {
    dashboard: ['ADMIN', 'PJ', 'SV', 'FINANCE', 'LO', 'AUDITOR'],
    planning: ['PJ', 'SV', 'FINANCE', 'ADMIN', 'AUDITOR'],
    payroll: ['FINANCE', 'SV', 'ADMIN', 'AUDITOR'],
    'lo-advance': ['LO', 'FINANCE', 'SV', 'ADMIN', 'AUDITOR'],
    reconciliation: ['SV', 'FINANCE', 'ADMIN', 'AUDITOR'],
    audit: ['ADMIN', 'PJ', 'SV', 'FINANCE', 'AUDITOR'],
  };

  function applyRoleNavigation(user) {
    if (!user) return;
    const allowed = (mod) => (MODULE_ROLES[mod] || []).includes(user.role);
    const items = Array.from(document.querySelectorAll('#sidebarNavList .nav-item'));
    items.forEach((li) => {
      const mod = li.dataset.module;
      li.style.display = allowed(mod) ? '' : 'none';
      li.setAttribute('aria-hidden', allowed(mod) ? 'false' : 'true');
    });
    if (!allowed(state.activeModule)) {
      const first = items.find((li) => allowed(li.dataset.module));
      if (first) switchModule(first.dataset.module);
    }
  }

  async function bootstrap() {
    const demoRes = await apiFetch('/api/auth/demo-accounts');
    state.demoAccounts = demoRes.accounts || [];

    if (state.token) {
      try {
        await refreshWorkspaceData();
        return;
      } catch (_) {
        localStorage.removeItem('gov_access_token');
        state.token = null;
      }
    }

    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.style.display = 'flex';
      document.getElementById('loginEmail').value = 'pj@dinas.go.id';
      document.getElementById('loginPassword').value = 'password123';
    }
  }

  // Event Listeners
  document.querySelectorAll('#sidebarNavList .nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      const mod = item.dataset.module;
      if (mod) switchModule(mod);
    });
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value || '';
    renderActivitiesTable();
    renderDisbursementsTable();
  });

  document.getElementById('btnPrimaryCta').addEventListener('click', () => {
    if (state.user && state.user.role === 'FINANCE') {
      openNewPayrollModal();
    } else if (state.user && state.user.role === 'PJ') {
      openActivityModal(null, 'create');
    } else {
      document.getElementById('newBankAccountModal').style.display = 'flex';
    }
  });

  document.getElementById('btnOpenNewPayrollModal').addEventListener('click', openNewPayrollModal);
  document.getElementById('btnOpenNewAccountModal').addEventListener('click', () => {
    document.getElementById('newBankAccountModal').style.display = 'flex';
  });
  document.getElementById('btnOpenNewAccountModal2').addEventListener('click', () => {
    document.getElementById('newBankAccountModal').style.display = 'flex';
  });

  document.getElementById('btnAddBeneficiaryRow').addEventListener('click', () => {
    state.modalPayrollItems.push({
      bank_account_id: state.bankAccounts[0] ? state.bankAccounts[0].id : '',
      type: 'PAYROLL_HONOR',
      amount: 5000000,
      tax_deduction: 250000,
      notes: 'Honorarium Tambahan',
    });
    renderModalPayrollRows();
  });

  document.getElementById('btnClosePayrollModal').addEventListener('click', () => {
    document.getElementById('newPayrollModal').style.display = 'none';
  });
  document.getElementById('btnCloseBankModal').addEventListener('click', () => {
    document.getElementById('newBankAccountModal').style.display = 'none';
  });
  document.getElementById('btnCloseExecuteModal').addEventListener('click', () => {
    document.getElementById('executeDisbursementModal').style.display = 'none';
  });

  document.getElementById('payrollBatchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('payrollFormError');
    errEl.style.display = 'none';
    const btn = document.getElementById('btnSavePayrollBatch');
    btn.setAttribute('data-state', 'loading');

    const payload = {
      activity_id: document.getElementById('disbActivitySelect').value,
      title: document.getElementById('disbTitle').value,
      items: state.modalPayrollItems,
    };

    try {
      const res = await apiFetch('/api/disbursements', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      btn.setAttribute('data-state', 'success');
      state.selectedDisbursementId = res.disbursement.id;
      document.getElementById('newPayrollModal').style.display = 'none';
      btn.setAttribute('data-state', 'default');
      await refreshWorkspaceData();
    } catch (err) {
      btn.setAttribute('data-state', 'error');
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  document.getElementById('bankAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('bankFormError');
    errEl.style.display = 'none';
    const btn = document.getElementById('btnSaveBankAccount');
    btn.setAttribute('data-state', 'loading');

    const payload = {
      beneficiary_name: document.getElementById('baName').value,
      bank_name: document.getElementById('baBank').value,
      account_number: document.getElementById('baNumber').value,
      tax_id_npwp: document.getElementById('baNpwp').value,
    };

    try {
      await apiFetch('/api/bank-accounts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      btn.setAttribute('data-state', 'success');
      document.getElementById('newBankAccountModal').style.display = 'none';
      btn.setAttribute('data-state', 'default');
      await refreshWorkspaceData();
    } catch (err) {
      btn.setAttribute('data-state', 'error');
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  document.getElementById('executeDisbursementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('execFormError');
    errEl.style.display = 'none';
    const btn = document.getElementById('btnSubmitExecute');
    btn.setAttribute('data-state', 'loading');

    const disbId = document.getElementById('execDisbursementId').value;
    const payload = {
      transfer_reference_no: document.getElementById('execRefNo').value,
      transfer_date: document.getElementById('execDate').value,
      transfer_receipt_file: document.getElementById('execFileName').value,
      receipt_content: document.getElementById('execReceiptContent').value,
    };

    try {
      const res = await apiFetch(`/api/disbursements/${disbId}/execute`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      btn.setAttribute('data-state', 'success');
      state.selectedDisbursementId = res.disbursement.id;
      document.getElementById('executeDisbursementModal').style.display = 'none';
      btn.setAttribute('data-state', 'default');
      await refreshWorkspaceData();
    } catch (err) {
      btn.setAttribute('data-state', 'error');
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  document.getElementById('btnAddRabRow').addEventListener('click', () => {
    state.modalRabItems.push({
      category: 'LOGISTICS',
      item_name: '',
      quantity: 1,
      unit: 'Paket',
      unit_price: 1000000,
    });
    renderModalRabRows();
  });

  document.getElementById('btnCloseActivityModal').addEventListener('click', () => {
    document.getElementById('activityModal').style.display = 'none';
  });

  document.getElementById('activityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('activityFormError');
    errEl.style.display = 'none';
    const saveBtn = document.getElementById('btnSaveDraftActivity');
    saveBtn.setAttribute('data-state', 'loading');

    const editId = document.getElementById('editActivityId').value;
    const mode = document.getElementById('editActivityMode').value;
    const payload = {
      code: document.getElementById('actCode').value,
      title: document.getElementById('actTitle').value,
      description: document.getElementById('actDescription').value,
      start_date: document.getElementById('actStartDate').value,
      end_date: document.getElementById('actEndDate').value,
      assigned_lo_id: document.getElementById('actLoSelect').value,
      budget_items: state.modalRabItems,
    };

    try {
      let endpoint = '/api/activities';
      let method = 'POST';
      if (mode === 'amend' && editId) {
        endpoint = `/api/activities/${editId}/amend`;
        method = 'POST';
        payload.reason = document.getElementById('actAmendReason').value;
      } else if (editId) {
        endpoint = `/api/activities/${editId}`;
        method = 'PUT';
      }

      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });
      saveBtn.setAttribute('data-state', 'success');
      state.selectedActivityId = res.activity.id;
      document.getElementById('activityModal').style.display = 'none';
      saveBtn.setAttribute('data-state', 'default');
      await refreshWorkspaceData();
    } catch (err) {
      saveBtn.setAttribute('data-state', 'error');
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  document.getElementById('btnOpenCashbookTab')?.addEventListener('click', () => {
    switchModule('lo-advance');
  });

  document.getElementById('loCashbookActivityFilter')?.addEventListener('change', (e) => {
    loadLoCashbook(e.target.value || null);
  });

  // --- TICKET 06: SMART CAMERA FIELD SIMULATOR HANDLERS ---
  const fieldCaptureModal = document.getElementById('fieldCaptureModal');
  const fcActivitySelect = document.getElementById('fcActivityId');
  const fcTypeSelect = document.getElementById('fcType');
  const fcExpenseFields = document.getElementById('fcExpenseFields');
  const fcForm = document.getElementById('fieldCaptureForm');
  const fcErrorMsg = document.getElementById('fieldCaptureErrorMsg');

  document.getElementById('btnOpenFieldCaptureModal')?.addEventListener('click', () => {
    if (!fieldCaptureModal) return;
    fcActivitySelect.innerHTML = '';
    state.activities.forEach((act) => {
      const opt = document.createElement('option');
      opt.value = act.id;
      opt.textContent = `${act.code} - ${act.title.substring(0, 36)}...`;
      fcActivitySelect.appendChild(opt);
    });

    const todayStr = new Date().toISOString().substring(0, 10);
    document.getElementById('fcDate').value = todayStr;
    document.getElementById('fcTimePreview').textContent = new Date().toISOString();
    fcErrorMsg.style.display = 'none';
    fieldCaptureModal.style.display = 'flex';
  });

  document.getElementById('btnCloseFieldCaptureModal')?.addEventListener('click', () => {
    if (fieldCaptureModal) fieldCaptureModal.style.display = 'none';
  });

  fcTypeSelect?.addEventListener('change', (e) => {
    const isExpense = e.target.value === 'EXPENSE';
    if (fcExpenseFields) {
      fcExpenseFields.style.display = isExpense ? 'block' : 'none';
    }
  });

  fcForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    fcErrorMsg.style.display = 'none';
    const captureType = fcTypeSelect.value;
    const activityId = fcActivitySelect.value;
    const title = document.getElementById('fcTitle').value;
    const nowIso = new Date().toISOString();

    try {
      if (captureType === 'EXPENSE') {
        const vendor = document.getElementById('fcVendor').value;
        const receiptNum = document.getElementById('fcReceiptNum').value;
        const amount = parseFloat(document.getElementById('fcAmount').value);
        const txDate = document.getElementById('fcDate').value;

        if (!vendor || !amount || amount <= 0) {
          throw new Error('Nama vendor dan nominal belanja harus diisi > 0.');
        }

        await apiFetch('/api/expenses', {
          method: 'POST',
          body: JSON.stringify({
            activity_id: activityId,
            vendor_name: vendor,
            description: title,
            amount: amount,
            receipt_number: receiptNum,
            transaction_date: txDate,
            latitude: -6.2088,
            longitude: 106.8456,
            receipt_content: `kuitansi-${activityId}-${vendor}-${receiptNum}-${amount}`,
          }),
        });
      } else {
        await apiFetch(`/api/activities/${activityId}/evidences`, {
          method: 'POST',
          body: JSON.stringify({
            title: title,
            description: `Dokumentasi visual lapangan kegiatan ${activityId}`,
            latitude: -6.2088,
            longitude: 106.8456,
            captured_at: nowIso,
            photo_content: `foto-lapangan-${activityId}-${title}-${nowIso}`,
          }),
        });
      }

      fieldCaptureModal.style.display = 'none';
      await refreshWorkspaceData();
      if (state.activeModule !== 'lo-advance') {
        switchModule('lo-advance');
      }
    } catch (err) {
      fcErrorMsg.textContent = err.message;
      fcErrorMsg.style.display = 'block';
    }
  });

  document.getElementById('btnQueueOfflineDraft')?.addEventListener('click', () => {
    const drafts = JSON.parse(localStorage.getItem('gov_offline_drafts') || '[]');
    const title = document.getElementById('fcTitle').value || 'Draf Kuitansi Lapangan';
    const amount = parseFloat(document.getElementById('fcAmount').value) || 0;
    drafts.push({
      type: fcTypeSelect.value,
      activity_id: fcActivitySelect.value,
      title: title,
      amount: amount,
      queued_at: new Date().toISOString(),
    });
    localStorage.setItem('gov_offline_drafts', JSON.stringify(drafts));
    alert(`✓ Draf berhasil diantrekan secara offline! Total antrean offline: ${drafts.length} item.`);
    fieldCaptureModal.style.display = 'none';
  });

  document.getElementById('btnOpenLoDisbursementModal')?.addEventListener('click', () => {
    const act = state.activities.find((a) => a.status === 'APPROVED') || state.activities[0];
    if (act) {
      openNewDisbursementModal(act.id);
      setTimeout(() => {
        const typeSelect = document.querySelector('.disb-item-type');
        if (typeSelect) {
          typeSelect.value = 'LO_OPERATIONAL_ADVANCE';
        }
      }, 50);
    }
  });

  // --- TICKET 07: EXPENSE RECONCILIATION & CASH SETTLEMENT ---
  async function loadReconciliationView() {
    try {
      const actId = document.getElementById('recActivityFilter')?.value || '';
      const st = document.getElementById('recStatusFilter')?.value || '';
      let url = '/api/expenses?';
      if (actId) url += `activity_id=${encodeURIComponent(actId)}&`;
      if (st) url += `status=${encodeURIComponent(st)}&`;

      const res = await apiRequest(url);
      state.expenses = res.expenses || [];

      try {
        const prevRes = await apiRequest('/api/disbursement-items/dsbi-lo-01/settlement-preview');
        state.settlementPreview = prevRes;
      } catch (e) {
        state.settlementPreview = null;
      }

      renderReconciliationMetrics();
      renderReconciliationTable();
    } catch (err) {
      console.error('Error loading reconciliation view:', err);
    }
  }

  function renderReconciliationMetrics() {
    const totalCount = state.expenses.length;
    const pendingCount = state.expenses.filter((e) => e.status === 'SUBMITTED').length;
    const verifiedSum = state.expenses
      .filter((e) => e.status === 'VERIFIED')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const elTotal = document.getElementById('recTotalCount');
    const elPending = document.getElementById('recPendingCount');
    const elVerified = document.getElementById('recVerifiedAmount');
    const elBadge = document.getElementById('recSettlementBadge');
    const elHint = document.getElementById('recSettlementHint');

    if (elTotal) elTotal.textContent = totalCount;
    if (elPending) elPending.textContent = pendingCount;
    if (elVerified) elVerified.textContent = formatRupiah(verifiedSum);

    if (elBadge && elHint) {
      if (state.settlementPreview) {
        if (state.settlementPreview.current_status === 'SETTLED') {
          elBadge.innerHTML = '<span class="status-badge status-badge--success">Telah Selesai (SETTLED)</span>';
          elHint.textContent = `Sisa kas disetor Rp ${formatRupiah(state.settlementPreview.returned_amount)}`;
        } else if (state.settlementPreview.can_settle) {
          elBadge.innerHTML = '<span class="status-badge status-badge--success">Siap Tutup Panjar</span>';
          elHint.textContent = 'Semua kuitansi telah diperiksa';
        } else {
          elBadge.innerHTML = '<span class="status-badge status-badge--pending">Panjar Aktif</span>';
          elHint.textContent = `${state.settlementPreview.unreviewed_count} kuitansi belum ditelaah`;
        }
      } else {
        elBadge.innerHTML = '<span class="status-badge status-badge--scheduled">Panjar Aktif</span>';
        elHint.textContent = 'Kuitansi dalam pemrosesan';
      }
    }
  }

  function renderReconciliationTable() {
    const tbody = document.getElementById('reconciliationTableBody');
    if (!tbody) return;

    if (state.expenses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px;">Belum ada bukti kuitansi lapangan yang tercatat.</td></tr>`;
      return;
    }

    tbody.innerHTML = state.expenses
      .map((exp) => {
        const val = exp.validation || {};
        const l1Badge = val.l1_budget_overrun
          ? `<span class="status-badge status-badge--cancelled" style="font-size: 10px;" title="Melebihi Plafon Pagu">L1 Overrun</span>`
          : `<span class="status-badge status-badge--success" style="font-size: 10px;">L1 OK</span>`;

        const l2Badge = val.l2_date_out_of_range
          ? `<span class="status-badge status-badge--pending" style="font-size: 10px;" title="Di Luar Jadwal Kegiatan">L2 Luar Tanggal</span>`
          : `<span class="status-badge status-badge--success" style="font-size: 10px;">L2 OK</span>`;

        const l3Dup = val.l3_duplicate_receipt || val.l3_duplicate_hash;
        const l3Badge = l3Dup
          ? `<span class="status-badge status-badge--cancelled" style="font-size: 10px;" title="Kuitansi / Hash Berkas Duplikat">L3 Duplikat</span>`
          : `<span class="status-badge status-badge--success" style="font-size: 10px;">L3 Unik</span>`;

        const statusClass =
          exp.status === 'VERIFIED'
            ? 'status-badge--success'
            : exp.status === 'REJECTED'
              ? 'status-badge--cancelled'
              : 'status-badge--pending';

        return `
          <tr>
            <td>
              <div style="font-weight: 700; color: var(--text-primary);">${escapeHtml(exp.vendor_name)}</div>
              <div class="mono-num" style="font-size: 11px; color: var(--primary);">${escapeHtml(exp.expense_code)}</div>
            </td>
            <td>
              <div class="mono-num" style="font-size: 12px;">${escapeHtml(exp.transaction_date)}</div>
              <div class="breadcrumb" style="font-size: 11px;">${escapeHtml(exp.activity_code || '')}</div>
            </td>
            <td style="text-align: right;">
              <span class="mono-num" style="font-weight: 700; color: var(--text-primary);">${formatRupiah(exp.amount)}</span>
            </td>
            <td>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                ${l1Badge}
                ${l2Badge}
                ${l3Badge}
              </div>
            </td>
            <td>
              <span class="status-badge ${statusClass}">${escapeHtml(exp.status)}</span>
              ${exp.verified_by_name ? `<div class="breadcrumb" style="font-size: 10px; margin-top: 2px;">oleh ${escapeHtml(exp.verified_by_name)}</div>` : ''}
            </td>
            <td>
              <button type="button" class="role-pill btn-inspect-receipt" data-id="${exp.id}">
                Periksa Kuitansi
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    tbody.querySelectorAll('.btn-inspect-receipt').forEach((btn) => {
      btn.addEventListener('click', () => {
        openReceiptReviewModal(btn.dataset.id);
      });
    });
  }

  function openReceiptReviewModal(expenseId) {
    const exp = state.expenses.find((e) => e.id === expenseId);
    if (!exp) return;
    state.currentReviewExpense = exp;

    document.getElementById('revVendorName').textContent = exp.vendor_name;
    document.getElementById('revExpenseCode').textContent = exp.expense_code;
    document.getElementById('revDescription').textContent = exp.description;
    document.getElementById('revTxDate').textContent = exp.transaction_date;
    document.getElementById('revReceiptNumber').textContent = exp.receipt_number || '-';
    document.getElementById('revAmount').textContent = formatRupiah(exp.amount);
    document.getElementById('revReceiptHash').textContent = exp.receipt_hash || 'SHA-256 Tidak Terlampir';
    document.getElementById('revGeotag').textContent =
      exp.latitude && exp.longitude ? `${exp.latitude.toFixed(4)}, ${exp.longitude.toFixed(4)}` : 'Tidak Ada Geotag';
    document.getElementById('revLoUser').textContent = exp.user_name || '-';

    const statusBadge = document.getElementById('revReceiptStatusBadge');
    statusBadge.textContent = exp.status;
    statusBadge.className = `status-badge ${exp.status === 'VERIFIED' ? 'status-badge--success' : exp.status === 'REJECTED' ? 'status-badge--cancelled' : 'status-badge--pending'
      }`;

    // Render L1, L2, L3 validation flags
    const valContainer = document.getElementById('revValidationContainer');
    const val = exp.validation || {};
    const flags = val.flags || [];

    if (val.is_clean) {
      valContainer.innerHTML = `
        <div class="validation-flag-item validation-flag-item--clean">
          <span>✓</span>
          <div><strong>Semua Uji Integritas Lolos:</strong> Kuitansi sesuai pagu anggaran (L1), dalam jadwal kegiatan (L2), dan tidak ditemukan duplikasi kuitansi/hash berkas (L3).</div>
        </div>
      `;
    } else {
      valContainer.innerHTML = flags
        .map((f) => {
          const itemClass = f.level === 'DANGER' ? 'validation-flag-item--danger' : 'validation-flag-item--warning';
          const icon = f.level === 'DANGER' ? '⛔' : '⚠️';
          return `
            <div class="validation-flag-item ${itemClass}">
              <span>${icon}</span>
              <div>
                <strong>${escapeHtml(f.rule)}:</strong> ${escapeHtml(f.message)}
              </div>
            </div>
          `;
        })
        .join('');
    }

    const actionForm = document.getElementById('revActionForm');
    const stampInfo = document.getElementById('revStampInfo');
    const rejDisplay = document.getElementById('revRejectionDisplay');

    if (exp.status === 'SUBMITTED') {
      actionForm.style.display = 'block';
      stampInfo.style.display = 'none';
      document.getElementById('revRejectionNotes').value = '';
    } else {
      actionForm.style.display = 'none';
      stampInfo.style.display = 'block';
      document.getElementById('revVerifierName').textContent = exp.verified_by_name || 'Pejabat Verifikator';
      document.getElementById('revVerifiedTimestamp').textContent = exp.verified_at ? exp.verified_at.replace('T', ' ').slice(0, 19) : '-';
      if (exp.status === 'REJECTED' && exp.rejection_reason) {
        rejDisplay.style.display = 'block';
        rejDisplay.textContent = `Alasan Penolakan: ${exp.rejection_reason}`;
      } else {
        rejDisplay.style.display = 'none';
      }
    }

    document.getElementById('receiptReviewModal').style.display = 'flex';
  }

  async function submitExpenseDecision(decision) {
    if (!state.currentReviewExpense) return;
    const expId = state.currentReviewExpense.id;
    const btn = decision === 'VERIFY' ? document.getElementById('btnVerifyExpense') : document.getElementById('btnRejectExpense');
    const notes = document.getElementById('revRejectionNotes').value.trim();

    if (decision === 'REJECT' && !notes) {
      alert('Alasan penolakan kuitansi wajib disertakan.');
      document.getElementById('revRejectionNotes').focus();
      return;
    }

    // 8-state button discipline
    btn.dataset.state = 'processing';
    btn.textContent = 'Memproses...';

    try {
      await apiRequest(`/api/expenses/${expId}/verify`, {
        method: 'POST',
        body: JSON.stringify({
          decision: decision,
          rejection_reason: notes,
        }),
      });

      btn.dataset.state = 'success';
      btn.textContent = decision === 'VERIFY' ? '✓ Terverifikasi!' : '✕ Ditolak!';

      setTimeout(async () => {
        document.getElementById('receiptReviewModal').style.display = 'none';
        btn.dataset.state = 'idle';
        btn.textContent = decision === 'VERIFY' ? '✓ Verifikasi Kuitansi' : '✕ Tolak Kuitansi';
        await loadReconciliationView();
        await loadDashboardSummary();
      }, 700);
    } catch (err) {
      btn.dataset.state = 'error';
      btn.textContent = 'Gagal';
      alert(err.message);
      setTimeout(() => {
        btn.dataset.state = 'idle';
        btn.textContent = decision === 'VERIFY' ? '✓ Verifikasi Kuitansi' : '✕ Tolak Kuitansi';
      }, 1500);
    }
  }

  async function openSettlementModal() {
    try {
      const prev = await apiRequest('/api/disbursement-items/dsbi-lo-01/settlement-preview');
      state.settlementPreview = prev;

      document.getElementById('stlAdvanceAmount').textContent = formatRupiah(prev.advance_amount);
      document.getElementById('stlVerifiedAmount').textContent = formatRupiah(prev.verified_expense_amount);
      document.getElementById('stlRemainingAmount').textContent = formatRupiah(prev.remaining_cash_to_return);

      const unreviewedWarning = document.getElementById('stlUnreviewedWarning');
      const submitBtn = document.getElementById('btnSubmitSettlement');
      const returnedInput = document.getElementById('stlReturnedAmount');

      if (prev.unreviewed_count > 0) {
        unreviewedWarning.style.display = 'block';
        document.getElementById('stlUnreviewedCount').textContent = prev.unreviewed_count;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      } else {
        unreviewedWarning.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        returnedInput.value = prev.remaining_cash_to_return;
      }

      document.getElementById('settlementErrorMsg').style.display = 'none';
      document.getElementById('settlementModal').style.display = 'flex';
    } catch (err) {
      alert('Gagal memuat pratinjau tutup panjar: ' + err.message);
    }
  }

  // Event Listeners for Ticket 07
  document.getElementById('btnOpenSettlementModal')?.addEventListener('click', openSettlementModal);
  document.getElementById('btnCloseSettlementModal')?.addEventListener('click', () => {
    document.getElementById('settlementModal').style.display = 'none';
  });
  document.getElementById('btnCancelSettlement')?.addEventListener('click', () => {
    document.getElementById('settlementModal').style.display = 'none';
  });
  document.getElementById('btnCloseReviewModal')?.addEventListener('click', () => {
    document.getElementById('receiptReviewModal').style.display = 'none';
  });

  document.getElementById('btnVerifyExpense')?.addEventListener('click', () => {
    submitExpenseDecision('VERIFY');
  });

  document.getElementById('btnRejectExpense')?.addEventListener('click', () => {
    submitExpenseDecision('REJECT');
  });

  document.getElementById('recStatusFilter')?.addEventListener('change', loadReconciliationView);
  document.getElementById('recActivityFilter')?.addEventListener('change', loadReconciliationView);
  document.getElementById('btnRefreshReconciliation')?.addEventListener('click', loadReconciliationView);

  document.getElementById('settlementForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitSettlement');
    const errEl = document.getElementById('settlementErrorMsg');
    errEl.style.display = 'none';

    const returnedAmount = parseFloat(document.getElementById('stlReturnedAmount').value) || 0;
    const notes = document.getElementById('stlNotes').value.trim();

    btn.dataset.state = 'processing';
    btn.textContent = 'Menyelesaikan...';

    try {
      await apiRequest('/api/disbursement-items/dsbi-lo-01/settle', {
        method: 'POST',
        body: JSON.stringify({
          returned_amount: returnedAmount,
          settlement_notes: notes,
        }),
      });

      btn.dataset.state = 'success';
      btn.textContent = '✓ Panjar Ditutup!';

      setTimeout(async () => {
        document.getElementById('settlementModal').style.display = 'none';
        btn.dataset.state = 'idle';
        btn.textContent = 'Konfirmasi Tutup Panjar (SETTLED)';
        await loadReconciliationView();
        await loadLoCashbook();
        await loadDashboardSummary();
      }, 700);
    } catch (err) {
      btn.dataset.state = 'error';
      btn.textContent = 'Gagal';
      errEl.textContent = err.message;
      errEl.style.display = 'block';
      setTimeout(() => {
        btn.dataset.state = 'idle';
        btn.textContent = 'Konfirmasi Tutup Panjar (SETTLED)';
      }, 1500);
    }
  });

  // --- TICKET 08: UNIFIED ACCOUNTABILITY REPORT & AUDIT DRILL-DOWN ---
  async function loadAccountabilityReport(activityId) {
    try {
      const select = document.getElementById('auditActivitySelect');
      if (select && select.options.length <= 1 && state.activities && state.activities.length > 0) {
        select.innerHTML = '';
        state.activities.forEach((act) => {
          const opt = document.createElement('option');
          opt.value = act.id;
          opt.textContent = `${act.code} - ${act.title.substring(0, 36)}...`;
          select.appendChild(opt);
        });
      }

      const actId = activityId || (select ? select.value : null) || (state.activities && state.activities[0] ? state.activities[0].id : 'act-2026-000');
      if (select && select.value !== actId) {
        select.value = actId;
      }

      const res = await apiFetch(`/api/activities/${encodeURIComponent(actId)}/accountability-report`);
      state.accountabilityReport = res.report || res;
      renderAccountabilityReport();
    } catch (err) {
      console.error('Error loading accountability report:', err);
    }
  }

  function renderAccountabilityReport() {
    const report = state.accountabilityReport;
    if (!report) return;

    const fin = report.financial_summary || {};
    const val = report.validation_summary || {};

    // 1. KPI Cards
    const elPagu = document.getElementById('rptPaguTotal');
    if (elPagu) elPagu.textContent = formatRupiah(fin.total_budget || 0);

    const elPayroll = document.getElementById('rptPayrollTotal');
    if (elPayroll) elPayroll.textContent = formatRupiah(fin.total_realized_payroll || 0);

    const elExpenses = document.getElementById('rptExpensesTotal');
    if (elExpenses) elExpenses.textContent = formatRupiah(fin.total_realized_expenses || 0);

    const elTotalRealized = document.getElementById('rptTotalRealized');
    if (elTotalRealized) elTotalRealized.textContent = formatRupiah(fin.total_realized || 0);

    const elRealizationPct = document.getElementById('rptRealizationPct');
    if (elRealizationPct) elRealizationPct.textContent = `${fin.realization_percentage || 0}% serapan`;

    const elRemaining = document.getElementById('rptRemainingBudget');
    if (elRemaining) elRemaining.textContent = formatRupiah(fin.remaining_budget || 0);

    // 2. Compliance Badge
    const badge = document.getElementById('auditComplianceBadge');
    if (badge) {
      if (!val.flagged_expenses_count || val.flagged_expenses_count === 0) {
        badge.className = 'status-badge status-badge--success';
        badge.textContent = '100% Integritas Kriptografis Lolos';
      } else {
        badge.className = 'status-badge status-badge--danger';
        badge.textContent = `⚠ ${val.flagged_expenses_count} Peringatan Integritas Terdeteksi`;
      }
    }

    // 3. Tab 1: Realisasi RAB vs Aktual
    const rabBody = document.getElementById('rptRabTableBody');
    if (rabBody) {
      const breakdown = report.budget_breakdown || [];
      if (breakdown.length === 0) {
        rabBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 12px; color: var(--text-muted);">Tidak ada pos anggaran.</td></tr>';
      } else {
        rabBody.innerHTML = breakdown.map((b) => `
          <tr>
            <td>
              <div style="font-weight: 600; color: var(--text-primary);">${b.item_name}</div>
              <div class="breadcrumb" style="font-size: 11px;">${b.category} · ${b.quantity} ${b.unit} @ ${formatRupiah(b.unit_price)}</div>
            </td>
            <td style="text-align: right;" class="mono-num">${formatRupiah(b.budget_pagu)}</td>
            <td style="text-align: right;" class="mono-num">${formatRupiah(b.realized_payroll)}</td>
            <td style="text-align: right;" class="mono-num">${formatRupiah(b.realized_expenses)}</td>
            <td style="text-align: right; font-weight: 700;" class="mono-num">${formatRupiah(b.total_realized)}</td>
            <td style="text-align: right; color: ${b.variance >= 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)'};" class="mono-num">${formatRupiah(b.variance)}</td>
            <td style="text-align: center;">
              <span class="status-badge ${b.realization_percentage > 100 ? 'status-badge--danger' : 'status-badge--success'}">
                ${b.realization_percentage}%
              </span>
            </td>
          </tr>
        `).join('');
      }
    }

    // 4. Tab 2: Direct Payroll Staf
    const payrollBody = document.getElementById('rptPayrollTableBody');
    if (payrollBody) {
      const payrolls = report.payroll_disbursements || [];
      if (payrolls.length === 0) {
        payrollBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 12px; color: var(--text-muted);">Tidak ada transaksi direct payroll.</td></tr>';
      } else {
        payrollBody.innerHTML = payrolls.map((p) => `
          <tr>
            <td>
              <div style="font-weight: 600; color: var(--text-primary);">${p.beneficiary_name}</div>
              <div class="breadcrumb" style="font-size: 11px;">${p.bank_name} - ${p.account_number}</div>
            </td>
            <td class="mono-num" style="font-size: 12px; color: var(--text-secondary);">${p.tax_id_npwp || '-'}</td>
            <td style="text-align: right; font-weight: 700; color: var(--primary);" class="mono-num">${formatRupiah(p.net_amount)}</td>
            <td class="mono-num" style="font-size: 11px;">${p.transfer_reference_no || '-'}</td>
            <td>
              <span class="status-badge ${p.status === 'PAID' || p.status === 'SETTLED' ? 'status-badge--success' : 'status-badge--warning'}">
                ${p.status}
              </span>
            </td>
            <td class="mono-num" style="font-size: 10px; color: var(--text-muted);">
              ${p.transfer_receipt_hash ? p.transfer_receipt_hash.substring(0, 16) + '...' : '-'}
            </td>
            <td>
              <button type="button" class="role-pill btn-drill-down" data-entity-type="DISBURSEMENT_ITEM" data-entity-id="${p.id}">
                🔍 Bukti Transfer
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // 5. Tab 3: Field Expenses & Visual Evidences
    const expBody = document.getElementById('rptExpensesTableBody');
    if (expBody) {
      const expenses = report.field_expenses || [];
      if (expenses.length === 0) {
        expBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 12px; color: var(--text-muted);">Tidak ada bukti kuitansi lapangan.</td></tr>';
      } else {
        expBody.innerHTML = expenses.map((e) => `
          <tr>
            <td>
              <div class="mono-num" style="font-weight: 600; color: var(--primary); font-size: 12px;">${e.expense_code}</div>
              <div class="breadcrumb" style="font-size: 11px;">${e.vendor_name}</div>
            </td>
            <td class="mono-num" style="font-size: 12px; color: var(--text-secondary);">${e.transaction_date}</td>
            <td style="font-size: 12px; color: var(--text-secondary);">${e.description}</td>
            <td style="text-align: right; font-weight: 700; color: var(--status-success-text);" class="mono-num">${formatRupiah(e.amount)}</td>
            <td>
              <span class="status-badge ${e.status === 'VERIFIED' ? 'status-badge--success' : (e.status === 'REJECTED' ? 'status-badge--danger' : 'status-badge--warning')}">
                ${e.status}
              </span>
              <div class="breadcrumb" style="font-size: 10px; margin-top: 2px;">${e.verified_by_name || '-'}</div>
            </td>
            <td class="mono-num" style="font-size: 10px; color: var(--text-muted);">
              ${e.receipt_hash ? e.receipt_hash.substring(0, 16) + '...' : '-'}
            </td>
            <td>
              <button type="button" class="role-pill btn-drill-down" data-entity-type="EXPENSE" data-entity-id="${e.id}">
                🔍 Kuitansi &amp; Hash
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // 6. Tab 4: Audit Trail
    const auditBody = document.getElementById('rptAuditTableBody');
    if (auditBody) {
      const logs = report.audit_trail || [];
      if (logs.length === 0) {
        auditBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 12px; color: var(--text-muted);">Tidak ada rekaman audit trail.</td></tr>';
      } else {
        auditBody.innerHTML = logs.map((a) => `
          <tr>
            <td class="mono-num" style="font-size: 11px; color: var(--text-secondary);">${(a.created_at || '').substring(0, 19).replace('T', ' ')}</td>
            <td style="font-weight: 600; font-size: 12px; color: var(--text-primary);">${a.action}</td>
            <td style="font-size: 12px; color: var(--text-secondary);">${a.actor_name} <span class="status-badge status-badge--success" style="font-size: 9px; padding: 1px 4px;">${a.actor_role}</span></td>
            <td class="mono-num" style="font-size: 11px; color: var(--primary);">${a.entity_type}</td>
            <td class="mono-num" style="font-size: 11px; color: var(--text-muted); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${JSON.stringify(a.details || {})}
            </td>
          </tr>
        `).join('');
      }
    }
  }

  function switchAuditTab(tabKey) {
    const tabs = ['rab', 'payroll', 'expenses', 'audit'];
    tabs.forEach((k) => {
      const btn = document.getElementById(`tabBtn${k.charAt(0).toUpperCase() + k.slice(1)}`);
      const content = document.getElementById(`tabContent${k.charAt(0).toUpperCase() + k.slice(1)}`);
      const isActive = k === tabKey;
      if (btn) {
        btn.classList.toggle('active', isActive);
        btn.style.borderBottom = isActive ? '2px solid var(--primary)' : 'none';
      }
      if (content) {
        content.style.display = isActive ? 'block' : 'none';
      }
    });
  }

  async function openDrillDownModal(entityType, entityId) {
    const modal = document.getElementById('drillDownModal');
    if (!modal) return;

    try {
      const res = await apiFetch(`/api/drill-down/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`);
      const data = res.drill_down || res;

      document.getElementById('ddTitle').textContent = `Penelusuran Bukti Sumber: ${data.entity_type}`;
      document.getElementById('ddEntityType').textContent = data.entity_type;
      document.getElementById('ddEntityHeading').textContent = data.title || '-';
      document.getElementById('ddAmount').textContent = formatRupiah(data.amount || 0);
      document.getElementById('ddHash').textContent = data.proof_hash || '(Belum berstempel kriptografis)';

      const metaContainer = document.getElementById('ddMetadataList');
      if (metaContainer) {
        const item = data.data || {};
        let metaHtml = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">';
        if (data.entity_type === 'EXPENSE') {
          metaHtml += `
            <div><strong>Kode Belanja:</strong> ${item.expense_code || '-'}</div>
            <div><strong>Tanggal:</strong> ${item.transaction_date || '-'}</div>
            <div><strong>Vendor:</strong> ${item.vendor_name || '-'}</div>
            <div><strong>No. Kuitansi:</strong> ${item.receipt_number || '-'}</div>
            <div><strong>Status Verifikasi:</strong> ${item.status || '-'}</div>
            <div><strong>Verifikator:</strong> ${item.verified_by_name || '-'}</div>
            <div style="grid-column: span 2;"><strong>Uraian:</strong> ${item.description || '-'}</div>
          `;
        } else if (data.entity_type === 'DISBURSEMENT_ITEM') {
          metaHtml += `
            <div><strong>Penerima:</strong> ${item.beneficiary_name || '-'}</div>
            <div><strong>Rekening:</strong> ${item.bank_name || '-'} ${item.account_number || ''}</div>
            <div><strong>NPWP:</strong> ${item.tax_id_npwp || '-'}</div>
            <div><strong>Status Transfer:</strong> ${item.status || '-'}</div>
            <div><strong>No. Referensi:</strong> ${item.transfer_reference_no || '-'}</div>
            <div><strong>Tanggal Transfer:</strong> ${item.transfer_date || '-'}</div>
          `;
        } else {
          metaHtml += `<div style="grid-column: span 2;"><pre class="mono-num" style="font-size: 11px; margin: 0; font-family: var(--font-mono);">${JSON.stringify(item, null, 2)}</pre></div>`;
        }
        metaHtml += '</div>';
        metaContainer.innerHTML = metaHtml;
      }

      const feed = document.getElementById('ddTimelineFeed');
      if (feed) {
        const timeline = data.timeline || [];
        if (timeline.length === 0) {
          feed.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); text-align: center; padding: 10px;">Belum ada jejak audit tersimpan.</div>';
        } else {
          feed.innerHTML = timeline.map((t) => `
            <div class="audit-item" style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
              <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <strong>${t.action}</strong>
                <span class="mono-num" style="color: var(--text-muted); font-size: 10px;">${(t.timestamp || '').substring(0, 19).replace('T', ' ')}</span>
              </div>
              <div style="font-size: 11px; color: var(--text-secondary);">
                Oleh: ${t.actor || '-'} (${t.role || '-'})
              </div>
            </div>
          `).join('');
        }
      }

      modal.style.display = 'flex';
    } catch (err) {
      alert('Gagal memuat detail drill-down: ' + err.message);
    }
  }

  // Event Listeners for Ticket 08
  document.getElementById('auditActivitySelect')?.addEventListener('change', (e) => {
    loadAccountabilityReport(e.target.value);
  });

  document.getElementById('tabBtnRab')?.addEventListener('click', () => switchAuditTab('rab'));
  document.getElementById('tabBtnPayroll')?.addEventListener('click', () => switchAuditTab('payroll'));
  document.getElementById('tabBtnExpenses')?.addEventListener('click', () => switchAuditTab('expenses'));
  document.getElementById('tabBtnAudit')?.addEventListener('click', () => switchAuditTab('audit'));

  document.getElementById('btnCloseDrillDownModal')?.addEventListener('click', () => {
    const modal = document.getElementById('drillDownModal');
    if (modal) modal.style.display = 'none';
  });

  document.getElementById('btnCloseDrillDownFooter')?.addEventListener('click', () => {
    const modal = document.getElementById('drillDownModal');
    if (modal) modal.style.display = 'none';
  });

  document.addEventListener('click', (e) => {
    const drillBtn = e.target.closest('.btn-drill-down');
    if (drillBtn) {
      const entityType = drillBtn.dataset.entityType;
      const entityId = drillBtn.dataset.entityId;
      if (entityType && entityId) {
        openDrillDownModal(entityType, entityId);
      }
    }
  });

  document.getElementById('btnExportCsv')?.addEventListener('click', async () => {
    const select = document.getElementById('auditActivitySelect');
    const actId = (select ? select.value : null) || 'act-2026-000';
    try {
      const res = await apiFetch(`/api/activities/${encodeURIComponent(actId)}/export-csv`);
      const csvData = res.csv_data;
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.filename || `LPJ-${actId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengunduh CSV: ' + err.message);
    }
  });

  document.getElementById('btnExportHtml')?.addEventListener('click', async () => {
    const select = document.getElementById('auditActivitySelect');
    const actId = (select ? select.value : null) || 'act-2026-000';
    try {
      const res = await apiFetch(`/api/activities/${encodeURIComponent(actId)}/export-html`);
      const win = window.open('', '_blank');
      if (win) {
        win.document.open();
        win.document.write(res.html_content);
        win.document.close();
      } else {
        alert('Jendela cetak terblokir oleh peramban. Izinkan pop-up untuk mencetak LPJ.');
      }
    } catch (err) {
      alert('Gagal membuka cetakan LPJ: ' + err.message);
    }
  });

  document.querySelectorAll('.metric-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.metric-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      const m = card.dataset.metric;
      if (m === 'lo') switchModule('lo-advance');
      else if (m === 'payroll') switchModule('payroll');
      else if (m === 'pagu') switchModule('planning');
    });
  });

  document.getElementById('hs_info_toggle').addEventListener('click', () => {
    const shell = document.getElementById('workspaceShell');
    const panel = document.getElementById('infoPanel');
    const collapsed = shell.classList.toggle('infopanel-collapsed');
    panel.style.opacity = collapsed ? '0.2' : '1';
  });

  document.getElementById('btnToggle8State').addEventListener('click', () => {
    const el = document.getElementById('eightStateInspector');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('btnOpenLoginModal').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'flex';
  });

  document.getElementById('btnCloseLoginModal').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'none';
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginErrorMsg');
    errEl.style.display = 'none';
    try {
      await loginWithCredentials(email, password);
      document.getElementById('loginModal').style.display = 'none';
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });

  bootstrap();
})();
