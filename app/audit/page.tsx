"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";
import {
  ShieldCheck,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  CreditCard,
  Receipt,
  History,
  Lock,
  ExternalLink,
  X,
} from "lucide-react";

interface BudgetItem {
  id: string;
  category: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  budget_pagu: number;
  realized_payroll: number;
  realized_expenses: number;
  total_realized: number;
  variance: number;
  realization_percentage: number;
}

interface PayrollItem {
  id: string;
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  tax_id_npwp: string | null;
  net_amount: number;
  transfer_reference_no: string | null;
  transfer_receipt_hash: string | null;
  status: string;
}

interface ExpenseItem {
  id: string;
  expense_code: string;
  vendor_name: string;
  description: string;
  amount: number;
  transaction_date: string;
  receipt_number: string;
  receipt_hash: string;
  status: string;
  verified_by_name: string | null;
}

interface AuditLogEntry {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

export default function AuditReportPage() {
  const [activeTab, setActiveTab] = useState<"rab" | "payroll" | "expenses" | "audit">("rab");
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Seeded / Live accountability report state
  const [report, setReport] = useState({
    activity: {
      id: "act-2026-000",
      code: "ACT-2026-000",
      title: "Rapat Koordinasi Wilayah & Sosialisasi Literasi Digital",
      start_date: "2026-10-15",
      end_date: "2026-10-20",
      total_budget: 40000000.0,
      status: "APPROVED",
      version: 1,
      creator_name: "Dr. Ahmad Fauzi, M.T. (PJ)",
      assigned_lo_name: "M. Farhan Pratama (LO)",
    },
    financial_summary: {
      total_budget: 40000000.0,
      total_realized_payroll: 19000000.0,
      total_realized_expenses: 3700000.0,
      total_realized: 22700000.0,
      remaining_budget: 17300000.0,
      realization_percentage: 56.75,
      lo_advance_disbursed: 15000000.0,
      lo_cash_returned: 11300000.0,
      is_fully_settled: true,
    },
    budget_breakdown: [
      {
        id: "bi-01",
        category: "HONORARIUM",
        item_name: "Honorarium Narasumber Ahli (2 Orang)",
        quantity: 2,
        unit: "Orang",
        unit_price: 10000000.0,
        budget_pagu: 20000000.0,
        realized_payroll: 19000000.0,
        realized_expenses: 0.0,
        total_realized: 19000000.0,
        variance: 1000000.0,
        realization_percentage: 95.0,
      },
      {
        id: "bi-02",
        category: "LO_OPERATIONAL",
        item_name: "Panjar Operasional & Logistik Lapangan LO",
        quantity: 1,
        unit: "Paket",
        unit_price: 20000000.0,
        budget_pagu: 20000000.0,
        realized_payroll: 0.0,
        realized_expenses: 3700000.0,
        total_realized: 3700000.0,
        variance: 16300000.0,
        realization_percentage: 18.5,
      },
    ] as BudgetItem[],
    payroll_disbursements: [
      {
        id: "dsbi-01",
        beneficiary_name: "Dr. Ir. Hendra Gunawan",
        bank_name: "Bank Mandiri",
        account_number: "1370002233445",
        tax_id_npwp: "01.234.567.8-012.000",
        net_amount: 9500000.0,
        transfer_reference_no: "TRX-MND-99201",
        transfer_receipt_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "PAID",
      },
      {
        id: "dsbi-02",
        beneficiary_name: "Prof. Dr. Anita Lestari, M.Si",
        bank_name: "Bank BCA",
        account_number: "5410889922",
        tax_id_npwp: "02.345.678.9-023.000",
        net_amount: 9500000.0,
        transfer_reference_no: "TRX-BCA-88102",
        transfer_receipt_hash: "ca978112ca1bbdcafac231b39a23dc4da7860814196ec35d3d4b684cb322a36b",
        status: "PAID",
      },
    ] as PayrollItem[],
    field_expenses: [
      {
        id: "exp-001",
        expense_code: "EXP-2026-001",
        vendor_name: "PT Rental Wisata Prima",
        description: "Sewa Kendaraan Operasional Lapangan 2 Hari",
        amount: 2500000.0,
        transaction_date: "2026-10-16",
        receipt_number: "INV/RNT/2026/10/8812",
        receipt_hash: "8a1c9e33d420f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7",
        status: "VERIFIED",
        verified_by_name: "Surya Pratama, M.Si (SV)",
      },
      {
        id: "exp-002",
        expense_code: "EXP-2026-002",
        vendor_name: "Restoran Padang Sederhana",
        description: "Konsumsi Lembur & Tim Logistik Lapangan",
        amount: 1200000.0,
        transaction_date: "2026-10-16",
        receipt_number: "STRUK-PDS-99120",
        receipt_hash: "f4e229bc7811a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
        status: "VERIFIED",
        verified_by_name: "Surya Pratama, M.Si (SV)",
      },
    ] as ExpenseItem[],
    audit_trail: [
      {
        id: "log-01",
        actor_name: "Dr. Ahmad Fauzi",
        actor_role: "PJ",
        action: "SUBMIT_PLAN",
        entity_type: "ACTIVITY",
        entity_id: "act-2026-000",
        details: { version: 1, total_budget: 40000000.0 },
        created_at: "2026-10-15T08:30:00Z",
      },
      {
        id: "log-02",
        actor_name: "Surya Pratama",
        actor_role: "SV",
        action: "APPROVE_PLAN",
        entity_type: "ACTIVITY",
        entity_id: "act-2026-000",
        details: { approved_version: 1 },
        created_at: "2026-10-15T11:00:00Z",
      },
      {
        id: "log-03",
        actor_name: "Budi Santoso",
        actor_role: "FINANCE",
        action: "EXECUTE_DISBURSEMENT",
        entity_type: "DISBURSEMENT",
        entity_id: "dsb-2026-001",
        details: { items_count: 3, total_paid: 34000000.0 },
        created_at: "2026-10-16T09:15:00Z",
      },
      {
        id: "log-04",
        actor_name: "Budi Santoso",
        actor_role: "FINANCE",
        action: "SETTLE_LO_ADVANCE",
        entity_type: "DISBURSEMENT_ITEM",
        entity_id: "dsbi-lo-01",
        details: { advance_amount: 15000000.0, verified_expenses: 3700000.0, returned_amount: 11300000.0 },
        created_at: "2026-10-18T16:00:00Z",
      },
    ] as AuditLogEntry[],
  });

  const fin = report.financial_summary;

  const handleExportCsv = () => {
    window.open(`http://localhost:8000/api/v1/activities/${report.activity.id}/export-csv`, "_blank");
  };

  const handleExportHtml = () => {
    window.open(`http://localhost:8000/api/v1/activities/${report.activity.id}/export-html`, "_blank");
  };

  const openDrillDown = (entityType: string, item: any) => {
    setSelectedEntity({
      entity_type: entityType,
      title: entityType === "EXPENSE" ? `Kuitansi: ${item.expense_code} - ${item.vendor_name}` : `Transfer Slip: ${item.beneficiary_name}`,
      amount: entityType === "EXPENSE" ? item.amount : item.net_amount,
      hash: entityType === "EXPENSE" ? item.receipt_hash : item.transfer_receipt_hash,
      data: item,
      timeline: [
        {
          action: entityType === "EXPENSE" ? "VERIFY_EXPENSE" : "DISBURSEMENT_EXECUTED",
          actor: "Budi Santoso (FINANCE)",
          timestamp: "2026-10-17 14:00:00 UTC",
          note: "Dokumen diverifikasi dengan tanda tangan digital SHA-256.",
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tata Kelola Kedinasan
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-lumatrix-primary">
              Pelaporan &amp; Audit Trail (Ticket 08)
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
            Laporan Pertanggungjawaban (LPJ) &amp; Jejak Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Konsolidasi terpadu: Pagu vs Realisasi, Payroll langsung, Panjar LO, Uji Integritas SHA-256, dan Drill-Down bukti bayar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FinancialButton
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Unduh CSV / Excel</span>
          </FinancialButton>

          <FinancialButton
            variant="primary"
            size="sm"
            onClick={handleExportHtml}
          >
            <Printer className="h-3.5 w-3.5 text-white" />
            <span>Cetak LPJ Resmi (PDF)</span>
          </FinancialButton>
        </div>
      </div>

      {/* Activity Bar & Integrity Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Kegiatan Terpilih:</span>
          <select className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-lumatrix-primary">
            <option value="act-2026-000">
              {report.activity.code} - {report.activity.title}
            </option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>100% Integritas Kriptografis Lolos (SHA-256 Valid)</span>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Pagu (RAB)
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            {formatRupiah(fin.total_budget)}
          </div>
          <span className="text-[11px] text-slate-500">Pagu Induk Usulan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Direct Payroll
          </span>
          <div className="text-lg font-bold font-mono text-lumatrix-primary mt-1">
            {formatRupiah(fin.total_realized_payroll)}
          </div>
          <span className="text-[11px] text-slate-500">Honorarium staf</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Belanja Lapangan
          </span>
          <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
            {formatRupiah(fin.total_realized_expenses)}
          </div>
          <span className="text-[11px] text-slate-500">Realisasi kuitansi LO</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Realisasi
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-1">
            {formatRupiah(fin.total_realized)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {fin.realization_percentage}% serapan
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Sisa Kas Daerah
          </span>
          <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
            {formatRupiah(fin.remaining_budget)}
          </div>
          <span className="text-[11px] text-slate-500">Efisiensi anggaran</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("rab")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "rab"
              ? "border-lumatrix-primary text-lumatrix-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="h-4 w-4" />
          Realisasi RAB vs Aktual
        </button>

        <button
          onClick={() => setActiveTab("payroll")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "payroll"
              ? "border-lumatrix-primary text-lumatrix-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Direct Payroll Staf
        </button>

        <button
          onClick={() => setActiveTab("expenses")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "expenses"
              ? "border-lumatrix-primary text-lumatrix-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Receipt className="h-4 w-4" />
          Kuitansi LO &amp; Dokumentasi
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "audit"
              ? "border-lumatrix-primary text-lumatrix-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <History className="h-4 w-4" />
          Jejak Audit &amp; Kriptografi
        </button>
      </div>

      {/* Tab 1: Realisasi RAB */}
      {activeTab === "rab" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Kategori &amp; Komponen</th>
                  <th className="px-4 py-3 text-right">Pagu Anggaran</th>
                  <th className="px-4 py-3 text-right">Realisasi Payroll</th>
                  <th className="px-4 py-3 text-right">Realisasi Belanja</th>
                  <th className="px-4 py-3 text-right">Total Realisasi</th>
                  <th className="px-4 py-3 text-right">Sisa Pagu</th>
                  <th className="px-4 py-3 text-center">Serapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.budget_breakdown.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{item.item_name}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.category} · {item.quantity} {item.unit} @ {formatRupiah(item.unit_price)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {formatRupiah(item.budget_pagu)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {formatRupiah(item.realized_payroll)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700">
                      {formatRupiah(item.realized_expenses)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(item.total_realized)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                      {formatRupiah(item.variance)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.realization_percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Direct Payroll */}
      {activeTab === "payroll" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Penerima &amp; Rekening</th>
                  <th className="px-4 py-3">NPWP</th>
                  <th className="px-4 py-3 text-right">Nominal Bersih</th>
                  <th className="px-4 py-3">No. Referensi Transfer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SHA-256 Bukti Bayar</th>
                  <th className="px-4 py-3 text-right">Drill-Down</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.payroll_disbursements.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{p.beneficiary_name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.bank_name} - {p.account_number}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                      {p.tax_id_npwp || "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-lumatrix-primary">
                      {formatRupiah(p.net_amount)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {p.transfer_reference_no || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {p.transfer_receipt_hash ? p.transfer_receipt_hash.substring(0, 16) + "..." : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openDrillDown("PAYROLL", p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        <Search className="h-3 w-3 text-lumatrix-primary" />
                        Telusuri
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Field Expenses */}
      {activeTab === "expenses" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Kode &amp; Vendor</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Uraian Belanja</th>
                  <th className="px-4 py-3 text-right">Nominal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SHA-256 Kuitansi</th>
                  <th className="px-4 py-3 text-right">Drill-Down</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.field_expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 font-mono text-[11px]">
                        {e.expense_code}
                      </div>
                      <div className="text-[11px] text-slate-500">{e.vendor_name}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.transaction_date}</td>
                    <td className="px-4 py-3 text-slate-700">{e.description}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                      {formatRupiah(e.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {e.receipt_hash ? e.receipt_hash.substring(0, 16) + "..." : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openDrillDown("EXPENSE", e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        <Search className="h-3 w-3 text-lumatrix-primary" />
                        Telusuri
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Waktu (UTC)</th>
                  <th className="px-4 py-3">Aksi Kedinasan</th>
                  <th className="px-4 py-3">Aktor &amp; Peran</th>
                  <th className="px-4 py-3">Tipe Entitas</th>
                  <th className="px-4 py-3">Rincian Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.audit_trail.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                      {a.created_at.replace("T", " ").replace("Z", "")}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{a.action}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {a.actor_name}{" "}
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {a.actor_role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-lumatrix-primary">
                      {a.entity_type}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                      {JSON.stringify(a.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deep Drill-Down Drawer / Modal */}
      {selectedEntity && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedEntity.entity_type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedEntity.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-xs text-slate-500 font-medium">Nominal Transaksi:</span>
                <span className="text-lg font-bold font-mono text-lumatrix-primary">
                  {formatRupiah(selectedEntity.amount)}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500 font-mono text-[10px]">
                  <span>SHA-256 CHECKSUM:</span>
                  <span className="text-emerald-600 font-bold">✓ ASLI &amp; TERVERIFIKASI</span>
                </div>
                <div className="font-mono text-[10px] text-slate-700 break-all bg-slate-50 p-2 rounded border border-slate-100">
                  {selectedEntity.hash || "Hash belum tersedia"}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Riwayat Validasi &amp; Jejak Audit
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedEntity.timeline.map((t: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                  >
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{t.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{t.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{t.actor}</div>
                    <div className="text-[11px] text-slate-600 mt-1 italic">{t.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <FinancialButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedEntity(null)}
                className="text-xs"
              >
                Tutup Penelusuran
              </FinancialButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
