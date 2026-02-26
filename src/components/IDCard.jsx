import { motion } from 'framer-motion';
import { useState } from 'react';
import profileImg from '/images/profile.webp';
import upnLogo from '/images/upnvj_logo.webp';

const IDCard = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!isHovered) return;
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        setRotation({ x: -rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div className="w-full max-w-[360px] sm:max-w-[420px] mx-auto"
            style={{ perspective: '1200px', perspectiveOrigin: 'center top' }}>
            
            {/* Lanyard Rope & Clip */}
            <motion.div 
                className="relative mx-auto w-12 h-32 mb-4"
                animate={{ 
                    rotateZ: isHovered ? [0, 3, -3, 0] : 0,
                }}
                transition={{ 
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut"
                }}
            >
                {/* Lanyard String */}
                <div className="absolute left-1/2 -translate-x-1/2 w-1 h-28 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600 rounded-full shadow-md">
                    {/* String Texture */}
                    <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)',
                    }}></div>
                </div>

                {/* Lanyard Clip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-6 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-t-lg shadow-lg border border-gray-600">
                    <div className="absolute inset-1 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-md"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-gray-600 rounded-b-sm"></div>
                    {/* Metal sheen */}
                    <div className="absolute top-1 left-2 w-1 h-2 bg-white/60 rounded-full blur-[1px]"></div>
                </div>

                {/* Lanyard Ring/Hook */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-6 border-2 border-gray-400 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-md">
                    <div className="absolute inset-0.5 border border-white/40 rounded-full"></div>
                </div>
            </motion.div>

            {/* ID Card with 3D Transform */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                animate={{
                    rotateX: rotation.x,
                    rotateY: rotation.y,
                    rotateZ: isHovered ? [0, -1, 1, 0] : 0,
                }}
                transition={{
                    rotateX: { type: "spring", stiffness: 300, damping: 30 },
                    rotateY: { type: "spring", stiffness: 300, damping: 30 },
                    rotateZ: { duration: 3, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }
                }}
                style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center top',
                }}
                className="relative"
            >
            <div className="relative aspect-[1.586/1] rounded-xl sm:rounded-2xl bg-white dark:bg-slate-200 overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-500 group select-none"
                style={{
                    boxShadow: isHovered 
                        ? '0 30px 60px -12px rgba(0, 0, 0, 0.35), 0 18px 36px -18px rgba(0, 0, 0, 0.25)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.3s ease-out'
                }}
            >

                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 0.5px, transparent 0.5px)', backgroundSize: '8px 8px' }}>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/50 pointer-events-none"></div>

                {/* Lanyard Hole - Connection Point */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-300 shadow-inner border-2 border-gray-300 dark:border-gray-400 z-50">
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-md"></div>
                    <div className="absolute inset-1 rounded-full border border-gray-500/30"></div>
                    {/* Reinforcement ring */}
                    <div className="absolute -inset-1 rounded-full border-2 border-gray-400 dark:border-gray-500 opacity-40"></div>
                </div>

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
            </motion.div>
        </div>
    );
};

export default IDCard;