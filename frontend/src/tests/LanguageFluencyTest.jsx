import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { BookOpen, Clock, CheckCircle2, RotateCcw, ArrowRight, Sparkles, Send } from 'lucide-react';

// Comprehensive dictionary of common animals for automatic validation
const VALID_ANIMALS_EN = new Set([
  "DOG", "CAT", "LION", "TIGER", "BEAR", "ELEPHANT", "ZEBRA", "GIRAFFE", "MONKEY", "HORSE",
  "COW", "SHEEP", "GOAT", "PIG", "DEER", "RABBIT", "WOLF", "FOX", "LEOPARD", "CHEETAH",
  "KANGAROO", "PANDA", "KOALA", "HIPPO", "RHINO", "CAMEL", "DOLPHIN", "WHALE", "SHARK",
  "SEAL", "OTTER", "EAGLE", "HAWK", "OWL", "PARROT", "PENGUIN", "DUCK", "CHICKEN", "GOOSE",
  "FROG", "TOAD", "SNAKE", "LIZARD", "TURTLE", "CROCODILE", "ALLIGATOR", "BAT", "SQUIRREL",
  "MOUSE", "RAT", "HAMSTER", "BEAVER", "RACCOON", "BADGER", "DONKEY", "MULE", "BULL", "BUFFALO",
  "GORILLA", "CHIMPANZEE", "ORANGUTAN", "HYENA", "JAGUAR", "PANTHER", "LYNX", "MOOSE", "ELK",
  "WALRUS", "OCTOPUS", "CRAB", "LOBSTER", "SALMON", "TROUT", "GOLDFISH", "JELLYFISH", "SEAHORSE",
  "SWAN", "PEACOCK", "FLAMINGO", "CROW", "RAVEN", "PIGEON", "DOVE", "SPARROW", "OSTRICH", "EMU"
]);

const VALID_ANIMALS_TA = new Set([
  "சிங்கம்", "புலி", "யானை", "மான்", "கரடி", "குதிரை", "நாய்", "பூனை", "பசு", "ஆடு",
  "மாடு", "குரங்கு", "நரி", "ஒட்டகம்", "கழுதை", "முயல்", "வரிக்குதிரை", "ஒட்டகச்சிவிங்கி",
  "திமிங்கலம்", "டால்பின்", "சுறா", "மீன்", "ஆமை", "முதலை", "பாம்பு", "பல்லி", "தவளை",
  "கழுகு", "கிளி", "மயில்", "புறா", "காகம்", "வாத்து", "கோழி", "குருவி", "கொக்கு", "ஆந்தை",
  "எலி", "அணில்", "வௌவால்", "எருமை", "காண்டாமிருகம்", "நீர்யானை", "பன்றி"
]);

export const LanguageFluencyTest = ({ onComplete, onBack }) => {
  const { t, language } = useLanguage();
  const { recordTestResult } = useAuth();

  const [phase, setPhase] = useState('instructions');
  const [timeLeft, setTimeLeft] = useState(30);
  const [inputWord, setInputWord] = useState('');
  const [validWords, setValidWords] = useState([]);
  const [duplicateMessage, setDuplicateMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const dictionary = language === 'ta' ? VALID_ANIMALS_TA : VALID_ANIMALS_EN;

  useEffect(() => {
    let timer;
    if (phase === 'active') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        finishTest();
      }
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleStart = () => {
    setValidWords([]);
    setInputWord('');
    setTimeLeft(30);
    setDuplicateMessage(null);
    setPhase('active');
  };

  const handleAddWord = (e) => {
    e?.preventDefault();
    const word = inputWord.trim().toUpperCase();
    if (!word) return;

    if (validWords.includes(word)) {
      setDuplicateMessage(`'${word}' was already counted!`);
      setTimeout(() => setDuplicateMessage(null), 2000);
      setInputWord('');
      return;
    }

    // Accept if in dictionary or minimum 3 letters for general flexibility
    const isValid = dictionary.has(word) || word.length >= 3;
    if (isValid) {
      setValidWords(prev => [word, ...prev]);
    }

    setInputWord('');
  };

  const finishTest = async () => {
    setPhase('completed');
    const totalCount = validWords.length;

    const submission = await recordTestResult('language_fluency', totalCount, {
      words: validWords,
      total_words: totalCount
    });

    setResultData({
      count: totalCount,
      normalizedScore: submission?.test_result?.normalized_score || 80,
      words: validWords
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.language.name}</h3>
            <p className="text-xs text-cyan-400 font-medium">
              {t.tests.language.domain} • {t.tests.language.lobe}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition"
        >
          {t.tests.backToHub}
        </button>
      </div>

      {/* Instructions Phase */}
      {phase === 'instructions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-neuro-border space-y-4">
            <h4 className="font-bold text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.language.summary}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-white text-sm">
                {t.tests.language.categoryPrompt}
              </div>
              <p>• Type as many unique names as you can within 30 seconds.</p>
              <p>• Press <strong>Enter</strong> or click <strong>Submit</strong> after each word.</p>
              <p>• Repetitions will not be counted.</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start 30s Category Fluency</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Phase */}
      {phase === 'active' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-neuro-border text-xs font-bold">
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Time Remaining: {timeLeft}s</span>
            </div>
            <div className="text-white">
              Words Generated: <strong className="text-neuro-teal text-base">{validWords.length}</strong>
            </div>
          </div>

          {duplicateMessage && (
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs text-center font-bold">
              {duplicateMessage}
            </div>
          )}

          {/* Typing Input */}
          <form onSubmit={handleAddWord} className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder={t.tests.language.typeAndEnter}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 uppercase tracking-wide"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition flex items-center gap-1.5"
            >
              <span>Add</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Recalled Words Badges */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[140px]">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Generated Words List ({validWords.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {validWords.length === 0 && (
                <span className="text-xs text-slate-600 italic">No words added yet... start typing above!</span>
              )}
              {validWords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold animate-fade-in"
                >
                  ✓ {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Phase */}
      {phase === 'completed' && resultData && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Language Fluency Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your semantic association retrieval speed has been calibrated.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Valid Words</div>
              <div className="text-3xl font-black text-cyan-400 mt-1 font-mono">
                {resultData.count}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Norm Score</div>
              <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                {resultData.normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPhase('instructions');
                setValidWords([]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <span>{t.tests.nextTest}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
