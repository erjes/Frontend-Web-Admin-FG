# Demo — Platform Akuntabilitas & Tata Kelola Kegiatan Dinas

Demo interaktif untuk memperlihatkan produknya, bukan sekadar tampilannya. Aplikasi berjalan
sepenuhnya di browser: tidak perlu backend, database, atau instalasi apa pun.

**Buka:** `https://erjes.github.io/Demo/`

---

## Yang dilihat klien

Siklus lengkap tata kelola keuangan kegiatan, dari rencana sampai audit:

1. **PJ** menyusun rencana kegiatan + RAB, lalu mengajukannya.
2. **SV** menelaah: menyetujui, atau meminta revisi dengan catatan. Rencana yang disetujui terkunci;
   perubahan wajib lewat amendment berversi.
3. **Bendahara** mencairkan honor (dengan validasi pagu) dan panjar operasional ke **LO**.
4. **LO** mencatat kuitansi lapangan — setiap bukti wajib berstempel SHA-256 (dihitung di sisi klien
   oleh `js/sha256.js` dan divalidasi 422 oleh lapisan API) serta membawa geotag.
5. **SV/Bendahara** merekonsiliasi: mesin validasi menandai kuitansi duplikat, di luar rentang
   tanggal kegiatan, atau melampaui pagu pos anggaran. Setelah semua kuitansi ditelaah, panjar
   ditutup dengan angka sisa kas yang dihitung sistem.
6. **Auditor** menelusuri jejak audit append-only dan menelusuri nominal laporan sampai ke bukti
   sumbernya (drill-down), lalu mengekspor LPJ sebagai CSV atau versi cetak.

Menu berubah mengikuti peran yang masuk — itu inti produk ini: **pemisahan tugas** yang ditegakkan
di antarmuka dan di aturan.

## Masuk

Alur aplikasi dimulai dari **halaman login penuh** (`#loginScreen`) yang menyediakan 6 kartu peran
1-klik (atau form masuk manual, kata sandi semuanya `password123`):

| Peran | Email | Yang bisa dilakukan |
|---|---|---|
| Administrator | `radja@dinas.go.id` | Pengawasan sistem, tanpa hak menyetujui/mencairkan |
| PJ | `pj@dinas.go.id` | Membuat, menyunting, mengajukan rencana & RAB |
| SV | `sv@dinas.go.id` | Menelaah rencana, meminta revisi, memverifikasi kuitansi |
| Bendahara | `finance@dinas.go.id` | Mencairkan dana, mengelola rekening, menutup panjar |
| LO | `lo@dinas.go.id` | Buku kas lapangan, mencatat kuitansi |
| Auditor | `auditor@dinas.go.id` | Membaca seluruh modul, audit trail, ekspor laporan |

Tombol keluar di bagian bawah sidebar mengakhiri sesi aktif dan mengembalikan tampilan ke halaman
login penuh, sehingga pergantian peran untuk demo multi-peran dapat dilakukan dengan 1 klik.

## Skrip demo 5 menit

1. Masuk sebagai **PJ** di halaman login → *Rencana & Approval* → buka `ACT-2026-002` (draft) → ajukan.
2. Keluar sesi → pilih kartu **SV** → setujui rencana tersebut. Menu Pencairan & Rekonsiliasi muncul.
3. Keluar sesi → pilih kartu **Bendahara** → buat batch pencairan dari rencana yang disetujui → eksekusi → unduh CSV.
4. Keluar sesi → pilih kartu **LO** → *Panjar & Buku Kas* → catat kuitansi (hash SHA-256 & geotag dihitung otomatis).
5. Keluar sesi → pilih kartu **SV** → *Rekonsiliasi* → lihat penandaan otomatis pada kuitansi bermasalah → verifikasi.
6. Keluar sesi → pilih kartu **Auditor** → *Laporan & Audit Trail* → drill-down dari nominal ke bukti, lalu ekspor LPJ.

## Catatan kejujuran

- Seluruh **data sintetis**. Tidak ada data instansi sungguhan.
- Aplikasi ini adalah **versi demo statis**: pemanggilan API dijawab oleh lapisan demo di browser
  (`js/demo-api.js`) yang meniru kontrak backend sungguhan — termasuk 403 untuk peran yang tidak
  berhak, 422 bila bukti tidak membawa hash SHA-256 64-heksadesimal yang sah, penolakan pelanggaran
  pemisahan tugas, rencana terkunci setelah disetujui, dan jejak audit append-only.
- Data demo disimpan di `localStorage`. Tombol **reset data demo** di sidebar mengembalikan keadaan awal.

## Menjalankan lokal

```bash
python3 -m http.server 4400
# buka http://localhost:4400
```

Berkas statis murni — cukup buka `index.html` lewat server apa pun.

## Struktur

```
index.html          antarmuka (halaman login penuh + workspace 2 kolom: sidebar push & area konten)
button.preview.html halaman pratinjau terisolasi untuk komponen tombol 8-state
css/gov.css         token desain, komponen, dan tata letak responsif
js/sha256.js        modul SHA-256 murni JS di sisi klien untuk stempel integritas bukti
js/demo-seed.js     data demo (diturunkan dari respons API sungguhan, lalu diperkaya)
js/demo-api.js      lapisan demo: router /api/*, RBAC, validasi L1/L2/L3 & 422 SHA-256, audit, state persisten
js/app.js           logika antarmuka, navigasi peran, dan manajemen sesi
```
