import Tilt from 'react-parallax-tilt';
import profileImg from '/images/profile.webp'; 
import upnLogo from '/images/upnvj_logo.webp'; 

const IDCard = () => {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1000}
      scale={1.02}
      transitionSpeed={2000}
      className="w-full max-w-[420px]"
    >
      <div className="relative aspect-[1.586/1] rounded-2xl bg-white dark:bg-slate-200 overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-500 group select-none">
         
         <div className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
         </div>
         <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/50 pointer-events-none"></div>

         <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-[#004d40] to-[#00695c] flex items-center px-5 justify-between z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#004d40] font-bold text-xs">
                    <img src={upnLogo} alt="UPN" className="w-6 h-6 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
                <div className="leading-tight text-white">
                    <h1 className="font-bold text-sm tracking-wide">UPN VETERAN JAKARTA</h1>
                    <p className="text-[8px] opacity-80 uppercase tracking-wider">Faculty of Computer Science</p>
                </div>
            </div>
            <div className="text-white font-mono font-bold text-lg tracking-widest opacity-80">
                STUDENT
            </div>
         </div>

         <div className="absolute top-16 bottom-0 left-0 right-0 p-5 flex gap-5">
            
            <div className="flex flex-col gap-2 w-32 shrink-0">
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner bg-gray-100">
                    <img 
                        src={profileImg} 
                        alt="Rafie Profile" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 mix-blend-overlay"></div>
                </div>
                <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600 shadow-sm mx-auto opacity-80 flex items-center justify-center">
                   <div className="w-6 h-5 border border-yellow-700/30 rounded-[2px] grid grid-cols-2 gap-[1px]">
                       <div className="border border-yellow-700/30"></div><div className="border border-yellow-700/30"></div>
                       <div className="border border-yellow-700/30"></div><div className="border border-yellow-700/30"></div>
                   </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-20">
                
                <div className="mb-1">
                    <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Name</span>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight uppercase font-sans">
                        Rafie Rojagat Bachri
                    </h2>
                </div>

                <div className="w-full h-[1px] bg-gray-300 my-2"></div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-1">
                    <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">ID Number</span>
                        <span className="font-mono text-sm font-semibold text-gray-800">2210511043</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Major</span>
                        <span className="text-sm font-semibold text-gray-800">Informatics</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Class Of</span>
                        <span className="text-sm font-semibold text-gray-800">2022</span>
                    </div>
                     <div>
                        <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Status</span>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-sm border border-green-200 inline-block">ACTIVE</span>
                    </div>
                </div>

            </div>
         </div>

         <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light z-30"
              style={{ transform: 'translateZ(20px)' }}>
         </div>
         <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

         <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.07] pointer-events-none rotate-[-15deg]">
             <i className="fas fa-university text-9xl text-black"></i>
         </div>

      </div>
    </Tilt>
  );
};

export default IDCard;