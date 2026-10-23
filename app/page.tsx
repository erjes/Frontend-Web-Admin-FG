"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";
import {
  TrendingUp,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    total_pagu_allocated: 380000000,
    direct_payroll_disbursed: 20000000,
    lo_advance_active: 15000000,
    lo_cash_on_hand: 11300000,
    lo_expenses_realized: 3700000,
    realization_percentage: 9.74,
    active_users_count: 6,
    immutable_audit_events: 18,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Tata Kelola Kedinasan</span>
          <span>/</span>
          <span className="text-lumatrix-primary">Pusat Kendali Eksekutif</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tata Kelola Anggaran &amp; Akuntabilitas Bukti
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Backend FastAPI (Python 3.12) · PostgreSQL 16 ACID · MinIO S3 Object Storage · Next.js shadcn/ui.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/activities">
              <FinancialButton size="sm">
                + Ajukan Usulan Rencana
              </FinancialButton>
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards (Glassmorphism) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Pagu */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-lumatrix-primary/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Pagu Kegiatan Disahkan
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-lumatrix-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mono-num tracking-tight">
            {formatRupiah(metrics.total_pagu_allocated)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/60">
            <span>Validasi L1 Otomatis</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Pagu Terkunci
            </span>
          </div>
        </div>

        {/* Card 2: Direct Payroll */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-lumatrix-primary/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Realisasi Direct Payroll Staf
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mono-num tracking-tight">
            {formatRupiah(metrics.direct_payroll_disbursed)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/60">
            <span>Transfer Bank Resmi</span>
            <span className="font-semibold text-emerald-600 font-mono text-[11px]">
              SHA-256 Verified
            </span>
          </div>
        </div>

        {/* Card 3: LO Advance & Cash on Hand */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-lumatrix-primary/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sisa Kas di Tangan LO (Panjar)
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mono-num tracking-tight">
            {formatRupiah(metrics.lo_cash_on_hand)}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200/60">
            <span>Total Panjar: {formatRupiah(metrics.lo_advance_active)}</span>
            <span className="font-semibold text-amber-600">
              Struk: {formatRupiah(metrics.lo_expenses_realized)}
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Compliance Banner */}
      <div className="glass-panel p-5 rounded-2xl bg-gradient-to-r from-blue-900/5 via-slate-900/5 to-cyan-500/5 border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-lumatrix-navyDeep text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="h-5 w-5 text-lumatrix-cyanAccent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Arsitektur Produksi Terverifikasi: PostgreSQL 16 · FastAPI · MinIO S3 · Next.js · Flutter
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sistem mematuhi integritas referensial dan isolasi ACID tingkat tinggi pada PostgreSQL 16, penyimpanan berkas kuitansi &amp; foto lapangan terisolasi pada MinIO S3 dengan verifikasi hash kriptografis SHA-256, Maker-Checker pemisahan tugas (SoD), serta engine Buku Kas Digital LO real-time.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-[11px] font-semibold text-slate-700">
                PostgreSQL 16 (ACID &amp; Foreign Keys)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-[11px] font-semibold text-slate-700">
                FastAPI 0.111 + SQLAlchemy 2.0
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-[11px] font-semibold text-slate-700">
                MinIO / S3 Object Storage
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-[11px] font-semibold text-slate-700">
                Next.js 14 + Tailwind + shadcn/ui
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200 text-[11px] font-semibold text-slate-700">
                Flutter Field App (Android/iOS)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Governance Table: Recent Activities */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daftar Usulan Kegiatan &amp; Tata Kelola Anggaran
            </h2>
            <p className="text-xs text-slate-500">
              Pemisahan Tugas (SoD): Usulan oleh PJ, telaah oleh SV, pencairan oleh Finance.
            </p>
          </div>
          <Link
            href="/activities"
            className="text-xs font-semibold text-lumatrix-primary hover:text-lumatrix-primaryHover flex items-center gap-1"
          >
            Lihat Semua Kegiatan <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Kode &amp; Nama Kegiatan</th>
                <th className="py-3 px-4">Periode Tanggal</th>
                <th className="py-3 px-4 text-right">Total Pagu (RAB)</th>
                <th className="py-3 px-4">Versi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  <div className="font-mono text-[11px] text-lumatrix-primary">ACT-2026-000</div>
                  <div className="text-xs font-medium">Rapat Koordinasi &amp; Standardisasi Akuntabilitas Keuangan</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                  2026-10-15 s/d 2026-10-17
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900 mono-num">
                  Rp 60.000.000
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                    v1
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3" /> APPROVED
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <Link href="/payroll">
                    <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]">
                      Pencairan →
                    </button>
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  <div className="font-mono text-[11px] text-lumatrix-primary">ACT-2026-001</div>
                  <div className="text-xs font-medium">Bimbingan Teknis Tata Kelola &amp; Akuntabilitas Keuangan Daerah</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                  2026-11-02 s/d 2026-11-05
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900 mono-num">
                  Rp 300.000.000
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                    v1
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    <Clock className="h-3 w-3" /> SUBMITTED
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <Link href="/activities">
                    <button className="px-3 py-1 rounded-lg bg-lumatrix-primary text-white hover:bg-lumatrix-primaryHover font-semibold text-[11px]">
                      Telaah SV →
                    </button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
