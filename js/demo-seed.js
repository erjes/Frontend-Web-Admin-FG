/* Seed demo — diturunkan dari respons API sungguhan lalu diperkaya. */
window.DEMO_SEED = {
 "generated_at": "2026-10-27T09:28:09.949635+00:00",
 "users": [
  {
   "id": "usr-admin-01",
   "full_name": "Radja (Lead Developer)",
   "email": "radja@dinas.go.id",
   "role": "ADMIN",
   "role_label": "Administrator Sistem",
   "title": "System Architect & Admin",
   "bank_name": "Bank Mandiri",
   "account_number": "1370001010101",
   "is_active": true,
   "permissions": {
    "label": "Administrator Sistem",
    "can_create_plan": false,
    "can_approve_plan": false,
    "can_disburse_funds": false,
    "can_upload_field_receipt": false,
    "can_manage_users": true,
    "can_view_audit_trail": true,
    "can_override_approved_records": false,
    "modules": [
     "dashboard",
     "users",
     "audit",
     "system-tokens"
    ]
   }
  },
  {
   "id": "usr-aud-01",
   "full_name": "Dr. Bambang Prakoso, CIA",
   "email": "auditor@dinas.go.id",
   "role": "AUDITOR",
   "role_label": "Auditor / Inspektorat",
   "title": "Auditor Inspektorat Utama",
   "bank_name": "BRI",
   "account_number": "034101000112233",
   "is_active": true,
   "permissions": {
    "label": "Auditor / Inspektorat",
    "can_create_plan": false,
    "can_approve_plan": false,
    "can_disburse_funds": false,
    "can_upload_field_receipt": false,
    "can_manage_users": false,
    "can_view_audit_trail": true,
    "can_override_approved_records": false,
    "modules": [
     "dashboard",
     "planning",
     "payroll",
     "lo-advance",
     "reconciliation",
     "reporting",
     "audit"
    ]
   }
  },
  {
   "id": "usr-fin-01",
   "full_name": "Hendra Wijaya, S.Ak.",
   "email": "finance@dinas.go.id",
   "role": "FINANCE",
   "role_label": "Bendahara & Penggajian",
   "title": "Bendahara Pengeluaran & Payroll",
   "bank_name": "Bank Mandiri",
   "account_number": "1370098877665",
   "is_active": true,
   "permissions": {
    "label": "Bendahara & Penggajian",
    "can_create_plan": false,
    "can_approve_plan": false,
    "can_disburse_funds": true,
    "can_upload_field_receipt": false,
    "can_manage_users": false,
    "can_view_audit_trail": true,
    "can_override_approved_records": false,
    "modules": [
     "dashboard",
     "payroll",
     "lo-advance",
     "reconciliation",
     "reporting"
    ]
   }
  },
  {
   "id": "usr-lo-01",
   "full_name": "M. Farhan Pratama",
   "email": "lo@dinas.go.id",
   "role": "LO",
   "role_label": "Liaison Officer (Lapangan)",
   "title": "Liaison Officer Lapangan",
   "bank_name": "BCA",
   "account_number": "5410992831",
   "is_active": true,
   "permissions": {
    "label": "Liaison Officer (Lapangan)",
    "can_create_plan": false,
    "can_approve_plan": false,
    "can_disburse_funds": false,
    "can_upload_field_receipt": true,
    "can_manage_users": false,
    "can_view_audit_trail": false,
    "can_override_approved_records": false,
    "modules": [
     "dashboard",
     "lo-cashbook",
     "field-capture"
    ]
   }
  },
  {
   "id": "usr-pj-01",
   "full_name": "Budi Santoso, M.Si",
   "email": "pj@dinas.go.id",
   "role": "PJ",
   "role_label": "Penanggung Jawab Kegiatan",
   "title": "Penanggung Jawab Program",
   "bank_name": "BRI",
   "account_number": "034101000789302",
   "is_active": true,
   "permissions": {
    "label": "Penanggung Jawab Kegiatan",
    "can_create_plan": true,
    "can_approve_plan": false,
    "can_disburse_funds": false,
    "can_upload_field_receipt": false,
    "can_manage_users": false,
    "can_view_audit_trail": true,
    "can_override_approved_records": false,
    "modules": [
     "dashboard",
     "planning",
     "reporting",
     "audit"
    ]
   }
  },
  {
   "id": "usr-sv-01",
   "full_name": "Siti Rahma, S.E., Ak.",
   "email": "sv@dinas.go.id",
   "role": "SV",
   "role_label": "Supervisor & Verifikator",
   "title": "Supervisor & Pejabat Verifikator",
   "bank_name": "BNI",
   "account_number": "0889231145",
   "is_active": true,
   "permissions": {
    "label": "Supervisor & Verifikator",
    "can_create_plan": false,
    "can_approve_plan": true,
    "can_disburse_funds": false,
    "can_upload_field_receipt": false,
    "can_manage_users": false,
    "can_view_audit_trail": true,
    "can_override_approved_records": false,
    "modules": [
     "dashboard",
     "planning",
     "reconciliation",
     "reporting",
     "audit"
    ]
   }
  }
 ],
 "role_matrix": {
  "ADMIN": {
   "label": "Administrator Sistem",
   "can_create_plan": false,
   "can_approve_plan": false,
   "can_disburse_funds": false,
   "can_upload_field_receipt": false,
   "can_manage_users": true,
   "can_view_audit_trail": true,
   "can_override_approved_records": false,
   "modules": [
    "dashboard",
    "users",
    "audit",
    "system-tokens"
   ]
  },
  "PJ": {
   "label": "Penanggung Jawab Kegiatan",
   "can_create_plan": true,
   "can_approve_plan": false,
   "can_disburse_funds": false,
   "can_upload_field_receipt": false,
   "can_manage_users": false,
   "can_view_audit_trail": true,
   "can_override_approved_records": false,
   "modules": [
    "dashboard",
    "planning",
    "reporting",
    "audit"
   ]
  },
  "SV": {
   "label": "Supervisor & Verifikator",
   "can_create_plan": false,
   "can_approve_plan": true,
   "can_disburse_funds": false,
   "can_upload_field_receipt": false,
   "can_manage_users": false,
   "can_view_audit_trail": true,
   "can_override_approved_records": false,
   "modules": [
    "dashboard",
    "planning",
    "reconciliation",
    "reporting",
    "audit"
   ]
  },
  "FINANCE": {
   "label": "Bendahara & Penggajian",
   "can_create_plan": false,
   "can_approve_plan": false,
   "can_disburse_funds": true,
   "can_upload_field_receipt": false,
   "can_manage_users": false,
   "can_view_audit_trail": true,
   "can_override_approved_records": false,
   "modules": [
    "dashboard",
    "payroll",
    "lo-advance",
    "reconciliation",
    "reporting"
   ]
  },
  "LO": {
   "label": "Liaison Officer (Lapangan)",
   "can_create_plan": false,
   "can_approve_plan": false,
   "can_disburse_funds": false,
   "can_upload_field_receipt": true,
   "can_manage_users": false,
   "can_view_audit_trail": false,
   "can_override_approved_records": false,
   "modules": [
    "dashboard",
    "lo-cashbook",
    "field-capture"
   ]
  },
  "AUDITOR": {
   "label": "Auditor / Inspektorat",
   "can_create_plan": false,
   "can_approve_plan": false,
   "can_disburse_funds": false,
   "can_upload_field_receipt": false,
   "can_manage_users": false,
   "can_view_audit_trail": true,
   "can_override_approved_records": false,
   "modules": [
    "dashboard",
    "planning",
    "payroll",
    "lo-advance",
    "reconciliation",
    "reporting",
    "audit"
   ]
  }
 },
 "bank_accounts": [
  {
   "id": "ba-03",
   "beneficiary_name": "Budi Santoso, M.Si",
   "bank_name": "BRI",
   "account_number": "034101000789302",
   "tax_id_npwp": "03.456.789.0-034.000",
   "user_id": "usr-pj-01",
   "created_at": "2026-10-23T10:01:30.133300+00:00"
  },
  {
   "id": "ba-01",
   "beneficiary_name": "Dr. Ir. Hendra Gunawan",
   "bank_name": "Bank Mandiri",
   "account_number": "1370002233445",
   "tax_id_npwp": "01.234.567.8-012.000",
   "user_id": null,
   "created_at": "2026-10-23T10:01:30.133300+00:00"
  },
  {
   "id": "ba-05",
   "beneficiary_name": "M. Farhan Pratama (LO)",
   "bank_name": "BCA",
   "account_number": "5410992831",
   "tax_id_npwp": "05.678.901.2-056.000",
   "user_id": "usr-lo-01",
   "created_at": "2026-10-23T10:01:30.133300+00:00"
  },
  {
   "id": "ba-02",
   "beneficiary_name": "Prof. Dr. Anita Lestari, M.Si",
   "bank_name": "Bank BCA",
   "account_number": "5410889922",
   "tax_id_npwp": "02.345.678.9-023.000",
   "user_id": null,
   "created_at": "2026-10-23T10:01:30.133300+00:00"
  },
  {
   "id": "ba-04",
   "beneficiary_name": "Siti Rahma, S.E., Ak.",
   "bank_name": "BNI",
   "account_number": "0889231145",
   "tax_id_npwp": "04.567.890.1-045.000",
   "user_id": "usr-sv-01",
   "created_at": "2026-10-23T10:01:30.133300+00:00"
  }
 ],
 "categories": {
  "PAYROLL_HONOR": "Honorarium & PencairanStaf",
  "LO_OPERATIONAL": "Panjar Operasional LO",
  "LOGISTICS": "Logistik & Perlengkapan",
  "ACCOMMODATION": "Akomodasi & Konsumsi",
  "OTHER": "Lain-lain Kedinasan"
 },
 "activities": [
  {
   "id": "act-2026-001",
   "code": "ACT-2026-001",
   "title": "Bimbingan Teknis Tata Kelola & Akuntabilitas Keuangan Daerah",
   "description": "Pelatihan terpadu bagi bendahara dan pelaksana kegiatan dinas terkait pelaporan berbasis bukti.",
   "start_date": "2026-11-02",
   "end_date": "2026-11-05",
   "total_budget": 300000000.0,
   "status": "SUBMITTED",
   "version": 1,
   "is_locked": true,
   "created_by": "usr-pj-01",
   "created_by_name": "Budi Santoso, M.Si",
   "assigned_lo_id": "usr-lo-01",
   "assigned_lo_name": "M. Farhan Pratama",
   "budget_items": [
    {
     "id": "rab-01b3126d",
     "activity_id": "act-2026-001",
     "category": "PAYROLL_HONOR",
     "category_label": "Honorarium & PencairanStaf",
     "item_name": "Honorarium Narasumber Utama & Moderator",
     "quantity": 8,
     "unit": "OJ",
     "unit_price": 15000000.0,
     "total_price": 120000000.0
    },
    {
     "id": "rab-2fea393e",
     "activity_id": "act-2026-001",
     "category": "LO_OPERATIONAL",
     "category_label": "Panjar Operasional LO",
     "item_name": "Panjar Operasional Akomodasi & Sewa Kendaraan Lapangan (LO)",
     "quantity": 1,
     "unit": "Paket",
     "unit_price": 55000000.0,
     "total_price": 55000000.0
    },
    {
     "id": "rab-c6046f23",
     "activity_id": "act-2026-001",
     "category": "ACCOMMODATION",
     "category_label": "Akomodasi & Konsumsi",
     "item_name": "Paket Fullboard Meeting Peserta & Konsumsi",
     "quantity": 50,
     "unit": "Orang",
     "unit_price": 2500000.0,
     "total_price": 125000000.0
    }
   ],
   "approval_logs": [
    {
     "id": "apr-3bd0712c",
     "activity_id": "act-2026-001",
     "user_id": "usr-pj-01",
     "actor_name": "Budi Santoso, M.Si",
     "actor_role": "PJ",
     "action": "SUBMIT",
     "notes": "Pengajuan awal rencana kegiatan.",
     "previous_status": "DRAFT",
     "next_status": "SUBMITTED",
     "version_number": 1,
     "snapshot": {
      "code": "ACT-2026-001",
      "title": "Bimbingan Teknis Tata Kelola & Akuntabilitas Keuangan Daerah",
      "description": "Pelatihan terpadu bagi bendahara dan pelaksana kegiatan dinas terkait pelaporan berbasis bukti.",
      "start_date": "2026-11-02",
      "end_date": "2026-11-05",
      "status": "SUBMITTED",
      "version": 1,
      "total_budget": 300000000.0,
      "budget_items": [
       {
        "id": "rab-01b3126d",
        "category": "PAYROLL_HONOR",
        "item_name": "Honorarium Narasumber Utama & Moderator",
        "quantity": 8,
        "unit": "OJ",
        "unit_price": 15000000.0,
        "total_price": 120000000.0
       },
       {
        "id": "rab-2fea393e",
        "category": "LO_OPERATIONAL",
        "item_name": "Panjar Operasional Akomodasi & Sewa Kendaraan Lapangan (LO)",
        "quantity": 1,
        "unit": "Paket",
        "unit_price": 55000000.0,
        "total_price": 55000000.0
       },
       {
        "id": "rab-c6046f23",
        "category": "ACCOMMODATION",
        "item_name": "Paket Fullboard Meeting Peserta & Konsumsi",
        "quantity": 50,
        "unit": "Orang",
        "unit_price": 2500000.0,
        "total_price": 125000000.0
       }
      ]
     },
     "timestamp": "2026-10-23T10:01:30.133981+00:00"
    }
   ],
   "created_at": "2026-10-23T10:01:30.133467+00:00",
   "updated_at": "2026-10-23T10:01:30.133467+00:00"
  },
  {
   "id": "act-2026-002",
   "code": "ACT-2026-002",
   "title": "Supervisi & Verifikasi Lapangan Kegiatan Triwulan IV",
   "description": "Kunjungan pengawasan fisik dan pemeriksaan bukti kuitansi lapangan di 4 wilayah kerja.",
   "start_date": "2026-11-12",
   "end_date": "2026-11-16",
   "total_budget": 80000000.0,
   "status": "DRAFT",
   "version": 1,
   "is_locked": false,
   "created_by": "usr-pj-01",
   "created_by_name": "Budi Santoso, M.Si",
   "assigned_lo_id": "usr-lo-01",
   "assigned_lo_name": "M. Farhan Pratama",
   "budget_items": [
    {
     "id": "rab-ba27d67d",
     "activity_id": "act-2026-002",
     "category": "PAYROLL_HONOR",
     "category_label": "Honorarium & PencairanStaf",
     "item_name": "Uang Harian Tim Supervisi Lapangan",
     "quantity": 10,
     "unit": "OH",
     "unit_price": 5000000.0,
     "total_price": 50000000.0
    },
    {
     "id": "rab-d81e8aad",
     "activity_id": "act-2026-002",
     "category": "LO_OPERATIONAL",
     "category_label": "Panjar Operasional LO",
     "item_name": "Panjar Operasional Tiket, BBM, & Logistik LO",
     "quantity": 1,
     "unit": "Paket",
     "unit_price": 30000000.0,
     "total_price": 30000000.0
    }
   ],
   "approval_logs": [],
   "created_at": "2026-10-23T10:01:30.133467+00:00",
   "updated_at": "2026-10-23T10:01:30.133467+00:00"
  },
  {
   "id": "act-2026-000",
   "code": "ACT-2026-000",
   "title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "description": "Kegiatan koordinasi awal tahun yang telah disahkan dan siap untuk pencairan honor staf.",
   "start_date": "2026-10-15",
   "end_date": "2026-10-17",
   "total_budget": 60000000.0,
   "status": "APPROVED",
   "version": 1,
   "is_locked": true,
   "created_by": "usr-pj-01",
   "created_by_name": "Budi Santoso, M.Si",
   "assigned_lo_id": "usr-lo-01",
   "assigned_lo_name": "M. Farhan Pratama",
   "budget_items": [
    {
     "id": "rab-5ef03101",
     "activity_id": "act-2026-000",
     "category": "PAYROLL_HONOR",
     "category_label": "Honorarium & PencairanStaf",
     "item_name": "Honorarium Narasumber Ahli & Fasilitator",
     "quantity": 4,
     "unit": "OJ",
     "unit_price": 10000000.0,
     "total_price": 40000000.0
    },
    {
     "id": "rab-ec314aab",
     "activity_id": "act-2026-000",
     "category": "LO_OPERATIONAL",
     "category_label": "Panjar Operasional LO",
     "item_name": "Panjar Operasional LO Pendukung Rakor",
     "quantity": 1,
     "unit": "Paket",
     "unit_price": 20000000.0,
     "total_price": 20000000.0
    }
   ],
   "approval_logs": [
    {
     "id": "apr-5dcf3ce6",
     "activity_id": "act-2026-000",
     "user_id": "usr-sv-01",
     "actor_name": "Siti Rahma, S.E., Ak.",
     "actor_role": "SV",
     "action": "APPROVE",
     "notes": "Disahkan sesuai pagu anggaran rakor.",
     "previous_status": "SUBMITTED",
     "next_status": "APPROVED",
     "version_number": 1,
     "snapshot": {
      "code": "ACT-2026-000",
      "title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
      "description": "Kegiatan koordinasi awal tahun yang telah disahkan dan siap untuk pencairan honor staf.",
      "start_date": "2026-10-15",
      "end_date": "2026-10-17",
      "status": "APPROVED",
      "version": 1,
      "total_budget": 60000000.0,
      "budget_items": [
       {
        "id": "rab-5ef03101",
        "category": "PAYROLL_HONOR",
        "item_name": "Honorarium Narasumber Ahli & Fasilitator",
        "quantity": 4,
        "unit": "OJ",
        "unit_price": 10000000.0,
        "total_price": 40000000.0
       },
       {
        "id": "rab-ec314aab",
        "category": "LO_OPERATIONAL",
        "item_name": "Panjar Operasional LO Pendukung Rakor",
        "quantity": 1,
        "unit": "Paket",
        "unit_price": 20000000.0,
        "total_price": 20000000.0
       }
      ]
     },
     "timestamp": "2026-10-23T10:01:30.134268+00:00"
    }
   ],
   "created_at": "2026-10-23T10:01:30.133467+00:00",
   "updated_at": "2026-10-23T10:01:30.133467+00:00"
  },
  {
   "id": "act-2026-003",
   "code": "ACT-2026-003",
   "title": "Sosialisasi SOP Pengelolaan Panjar & Bukti Lapangan",
   "description": "Sosialisasi SOP panjar operasional kepada seluruh LO wilayah dan bendahara pembantu.",
   "start_date": "2026-11-18",
   "end_date": "2026-11-19",
   "total_budget": 45000000.0,
   "status": "REVISION_REQUIRED",
   "version": 2,
   "is_locked": false,
   "created_by": "usr-pj-01",
   "created_by_name": "Budi Santoso, M.Si",
   "assigned_lo_id": "usr-lo-01",
   "assigned_lo_name": "M. Farhan Pratama",
   "budget_items": [
    {
     "id": "rab-act-2026-003-1",
     "activity_id": "act-2026-003",
     "category": "PAYROLL_HONOR",
     "category_label": "Honorarium & Pencairan Staf",
     "item_name": "Honorarium Fasilitator Sosialisasi",
     "quantity": 4,
     "unit": "OJ",
     "unit_price": 6000000.0,
     "total_price": 24000000.0
    },
    {
     "id": "rab-act-2026-003-2",
     "activity_id": "act-2026-003",
     "category": "LO_OPERATIONAL",
     "category_label": "Panjar Operasional LO",
     "item_name": "Panjar Operasional LO Sosialisasi",
     "quantity": 1,
     "unit": "Paket",
     "unit_price": 12000000.0,
     "total_price": 12000000.0
    },
    {
     "id": "rab-act-2026-003-3",
     "activity_id": "act-2026-003",
     "category": "CONSUMPTION",
     "category_label": "Konsumsi & Akomodasi",
     "item_name": "Konsumsi Peserta 2 Hari",
     "quantity": 40,
     "unit": "Pax",
     "unit_price": 225000.0,
     "total_price": 9000000.0
    }
   ],
   "approval_logs": [
    {
     "id": "apl-003-1",
     "activity_id": "act-2026-003",
     "actor_id": "usr-pj-01",
     "actor_name": "Budi Santoso, M.Si",
     "actor_role": "PJ",
     "action": "SUBMIT",
     "notes": "Pengajuan awal kegiatan sosialisasi.",
     "version": 1,
     "created_at": "2026-10-21T09:10:00+00:00"
    },
    {
     "id": "apl-003-2",
     "activity_id": "act-2026-003",
     "actor_id": "usr-sv-01",
     "actor_name": "Siti Rahma, S.E., Ak.",
     "actor_role": "SV",
     "action": "REQUEST_REVISION",
     "notes": "Rincian konsumsi dinilai terlalu tinggi; mohon lampirkan basis harga.",
     "version": 2,
     "created_at": "2026-10-22T14:05:00+00:00"
    }
   ],
   "created_at": "2026-10-21T08:55:00+00:00",
   "updated_at": "2026-10-22T14:05:00+00:00"
  },
  {
   "id": "act-2026-004",
   "code": "ACT-2026-004",
   "title": "Pendampingan Verifikasi Kuitansi Lapangan",
   "description": "Pendampingan teknis verifikasi kuitansi dan penutupan panjar pada kegiatan daerah.",
   "start_date": "2026-10-05",
   "end_date": "2026-10-08",
   "total_budget": 25000000.0,
   "status": "APPROVED",
   "version": 1,
   "is_locked": true,
   "created_by": "usr-pj-01",
   "created_by_name": "Budi Santoso, M.Si",
   "assigned_lo_id": "usr-lo-01",
   "assigned_lo_name": "M. Farhan Pratama",
   "budget_items": [
    {
     "id": "rab-act-2026-004-1",
     "activity_id": "act-2026-004",
     "category": "LO_OPERATIONAL",
     "category_label": "Panjar Operasional LO",
     "item_name": "Panjar Operasional Pendampingan",
     "quantity": 1,
     "unit": "Paket",
     "unit_price": 18000000.0,
     "total_price": 18000000.0
    },
    {
     "id": "rab-act-2026-004-2",
     "activity_id": "act-2026-004",
     "category": "CONSUMPTION",
     "category_label": "Konsumsi & Akomodasi",
     "item_name": "Konsumsi Tim Pendamping",
     "quantity": 10,
     "unit": "Pax",
     "unit_price": 700000.0,
     "total_price": 7000000.0
    }
   ],
   "approval_logs": [
    {
     "id": "apl-004-1",
     "activity_id": "act-2026-004",
     "actor_id": "usr-sv-01",
     "actor_name": "Siti Rahma, S.E., Ak.",
     "actor_role": "SV",
     "action": "APPROVE",
     "notes": "Disetujui untuk pelaksanaan.",
     "version": 1,
     "created_at": "2026-10-02T10:20:00+00:00"
    }
   ],
   "created_at": "2026-10-01T09:00:00+00:00",
   "updated_at": "2026-10-02T10:20:00+00:00"
  }
 ],
 "budget_items": [
  {
   "id": "rab-01b3126d",
   "activity_id": "act-2026-001",
   "category": "PAYROLL_HONOR",
   "category_label": "Honorarium & PencairanStaf",
   "item_name": "Honorarium Narasumber Utama & Moderator",
   "quantity": 8,
   "unit": "OJ",
   "unit_price": 15000000.0,
   "total_price": 120000000.0
  },
  {
   "id": "rab-2fea393e",
   "activity_id": "act-2026-001",
   "category": "LO_OPERATIONAL",
   "category_label": "Panjar Operasional LO",
   "item_name": "Panjar Operasional Akomodasi & Sewa Kendaraan Lapangan (LO)",
   "quantity": 1,
   "unit": "Paket",
   "unit_price": 55000000.0,
   "total_price": 55000000.0
  },
  {
   "id": "rab-c6046f23",
   "activity_id": "act-2026-001",
   "category": "ACCOMMODATION",
   "category_label": "Akomodasi & Konsumsi",
   "item_name": "Paket Fullboard Meeting Peserta & Konsumsi",
   "quantity": 50,
   "unit": "Orang",
   "unit_price": 2500000.0,
   "total_price": 125000000.0
  },
  {
   "id": "rab-ba27d67d",
   "activity_id": "act-2026-002",
   "category": "PAYROLL_HONOR",
   "category_label": "Honorarium & PencairanStaf",
   "item_name": "Uang Harian Tim Supervisi Lapangan",
   "quantity": 10,
   "unit": "OH",
   "unit_price": 5000000.0,
   "total_price": 50000000.0
  },
  {
   "id": "rab-d81e8aad",
   "activity_id": "act-2026-002",
   "category": "LO_OPERATIONAL",
   "category_label": "Panjar Operasional LO",
   "item_name": "Panjar Operasional Tiket, BBM, & Logistik LO",
   "quantity": 1,
   "unit": "Paket",
   "unit_price": 30000000.0,
   "total_price": 30000000.0
  },
  {
   "id": "rab-5ef03101",
   "activity_id": "act-2026-000",
   "category": "PAYROLL_HONOR",
   "category_label": "Honorarium & PencairanStaf",
   "item_name": "Honorarium Narasumber Ahli & Fasilitator",
   "quantity": 4,
   "unit": "OJ",
   "unit_price": 10000000.0,
   "total_price": 40000000.0
  },
  {
   "id": "rab-ec314aab",
   "activity_id": "act-2026-000",
   "category": "LO_OPERATIONAL",
   "category_label": "Panjar Operasional LO",
   "item_name": "Panjar Operasional LO Pendukung Rakor",
   "quantity": 1,
   "unit": "Paket",
   "unit_price": 20000000.0,
   "total_price": 20000000.0
  },
  {
   "id": "rab-act-2026-003-1",
   "activity_id": "act-2026-003",
   "category": "PAYROLL_HONOR",
   "category_label": "Honorarium & Pencairan Staf",
   "item_name": "Honorarium Fasilitator Sosialisasi",
   "quantity": 4,
   "unit": "OJ",
   "unit_price": 6000000.0,
   "total_price": 24000000.0
  },
  {
   "id": "rab-act-2026-003-2",
   "activity_id": "act-2026-003",
   "category": "LO_OPERATIONAL",
   "category_label": "Panjar Operasional LO",
   "item_name": "Panjar Operasional LO Sosialisasi",
   "quantity": 1,
   "unit": "Paket",
   "unit_price": 12000000.0,
   "total_price": 12000000.0
  },
  {
   "id": "rab-act-2026-003-3",
   "activity_id": "act-2026-003",
   "category": "CONSUMPTION",
   "category_label": "Konsumsi & Akomodasi",
   "item_name": "Konsumsi Peserta 2 Hari",
   "quantity": 40,
   "unit": "Pax",
   "unit_price": 225000.0,
   "total_price": 9000000.0
  },
  {
   "id": "rab-act-2026-004-1",
   "activity_id": "act-2026-004",
   "category": "LO_OPERATIONAL",
   "category_label": "Panjar Operasional LO",
   "item_name": "Panjar Operasional Pendampingan",
   "quantity": 1,
   "unit": "Paket",
   "unit_price": 18000000.0,
   "total_price": 18000000.0
  },
  {
   "id": "rab-act-2026-004-2",
   "activity_id": "act-2026-004",
   "category": "CONSUMPTION",
   "category_label": "Konsumsi & Akomodasi",
   "item_name": "Konsumsi Tim Pendamping",
   "quantity": 10,
   "unit": "Pax",
   "unit_price": 700000.0,
   "total_price": 7000000.0
  }
 ],
 "disbursements": [
  {
   "id": "dsb-2026-001",
   "activity_id": "act-2026-000",
   "activity_code": "ACT-2026-000",
   "activity_title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "activity_total_budget": 60000000.0,
   "disbursement_code": "DSB-2026-001",
   "title": "Pencairan Honorarium Narasumber Rakor",
   "total_amount": 20000000.0,
   "status": "TRANSFERRED",
   "transfer_date": "2026-10-18",
   "created_by": "usr-fin-01",
   "created_by_name": "Hendra Wijaya, S.Ak.",
   "approved_by": "usr-sv-01",
   "approved_by_name": "Siti Rahma, S.E., Ak.",
   "items": [
    {
     "id": "dsbi-01",
     "disbursement_id": "dsb-2026-001",
     "budget_item_id": "rab-5ef03101",
     "budget_item_name": "Honorarium Narasumber Ahli & Fasilitator",
     "bank_account_id": "ba-01",
     "beneficiary_name": "Dr. Ir. Hendra Gunawan",
     "bank_name": "Bank Mandiri",
     "account_number": "1370002233445",
     "tax_id_npwp": "01.234.567.8-012.000",
     "type": "PAYROLL_HONOR",
     "amount": 10000000.0,
     "tax_deduction": 500000.0,
     "net_amount": 9500000.0,
     "transfer_reference_no": "TRX-MND-99201",
     "transfer_receipt_file": "slip-transfer-dr-hendra.pdf",
     "transfer_receipt_hash": "e7c47fe86cabee79c31ead480e8e8e0f3613eccdfcf12a79aa50f8bebb75403b",
     "status": "PAID",
     "notes": "Honorarium Narasumber 2 Sesi Rakor",
     "settled_at": null,
     "settled_by": null,
     "returned_amount": 0.0,
     "settlement_notes": null,
     "created_at": "2026-10-23T10:01:30.134318+00:00",
     "updated_at": "2026-10-23T10:01:30.134318+00:00"
    },
    {
     "id": "dsbi-02",
     "disbursement_id": "dsb-2026-001",
     "budget_item_id": "rab-5ef03101",
     "budget_item_name": "Honorarium Narasumber Ahli & Fasilitator",
     "bank_account_id": "ba-02",
     "beneficiary_name": "Prof. Dr. Anita Lestari, M.Si",
     "bank_name": "Bank BCA",
     "account_number": "5410889922",
     "tax_id_npwp": "02.345.678.9-023.000",
     "type": "PAYROLL_HONOR",
     "amount": 10000000.0,
     "tax_deduction": 500000.0,
     "net_amount": 9500000.0,
     "transfer_reference_no": "TRX-BCA-88102",
     "transfer_receipt_file": "slip-transfer-prof-anita.pdf",
     "transfer_receipt_hash": "7a01b0853780438937d5248557efa871155d3b40b55924970f43fb1a8053ab88",
     "status": "PAID",
     "notes": "Honorarium Narasumber 2 Sesi Rakor",
     "settled_at": null,
     "settled_by": null,
     "returned_amount": 0.0,
     "settlement_notes": null,
     "created_at": "2026-10-23T10:01:30.134318+00:00",
     "updated_at": "2026-10-23T10:01:30.134318+00:00"
    }
   ],
   "items_count": 2,
   "created_at": "2026-10-23T10:01:30.134318+00:00",
   "updated_at": "2026-10-23T10:01:30.134318+00:00"
  },
  {
   "id": "dsb-2026-002",
   "activity_id": "act-2026-000",
   "activity_code": "ACT-2026-000",
   "activity_title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "activity_total_budget": 60000000.0,
   "disbursement_code": "DSB-2026-002",
   "title": "Pencairan Panjar Operasional Lapangan LO Rakor",
   "total_amount": 15000000.0,
   "status": "TRANSFERRED",
   "transfer_date": "2026-10-15",
   "created_by": "usr-fin-01",
   "created_by_name": "Hendra Wijaya, S.Ak.",
   "approved_by": "usr-sv-01",
   "approved_by_name": "Siti Rahma, S.E., Ak.",
   "items": [
    {
     "id": "dsbi-lo-01",
     "disbursement_id": "dsb-2026-002",
     "budget_item_id": "rab-ec314aab",
     "budget_item_name": "Panjar Operasional LO Pendukung Rakor",
     "bank_account_id": "ba-05",
     "beneficiary_name": "M. Farhan Pratama (LO)",
     "bank_name": "BCA",
     "account_number": "5410992831",
     "tax_id_npwp": "05.678.901.2-056.000",
     "type": "LO_OPERATIONAL_ADVANCE",
     "amount": 15000000.0,
     "tax_deduction": 0.0,
     "net_amount": 15000000.0,
     "transfer_reference_no": "TRX-BCA-ADV-5501",
     "transfer_receipt_file": "slip-transfer-panjar-lo.pdf",
     "transfer_receipt_hash": "9951fe3a8fc078847650d3c3ea914f986958763e2dad33b737f1c69349f63c19",
     "status": "PAID",
     "notes": "Panjar Operasional Lapangan LO Pendukung Rakor",
     "settled_at": null,
     "settled_by": null,
     "returned_amount": 0.0,
     "settlement_notes": null,
     "created_at": "2026-10-23T10:01:30.134318+00:00",
     "updated_at": "2026-10-23T10:01:30.134318+00:00"
    }
   ],
   "items_count": 1,
   "created_at": "2026-10-23T10:01:30.134318+00:00",
   "updated_at": "2026-10-23T10:01:30.134318+00:00"
  }
 ],
 "expenses": [
  {
   "id": "exp-001",
   "activity_id": "act-2026-000",
   "activity_code": "ACT-2026-000",
   "activity_title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "disbursement_item_id": "dsbi-lo-01",
   "budget_item_id": "rab-ec314aab",
   "budget_item_name": "Panjar Operasional LO Pendukung Rakor",
   "budget_category": "LO_OPERATIONAL",
   "user_id": "usr-lo-01",
   "user_name": "M. Farhan Pratama",
   "expense_code": "EXP-2026-001",
   "vendor_name": "PT Rental Wisata Prima",
   "description": "Sewa Kendaraan Operasional Lapangan 2 Hari",
   "amount": 2500000.0,
   "transaction_date": "2026-10-16",
   "receipt_number": "INV/RNT/2026/10/8812",
   "receipt_file": "kuitansi-rental-mobil.jpg",
   "receipt_hash": "8fa6e9d01358483395dc78945474ac821828da123174e0638ef88bd3162ebdfb",
   "latitude": -6.2088,
   "longitude": 106.8456,
   "status": "VERIFIED",
   "rejection_reason": null,
   "verified_by": "usr-sv-01",
   "verified_by_name": "Siti Rahma, S.E., Ak.",
   "verified_at": "2026-10-17T10:00:00Z",
   "validation": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "validation_audit": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "created_at": "2026-10-23T10:01:30.134750+00:00",
   "updated_at": "2026-10-23T10:01:30.134750+00:00"
  },
  {
   "id": "exp-002",
   "activity_id": "act-2026-000",
   "activity_code": "ACT-2026-000",
   "activity_title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "disbursement_item_id": "dsbi-lo-01",
   "budget_item_id": "rab-ec314aab",
   "budget_item_name": "Panjar Operasional LO Pendukung Rakor",
   "budget_category": "LO_OPERATIONAL",
   "user_id": "usr-lo-01",
   "user_name": "M. Farhan Pratama",
   "expense_code": "EXP-2026-002",
   "vendor_name": "Restoran Padang Sederhana",
   "description": "Konsumsi Lembur & Tim Logistik Lapangan",
   "amount": 1200000.0,
   "transaction_date": "2026-10-16",
   "receipt_number": "STRUK-PDS-99120",
   "receipt_file": "struk-konsumsi-lapangan.jpg",
   "receipt_hash": "2990ee7457e13213e4e567d02324391fc19d453a2b548dc8244f11f8054a7729",
   "latitude": -6.211,
   "longitude": 106.849,
   "status": "SUBMITTED",
   "rejection_reason": null,
   "verified_by": null,
   "verified_by_name": null,
   "verified_at": null,
   "validation": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "validation_audit": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "created_at": "2026-10-23T10:01:30.134750+00:00",
   "updated_at": "2026-10-23T10:01:30.134750+00:00"
  },
  {
   "id": "exp-003",
   "activity_id": "act-2026-000",
   "activity_code": "ACT-2026-000",
   "activity_title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "disbursement_item_id": "dsbi-lo-01",
   "budget_item_id": "rab-ec314aab",
   "budget_item_name": "Panjar Operasional LO Pendukung Rakor",
   "budget_category": "LO_OPERATIONAL",
   "user_id": "usr-lo-01",
   "user_name": "M. Farhan Pratama",
   "expense_code": "EXP-2026-003",
   "vendor_name": "PT Rental Wisata Prima",
   "description": "Duplikat bukti sewa kendaraan (nomor & hash sama)",
   "amount": 2500000.0,
   "transaction_date": "2026-10-16",
   "receipt_number": "INV/RNT/2026/10/8812",
   "receipt_file": "kuitansi-rental-mobil.jpg",
   "receipt_hash": "8fa6e9d01358483395dc78945474ac821828da123174e0638ef88bd3162ebdfb",
   "latitude": -6.2088,
   "longitude": 106.8456,
   "status": "SUBMITTED",
   "rejection_reason": null,
   "verified_by": "usr-sv-01",
   "verified_by_name": "Siti Rahma, S.E., Ak.",
   "verified_at": "2026-10-17T10:00:00Z",
   "validation": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "validation_audit": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "created_at": "2026-10-23T10:01:30.134750+00:00",
   "updated_at": "2026-10-23T10:01:30.134750+00:00",
   "verification_status": "PENDING"
  },
  {
   "id": "exp-004",
   "activity_id": "act-2026-000",
   "activity_code": "ACT-2026-000",
   "activity_title": "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
   "disbursement_item_id": "dsbi-lo-01",
   "budget_item_id": "rab-ec314aab",
   "budget_item_name": "Panjar Operasional LO Pendukung Rakor",
   "budget_category": "LO_OPERATIONAL",
   "user_id": "usr-lo-01",
   "user_name": "M. Farhan Pratama",
   "expense_code": "EXP-2026-004",
   "vendor_name": "Koperasi Konsumsi Sejahtera",
   "description": "Konsumsi rapat di luar rentang tanggal kegiatan",
   "amount": 900000.0,
   "transaction_date": "2026-10-29",
   "receipt_number": "INV/2026/KK/0091",
   "receipt_file": "kuitansi-rental-mobil.jpg",
   "receipt_hash": "25aab5bccb172fad24f2466c5b224a60a5576d18ed5db285a181ea7e60effa1d",
   "latitude": -6.2088,
   "longitude": 106.8456,
   "status": "SUBMITTED",
   "rejection_reason": null,
   "verified_by": "usr-sv-01",
   "verified_by_name": "Siti Rahma, S.E., Ak.",
   "verified_at": "2026-10-17T10:00:00Z",
   "validation": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "validation_audit": {
    "is_clean": true,
    "status": "PASS",
    "flags_count": 0,
    "flags": [],
    "l1_budget_overrun": false,
    "l2_date_out_of_range": false,
    "l3_duplicate_receipt": false,
    "l3_duplicate_hash": false
   },
   "created_at": "2026-10-23T10:01:30.134750+00:00",
   "updated_at": "2026-10-23T10:01:30.134750+00:00",
   "verification_status": "PENDING"
  }
 ],
 "audit_logs": [
  {
   "id": "aud-demo-03",
   "actor_id": "usr-sv-01",
   "actor_name": "Siti Rahma, S.E., Ak.",
   "actor_role": "SV",
   "entity_type": "ACTIVITY",
   "entity_id": "act-2026-003",
   "action": "REQUEST_REVISION",
   "details": {
    "code": "ACT-2026-003",
    "notes": "Rincian konsumsi dinilai terlalu tinggi"
   },
   "created_at": "2026-10-22T14:05:00+00:00"
  },
  {
   "id": "aud-8ca6a48e6a",
   "actor_id": "usr-aud-01",
   "actor_name": "Dr. Bambang Prakoso, CIA",
   "actor_role": "AUDITOR",
   "entity_type": "AUTH",
   "entity_id": "usr-aud-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "auditor@dinas.go.id",
    "role": "AUDITOR"
   },
   "created_at": "2026-10-27T09:26:01.435587+00:00"
  },
  {
   "id": "aud-d0540a01a6",
   "actor_id": "usr-lo-01",
   "actor_name": "M. Farhan Pratama",
   "actor_role": "LO",
   "entity_type": "AUTH",
   "entity_id": "usr-lo-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "lo@dinas.go.id",
    "role": "LO"
   },
   "created_at": "2026-10-27T09:26:01.424653+00:00"
  },
  {
   "id": "aud-d682b524cb",
   "actor_id": "usr-fin-01",
   "actor_name": "Hendra Wijaya, S.Ak.",
   "actor_role": "FINANCE",
   "entity_type": "AUTH",
   "entity_id": "usr-fin-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "finance@dinas.go.id",
    "role": "FINANCE"
   },
   "created_at": "2026-10-27T09:26:01.413032+00:00"
  },
  {
   "id": "aud-7c23daa258",
   "actor_id": "usr-sv-01",
   "actor_name": "Siti Rahma, S.E., Ak.",
   "actor_role": "SV",
   "entity_type": "AUTH",
   "entity_id": "usr-sv-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "sv@dinas.go.id",
    "role": "SV"
   },
   "created_at": "2026-10-27T09:26:01.400043+00:00"
  },
  {
   "id": "aud-afa58df12a",
   "actor_id": "usr-pj-01",
   "actor_name": "Budi Santoso, M.Si",
   "actor_role": "PJ",
   "entity_type": "AUTH",
   "entity_id": "usr-pj-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "pj@dinas.go.id",
    "role": "PJ"
   },
   "created_at": "2026-10-27T09:26:01.385702+00:00"
  },
  {
   "id": "aud-10a83ed197",
   "actor_id": "usr-admin-01",
   "actor_name": "Radja (Lead Developer)",
   "actor_role": "ADMIN",
   "entity_type": "AUTH",
   "entity_id": "usr-admin-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "radja@dinas.go.id",
    "role": "ADMIN"
   },
   "created_at": "2026-10-27T09:26:01.363515+00:00"
  },
  {
   "id": "aud-ab38296685",
   "actor_id": "usr-sv-01",
   "actor_name": "Siti Rahma, S.E., Ak.",
   "actor_role": "SV",
   "entity_type": "AUTH",
   "entity_id": "usr-sv-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "sv@dinas.go.id",
    "role": "SV"
   },
   "created_at": "2026-10-26T09:52:54.381526+00:00"
  },
  {
   "id": "aud-ebb277d5e9",
   "actor_id": "usr-pj-01",
   "actor_name": "Budi Santoso, M.Si",
   "actor_role": "PJ",
   "entity_type": "AUTH",
   "entity_id": "usr-pj-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "pj@dinas.go.id",
    "role": "PJ"
   },
   "created_at": "2026-10-26T09:52:43.658203+00:00"
  },
  {
   "id": "aud-564cb0efc8",
   "actor_id": "usr-admin-01",
   "actor_name": "Radja (Lead Developer)",
   "actor_role": "ADMIN",
   "entity_type": "AUTH",
   "entity_id": "usr-admin-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "radja@dinas.go.id",
    "role": "ADMIN"
   },
   "created_at": "2026-10-26T09:52:18.384771+00:00"
  },
  {
   "id": "aud-430c2fd3f1",
   "actor_id": "usr-lo-01",
   "actor_name": "M. Farhan Pratama",
   "actor_role": "LO",
   "entity_type": "AUTH",
   "entity_id": "usr-lo-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "lo@dinas.go.id",
    "role": "LO"
   },
   "created_at": "2026-10-26T09:51:55.229992+00:00"
  },
  {
   "id": "aud-bc68eb7627",
   "actor_id": "usr-aud-01",
   "actor_name": "Dr. Bambang Prakoso, CIA",
   "actor_role": "AUDITOR",
   "entity_type": "AUTH",
   "entity_id": "usr-aud-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "auditor@dinas.go.id",
    "role": "AUDITOR"
   },
   "created_at": "2026-10-26T09:51:52.420569+00:00"
  },
  {
   "id": "aud-058fe31b55",
   "actor_id": "usr-fin-01",
   "actor_name": "Hendra Wijaya, S.Ak.",
   "actor_role": "FINANCE",
   "entity_type": "AUTH",
   "entity_id": "usr-fin-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "finance@dinas.go.id",
    "role": "FINANCE"
   },
   "created_at": "2026-10-26T09:51:42.725594+00:00"
  },
  {
   "id": "aud-7207fecd92",
   "actor_id": "usr-sv-01",
   "actor_name": "Siti Rahma, S.E., Ak.",
   "actor_role": "SV",
   "entity_type": "AUTH",
   "entity_id": "usr-sv-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "sv@dinas.go.id",
    "role": "SV"
   },
   "created_at": "2026-10-26T09:51:35.093271+00:00"
  },
  {
   "id": "aud-9fd760ad18",
   "actor_id": "usr-pj-01",
   "actor_name": "Budi Santoso, M.Si",
   "actor_role": "PJ",
   "entity_type": "AUTH",
   "entity_id": "usr-pj-01",
   "action": "USER_LOGIN",
   "details": {
    "email": "pj@dinas.go.id",
    "role": "PJ"
   },
   "created_at": "2026-10-26T09:51:21.855902+00:00"
  }
 ]
};
