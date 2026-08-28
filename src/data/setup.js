export const setupItems = [
  {
    id: 'acer-nitro-5',
    title: 'Acer Nitro 5',
    group: 'hardware',
    icon: 'laptop',
    image: '/images/workspace/acer-nitro-5.webp',
    category: {
      en: 'Primary development machine',
      id: 'Perangkat pengembangan utama',
    },
    desc: {
      en: 'My main machine for Android Studio, React development, local builds, and everyday project work.',
      id: 'Perangkat utama untuk Android Studio, pengembangan React, build lokal, dan pengerjaan proyek sehari-hari.',
    },
    usage: {
      en: 'Keeps mobile and web development in one environment, from implementation through local testing.',
      id: 'Menyatukan pengembangan mobile dan web dalam satu lingkungan, dari implementasi sampai pengujian lokal.',
    },
    link: 'https://www.acer.com/us-en/laptops/nitro/nitro-5',
    linkType: 'product',
  },
  {
    id: 'redmi-pad-pro',
    title: 'Redmi Pad Pro',
    group: 'hardware',
    icon: 'tablet',
    image: '/images/workspace/redmi-pad-pro.jpg',
    category: {
      en: 'Documentation screen',
      id: 'Layar dokumentasi',
    },
    desc: {
      en: 'A secondary screen for documentation, references, tutorials, and reviewing responsive interfaces.',
      id: 'Layar kedua untuk dokumentasi, referensi, tutorial, dan meninjau antarmuka responsif.',
    },
    usage: {
      en: 'Reduces context switching while coding and gives me another viewport for interface checks.',
      id: 'Mengurangi perpindahan konteks saat coding dan memberi viewport tambahan untuk mengecek antarmuka.',
    },
    link: 'https://www.mi.com/global/product/redmi-pad-pro/',
    linkType: 'product',
  },
  {
    id: 'samsung-galaxy-a33',
    title: 'Samsung Galaxy A33 5G',
    group: 'hardware',
    icon: 'smartphone',
    image: '/images/workspace/samsung-galaxy-a33.jpg',
    category: {
      en: 'Physical Android test device',
      id: 'Perangkat uji Android fisik',
    },
    desc: {
      en: 'My daily phone and primary physical device for validating Android builds beyond the emulator.',
      id: 'Ponsel harian sekaligus perangkat fisik utama untuk memvalidasi build Android di luar emulator.',
    },
    usage: {
      en: 'Used to check touch behavior, permissions, performance, and real-device UI before demos.',
      id: 'Digunakan untuk mengecek interaksi sentuh, permission, performa, dan UI perangkat nyata sebelum demo.',
    },
    link: 'https://www.samsung.com/id/smartphones/galaxy-a/galaxy-a33-5g-awesome-blue-128gb-sm-a336elbhxid/',
    linkType: 'product',
  },
  {
    id: 'visual-studio-code',
    title: 'Visual Studio Code',
    group: 'development',
    icon: 'code',
    category: {
      en: 'Web editor',
      id: 'Editor web',
    },
    desc: {
      en: 'My primary editor for React, JavaScript, serverless functions, and quick repository work.',
      id: 'Editor utama untuk React, JavaScript, serverless function, dan pekerjaan repository sehari-hari.',
    },
    usage: {
      en: 'Prettier, Git integration, and focused extensions keep the feedback loop fast and predictable.',
      id: 'Prettier, integrasi Git, dan ekstensi terpilih menjaga feedback loop tetap cepat dan konsisten.',
    },
    link: 'https://code.visualstudio.com/',
    linkType: 'website',
  },
  {
    id: 'android-studio',
    title: 'Android Studio',
    group: 'development',
    icon: 'smartphone',
    category: {
      en: 'Android IDE',
      id: 'IDE Android',
    },
    desc: {
      en: 'The main environment for Kotlin, Jetpack Compose, Gradle builds, emulators, and device debugging.',
      id: 'Lingkungan utama untuk Kotlin, Jetpack Compose, Gradle build, emulator, dan debugging perangkat.',
    },
    usage: {
      en: 'Covers the complete Android loop from UI implementation to profiling and signed builds.',
      id: 'Mencakup alur Android lengkap dari implementasi UI hingga profiling dan signed build.',
    },
    link: 'https://developer.android.com/studio',
    linkType: 'website',
  },
  {
    id: 'firebase',
    title: 'Firebase',
    group: 'development',
    icon: 'database',
    category: {
      en: 'Backend services',
      id: 'Layanan backend',
    },
    desc: {
      en: 'A practical backend layer for authentication, Firestore data, and real-time product features.',
      id: 'Lapisan backend praktis untuk autentikasi, data Firestore, dan fitur produk real-time.',
    },
    usage: {
      en: 'Useful for shipping prototypes quickly while keeping authentication and data flows structured.',
      id: 'Berguna untuk merilis prototipe dengan cepat sambil menjaga autentikasi dan alur data tetap terstruktur.',
    },
    link: 'https://firebase.google.com/',
    linkType: 'website',
  },
  {
    id: 'figma',
    title: 'Figma',
    group: 'design-productivity',
    icon: 'pen-tool',
    category: {
      en: 'Interface design',
      id: 'Desain antarmuka',
    },
    desc: {
      en: 'Where I explore flows, wireframes, component states, and responsive layouts before implementation.',
      id: 'Tempat saya mengeksplorasi alur, wireframe, state komponen, dan layout responsif sebelum implementasi.',
    },
    usage: {
      en: 'Helps reduce UI rework by clarifying hierarchy and interaction states before code.',
      id: 'Membantu mengurangi revisi UI dengan memperjelas hierarki dan state interaksi sebelum coding.',
    },
    link: 'https://www.figma.com/',
    linkType: 'website',
  },
  {
    id: 'notion',
    title: 'Notion',
    group: 'design-productivity',
    icon: 'notebook',
    category: {
      en: 'Planning and notes',
      id: 'Perencanaan dan catatan',
    },
    desc: {
      en: 'My workspace for requirements, research notes, project checklists, and lightweight documentation.',
      id: 'Ruang kerja untuk requirement, catatan riset, checklist proyek, dan dokumentasi ringan.',
    },
    usage: {
      en: 'Keeps project context visible before tasks move into implementation and version control.',
      id: 'Menjaga konteks proyek tetap terlihat sebelum tugas masuk ke implementasi dan version control.',
    },
    link: 'https://www.notion.so/',
    linkType: 'website',
  },
  {
    id: 'postman',
    title: 'Postman',
    group: 'testing-delivery',
    icon: 'test',
    category: {
      en: 'API testing',
      id: 'Pengujian API',
    },
    desc: {
      en: 'Used to inspect endpoints, authentication, payloads, and failure responses before UI integration.',
      id: 'Digunakan untuk memeriksa endpoint, autentikasi, payload, dan respons gagal sebelum integrasi UI.',
    },
    usage: {
      en: 'Separates API problems from interface problems and makes integration debugging more deliberate.',
      id: 'Memisahkan masalah API dari masalah antarmuka sehingga debugging integrasi lebih terarah.',
    },
    link: 'https://www.postman.com/',
    linkType: 'website',
  },
  {
    id: 'github',
    title: 'GitHub',
    group: 'testing-delivery',
    icon: 'git-branch',
    category: {
      en: 'Version control and delivery',
      id: 'Version control dan delivery',
    },
    desc: {
      en: 'The shared source of truth for repositories, code review, project history, and automated workflows.',
      id: 'Sumber utama untuk repository, code review, riwayat proyek, dan workflow otomatis.',
    },
    usage: {
      en: 'Keeps changes reviewable and provides a clear trail from an idea to a shipped iteration.',
      id: 'Menjaga perubahan tetap dapat ditinjau dan memberi jejak jelas dari ide hingga iterasi yang dirilis.',
    },
    link: 'https://github.com/Rafie1715',
    linkType: 'profile',
  },
];
