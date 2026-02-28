import { useRef, useState } from "react";
import { motion } from "framer-motion";

const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
    setIsHovered(true);
  };

  const handleBlur = () => {
    setOpacity(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-darkLight ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(37, 99, 235, 0.2), transparent 40%)`,
        }}
      />
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0"
        animate={{
          opacity: isHovered ? 0.3 : 0,
          boxShadow: isHovered ? "0 0 20px rgba(37, 99, 235, 0.3), inset 0 0 20px rgba(37, 99, 235, 0.1)" : "0 0 0px rgba(37, 99, 235, 0)"
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  );
};

export default SpotlightCard;