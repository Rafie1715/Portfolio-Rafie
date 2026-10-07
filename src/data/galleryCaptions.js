// Captions describe the existing screenshots, inspected during the content review.
const caption = (en, id) => ({ en, id });
export const galleryCaptions = {
  planetku: [
    caption('Getting started, login and registration screens.', 'Layar pembuka, login, dan registrasi akun.'),
    caption('Waste classification: a plastic bottle result, camera/gallery input, and access to price estimation.', 'Klasifikasi sampah: hasil botol plastik, input kamera/galeri, dan akses estimasi harga.'),
    caption('Carbon calculator: activity categories and their CO2 values.', 'Kalkulator karbon: kategori aktivitas beserta nilai CO2-nya.'),
    caption('Waste price estimation: choose a waste type before calculating its estimated value.', 'Estimasi harga sampah: memilih jenis sampah sebelum menghitung perkiraan nilainya.'),
    caption('Map with a waste-location marker and the educational article list.', 'Peta dengan penanda lokasi sampah dan daftar artikel edukasi.'),
  ],
  cinemazone: [
    caption('Login and registration, movie catalog, genre filters, and title search.', 'Login dan registrasi, katalog film, filter genre, serta pencarian judul.'),
    caption('Wishlist, account settings, and booking history with showtimes and seat numbers.', 'Wishlist, pengaturan akun, serta riwayat pesanan dengan jadwal dan nomor kursi.'),
  ],
  'computer-crafter': [caption('Build Guide: expandable steps for choosing PC components and assembling a computer.', 'Build Guide: langkah yang dapat dibuka untuk memilih komponen dan merakit komputer.')],
  lamimin: [caption('Figma screens for balance top-up, payment choices, item donations, pickup details, and confirmation.', 'Layar Figma untuk isi saldo, pilihan pembayaran, donasi barang, detail penjemputan, dan konfirmasi.')],
  'block-breaker': [
    caption('Gameplay with score, remaining lives, paddle, and a keyboard-control switch.', 'Permainan dengan skor, sisa nyawa, paddle, dan tombol beralih ke kontrol keyboard.'),
    caption('Game-over state with the final score and an option to restart.', 'Kondisi game over dengan skor akhir dan pilihan untuk bermain kembali.'),
  ],
  'quick-quiz': [
    caption('Android welcome screen with the Start Quiz action.', 'Layar pembuka Android dengan tombol Mulai Kuis.'),
    caption('Quiz results: 3 of 5 correct answers, 60% score, and a retry action.', 'Hasil kuis: 3 dari 5 jawaban benar, skor 60%, dan tombol mengulang.'),
    caption('Android question screen with answer choices and quiz progress.', 'Layar pertanyaan Android dengan pilihan jawaban dan progres kuis.'),
    caption('The quiz question layout running in a desktop browser.', 'Tata letak pertanyaan kuis yang berjalan di browser desktop.'),
  ],
  'personal-notes': [
    caption('Login form with a registration link and language/theme controls.', 'Form login dengan tautan registrasi serta kontrol bahasa dan tema.'),
    caption('Note detail with its date and content, plus archive and delete actions.', 'Detail catatan dengan tanggal dan isi, serta aksi arsip dan hapus.'),
    caption('Account registration form with password confirmation.', 'Form registrasi akun dengan konfirmasi kata sandi.'),
  ],
  'sentimen-deepseek': [
    caption('Text preprocessing: original reviews compared with cleaned text.', 'Prapemrosesan teks: perbandingan ulasan asli dengan teks yang telah dibersihkan.'),
    caption('Rating-based sentiment labels and the positive, negative, and neutral class counts.', 'Label sentimen berdasarkan rating serta jumlah kelas positif, negatif, dan netral.'),
    caption('CSV import preview showing review text, ratings, votes, and timestamps.', 'Pratinjau impor CSV berisi teks ulasan, rating, suara, dan waktu.'),
  ],
  'green-sort-unity': [
    caption('Unity scene layout with colored sorting bins and a conveyor.', 'Tata letak scene Unity dengan tempat pemilahan berwarna dan konveyor.'),
    caption('Conveyor setup in the Unity editor with waste objects, collider, and movement settings.', 'Pengaturan konveyor di editor Unity beserta objek sampah, collider, dan pengaturan geraknya.'),
    caption('Incorrect-sort feedback explaining that the glass bottle belongs in the yellow bin.', 'Umpan balik kesalahan yang menjelaskan bahwa botol kaca masuk ke tong kuning.'),
    caption('Correct-sort feedback after placing a gas container in the red bin.', 'Umpan balik jawaban benar setelah menempatkan jerigen gas pada tong merah.'),
  ],
};
