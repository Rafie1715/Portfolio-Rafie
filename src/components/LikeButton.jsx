import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { ref, onValue, runTransaction } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

const LikeButton = ({ projectId }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    const likesRef = ref(db, `project_likes/${projectId}`);
    const unsubscribe = onValue(likesRef, (snapshot) => {
      setLikes(snapshot.val() || 0);
    });

    const checkLocalLike = () => {
        const likedProjects = JSON.parse(localStorage.getItem("liked_projects") || "[]");
        setIsLiked(likedProjects.includes(projectId));
    };

    checkLocalLike();

    return () => unsubscribe();
  }, [projectId]);

  const handleLike = () => {
    const likesRef = ref(db, `project_likes/${projectId}`);
    const likedProjects = JSON.parse(localStorage.getItem("liked_projects") || "[]");

    if (isLiked) {
        const updatedStorage = likedProjects.filter(id => id !== projectId);
        localStorage.setItem("liked_projects", JSON.stringify(updatedStorage));        
        runTransaction(likesRef, (currentLikes) => {
            return (currentLikes || 0) > 0 ? (currentLikes || 0) - 1 : 0;
        });

        setIsLiked(false);

    } else {
        likedProjects.push(projectId);
        localStorage.setItem("liked_projects", JSON.stringify(likedProjects));
        runTransaction(likesRef, (currentLikes) => {
            return (currentLikes || 0) + 1;
        });

        setIsLiked(true);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
    }
  };

  return (
    <div className="relative inline-block">
        <motion.button
            onClick={handleLike}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm ${
                isLiked 
                ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800" 
                : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 hover:border-red-300 hover:text-red-400"
            }`}
        >
            <motion.i 
                className={`${isLiked ? "fas" : "far"} fa-heart text-lg ${isLiked ? "text-red-500" : ""}`}
                animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            ></motion.i>
            <span className="font-bold text-sm">
                {likes > 0 ? likes : "Like"}
            </span>
        </motion.button>

        <AnimatePresence>
            {showHeart && (
                <motion.div
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -40, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 pointer-events-none"
                >
                    <i className="fas fa-heart text-2xl"></i>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default LikeButton;