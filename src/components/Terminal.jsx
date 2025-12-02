import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'info', text: 'Welcome to Rafie Terminal v1.0.0' },
    { type: 'info', text: 'Type "help" to see available commands.' },
  ]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = (cmd) => {
    const lowerCmd = cmd.toLowerCase().trim();
    let response = '';

    switch (lowerCmd) {
      case 'help':
        response = 'Available commands: about, skills, projects, contact, clear, exit';
        break;
      case 'about':
        response = 'Rafie Rojagat | Informatics Student @ UPNVJ. Passionate Software Engineer specializing in Mobile & Web Dev.';
        break;
      case 'skills':
        response = 'Tech Stack: Kotlin, JavaScript, React, Flutter, Python, MySQL, Firebase.';
        break;
      case 'projects':
        response = 'Check out my featured projects: Planetku, CinemaZone, Computer Crafter.';
        break;
      case 'contact':
        response = 'Email: rojagatrafie@gmail.com | LinkedIn: linkedin.com/in/rafie-rojagat';
        break;
      case 'clear':
        setOutput([]);
        return;
      case 'exit':
        setIsOpen(false);
        response = 'Closing terminal...';
        break;
      case '':
        response = '';
        break;
      default:
        response = `Command not found: ${cmd}. Type "help" for assistance.`;
    }

    if (response) {
      setOutput((prev) => [
        ...prev, 
        { type: 'command', text: `> ${cmd}` },
        { type: 'response', text: response }
      ]);
    } else if (cmd) {
       setOutput((prev) => [...prev, { type: 'command', text: `> ${cmd}` }]); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    handleCommand(input);
    setInput('');
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 left-8 z-50 p-4 rounded-full bg-dark text-green-400 shadow-lg border border-green-500/30 hover:bg-gray-900 hover:scale-110 transition-all ${isOpen ? 'hidden' : 'flex'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ rotate: 15 }}
        title="Open Developer Terminal"
      >
        <i className="fas fa-terminal text-xl"></i>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-gray-700 font-mono text-sm md:text-base"
            >
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex space-x-2">
                  <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"></button>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-400 text-xs">user@rafie-portfolio:~</div>
                <div className="w-10"></div>
              </div>

              <div 
                className="p-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                onClick={() => inputRef.current?.focus()}
              >
                {output.map((line, index) => (
                  <div key={index} className={`${line.type === 'command' ? 'text-gray-400 mt-2' : 'text-green-400 mb-1'}`}>
                    {line.text}
                  </div>
                ))}

                <form onSubmit={handleSubmit} className="flex items-center mt-2">
                  <span className="text-blue-400 mr-2">➜</span>
                  <span className="text-pink-400 mr-2">~</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-200 caret-white"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                  />
                </form>
                <div ref={bottomRef}></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Terminal;