// src/components/Loading.jsx
const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark transition-colors duration-300">
      <div className="relative flex flex-col items-center">
        {/* Spinner Animasi */}
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-slate-700 border-t-primary rounded-full animate-spin"></div>
        
        {/* Teks Loading */}
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;