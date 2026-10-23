"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { FinancialButton } from "@/components/ui/financial-button";
import {
  CreditCard,
  Download,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  ArrowDownToLine,
  Lock,
} from "lucide-react";

export default function PayrollPage() {
  const [selectedBatch, setSelectedBatch] = useState<any>({
    id: "dsb-2026-001",
    disbursement_code: "DSB-2026-001",
    activity_code: "ACT-2026-000",
    title: "Pencairan Honorarium Narasumber Rakor",
    total_amount: 20000000.0,
    status: "TRANSFERRED",
    transfer_date: "2026-10-18",
    items: [
      {
        id: "dsbi-01",
        beneficiary_name: "Dr. Ir. Hendra Gunawan",
        bank_name: "Bank Mandiri",
        account_number: "1370002233445",
        tax_id_npwp: "01.234.567.8-012.000",
        type: "PAYROLL_HONOR",
        amount: 10000000.0,
        tax_deduction: 500000.0,
        net_amount: 9500000.0,
        transfer_reference_no: "TRX-MND-99201",
        transfer_receipt_file: "slip-transfer-dr-hendra.pdf",
        transfer_receipt_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "PAID",
      },
      {
        id: "dsbi-02",
        beneficiary_name: "Prof. Dr. Anita Lestari, M.Si",
        bank_name: "Bank BCA",
        account_number: "5410889922",
        tax_id_npwp: "02.345.678.9-023.000",
        type: "PAYROLL_HONOR",
        amount: 10000000.0,
        tax_deduction: 500000.0,
        net_amount: 9500000.0,
        transfer_reference_no: "TRX-BCA-88102",
        transfer_receipt_file: "slip-transfer-prof-anita.pdf",
        transfer_receipt_hash: "ca978112ca1bbdcafac231b39a23dc4da7860814196ec35d3d4b684cb322a36b",
        status: "PAID",
      },
    ],
  });

  const handleDownloadCsv = () => {
    window.open("http://localhost:8000/api/v1/disbursements/dsb-2026-001/export-csv", "_blank");
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Tata Kelola Kedinasan</span>
          <span>/</span>
          <span className="text-lumatrix-primary">Pencairan &amp; Pencairan Staf (Ticket 04)</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pencairan Dana &amp; Direct Payroll Staf
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Maker-Checker: Pembuatan instruksi transfer bank, validasi pagu L1, ekspor CSV &amp; verifikasi hash bukti transfer.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <FinancialButton
              variant="outline"
              size="sm"
              onClick={handleDownloadCsv}
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Unduh Instruksi Bank (CSV)</span>
            </FinancialButton>
            <FinancialButton size="sm">
              + Buat Batch Pencairan Baru
            </FinancialButton>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <div>
            <span className="font-mono text-xs font-bold text-lumatrix-primary">
              {selectedBatch.disbursement_code} · {selectedBatch.activity_code}
            </span>
            <h2 className="text-sm font-bold text-slate-900">{selectedBatch.title}</h2>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" /> {selectedBatch.status}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Nama Penerima &amp; Rekening</th>
                <th className="py-3 px-3">NPWP</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-right">Nominal Kotor</th>
                <th className="py-3 px-3 text-right">PPh (Pajak)</th>
                <th className="py-3 px-3 text-right">Transfer Bersih (Net)</th>
                <th className="py-3 px-3">Integritas Bukti (SHA-256)</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedBatch.items.map((it: any) => (
                <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{it.beneficiary_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {it.bank_name} · {it.account_number}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                    {it.tax_id_npwp || "-"}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                      {it.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-900">
                    {formatRupiah(it.amount)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-rose-600">
                    {formatRupiah(it.tax_deduction)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 text-sm">
                    {formatRupiah(it.net_amount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]" title={it.transfer_receipt_hash}>
                      {it.transfer_receipt_hash.substring(0, 16)}...
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <FileCheck className="h-3 w-3" /> MinIO Verified
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {it.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Total Pencairan Batch: <strong className="text-slate-900 font-mono">{formatRupiah(selectedBatch.total_amount)}</strong>
          </span>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
            <Lock className="h-3.5 w-3.5" /> Transaksi Terkunci &amp; Sesuai Pagu L1
          </div>
        </div>
      </div>
    </div>
  );
}
