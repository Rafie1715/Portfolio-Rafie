import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';

export default function MessageSentMotion() {
  const reducedMotion = useReducedMotion();
  return (
    <span aria-hidden="true" className="message-sent-motion relative block h-10 w-14 shrink-0 overflow-hidden">
      {!reducedMotion && <>
        <svg viewBox="0 0 56 40" fill="none" className="absolute inset-0 size-full">
          <motion.path d="M2 34 Q12 7 27 21 T55 2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"
            initial={{ pathLength: 0, opacity: .6 }} animate={{ pathLength: 1, opacity: 0 }} transition={{ duration: 1.3 }} />
        </svg>
        <motion.span className="absolute left-0 top-0" initial={{ x: -18, y: 34, opacity: 0 }}
          animate={{ x: [-18, 10, 30, 58], y: [34, 14, 20, -18], rotate: [-10, 5, -15, -25], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.15, ease: 'easeInOut' }}>
          <Send size={20} />
        </motion.span>
      </>}
      <motion.span className="absolute left-4 top-2" initial={reducedMotion ? false : { opacity: 0, scale: .7 }}
        animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0 : .25, delay: reducedMotion ? 0 : 1 }}>
        <CheckCircle2 size={24} />
      </motion.span>
    </span>
  );
}
