import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  FileDown,
  Mail,
  Sun,
  Moon,
  Languages,
  Home,
  User,
  Briefcase,
  BookOpen,
  Laptop,
  Gamepad2,
  Send,
  Github,
  Linkedin,
  Instagram,
  Check,
  Code2,
  Terminal,
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { normalizeLanguage } from '../utils/language';
import { projects } from '../data/projects';
import { projectPath } from '../utils/projectRoutes';

const CONTACT_EMAIL = 'rojagatrafie@gmail.com';
const CV_PATH = '/assets/CV%20Rafie%20Rojagat%20Bachri.pdf';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [devModeActive, setDevModeActive] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const lang = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const isIndonesian = lang === 'id';

  // Toggle Command Palette with keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open and reset query
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Build command catalog
  const commands = useMemo(() => {
    const navItems = [
      {
        id: 'nav-home',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'Beranda' : 'Home',
        subtitle: isIndonesian ? 'Kembali ke halaman utama' : 'Go to landing page',
        icon: Home,
        perform: () => navigate('/'),
      },
      {
        id: 'nav-about',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'Tentang Rafie' : 'About Rafie',
        subtitle: isIndonesian ? 'Profil, keahlian, pengalaman, dan sertifikasi' : 'Bio, skills, experience, and education',
        icon: User,
        perform: () => navigate('/about'),
      },
      {
        id: 'nav-projects',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'Daftar Proyek' : 'Projects Showcase',
        subtitle: isIndonesian ? 'Lihat semua studi kasus aplikasi & AI' : 'Explore all mobile, web, and AI apps',
        icon: Briefcase,
        perform: () => navigate('/projects'),
      },
      {
        id: 'nav-blog',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'Engineering Notes / Blog' : 'Engineering Notes / Blog',
        subtitle: isIndonesian ? 'Catatan teknis dan pembahasan mendalam' : 'Articles, architecture, and takeaways',
        icon: BookOpen,
        perform: () => navigate('/blog'),
      },
      {
        id: 'nav-workspace',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'Workspace / Setup' : 'Workspace / Setup',
        subtitle: isIndonesian ? 'Hardware, software, dan tools sehari-hari' : 'Gear, development tools, and desk setup',
        icon: Laptop,
        perform: () => navigate('/workspace'),
      },
      {
        id: 'nav-afk',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'AFK / Personal Corner' : 'AFK / Personal Corner',
        subtitle: isIndonesian ? 'Spotify, Discord live status, film, & mini game' : 'Spotify, live presence, movies, & game',
        icon: Gamepad2,
        perform: () => navigate('/afk'),
      },
      {
        id: 'nav-contact',
        category: isIndonesian ? 'Navigasi' : 'Navigation',
        title: isIndonesian ? 'Hubungi Saya' : 'Contact Me',
        subtitle: isIndonesian ? 'Kirim pesan atau tawaran kolaborasi' : 'Get in touch for opportunities or queries',
        icon: Send,
        perform: () => navigate('/contact'),
      },
    ];

    const actionItems = [
      {
        id: 'action-recruiter-pitch',
        category: isIndonesian ? 'Aksi Cepat' : 'Quick Actions',
        title: isIndonesian ? 'Ringkasan 1-Halaman (Recruiter Pitch Mode)' : '1-Page Summary (Recruiter Pitch Mode)',
        subtitle: isIndonesian ? 'Format eksekutif ringkas untuk screening kilat 30 detik' : 'Executive rapid screening summary for recruiters',
        icon: Sparkles,
        perform: () => {
          navigate('/?pitch=true');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('open-recruiter-pitch'));
          }, 50);
        },
      },
      {
        id: 'action-cv',
        category: isIndonesian ? 'Aksi Cepat' : 'Quick Actions',
        title: isIndonesian ? 'Unduh Resume / CV' : 'Download Resume / CV',
        subtitle: 'CV_Rafie_Rojagat_Bachri.pdf',
        icon: FileDown,
        perform: () => {
          const a = document.createElement('a');
          a.href = CV_PATH;
          a.download = 'CV_Rafie_Rojagat_Bachri.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      },
      {
        id: 'action-copy-email',
        category: isIndonesian ? 'Aksi Cepat' : 'Quick Actions',
        title: copiedEmail ? (isIndonesian ? 'Email Berhasil Disalin!' : 'Email Copied!') : (isIndonesian ? 'Salin Alamat Email' : 'Copy Email Address'),
        subtitle: CONTACT_EMAIL,
        icon: copiedEmail ? Check : Mail,
        perform: async () => {
          try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
          } catch {
            window.location.href = `mailto:${CONTACT_EMAIL}`;
          }
        },
      },
      {
        id: 'action-toggle-theme',
        category: isIndonesian ? 'Aksi Cepat' : 'Quick Actions',
        title: theme === 'dark' ? (isIndonesian ? 'Ganti ke Mode Terang' : 'Switch to Light Mode') : (isIndonesian ? 'Ganti ke Mode Gelap' : 'Switch to Dark Mode'),
        subtitle: theme === 'dark' ? 'Light mode' : 'Dark mode',
        icon: theme === 'dark' ? Sun : Moon,
        perform: () => toggleTheme(),
      },
      {
        id: 'action-toggle-language',
        category: isIndonesian ? 'Aksi Cepat' : 'Quick Actions',
        title: isIndonesian ? 'Ganti Bahasa ke English' : 'Ganti Bahasa ke Indonesia',
        subtitle: isIndonesian ? 'Switch language to English' : 'Ubah bahasa ke Bahasa Indonesia',
        icon: Languages,
        perform: () => {
          const next = lang === 'en' ? 'id' : 'en';
          i18n.changeLanguage(next);
        },
      },
    ];

    const projectItems = projects.slice(0, 6).map((proj) => {
      const title = typeof proj.title === 'object' ? proj.title[lang] || proj.title.en : proj.title;
      const desc = typeof proj.shortDesc === 'object' ? proj.shortDesc[lang] || proj.shortDesc.en : proj.shortDesc;
      return {
        id: `project-${proj.id}`,
        category: isIndonesian ? 'Studi Kasus Proyek' : 'Project Case Studies',
        title,
        subtitle: desc,
        icon: Code2,
        perform: () => navigate(projectPath(proj)),
      };
    });

    const socialItems = [
      {
        id: 'social-github',
        category: isIndonesian ? 'Tautan Eksternal' : 'External Links',
        title: 'GitHub Profile',
        subtitle: 'github.com/Rafie1715',
        icon: Github,
        perform: () => window.open('https://github.com/Rafie1715', '_blank', 'noreferrer'),
      },
      {
        id: 'social-linkedin',
        category: isIndonesian ? 'Tautan Eksternal' : 'External Links',
        title: 'LinkedIn Profile',
        subtitle: 'linkedin.com/in/rafie-rojagat',
        icon: Linkedin,
        perform: () => window.open('https://linkedin.com/in/rafie-rojagat', '_blank', 'noreferrer'),
      },
      {
        id: 'social-instagram',
        category: isIndonesian ? 'Tautan Eksternal' : 'External Links',
        title: 'Instagram',
        subtitle: '@rafie_rb',
        icon: Instagram,
        perform: () => window.open('https://instagram.com/rafie_rb', '_blank', 'noreferrer'),
      },
    ];

    const easterEggItem = {
      id: 'action-dev-mode',
      category: 'Developer HUD',
      title: devModeActive ? 'Disable Cyberpunk Terminal HUD' : 'Enable Cyberpunk Terminal HUD',
      subtitle: devModeActive ? 'Kembalikan mode visual normal' : 'Aktifkan filter tema emerald / hacker visual',
      icon: Terminal,
      perform: () => setDevModeActive((prev) => !prev),
    };

    return [...actionItems, ...navItems, ...projectItems, ...socialItems, easterEggItem];
  }, [isIndonesian, lang, navigate, copiedEmail, theme, toggleTheme, i18n, devModeActive]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(q);
      const matchSubtitle = cmd.subtitle?.toLowerCase().includes(q);
      const matchCategory = cmd.category.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchCategory;
    });
  }, [commands, query]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedItemEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedItemEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Handle arrow navigation and enter key
  const handleInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((prev) => (filteredCommands.length > 0 ? (prev - 1 + filteredCommands.length) % filteredCommands.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = filteredCommands[selectedIndex];
      if (target) {
        target.perform();
        setIsOpen(false);
      }
    }
  };

  const handleSelect = (item) => {
    item.perform();
    setIsOpen(false);
  };

  return (
    <>
      {devModeActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[120] mix-blend-color-dodge opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 sm:pt-20"
            role="dialog"
            aria-modal="true"
            aria-label={isIndonesian ? 'Menu Perintah Cepat' : 'Command Palette'}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
              className="relative flex w-full max-w-2xl max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-darkLight"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-700">
                <Search className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={isIndonesian ? 'Ketik perintah, nama halaman, atau nama proyek...' : 'Type a command, page name, or project...'}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none dark:text-white dark:placeholder:text-slate-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded p-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                  ESC
                </kbd>
              </div>

              {/* Command List Results */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-2 sm:p-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
                role="listbox"
              >
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {isIndonesian ? 'Tidak ada perintah yang cocok' : 'No matching commands found'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {isIndonesian ? 'Coba cari kata kunci seperti "RestUP", "CV", "Tentang", atau "Theme"' : 'Try searching for "RestUP", "CV", "About", or "Theme"'}
                    </p>
                  </div>
                ) : (
                  filteredCommands.map((item, index) => {
                    const IconComponent = item.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <div
                        key={item.id}
                        data-index={index}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                              isSelected
                                ? 'border-white/30 bg-white/20 text-white'
                                : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <IconComponent className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate leading-tight">{item.title}</p>
                            {item.subtitle && (
                              <p
                                className={`text-xs truncate mt-0.5 ${
                                  isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {item.category}
                          </span>
                          <ArrowRight
                            className={`h-4 w-4 transition-transform ${
                              isSelected ? 'translate-x-0.5 text-white' : 'opacity-0'
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Quick Hints */}
              <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      ↑
                    </kbd>
                    <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      ↓
                    </kbd>
                    <span className="hidden sm:inline">{isIndonesian ? 'Navigasi' : 'Navigate'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      ↵
                    </kbd>
                    <span className="hidden sm:inline">{isIndonesian ? 'Pilih' : 'Select'}</span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                  <Command className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Rafie Command Palette</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

