// Diagrams describe documented component responsibilities, not a deployment topology.
export const caseStudyDetails = {
  OD60ttuTSwZW62TRJFm6: {
    architecture: [
      {
        title: { en: 'Android application', id: 'Aplikasi Android' },
        nodes: [
          { en: 'Tracking & daily check-in · Kotlin', id: 'Pelacakan & check-in harian · Kotlin' },
          { en: 'Application data · Firebase', id: 'Data aplikasi · Firebase' },
          { en: 'Classification, weekly statistics & education', id: 'Klasifikasi, statistik mingguan & edukasi' },
        ],
        note: { en: 'The product combines recorded activity, assessment, and classification feedback.', id: 'Produk menggabungkan catatan aktivitas, penilaian, dan umpan balik klasifikasi.' },
      },
      {
        title: { en: 'Separate research & evaluation workflow', id: 'Alur riset & evaluasi terpisah' },
        nodes: [
          { en: 'Survey data', id: 'Data kuesioner' },
          { en: '80:20 split · Scikit-Learn Random Forest', id: 'Pembagian 80:20 · Random Forest Scikit-Learn' },
          { en: '63 test samples · accuracy & class recall', id: '63 data uji · akurasi & recall per kelas' },
        ],
        note: { en: 'Notebook metrics describe model evaluation, not improved sleep or a production reliability benchmark.', id: 'Metrik notebook menjelaskan evaluasi model, bukan peningkatan kualitas tidur atau tolok ukur keandalan produksi.' },
      },
    ],
  },
  'mandiri-news': {
    architecture: [{
      title: { en: 'Paginated news flow · MVVM', id: 'Alur berita terpaginasikan · MVVM' },
      nodes: [
        { en: 'REST news endpoints', id: 'Endpoint berita REST' },
        { en: 'Retrofit & Coroutines', id: 'Retrofit & Coroutines' },
        { en: 'Paging 3 & ViewModel', id: 'Paging 3 & ViewModel' },
        { en: 'Android screens · loading, content, error', id: 'Layar Android · loading, konten, error' },
      ],
      note: { en: 'Paging coordinates successive pages; the UI presents content and request states.', id: 'Paging mengoordinasikan halaman berikutnya; UI menampilkan konten dan status permintaan.' },
    }],
  },
  stLpQKeX8K2JXu8zGb5r: {
    architecture: [{
      title: { en: 'Phishing & spam analysis flow · React + FastAPI', id: 'Alur analisis phishing & spam · React + FastAPI' },
      nodes: [
        { en: 'URL & message input · Guest quota check', id: 'Input URL & pesan · Pemeriksaan kuota tamu' },
        { en: 'FastAPI analysis service · Risk & confidence', id: 'Layanan analisis FastAPI · Risiko & keyakinan' },
        { en: 'Explainable risk report & safety actions', id: 'Laporan risiko terjelaskan & panduan keamanan' },
      ],
      note: { en: 'Preserves scan input across sign-in prompts and separates live URL/message checks from local screenshot simulations.', id: 'Menyimpan input pemeriksaan saat diminta masuk akun serta memisahkan analisis URL/pesan aktif dari simulasi screenshot lokal.' },
    }],
  },
  planetku: {
    architecture: [{
      title: { en: 'Cross-functional Android integration · Bangkit Capstone', id: 'Integrasi Android lintas fungsi · Capstone Bangkit' },
      nodes: [
        { en: 'Camera/gallery input & account auth · Kotlin', id: 'Input kamera/galeri & autentikasi akun · Kotlin' },
        { en: 'Backend API & ML team waste classifier', id: 'API backend & classifier sampah tim ML' },
        { en: 'Classification result, price estimate & Google Maps', id: 'Hasil klasifikasi, estimasi harga & Google Maps' },
      ],
      note: { en: 'Coordinates authentication, backend responses, ML classification output, and nearby waste-bank map locations.', id: 'Menyelaraskan autentikasi, respons backend, hasil klasifikasi ML, serta lokasi bank sampah di Google Maps.' },
    }],
  },
  cinemazone: {
    architecture: [{
      title: { en: 'Real-time seat selection & e-ticket flow · Firebase', id: 'Alur pemilihan kursi real-time & e-tiket · Firebase' },
      nodes: [
        { en: 'Firebase Auth & Cloud Firestore catalog', id: 'Firebase Auth & katalog Cloud Firestore' },
        { en: 'Dynamic GridView · Realtime Database seat listener', id: 'GridView dinamis · Listener kursi Realtime Database' },
        { en: 'Booking state sync & QR e-ticket generator', id: 'Sinkronisasi status booking & generator QR e-tiket' },
      ],
      note: { en: 'Seat state changes propagate through Firebase Realtime Database so occupied seats update immediately.', id: 'Perubahan status kursi disinkronkan melalui Firebase Realtime Database agar kursi terisi langsung diperbarui.' },
    }],
  },
  'computer-crafter': {
    architecture: [{
      title: { en: 'Rule-based PC compatibility flow · PHP + MySQL', id: 'Alur kompatibilitas rakitan PC berbasis aturan · PHP + MySQL' },
      nodes: [
        { en: 'Component picker UI · AJAX request', id: 'UI pemilih komponen · Permintaan AJAX' },
        { en: 'PHP rule filter & MySQL relational specs', id: 'Filter aturan PHP & spesifikasi relasional MySQL' },
        { en: 'Socket-compatible options & live price total', id: 'Opsi kompatibel soket & kalkulasi harga langsung' },
      ],
      note: { en: 'Normalized component specifications filter compatible parts dynamically without full-page reloads.', id: 'Spesifikasi komponen ternormalisasi memfilter suku cadang yang kompatibel secara dinamis tanpa muat ulang halaman.' },
    }],
  },
  'sentimen-deepseek': {
    architecture: [{
      title: { en: 'Text mining & classification pipeline · Scikit-Learn', id: 'Pipeline text mining & klasifikasi · Scikit-Learn' },
      nodes: [
        { en: 'Play Store reviews · Case folding & tokenization', id: 'Ulasan Play Store · Case folding & tokenisasi' },
        { en: 'Stopword removal, lemmatization & TF-IDF', id: 'Stopword removal, lemmatization & TF-IDF' },
        { en: 'Multinomial Naive Bayes · 87.67% accuracy', id: 'Multinomial Naive Bayes · Akurasi 87,67%' },
      ],
      note: { en: 'Evaluates positive, neutral, and negative review classes with Confusion Matrix validation.', id: 'Mengevaluasi kelas ulasan positif, netral, dan negatif dengan validasi Confusion Matrix.' },
    }],
  },
  'portfolio-website': {
    architecture: [{
      title: { en: 'Hybrid static & serverless architecture · React + Netlify', id: 'Arsitektur statis & serverless hibrida · React + Netlify' },
      nodes: [
        { en: 'Route-split React + Three.js UI (EN/ID)', id: 'UI React + Three.js terpisah per rute (EN/ID)' },
        { en: 'Netlify Functions · GitHub, Spotify & AI proxies', id: 'Netlify Functions · Proxy GitHub, Spotify & AI' },
        { en: 'Verified catalog merge & automated test suite', id: 'Penggabungan katalog terverifikasi & pengujian otomatis' },
      ],
      note: { en: 'Combines static pre-generated content with serverless API endpoints and strict public-field filtering.', id: 'Menggabungkan konten statis tergenerasi dengan endpoint serverless serta pemfilteran field publik yang ketat.' },
    }],
  },
};

