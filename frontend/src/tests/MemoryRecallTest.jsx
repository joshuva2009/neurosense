import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Brain, Clock, CheckCircle2, ArrowRight, RotateCcw, Volume2, ShieldCheck, Sparkles } from 'lucide-react';

const MEMORY_WORDS_EN = ["APPLE", "RIVER", "COMPASS", "GUITAR", "LANTERN", "OCEAN", "CASTLE", "BREEZE"];
const DISTRACTORS_EN = ["FOREST", "MIRROR", "MOUNTAIN", "HARBOR", "BRIDGE", "CANDLE", "CLOCK", "GARDEN"];

const MEMORY_WORDS_TA = ["ஆப்பிள்", "நதி", "திசைகாட்டி", "வீணை", "விளக்கு", "கடல்", "கோட்டை", "தென்றல்"];
const DISTRACTORS_TA = ["காடு", "கண்ணாடி", "மலை", "துறைமுகம்", "பாலம்", "மெழுகுவர்த்தி", "கடிகாரம்", "தோட்டம்"];

export const MemoryRecallTest = ({ onComplete, onBack }) => {
  const { t, language } = useLanguage();
  const { speakText } = useAccessibility();
  const { recordTestResult } = useAuth();

  // Phases: 'instructions' -> 'memorize' -> 'delay' -> 'recall' -> 'result'
  const [phase, setPhase] = useState('instructions');
  const [timeLeft, setTimeLeft] = useState(8);
  const [inputWord, setInputWord] = useState('');
  const [recalledWords, setRecalledWords] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [resultData, setResultData] = useState(null);

  const targetWords = language === 'ta' ? MEMORY_WORDS_TA : MEMORY_WORDS_EN;
  const distractors = language === 'ta' ? DISTRACTORS_TA : DISTRACTORS_EN;

  // Combine words and shuffle for recognition phase
  const [shuffledChoices, setShuffledChoices] = useState([]);

  useEffect(() => {
    const combined = [...targetWords, ...distractors].sort(() => 0.5 - Math.random());
    setShuffledChoices(combined);
  }, [language]);

  // Timer effect for phases
  useEffect(() => {
    let timer;
    if (phase === 'memorize') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        setPhase('delay');
        setTimeLeft(5);
      }
    } else if (phase === 'delay') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        setPhase('recall');
        setStartTime(Date.now());
      }
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleStart = () => {
    setPhase('memorize');
    setTimeLeft(8);
    setRecalledWords([]);
    setSelectedChoices([]);
    speakText(
      language === 'ta'
        ? "திரையில் தோன்றும் சொற்களை நினைவில் நிறுத்துங்கள்."
        : "Observe and memorize the words presented on the screen.",
      language
    );
  };

  const handleAddWord = (e) => {
    e?.preventDefault();
    const word = inputWord.trim().toUpperCase();
    if (!word) return;
    if (!recalledWords.includes(word)) {
      setRecalledWords([...recalledWords, word]);
    }
    setInputWord('');
  };

  const toggleChoice = (word) => {
    if (selectedChoices.includes(word)) {
      setSelectedChoices(selectedChoices.filter(w => w !== word));
    } else {
      setSelectedChoices([...selectedChoices, word]);
    }
  };

  const handleSubmit = async () => {
    // Total correct from typed words + selected recognition chips
    const allUserAnswers = Array.from(new Set([...recalledWords, ...selectedChoices]));
    let correctCount = 0;
    allUserAnswers.forEach(ans => {
      if (targetWords.includes(ans)) {
        correctCount++;
      }
    });

    const elapsedSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 15;
    const rawScore = correctCount; // 0 to 8
    const accuracy = Math.round((correctCount / targetWords.length) * 100);

    const submission = await recordTestResult('memory_recall', rawScore, {
      total_items: targetWords.length,
      accuracy,
      elapsedSeconds
    });

    setResultData({
      correctCount,
      total: targetWords.length,
      accuracy,
      normalizedScore: submission?.test_result?.normalized_score || accuracy,
      elapsedSeconds
    });

    setPhase('result');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.memory.name}</h3>
            <p className="text-xs text-neuro-teal font-medium">
              {t.tests.memory.domain} • {t.tests.memory.lobe}
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

      {/* 1. Instructions Phase */}
      {phase === 'instructions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-neuro-border space-y-3">
            <h4 className="font-bold text-sm text-neuro-teal uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neuro-teal/20 text-neuro-teal text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>{t.tests.memory.step1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neuro-teal/20 text-neuro-teal text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>{t.tests.memory.step2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-neuro-teal/20 text-neuro-teal text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>{t.tests.memory.step3}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 text-black font-extrabold text-base shadow-lg shadow-neuro-teal/25 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>{t.tests.startTest}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 2. Memorization Phase */}
      {phase === 'memorize' && (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-neuro-teal">
            <Clock className="w-4 h-4 animate-spin" />
            <span>{t.tests.timeRemaining}: {timeLeft}s</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-neuro-teal h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 8) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
            {targetWords.map((word, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-neuro-teal/40 shadow-lg text-base sm:text-lg font-black text-white tracking-wider flex items-center justify-center animate-fade-in"
              >
                {word}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Memorize as many words as you can. They will vanish shortly!
          </p>
        </div>
      )}

      {/* 3. Delay Phase */}
      {phase === 'delay' && (
        <div className="py-12 space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-neuro-purple/20 text-neuro-purple-light flex items-center justify-center border border-neuro-purple/40 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white">Retention Delay Interval</h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Take a slow, deep breath. Holding words in working memory before retrieval tests hippocampal consolidation.
          </p>
          <div className="text-2xl font-black text-neuro-teal font-mono">
            {timeLeft}s
          </div>
        </div>
      )}

      {/* 4. Recall Phase */}
      {phase === 'recall' && (
        <div className="space-y-6">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-neuro-border text-xs text-slate-300">
            <strong>Active Recall:</strong> Type words you remember, or tap words from the recognition grid below.
          </div>

          {/* Typing Input */}
          <form onSubmit={handleAddWord} className="flex gap-2">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Type a remembered word..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neuro-teal uppercase tracking-wide"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-neuro-teal text-black font-bold text-sm hover:bg-cyan-400 transition"
            >
              Add
            </button>
          </form>

          {/* User Typed Words Chips */}
          {recalledWords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recalledWords.map((w, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30 text-xs font-bold"
                >
                  {w}
                </span>
              ))}
            </div>
          )}

          {/* Recognition Grid */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Recognition Selection (Tap to select):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {shuffledChoices.map((word, idx) => {
                const isSelected = selectedChoices.includes(word);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleChoice(word)}
                    className={`p-3 rounded-xl text-xs sm:text-sm font-bold border transition text-center ${
                      isSelected
                        ? 'bg-neuro-purple/30 text-white border-neuro-purple shadow-md shadow-neuro-purple/20'
                        : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 text-black font-extrabold text-base shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.tests.submitResults}
          </button>
        </div>
      )}

      {/* 5. Result Phase */}
      {phase === 'result' && resultData && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Memory Recall Completed!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your memory retrieval score has been computed and recorded in your screening session.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Recalled</div>
              <div className="text-2xl font-black text-neuro-teal mt-1">
                {resultData.correctCount} / {resultData.total}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Accuracy</div>
              <div className="text-2xl font-black text-neuro-purple-light mt-1">
                {resultData.accuracy}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Norm Score</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {resultData.normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPhase('instructions');
                setRecalledWords([]);
                setSelectedChoices([]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neuro-teal hover:bg-cyan-400 text-black font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-neuro-teal/20"
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
