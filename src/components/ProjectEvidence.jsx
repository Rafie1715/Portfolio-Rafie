import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { trackCTAClick } from '../utils/analytics';

export default function ProjectEvidence({ project }) {
  const { t, i18n } = useTranslation();
  const evidence = project.evidence;
  if (!evidence) return null;
  const lang = i18n.resolvedLanguage || 'en';
  const text = value => value?.[lang] || value?.en || value || '';
  return <section aria-label={t('common.evidence')} className="mb-10 rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900 dark:bg-blue-950/20 sm:p-7">
    <h2 className="text-xl font-bold">{t('common.contribution')}</h2>
    <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">{text(evidence.contribution)}</p>
    {evidence.flow && <><h3 className="mt-5 text-sm font-bold">{t('common.product_flow')}</h3><ol className="mt-3 grid gap-3 sm:grid-cols-3">{evidence.flow.map((step, index) => <li key={index} className="rounded-lg bg-white p-3 text-sm dark:bg-slate-900"><span className="mb-2 block font-bold text-primary">0{index + 1}</span>{text(step)}</li>)}</ol></>}
    {evidence.metricContext && <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400">{text(evidence.metricContext)}</p>}
    <div className="mt-5 flex flex-wrap gap-4">
      {evidence.article && <Link to={evidence.article} className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary">{t('common.read_case')}<ArrowUpRight size={16} aria-hidden="true" /></Link>}
      <Link to="/contact" onClick={() => trackCTAClick('project_contact', project.id)} className="inline-flex min-h-11 items-center font-semibold text-primary">{t('common.discuss')}</Link>
    </div>
  </section>;
}
