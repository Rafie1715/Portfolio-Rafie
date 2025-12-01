// src/components/Nametag.jsx
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import profileImg from "../assets/images/profile.jpg"; 

const Nametag = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Fisika Bandul (Berat & Stabil)
  const springConfig = { damping: 15, stiffness: 100, mass: 1 };

  // Logika Rotasi
  const rotateZ = useSpring(useTransform(x, [-300, 300], [25, -25]), springConfig);
  const rotateX = useSpring(useTransform(y, [-150, 150], [10, -10]), springConfig);

  return (
    // Container utama harus tinggi agar tali tidak kepotong
    <div className="flex flex-col items-center justify-center h-[500px] w-full perspective-1000 cursor-grab active:cursor-grabbing" style={{ perspective: 1000 }}>
      
      {/* Titik Gantung (Paku) */}
      <div className="w-3 h-3 bg-gray-300 rounded-full mb-[-10px] z-0 opacity-50 shadow-inner"></div>

      {/* BANDUL UTAMA (Tali + Kartu) */}
      <motion.div
        style={{ 
            x, 
            y, 
            rotateZ, 
            rotateX,
            transformOrigin: "top center", // Pivot di atas
        }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }} // Dikunci di poros
        dragElastic={0.15}
        whileTap={{ cursor: "grabbing" }}
        className="flex flex-col items-center origin-top relative z-10"
      >
        
        {/* --- BAGIAN TALI --- */}
        <div className="relative flex flex-col items-center -mb-6 pointer-events-none z-0">
            {/* Tali Lanyard */}
            <div className="w-4 h-32 bg-gradient-to-b from-orange-500 to-orange-600 shadow-md flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
                <span className="text-white/90 font-bold text-[10px] tracking-widest rotate-90 whitespace-nowrap opacity-90">
                  UPNVJ
                </span>
            </div>
            {/* Jepitan Hitam */}
            <div className="w-12 h-10 bg-gray-900 rounded-md shadow-xl border-t border-gray-700 flex items-center justify-center relative -mt-1">
               <div className="w-8 h-1 bg-gray-700 rounded-full opacity-50"></div>
            </div>
        </div>

        {/* --- BAGIAN KARTU --- */}
        <div className="relative z-10">
            {/* Ukuran Kartu DIKUNCI di sini: w-[280px] h-[420px] */}
            <div className="relative w-[280px] h-[420px] bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white select-none">
            
                {/* Background Gradient & Dekorasi */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute top-0 w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                </div>

                {/* Konten Dalam Kartu */}
                <div className="relative z-10 flex flex-col items-center h-full pt-12 pb-6 px-6 text-center">
                    
                    {/* Badge Student */}
                    <div className="bg-[#FFC107] text-yellow-900 font-black text-sm px-6 py-1.5 rounded-full shadow-md border-2 border-white rotate-[-2deg] mb-6 transform hover:scale-105 transition-transform">
                        STUDENT
                    </div>

                    {/* Foto Profil (Ukuran fixed w-32) */}
                    <div className="relative mb-5 group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-pink-500 to-violet-600 rounded-[1.5rem] opacity-80 blur-[2px]"></div>
                        <div className="relative w-32 h-40 bg-white p-1 rounded-[1.4rem] shadow-inner overflow-hidden">
                            <img 
                                src={profileImg} 
                                alt="Profile" 
                                className="w-full h-full object-cover rounded-[1.2rem]" 
                                draggable="false" 
                            />
                        </div>
                    </div>

                    {/* Identitas */}
                    <div className="w-full space-y-1">
                        <h2 className="text-xl font-black text-gray-800 tracking-tight leading-none uppercase">
                            RAFIE ROJAGAT BACHRI
                        </h2>
                        
                        <p className="text-[10px] font-bold text-pink-600 tracking-[0.15em] uppercase py-1.5">
                            INFORMATICS
                        </p>
                        
                        <div className="w-1/2 h-0.5 bg-gray-300 mx-auto rounded-full my-3"></div>
                        
                        <div className="flex justify-between w-full px-2 pt-1 text-gray-500">
                            <div className="text-left">
                                <p className="text-[9px] uppercase font-bold text-gray-400">ID Number</p>
                                <p className="text-xs font-bold font-mono">2210511043</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] uppercase font-bold text-gray-400">Year</p>
                                <p className="text-xs font-bold font-mono">2025</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Kilau Kaca */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-60 pointer-events-none z-20"></div>
            
            </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Nametag;