import { useTranslation } from 'react-i18next';

export default function ProjectCatalogStatus({ loading, error, retry, loadingKey = 'common.projects_loading', errorKey = 'common.projects_error' }) {
  const { t } = useTranslation();
  if (!loading && !error) return null;
  return <div role={error ? 'alert' : 'status'} className="my-8 rounded-xl border border-slate-200 p-6 text-center dark:border-slate-700">
    <p>{t(error ? errorKey : loadingKey)}</p>
    {error && <button type="button" onClick={retry} className="mt-4 rounded-lg bg-primary px-5 py-3 font-semibold text-white">{t('common.retry')}</button>}
  </div>;
}
