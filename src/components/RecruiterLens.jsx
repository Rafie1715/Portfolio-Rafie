import { createElement, useEffect, useRef, useState } from 'react';
import {
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  Code2,
  Link2,
  Smartphone,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const lensOptions = [
  { id: 'overview', icon: BriefcaseBusiness },
  { id: 'android', icon: Smartphone },
  { id: 'frontend', icon: Code2 },
  { id: 'ai', icon: BrainCircuit },
];

const copyCurrentUrl = async () => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(window.location.href);
    return;
  }

  const input = document.createElement('textarea');
  input.value = window.location.href;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  input.remove();
};

const RecruiterLens = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [copyState, setCopyState] = useState('idle');
  const resetTimer = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  useEffect(() => {
    const controls = controlsRef.current;
    const selected = controls?.querySelector('button[aria-pressed="true"]');
    if (!controls || !selected) return;

    const centeredPosition = selected.offsetLeft - ((controls.clientWidth - selected.offsetWidth) / 2);
    controls.scrollTo({ left: Math.max(0, centeredPosition), behavior: 'auto' });
  }, [value]);

  const handleCopy = async () => {
    try {
      await copyCurrentUrl();
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 1800);
  };

  return (
    <section className="border-y border-slate-200 bg-slate-50/80 py-4 dark:border-slate-800 dark:bg-slate-900/45">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-between">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('common.lens_label')}</p>
          <div className="flex min-w-0 items-center gap-2 lg:flex-none">
            <div
              ref={controlsRef}
              className="grid min-w-0 max-w-full flex-1 grid-cols-2 gap-1 sm:flex sm:overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950 lg:flex-none lg:overflow-visible"
              role="group"
              aria-label={t('home.recruiter_lens.control_label')}
            >
              {lensOptions.map(({ id, icon }) => {
                const selected = value === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onChange(id)}
                    aria-pressed={selected}
                    className={`inline-flex min-h-10 flex-none items-center justify-center gap-2 rounded-md px-3 text-xs font-bold transition-colors sm:text-sm ${
                      selected
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {createElement(icon, { size: 16, 'aria-hidden': true })}
                    {t(`home.recruiter_lens.options.${id}`)}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              title={t('home.recruiter_lens.copy_link')}
              aria-label={t('home.recruiter_lens.copy_link')}
              className="inline-flex size-11 flex-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              {copyState === 'copied' ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {copyState === 'copied' ? t('home.recruiter_lens.link_copied') : ''}
          {copyState === 'error' ? t('home.recruiter_lens.copy_error') : ''}
        </p>
      </div>
    </section>
  );
};

export default RecruiterLens;
