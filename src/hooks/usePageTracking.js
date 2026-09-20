import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';
export const usePageTracking = () => {
  const { pathname } = useLocation();
  const previous = useRef(pathname);
  useEffect(() => {
    let timer;
    let tracked = false;
    const moved = previous.current !== pathname;
    previous.current = pathname;
    const observe = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const heading = document.querySelector('#main-content h1');
        if (!heading || tracked) return;
        tracked = true;
        trackPageView(pathname, document.title);
        if (moved && !location.hash) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      }, 250);
    };
    const observer = new MutationObserver(observe);
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    observe();
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [pathname]);
};
