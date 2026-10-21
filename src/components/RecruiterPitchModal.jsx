import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Download, Printer, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { normalizeLanguage } from '../utils/language';
import { buildRecruiterSummary, recruiterSummaryText, summaryLenses } from '../data/recruiterSummary';

function SummarySheet({ onClose, initialLens, projects, loading, error, retry }) {
  const { i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const id = lang === 'id';
  const [lens, setLens] = useState(initialLens);
  const [copyState, setCopyState] = useState('idle');
  const dialogRef = useRef(null);
  const summary = buildRecruiterSummary(projects, lens, lang);
  const unavailable = loading || error;

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  useEffect(() => {
    if (copyState === 'idle') return undefined;
    const timeout = window.setTimeout(() => setCopyState('idle'), 2500);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(recruiterSummaryText(summary, lang));
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };
  const controlClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800';

  return createPortal(
    <dialog ref={dialogRef} aria-labelledby="pitch-modal-title"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      className="recruiter-pitch-dialog fixed inset-0 m-auto max-h-[95dvh] w-[calc(100%-1rem)] max-w-4xl overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/75 dark:bg-slate-900 dark:text-slate-100">
      <div className="recruiter-pitch-sheet p-5 sm:p-7">
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="text-sm font-bold">{id ? 'Ringkasan 1 Halaman' : '1-Page Summary'}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={copySummary} disabled={unavailable} className={controlClass}>
              {copyState === 'copied' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              {id ? 'Salin teks' : 'Copy text'}
            </button>
            <button type="button" onClick={() => window.print()} disabled={unavailable} className={controlClass}><Printer size={15} aria-hidden="true" />{id ? 'Cetak / PDF' : 'Print / PDF'}</button>
            <a href="/assets/CV%20Rafie%20Rojagat%20Bachri.pdf" download="CV_Rafie_Rojagat_Bachri.pdf" className={controlClass}><Download size={15} aria-hidden="true" />{id ? 'Unduh CV' : 'Download CV'}</a>
            <button autoFocus type="button" onClick={onClose} aria-label={id ? 'Tutup ringkasan' : 'Close summary'} className={controlClass}><X size={18} aria-hidden="true" /></button>
          </div>
          <p role="status" className="text-xs empty:hidden">{copyState === 'copied' ? (id ? 'Ringkasan tersalin.' : 'Summary copied.') : copyState === 'error' ? (id ? 'Tidak dapat menyalin. Gunakan Cetak / PDF atau pilih teks secara manual.' : 'Could not copy. Use Print / PDF or select the text manually.') : ''}</p>
        </div>

        <header className="summary-header border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{summary.role}</p>
          <h2 id="pitch-modal-title" className="text-2xl font-bold tracking-tight sm:text-3xl">{summary.name}</h2>
          <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300">{summary.education}<br />{summary.location}</p>
          <div className="summary-contacts mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-blue-700 dark:text-blue-300">
            <a href={'mailto:' + summary.contact.email} className="break-all hover:underline">{summary.contact.email}</a>
            <a href="https://rafierb.me" target="_blank" rel="noreferrer">rafierb.me</a>
            <a href={summary.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn: rafie-rojagat</a>
            <a href={summary.contact.github} target="_blank" rel="noreferrer">GitHub: Rafie1715</a>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{summary.availability}</p>
        </header>

        <div className="no-print my-4 flex flex-wrap gap-2" role="group" aria-label={id ? 'Fokus ringkasan' : 'Summary focus'}>
          {Object.entries(summaryLenses).map(([key, config]) => <button key={key} type="button" aria-pressed={lens === key} onClick={() => { setLens(key); setCopyState('idle'); }}
            className={'min-h-11 rounded-lg border px-3 text-xs font-semibold ' + (lens === key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800')}>{config.title[lang]}</button>)}
        </div>

        <section className="summary-section my-5" aria-label={summary.focus}>
          <h3 className="mb-1 text-sm font-bold">{summary.focus}</h3>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{summary.headline}</p>
        </section>

        <section className="summary-section my-5" aria-labelledby="summary-projects-title">
          <h3 id="summary-projects-title" className="mb-3 text-sm font-bold">{id ? 'Proyek pilihan' : 'Selected projects'}</h3>
          {loading && <p className="text-sm" role="status">{id ? 'Memuat proyek terbaru…' : 'Loading current projects…'}</p>}
          {error && <button className={controlClass} onClick={retry} type="button">{id ? 'Proyek gagal dimuat. Coba lagi' : 'Projects unavailable. Try again'}</button>}
          {!unavailable && !summary.projects.length && <p className="text-sm">{id ? 'Belum ada proyek publik untuk fokus ini.' : 'No public projects for this focus yet.'}</p>}
          <div className="summary-projects grid gap-3">
            {summary.projects.map(project => <article key={project.id} className="summary-project border-l-2 border-blue-400 pl-3">
              <Link to={project.path} onClick={onClose} className="text-sm font-bold hover:text-blue-600 hover:underline">{project.title}</Link>
              {(project.role || project.period) && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{[project.role, project.period].filter(Boolean).join(' · ')}</p>}
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{project.description}</p>
              {project.evidence && <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">{project.evidence}</p>}
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-blue-700 dark:text-blue-300">
                <Link to={project.path} onClick={onClose}>{id ? 'Studi kasus' : 'Case study'} ↗</Link>
                {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
              </div>
            </article>)}
          </div>
        </section>

        <section className="summary-section my-5" aria-labelledby="summary-skills-title">
          <h3 id="summary-skills-title" className="mb-3 text-sm font-bold">{id ? 'Keterampilan teknis' : 'Technical skills'}</h3>
          <dl className="summary-skills grid gap-x-5 gap-y-3 sm:grid-cols-2">
            {summary.skills.map(group => <div key={group.title}>
              <dt className="text-xs font-semibold">{group.title}</dt>
              <dd className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{group.items.join(' · ')}</dd>
            </div>)}
          </dl>
          <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300"><strong>{id ? 'Sedang dipelajari' : 'Currently learning'}:</strong> {summary.learning.join(' · ')}</p>
        </section>

        <section className="summary-section mt-5 border-t border-slate-200 pt-3 dark:border-slate-700" aria-labelledby="summary-credentials-title">
          <h3 id="summary-credentials-title" className="mb-2 text-sm font-bold">{id ? 'Pelatihan & sertifikasi' : 'Training & certifications'}</h3>
          <ul className="space-y-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
            {summary.credentials.map(cert => <li key={cert.title}>{cert.href ? <a href={cert.href} target="_blank" rel="noreferrer" className="hover:underline">{cert.title} ↗</a> : cert.title} · {cert.issuer}</li>)}
          </ul>
        </section>
      </div>
    </dialog>, document.body,
  );
}

export default function RecruiterPitchModal({ isOpen, initialLens = 'overview', ...props }) {
  return isOpen ? <SummarySheet key={initialLens} initialLens={initialLens} {...props} /> : null;
}
