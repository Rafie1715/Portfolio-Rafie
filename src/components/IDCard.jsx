import { BadgeCheck } from 'lucide-react';

const IDCard = () => (
  <article className="mx-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-100">
    <header className="flex items-center gap-3 bg-emerald-800 px-5 py-5 text-white">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-1.5">
        <img src="/images/upnvj_logo.webp" alt="" loading="lazy" className="h-full w-full object-contain" />
      </span>
      <p className="text-base font-bold uppercase leading-tight">UPN Veteran<br />Jakarta</p>
    </header>

    <div className="px-6 pb-6 pt-6 text-center text-slate-900">
      <div className="mx-auto aspect-[62/51] w-full overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
        <img src="/images/profile.webp" alt="Rafie Rojagat Bachri" loading="lazy"
          className="h-full w-full object-cover object-[center_28%]" />
      </div>

      <h3 className="mt-6 font-bold leading-tight">
        <span className="block text-4xl">Rafie</span>
        <span className="mt-1 block text-3xl">Rojagat Bachri</span>
      </h3>
      <p className="mt-4 text-lg font-semibold text-emerald-700">Android · Web · AI</p>
      <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-green-100 px-5 py-3 text-base font-bold uppercase text-green-800">
        <BadgeCheck size={19} aria-hidden="true" />
        Open to work
      </span>
    </div>
    <div className="h-1.5 bg-emerald-700" aria-hidden="true" />
  </article>
);

export default IDCard;
