import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
export default function NotFound() {
  const { t } = useTranslation();
  return <main className="flex min-h-[75svh] flex-col items-center justify-center px-4 pt-24 text-center">
    <SEO title={t('common.not_found') + ' | Rafie Rojagat'} description={t('common.not_found_desc')} noindex />
    <p className="text-7xl font-black text-primary">404</p><h1 className="mt-5 text-3xl font-bold">{t('common.not_found')}</h1>
    <p className="mt-4 max-w-lg text-slate-600 dark:text-slate-400">{t('common.not_found_desc')}</p>
    <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-3 font-bold text-white">{t('common.back_home')}</Link>
  </main>;
}
