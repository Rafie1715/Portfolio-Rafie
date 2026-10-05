import { ArrowRight, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProjectArchitecture({ flows }) {
  const { t, i18n } = useTranslation();
  if (!flows?.length) return null;
  const text = value => value?.[i18n.resolvedLanguage] || value?.en || value || '';
  return <section className="my-10" aria-labelledby="architecture-title">
    <h2 id="architecture-title" className="mb-5 text-2xl font-bold">{t('common.architecture')}</h2>
    <div className="space-y-5">{flows.map((flow, index) => <figure key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{text(flow.title)}</figcaption>
      <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">{flow.nodes.map((node, position) => <li key={position} className="flex min-w-0 flex-1 flex-col items-center gap-2 md:flex-row">
        {position > 0 && <><ArrowRight size={18} className="hidden shrink-0 text-primary md:block" aria-hidden="true" /><ArrowDown size={18} className="shrink-0 text-primary md:hidden" aria-hidden="true" /></>}
        <span className="flex h-full w-full items-center rounded-lg border border-blue-200 bg-white px-3 py-4 text-sm leading-6 dark:border-blue-900 dark:bg-slate-800">{text(node)}</span>
      </li>)}</ol>
      {flow.note && <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{text(flow.note)}</p>}
    </figure>)}</div>
  </section>;
}
