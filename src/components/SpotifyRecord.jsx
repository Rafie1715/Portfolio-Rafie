import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Pause, Play, Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SpotifyRecord({ track }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: .2 });
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  const running = track.isPlaying && inView && visible && !paused && !reducedMotion;

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return (
    <motion.div ref={ref} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }} data-running={Boolean(running)}
      className="spotify-record rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
          {t(track.isPlaying ? 'afk.spotify_status.now_playing' : 'afk.spotify_status.last_played')}
        </p>
        <span aria-hidden="true" className="flex h-4 items-end gap-0.5 text-green-600 dark:text-green-400">
          {[.6, 1, .75, .45, .85].map((height, index) => <span key={index}
            className="record-level h-4 w-0.5 origin-bottom rounded-full bg-current"
            style={{ '--level': height, '--beat-delay': `${index * -.27}s` }} />)}
        </span>
      </div>
      <a href={track.url} target="_blank" rel="noopener noreferrer"
        className="group flex min-w-0 items-center gap-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600">
        <span className="relative block h-20 w-28 shrink-0" aria-hidden="true">
          <span className="record-disc absolute right-0 top-1 block size-[72px] rounded-full border border-slate-600 shadow-md">
            <span className="absolute inset-6 rounded-full border-4 border-emerald-600 bg-emerald-100">
              <span className="absolute inset-1 rounded-full bg-slate-900" />
            </span>
          </span>
          {track.image ? <img src={track.image} alt="" width="80" height="80" className="relative size-20 rounded object-cover shadow-md" />
            : <span className="relative flex size-20 items-center justify-center rounded bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"><Music2 size={30} /></span>}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold text-slate-900 group-hover:text-green-700 dark:text-white dark:group-hover:text-green-300">{track.name}</span>
          <span className="mt-1 block truncate text-sm text-slate-600 dark:text-slate-300">{track.artist}</span>
          <span className="mt-2 block text-xs font-medium text-green-700 dark:text-green-300">{t('afk.open_spotify')} ↗</span>
        </span>
      </a>
      <div className="mt-4 flex min-h-11 items-center justify-between gap-2 border-t border-green-200 pt-1 dark:border-green-900">
        <p className="min-w-0 truncate text-xs text-slate-600 dark:text-slate-400" title={track.album}>{track.album}</p>
        {track.isPlaying && !reducedMotion && <button type="button" onClick={() => setPaused(value => !value)}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded px-2 text-xs text-green-800 hover:bg-green-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600 dark:text-green-300 dark:hover:bg-green-900/50">
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
          {t(paused ? 'common.visual_resume' : 'common.visual_pause')}
        </button>}
      </div>
    </motion.div>
  );
}
