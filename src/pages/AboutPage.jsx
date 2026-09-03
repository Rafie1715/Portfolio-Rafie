import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import About from "../components/About";
import Education from "../components/Education";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import Skills from "../components/Skills";
import Timeline from "../components/Timeline";

const Certifications = lazy(() => import("../components/Certifications"));
const ProfileLab = lazy(() => import("../components/ProfileLab"));

const DeferredSection = ({ children, minHeight = 320 }) => {
  const targetRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target || shouldRender) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={targetRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
};

const SectionFallback = () => (
  <div className="bg-gray-50 py-16 dark:bg-slate-950" aria-hidden="true">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6">
      <div className="h-8 w-56 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-56 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  </div>
);

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
      <main className="min-h-screen overflow-hidden bg-white pt-20 text-dark transition-colors duration-300 dark:bg-dark dark:text-white">
        <SEO
          title="About Rafie Rojagat Bachri | Mobile, Front-End & AI Developer"
          description="Meet Rafie Rojagat Bachri, a recent Informatics graduate focused on Android, front-end, and AI-integrated product development with Kotlin and React."
          url="https://rafierb.me/about"
          keywords="Rafie Rojagat Bachri, Android Developer, Kotlin Developer, React Developer, Front-End Developer, AI Developer, Informatics Graduate"
          type="profile"
        />

        <header className="border-b border-gray-200 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:gap-7 md:py-11">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-blue-100 text-primary dark:bg-blue-900/40">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-dark dark:text-white md:text-4xl">
                {t("pages.about.title_prefix")} <span className="text-primary">{t("pages.about.title_highlight")}</span>
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300 md:text-base">
                {t("pages.about.subtitle")}
              </p>
            </div>
          </div>
        </header>

        <About />
        <Skills />

        <section id="experience" className="scroll-mt-24 bg-white py-16 dark:bg-dark sm:py-20">
          <div className="container mx-auto mb-10 max-w-5xl px-4 sm:px-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="mb-3 text-sm font-bold uppercase text-primary">{t("experience.eyebrow")}</p>
            <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t("experience.title")}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">{t("experience.subtitle")}</p>
          </div>
          <Timeline />
        </section>

        <Education />

        <DeferredSection minHeight={420}>
          <Suspense fallback={<SectionFallback />}>
            <Certifications />
          </Suspense>
        </DeferredSection>

        <DeferredSection minHeight={320}>
          <Suspense fallback={<SectionFallback />}>
            <ProfileLab />
          </Suspense>
        </DeferredSection>
      </main>
    </PageTransition>
  );
};

export default AboutPage;
