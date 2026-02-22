import Tilt from 'react-parallax-tilt';
import profileImg from '/images/profile.webp';
import upnLogo from '/images/upnvj_logo.webp';

const IDCard = () => {
    return (
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            perspective={1000}
            scale={1.01}
            transitionSpeed={2000}
            className="w-full max-w-[360px] sm:max-w-[420px] mx-auto"
        >
            <div className="relative aspect-[1.586/1] rounded-xl sm:rounded-2xl bg-white dark:bg-slate-200 overflow-hidden shadow-xl sm:shadow-2xl border border-gray-300 dark:border-gray-500 group select-none">

                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 0.5px, transparent 0.5px)', backgroundSize: '8px 8px' }}>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/50 pointer-events-none"></div>

                <div className="absolute top-0 left-0 right-0 py-1.5 sm:h-14 bg-gradient-to-r from-[#004d40] to-[#00695c] flex flex-col sm:flex-row items-center px-3 sm:px-5 justify-between z-10">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center p-0.5">
                            <img src={upnLogo} alt="UPN" loading="lazy" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <div className="leading-none sm:leading-tight text-white text-center sm:text-left">
                            <h1 className="font-bold text-[10px] sm:text-sm tracking-wide">UPN VETERAN JAKARTA</h1>
                            <p className="text-[7px] sm:text-[8px] opacity-80 uppercase tracking-wider">Faculty of Computer Science</p>
                        </div>
                    </div>
                    <div className="text-white font-mono font-bold text-xs sm:text-lg tracking-widest opacity-80 sm:block hidden">
                        STUDENT
                    </div>
                </div>

                <div className="absolute top-11 sm:top-16 bottom-0 left-0 right-0 p-3 sm:p-5 flex gap-3 sm:gap-5">
                    <div className="flex flex-col gap-1.5 sm:gap-2 w-24 sm:w-32 shrink-0">
                        <div className="relative w-full aspect-[3/4] rounded-md sm:rounded-lg overflow-hidden border-[1.5px] sm:border-2 border-gray-200 shadow-inner bg-gray-100">
                            <img
                                src={profileImg}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 mix-blend-overlay"></div>
                        </div>
                        <div className="w-8 h-6 sm:w-10 sm:h-8 rounded-sm sm:rounded bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-600 shadow-sm mx-auto opacity-80 flex items-center justify-center">
                            <div className="w-5 h-4 sm:w-6 sm:h-5 border border-yellow-700/30 rounded-[1px] sm:rounded-[2px] grid grid-cols-2 gap-[1px]">
                                <div className="border border-yellow-700/30"></div><div className="border border-yellow-700/30"></div>
                                <div className="border border-yellow-700/30"></div><div className="border border-yellow-700/30"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center relative z-20 pt-1 sm:pt-0">

                        <div className="mb-0.5 sm:mb-1">
                            <span className="block text-[7px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider">Name</span>
                            <h2 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight uppercase font-sans line-clamp-2">
                                Rafie Rojagat Bachri
                            </h2>
                        </div>

                        <div className="w-full h-[0.5px] sm:h-[1px] bg-gray-300 my-1.5 sm:my-2"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 sm:gap-y-3 gap-x-1">
                            <div className="flex flex-col sm:block">
                                <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider">ID Number</span>
                                <span className="font-mono text-[10px] sm:text-sm font-semibold text-gray-800 leading-tight"> 2210511043</span>
                            </div>
                            <div className="flex flex-col sm:block">
                                <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider">Major</span>
                                <span className="text-[10px] sm:text-sm font-semibold text-gray-800 leading-tight truncate"> Informatics</span>
                            </div>
                            <div className="flex flex-col sm:block">
                                <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider">Class Of</span>
                                <span className="text-[10px] sm:text-sm font-semibold text-gray-800 leading-tight"> 2022</span>
                            </div>
                            <div className="flex flex-col sm:block">
                                <span className="text-[7px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider sm:mb-1">Status</span>
                                <span className="text-[8px] sm:text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-sm border border-green-200 inline-block self-start"> ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light z-30"
                    style={{ transform: 'translateZ(20px)' }}>
                </div>
                <div className="absolute right-[-15px] bottom-[-15px] opacity-[0.05] pointer-events-none rotate-[-15deg]">
                    <i className="fas fa-university text-7xl sm:text-9xl text-black"></i>
                </div>

            </div>
        </Tilt>
    );
};

export default IDCard;