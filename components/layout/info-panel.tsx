"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Shield, Check, Wallet, ArrowRight, Activity as ActivityIcon } from "lucide-react";

interface InfoPanelProps {
  activeUser: any;
  cashbookMetrics?: {
    remaining_cash_on_hand: number;
    total_advance_received: number;
    total_expenses_submitted: number;
  };
  auditLogs?: any[];
}

export function InfoPanel({ activeUser, cashbookMetrics, auditLogs = [] }: InfoPanelProps) {
  const perms = activeUser?.permissions || {};

  return (
    <aside className="w-[280px] flex-shrink-0 h-screen sticky top-0 bg-white/75 backdrop-blur-xl border-l border-slate-200/80 rounded-l-[28px] p-5 flex flex-col justify-between overflow-y-auto z-20">
      <div className="space-y-6">
        {/* Active Role Governance Badges */}
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Hak Akses Peran Aktif
          </h2>
          <p className="text-[11px] text-slate-500 mb-2.5">
            Kewenangan sesi {activeUser?.role || "GUEST"}:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(perms).map(([key, val]) => (
              <span
                key={key}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                  val
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-400 border border-slate-200 line-through"
                }`}
              >
                {val && <Check className="h-2.5 w-2.5" />}
                {key.replace("can_", "").replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

        {/* LO Digital Cashbox Widget */}
        <div className="pt-4 border-t border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-lumatrix-primary" />
              Kas Digital LO
            </h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Live
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/60 shadow-sm">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              Sisa Kas di Tangan
            </span>
            <div className="text-lg font-bold text-lumatrix-primary tracking-tight my-0.5 font-mono">
              {formatRupiah(cashbookMetrics?.remaining_cash_on_hand || 11300000)}
            </div>
            <div className="text-[11px] text-slate-600 flex justify-between pt-2 mt-2 border-t border-blue-200/50">
              <span>Panjar Masuk:</span>
              <strong className="text-slate-900 font-mono">
                {formatRupiah(cashbookMetrics?.total_advance_received || 15000000)}
              </strong>
            </div>
            <div className="text-[11px] text-slate-600 flex justify-between mt-1">
              <span>Struk Lapangan:</span>
              <strong className="text-amber-700 font-mono">
                {formatRupiah(cashbookMetrics?.total_expenses_submitted || 3700000)}
              </strong>
            </div>
          </div>

          <Link
            href="/cashbook"
            className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-lumatrix-primary hover:text-lumatrix-primaryHover transition-colors py-1.5 rounded-lg hover:bg-blue-50/60"
          >
            Buka Buku Kas LO <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Cryptographic Integrity & MinIO Badge */}
        <div className="pt-4 border-t border-slate-200/60">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            Integritas Berkas MinIO
          </h2>
          <div className="space-y-1.5">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] flex items-center justify-between">
              <span className="text-slate-600">Storage Engine:</span>
              <strong className="font-mono text-slate-900 text-[10px]">MinIO S3 / S3-API</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] flex items-center justify-between">
              <span className="text-slate-600">File Hashing:</span>
              <strong className="font-mono text-emerald-700 text-[10px]">SHA-256 Stream</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] flex items-center justify-between">
              <span className="text-slate-600">Database Engine:</span>
              <strong className="font-mono text-indigo-700 text-[10px]">PostgreSQL 16 ACID</strong>
            </div>
          </div>
        </div>

        {/* Live Immutable Audit Stream */}
        <div className="pt-4 border-t border-slate-200/60 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ActivityIcon className="h-3.5 w-3.5 text-slate-500" />
              Jejak Audit Live
            </h2>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
              Immutable
            </span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">Audit log terisolasi & terproteksi.</p>
            ) : (
              auditLogs.slice(0, 5).map((log, idx) => (
                <div key={log.id || idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 text-[11px]">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span className="truncate">{log.action}</span>
                    <span className="font-mono text-[9px] text-slate-400">
                      {log.created_at ? log.created_at.substring(11, 19) : ""}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Oleh: <strong>{log.actor_name}</strong> ({log.actor_role})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
