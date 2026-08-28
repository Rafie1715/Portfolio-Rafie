export const blogs = [
  {
    id: 6,
    slug: 'restup-random-forest-android',
    title: {
      en: 'From Sleep Data to a Useful Android Prediction: Building RestUP',
      id: 'Dari Data Tidur ke Prediksi Android yang Berguna: Membangun RestUP',
    },
    excerpt: {
      en: 'How I connected a Random Forest model, Firebase data, and a guided Android flow to make sleep-quality results understandable.',
      id: 'Cara saya menghubungkan model Random Forest, data Firebase, dan alur Android terpandu agar hasil kualitas tidur mudah dipahami.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-08-28',
    updatedAt: '2026-08-28',
    category: 'case-study',
    tags: ['Android', 'Kotlin', 'Random Forest', 'Firebase'],
    image: '/images/project-restup.jpg',
    featured: true,
    projectId: 'OD60ttuTSwZW62TRJFm6',
    impact: {
      role: { en: 'Thesis Researcher and ML Developer', id: 'Peneliti Skripsi dan ML Developer' },
      team: { en: 'Independent thesis project', id: 'Proyek skripsi mandiri' },
      result: { en: '92.06% Random Forest accuracy', id: 'Akurasi Random Forest 92,06%' },
      scope: { en: 'Sleep monitoring and prediction', id: 'Pemantauan dan prediksi tidur' },
    },
    sections: {
      en: [
        {
          heading: 'The product problem',
          paragraphs: [
            'RestUP began as my Informatics thesis project. The goal was not only to classify sleep quality, but also to help users understand what the result meant through a practical Android experience.',
            'The main challenge was translating sleep activity and self-assessment data into feedback that remained clear, useful, and approachable inside a mobile interface.',
          ],
        },
        {
          heading: 'Designing a guided flow',
          paragraphs: ['I organized the experience around a repeatable daily flow so users could record relevant activity, complete a guided assessment, and review the classification without jumping between disconnected screens.'],
          bullets: [
            'Sleep activity tracking and a guided daily check-in',
            'Random Forest sleep-quality classification',
            'Weekly statistics for reviewing patterns over time',
            'Educational content that gives the result practical context',
          ],
        },
        {
          heading: 'Connecting model evaluation and Android',
          paragraphs: [
            'The application flow was built with Kotlin, while Firebase handled application data. I evaluated the Random Forest model with Scikit-Learn and treated the model output as one part of the product rather than the entire experience.',
            'That separation helped me think carefully about loading states, result presentation, and the amount of technical detail a user actually needs to make sense of a prediction.',
          ],
        },
        {
          heading: 'Result and lesson',
          paragraphs: ['The final Random Forest model reached 92.06% classification accuracy. More importantly, the project taught me how to connect machine-learning evaluation with product decisions and turn technical output into feedback users can act on.'],
        },
      ],
      id: [
        {
          heading: 'Masalah produk yang ingin diselesaikan',
          paragraphs: [
            'RestUP berawal dari proyek skripsi Informatika saya. Tujuannya bukan hanya mengklasifikasikan kualitas tidur, tetapi juga membantu pengguna memahami arti hasil tersebut melalui pengalaman Android yang praktis.',
            'Tantangan utamanya adalah menerjemahkan data aktivitas tidur dan penilaian mandiri menjadi umpan balik yang tetap jelas, berguna, dan mudah dipahami dalam antarmuka mobile.',
          ],
        },
        {
          heading: 'Merancang alur yang terpandu',
          paragraphs: ['Saya menyusun pengalaman pengguna di sekitar alur harian yang konsisten agar pengguna dapat mencatat aktivitas, menyelesaikan penilaian terpandu, dan melihat klasifikasi tanpa berpindah di antara layar yang tidak terhubung.'],
          bullets: [
            'Pelacakan aktivitas tidur dan check-in harian terpandu',
            'Klasifikasi kualitas tidur menggunakan Random Forest',
            'Statistik mingguan untuk melihat pola dari waktu ke waktu',
            'Konten edukasi yang memberi konteks praktis pada hasil',
          ],
        },
        {
          heading: 'Menghubungkan evaluasi model dan Android',
          paragraphs: [
            'Alur aplikasi dibangun dengan Kotlin, sedangkan Firebase menangani data aplikasi. Saya mengevaluasi model Random Forest menggunakan Scikit-Learn dan memperlakukan keluaran model sebagai salah satu bagian produk, bukan keseluruhan pengalaman.',
            'Pemisahan tersebut membantu saya memikirkan loading state, penyajian hasil, dan seberapa banyak detail teknis yang benar-benar dibutuhkan pengguna untuk memahami prediksi.',
          ],
        },
        {
          heading: 'Hasil dan pembelajaran',
          paragraphs: ['Model Random Forest akhir mencapai akurasi klasifikasi 92,06%. Hal terpenting yang saya pelajari adalah cara menghubungkan evaluasi machine learning dengan keputusan produk dan mengubah keluaran teknis menjadi umpan balik yang dapat ditindaklanjuti pengguna.'],
        },
      ],
    },
  },
  {
    id: 7,
    slug: 'mandiri-news-paging-android',
    title: {
      en: 'Building a Predictable Paginated News Feed on Android',
      id: 'Membangun Feed Berita Android yang Terpaginasikan dan Konsisten',
    },
    excerpt: {
      en: 'What I learned combining MVVM, Retrofit, Coroutines, and Paging 3 across three screens and three REST endpoints.',
      id: 'Pembelajaran saya saat menggabungkan MVVM, Retrofit, Coroutines, dan Paging 3 pada tiga layar serta tiga REST endpoint.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-08-28',
    updatedAt: '2026-08-28',
    category: 'case-study',
    tags: ['Android', 'Kotlin', 'Paging 3', 'REST API'],
    image: '/images/project-mandiri-news.jpg',
    projectId: 'mandiri-news',
    impact: {
      role: { en: 'Mobile Apps Developer', id: 'Mobile Apps Developer' },
      team: { en: 'Project-Based Virtual Internship', id: 'Project-Based Virtual Internship' },
      result: { en: 'Excellent predicate, 88.71/100', id: 'Predikat Excellent, 88,71/100' },
      scope: { en: '3 screens and 3 REST endpoints', id: '3 layar dan 3 REST endpoint' },
    },
    sections: {
      en: [
        {
          heading: 'Project context',
          paragraphs: [
            'Mandiri News was developed during the Bank Mandiri x Rakamin Project-Based Virtual Internship in March 2026. I was responsible for building a mobile flow that could browse and continuously load business news from paginated REST data.',
            'The delivered scope covered three primary Android screens and integrations with three REST endpoints.',
          ],
        },
        {
          heading: 'The pagination challenge',
          paragraphs: ['The central engineering challenge was keeping the interface responsive while new pages were loaded. Loading, empty, success, and failure states also needed to remain predictable as users moved through the feed.'],
        },
        {
          heading: 'Architecture and implementation',
          paragraphs: ['I structured the application with MVVM to separate interface state from data access. Retrofit handled the REST layer, Kotlin Coroutines handled asynchronous work, and Paging 3 coordinated endless scrolling and page loading.'],
          bullets: [
            'Separate presentation and data responsibilities with MVVM',
            'Represent API loading and failure states explicitly',
            'Load additional pages without blocking the interface',
            'Keep the feed stable when results are appended',
          ],
        },
        {
          heading: 'Result and lesson',
          paragraphs: ['The project received an Excellent predicate with a score of 88.71/100. It strengthened my understanding of production-oriented Android architecture, API state handling, and the details that make a paginated experience feel reliable.'],
        },
      ],
      id: [
        {
          heading: 'Konteks proyek',
          paragraphs: [
            'Mandiri News dikembangkan dalam Project-Based Virtual Internship Bank Mandiri x Rakamin pada Maret 2026. Saya bertanggung jawab membangun alur mobile untuk menelusuri dan memuat berita bisnis secara berkelanjutan dari data REST terpaginasikan.',
            'Ruang lingkup yang diselesaikan mencakup tiga layar utama Android dan integrasi dengan tiga REST endpoint.',
          ],
        },
        {
          heading: 'Tantangan pagination',
          paragraphs: ['Tantangan engineering utamanya adalah menjaga antarmuka tetap responsif ketika halaman baru dimuat. Loading, empty, success, dan failure state juga harus tetap konsisten saat pengguna menjelajahi feed.'],
        },
        {
          heading: 'Arsitektur dan implementasi',
          paragraphs: ['Saya menyusun aplikasi dengan MVVM untuk memisahkan state antarmuka dari akses data. Retrofit menangani lapisan REST, Kotlin Coroutines menjalankan proses asinkron, dan Paging 3 mengatur endless scrolling serta pemuatan halaman.'],
          bullets: [
            'Memisahkan tanggung jawab presentasi dan data dengan MVVM',
            'Merepresentasikan loading dan failure state API secara eksplisit',
            'Memuat halaman tambahan tanpa memblokir antarmuka',
            'Menjaga feed stabil ketika hasil baru ditambahkan',
          ],
        },
        {
          heading: 'Hasil dan pembelajaran',
          paragraphs: ['Proyek ini memperoleh predikat Excellent dengan nilai 88,71/100. Saya semakin memahami arsitektur Android yang berorientasi produksi, penanganan state API, dan detail yang membuat pengalaman terpaginasikan terasa andal.'],
        },
      ],
    },
  },
  {
    id: 8,
    slug: 'planetku-on-device-waste-classification',
    title: {
      en: 'Leading the Mobile Build for an On-Device Waste Classifier',
      id: 'Memimpin Pengembangan Mobile untuk Klasifikasi Sampah pada Perangkat',
    },
    excerpt: {
      en: 'How a six-person Bangkit capstone team connected TensorFlow Lite classification with a responsive Kotlin experience.',
      id: 'Cara tim capstone Bangkit beranggotakan enam orang menghubungkan klasifikasi TensorFlow Lite dengan pengalaman Kotlin yang responsif.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-08-28',
    updatedAt: '2026-08-28',
    category: 'case-study',
    tags: ['Android', 'TensorFlow Lite', 'Coroutines', 'Teamwork'],
    image: '/images/project-planetku.webp',
    projectId: 'planetku',
    impact: {
      role: { en: 'Mobile Development Lead', id: 'Lead Mobile Development' },
      team: { en: '6-member cross-functional team', id: 'Tim lintas fungsi beranggotakan 6 orang' },
      result: { en: '90% waste-classification accuracy', id: 'Akurasi klasifikasi sampah 90%' },
      scope: { en: '5+ classes with on-device AI', id: '5+ kelas dengan AI pada perangkat' },
    },
    sections: {
      en: [
        {
          heading: 'A cross-functional capstone',
          paragraphs: [
            'Planetku was built as a Bangkit 2024 capstone by a six-member cross-functional team. The product focused on waste sorting, recycling awareness, carbon calculation, and access to nearby waste banks.',
            'As Mobile Development Lead, I was responsible for connecting the Android experience with the work produced by the machine-learning and cloud tracks.',
          ],
        },
        {
          heading: 'The on-device constraint',
          paragraphs: ['The initial waste-classification model was too large and slow for a comfortable camera flow. The challenge was to run analysis on the device without making the interface feel frozen.'],
        },
        {
          heading: 'Working across disciplines',
          paragraphs: ['The mobile and machine-learning teams worked together to optimize the TensorFlow Lite model for deployment. On Android, I used Kotlin Coroutines to move image analysis away from the main interface thread and keep user feedback responsive.'],
          bullets: [
            'Camera and gallery-based waste classification',
            'Real-time carbon-footprint calculation',
            'Interactive waste-bank map locator',
            'User reward and point system',
          ],
        },
        {
          heading: 'Outcome and lesson',
          paragraphs: ['The final classifier covered more than five waste classes and reached 90% accuracy. The project taught me that successful AI integration depends as much on model constraints, asynchronous product behavior, and team communication as it does on model output.'],
        },
      ],
      id: [
        {
          heading: 'Capstone lintas fungsi',
          paragraphs: [
            'Planetku dibangun sebagai capstone Bangkit 2024 oleh tim lintas fungsi beranggotakan enam orang. Produk ini berfokus pada pemilahan sampah, kesadaran daur ulang, perhitungan karbon, dan akses ke bank sampah terdekat.',
            'Sebagai Lead Mobile Development, saya bertanggung jawab menghubungkan pengalaman Android dengan hasil kerja track machine learning dan cloud.',
          ],
        },
        {
          heading: 'Batasan pemrosesan pada perangkat',
          paragraphs: ['Model klasifikasi sampah awal terlalu besar dan lambat untuk alur kamera yang nyaman. Tantangannya adalah menjalankan analisis pada perangkat tanpa membuat antarmuka terasa berhenti.'],
        },
        {
          heading: 'Bekerja lintas disiplin',
          paragraphs: ['Tim mobile dan machine learning bekerja sama mengoptimalkan model TensorFlow Lite untuk deployment. Pada Android, saya menggunakan Kotlin Coroutines untuk memindahkan analisis gambar dari thread antarmuka utama dan menjaga umpan balik tetap responsif.'],
          bullets: [
            'Klasifikasi sampah melalui kamera dan galeri',
            'Perhitungan jejak karbon secara real-time',
            'Peta lokasi bank sampah interaktif',
            'Sistem poin dan hadiah pengguna',
          ],
        },
        {
          heading: 'Hasil dan pembelajaran',
          paragraphs: ['Classifier akhir mencakup lebih dari lima kelas sampah dan mencapai akurasi 90%. Proyek ini mengajarkan bahwa integrasi AI yang berhasil bergantung pada batasan model, perilaku produk yang asinkron, dan komunikasi tim, bukan hanya keluaran model.'],
        },
      ],
    },
  },
  {
    id: 1,
    slug: 'pengalaman-mengajar-codevox-hima',
    title: { en: 'CodeVox: Teaching Web Development Fundamentals', id: 'CodeVox: Mengajar Fundamental Web Development' },
    excerpt: {
      en: 'A practical teaching session that introduced semantic HTML, CSS layout, JavaScript basics, and responsive thinking.',
      id: 'Sesi belajar praktis tentang HTML semantik, layout CSS, dasar JavaScript, dan cara berpikir responsif.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-01-15',
    category: 'web',
    tags: ['CodeVox', 'Teaching', 'Web Development'],
    image: '/images/blog/codevox-web.jpg',
    videoId: 'LV_gu2XvIa8',
    sections: {
      en: [
        {
          heading: 'Session goal',
          paragraphs: ['This CodeVox session introduced web development through a small project that participants could follow and extend. The goal was to connect fundamental concepts with a visible result instead of presenting each technology in isolation.'],
        },
        {
          heading: 'Topics covered',
          bullets: [
            'Semantic HTML for meaningful page structure',
            'CSS spacing and layout fundamentals',
            'JavaScript and basic DOM interaction',
            'Responsive adjustments with a mobile-first mindset',
          ],
        },
        {
          heading: 'Teaching approach',
          paragraphs: ['I alternated short explanations with live coding so participants could immediately see how each concept affected the page. The recording documents the examples and the step-by-step construction of a responsive interface.'],
        },
        {
          heading: 'What I learned',
          paragraphs: ['Teaching the session reinforced the importance of explaining the reason behind a technique before introducing syntax. It also helped me practice turning a broad topic into a sequence that beginners could follow.'],
        },
      ],
      id: [
        {
          heading: 'Tujuan sesi',
          paragraphs: ['Sesi CodeVox ini memperkenalkan web development melalui proyek kecil yang dapat diikuti dan dikembangkan peserta. Tujuannya adalah menghubungkan konsep fundamental dengan hasil yang terlihat, bukan menjelaskan setiap teknologi secara terpisah.'],
        },
        {
          heading: 'Materi yang dibahas',
          bullets: [
            'HTML semantik untuk struktur halaman yang bermakna',
            'Dasar spacing dan layout menggunakan CSS',
            'JavaScript dan interaksi dasar dengan DOM',
            'Penyesuaian responsif dengan pendekatan mobile-first',
          ],
        },
        {
          heading: 'Pendekatan mengajar',
          paragraphs: ['Saya menyelingi penjelasan singkat dengan live coding agar peserta dapat langsung melihat pengaruh setiap konsep pada halaman. Rekaman sesi mendokumentasikan contoh dan proses membangun antarmuka responsif secara bertahap.'],
        },
        {
          heading: 'Pembelajaran saya',
          paragraphs: ['Mengajar sesi ini menegaskan pentingnya menjelaskan alasan di balik sebuah teknik sebelum memperkenalkan sintaks. Saya juga berlatih mengubah topik luas menjadi urutan belajar yang mudah diikuti pemula.'],
        },
      ],
    },
  },
  {
    id: 2,
    slug: 'codevox-dasar-git-github',
    title: { en: 'CodeVox: A Beginner-Friendly Git Workflow', id: 'CodeVox: Alur Kerja Git yang Ramah Pemula' },
    excerpt: {
      en: 'Breaking version control into a practical workflow for tracking changes, using remotes, and collaborating safely.',
      id: 'Menguraikan version control menjadi alur praktis untuk melacak perubahan, memakai remote, dan berkolaborasi dengan aman.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-01-20',
    category: 'learning',
    tags: ['Git', 'GitHub', 'CodeVox'],
    image: '/images/blog/codevox-git.jpg',
    videoId: 'BWuW_Lq5x1s',
    sections: {
      en: [
        {
          heading: 'Why this session mattered',
          paragraphs: ['Git can feel abstract when commands are taught without a project workflow. This CodeVox session focused on the purpose of version control first, then connected each command to a common development task.'],
        },
        {
          heading: 'Workflow covered',
          bullets: [
            'Initialize a repository and inspect its status',
            'Stage changes and write meaningful commits',
            'Push and pull from a GitHub remote',
            'Use branches to isolate feature work',
          ],
        },
        {
          heading: 'Demonstrating collaboration',
          paragraphs: ['The live demonstration followed a repository from local setup to a remote workflow. This gave participants a mental model for where changes live and why pulling before pushing reduces avoidable conflicts.'],
        },
        {
          heading: 'What I learned',
          paragraphs: ['The session improved how I explain state and history without relying on jargon. A clear visual sequence was more useful for beginners than introducing many commands at once.'],
        },
      ],
      id: [
        {
          heading: 'Mengapa sesi ini penting',
          paragraphs: ['Git dapat terasa abstrak ketika command diajarkan tanpa alur proyek. Sesi CodeVox ini dimulai dari tujuan version control, lalu menghubungkan setiap command dengan aktivitas pengembangan yang umum.'],
        },
        {
          heading: 'Alur yang dibahas',
          bullets: [
            'Menginisialisasi repository dan memeriksa statusnya',
            'Melakukan staging dan menulis commit yang bermakna',
            'Melakukan push dan pull dari remote GitHub',
            'Menggunakan branch untuk memisahkan pengembangan fitur',
          ],
        },
        {
          heading: 'Mendemonstrasikan kolaborasi',
          paragraphs: ['Demonstrasi langsung mengikuti repository dari setup lokal hingga alur remote. Dengan begitu, peserta memiliki gambaran tentang lokasi perubahan dan alasan melakukan pull sebelum push untuk mengurangi konflik.'],
        },
        {
          heading: 'Pembelajaran saya',
          paragraphs: ['Sesi ini meningkatkan cara saya menjelaskan state dan riwayat perubahan tanpa terlalu bergantung pada jargon. Urutan visual yang jelas lebih berguna bagi pemula daripada memperkenalkan banyak command sekaligus.'],
        },
      ],
    },
  },
  {
    id: 3,
    slug: 'codevox-pengenalan-android-kotlin',
    title: { en: 'CodeVox: Building a First Android App with Kotlin', id: 'CodeVox: Membangun Aplikasi Android Pertama dengan Kotlin' },
    excerpt: {
      en: 'Introducing Kotlin, Android project structure, interface layouts, user input, and debugging through a first application.',
      id: 'Memperkenalkan Kotlin, struktur proyek Android, layout antarmuka, input pengguna, dan debugging melalui aplikasi pertama.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-01-25',
    category: 'android',
    tags: ['Android', 'Kotlin', 'CodeVox'],
    image: '/images/blog/codevox-android-kotlin.jpg',
    videoId: 'd7QkvUAFkpE',
    sections: {
      en: [
        {
          heading: 'Starting from the project structure',
          paragraphs: ['This CodeVox session introduced Android development by showing how a Kotlin project is organized before writing a feature. Understanding where interface, resource, and Kotlin files live made the first implementation less intimidating.'],
        },
        {
          heading: 'Topics covered',
          bullets: [
            'Kotlin syntax used in a small Android feature',
            'Android project structure and resources',
            'Activity responsibilities and XML layouts',
            'User input, basic debugging, and device testing',
          ],
        },
        {
          heading: 'Building and testing together',
          paragraphs: ['Participants followed the setup, implementation, and run cycle in Android Studio. I demonstrated both the emulator and a physical device so the session connected code with observable application behavior.'],
        },
        {
          heading: 'What I learned',
          paragraphs: ['This session helped me explain Android as a collection of responsibilities rather than a long setup checklist. That framing made it easier to connect unfamiliar files with the interface participants were building.'],
        },
      ],
      id: [
        {
          heading: 'Memulai dari struktur proyek',
          paragraphs: ['Sesi CodeVox ini memperkenalkan Android development dengan menunjukkan susunan proyek Kotlin sebelum menulis fitur. Memahami lokasi file antarmuka, resource, dan Kotlin membuat implementasi pertama terasa lebih mudah.'],
        },
        {
          heading: 'Materi yang dibahas',
          bullets: [
            'Sintaks Kotlin yang digunakan dalam fitur Android sederhana',
            'Struktur proyek Android dan resource',
            'Tanggung jawab Activity dan layout XML',
            'Input pengguna, debugging dasar, dan pengujian perangkat',
          ],
        },
        {
          heading: 'Membangun dan menguji bersama',
          paragraphs: ['Peserta mengikuti siklus setup, implementasi, dan menjalankan aplikasi di Android Studio. Saya mendemonstrasikan emulator dan perangkat fisik agar sesi menghubungkan kode dengan perilaku aplikasi yang dapat diamati.'],
        },
        {
          heading: 'Pembelajaran saya',
          paragraphs: ['Sesi ini membantu saya menjelaskan Android sebagai kumpulan tanggung jawab, bukan daftar setup yang panjang. Kerangka tersebut memudahkan peserta menghubungkan file yang belum familiar dengan antarmuka yang sedang dibangun.'],
        },
      ],
    },
  },
  {
    id: 4,
    slug: 'codevox-android-input-navigation-lifecycle',
    title: { en: 'CodeVox: Android Input, Navigation, and Lifecycle', id: 'CodeVox: Input, Navigasi, dan Lifecycle Android' },
    excerpt: {
      en: 'A deeper Android session on validating input, moving data between screens, and understanding Activity lifecycle states.',
      id: 'Sesi Android lanjutan tentang validasi input, perpindahan data antar layar, dan pemahaman state Activity lifecycle.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-01-30',
    category: 'android',
    tags: ['Android', 'Kotlin', 'Lifecycle'],
    image: '/images/blog/codevox-android-lifecycle.jpg',
    videoId: 'HDlEZcqGv5w',
    sections: {
      en: [
        {
          heading: 'Moving beyond a static screen',
          paragraphs: ['This follow-up CodeVox session focused on the behavior that turns an Android layout into an application: responding to input, moving between screens, and preserving predictable state.'],
        },
        {
          heading: 'Concepts demonstrated',
          bullets: [
            'Validate text input and respond to button events',
            'Pass data between Activities with Intents',
            'Manage back-stack expectations during navigation',
            'Observe onCreate, onStart, onResume, onPause, onStop, and onDestroy',
          ],
        },
        {
          heading: 'Making lifecycle visible',
          paragraphs: ['I logged lifecycle callbacks while moving the application between foreground and background states. Seeing the sequence in real time helped connect lifecycle theory with resource handling and state preservation.'],
        },
        {
          heading: 'What I learned',
          paragraphs: ['The session reinforced that lifecycle concepts are easier to understand through observation than memorization. Demonstrating cause and effect made a complex topic more concrete.'],
        },
      ],
      id: [
        {
          heading: 'Melampaui layar statis',
          paragraphs: ['Sesi lanjutan CodeVox ini berfokus pada perilaku yang mengubah layout Android menjadi aplikasi: merespons input, berpindah antar layar, dan menjaga state tetap konsisten.'],
        },
        {
          heading: 'Konsep yang didemonstrasikan',
          bullets: [
            'Memvalidasi input teks dan merespons event tombol',
            'Mengirim data antar-Activity menggunakan Intent',
            'Mengelola ekspektasi back stack saat navigasi',
            'Mengamati onCreate, onStart, onResume, onPause, onStop, dan onDestroy',
          ],
        },
        {
          heading: 'Membuat lifecycle terlihat',
          paragraphs: ['Saya mencatat callback lifecycle ketika aplikasi berpindah antara foreground dan background. Melihat urutannya secara langsung membantu menghubungkan teori lifecycle dengan pengelolaan resource dan penyimpanan state.'],
        },
        {
          heading: 'Pembelajaran saya',
          paragraphs: ['Sesi ini menegaskan bahwa konsep lifecycle lebih mudah dipahami melalui pengamatan daripada hafalan. Demonstrasi sebab dan akibat membuat topik yang kompleks menjadi lebih konkret.'],
        },
      ],
    },
  },
  {
    id: 5,
    slug: 'codevox-machine-learning-dasar',
    title: { en: 'CodeVox: Machine Learning Fundamentals', id: 'CodeVox: Fundamental Machine Learning' },
    excerpt: {
      en: 'Building intuition for datasets, features, labels, train-test splits, model evaluation, and overfitting.',
      id: 'Membangun intuisi tentang dataset, fitur, label, train-test split, evaluasi model, dan overfitting.',
    },
    author: 'Rafie Rojagat Bachri',
    publishedAt: '2026-02-05',
    category: 'learning',
    tags: ['Machine Learning', 'Data', 'CodeVox'],
    image: '/images/blog/codevox-ml.jpg',
    videoId: '-tm9UPP0SYs',
    sections: {
      en: [
        {
          heading: 'Building intuition first',
          paragraphs: ['This CodeVox session introduced machine learning as a workflow for learning patterns from data. The focus was on understanding the role of each step before moving into more advanced algorithms.'],
        },
        {
          heading: 'Topics covered',
          bullets: [
            'Differences between traditional programming and machine learning',
            'Datasets, features, labels, and train-test splits',
            'Supervised learning through a simple example',
            'Accuracy, confusion matrices, validation, and overfitting',
          ],
        },
        {
          heading: 'From data to evaluation',
          paragraphs: ['The demonstration followed a small dataset through preparation, training, and evaluation. Keeping the example compact made it possible to discuss why a high score alone does not guarantee a useful model.'],
        },
        {
          heading: 'What I learned',
          paragraphs: ['Teaching this topic improved how I separate model terminology from the decisions behind it. Starting with the question and data made the evaluation metrics easier to explain.'],
        },
      ],
      id: [
        {
          heading: 'Membangun intuisi terlebih dahulu',
          paragraphs: ['Sesi CodeVox ini memperkenalkan machine learning sebagai alur untuk mempelajari pola dari data. Fokusnya adalah memahami peran setiap tahap sebelum masuk ke algoritma yang lebih lanjut.'],
        },
        {
          heading: 'Materi yang dibahas',
          bullets: [
            'Perbedaan pemrograman tradisional dan machine learning',
            'Dataset, fitur, label, serta train-test split',
            'Supervised learning melalui contoh sederhana',
            'Accuracy, confusion matrix, validasi, dan overfitting',
          ],
        },
        {
          heading: 'Dari data menuju evaluasi',
          paragraphs: ['Demonstrasi mengikuti sebuah dataset kecil dari persiapan, training, hingga evaluasi. Contoh yang ringkas memungkinkan pembahasan tentang alasan skor tinggi saja belum menjamin sebuah model berguna.'],
        },
        {
          heading: 'Pembelajaran saya',
          paragraphs: ['Mengajar topik ini meningkatkan cara saya memisahkan istilah model dari keputusan di baliknya. Memulai dari pertanyaan dan data membuat metrik evaluasi lebih mudah dijelaskan.'],
        },
      ],
    },
  },
];
