import { useState } from 'react';
import {
  BadgeCheck,
  CircleDotDashed,
  GitBranch,
  Gauge,
  Scale,
  TimerReset,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stepIcons = {
  problem: CircleDotDashed,
  constraint: TimerReset,
  options: GitBranch,
  decision: BadgeCheck,
  tradeoff: Scale,
  evidence: Gauge,
};

const DecisionReplay = ({ steps }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!Array.isArray(steps) || steps.length === 0) return null;

  const activeStep = steps[Math.min(activeIndex, steps.length - 1)];
  const ActiveIcon = stepIcons[activeStep.key] || CircleDotDashed;

  return (
    <section className="mb-14 border-y border-slate-200 py-8 dark:border-slate-700" aria-labelledby="decision-replay-title">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-primary">
            {t('projectDetail.decision_replay.eyebrow')}
          </p>
          <h2 id="decision-replay-title" className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
            {t('projectDetail.decision_replay.title')}
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-300">
          {t('projectDetail.decision_replay.desc')}
        </p>
      </div>

      <div className="mt-7 grid gap-7 md:grid-cols-[minmax(190px,0.65fr)_minmax(0,1.7fr)]">
        <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0" role="group" aria-label={t('projectDetail.decision_replay.controls')}>
          {steps.map((step, index) => {
            const Icon = stepIcons[step.key] || CircleDotDashed;
            const selected = index === activeIndex;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={selected}
                className={`flex min-h-12 flex-none items-center gap-3 rounded-md border px-3 text-left text-sm font-bold transition-colors md:w-full ${
                  selected
                    ? 'border-primary bg-blue-50 text-primary dark:bg-blue-950/35'
                    : 'border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white'
                }`}
              >
                <span className="text-xs tabular-nums text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                <Icon size={17} aria-hidden="true" />
                {t(`projectDetail.decision_replay.steps.${step.key}`)}
              </button>
            );
          })}
        </div>

        <div className="min-h-52 border-l-2 border-primary pl-5 md:pl-8" aria-live="polite">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-primary dark:bg-blue-900/40 dark:text-blue-300">
            <ActiveIcon size={20} aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase text-primary">
            {t('projectDetail.decision_replay.step_count', {
              current: activeIndex + 1,
              total: steps.length,
            })}
          </p>
          <h3 className="mt-2 text-xl font-bold text-dark dark:text-white">
            {t(`projectDetail.decision_replay.steps.${activeStep.key}`)}
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
            {activeStep.value}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DecisionReplay;
