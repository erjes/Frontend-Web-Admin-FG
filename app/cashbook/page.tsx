"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Filter,
} from "lucide-react";

export default function CashbookPage() {
  const [cashbook, setCashbook] = useState({
    total_advance_received: 15000000.0,
    total_expenses_submitted: 3700000.0,
    total_expenses_verified: 2500000.0,
    remaining_cash_on_hand: 11300000.0,
    has_overdue_unsettled_advances: false,
    ledger: [
      {
        id: "exp-002",
        entry_type: "EXPENSE_OUTFLOW",
        direction: "OUT",
        date: "2026-10-16",
        code: "EXP-2026-002",
        title: "Konsumsi Lembur & Tim Logistik Lapangan",
        vendor_or_payee: "Restoran Padang Sederhana",
        inflow: 0.0,
        outflow: 1200000.0,
        running_balance: 11300000.0,
        status: "SUBMITTED",
        receipt_hash: "f4e229bc7811...",
      },
      {
        id: "exp-001",
        entry_type: "EXPENSE_OUTFLOW",
        direction: "OUT",
        date: "2026-10-16",
        code: "EXP-2026-001",
        title: "Sewa Kendaraan Operasional Lapangan 2 Hari",
        vendor_or_payee: "PT Rental Wisata Prima",
        inflow: 0.0,
        outflow: 2500000.0,
        running_balance: 12500000.0,
        status: "VERIFIED",
        receipt_hash: "8a1c9e33d420...",
      },
      {
        id: "dsbi-lo-01",
        entry_type: "ADVANCE_INFLOW",
        direction: "IN",
        date: "2026-10-15",
        code: "TRX-BCA-ADV-5501",
        title: "Panjar Operasional Lapangan LO Rakor",
        vendor_or_payee: "Bendahara Dinas (Finance)",
        inflow: 15000000.0,
        outflow: 0.0,
        running_balance: 15000000.0,
        status: "PAID",
        receipt_hash: "6b7d2f91a011...",
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
          <span className="text-lumatrix-primary">Buku Kas Digital LO (Ticket 05)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Buku Kas Digital &amp; Panjar Operasional LO
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Pencatatan uang muka panjar, belanja lapangan real-time, dan sisa kas di tangan LO berbasis bukti kuitansi.
            </p>
          </div>
          <div className="flex gap-2">
            <FinancialButton size="sm">
              + Cairkan Panjar LO Baru
            </FinancialButton>
          </div>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Panjar Diterima LO
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mono-num tracking-tight mt-1">
            {formatRupiah(cashbook.total_advance_received)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Transfer resmi ke rekening LO via Finance
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Realisasi Belanja Lapangan
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mono-num tracking-tight mt-1">
            {formatRupiah(cashbook.total_expenses_submitted)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Terverifikasi SV: {formatRupiah(cashbook.total_expenses_verified)}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border-emerald-200/80">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Sisa Kas di Tangan (Cash on Hand)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Saldo Aktif
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mono-num tracking-tight mt-1">
            {formatRupiah(cashbook.remaining_cash_on_hand)}
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-2 font-medium">
            Saldo riil wajib dipertanggungjawabkan (SPJ)
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Mutasi Rekapitulasi Kas Lapangan (Ledger Stream)
            </h2>
            <p className="text-xs text-slate-500">
              Kalkulasi saldo berjalan kronologis otomatis (ACID compliant).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0">
              <Filter className="h-3 w-3 text-slate-500" /> Filter Kegiatan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Arah &amp; Kode Transaksi</th>
                <th className="py-3 px-3">Uraian &amp; Pihak/Vendor</th>
                <th className="py-3 px-3 text-right">Penerimaan (+)</th>
                <th className="py-3 px-3 text-right">Pengeluaran (-)</th>
                <th className="py-3 px-3 text-right">Saldo Kas Berjalan</th>
                <th className="py-3 px-3">Status / Hash SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashbook.ledger.map((tx: any) => {
                const isIn = tx.direction === "IN";
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isIn ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isIn ? "MASUK" : "KELUAR"}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{tx.code}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900">{tx.title}</div>
                      <div className="text-[11px] text-slate-500">Pihak: {tx.vendor_or_payee}</div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600">
                      {isIn ? formatRupiah(tx.inflow) : "-"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-600">
                      {!isIn ? formatRupiah(tx.outflow) : "-"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatRupiah(tx.running_balance)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-[10px] text-slate-500">{tx.receipt_hash}</div>
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <FileCheck className="h-3 w-3" /> {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
