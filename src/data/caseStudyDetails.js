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
};
