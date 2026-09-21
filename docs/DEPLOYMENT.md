# Menjalankan dan menerbitkan portfolio

## Lokal

Gunakan Node.js 22.12+ dan npm. Jalankan npm ci, npm run dev. Build: npm run build; preview: npm run preview. Tes: npm test dan npm run lint.

Vite menyediakan endpoint katalog proyek dan sertifikasi untuk development/preview. Integrasi Netlify lain (Spotify, GitHub, Gemini, film, operasi admin sertifikasi) membutuhkan Netlify CLI: netlify dev. Preview Vite saja tidak menguji layanan tersebut.

## Sumber konten publik

Tetapkan PORTFOLIO_CONTENT_SOURCE secara eksplisit pada environment build DAN Functions Netlify:

- static: proyek/sertifikasi dari src/data. Edit CMS tidak mengubah katalog publik.
- cms: data repository digabung dengan Firestore melalui Firebase Admin. CMS menimpa proyek lokal berdasarkan id, localId, atau judul lama. isPublished: false menyembunyikan proyek, termasuk versi lokalnya. ID URL proyek lokal dipertahankan.

Untuk proyek, dokumen CMS lama tanpa flag isPublished boolean diabaikan saat penggabungan: versi repository yang sudah publik tetap tampil, sedangkan isi override lama tidak diterbitkan. Proyek yang hanya ada di CMS tetap membutuhkan isPublished: true. isPublished: false tetap menyembunyikan versi repository. Jika RestUP tetap tidak muncul sesudah deploy kode terbaru, buka Edit RestUP di admin dan periksa Publish this project; centang dan simpan bila ingin memublikasikannya, lalu build/deploy ulang untuk memperbarui HTML awal dan sitemap.

Tanpa konfigurasi eksplisit, adanya kredensial Firebase Admin memilih cms; jika tidak ada, static. Kegagalan CMS mengembalikan 503 dan tombol coba lagi, tanpa menampilkan kembali draft dari fallback lokal.

CMS membutuhkan FIREBASE_SERVICE_ACCOUNT_JSON (JSON service account), atau FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY. Simpan hanya di environment server/build, jangan dengan prefiks VITE_. Variabel VITE_FIREBASE_* berisi konfigurasi SDK publik, bukan service account.

Halaman publik dan sitemap merupakan snapshot saat build. Setiap perubahan CMS yang memengaruhi isi/URL/publikasi perlu build dan deploy ulang agar metadata, tautan, dan konten tanpa JavaScript ikut berubah. Unpublish di CMS segera berlaku pada API/client setelah pemuatan ulang, tetapi tidak menghapus snapshot deploy sebelumnya. Untuk pencabutan konten menyeluruh, unpublish lalu deploy ulang; periksa juga artikel terkait dan konteks chatbot statis jika memuat konten itu.

## Urutan penerapan Firebase

1. Pastikan akun pemilik mempunyai custom claim admin: true. Ini pilihan utama agar UI, fungsi server, dan rules konsisten. Login ulang/refresh token sesudah perubahan claim.
2. Jika menggunakan allowlist email, samakan VITE_ADMIN_EMAILS, ADMIN_EMAILS, dan daftar email pada firestore.rules. Email harus terverifikasi. Daftar rules saat ini masih memuat nilai lama admin@rafie.com; sesuaikan dengan akun yang benar. Allowlist kosong tidak memberi akses admin.
3. Sebelum rules baru diterbitkan, jalankan node scripts/migrate-publication.mjs menggunakan kredensial server. Default dry run hanya melaporkan jumlah dokumen tanpa flag. Audit dokumen tersebut terlebih dahulu; dokumen yang tidak dimaksudkan publik harus diberi isPublished: false.
4. Jalankan node scripts/migrate-publication.mjs --apply hanya untuk mempertahankan publikasi dokumen lama yang telah diperiksa. Skrip mengisi flag yang belum boolean menjadi true; false yang sudah ada tidak berubah. Koleksi: projects, certifications, moviePicks, movieWatchlist.
5. Terbitkan rules melalui Firebase CLI yang telah diautentikasi: firebase deploy --only firestore:rules --project YOUR_PROJECT_ID. Uji akses publik, admin, dan draft pada staging/emulator sebelum produksi.
6. Tetapkan PORTFOLIO_CONTENT_SOURCE=cms, build, lalu deploy website dan Functions. Uji draft tidak ada di katalog/detail serta akun nonadmin ditolak.

Menghapus override CMS dapat memunculkan kembali data repository. Untuk menyembunyikan proyek/sertifikasi lokal, simpan override unpublished; jangan hanya menghapus override.

### Akun lama berhasil login tetapi Access Denied

Login Firebase tidak otomatis memberi hak admin. Akun seperti admin@rafie.com yang belum terverifikasi perlu custom claim admin: true, atau verifikasi email serta allowlist yang konsisten. Menambahkan VITE_ADMIN_EMAILS saja tidak cukup untuk email yang belum terverifikasi.

Untuk akun login yang tidak mempunyai kotak masuk email, gunakan skrip operator berikut dari lingkungan dengan kredensial Firebase Admin. Kredensial server dapat dimuat dari environment proses atau .env.local yang diabaikan Git; jangan membagikannya di chat atau memasukkannya ke bundle browser. Ganti YOUR_FIREBASE_PROJECT_ID dengan ID proyek Firebase yang sesuai.

```sh
node scripts/set-admin-claim.mjs --email admin@rafie.com --project YOUR_FIREBASE_PROJECT_ID
node scripts/set-admin-claim.mjs --email admin@rafie.com --project YOUR_FIREBASE_PROJECT_ID --apply
```

Perintah pertama hanya membaca akun. Periksa project, UID, dan email sebelum menjalankan perintah kedua untuk menetapkan role. Skrip mempertahankan custom claims lain dan tidak mengubah password atau status verifikasi email. Setelah role tersimpan, login ulang atau pilih Refresh access. Perubahan role tidak membutuhkan deploy website; tombol dan pesan baru membutuhkan deploy. Jangan menjalankan skrip ini otomatis pada setiap build atau menjadikannya endpoint publik.

## Environment integrasi

Gunakan SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN, GITHUB_TOKEN, dan TMDB_API_KEY sebagai variabel khusus server. Nama VITE_ lama masih diterima sementara untuk kompatibilitas, tetapi pindahkan konfigurasi deployment ke nama server. Endpoint spotify-auth sengaja mengembalikan 410; endpoint publik hanya menyediakan data widget.

VITE_GA_ID mengaktifkan GA4 pada build produksi selain localhost. Pageview SPA dikirim aplikasi; nonaktifkan pelacakan perubahan history otomatis pada enhanced measurement GA agar tidak ganda. Periksa DebugView sesudah deploy untuk pageview, klik CV/email/proyek, hasil submit, dan LCP/CLS/INP. Pengujian lokal tidak mengirim analytics. Data lapangan memerlukan pengunjung nyata; tidak ada klaim skor Lighthouse baru.

## Metadata dan routing

Build menghasilkan metadata per route untuk 30 halaman publik saat ini, konten noscript yang relevan, sitemap, dan 404.html. Konten noscript mencegah tampilan teks sementara berganti menjadi layout React; ini bukan SSR/hydration penuh. Bahasa antarmuka dipilih melalui ?lang=id/en; metadata HTML awal memakai bahasa Inggris, kemudian SEO client mengikuti bahasa yang dipilih.

Hosting harus mendukung Netlify Functions serta public/_redirects dan public/_headers. Halaman statis yang ada mendahului fallback. Unknown route mengarah ke 404; admin/login diberi noindex. Periksa status HTTP pada deploy preview Netlify karena Vite tidak meniru aturan redirect/headers Netlify.

## Bukti proyek yang masih perlu dilengkapi

Repository publik RestUP telah diverifikasi dan ditautkan. Halaman detail memuat perbandingan keluaran notebook (baseline 93,65%, model berbobot 92,06%, 63 data uji), metode 80:20, dan batas evaluasinya. Spreadsheet yang diberikan pemilik berisi 317 respons; snapshot ini perlu dicocokkan dengan notebook sebelum mereproduksi angka persis. Jangan memasukkan data mentah responden ke repository atau website. Video demo dan screenshot layar RestUP terpisah masih dapat ditambahkan bila tersedia. Mandiri News kini menggunakan screenshot implementasi asli dari dokumentasi proyek. Akurasi model tidak boleh dipresentasikan sebagai peningkatan kualitas tidur pengguna.

## Hasil verifikasi 21 September 2026

- Build produksi, lint, dan 21 tes otomatis lulus.
- Sebanyak 23 pemeriksaan browser pada preview produksi lulus: scroll dan tarik kartu pada layar sentuh, navigasi teknologi dengan bahasa/fokus tetap tersimpan, panel personal mobile, bukti proyek, lebar 320–1440 piksel, serta feedback formulir.
- Respons formulir sukses, pembatasan permintaan (429), dan kegagalan server (500) diuji dengan simulasi tanpa mengirim pesan ke Formspree. Pengiriman dan penerimaan email nyata belum diverifikasi.
- Pemeriksaan baca saja pada domain publik menemukan metadata khusus untuk Projects/Contact, respons 404 untuk URL tidak dikenal, CV berupa PDF, dan endpoint proyek/sertifikasi/GitHub/Spotify berupa JSON. GET /api/chat mengembalikan 405 sesuai metode yang diizinkan; jawaban Gemini nyata belum diuji.
- HTML awal detail RestUP pada domain publik masih memakai judul beranda saat diperiksa. Build lokal memiliki halaman detail tersendiri; periksa kembali snapshot konten dan hasil deployment pada route tersebut. Sebagian permintaan publik mengalami timeout koneksi, sehingga hasil ini bukan pengukuran uptime atau Core Web Vitals.

Verifikasi lokal tidak melakukan deployment, perubahan CMS, maupun pengiriman data responden. Cocokkan hasil dengan deploy preview sebelum menerbitkan versi berikutnya.
