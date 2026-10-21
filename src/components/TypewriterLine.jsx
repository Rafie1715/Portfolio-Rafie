import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TypewriterLine({ phrases, prefix = '', active = true, once = false, onComplete, summary = false, staticText }) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [frame, setFrame] = useState({ index: 0, length: 0, deleting: false });
  const phrase = phrases[frame.index] || '';
  const finished = once && frame.length === phrase.length;
  const running = active && !paused && !reducedMotion && !finished;

  useEffect(() => {
    if (!once || !active || (!finished && !reducedMotion)) return undefined;
    const timer = window.setTimeout(() => onComplete?.(), reducedMotion ? 0 : 450);
    return () => window.clearTimeout(timer);
  }, [once, active, finished, reducedMotion, onComplete]);

  useEffect(() => {
    if (!running || !phrase) return undefined;
    const complete = frame.length === phrase.length;
    const delay = frame.deleting ? 25 : complete ? 3500 : once ? 95 : 55;
    const timer = window.setTimeout(() => {
      setFrame(current => {
        if (current.deleting && current.length === 0) {
          return { index: (current.index + 1) % phrases.length, length: 0, deleting: false };
        }
        if (!current.deleting && complete) return { ...current, deleting: true };
        return { ...current, length: current.length + (current.deleting ? -1 : 1) };
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [frame, phrase, phrases.length, running, once]);

  return (
    <div data-typewriter={once ? 'greeting' : 'summary'} className={summary
      ? `hero-typewriter grid min-h-12 w-full max-w-2xl items-center text-sm sm:text-base ${reducedMotion ? 'grid-cols-[0_minmax(0,1fr)_0]' : 'grid-cols-[44px_minmax(0,1fr)_44px] gap-2'}`
      : 'hero-typewriter flex min-h-11 max-w-full items-center justify-center text-lg font-medium sm:text-xl'}>
      {/* A stable text alternative prevents character-by-character announcements. */}
      <span className="sr-only">{staticText || `${prefix} ${phrases[0]}`}</span>
      <span aria-hidden="true" className={`grid min-w-0 text-center leading-6 ${summary ? 'col-start-2' : ''}`}>
        {phrases.map(text => (
          <span key={text} className="invisible col-start-1 row-start-1">{prefix} {text}<span className="inline-block w-2" /></span>
        ))}
        <span className={`col-start-1 row-start-1 ${summary ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {prefix}{prefix && ' '}<span data-typed-text>{reducedMotion ? (staticText || phrases[0]) : phrase.slice(0, frame.length)}</span>
          <span className={`typing-caret ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-blue-500 ${finished || reducedMotion || !active ? 'invisible' : ''}`} data-running={running} />
        </span>
      </span>
      {!once && !reducedMotion && (
        <button type="button" onClick={() => setPaused(value => !value)}
          className="col-start-3 flex size-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label={t(paused ? 'common.motion_resume' : 'common.motion_pause')}>
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
