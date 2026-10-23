import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { InfoPanel } from "@/components/layout/info-panel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Platform Akuntabilitas & Tata Kelola Kegiatan Dinas",
  description: "Sistem Akuntabilitas & Pengendalian Keuangan Kegiatan Kedinasan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Demo active user state for initial server render
  const defaultUser = {
    full_name: "Radja",
    role: "ADMIN",
    title: "Lead Developer & Administrator",
    permissions: {
      can_create_plan: false,
      can_approve_plan: false,
      can_disburse_funds: false,
      can_upload_field_receipt: false,
      can_view_audit_trail: true,
      can_manage_users: true,
    },
  };

  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-lumatrix-canvas flex antialiased selection:bg-lumatrix-primary selection:text-white`}>
        {/* Column 1: Left 260px Glass Nav */}
        <SidebarNav activeUser={defaultUser} />

        {/* Column 2: Center Dynamic Workspace */}
        <main className="flex-1 min-w-0 p-8 overflow-y-auto max-w-7xl mx-auto">
          {children}
        </main>

        {/* Column 3: Right 280px InfoPanel */}
        <InfoPanel activeUser={defaultUser} />
      </body>
    </html>
  );
}
