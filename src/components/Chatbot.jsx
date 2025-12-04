import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hi! I'm Rafie's AI Assistant. Ask me anything about his projects or skills! 👋" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = messages.slice(-10).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await fetch("/.netlify/functions/gemini", {
        method: "POST",
        body: JSON.stringify({ 
            message: input, 
            history: historyForApi 
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        throw new Error("No reply");
      }

    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: "Sorry, I'm having trouble connecting right now. 😓" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-primary/50 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <i className="fas fa-times text-xl"></i> : <i className="fas fa-robot text-xl"></i>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-[350px] bg-white dark:bg-darkLight rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-primary p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h3 className="font-bold text-white">Rafie AI</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-dark">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700"
                    }`}
                  >
                    {msg.text.replace(/\*\*/g, '').replace(/\*/g, '')}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-700 flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-darkLight border-t border-gray-100 dark:border-slate-700 flex gap-2">
              <input
                type="text"
                placeholder="Ask about Rafie..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-slate-800 text-dark dark:text-white rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;