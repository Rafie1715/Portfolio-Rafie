import { BadgeCheck, MapPin } from 'lucide-react';

const IDCard = () => (
  <article className="mx-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-100">
    <header className="flex h-24 items-center justify-between bg-emerald-800 px-5 text-white">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white p-1.5">
          <img
            src="/images/upnvj_logo.webp"
            alt="UPN Veteran Jakarta"
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight">UPN Veteran Jakarta</p>
          <p className="mt-1 text-[10px] font-semibold uppercase text-emerald-100">Faculty of Computer Science</p>
        </div>
      </div>
      <span className="text-[10px] font-bold uppercase text-emerald-100">Profile ID</span>
    </header>

    <div className="px-6 pb-6 pt-5 text-slate-900">
      <div className="mx-auto h-36 w-36 overflow-hidden rounded-md border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200">
        <img
          src="/images/profile.webp"
          alt="Rafie Rojagat Bachri"
          className="h-full w-full object-cover object-[center_34%]"
        />
      </div>

      <div className="mt-5 text-center">
        <p className="text-[10px] font-bold uppercase text-slate-500">Developer Profile</p>
        <h3 className="mt-1 text-xl font-bold leading-tight">Rafie Rojagat Bachri</h3>
        <p className="mt-1 text-sm font-semibold text-emerald-700">Informatics Graduate</p>
      </div>

      <dl className="mt-5 grid grid-cols-2 border-y border-slate-200 py-4 text-center">
        <div className="border-r border-slate-200 px-2">
          <dt className="text-[10px] font-bold uppercase text-slate-500">Focus</dt>
          <dd className="mt-1 text-sm font-bold">Mobile &amp; Web</dd>
        </div>
        <div className="px-2">
          <dt className="text-[10px] font-bold uppercase text-slate-500">Graduation</dt>
          <dd className="mt-1 text-sm font-bold">2026</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <MapPin size={14} aria-hidden="true" />
          Jakarta
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold uppercase text-emerald-700 ring-1 ring-inset ring-emerald-200">
          <BadgeCheck size={14} aria-hidden="true" />
          Open to work
        </span>
      </div>
    </div>

    <footer className="bg-slate-900 px-6 py-3 text-center text-[10px] font-bold uppercase text-slate-300">
      Android <span className="px-2 text-emerald-400">/</span> Front-End <span className="px-2 text-emerald-400">/</span> AI
    </footer>
  </article>
);

export default IDCard;
