export const projects = [
  {
    id: "planetku",
    title: {
      en: "Planetku (Smart Waste Management App)",
      id: "Planetku (Aplikasi Pengelolaan Sampah Cerdas)"
    },
    category: "mobile",
    image: "/images/project-planetku.webp",
    shortDesc: {
      en: "Capstone project for Bangkit 2024. Features AI-powered waste classification, carbon calculation, and waste bank locator.",
      id: "Proyek Capstone Bangkit 2024. Fitur klasifikasi sampah berbasis AI, kalkulasi karbon, dan pencari bank sampah."
    },
    fullDesc: {
      en: "Waste management is a significant challenge in many urban areas. The goal of Planetku was to create a mobile application that empowers users to manage their waste more effectively and sustainably. The app aims to solve problems like incorrect waste sorting, lack of awareness about recycling value, and difficulty in finding nearby waste banks.",
      id: "Pengelolaan sampah adalah tantangan besar di banyak daerah perkotaan. Tujuan Planetku adalah membuat aplikasi seluler yang memberdayakan pengguna untuk mengelola sampah mereka secara lebih efektif dan berkelanjutan. Aplikasi ini bertujuan untuk memecahkan masalah seperti pemilahan sampah yang salah, kurangnya kesadaran tentang nilai daur ulang, dan kesulitan menemukan bank sampah terdekat."
    },
    challenges: {
      en: "One of the biggest challenges was implementing the camera-based waste classification feature efficiently without slowing down the user's device. The initial model was quite large and slow.",
      id: "Salah satu tantangan terbesar adalah mengimplementasikan fitur klasifikasi sampah berbasis kamera secara efisien tanpa memperlambat perangkat pengguna. Model awal cukup besar dan lambat."
    },
    solution: {
      en: "We worked closely with the Machine Learning team to optimize the TensorFlow Lite model for mobile deployment. On the app side, I implemented asynchronous processing (`Coroutines` in Kotlin) to ensure the UI remained responsive while the image was being analyzed in the background.",
      id: "Kami bekerja sama dengan tim Machine Learning untuk mengoptimalkan model TensorFlow Lite agar siap digunakan di seluler. Di sisi aplikasi, saya menerapkan pemrosesan asinkron (`Coroutines` di Kotlin) untuk memastikan UI tetap responsif saat gambar dianalisis di latar belakang."
    },
    lessonLearned: {
      en: "I learned how to integrate TFLite with Android efficiently and mastered Kotlin Coroutines for background tasks. It also taught me the importance of cross-functional collaboration between ML and Mobile teams.",
      id: "Saya belajar cara mengintegrasikan TFLite dengan Android secara efisien dan menguasai Kotlin Coroutines untuk tugas latar belakang. Ini juga mengajarkan saya pentingnya kolaborasi lintas fungsi antara tim ML dan Mobile."
    },
    features: {
      en: [
        "AI Waste Classification (Camera & Gallery)",
        "Real-time Carbon Footprint Calculation",
        "Interactive Waste Bank Map Locator",
        "User Reward & Point System"
      ],
      id: [
        "Klasifikasi Sampah AI (Kamera & Galeri)",
        "Perhitungan Jejak Karbon Real-time",
        "Peta Lokasi Bank Sampah Interaktif",
        "Sistem Poin & Hadiah Pengguna"
      ]
    },
    techStack: [
      { name: "Kotlin", icon: "devicon-kotlin-plain" },
      { name: "Android Studio", icon: "devicon-androidstudio-plain" },
      { name: "Firebase", icon: "devicon-firebase-plain" },
      { name: "TensorFlow", icon: "devicon-tensorflow-original" }
    ],
    github: "https://github.com/PlanetKu-Capstone",
    gallery: [
      "/images/Planetku1.webp",
      "/images/Planetku2.webp",
      "/images/Planetku3.webp",
      "/images/Planetku4.webp",
      "/images/Planetku5.webp"
    ]
  },
  {
    id: "cinemazone",
    title: {
      en: "CinemaZone - Movie Ticket Booking App",
      id: "CinemaZone - Aplikasi Pemesanan Tiket Bioskop"
    },
    category: "mobile",
    image: "/images/project-cinemazone.webp",
    shortDesc: {
      en: "Android app with Firebase Auth, Cloud Firestore for wishlists, and a QR Code e-ticket generator.",
      id: "Aplikasi Android dengan Firebase Auth, Cloud Firestore untuk wishlist, dan generator e-tiket QR Code."
    },
    fullDesc: {
      en: "The CinemaZone project was developed to create a seamless and feature-rich movie ticket booking experience on an Android platform. The goal was to build an application that handles the entire user journey, from Browse movies and viewing details to selecting seats and generating a digital e-ticket.",
      id: "Proyek CinemaZone dikembangkan untuk menciptakan pengalaman pemesanan tiket bioskop yang mulus dan kaya fitur di platform Android. Tujuannya adalah membangun aplikasi yang menangani seluruh perjalanan pengguna, mulai dari menelusuri film dan melihat detail hingga memilih kursi dan membuat e-tiket digital."
    },
    challenges: {
      en: "A primary challenge was designing and implementing the interactive seat picker, which needed to visually represent the cinema layout and handle seat selection state (available, selected, occupied) in real-time.",
      id: "Tantangan utamanya adalah merancang dan mengimplementasikan pemilih kursi interaktif, yang perlu merepresentasikan tata letak bioskop secara visual dan menangani status pemilihan kursi (tersedia, dipilih, terisi) secara real-time."
    },
    solution: {
      en: "I implemented this using a dynamic GridView in Android. Each seat was an object with a specific state. I used Firebase's Realtime Database to listen for changes, ensuring that if another user booked a seat, the UI would update instantly.",
      id: "Saya mengimplementasikan ini menggunakan GridView dinamis di Android. Setiap kursi adalah objek dengan status tertentu. Saya menggunakan Firebase Realtime Database untuk mendengarkan perubahan, memastikan bahwa jika pengguna lain memesan kursi, UI akan diperbarui secara instan."
    },
    lessonLearned: {
      en: "This project deepened my understanding of NoSQL databases (Firestore vs Realtime DB). I learned how to handle complex state management for the seat selection logic to prevent double-booking.",
      id: "Proyek ini memperdalam pemahaman saya tentang database NoSQL (Firestore vs Realtime DB). Saya belajar cara menangani manajemen status yang kompleks untuk logika pemilihan kursi guna mencegah pemesanan ganda."
    },
    features: {
      en: [
        "User Authentication (Login/Register)",
        "Real-time Seat Selection Status",
        "E-Ticket QR Code Generation",
        "Movie Wishlist System"
      ],
      id: [
        "Autentikasi Pengguna (Login/Register)",
        "Status Pemilihan Kursi Real-time",
        "Pembuatan Kode QR E-Ticket",
        "Sistem Wishlist Film"
      ]
    },
    techStack: [
      { name: "Kotlin", icon: "devicon-kotlin-plain" },
      { name: "Firebase", icon: "devicon-firebase-plain" },
      { name: "Android Studio", icon: "devicon-androidstudio-plain" }
    ],
    github: "https://github.com/Rafie1715/CinemaZone",
    gallery: [
      "/images/project-cinemazone2.webp",
      "/images/project-cinemazone3.webp"
    ]
  },
  {
    id: "computer-crafter",
    title: {
      en: "Computer Crafter Website",
      id: "Website Computer Crafter"
    },
    category: "web",
    image: "/images/project-computercrafter.webp",
    shortDesc: {
      en: "A web-based PC building simulator for enthusiasts and beginners.",
      id: "Simulator perakitan PC berbasis web untuk penggemar dan pemula."
    },
    fullDesc: {
      en: "The process of building a personal computer can be intimidating for newcomers due to component compatibility issues. Computer Crafter was created to demystify this process, providing a user-friendly platform where users can select PC parts, see a real-time price total, and be confident that their chosen components will work together.",
      id: "Proses merakit komputer pribadi bisa menakutkan bagi pendatang baru karena masalah kompatibilitas komponen. Computer Crafter dibuat untuk menyederhanakan proses ini, menyediakan platform yang ramah pengguna di mana pengguna dapat memilih suku cadang PC, melihat total harga waktu nyata, dan yakin bahwa komponen yang mereka pilih akan bekerja bersama."
    },
    challenges: {
      en: "The most complex part of this project was managing the database of components and implementing the compatibility logic. For example, ensuring a selected CPU was compatible with the chosen motherboard's socket type.",
      id: "Bagian paling kompleks dari proyek ini adalah mengelola database komponen dan menerapkan logika kompatibilitas. Misalnya, memastikan CPU yang dipilih kompatibel dengan jenis soket motherboard yang dipilih."
    },
    solution: {
      en: "I designed a relational database schema in MySQL to store components with their relevant specifications. Using PHP on the back-end, I created API endpoints that would dynamically filter the options available in the dropdown menus via AJAX.",
      id: "Saya merancang skema database relasional di MySQL untuk menyimpan komponen dengan spesifikasi yang relevan. Menggunakan PHP di back-end, saya membuat endpoint API yang secara dinamis memfilter opsi yang tersedia di menu drop-down melalui AJAX."
    },
    lessonLearned: {
      en: "I gained solid experience in Relational Database Design and normalization. I also learned how to use AJAX for dynamic content loading without refreshing the page.",
      id: "Saya memperoleh pengalaman yang kuat dalam Desain Database Relasional dan normalisasi. Saya juga belajar cara menggunakan AJAX untuk memuat konten dinamis tanpa me-refresh halaman."
    },
    features: {
      en: [
        "PC Part Picker Simulator",
        "Automatic Compatibility Check",
        "Real-time Price Estimation",
        "Component Database Management"
      ],
      id: [
        "Simulator Pemilih Suku Cadang PC",
        "Pemeriksaan Kompatibilitas Otomatis",
        "Estimasi Harga Real-time",
        "Manajemen Database Komponen"
      ]
    },
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "PHP", icon: "devicon-php-plain" },
      { name: "MySQL", icon: "devicon-mysql-plain" },
      { name: "Bootstrap", icon: "devicon-bootstrap-plain" }
    ],
    github: "https://github.com/inotlusrabka/Project-Web",
    gallery: [
      "/images/project-computercrafter2.webp"
    ]
  },
  {
    id: "lamimin",
    title: {
      en: "LaMiMin (Lapar Miskin Minus) UI/UX",
      id: "UI/UX LaMiMin (Lapar Miskin Minus)"
    },
    category: "ui",
    image: "/images/project-lamimin.webp",
    shortDesc: {
      en: "App interface design focused on SDG 1 (No Poverty) and SDG 2 (Zero Hunger).",
      id: "Desain antarmuka aplikasi yang berfokus pada SDG 1 (Tanpa Kemiskinan) dan SDG 2 (Tanpa Kelaparan)."
    },
    fullDesc: {
      en: "This application interface was designed to address two critical Sustainable Development Goals (SDGs): SDG 1 (No Poverty) and SDG 2 (Zero Hunger). We chose these themes because poverty and hunger are fundamental, interconnected issues.",
      id: "Antarmuka aplikasi ini dirancang untuk mengatasi dua Tujuan Pembangunan Berkelanjutan (SDGs) yang kritis: SDG 1 (Tanpa Kemiskinan) dan SDG 2 (Tanpa Kelaparan). Kami memilih tema-tema ini karena kemiskinan dan kelaparan adalah masalah mendasar yang saling berhubungan."
    },
    challenges: {
      en: "Creating an intuitive and trustworthy user experience. Key considerations included making the donation process as simple as possible and ensuring transparency in fund distribution.",
      id: "Menciptakan pengalaman pengguna yang intuitif dan tepercaya. Pertimbangan utama termasuk membuat proses donasi sesederhana mungkin dan memastikan transparansi dalam distribusi dana."
    },
    solution: {
      en: "We used Figma to create wireframes, high-fidelity mockups, and an interactive prototype to simulate the user flow from discovery to donation.",
      id: "Kami menggunakan Figma untuk membuat wireframe, mockup high-fidelity, dan prototipe interaktif untuk mensimulasikan alur pengguna dari penemuan hingga donasi."
    },
    lessonLearned: {
      en: "I learned the importance of Empathy Maps and User Personas in design. It taught me that a good UI is not just about aesthetics, but about solving user problems efficiently.",
      id: "Saya belajar pentingnya Peta Empati dan Persona Pengguna dalam desain. Ini mengajarkan saya bahwa UI yang baik bukan hanya tentang estetika, tetapi tentang memecahkan masalah pengguna secara efisien."
    },
    features: {
      en: [
        "Donation Tracking Dashboard",
        "Transparent Fund Reporting",
        "User Profile & History",
        "Social Sharing Integration"
      ],
      id: [
        "Dashboard Pelacakan Donasi",
        "Pelaporan Dana Transparan",
        "Profil & Riwayat Pengguna",
        "Integrasi Berbagi Sosial"
      ]
    },
    techStack: [
      { name: "Figma", icon: "devicon-figma-plain" }
    ],
    figma: "https://www.figma.com/design/abLUBq3MKWlLsFA70Foznn/Lamimin?node-id=0-1&node-type=canvas&t=PlGVttlcvHZiLx4B-0",
    prototype: "https://www.figma.com/proto/abLUBq3MKWlLsFA70Foznn/Lamimin?node-id=48-537&node-type=canvas&t=sdLMx6dqWfX4HUzo-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A2",
    gallery: [
      "/images/project-lamimin2.webp"
    ]
  },
  {
    id: "library-system",
    title: {
      en: "Library Book Lending System",
      id: "Sistem Peminjaman Buku Perpustakaan"
    },
    category: "java",
    image: "/images/project-library-system.webp",
    shortDesc: {
      en: "A Java-based program to efficiently manage book loans, featuring user registration and loan tracking.",
      id: "Program berbasis Java untuk mengelola pinjaman buku secara efisien, menampilkan pendaftaran pengguna dan pelacakan pinjaman."
    },
    fullDesc: {
      en: "This project was created to provide a simple yet robust solution for managing book loans in a small library. The application handles essential functions such as cataloging books, registering users, and tracking the status of each loan (borrowed or returned).",
      id: "Proyek ini dibuat untuk memberikan solusi sederhana namun kuat untuk mengelola pinjaman buku di perpustakaan kecil. Aplikasi ini menangani fungsi-fungsi penting seperti katalog buku, pendaftaran pengguna, dan pelacakan status setiap pinjaman (dipinjam atau dikembalikan)."
    },
    challenges: {
      en: "The primary challenge was designing an intuitive Graphical User Interface (GUI) using Java's Swing library, which can be less straightforward than modern UI frameworks.",
      id: "Tantangan utamanya adalah merancang Antarmuka Pengguna Grafis (GUI) yang intuitif menggunakan pustaka Swing Java, yang bisa kurang mudah dibandingkan kerangka kerja UI modern."
    },
    solution: {
      en: "I dedicated significant time to learning the intricacies of Swing's layout managers (like `BorderLayout`, `GridLayout`). By carefully nesting `JPanel` components, I built a structured and responsive layout manually.",
      id: "Saya mendedikasikan waktu yang signifikan untuk mempelajari seluk-beluk manajer tata letak Swing (seperti `BorderLayout`, `GridLayout`). Dengan menyusun komponen `JPanel` secara hati-hati, saya membangun tata letak yang terstruktur dan responsif secara manual."
    },
    lessonLearned: {
      en: "This project solidified my understanding of Object-Oriented Programming (OOP) concepts like Inheritance and Encapsulation. I also got comfortable with Desktop GUI development.",
      id: "Proyek ini memantapkan pemahaman saya tentang konsep Pemrograman Berorientasi Objek (OOP) seperti Pewarisan dan Enkapsulasi. Saya juga menjadi nyaman dengan pengembangan GUI Desktop."
    },
    features: {
      en: [
        "Book CRUD Operations",
        "Member Registration System",
        "Loan & Return Tracking",
        "Overdue Fine Calculation"
      ],
      id: [
        "Operasi CRUD Buku",
        "Sistem Pendaftaran Anggota",
        "Pelacakan Peminjaman & Pengembalian",
        "Perhitungan Denda Keterlambatan"
      ]
    },
    techStack: [
      { name: "Java", icon: "devicon-java-plain" },
      { name: "IntelliJ IDEA", icon: "devicon-intellij-plain" }
    ],
    github: "https://github.com/Rafie1715/ProjekUASPBOPerpustakaan",
    gallery: []
  },
  {
    id: "tools-launcher",
    title: {
      en: "Tools Launcher Program",
      id: "Program Peluncur Alat"
    },
    category: "python",
    image: "/images/project-tools-launcher.webp",
    shortDesc: {
      en: "A desktop tools launcher built with Python and the Tkinter library.",
      id: "Peluncur alat desktop yang dibuat dengan Python dan pustaka Tkinter."
    },
    fullDesc: {
      en: "This project aims to develop a tools launcher program using Python and the Tkinter library for the GUI. The launcher provides easy access to four essential tools: a calculator, a to-do list, a notepad, and a whiteboard.",
      id: "Proyek ini bertujuan untuk mengembangkan program peluncur alat menggunakan Python dan pustaka Tkinter untuk GUI. Peluncur menyediakan akses mudah ke empat alat penting: kalkulator, daftar tugas, notepad, dan papan tulis."
    },
    challenges: {
      en: "Integrating multiple distinct functionalities (calculator logic, canvas drawing for whiteboard) into a single cohesive application.",
      id: "Mengintegrasikan beberapa fungsionalitas berbeda (logika kalkulator, menggambar kanvas untuk papan tulis) ke dalam satu aplikasi yang kohesif."
    },
    solution: {
      en: "Used Python's modularity to separate the logic for each tool and integrated them into a main dashboard using Tkinter.",
      id: "Menggunakan modularitas Python untuk memisahkan logika setiap alat dan mengintegrasikannya ke dasbor utama menggunakan Tkinter."
    },
    lessonLearned: {
      en: "I learned how to manage multiple windows and contexts in a GUI application. It also improved my skills in writing modular and reusable Python code.",
      id: "Saya belajar cara mengelola beberapa jendela dan konteks dalam aplikasi GUI. Ini juga meningkatkan keterampilan saya dalam menulis kode Python yang modular dan dapat digunakan kembali."
    },
    features: {
      en: [
        "Scientific Calculator",
        "Persistent To-Do List",
        "Quick Note Editor",
        "Interactive Whiteboard Canvas"
      ],
      id: [
        "Kalkulator Ilmiah",
        "Daftar Tugas Persisten",
        "Editor Catatan Cepat",
        "Kanvas Papan Tulis Interaktif"
      ]
    },
    techStack: [
      { name: "Python", icon: "devicon-python-plain" }
    ],
    github: "https://github.com/Rafie1715/Projek_UAS_AlgoPro1",
    gallery: []
  },
  {
    id: "mangosteen-detect",
    title: {
      en: "Mangosteen Maturity Detection",
      id: "Deteksi Kematangan Manggis"
    },
    category: "python",
    image: "/images/project-mangosteen-detector.webp",
    shortDesc: {
      en: "A Python application using OpenCV to detect mangosteen maturity based on its skin color.",
      id: "Aplikasi Python menggunakan OpenCV untuk mendeteksi kematangan manggis berdasarkan warna kulitnya."
    },
    fullDesc: {
      en: "Manually sorting fruit by maturity is a time-consuming process. This project aimed to automate the detection of mangosteen maturity by analyzing the fruit's skin color using Image Processing.",
      id: "Menyortir buah secara manual berdasarkan kematangan adalah proses yang memakan waktu. Proyek ini bertujuan untuk mengotomatisasi deteksi kematangan manggis dengan menganalisis warna kulit buah menggunakan Pemrosesan Citra."
    },
    challenges: {
      en: "Accurately distinguishing between ripe and unripe fruit under varying lighting conditions. Simple RGB analysis was unreliable.",
      id: "Membedakan secara akurat antara buah matang dan mentah dalam kondisi pencahayaan yang bervariasi. Analisis RGB sederhana tidak dapat diandalkan."
    },
    solution: {
      en: "Implemented image processing using the HSV (Hue, Saturation, Value) color space, which is less sensitive to lighting. Applied thresholding on the Hue channel and morphological operations to isolate the fruit.",
      id: "Menerapkan pemrosesan citra menggunakan ruang warna HSV (Hue, Saturation, Value), yang kurang sensitif terhadap pencahayaan. Menerapkan ambang batas pada saluran Hue dan operasi morfologis untuk mengisolasi buah."
    },
    lessonLearned: {
      en: "I gained practical knowledge of Computer Vision concepts. I learned why HSV is often better than RGB for color detection and how to use OpenCV for image manipulation.",
      id: "Saya memperoleh pengetahuan praktis tentang konsep Computer Vision. Saya belajar mengapa HSV seringkali lebih baik daripada RGB untuk deteksi warna dan cara menggunakan OpenCV untuk manipulasi gambar."
    },
    features: {
      en: [
        "Image Upload & Capture",
        "HSV Color Space Analysis",
        "Automated Maturity Classification",
        "Visual Feedback Overlay"
      ],
      id: [
        "Unggah & Tangkap Gambar",
        "Analisis Ruang Warna HSV",
        "Klasifikasi Kematangan Otomatis",
        "Overlay Umpan Balik Visual"
      ]
    },
    techStack: [
      { name: "Python", icon: "devicon-python-plain" },
      { name: "OpenCV", icon: "devicon-opencv-plain" }
    ],
    github: "https://github.com/Rafie1715/Projek_UAS_PCD",
    gallery: []
  },
  {
    id: "temp-converter",
    title: {
      en: "Temperature Converter Website",
      id: "Website Konversi Suhu"
    },
    category: "web",
    image: "/images/project-temp-converter.webp",
    shortDesc: {
      en: "A user-friendly website for instant Celsius and Fahrenheit conversion.",
      id: "Situs web ramah pengguna untuk konversi instan Celcius dan Fahrenheit."
    },
    fullDesc: {
      en: "This project was created to demonstrate fundamental front-end web development skills. It is a user-friendly Temperature Converter website that enables instant and accurate conversion between Celsius and Fahrenheit.",
      id: "Proyek ini dibuat untuk mendemonstrasikan keterampilan dasar pengembangan web front-end. Ini adalah situs web Pengonversi Suhu yang ramah pengguna yang memungkinkan konversi instan dan akurat antara Celcius dan Fahrenheit."
    },
    challenges: {
      en: "Implementing the conversion logic dynamically and handling user input validation.",
      id: "Mengimplementasikan logika konversi secara dinamis dan menangani validasi input pengguna."
    },
    solution: {
      en: "Used vanilla JavaScript DOM manipulation to capture input events and calculate conversions in real-time.",
      id: "Menggunakan manipulasi DOM JavaScript vanilla untuk menangkap peristiwa input dan menghitung konversi secara real-time."
    },
    lessonLearned: {
      en: "This was my first step into interactive web development. I mastered DOM manipulation and event listeners without relying on frameworks.",
      id: "Ini adalah langkah pertama saya ke dalam pengembangan web interaktif. Saya menguasai manipulasi DOM dan pendengar acara tanpa bergantung pada kerangka kerja."
    },
    features: {
      en: [
        "Real-time Conversion",
        "Bidirectional Input Support",
        "Input Validation",
        "Responsive Design"
      ],
      id: [
        "Konversi Real-time",
        "Dukungan Input Dua Arah",
        "Validasi Input",
        "Desain Responsif"
      ]
    },
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" }
    ],
    github: "https://github.com/revou-fundamental-course/5-feb-24-Rafie1715",
    live: "https://revou-fundamental-course.github.io/5-feb-24-Rafie1715",
    gallery: []
  },
  {
    id: "sdgs-web",
    title: {
      en: "Landing Page Website About SDGs",
      id: "Landing Page Website Tentang SDGs"
    },
    category: "web",
    image: "/images/project-sdgs-website.webp",
    shortDesc: {
      en: "A project-based landing page website to introduce the Sustainable Development Goals (SDGs).",
      id: "Website landing page berbasis proyek untuk memperkenalkan Tujuan Pembangunan Berkelanjutan (SDGs)."
    },
    fullDesc: {
      en: "This project was developed as a team-based landing page to provide a clear and concise introduction to the United Nations' Sustainable Development Goals (SDGs).",
      id: "Proyek ini dikembangkan sebagai landing page berbasis tim untuk memberikan pengantar yang jelas dan ringkas tentang Tujuan Pembangunan Berkelanjutan (SDGs) PBB."
    },
    challenges: {
      en: "Coordinating with a team to merge different sections of the website.",
      id: "Berkoordinasi dengan tim untuk menggabungkan berbagai bagian situs web."
    },
    solution: {
      en: "Used Git for version control and clearly defined sections for each team member.",
      id: "Menggunakan Git untuk kontrol versi dan bagian yang jelas untuk setiap anggota tim."
    },
    lessonLearned: {
      en: "I learned the basics of Git collaboration and conflict resolution. It also taught me how to structure a project for team development.",
      id: "Saya mempelajari dasar-dasar kolaborasi Git dan penyelesaian konflik. Ini juga mengajari saya cara menyusun proyek untuk pengembangan tim."
    },
    features: {
      en: [
        "Informational Sections for SDGs",
        "Team Member Section",
        "Contact Form Integration",
        "Bootstrap Responsive Grid"
      ],
      id: [
        "Bagian Informasi untuk SDGs",
        "Bagian Anggota Tim",
        "Integrasi Formulir Kontak",
        "Grid Responsif Bootstrap"
      ]
    },
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "Bootstrap", icon: "devicon-bootstrap-plain" }
    ],
    github: "https://github.com/samsamsemy/Landing-page",
    live: "https://landing-page-zeta-two-87.vercel.app",
    gallery: []
  },
  {
    id: "block-breaker",
    title: {
      en: "Block Breaker Game",
      id: "Game Block Breaker"
    },
    category: "web",
    image: "/images/project-blockbreaker.webp",
    shortDesc: {
      en: "A modern 'Breakout' arcade game built from scratch using HTML5 Canvas and AI assistance.",
      id: "Game arcade 'Breakout' modern yang dibuat dari nol menggunakan HTML5 Canvas dan bantuan AI."
    },
    fullDesc: {
      en: "This project is a modern, from-scratch implementation of the classic arcade game 'Breakout'. The game challenges the player to destroy all bricks on the screen by deflecting a ball with a paddle. The primary objective was to build a fully functional, interactive web application using fundamental web technologies, all while documenting how an AI assistant (IBM Granite) was used to accelerate development, optimize code, and debug issues.",
      id: "Proyek ini adalah implementasi modern dari nol untuk game arcade klasik 'Breakout'. Game ini menantang pemain untuk menghancurkan semua batu bata di layar dengan memantulkan bola menggunakan dayung. Tujuan utamanya adalah membangun aplikasi web interaktif yang berfungsi penuh menggunakan teknologi web dasar, sambil mendokumentasikan bagaimana asisten AI (IBM Granite) digunakan untuk mempercepat pengembangan, mengoptimalkan kode, dan men-debug masalah."
    },
    challenges: {
      en: "Building a fully functional game engine logic (rendering, physics, collision detection) from scratch using only the Canvas API without relying on external game libraries like Phaser.",
      id: "Membangun logika mesin game yang berfungsi penuh (rendering, fisika, deteksi tabrakan) dari nol hanya menggunakan Canvas API tanpa bergantung pada pustaka game eksternal seperti Phaser."
    },
    solution: {
      en: "Leveraged IBM Granite AI as a co-pilot to generate boilerplate code, develop complex algorithms for collision detection, and implement a state management system (Menu, Playing, Game Over) for smooth game flow.",
      id: "Memanfaatkan IBM Granite AI sebagai co-pilot untuk menghasilkan kode boilerplate, mengembangkan algoritma kompleks untuk deteksi tabrakan, dan menerapkan sistem manajemen status (Menu, Bermain, Game Over) untuk alur permainan yang lancar."
    },
    lessonLearned: {
      en: "I mastered the HTML5 Canvas API and game loop logic (`requestAnimationFrame`). It also taught me how to effectively prompt AI for complex algorithmic problems.",
      id: "Saya menguasai API HTML5 Canvas dan logika loop game (`requestAnimationFrame`). Ini juga mengajari saya cara meminta AI secara efektif untuk masalah algoritmik yang kompleks."
    },
    features: {
      en: [
        "Physics-based Collision Detection",
        "Score & High Score System",
        "Multiple Game States (Menu, Play, Over)",
        "Sound Effects & Animations"
      ],
      id: [
        "Deteksi Tabrakan Berbasis Fisika",
        "Sistem Skor & Skor Tinggi",
        "Beberapa Status Game (Menu, Main, Selesai)",
        "Efek Suara & Animasi"
      ]
    },
    techStack: [
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
    ],
    github: "https://github.com/Rafie1715/Capstone-Project-IBM-Granite",
    live: "https://block-breaker.netlify.app/",
    gallery: [
      "/images/project-blockbreaker2.webp",
      "/images/project-blockbreaker3.webp"
    ]
  },
  {
    id: "quick-quiz",
    title: {
      en: "QuickQuiz - Multi-Platform App",
      id: "QuickQuiz - Aplikasi Multi-Platform"
    },
    category: "flutter",
    image: "/images/project-quickquiz.webp",
    shortDesc: {
      en: "A simple, multi-platform quiz application built with Flutter demonstrating state management and clean UI.",
      id: "Aplikasi kuis sederhana multi-platform yang dibuat dengan Flutter mendemonstrasikan manajemen status dan UI yang bersih."
    },
    fullDesc: {
      en: "QuickQuiz is a general knowledge quiz app designed with a clean, user-friendly interface. The app guides users through a welcome screen, a quiz interface with a progress bar, and a results screen that calculates the score percentage. It demonstrates fundamental mobile development concepts like navigation, local data handling, and responsive UI design.",
      id: "QuickQuiz adalah aplikasi kuis pengetahuan umum yang dirancang dengan antarmuka yang bersih dan ramah pengguna. Aplikasi ini memandu pengguna melalui layar sambutan, antarmuka kuis dengan bilah kemajuan, dan layar hasil yang menghitung persentase skor. Ini mendemonstrasikan konsep dasar pengembangan seluler seperti navigasi, penanganan data lokal, dan desain UI responsif."
    },
    challenges: {
      en: "Building a consistent UI that works across Android, iOS, Web, and Windows from a single codebase while managing the quiz state (current question index and score) efficiently without external state management libraries.",
      id: "Membangun UI konsisten yang berfungsi di Android, iOS, Web, dan Windows dari satu basis kode sambil mengelola status kuis (indeks pertanyaan dan skor saat ini) secara efisien tanpa pustaka manajemen status eksternal."
    },
    solution: {
      en: "Utilized Flutter's built-in `StatefulWidget` for logic management and `MaterialPageRoute` for seamless navigation. Implemented a modular project structure separating UI widgets (Home, Quiz, Result) from the data models (`question_model.dart`) for better maintainability.",
      id: "Memanfaatkan `StatefulWidget` bawaan Flutter untuk manajemen logika dan `MaterialPageRoute` untuk navigasi yang mulus. Menerapkan struktur proyek modular yang memisahkan widget UI (Beranda, Kuis, Hasil) dari model data (`question_model.dart`) untuk pemeliharaan yang lebih baik."
    },
    lessonLearned: {
      en: "I learned the power of Flutter's 'Write Once, Run Anywhere'. I also understood the Widget Lifecycle and basic state management in Dart.",
      id: "Saya mempelajari kekuatan 'Tulis Sekali, Jalankan Di Mana Saja' Flutter. Saya juga memahami Siklus Hidup Widget dan manajemen status dasar di Dart."
    },
    features: {
      en: [
        "Multi-platform Support (Mobile/Web)",
        "Dynamic Question Progress Bar",
        "Score Calculation System",
        "Clean Material Design UI"
      ],
      id: [
        "Dukungan Multi-platform (Seluler/Web)",
        "Bilah Kemajuan Pertanyaan Dinamis",
        "Sistem Perhitungan Skor",
        "UI Material Design yang Bersih"
      ]
    },
    techStack: [
      { name: "Flutter", icon: "devicon-flutter-plain" },
      { name: "Dart", icon: "devicon-dart-plain" },
      { name: "Android Studio", icon: "devicon-androidstudio-plain" }
    ],
    github: "https://github.com/Rafie1715/quickquiz", 
    gallery: [
      "/images/project-quickquiz2.webp",
      "/images/project-quickquiz3.webp",
      "/images/project-quickquiz4.webp",
      "/images/project-quickquiz5.webp"
    ]
  },
  {
    id: "personal-notes",
    title: {
      en: "Personal Notes App (React)",
      id: "Aplikasi Catatan Pribadi (React)"
    },
    category: "web",
    image: "/images/project-notesapp.webp",
    shortDesc: {
      en: "A comprehensive note management app with authentication, archiving, and multi-language support.",
      id: "Aplikasi manajemen catatan lengkap dengan autentikasi, pengarsipan, dan dukungan multi-bahasa."
    },
    fullDesc: {
      en: "This web-based application allows users to manage their personal notes efficiently. It features a robust system for creating, archiving, and deleting notes, secured by user authentication. The app enhances user experience with real-time search, theme customization (Dark/Light mode), and multi-language support (English/Indonesian).",
      id: "Aplikasi berbasis web ini memungkinkan pengguna untuk mengelola catatan pribadi mereka secara efisien. Fitur sistem yang kuat untuk membuat, mengarsipkan, dan menghapus catatan, diamankan oleh autentikasi pengguna. Aplikasi ini meningkatkan pengalaman pengguna dengan pencarian real-time, kustomisasi tema (Mode Gelap/Terang), dan dukungan multi-bahasa (Inggris/Indonesia)."
    },
    challenges: {
      en: "Managing complex global states like theme and language preferences across the application while ensuring seamless navigation and protected routes for authenticated users.",
      id: "Mengelola status global yang kompleks seperti preferensi tema dan bahasa di seluruh aplikasi sambil memastikan navigasi yang mulus dan rute yang dilindungi untuk pengguna yang diautentikasi."
    },
    solution: {
      en: "Implemented React Context API for efficient global state management (Theme & Locale). Used React Router DOM for handling navigation and protecting routes requiring authentication. Integrated a REST API for persistent data storage and user management.",
      id: "Menerapkan React Context API untuk manajemen status global yang efisien (Tema & Lokal). Menggunakan React Router DOM untuk menangani navigasi dan melindungi rute yang memerlukan autentikasi. Mengintegrasikan REST API untuk penyimpanan data persisten dan manajemen pengguna."
    },
    lessonLearned: {
      en: "This project advanced my React skills significantly, especially in using Hooks (`useContext`, `useEffect`) and creating Custom Hooks. I also learned patterns for securing client-side routes.",
      id: "Proyek ini meningkatkan keterampilan React saya secara signifikan, terutama dalam menggunakan Hooks (`useContext`, `useEffect`) dan membuat Custom Hooks. Saya juga mempelajari pola untuk mengamankan rute sisi klien."
    },
    features: {
      en: [
        "User Registration & Login (JWT)",
        "Create, Archive, & Delete Notes",
        "Real-time Search & Filtering",
        "Dark/Light Mode & Multi-language"
      ],
      id: [
        "Registrasi & Login Pengguna (JWT)",
        "Buat, Arsipkan, & Hapus Catatan",
        "Pencarian & Pemfilteran Real-time",
        "Mode Gelap/Terang & Multi-bahasa"
      ]
    },
    techStack: [
      { name: "React", icon: "devicon-react-original" },
      { name: "Vite", icon: "devicon-vitejs-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" }
    ],
    github: "https://github.com/Rafie1715/personal-notes-app-with-react", 
    live: "https://reactpersonalnotes.netlify.app",
    gallery: [
      "/images/project-notesapp2.webp",
      "/images/project-notesapp3.webp",
      "/images/project-notesapp4.webp"
    ] 
  }
];