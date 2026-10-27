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
4. **LO** mencatat kuitansi lapangan — setiap bukti wajib berstempel SHA-256 dan membawa geotag.
5. **SV/Bendahara** merekonsiliasi: mesin validasi menandai kuitansi duplikat, di luar rentang
   tanggal kegiatan, atau melampaui pagu pos anggaran. Setelah semua kuitansi ditelaah, panjar
   ditutup dengan angka sisa kas yang dihitung sistem.
6. **Auditor** menelusuri jejak audit append-only dan menelusuri nominal laporan sampai ke bukti
   sumbernya (drill-down), lalu mengekspor LPJ sebagai CSV atau versi cetak.

Menu berubah mengikuti peran yang masuk — itu inti produk ini: **pemisahan tugas** yang ditegakkan
di antarmuka dan di aturan.

## Masuk

Enam akun, kata sandi semuanya `password123`:

| Peran | Email | Yang bisa dilakukan |
|---|---|---|
| Administrator | `radja@dinas.go.id` | Pengawasan sistem, tanpa hak menyetujui/mencairkan |
| PJ | `pj@dinas.go.id` | Membuat, menyunting, mengajukan rencana & RAB |
| SV | `sv@dinas.go.id` | Menelaah rencana, meminta revisi, memverifikasi kuitansi |
| Bendahara | `finance@dinas.go.id` | Mencairkan dana, mengelola rekening, menutup panjar |
| LO | `lo@dinas.go.id` | Buku kas lapangan, mencatat kuitansi |
| Auditor | `auditor@dinas.go.id` | Membaca seluruh modul, audit trail, ekspor laporan |

Tombol **⏻** di sidebar berganti akun tanpa memuat ulang halaman, sehingga alur antar-peran bisa
diperagakan dalam satu sesi.

## Skrip demo 5 menit

1. Masuk sebagai **PJ** → *Rencana & Approval* → buka `ACT-2026-002` (draft) → ajukan.
2. Ganti ke **SV** → setujui rencana tersebut. Menu Pencairan & Rekonsiliasi muncul.
3. Ganti ke **Bendahara** → buat batch pencairan dari rencana yang disetujui → eksekusi → unduh CSV.
4. Ganti ke **LO** → *Panjar & Buku Kas* → catat kuitansi (hash & geotag otomatis terisi).
5. Ganti ke **SV** → *Rekonsiliasi* → lihat penandaan otomatis pada kuitansi bermasalah → verifikasi.
6. Ganti ke **Auditor** → *Laporan & Audit Trail* → drill-down dari nominal ke bukti, lalu ekspor LPJ.

## Catatan kejujuran

- Seluruh **data sintetis**. Tidak ada data instansi sungguhan.
- Aplikasi ini adalah **versi demo statis**: pemanggilan API dijawab oleh lapisan demo di browser
  (`js/demo-api.js`) yang meniru kontrak backend sungguhan — termasuk 403 untuk peran yang tidak
  berhak, penolakan pelanggaran pemisahan tugas, rencana terkunci setelah disetujui, dan jejak audit
  append-only.
- Data demo disimpan di `localStorage`. Tombol **reset data demo** di sidebar mengembalikan keadaan awal.
- Tampilan, token warna, dan komponen berasal dari aplikasi sebenarnya; demo ini tidak memakai
  rangka atau visual terpisah.

## Menjalankan lokal

```bash
python3 -m http.server 4400
# buka http://localhost:4400
```

Berkas statis murni — cukup buka `index.html` lewat server apa pun.

## Struktur

```
index.html        antarmuka (3 kolom: sidebar, workspace, panel informasi)
css/tokens.css    token desain (warna, tipografi, elevasi)
css/gov.css       komponen + gaya halaman
js/demo-seed.js   data demo (diturunkan dari respons API sungguhan, lalu diperkaya)
js/demo-api.js    lapisan demo: router /api/*, RBAC, validasi, audit, state persisten
js/app.js         logika antarmuka
```
