import { createElement, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Printer,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { normalizeLanguage } from '../utils/language';

const CONTACT_EMAIL = 'rojagatrafie@gmail.com';
const CV_PATH = '/assets/CV%20Rafie%20Rojagat%20Bachri.pdf';
const LINKEDIN_URL = 'https://linkedin.com/in/rafie-rojagat';
const GITHUB_URL = 'https://github.com/Rafie1715';
const PORTFOLIO_URL = 'https://rafierb.me';

const LENS_CONFIG = {
  overview: {
    icon: BriefcaseBusiness,
    titleEn: 'General Software Engineering',
    titleId: 'Rekayasa Perangkat Lunak Umum',
    headlineEn: 'Software Engineer with proven execution across native Android and modern web applications, backed by applied Machine Learning foundations.',
    headlineId: 'Software Engineer dengan rekam jejak pada aplikasi Android native dan web modern, didukung fondasi Machine Learning terapan.',
    topProjects: [
      {
        name: 'RestUP',
        tag: 'Android · ML · Kotlin',
        metric: '92.06% ML Accuracy',
        descEn: 'Sleep disorder & apnea screening app using evaluated Random Forest model deployed directly on Android.',
        descId: 'Aplikasi screening kualitas tidur & sleep apnea menggunakan model Random Forest yang diintegrasikan ke Android.',
        path: '/projects/restup',
        github: 'https://github.com/Rafie1715/Sleep-Quality-Monitoring-App-using-Random-Forest',
      },
      {
        name: 'Mandiri News',
        tag: 'Android · Kotlin · MVVM',
        metric: '88.71 / 100 Evaluation',
        descEn: 'Enterprise banking news app built with Clean Architecture, Retrofit pagination, and Room local persistence.',
        descId: 'Aplikasi berita perbankan dengan Clean Architecture, paginasi Retrofit, dan penyimpanan lokal Room.',
        path: '/projects/mandiri-news',
        github: 'https://github.com/Rafie1715/Mandiri-News-App',
      },
      {
        name: 'Portfolio & Custom CMS',
        tag: 'React · Tailwind · Firebase',
        metric: '0-Secret Leak · A+ Security',
        descEn: 'Full-stack production portfolio featuring Firebase Custom Claims auth, Edge API isolation, and 100% test coverage.',
        descId: 'Portofolio full-stack produksi dengan otorisasi Firebase Custom Claims, proteksi Edge API, dan tes komprehensif.',
        path: '/projects/portfolio-website',
        github: 'https://github.com/Rafie1715/Website-Portfolio-Rafie',
      },
    ],
  },
  android: {
    icon: Smartphone,
    titleEn: 'Native Android Focus',
    titleId: 'Fokus Native Android',
    headlineEn: 'Android Engineer specializing in Kotlin, Jetpack Compose, MVVM architecture, offline-first data, and seamless API integration.',
    headlineId: 'Android Engineer dengan spesialisasi Kotlin, Jetpack Compose, arsitektur MVVM, penyimpanan offline, dan integrasi API.',
    topProjects: [
      {
        name: 'Mandiri News',
        tag: 'Kotlin · MVVM · Retrofit',
        metric: '88.71 / 100 Project Score',
        descEn: 'Enterprise news platform built during Bank Mandiri program with reactive state, pagination, and Room database caching.',
        descId: 'Platform berita korporat selama program Bank Mandiri dengan reactive state, paginasi, dan caching database Room.',
        path: '/projects/mandiri-news',
        github: 'https://github.com/Rafie1715/Mandiri-News-App',
      },
      {
        name: 'RestUP',
        tag: 'Android Studio · Coroutines · TFLite',
        metric: '92.06% Accuracy · Thesis',
        descEn: 'Undergraduate thesis Android app translating sleep sensor data into clinical insights using on-device inference.',
        descId: 'Aplikasi skripsi Android yang mengubah data sensor tidur menjadi insight klinis dengan inferensi on-device.',
        path: '/projects/restup',
        github: 'https://github.com/Rafie1715/Sleep-Quality-Monitoring-App-using-Random-Forest',
      },
      {
        name: 'Planetku',
        tag: 'Android · Cloud · Capstone',
        metric: 'Bangkit Top Capstone',
        descEn: 'Waste classification and environmental community app with real-time camera scanning and Firebase sync.',
        descId: 'Aplikasi klasifikasi sampah dan komunitas lingkungan dengan pemindaian kamera real-time dan sinkronisasi Firebase.',
        path: '/projects/planetku',
        github: 'https://github.com/Rafie1715/Planetku',
      },
    ],
  },
  frontend: {
    icon: Code2,
    titleEn: 'Front-End & Web Focus',
    titleId: 'Fokus Front-End & Web',
    headlineEn: 'Front-End Developer crafting accessible, responsive, and performance-optimized React experiences with modern component architectures.',
    headlineId: 'Front-End Developer yang membangun pengalaman React aksesibel, responsif, dan optimal dengan arsitektur komponen modern.',
    topProjects: [
      {
        name: 'Developer Portfolio & CMS',
        tag: 'React · Tailwind · Vite',
        metric: '30 Static Routes · A+ Security',
        descEn: 'Production web application featuring dynamic case study renderers, real-time command palette, and strict HTTP headers.',
        descId: 'Aplikasi web produksi dengan renderer studi kasus dinamis, command palette real-time, dan HTTP security headers ketat.',
        path: '/projects/portfolio-website',
        github: 'https://github.com/Rafie1715/Website-Portfolio-Rafie',
      },
      {
        name: 'Personal Notes App',
        tag: 'React · State Management · PWA',
        metric: 'Fast Search & Responsive UI',
        descEn: 'Productivity notes web application with real-time instant search, archive flows, and persistent state storage.',
        descId: 'Aplikasi catatan produktivitas dengan pencarian instan real-time, alur arsip, dan penyimpanan status persisten.',
        path: '/projects/personal-notes',
        github: 'https://github.com/Rafie1715/personal-notes',
      },
      {
        name: 'Computer Crafter',
        tag: 'JavaScript · Responsive CSS',
        metric: 'Simulation & Budget Engine',
        descEn: 'Interactive hardware compatibility simulator with real-time budget calculations and power requirements check.',
        descId: 'Simulator kompatibilitas hardware interaktif dengan kalkulasi anggaran real-time dan pengecekan konsumsi daya.',
        path: '/projects/computer-crafter',
        github: 'https://github.com/Rafie1715/computer-crafter',
      },
    ],
  },
  ai: {
    icon: BrainCircuit,
    titleEn: 'Applied AI & ML Focus',
    titleId: 'Fokus AI & ML Terapan',
    headlineEn: 'Applied Machine Learning Developer connecting evaluated ML models with tangible, understandable user-facing products.',
    headlineId: 'Developer AI & ML Terapan yang menghubungkan model evaluasi terukur dengan produk nyata yang mudah dipahami pengguna.',
    topProjects: [
      {
        name: 'RestUP ML Sleep Model',
        tag: 'Scikit-Learn · Random Forest',
        metric: '92.06% Accuracy · 0.94 Recall',
        descEn: 'Trained and evaluated Random Forest model with balanced recall for high-stakes poor-sleep clinical classification.',
        descId: 'Model Random Forest yang dievaluasi dengan balanced recall tinggi untuk klasifikasi klinis gangguan tidur.',
        path: '/projects/restup',
        github: 'https://github.com/Rafie1715/Sleep-Quality-Monitoring-App-using-Random-Forest',
      },
      {
        name: 'Planetku Vision Classifier',
        tag: 'TensorFlow Lite · Mobile AI',
        metric: 'Bangkit ML Distinction',
        descEn: 'Computer vision model deployed on mobile devices for real-time recyclable waste recognition and categorizing.',
        descId: 'Model computer vision pada perangkat mobile untuk mengenali dan mengkategorikan sampah daur ulang secara real-time.',
        path: '/projects/planetku',
        github: 'https://github.com/Rafie1715/Planetku',
      },
      {
        name: 'DeepSeek Sentiment Analysis',
        tag: 'NLP · Python · Pandas',
        metric: 'Indonesian Text Preprocessing',
        descEn: 'Natural language processing pipeline analyzing sentiment distribution across public perception datasets.',
        descId: 'Pipeline NLP yang menganalisis distribusi sentimen publik pada dataset ulasan berbahasa Indonesia.',
        path: '/projects/sentimen-deepseek',
        github: 'https://github.com/Rafie1715/Analisis-Sentimen-DeepSeek',
      },
    ],
  },
};

const TECH_MATRIX = [
  { groupEn: 'Mobile (Android)', groupId: 'Mobile (Android)', items: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Flow', 'Room', 'Retrofit'] },
  { groupEn: 'Web & Front-End', groupId: 'Web & Front-End', items: ['React', 'Vite', 'Tailwind CSS', 'JavaScript (ES6+)', 'REST APIs', 'HTML5/CSS3'] },
  { groupEn: 'Machine Learning & Data', groupId: 'Machine Learning & Data', items: ['Python', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'TFLite'] },
  { groupEn: 'Tools & Architecture', groupId: 'Tools & Arsitektur', items: ['Git/GitHub', 'Firebase', 'Netlify', 'Clean Architecture', 'CI/CD'] },
];

export default function RecruiterPitchModal({ isOpen, onClose, initialLens = 'overview' }) {
  const { t, i18n } = useTranslation();
  const [activeLens, setActiveLens] = useState(initialLens);
  const [copied, setCopied] = useState(false);

  const lang = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const isIndonesian = lang === 'id';

  useEffect(() => {
    setActiveLens(initialLens);
  }, [initialLens]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const currentLensData = useMemo(() => LENS_CONFIG[activeLens] || LENS_CONFIG.overview, [activeLens]);

  const copyExecutiveSummary = async () => {
    const textToCopy = `📋 CANDIDATE EXECUTIVE SUMMARY: RAFIE ROJAGAT BACHRI
Role Target: Software Engineer (Android · Web Front-End · Applied AI)
Education: B.Comp.Sc in Informatics, UPN Veteran Jakarta (GPA: 3.89 / 4.00, Cum Laude)
Honors: Bangkit Academy Graduate (Machine Learning by Google, GoTo, Traveloka)
Status: Available for Full-Time Roles (Jakarta / Relocate / Remote)

EXECUTIVE HIGHLIGHTS & KEY METRICS:
• Informatics GPA: 3.89 / 4.00 (Cum Laude)
• Bank Mandiri Project Evaluation: 88.71 / 100
• RestUP Sleep Health Model Accuracy: 92.06%
• Bangkit ML Intensive Training: 900+ Hours

CORE TECHNICAL STACK:
• Mobile: Kotlin, Jetpack Compose, MVVM, Room DB, Retrofit, Coroutines
• Front-End: React, Vite, Tailwind CSS, JavaScript ES6+, REST APIs
• Machine Learning: Python, TensorFlow, Scikit-Learn, Pandas, OpenCV, TFLite
• Delivery & Cloud: Git, GitHub, Firebase, Netlify Functions, Clean Architecture

TOP IMPACT PROJECTS:
1. RestUP (Android & ML): 92.06% accuracy sleep quality & apnea screening app.
2. Mandiri News (Android): Corporate banking news portal, evaluated at 88.71/100.
3. Production Portfolio & CMS: Zero-secret-leak architecture with Firebase auth claims.

PORTFOLIO & CONTACT:
• Live Portfolio: ${PORTFOLIO_URL}
• Email: ${CONTACT_EMAIL}
• LinkedIn: ${LINKEDIN_URL}
• GitHub: ${GITHUB_URL}
• Download CV: ${PORTFOLIO_URL}${CV_PATH}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const input = document.createElement('textarea');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pitch-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-2 sm:p-4 backdrop-blur-sm print:static print:p-0 print:bg-white"
    >
      {/* Click outside to close (desktop) */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />

      {/* Main Sheet Container */}
      <div className="recruiter-pitch-sheet relative z-10 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 max-h-[95vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-4 print:text-black">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles size={13} className="text-blue-600 dark:text-blue-400" />
              <span>{isIndonesian ? 'Screening Kilat 30 Detik' : '30-Second Rapid Screening'}</span>
            </span>
            <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400">
              {isIndonesian ? 'Ringkasan Eksekutif untuk HR & Tech Lead' : 'Executive Pitch for Recruiters & Hiring Managers'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyExecutiveSummary}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              title={isIndonesian ? 'Salin teks ringkasan untuk diteruskan ke tim' : 'Copy candidate summary text to forward to team'}
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? (isIndonesian ? 'Tersalin!' : 'Copied!') : (isIndonesian ? 'Salin Teks' : 'Copy Text')}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              title={isIndonesian ? 'Cetak atau simpan sebagai PDF' : 'Print or export as PDF'}
            >
              <Printer size={14} />
              <span className="hidden sm:inline">{isIndonesian ? 'Cetak / PDF' : 'Print / PDF'}</span>
            </button>

            <a
              href={CV_PATH}
              download="CV_Rafie_Rojagat_Bachri.pdf"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
            >
              <Download size={14} />
              <span>{isIndonesian ? 'Unduh CV' : 'Download CV'}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Candidate Profile Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <img
              src="/images/profile.webp"
              alt="Rafie Rojagat Bachri"
              className="size-16 sm:size-20 rounded-xl object-cover border-2 border-primary/20 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="pitch-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  Rafie Rojagat Bachri
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isIndonesian ? 'Siap Kerja (Full-time)' : 'Open to Full-time'}
                </span>
              </div>

              <p className="text-sm font-bold text-primary mt-0.5">
                Software Engineer · Android · Front-End · Applied AI
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap size={14} className="text-primary" />
                  <span>UPN Veteran Jakarta (IPK 3.89 / 4.00, Cum Laude)</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Award size={14} className="text-amber-500" />
                  <span>Bangkit Academy (Machine Learning Path)</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} className="text-slate-400" />
                  <span>Jakarta, ID (Willing to Relocate / Remote)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Links */}
          <div className="flex sm:flex-col items-start gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-primary transition">
              <Mail size={13} className="text-primary" />
              <span>{CONTACT_EMAIL}</span>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary transition">
              <ExternalLink size={13} className="text-primary" />
              <span>linkedin.com/in/rafie-rojagat</span>
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary transition">
              <ExternalLink size={13} className="text-primary" />
              <span>github.com/Rafie1715</span>
            </a>
          </div>
        </div>

        {/* Role Focus Switcher (Interactive for screening) */}
        <div className="my-4 no-print">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {isIndonesian ? 'Pilih Sudut Pandang Posisi (Role Filter):' : 'Select Target Role Perspective:'}
          </p>
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/60">
            {Object.entries(LENS_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeLens === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveLens(key)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{isIndonesian ? config.titleId : config.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Elevator Pitch */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/30 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 mb-5">
          <span className="font-bold text-blue-700 dark:text-blue-300 block mb-0.5">
            💡 {isIndonesian ? 'Ringkasan Nilai Kandidat' : 'Candidate Value Proposition'}:
          </span>
          {isIndonesian ? currentLensData.headlineId : currentLensData.headlineEn}
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xl sm:text-2xl font-black text-slate-950 dark:text-white">3.89 / 4.00</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {isIndonesian ? 'IPK Informatika (Cum Laude)' : 'Informatics GPA (Cum Laude)'}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">88.71 / 100</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {isIndonesian ? 'Skor Proyek Bank Mandiri' : 'Mandiri Project Evaluation'}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">92.06%</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {isIndonesian ? 'Akurasi Model RestUP (Skripsi)' : 'RestUP Model Test Accuracy'}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <span className="block text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">900+ Jam</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {isIndonesian ? 'Pelatihan ML Bangkit' : 'Bangkit ML Intensive Hours'}
            </span>
          </div>
        </div>

        {/* Selected High-Impact Projects */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isIndonesian ? '3 Proyek Teratas & Dampak Terukur:' : 'Top 3 Shipped Projects & Measurable Impact:'}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {isIndonesian ? 'Klik untuk membuka studi kasus lengkap' : 'Click to inspect full case studies'}
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {currentLensData.topProjects.map((proj) => (
              <div
                key={proj.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:border-primary/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-primary/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{proj.name}</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      {proj.metric}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-primary block mb-1.5">{proj.tag}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {isIndonesian ? proj.descId : proj.descEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold">
                  <Link
                    to={proj.path}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <span>{isIndonesian ? 'Studi Kasus' : 'Case Study'}</span>
                    <ExternalLink size={11} />
                  </Link>
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Competencies Matrix */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            {isIndonesian ? 'Matriks Keterampilan Teknis (Tech Stack):' : 'Core Technical Competencies Matrix:'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            {TECH_MATRIX.map((cat) => (
              <div
                key={cat.groupEn}
                className="rounded-xl border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <span className="block font-bold text-slate-900 dark:text-white mb-2 text-xs">
                  {isIndonesian ? cat.groupId : cat.groupEn}
                </span>
                <div className="flex flex-wrap gap-1">
                  {cat.items.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA for Recruiter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              {isIndonesian
                ? 'Tertarik dengan kualifikasi ini? Hubungi langsung untuk jadwal wawancara.'
                : 'Impressed by this track record? Get in touch for an interview.'}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Interview%20Invitation%20-%20Rafie%20Rojagat%20Bachri`}
              className="inline-flex min-h-9 flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-bold text-white shadow transition hover:bg-blue-700"
            >
              <Mail size={14} />
              <span>{isIndonesian ? 'Undang Interview' : 'Invite to Interview'}</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="no-print inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isIndonesian ? 'Kembali' : 'Back'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

