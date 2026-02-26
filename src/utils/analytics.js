import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initializeAnalytics = () => {
  const GA_ID = import.meta.env.VITE_GA_ID;
  
  if (!GA_ID) {
    console.warn('Google Analytics ID not found in environment variables');
    return false;
  }

  ReactGA.initialize(GA_ID);
  return true;
};

// Track page view
export const trackPageView = (path, title) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title || document.title,
  });
};

// Track event
export const trackEvent = (category, action, label, value) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    value: value,
  });
};

// Track CTA clicks
export const trackCTAClick = (buttonType, projectId = null) => {
  trackEvent('CTA', 'click', `${buttonType}${projectId ? `-${projectId}` : ''}`, 1);
};

// Track form submission
export const trackFormSubmission = (formName, success = true) => {
  trackEvent('Forms', 'submit', formName, success ? 1 : 0);
};

// Track external link clicks
export const trackExternalLink = (platform, url) => {
  trackEvent('External Links', 'click', platform, 1);
};

// Track project views
export const trackProjectView = (projectId, projectName) => {
  trackEvent('Projects', 'view', projectId, 1);
};
