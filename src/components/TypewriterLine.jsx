import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TypewriterLine({ phrases, prefix, active = true }) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [frame, setFrame] = useState({ index: 0, length: 0, deleting: false });
  const phrase = phrases[frame.index] || '';
  const running = active && !paused && !reducedMotion;

  useEffect(() => {
    if (!running || !phrase) return undefined;
    const complete = frame.length === phrase.length;
    const delay = frame.deleting ? 30 : complete ? 2200 : 65;
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
  }, [frame, phrase, phrases.length, running]);

  return (
    <div className="hero-typewriter mt-1 flex w-full max-w-xl items-center justify-center gap-1 text-xs sm:text-sm">
      {/* A stable text alternative prevents character-by-character announcements. */}
      <span className="sr-only">{prefix} {phrases[0]}</span>
      <span aria-hidden="true" className="grid min-w-0 text-center font-mono leading-5">
        {phrases.map(text => (
          <span key={text} className="invisible col-start-1 row-start-1">{prefix} {text}<span className="inline-block w-2" /></span>
        ))}
        <span className="col-start-1 row-start-1 text-slate-500 dark:text-slate-400">
          {prefix}{' '}<span className="text-blue-600 dark:text-blue-300">{reducedMotion ? phrases[0] : phrase.slice(0, frame.length)}</span>
          <span className="typing-caret ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-blue-500" data-running={running} />
        </span>
      </span>
      {!reducedMotion && (
        <button type="button" onClick={() => setPaused(value => !value)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label={t(paused ? 'common.motion_resume' : 'common.motion_pause')}>
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
