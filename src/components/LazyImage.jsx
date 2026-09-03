import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName = '',
  placeholderClassName = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const imageContainer = imgRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    if (imageContainer) {
      observer.observe(imageContainer);
    }

    return () => {
      if (imageContainer) {
        observer.unobserve(imageContainer);
      }
    };
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Placeholder/Skeleton */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 dark:bg-slate-700 animate-pulse ${placeholderClassName}`}
        />
      )}
      
      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
