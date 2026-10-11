import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { Menu, X, Moon, Sun, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useTheme from '../hooks/useTheme';
import { normalizeLanguage } from '../utils/language';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef(null);
  const nav = useRef(null);
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const lang = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    const queryLanguage = new URLSearchParams(location.search).get('lang');
    if (queryLanguage === 'en' || queryLanguage === 'id') i18n.changeLanguage(queryLanguage);
  }, [location.search, i18n]);
  useEffect(() => {
    if (!open) return undefined;
    const close = event => {
      if (event.type === 'keydown' && event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
      if (event.type === 'pointerdown' && !nav.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', close);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', close); };
  }, [open]);
  const toggleLanguage = () => {
    const next = lang === 'en' ? 'id' : 'en';
    i18n.changeLanguage(next);
    const nextParams = new URLSearchParams(params); nextParams.set('lang', next); setParams(nextParams, { replace: true });
  };
  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const links = ['home', 'about', 'projects', 'blog', 'workspace', 'afk', 'contact'];
  const to = key => key === 'home' ? '/' : '/' + key;
  return <nav ref={nav} aria-label={t('common.nav')} className={'fixed inset-x-0 top-0 z-50 border-b transition-colors ' + (scrolled || open ? 'border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-dark/95' : 'border-transparent bg-white/90 dark:bg-dark/90')}>
    <div className="container mx-auto flex min-h-20 items-center justify-between gap-3 px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <Link to="/" onClick={() => setOpen(false)} className="justify-self-start text-2xl font-black tracking-wide">Rafie<span className="text-primary">.</span></Link>
      <div className="hidden items-center justify-center gap-5 xl:gap-6 lg:flex">{links.map(key => <NavLink key={key} to={to(key)} className={({ isActive }) => 'rounded px-1 py-3 text-sm font-semibold hover:text-primary ' + (isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-300')}>{t('navbar.' + key)}</NavLink>)}</div>
      <div className="flex items-center justify-self-end gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Open Command Palette (Ctrl+K)"
          title="Command Palette (Ctrl+K)"
          className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 sm:px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
        >
          <Search size={15} aria-hidden="true" />
          <span className="hidden sm:inline font-mono text-[10px] rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">Ctrl K</span>
        </button>
        <button type="button" onClick={toggleLanguage} aria-label={`${lang === 'en' ? 'ID' : 'EN'}: ${t('common.language')}`} className="min-h-11 min-w-11 rounded-lg border border-slate-200 px-3 text-xs font-bold dark:border-slate-700">{lang === 'en' ? 'ID' : 'EN'}</button>
        <button type="button" onClick={toggleTheme} aria-label={t(theme === 'dark' ? 'common.theme_light' : 'common.theme_dark')} className="flex size-11 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">{theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</button>
        <button ref={trigger} type="button" onClick={() => setOpen(value => !value)} aria-label={t(open ? 'common.menu_close' : 'common.menu_open')} aria-expanded={open} aria-controls="mobile-navigation" className="flex size-11 items-center justify-center rounded-lg lg:hidden">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </div>
    </div>
    {open && <div id="mobile-navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white px-4 pb-5 dark:border-slate-800 dark:bg-dark lg:hidden">
      <button
        type="button"
        onClick={() => { setOpen(false); openCommandPalette(); }}
        className="my-3 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <span className="flex items-center gap-2">
          <Search size={16} className="text-primary" />
          <span>Command Palette</span>
        </span>
        <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-mono dark:bg-slate-700">Ctrl K</kbd>
      </button>
      {links.map(key => <NavLink key={key} to={to(key)} onClick={() => setOpen(false)} className={({ isActive }) => 'block rounded-lg px-4 py-3 font-semibold ' + (isActive ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-300')}>{t('navbar.' + key)}</NavLink>)}
    </div>}
  </nav>;
}
