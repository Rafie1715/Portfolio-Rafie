import { BookOpen, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PersonalMark from './PersonalMark';

export default function ProjectBuildNote({ project }) {
  const { t, i18n } = useTranslation();
  const value = project.lessonLearned;
  const note = typeof value === 'object' && value !== null
    ? value[i18n.resolvedLanguage] || value.en || value.id
    : value;
  if (!note) return null;

  return (
    <details className="project-build-note group/note mb-5 border-y border-slate-200 dark:border-slate-700">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 py-3 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 [&::-webkit-details-marker]:hidden">
        <BookOpen size={15} aria-hidden="true" className="shrink-0 text-primary" />
        <span>{t('common.project_note_title')}</span>
        <ChevronDown size={15} aria-hidden="true" className="ml-auto shrink-0 transition-transform group-open/note:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="project-build-note-paper mb-3 rounded-md px-4 py-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{t('common.project_note_lesson')}</p>
        <p className="text-xs leading-6 text-slate-700 dark:text-slate-200">{note}</p>
        <PersonalMark className="ml-auto mt-3 h-6 w-12 text-blue-600 dark:text-blue-400" />
      </div>
    </details>
  );
}
