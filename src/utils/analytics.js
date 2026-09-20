import ReactGA from 'react-ga4';
let initialized = false;
export const initializeAnalytics = () => {
  const id = import.meta.env.VITE_GA_ID;
  if (!id || initialized || import.meta.env.DEV || ['localhost', '127.0.0.1'].includes(location.hostname)) return false;
  ReactGA.initialize(id, { gtagOptions: { send_page_view: false } });
  initialized = true;
  import('web-vitals').then(({ onCLS, onINP, onLCP }) => {
    const report = ({ name, value, id: metricId, rating }) => ReactGA.event(name, { value: Math.round(name === 'CLS' ? value * 1000 : value), metric_value: value, metric_id: metricId, metric_rating: rating, non_interaction: true });
    onCLS(report); onINP(report); onLCP(report);
  });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a');
    if (link?.hasAttribute('download')) trackCTAClick('download_cv');
    else if (link?.getAttribute('href')?.startsWith('mailto:')) trackCTAClick('contact_email');
  });
  return true;
};
export const trackPageView = (path, title) => { if (initialized) ReactGA.send({ hitType: 'pageview', page: path, title }); };
export const trackEvent = (category, action, label, value) => { if (initialized) ReactGA.event({ category, action, label, value }); };
export const trackCTAClick = (buttonType, projectId = null) => trackEvent('CTA', 'click', projectId ? buttonType + ':' + projectId : buttonType, 1);
export const trackFormSubmission = (formName, success = true) => trackEvent('Forms', success ? 'submit_success' : 'submit_failure', formName, 1);
export const trackExternalLink = (platform, url) => trackEvent('External Links', 'click', platform + ':' + url, 1);
export const trackProjectView = (projectId, projectName) => trackEvent('Projects', 'view', projectName || projectId, 1);
