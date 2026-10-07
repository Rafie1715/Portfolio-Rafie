import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ProjectArchitecture({ flows }) {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  if (!flows?.length) return null;
  const text = value => value?.[i18n.resolvedLanguage] || value?.en || value || '';
  return <section className="project-architecture my-10" aria-labelledby="architecture-title">
    <h2 id="architecture-title" className="mb-5 text-2xl font-bold">{t('common.architecture')}</h2>
    <div className="space-y-5">{flows.map((flow, index) => <figure key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{text(flow.title)}</figcaption>
      <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">{flow.nodes.map((node, position) => (
        <motion.li key={position} className="flex min-w-0 flex-1 flex-col items-center gap-2 md:flex-row"
          initial={reducedMotion ? false : 'waiting'} whileInView="connected" viewport={{ once: true, amount: .6 }}>
          {position > 0 && <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 shrink-0 rotate-90 text-cyan-600 dark:text-cyan-400 md:rotate-0">
            <motion.path d="M2 12 H21 M15 6 L21 12 L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              variants={{ waiting: { pathLength: 0 }, connected: { pathLength: 1 } }}
              animate={reducedMotion ? 'connected' : undefined}
              transition={{ duration: reducedMotion ? 0 : .4, delay: reducedMotion ? 0 : position * .12 }} />
          </svg>}
          <motion.div className="relative flex h-full w-full items-start gap-3 overflow-hidden rounded-lg border border-blue-200 bg-white px-3 py-4 text-sm leading-6 dark:border-blue-900 dark:bg-slate-800"
            variants={{ waiting: { opacity: .5, y: 8 }, connected: { opacity: 1, y: 0 } }}
            animate={reducedMotion ? 'connected' : undefined}
            transition={{ duration: reducedMotion ? 0 : .45, delay: reducedMotion ? 0 : position * .12 + .15 }}>
            <span aria-hidden="true" className="font-mono text-xs leading-6 text-blue-500 dark:text-blue-300">{String(position + 1).padStart(2, '0')}</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{text(node)}</span>
            <motion.span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-blue-500 to-cyan-400"
              variants={{ waiting: { scaleX: 0 }, connected: { scaleX: 1 } }}
              animate={reducedMotion ? 'connected' : undefined}
              transition={{ duration: reducedMotion ? 0 : .6, delay: reducedMotion ? 0 : position * .12 + .2 }} />
          </motion.div>
        </motion.li>
      ))}</ol>
      {flow.note && <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{text(flow.note)}</p>}
    </figure>)}</div>
  </section>;
}
