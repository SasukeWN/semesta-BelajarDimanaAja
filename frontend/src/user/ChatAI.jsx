import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const ChatAI = ({ konteksMateri }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Halo! Aku Semesta, AI asisten belajarmu. Ada materi yang bikin bingung? Tanya aja ke aku!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll ke bawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newQuery = input.trim();
    setInput('');
    
    setMessages((prev) => [...prev, { role: 'user', text: newQuery }]);
    setIsLoading(true);

    try {
      // Kecualikan sapaan pertama dari riwayat
      const riwayat = messages.slice(1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await axios.post('http://localhost:3000/api/ai/tanya', {
        pertanyaan: newQuery,
        konteks_materi: konteksMateri || '',
        riwayat: riwayat
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, { role: 'model', text: response.data.data }]);
      }
    } catch (error) {
      console.error('Error chat AI:', error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Maaf, lagi ada gangguan teknis. Coba lagi nanti ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parsing markdown simpel agar bold (**) dan line breaks tampil sedikit lebih rapi
  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      // ganti **text** dengan strong element
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block mb-1">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-lg hover:bg-blue-600 transition-transform z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle size={26} />
      </button>

      <div className={`fixed bottom-6 right-6 w-[340px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '550px', maxHeight: '80vh' }}>
        
        <div className="bg-primary text-white px-5 py-4 rounded-t-2xl flex justify-between items-center shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-bold leading-tight">BelajarDimanaAja.Ai</h3>
              <p className="text-xs text-blue-100">Asisten Belajarmu</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-full">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-[#f8fafc] flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[75%] p-3.5 text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-2xl rounded-tr-sm shadow-sm' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm'
              }`}>
                {formatText(msg.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-100 text-gray-500 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white rounded-b-2xl flex gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={konteksMateri ? "Tanya seputar materi ini..." : "Tanya apa saja..."}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
          >
            <Send size={18} className={input.trim() && !isLoading ? "ml-1" : ""} />
          </button>
        </form>

      </div>
    </>
  );
};

export default ChatAI;

