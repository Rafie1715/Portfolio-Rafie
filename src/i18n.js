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
                workspace: "Workspace",
                afk: "AFK",
                contact: "Contact"
            },
            home: {
                featured_work: "Featured Work",
                glimpse: "A glimpse of what I've built.",
                view_details: "View Details →",
                view_all: "View All Projects"
            },
            about: {
                title: "About Me",
                download_cv: "Download CV",
                hello: "Hello, I'm",
                desc1: "I'm a final-year <1>Informatics student</1> at UPN “Veteran” Jakarta with a strong interest in <3>Front-End and Mobile Development</3>.",
                desc2: "Skilled in building responsive apps using <1>JavaScript</1>, <3>React</3>, and <5>Kotlin</5>. Highly motivated to enhance technical skills through internship opportunities to create impactful digital solutions.",
                download_cv: "Download CV",
                edu_title: "Education",
                uni_name: "Universitas Pembangunan Nasional \"Veteran\" Jakarta",
                uni_major: "Informatics (2022 - Present)",
                hs_name: "SMA Negeri 13 Jakarta",
                hs_major: "Science (2019 - 2022)"
            },
            projects: {
                title: "My Projects",
                subtitle: "Here are some projects I've worked on."
            },
            contact: {
                title: "Get in Touch",
                send: "Send Message"
            },
            hero: {
                greeting: "Hi there, I'm",
                description: "Final Year Informatics Student at",
                passionate: "Passionate about",
                view_work: "View My Work",
                contact_me: "Contact Me",
                skills: {
                    mobile: "Mobile Development",
                    web: "Web Development",
                    uiux: "UI/UX Design",
                    ml: "Machine Learning"
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
                filter: {
                    all: "All",
                    mobile: "Mobile",
                    web: "Web",
                    python: "Python",
                    java: "Java",
                    ui: "UI/UX",
                    flutter: "Flutter"
                }
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
            afk: {
                subtitle: "Away From Keyboard.",
                seo_desc: "Games, Music, and Movies.",
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
                workspace: "Workspace",
                afk: "AFK",
                contact: "Kontak"
            },
            home: {
                featured_work: "Karya Pilihan",
                glimpse: "Sekilas tentang apa yang telah saya bangun.",
                view_details: "Lihat Detail →",
                view_all: "Lihat Semua Proyek"
            },
            about: {
                title: "Tentang Saya",
                download_cv: "Unduh CV",
                hello: "Halo, saya",
                desc1: "Saya mahasiswa tingkat akhir <1>Informatika</1> di UPN “Veteran” Jakarta dengan ketertarikan kuat pada <3>Pengembangan Front-End dan Mobile</3>.",
                desc2: "Terampil membangun aplikasi responsif menggunakan <1>JavaScript</1>, <3>React</3>, dan <5>Kotlin</5>. Sangat termotivasi untuk meningkatkan keterampilan teknis melalui kesempatan magang guna menciptakan solusi digital yang berdampak.",
                download_cv: "Unduh CV",
                edu_title: "Pendidikan",
                uni_name: "Universitas Pembangunan Nasional \"Veteran\" Jakarta",
                uni_major: "Informatika (2022 - Sekarang)",
                hs_name: "SMA Negeri 13 Jakarta",
                hs_major: "IPA (2019 - 2022)"
            },
            projects: {
                title: "Proyek Saya",
                subtitle: "Berikut adalah beberapa proyek yang telah saya kerjakan."
            },
            contact: {
                title: "Hubungi Saya",
                send: "Kirim Pesan"
            },
            hero: {
                greeting: "Halo, saya",
                description: "Mahasiswa Tingkat Akhir Informatika di",
                passionate: "Tertarik pada",
                view_work: "Lihat Karya Saya",
                contact_me: "Hubungi Saya",
                skills: {
                    mobile: "Pengembangan Seluler",
                    web: "Pengembangan Web",
                    uiux: "Desain UI/UX",
                    ml: "Machine Learning"
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
                filter: {
                    all: "Semua",
                    mobile: "Mobile",
                    web: "Web",
                    python: "Python",
                    java: "Java",
                    ui: "UI/UX",
                    flutter: "Flutter"
                }
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
            afk: {
                subtitle: "Jauh Dari Keyboard.",
                seo_desc: "Game, Musik, dan Film.",
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