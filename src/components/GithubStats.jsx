import React from 'react';

const GithubStats = () => {
  const username = "Rafie1715"; 

  return (
    <div className="w-full flex flex-col items-center gap-6 py-8">
      
      <h3 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
        <i className="fab fa-github text-3xl"></i> Coding Activity
      </h3>

      <div className="w-full max-w-4xl px-4 mt-4">
         <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:scale-[1.01] transition-transform duration-300">
             <p className="text-sm font-bold text-gray-500 mb-4 text-center">Contribution Calendar</p>
             <img 
                src={`https://ghchart.rshah.org/40c463/${username}`} 
                alt="Github Chart" 
                className="w-full"
             />
         </div>
      </div>

    </div>
  );
};

export default GithubStats;