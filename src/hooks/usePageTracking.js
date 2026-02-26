import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Hook to track page views on route changes
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Get page title from document or pathname
    const pageTitle = document.title || location.pathname;
    
    // Track page view
    trackPageView(location.pathname, pageTitle);
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [location.pathname]);
};
