import { motion, useReducedMotion } from 'framer-motion';

export default function JourneyMilestone({ children, className = '' }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div className={`journey-milestone relative flex flex-none items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 ${className}`}
      initial={reducedMotion ? false : 'waiting'} whileInView="arrived" viewport={{ once: true, amount: .7 }}>
      {children}
      <svg viewBox="0 0 60 60" fill="none" aria-hidden="true" className="pointer-events-none absolute -inset-1 h-[calc(100%+8px)] w-[calc(100%+8px)] text-blue-500 dark:text-cyan-400">
        <motion.rect x="2" y="2" width="56" height="56" rx="12" stroke="currentColor" strokeWidth="1.5"
          variants={{ waiting: { pathLength: 0, opacity: 0 }, arrived: { pathLength: 1, opacity: .75 } }}
          animate={reducedMotion ? 'arrived' : undefined}
          transition={{ duration: reducedMotion ? 0 : .85, ease: 'easeInOut' }} />
      </svg>
    </motion.div>
  );
}
