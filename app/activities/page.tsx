"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";
import {
  FileText,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  Layers,
} from "lucide-react";

export default function ActivitiesPage() {
  const [selectedActivity, setSelectedActivity] = useState<any>({
    id: "act-2026-000",
    code: "ACT-2026-000",
    title: "Rapat Koordinasi & Standardisasi Akuntabilitas Keuangan",
    description: "Kegiatan koordinasi awal tahun yang telah disahkan dan siap untuk pencairan honor staf.",
    start_date: "2026-10-15",
    end_date: "2026-10-17",
    total_budget: 60000000.0,
    status: "APPROVED",
    version: 1,
    budget_items: [
      {
        id: "bi-000-01",
        category: "PAYROLL_HONOR",
        item_name: "Honorarium Narasumber Ahli & Fasilitator",
        quantity: 4,
        unit: "OJ",
        unit_price: 10000000.0,
        total_price: 40000000.0,
      },
      {
        id: "bi-000-02",
        category: "LO_OPERATIONAL",
        item_name: "Panjar Operasional LO Pendukung Rakor",
        quantity: 1,
        unit: "Paket",
        unit_price: 20000000.0,
        total_price: 20000000.0,
      },
    ],
  });

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Tata Kelola Kedinasan</span>
          <span>/</span>
          <span className="text-lumatrix-primary">Perencanaan &amp; Pengesahan (Ticket 02 &amp; 03)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Perencanaan Kegiatan, RAB &amp; Pengesahan SV
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Pemisahan Tugas (SoD): Usulan diajukan PJ, ditelaah SV, dan dilindungi snapshot versi.
            </p>
          </div>
          <FinancialButton size="sm">
            <Plus className="h-4 w-4" /> Buat Usulan Kegiatan Baru
          </FinancialButton>
        </div>
      </div>

      {/* Activities Table & Selected Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Activities List (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Daftar Usulan Kegiatan</h2>
            <span className="text-xs text-slate-500">2 Kegiatan Terdaftar</span>
          </div>

          <div className="space-y-3">
            {/* Activity 1 */}
            <div
              onClick={() => setSelectedActivity({ ...selectedActivity, code: "ACT-2026-000", status: "APPROVED" })}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedActivity.code === "ACT-2026-000"
                  ? "bg-blue-50/70 border-lumatrix-primary/40 shadow-sm"
                  : "bg-white hover:bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-lumatrix-primary">ACT-2026-000</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> APPROVED
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                Rapat Koordinasi &amp; Standardisasi Akuntabilitas Keuangan
              </h3>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-mono">2026-10-15 s/d 2026-10-17</span>
                <strong className="text-slate-900 font-mono text-xs">{formatRupiah(60000000)}</strong>
              </div>
            </div>

            {/* Activity 2 */}
            <div
              onClick={() => setSelectedActivity({ ...selectedActivity, code: "ACT-2026-001", status: "SUBMITTED" })}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedActivity.code === "ACT-2026-001"
                  ? "bg-blue-50/70 border-lumatrix-primary/40 shadow-sm"
                  : "bg-white hover:bg-slate-50/70 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-lumatrix-primary">ACT-2026-001</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                  <Clock className="h-3 w-3" /> SUBMITTED
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                Bimbingan Teknis Tata Kelola &amp; Akuntabilitas Keuangan Daerah
              </h3>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-mono">2026-11-02 s/d 2026-11-05</span>
                <strong className="text-slate-900 font-mono text-xs">{formatRupiah(300000000)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Activity RAB Breakdown (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono font-bold text-lumatrix-primary">
                {selectedActivity.code} · Versi v{selectedActivity.version}
              </span>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                Rincian Anggaran Biaya (RAB)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
              L1 Validated
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {selectedActivity.budget_items.map((bi: any) => (
              <div key={bi.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{bi.item_name}</span>
                  <span className="font-mono">{formatRupiah(bi.total_price)}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
                  <span>Kategori: {bi.category}</span>
                  <span>{bi.quantity} {bi.unit} × {formatRupiah(bi.unit_price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs font-bold text-slate-900 mb-5">
            <span>Total Pagu Disahkan:</span>
            <span className="text-sm font-mono text-lumatrix-primary">
              {formatRupiah(selectedActivity.total_budget)}
            </span>
          </div>

          {/* Maker-Checker Actions */}
          <div className="space-y-2">
            <FinancialButton size="sm" className="w-full">
              <CheckCircle2 className="h-4 w-4" /> Setujui Rencana (SV Approve)
            </FinancialButton>
            <button className="w-full py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
              Minta Revisi Rencana (Request Revision)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
