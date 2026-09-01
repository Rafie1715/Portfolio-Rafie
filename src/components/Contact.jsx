import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Github,
  Instagram,
  Linkedin,
  LoaderCircle,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { trackFormSubmission, trackExternalLink } from '../utils/analytics';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xanjlvvr';
const CONTACT_EMAIL = 'rojagatrafie@gmail.com';
const MESSAGE_MAX_LENGTH = 2000;
const KNOWN_FIELDS = new Set(['name', 'email', 'topic', 'message']);

const socialLinks = [
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/rafie-rojagat',
    icon: <Linkedin className="h-5 w-5" aria-hidden="true" />,
  },
  {
    label: 'GitHub',
    url: 'https://github.com/Rafie1715',
    icon: <Github className="h-5 w-5" aria-hidden="true" />,
  },
  {
    label: 'Instagram',
    url: 'https://instagram.com/rafie_rb',
    icon: <Instagram className="h-5 w-5" aria-hidden="true" />,
  },
];

const Contact = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [submission, setSubmission] = useState({ status: 'idle', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [messageLength, setMessageLength] = useState(0);
  const [copied, setCopied] = useState(false);
  const feedbackRef = useRef(null);
  const copyTimerRef = useRef(null);
  const requestControllerRef = useRef(null);

  const isSubmitting = submission.status === 'loading';
  const hasFeedback = !['idle', 'loading'].includes(submission.status);
  const submitButtonState = isSubmitting
    ? 'loading'
    : submission.status === 'success'
      ? 'success'
      : 'idle';

  useEffect(() => {
    if (hasFeedback) {
      feedbackRef.current?.focus();
    }
  }, [hasFeedback, submission.status]);

  useEffect(() => () => {
    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }
    requestControllerRef.current?.abort();
  }, []);

  const clearFieldError = (field) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field) => {
    clearFieldError(field);
    setSubmission((current) => (
      ['idle', 'loading'].includes(current.status)
        ? current
        : { status: 'idle', message: '' }
    ));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    setSubmission({ status: 'loading', message: '' });
    setFieldErrors({});

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        trackFormSubmission('contact_form', true);
        setSubmission({ status: 'success', message: t('contact.form.success') });
        form.reset();
        setMessageLength(0);
        return;
      }

      trackFormSubmission('contact_form', false);

      if (response.status === 429) {
        setSubmission({ status: 'rate-limit', message: t('contact.form.rate_limit') });
        return;
      }

      const errors = Array.isArray(payload.errors) ? payload.errors : [];
      const nextFieldErrors = errors.reduce((result, error) => {
        if (KNOWN_FIELDS.has(error.field)) {
          result[error.field] = error.message || t('contact.form.validation_error');
        }
        return result;
      }, {});

      if (Object.keys(nextFieldErrors).length > 0) {
        setFieldErrors(nextFieldErrors);
        setSubmission({ status: 'error', message: t('contact.form.validation_error') });
        window.setTimeout(() => {
          document.getElementById(Object.keys(nextFieldErrors)[0])?.focus();
        }, 0);
        return;
      }

      setSubmission({
        status: 'error',
        message: errors[0]?.message || t('contact.form.error'),
      });
    } catch (error) {
      trackFormSubmission('contact_form', false);
      setSubmission({
        status: error.name === 'AbortError' ? 'timeout' : 'error',
        message: error.name === 'AbortError'
          ? t('contact.form.timeout')
          : t('contact.form.error'),
      });
    } finally {
      window.clearTimeout(timeoutId);
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
    }
  };

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: 'easeOut' },
      };

  const inputClass = 'min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-dark outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-gray-500';

  const fieldError = (field) => fieldErrors[field] && (
    <motion.p
      id={`${field}-error`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400"
    >
      <AlertCircle className="h-4 w-4 flex-none" aria-hidden="true" />
      {fieldErrors[field]}
    </motion.p>
  );

  return (
    <section id="contact" className="relative z-10 pb-16 md:pb-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)] lg:gap-14 lg:px-8">
        <motion.div {...revealProps}>
          <form
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7 md:p-8"
          >
            <div className="mb-7">
              <p className="mb-2 text-sm font-bold uppercase text-primary">{t('contact.form.eyebrow')}</p>
              <h2 className="text-2xl font-black text-dark dark:text-white sm:text-3xl">
                {t('contact.form.title')}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                {t('contact.form.subtitle')}
              </p>
            </div>

            <div className="absolute left-[-5000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="company-website">Company website</label>
              <input id="company-website" type="text" name="_gotcha" tabIndex="-1" autoComplete="off" />
            </div>
            <input type="hidden" name="_subject" value="New portfolio contact" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="transition-transform duration-200 focus-within:-translate-y-0.5 motion-reduce:transform-none">
                <label htmlFor="name" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                  {t('contact.form.name_label')} <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  minLength="2"
                  maxLength="80"
                  required
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  onChange={() => handleFieldChange('name')}
                  className={inputClass}
                  placeholder={t('contact.form.name_placeholder')}
                />
                {fieldError('name')}
              </div>

              <div className="transition-transform duration-200 focus-within:-translate-y-0.5 motion-reduce:transform-none">
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                  {t('contact.form.email_label')} <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength="254"
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  onChange={() => handleFieldChange('email')}
                  className={inputClass}
                  placeholder={t('contact.form.email_placeholder')}
                />
                {fieldError('email')}
              </div>
            </div>

            <div className="mt-5 transition-transform duration-200 focus-within:-translate-y-0.5 motion-reduce:transform-none">
              <label htmlFor="topic" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                {t('contact.form.topic_label')} <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <select
                id="topic"
                name="topic"
                defaultValue=""
                required
                aria-invalid={Boolean(fieldErrors.topic)}
                aria-describedby={fieldErrors.topic ? 'topic-error' : undefined}
                onChange={() => handleFieldChange('topic')}
                className={inputClass}
              >
                <option value="" disabled>{t('contact.form.topic_placeholder')}</option>
                <option value="Hiring">{t('contact.form.topics.hiring')}</option>
                <option value="Internship">{t('contact.form.topics.internship')}</option>
                <option value="Collaboration">{t('contact.form.topics.collaboration')}</option>
                <option value="Freelance">{t('contact.form.topics.freelance')}</option>
                <option value="Other">{t('contact.form.topics.other')}</option>
              </select>
              {fieldError('topic')}
            </div>

            <div className="mt-5 transition-transform duration-200 focus-within:-translate-y-0.5 motion-reduce:transform-none">
              <div className="mb-2 flex items-end justify-between gap-4">
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-200">
                  {t('contact.form.message_label')} <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {messageLength}/{MESSAGE_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                rows="6"
                minLength="20"
                maxLength={MESSAGE_MAX_LENGTH}
                required
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? 'message-error' : 'message-help'}
                onChange={(event) => {
                  setMessageLength(event.target.value.length);
                  handleFieldChange('message');
                }}
                className={`${inputClass} resize-y`}
                placeholder={t('contact.form.message_placeholder')}
              />
              {fieldError('message')}
              {!fieldErrors.message && (
                <p id="message-help" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('contact.form.message_help')}
                </p>
              )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {hasFeedback && (
                <motion.div
                  key={submission.status}
                  ref={feedbackRef}
                  tabIndex="-1"
                  role={submission.status === 'success' ? 'status' : 'alert'}
                  aria-live={submission.status === 'success' ? 'polite' : 'assertive'}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={`mt-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm font-semibold outline-none focus:ring-2 ${
                    submission.status === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 focus:ring-emerald-300 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-red-200 bg-red-50 text-red-800 focus:ring-red-300 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
                  }`}
                >
                  {submission.status === 'success'
                    ? <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                    : <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />}
                  <span>{submission.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={shouldReduceMotion || isSubmitting ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65 dark:focus:ring-offset-slate-900 sm:w-auto"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={submitButtonState}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -5 }}
                    transition={{ duration: 0.16 }}
                    className="inline-flex items-center justify-center gap-2"
                  >
                    {submitButtonState === 'loading' && (
                      <LoaderCircle className={`h-4 w-4 ${shouldReduceMotion ? '' : 'animate-spin'}`} aria-hidden="true" />
                    )}
                    {submitButtonState === 'success' && <Check className="h-4 w-4" aria-hidden="true" />}
                    {submitButtonState === 'idle' && <Send className="h-4 w-4" aria-hidden="true" />}
                    {submitButtonState === 'loading'
                      ? t('contact.form.sending')
                      : submitButtonState === 'success'
                        ? t('contact.form.sent')
                        : t('contact.form.send_btn')}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <p className="flex max-w-sm items-start gap-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                <span>
                  {t('contact.form.privacy_prefix')}{' '}
                  <a
                    href="https://formspree.io/legal/privacy-policy/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline decoration-gray-300 underline-offset-2 hover:text-primary dark:decoration-slate-600"
                  >
                    Formspree
                  </a>.
                </span>
              </p>
            </div>
          </form>
        </motion.div>

        <motion.aside
          {...revealProps}
          transition={shouldReduceMotion ? undefined : { duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          aria-labelledby="contact-details-title"
          className="border-t border-gray-200 pt-8 dark:border-slate-700 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1"
        >
          <div className="border-l-2 border-emerald-500 pl-4">
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
              {t('contact.availability_label')}
            </p>
            <p className="mt-1 font-bold text-dark dark:text-white">{t('contact.availability')}</p>
          </div>

          <h2 id="contact-details-title" className="mt-8 text-xl font-black text-dark dark:text-white">
            {t('contact.info_title')}
          </h2>

          <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200 dark:divide-slate-700 dark:border-slate-700">
            <div className="flex gap-3 py-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950/50">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 flex min-w-0 items-center gap-2">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="min-w-0 break-words text-sm font-semibold text-dark hover:text-primary dark:text-gray-200 [overflow-wrap:anywhere]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-gray-400 dark:hover:bg-slate-800"
                    aria-label={copied ? t('contact.email_copied') : t('contact.copy_email')}
                    title={copied ? t('contact.email_copied') : t('contact.copy_email')}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? 'copied' : 'copy'}
                        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.75 }}
                        transition={{ duration: 0.16 }}
                      >
                        {copied
                          ? <Check className="h-4 w-4" aria-hidden="true" />
                          : <Copy className="h-4 w-4" aria-hidden="true" />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  <span className="sr-only" role="status" aria-live="polite">
                    {copied ? t('contact.email_copied') : ''}
                  </span>
                </dd>
              </div>
            </div>

            <div className="flex gap-3 py-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t('contact.location')}</dt>
                <dd className="mt-1 text-sm font-semibold text-dark dark:text-gray-200">Jakarta, Indonesia</dd>
              </div>
            </div>

            <div className="flex gap-3 py-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{t('contact.response_time_label')}</dt>
                <dd className="mt-1 text-sm font-semibold text-dark dark:text-gray-200">{t('contact.response_time')}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a
              href="/assets/CV Rafie Rojagat Bachri.pdf"
              download="CV_Rafie_Rojagat_Bachri.pdf"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/40 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t('contact.download_cv')}
            </a>
            <a
              href="https://linkedin.com/in/rafie-rojagat"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackExternalLink('linkedin', 'https://linkedin.com/in/rafie-rojagat')}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/40 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
          </div>

          <div className="mt-7">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t('contact.profiles')}</p>
            <div className="mt-3 flex gap-2">
              {socialLinks.map(({ label, url, icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackExternalLink(label.toLowerCase(), url)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-gray-300"
                  aria-label={`${t('contact.open_profile')} ${label}`}
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default Contact;
