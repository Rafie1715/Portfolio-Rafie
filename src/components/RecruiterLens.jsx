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
import LivingTechStack from './LivingTechStack';

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

const RecruiterLens = ({ value, onChange, onTechnologySelect }) => {
  const { t } = useTranslation();
  const [copyState, setCopyState] = useState('idle');
  const resetTimer = useRef(null);
  const controlsRef = useRef(null);
  const modeKey = `home.recruiter_lens.modes.${value}`;
  const proofItems = t(`${modeKey}.proof`, { returnObjects: true });

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  useEffect(() => {
    const controls = controlsRef.current;
    const selected = controls?.querySelector('button[aria-pressed="true"]');
    if (!controls || !selected) return;

    const centeredPosition = selected.offsetLeft - ((controls.clientWidth - selected.offsetWidth) / 2);
    controls.scrollTo({ left: Math.max(0, centeredPosition), behavior: 'smooth' });
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
    <section className="border-y border-slate-200 bg-slate-50/80 py-8 dark:border-slate-800 dark:bg-slate-900/45">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase text-primary">
              {t('home.recruiter_lens.eyebrow')}
            </p>
            <h2 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
              {t(`${modeKey}.title`)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300 md:text-base">
              {t(`${modeKey}.summary`)}
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2 lg:flex-none">
            <div
              ref={controlsRef}
              className="flex min-w-0 max-w-full flex-1 gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950 lg:flex-none lg:overflow-visible"
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

        <LivingTechStack key={value} mode={value} onTechnologySelect={onTechnologySelect} />

        <div className="mt-6 grid border-t border-slate-200 pt-5 dark:border-slate-700 sm:grid-cols-3">
          {Array.isArray(proofItems) && proofItems.map((item, index) => (
            <dl
              key={item.label}
              className={`py-3 sm:px-5 sm:py-0 ${index > 0 ? 'border-t border-slate-200 dark:border-slate-700 sm:border-l sm:border-t-0' : ''}`}
            >
              <dt className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">{item.label}</dt>
              <dd className="mt-1 text-sm font-semibold leading-6 text-slate-900 dark:text-white">{item.value}</dd>
            </dl>
          ))}
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
