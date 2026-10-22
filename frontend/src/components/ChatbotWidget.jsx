import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

export const ChatbotWidget = () => {
  const { t, language } = useLanguage();
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: language === 'ta'
        ? "வணக்கம்! நான் NeuroSense AI நரம்பியல் ஆரோக்கிய உதவியாளர். நீங்கள் மூளை நலன், அல்சைமர், பார்கின்சன் அல்லது உங்கள் பரிசோதனை முடிவுகள் பற்றி என்னிடம் கேட்கலாம்."
        : "Hello! I am NeuroSense AI, your cognitive health companion. How can I assist you with brain health, screening tests, or neurological awareness today?",
      is_emergency: false
    }
  ]);

  const messagesEndRef = useRef(null);

  const suggestedQueries = language === 'ta' ? [
    "அல்சைமர் நோயின் அறிகுறிகள் என்ன?",
    "பக்கவாத F.A.S.T. சோதனை என்றால் என்ன?",
    "எனது பரிசோதனை மதிப்பெண்ணை விளக்குங்கள்",
    "மூளை ஆரோக்கியத்திற்கான சிறந்த தூக்கம் மற்றும் உணவு"
  ] : [
    "What are early signs of Alzheimer's?",
    "Explain the F.A.S.T. stroke test",
    "How does the Finger Tapping test work?",
    "Best sleep & lifestyle habits for brain health"
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend, language, {
        userId: user?.id,
        username: user?.username
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.message || "Thank you. Remember that regular lifestyle care and timely medical consultation are vital for brain health.",
        is_emergency: res.is_emergency || false
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I am having trouble connecting right now. Please try again or explore our Educational Guides.",
          is_emergency: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-neuro-teal via-cyan-500 to-neuro-purple text-black shadow-xl shadow-neuro-teal/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
          title="Open NeuroSense AI Health Assistant"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-neuro-purple-light rounded-full border-2 border-slate-900 animate-ping"></div>
          <Bot className="w-7 h-7 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Open Chat</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[550px] max-h-[85vh] rounded-2xl bg-slate-900 border border-neuro-border shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-scale-up">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-neuro-navy via-neuro-deep to-neuro-card border-b border-neuro-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neuro-teal/20 text-neuro-teal flex items-center justify-center border border-neuro-teal/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  NeuroBot
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neuro-teal/20 text-neuro-teal">
                    AI Assistant
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {t.chat.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/60">
            {messages.map(m => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      isUser
                        ? 'bg-neuro-purple/30 text-neuro-purple-light border border-neuro-purple/40'
                        : 'bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-neuro-purple to-indigo-600 text-white rounded-tr-none'
                        : m.is_emergency
                        ? 'bg-rose-950/80 border-2 border-rose-500 text-rose-100 rounded-tl-none'
                        : 'bg-slate-800/90 border border-neuro-border text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {m.text}
                    </div>

                    {!isUser && (
                      <div className="mt-2 pt-1 border-t border-slate-700/60 flex items-center justify-end">
                        <button
                          onClick={() => {
                            if (isSpeaking) {
                              stopSpeaking();
                            } else {
                              speakText(m.text, language);
                            }
                          }}
                          className="text-[11px] text-neuro-teal hover:text-cyan-300 flex items-center gap-1 transition"
                          title="Read Aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-neuro-teal">
                <Bot className="w-4 h-4 animate-spin" />
                <span>NeuroBot is analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Suggestion Pills */}
          <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-thin">
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 hover:text-neuro-teal transition whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-neuro-border flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neuro-teal"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 hover:from-cyan-400 hover:to-neuro-teal text-black disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Educational Disclaimer Footer */}
          <div className="px-3 py-1 bg-slate-950 text-[10px] text-slate-500 text-center border-t border-slate-900">
            {t.chat.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
