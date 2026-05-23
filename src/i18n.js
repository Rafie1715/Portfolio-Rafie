import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            navbar: {
                home: "Home",
                about: "About",
                projects: "Projects",
                blog: "Blog",
                workspace: "Workspace",
                afk: "AFK",
                contact: "Contact"
            },
            home: {
                highlights: "Portfolio Highlights",
                featured_work: "Selected Work",
                glimpse: "A few projects that show how I think, build, and solve problems.",
                view_work: "About Me",
                view_all: "View All Projects",
                latest_blog: "Latest from Blog",
                blog_glimpse: "Thoughts on web development, mobile apps, and learning",
                view_all_blogs: "View All Blogs",
                afk_teaser: {
                    eyebrow: "Beyond Coding",
                    title: "A glimpse beyond the code",
                    desc: "See what I listen to, play, and watch. It is where I recharge and often find new ideas.",
                    cta: "Open /afk"
                }
            },
            about: {
                title: "About Me",
                download_cv: "Download CV",
                hello: "Hello, I'm",
                desc1: "I'm a final-year <1>Informatics student</1> at UPN “Veteran” Jakarta with a strong interest in <3>Front-End and Mobile Development</3>.",
                desc2: "Skilled in building responsive apps using <1>JavaScript</1>, <3>React</3>, and <5>Kotlin</5>. Highly motivated to enhance technical skills through internship opportunities to create impactful digital solutions.",
                card_label: "Profile Card",
                card_note: "Classic Card is shown by default for a cleaner reading flow.",
                card_show_3d: "Show 3D Preview",
                card_hide_3d: "Hide 3D Preview",
                card_preview_hint: "Drag to interact. This preview is experimental.",
                edu_title: "Education",
                uni_name: "Universitas Pembangunan Nasional \"Veteran\" Jakarta",
                uni_major: "Informatics (2022 - Present)",
                hs_name: "SMA Negeri 13 Jakarta",
                hs_major: "Science (2019 - 2022)"
            },
            hero: {
                greeting: "Hi there, I'm",
                tagline: "Final-year Informatics student at UPN Veteran Jakarta building responsive web and mobile products with a focus on clean UI and practical UX.",
                view_work: "About Me",
                contact_me: "Let's Connect",
                afk_cta: {
                    prefix: "Want a quick look outside my coding life?",
                    link: "Visit /afk"
                },
                quick_facts: {
                    location: "Jakarta, Indonesia",
                    availability: "Open to Internship",
                    focus: "Mobile and Web",
                    stack: "React, Kotlin, Firebase"
                }
            },
            footer: {
                description: "Building digital experiences with code and creativity. Let's create something amazing together.",
                quick_links: "Quick Links",
                connect: "Connect",
                download_cv: "Download CV",
                rights: "All rights reserved.",
                made_with: "Made with",
                and: "and",
                in: "in"
            },
            experience: {
                title: "Experience",
                docs: "Documentation"
            },
            skills: {
                title: "Technical Skills",
                description: "My digital toolbox. I'm constantly learning and expanding this list."
            },
            certifications: {
                title: "Certifications",
                issued: "Issued",
                verify: "Verify Credential"
            },
            projects: {
                title: "Featured Projects",
                subtitle: "Open Source Repositories",
                subtitle_desc: "Latest code contributions directly from GitHub",
                view_details: "View Details",
                live_site: "View Live Site",
                design: "View Design",
                prototype: "Try Prototype",
                source_code: "Source Code",
                no_projects: "No projects found.",
                loading: "Loading...",
                search_placeholder: "Search projects by name, tech, or keyword...",
                filter: {
                    all: "All",
                    mobile: "Mobile",
                    web: "Web",
                    python: "Python",
                    java: "Java",
                    ui: "UI/UX",
                    flutter: "Flutter",
                    game: "Game"
                },
                seo_title: "Projects | Rafie Rojagat",
                seo_desc: "A showcase of my software engineering projects."
            },
            projectDetail: {
                category_label: "Project",
                overview: "Project Overview",
                features: "Key Features",
                tech_used: "Technologies Used",
                challenge: "The Challenge",
                solution: "The Solution",
                learned: "What I Learned",
                gallery: "Project Gallery",
                click_close: "Click outside or press Esc to close"
            },
            workspace: {
                title_prefix: "My",
                title_highlight: "Workspace",
                subtitle: "The hardware, gadgets, and software that power my productivity.",
                updated: "Updated",
                view_product: "View Product"
            },
            pages: {
                projects: {
                    title_prefix: "My",
                    title_highlight: "Projects",
                    subtitle: "A collection of web and mobile applications I've built, showcasing my skills in React, Kotlin, Python, and more."
                },
                about: {
                    title_prefix: "About",
                    title_highlight: "Me",
                    subtitle: "Discover my journey as a developer, my skills, experience, and the passion I bring to every project."
                },
                blog: {
                    title_prefix: "My",
                    title_highlight: "Blog",
                    subtitle: "Sharing experiences and learnings in IT Stuff."
                },
                contact: {
                    title_prefix: "Get in",
                    title_highlight: "Touch",
                    subtitle: "Have a project in mind? Let's connect and create something amazing together."
                }
            },
            afk: {
                subtitle: "Away From Keyboard.",
                seo_desc: "Games, Music, and Movies.",
                intro_line1: "This page captures my rhythm outside coding, from what I listen to, to what I play and watch.",
                intro_line2: "For me, AFK moments often become a source of ideas when I get back to building.",
                status_check: "Status Check",
                playing: "Playing",
                offline: "Offline",
                chilling: "Currently chilling...",
                on_repeat: "On Repeat",
                live_spotify: "Live from Spotify",
                top_tracks: "Top Tracks This Month",
                recent_games: "Recently Played",
                no_recent_games: "No recent activity.",
                cinema_log: "Cinema Log",
                want_to_watch: "Want to Watch",
                no_watchlist: "No watchlist yet.",
                now_in_cinema: "Now in Cinema",
                no_now_in_cinema: "No cinema data available right now.",
                rafie_picks: "Rafie's Picks",
                curated_pick: "Curated Pick",
                no_rafie_picks: "No curated picks yet.",
                best_year: "Best of Year",
                steam_library: "Steam Library",
                hours: "hrs total",
                view_library: "View Full Library"
            },
            contact: {
                seo_title: "Contact | Rafie Rojagat",
                seo_desc: "Get in touch with me.",
                title: "Get In Touch",
                subtitle: "Have a project in mind? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
                info_title: "Contact Info",
                location: "Location",
                follow_me: "Follow me on:",
                form: {
                    name_label: "Name",
                    name_placeholder: "Enter your full name",
                    email_label: "Email",
                    email_placeholder: "Enter your email address",
                    message_label: "Message",
                    message_placeholder: "Please write your message or inquiry here...",
                    send_btn: "Send Message",
                    sending: "Sending...",
                    success: "Message sent successfully!",
                    error: "Failed to send. Try again."
                }
            }
        }
    },
    id: {
        translation: {
            navbar: {
                home: "Beranda",
                about: "Tentang",
                projects: "Proyek",
                blog: "Blog",
                workspace: "Workspace",
                afk: "AFK",
                contact: "Kontak"
            },
            home: {
                highlights: "Sorotan Portofolio",
                featured_work: "Karya Pilihan",
                glimpse: "Beberapa proyek yang menunjukkan cara saya berpikir, membangun, dan menyelesaikan masalah.",
                view_details: "Lihat Detail →",
                view_all: "Lihat Semua Proyek",
                latest_blog: "Terbaru dari Blog",
                blog_glimpse: "Pemikiran tentang pengembangan web, aplikasi mobile, dan proses belajar.",
                view_all_blogs: "Lihat Semua Blog",
                afk_teaser: {
                    eyebrow: "Di Luar Coding",
                    title: "Sekilas tentang sisi saya di luar coding",
                    desc: "Lihat apa yang saya dengar, mainkan, dan tonton. Di sana saya mengisi ulang energi dan sering menemukan ide baru.",
                    cta: "Buka /afk"
                }
            },
            about: {
                title: "Tentang Saya",
                download_cv: "Unduh CV",
                hello: "Halo, saya",
                desc1: "Saya mahasiswa tingkat akhir <1>Informatika</1> di UPN “Veteran” Jakarta dengan ketertarikan kuat pada <3>Pengembangan Front-End dan Mobile</3>.",
                desc2: "Terampil membangun aplikasi responsif menggunakan <1>JavaScript</1>, <3>React</3>, dan <5>Kotlin</5>. Sangat termotivasi untuk meningkatkan keterampilan teknis melalui kesempatan magang guna menciptakan solusi digital yang berdampak.",
                card_label: "Kartu Profil",
                card_note: "Classic Card ditampilkan secara default agar alur baca lebih rapi.",
                card_show_3d: "Tampilkan Pratinjau 3D",
                card_hide_3d: "Sembunyikan Pratinjau 3D",
                card_preview_hint: "Geser untuk berinteraksi. Pratinjau ini masih eksperimental.",
                edu_title: "Pendidikan",
                uni_name: "Universitas Pembangunan Nasional \"Veteran\" Jakarta",
                uni_major: "Informatika (2022 - Sekarang)",
                hs_name: "SMA Negeri 13 Jakarta",
                hs_major: "IPA (2019 - 2022)"
            },
            hero: {
                greeting: "Halo, saya",
                tagline: "Mahasiswa tingkat akhir Informatika di UPN Veteran Jakarta yang membangun produk web dan mobile responsif dengan fokus pada UI yang rapi dan UX yang praktis.",
                view_work: "Tentang Saya",
                contact_me: "Mari Terhubung",
                afk_cta: {
                    prefix: "Ingin lihat sisi saya di luar coding?",
                    link: "Kunjungi /afk"
                },
                quick_facts: {
                    location: "Jakarta, Indonesia",
                    availability: "Terbuka untuk magang",
                    focus: "Mobile dan Web",
                    stack: "React, Kotlin, Firebase"
                }
            },
            footer: {
                description: "Membangun pengalaman digital dengan kode dan kreativitas. Mari ciptakan sesuatu yang luar biasa bersama.",
                quick_links: "Tautan Cepat",
                connect: "Terhubung",
                download_cv: "Unduh CV",
                rights: "Hak cipta dilindungi.",
                made_with: "Dibuat dengan",
                and: "dan",
                in: "di"
            },
            experience: {
                title: "Pengalaman",
                docs: "Dokumentasi"
            },
            skills: {
                title: "Keahlian Teknis",
                description: "Alat tempur digital saya. Saya terus belajar dan memperluas daftar ini."
            },
            certifications: {
                title: "Sertifikasi",
                issued: "Diterbitkan",
                verify: "Verifikasi Sertifikat"
            },
            projects: {
                title: "Proyek Unggulan",
                subtitle: "Repositori Open Source",
                subtitle_desc: "Kontribusi kode terbaru langsung dari GitHub",
                view_details: "Lihat Detail",
                live_site: "Lihat Situs",
                design: "Lihat Desain",
                prototype: "Coba Prototipe",
                source_code: "Kode Sumber",
                no_projects: "Tidak ada proyek ditemukan.",
                loading: "Memuat...",
                search_placeholder: "Cari proyek berdasarkan nama, teknologi, atau kata kunci...",
                filter: {
                    all: "Semua",
                    mobile: "Aplikasi Mobile",
                    web: "Aplikasi Web",
                    python: "Python",
                    java: "Java",
                    ui: "UI/UX",
                    flutter: "Flutter",
                    game: "Game"
                },
                seo_title: "Proyek | Rafie Rojagat",
                seo_desc: "Pameran proyek rekayasa perangkat lunak saya."
            },
            projectDetail: {
                category_label: "Proyek",
                overview: "Ringkasan Proyek",
                features: "Fitur Utama",
                tech_used: "Teknologi yang Digunakan",
                challenge: "Tantangan",
                solution: "Solusi",
                learned: "Pelajaran yang Didapat",
                gallery: "Galeri Proyek",
                click_close: "Klik di luar atau tekan Esc untuk menutup"
            },
            workspace: {
                title_prefix: "Ruang",
                title_highlight: "Kerja Saya",
                subtitle: "Perangkat keras, gadget, dan perangkat lunak yang mendukung produktivitas saya.",
                updated: "Diperbarui",
                view_product: "Lihat Produk"
            },
            pages: {
                projects: {
                    title_prefix: "Proyek",
                    title_highlight: "Saya",
                    subtitle: "Kumpulan aplikasi web dan mobile yang telah saya bangun, menampilkan keahlian saya dalam React, Kotlin, Python, dan banyak lagi."
                },
                about: {
                    title_prefix: "Tentang",
                    title_highlight: "Saya",
                    subtitle: "Temukan perjalanan saya sebagai developer, keahlian, pengalaman, dan passion yang saya bawa ke setiap proyek."
                },
                blog: {
                    title_prefix: "Blog",
                    title_highlight: "Saya",
                    subtitle: "Berbagi pengalaman dan pembelajaran di dunia IT."
                },
                contact: {
                    title_prefix: "Hubungi",
                    title_highlight: "Saya",
                    subtitle: "Punya ide proyek? Mari terhubung dan ciptakan sesuatu yang luar biasa bersama."
                }
            },
            afk: {
                subtitle: "Jauh Dari Keyboard.",
                seo_desc: "Game, Musik, dan Film.",
                intro_line1: "Halaman ini berisi ritme saya di luar coding, dari musik yang sedang diputar sampai game dan film yang lagi saya nikmati.",
                intro_line2: "Buat saya, momen AFK ini justru sering jadi sumber ide saat balik ngoding.",
                status_check: "Cek Status",
                playing: "Sedang Main",
                offline: "Offline",
                chilling: "Sedang santai...",
                on_repeat: "Sedang Diputar",
                live_spotify: "Langsung dari Spotify",
                top_tracks: "Lagu Teratas Bulan Ini",
                recent_games: "Baru Saja Dimainkan",
                no_recent_games: "Tidak ada aktivitas terbaru.",
                cinema_log: "Catatan Film",
                want_to_watch: "Ingin Ditonton",
                no_watchlist: "Belum ada watchlist.",
                now_in_cinema: "Now in Cinema",
                no_now_in_cinema: "Data bioskop belum tersedia saat ini.",
                rafie_picks: "Pilihan Rafie",
                curated_pick: "Pilihan Kurasi",
                no_rafie_picks: "Belum ada pilihan kurasi.",
                best_year: "Terbaik Tahun Ini",
                steam_library: "Perpustakaan Steam",
                hours: "jam total",
                view_library: "Lihat Semua"
            },
            contact: {
                seo_title: "Kontak | Rafie Rojagat",
                seo_desc: "Hubungi saya.",
                title: "Hubungi Saya",
                subtitle: "Punya ide proyek? Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang untuk menjadi bagian dari visi Anda.",
                info_title: "Info Kontak",
                location: "Lokasi",
                follow_me: "Ikuti saya di:",
                form: {
                    name_label: "Nama",
                    name_placeholder: "Masukkan nama lengkap Anda",
                    email_label: "Email",
                    email_placeholder: "Masukkan alamat email Anda",
                    message_label: "Pesan",
                    message_placeholder: "Tulis pesan atau pertanyaan Anda di sini...",
                    send_btn: "Kirim Pesan",
                    sending: "Mengirim...",
                    success: "Pesan berhasil dikirim!",
                    error: "Gagal mengirim. Coba lagi."
                }
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;