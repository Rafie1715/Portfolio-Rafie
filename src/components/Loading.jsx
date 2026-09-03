// src/components/Loading.jsx
const Loading = () => {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-white pt-20 transition-colors duration-300 dark:bg-dark"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center">
        {/* Spinner Animasi */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary motion-reduce:animate-none dark:border-slate-700 dark:border-t-primary"></div>
        
        {/* Teks Loading */}
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
