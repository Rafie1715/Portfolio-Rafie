// src/components/ScrollProgress.jsx
import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Mencegah pembagian dengan nol
    if (windowHeight === 0) {
        setScrollWidth(0);
        return;
    }

    const scrolled = (scrollTop / windowHeight) * 100;
    setScrollWidth(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // z-[100] agar selalu di atas navbar
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        style={{ width: `${scrollWidth}%`, transition: "width 0.1s ease-out" }}
      ></div>
    </div>
  );
};

export default ScrollProgress;