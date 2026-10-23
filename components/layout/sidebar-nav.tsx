"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  CreditCard,
  Wallet,
  CheckCircle2,
  Users,
  ShieldCheck,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard & Metrik", icon: BarChart3, badge: null },
  { href: "/activities", label: "Rencana & Approval", icon: FileText, badge: "3" },
  { href: "/payroll", label: "Pencairan & Honor", icon: CreditCard, badge: "1" },
  { href: "/cashbook", label: "Panjar & Buku Kas LO", icon: Wallet, badge: "Live" },
  { href: "/reconciliation", label: "Rekonsiliasi & SPJ", icon: CheckCircle2, badge: "SPJ" },
  { href: "/directory", label: "Direktori & Rekening", icon: Users, badge: null },
  { href: "/audit", label: "Laporan & Audit Trail", icon: ShieldCheck, badge: "Immutable" },
];

export function SidebarNav({ activeUser, onLogout }: { activeUser: any; onLogout?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 bg-white/75 backdrop-blur-xl border-r border-slate-200/80 p-5 z-20">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-lumatrix-navyDeep to-lumatrix-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
            TK
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              Tata Kelola Dinas
            </h1>
            <span className="text-[11px] font-medium text-slate-500">
              Platform Akuntabilitas Kedinasan
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Navigasi Utama">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 select-none",
                  isActive
                    ? "bg-lumatrix-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-md font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="pt-4 border-t border-slate-200/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-lumatrix-primary/10 text-lumatrix-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
              {activeUser ? activeUser.full_name.substring(0, 2).toUpperCase() : "RD"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {activeUser ? activeUser.full_name.split(",")[0] : "Radja"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                {activeUser ? activeUser.role : "ADMIN"}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar / Ganti Akun"
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
