"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Lock,
  ArrowRight,
  Filter,
} from "lucide-react";

interface ExpenseItem {
  id: string;
  expense_code: string;
  vendor_name: string;
  description: string;
  amount: number;
  transaction_date: string;
  receipt_number: string;
  receipt_hash: string;
  latitude: number | null;
  longitude: number | null;
  status: "SUBMITTED" | "VERIFIED" | "REJECTED";
  rejection_reason?: string | null;
  verified_by_name?: string | null;
  verified_at?: string | null;
  validation: {
    is_clean: boolean;
    l1_budget_overrun: boolean;
    l2_date_out_of_range: boolean;
    l3_duplicate_receipt: boolean;
    l3_duplicate_hash: boolean;
    flags: Array<{ rule: string; level: "DANGER" | "WARNING"; field: string; message: string }>;
  };
}

export default function ReconciliationPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: "exp-001",
      expense_code: "EXP-2026-001",
      vendor_name: "PT Rental Wisata Prima",
      description: "Sewa Kendaraan Operasional Lapangan 2 Hari",
      amount: 2500000.0,
      transaction_date: "2026-10-16",
      receipt_number: "INV/RNT/2026/10/8812",
      receipt_hash: "8a1c9e33d420f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7",
      latitude: -6.2088,
      longitude: 106.8456,
      status: "VERIFIED",
      verified_by_name: "Surya Pratama, M.Si (SV)",
      verified_at: "2026-10-17T10:00:00Z",
      validation: {
        is_clean: true,
        l1_budget_overrun: false,
        l2_date_out_of_range: false,
        l3_duplicate_receipt: false,
        l3_duplicate_hash: false,
        flags: [],
      },
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
      latitude: -6.211,
      longitude: 106.849,
      status: "SUBMITTED",
      validation: {
        is_clean: true,
        l1_budget_overrun: false,
        l2_date_out_of_range: false,
        l3_duplicate_receipt: false,
        l3_duplicate_hash: false,
        flags: [],
      },
    },
  ]);

  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [returnedAmount, setReturnedAmount] = useState(11300000);
  const [settlementNotes, setSettlementNotes] = useState("Sisa panjar disetor ke rekening kas dinas");

  const totalCount = expenses.length;
  const pendingCount = expenses.filter((e) => e.status === "SUBMITTED").length;
  const verifiedTotal = expenses
    .filter((e) => e.status === "VERIFIED")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const advanceTotal = 15000000.0;
  const remainingCash = Math.max(0, advanceTotal - verifiedTotal);

  const handleVerify = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "VERIFIED",
              verified_by_name: "Budi Santoso, SE (Finance)",
              verified_at: new Date().toISOString(),
            }
          : e
      )
    );
    setSelectedExpense(null);
  };

  const handleReject = (id: string) => {
    if (!rejectionNotes.trim()) {
      alert("Alasan penolakan kuitansi wajib disertakan.");
      return;
    }
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: "REJECTED",
              rejection_reason: rejectionNotes,
              verified_by_name: "Budi Santoso, SE (Finance)",
              verified_at: new Date().toISOString(),
            }
          : e
      )
    );
    setSelectedExpense(null);
    setRejectionNotes("");
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Tata Kelola Kedinasan</span>
          <span>/</span>
          <span className="text-lumatrix-primary">Rekonsiliasi &amp; SPJ (Ticket 07)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Rekonsiliasi Pengeluaran &amp; Tutup Panjar LO
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Telaah bukti kuitansi lapangan, audit otomatis L1/L2/L3 (Pagu, Tanggal, Duplikasi SHA-256), dan settlement panjar.
            </p>
          </div>
          <div className="flex gap-2">
            <FinancialButton size="sm" onClick={() => setIsSettlementOpen(true)}>
              ⚡ Tutup Panjar LO (Settlement)
            </FinancialButton>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Kuitansi Masuk
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {totalCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Klaim belanja LO lapangan</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Menunggu Telaah
          </span>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-2">
            {pendingCount}
          </div>
          <span className="text-xs text-amber-700/80 mt-1 block">Status SUBMITTED</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Realisasi Disetujui
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-2">
            {formatRupiah(verifiedTotal)}
          </div>
          <span className="text-xs text-emerald-700/80 mt-1 block">Total kuitansi VERIFIED</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Status Tutup Panjar
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                pendingCount === 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {pendingCount === 0 ? "Siap Ditutup" : "Panjar Aktif"}
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {pendingCount === 0
              ? "Semua kuitansi telah diperiksa"
              : `${pendingCount} kuitansi belum ditelaah`}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daftar Bukti Belanja Lapangan</h2>
            <p className="text-xs text-slate-500">Hasil verifikasi bukti fisik dan deteksi kriptografis ganda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 whitespace-nowrap shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Semua Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-3">Kode &amp; Vendor</th>
                <th className="pb-3 px-3">Tanggal</th>
                <th className="pb-3 px-3 text-right">Nominal</th>
                <th className="pb-3 px-3 text-center">Validasi Otomatis</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{exp.vendor_name}</div>
                    <div className="text-[11px] font-mono text-lumatrix-primary">{exp.expense_code}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">{exp.transaction_date}</td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                    {formatRupiah(exp.amount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        L1 OK
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        L2 OK
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                        L3 Unik
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        exp.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-700"
                          : exp.status === "REJECTED"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedExpense(exp)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Periksa Kuitansi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Split-Screen Review Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-7">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Telaah Bukti Kuitansi &amp; Uji Validasi (Ticket 07)
                </h3>
                <p className="text-xs text-slate-500">
                  Verifikasi fisik belanja LO terhadap pagu, jadwal, dan keaslian berkas.
                </p>
              </div>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6">
              {/* Left Column: Digital Receipt Paper */}
              <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-dashed border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      BUKTI KUITANSI BELANJA
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedExpense.vendor_name}
                    </h4>
                    <span className="text-xs font-mono text-lumatrix-primary font-semibold">
                      {selectedExpense.expense_code}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedExpense.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-medium">Uraian Kebutuhan:</span>
                  <p className="text-sm text-slate-800 font-medium mt-1 leading-relaxed">
                    {selectedExpense.description}
                  </p>
                </div>

                <div className="bg-slate-100/60 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">No. Kuitansi / Faktur:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedExpense.receipt_number || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Tanggal Transaksi:</span>
                    <span className="font-mono text-slate-800">
                      {selectedExpense.transaction_date}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-dashed border-slate-200 pt-2">
                    <span>Total Nominal:</span>
                    <span className="font-mono text-lumatrix-primary">
                      {formatRupiah(selectedExpense.amount)}
                    </span>
                  </div>
                </div>

                {/* SHA-256 Checksum & Geotag */}
                <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Integritas SHA-256:
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 bg-slate-100/70 p-2 rounded-lg break-all">
                    {selectedExpense.receipt_hash}
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Koordinat Geotag:
                    </span>
                    <span className="font-mono font-bold text-slate-700">
                      {selectedExpense.latitude && selectedExpense.longitude
                        ? `${selectedExpense.latitude.toFixed(4)}, ${selectedExpense.longitude.toFixed(4)}`
                        : "Tidak Ada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Validation Alerts & Decision */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Hasil Uji Validasi Otomatis (L1, L2, L3)
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>L1 Pagu RAB:</strong> Pengeluaran berada dalam batas pagu mata anggaran operasional.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>L2 Jadwal Kegiatan:</strong> Transaksi tanggal {selectedExpense.transaction_date} berada dalam jadwal resmi.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>L3 Anti-Duplikasi:</strong> Berkas kuitansi dan hash kriptografis unik tanpa indikasi klaim ganda.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Keputusan Verifikasi
                  </h4>

                  {selectedExpense.status === "SUBMITTED" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">
                          Catatan Penolakan (wajib jika ditolak):
                        </label>
                        <textarea
                          value={rejectionNotes}
                          onChange={(e) => setRejectionNotes(e.target.value)}
                          placeholder="Tuliskan alasan jika kuitansi ditolak..."
                          className="w-full h-16 p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lumatrix-primary/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(selectedExpense.id)}
                          className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                        >
                          ✕ Tolak Kuitansi
                        </button>
                        <FinancialButton
                          className="flex-1"
                          onClick={() => handleVerify(selectedExpense.id)}
                        >
                          ✓ Verifikasi Kuitansi
                        </FinancialButton>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Telah Disahkan oleh {selectedExpense.verified_by_name}
                      </div>
                      <div className="text-[11px] text-emerald-700/80">
                        Waktu Verifikasi: {selectedExpense.verified_at}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Modal */}
      {isSettlementOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Tutup Panjar Lapangan (SPJ Kasir)
                </h3>
                <p className="text-xs text-slate-500">
                  Penyelesaian uang muka panjar operasional LO dan penyetoran sisa kas.
                </p>
              </div>
              <button
                onClick={() => setIsSettlementOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-lumatrix-primary/5 border border-lumatrix-primary/20 rounded-2xl p-4 space-y-2 text-xs">
              <span className="font-bold text-lumatrix-primary uppercase tracking-wider text-[10px]">
                Ringkasan Uang Muka Panjar
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600">Plafon Panjar Diterima:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatRupiah(advanceTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Realisasi Belanja Disetujui:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {formatRupiah(verifiedTotal)}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-bold">
                <span className="text-slate-800">Sisa Kas Wajib Setor:</span>
                <span className="font-mono text-lumatrix-primary">
                  {formatRupiah(remainingCash)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nominal Pengembalian Sisa Kas (Rp)
                </label>
                <input
                  type="number"
                  value={returnedAmount}
                  onChange={(e) => setReturnedAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lumatrix-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor Bukti Setor / Catatan SPJ
                </label>
                <input
                  type="text"
                  value={settlementNotes}
                  onChange={(e) => setSettlementNotes(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lumatrix-primary/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSettlementOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <FinancialButton
                onClick={() => {
                  alert("✓ Panjar operasional LO berhasil diselesaikan (SETTLED)!");
                  setIsSettlementOpen(false);
                }}
              >
                Konfirmasi Tutup Panjar (SETTLED)
              </FinancialButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
