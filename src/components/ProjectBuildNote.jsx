import { BookOpen, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PersonalMark from './PersonalMark';

const pickText = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object' && value !== null) {
    return value[lang] || value.en || value.id || '';
  }
  return String(value);
};

export default function ProjectBuildNote({ project }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('id') ? 'id' : 'en';
  const note = pickText(project.lessonLearned, lang);
  const problem = pickText(project.decisionReplay?.constraint, lang) || pickText(project.challenges, lang);
  const decision = pickText(project.decisionReplay?.decision, lang) || pickText(project.solution, lang);

  if (!note && !problem && !decision) return null;

  return (
    <details className="project-build-note group/note mb-5 border-y border-slate-200 dark:border-slate-700">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 py-3 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 [&::-webkit-details-marker]:hidden">
        <BookOpen size={15} aria-hidden="true" className="shrink-0 text-primary" />
        <span>{t('common.project_note_title')}</span>
        <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {lang === 'id' ? 'Log Arsitektur' : 'Eng. Log'}
        </span>
        <ChevronDown size={15} aria-hidden="true" className="shrink-0 transition-transform group-open/note:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="project-build-note-paper mb-3 space-y-3 rounded-md px-4 py-3.5">
        {problem && (
          <div>
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <span>01</span>
              <span aria-hidden="true">/</span>
              <span>{t('common.project_note_problem', lang === 'id' ? 'Masalah & Batasan Teknis' : 'Technical Constraint')}</span>
            </p>
            <p className="text-xs leading-5 text-slate-700 dark:text-slate-200">{problem}</p>
          </div>
        )}
        {decision && (
          <div className={problem ? 'border-t border-blue-200/60 pt-2.5 dark:border-slate-700/80' : ''}>
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
              <span>02</span>
              <span aria-hidden="true">/</span>
              <span>{t('common.project_note_decision', lang === 'id' ? 'Keputusan Arsitektur' : 'Architecture Decision')}</span>
            </p>
            <p className="text-xs leading-5 text-slate-700 dark:text-slate-200">{decision}</p>
          </div>
        )}
        {note && (
          <div className={(problem || decision) ? 'border-t border-blue-200/60 pt-2.5 dark:border-slate-700/80' : ''}>
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              <span>{(problem || decision) ? '03' : '01'}</span>
              <span aria-hidden="true">/</span>
              <span>{t('common.project_note_lesson')}</span>
            </p>
            <p className="text-xs leading-5 text-slate-700 dark:text-slate-200">{note}</p>
          </div>
        )}
        <PersonalMark className="ml-auto mt-2 h-6 w-12 text-blue-600 dark:text-blue-400" />
      </div>
    </details>
  );
}

