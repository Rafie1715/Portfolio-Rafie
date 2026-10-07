import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// An original interface sketch: mobile view, application logic, then a web view.
const strokes = [
  { d: 'M40 39 H110 Q119 39 119 48 V173 Q119 182 110 182 H40 Q31 182 31 173 V48 Q31 39 40 39 Z', delay: 0 },
  { d: 'M61 48 H89 M61 173 H89 M42 64 H108 M42 76 H81 M42 87 H99 M42 103 H108 V139 H42 Z M42 153 H67 M78 153 H108', delay: .25 },
  { d: 'M119 111 H161 Q172 111 172 99 V83 Q172 72 185 72 H211', delay: .75 },
  { d: 'M200 65 L211 72 L200 79 M230 59 L217 72 L230 85 M247 59 L260 72 L247 85 M243 56 L235 88', delay: 1.1 },
  { d: 'M265 72 H280 Q291 72 291 83 V101', delay: 1.5 },
  { d: 'M221 105 H364 Q371 105 371 112 V178 Q371 185 364 185 H221 Q214 185 214 178 V112 Q214 105 221 105 Z M214 124 H371', delay: 1.75 },
  { d: 'M226 116 H229 M237 116 H240 M248 116 H251 M225 137 H256 V173 H225 Z M268 138 H356 M268 149 H336 M268 163 H304 M314 163 H355', delay: 2.1 },
];

function Drawing({ reducedMotion }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: .4 });
  const ready = reducedMotion || visible;

  return (
    <svg ref={ref} viewBox="0 0 400 210" fill="none" aria-hidden="true" className="block w-full overflow-visible">
      <g stroke="currentColor" className="text-slate-200 dark:text-slate-700/70" strokeWidth="1" strokeDasharray="2 6">
        <path d="M19 27 H383 M19 196 H383 M19 27 V196 M383 27 V196 M144 27 V196" />
        <path d="M10 39 H27 M19 31 V47 M375 185 H391 M383 177 V193" strokeDasharray="none" />
      </g>
      <motion.g initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: .6 }}>
        <rect x="31" y="39" width="88" height="143" rx="9" className="fill-blue-50 dark:fill-blue-950/30" />
        <rect x="214" y="105" width="157" height="80" rx="7" className="fill-cyan-50 dark:fill-cyan-950/30" />
      </motion.g>
      {strokes.map(({ d, delay }, index) => (
        <motion.path key={d} d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
          className={index < 3 ? 'text-blue-500 dark:text-blue-400' : 'text-cyan-600 dark:text-cyan-400'}
          initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: ready ? 1 : 0, opacity: ready ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : .9, delay: reducedMotion ? 0 : delay, ease: 'easeInOut' }} />
      ))}
      <motion.g initial={reducedMotion ? false : { opacity: 0, scale: .7 }}
        animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : .7 }}
        transition={{ duration: reducedMotion ? 0 : .35, delay: reducedMotion ? 0 : 3 }}
        style={{ transformOrigin: '354px 45px' }}>
        <circle cx="354" cy="45" r="13" className="fill-emerald-100 dark:fill-emerald-950" />
        <path d="M348 45 L352 49 L360 41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400" />
      </motion.g>
      <text x="44" y="20" className="fill-slate-400 font-mono text-[9px] dark:fill-slate-500">01 / UI</text>
      <text x="209" y="43" className="fill-slate-400 font-mono text-[9px] dark:fill-slate-500">02 / LOGIC</text>
      <text x="280" y="201" className="fill-slate-400 font-mono text-[9px] dark:fill-slate-500">03 / BUILD</text>
    </svg>
  );
}

export default function ProjectBlueprint() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [replay, setReplay] = useState(0);

  return (
    <figure className="project-blueprint mx-auto w-full max-w-[360px] shrink-0 md:w-[34%]">
      <Drawing key={replay} reducedMotion={reducedMotion} />
      <figcaption className="flex min-h-11 items-center justify-between gap-3 border-t border-slate-200 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <span>{t('common.blueprint_caption')}</span>
        {!reducedMotion && <button type="button" onClick={() => setReplay(value => value + 1)}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded px-2 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:text-blue-300">
          <RotateCcw size={12} aria-hidden="true" />{t('common.motion_replay')}
        </button>}
      </figcaption>
    </figure>
  );
}
