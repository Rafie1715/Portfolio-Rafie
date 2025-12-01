import { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: true,
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary text-white shadow-lg hover:bg-secondary transition-all duration-300 hover:-translate-y-1 animate-bounce"
          aria-label="Back to Top"
        >
          <i className="fas fa-arrow-up text-xl"></i>
        </button>
      )}
    </>
  );
};

export default BackToTop;