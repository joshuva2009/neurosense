import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, AlertCircle, PhoneCall, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export const EmergencyModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border-2 border-rose-500/80 p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-rose-400">
              {t.emergency.modalTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.emergency.modalSubtitle}
            </p>
          </div>
        </div>

        {/* Emergency Call Action Button */}
        <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-center shadow-lg shadow-rose-900/40">
          <div className="flex items-center justify-center gap-2 text-lg sm:text-xl font-black uppercase tracking-wide">
            <PhoneCall className="w-6 h-6 animate-bounce" />
            <span>{t.emergency.callNow}</span>
          </div>
          <p className="text-xs text-rose-100 mt-1">
            Emergency Numbers: 911 (US/Canada) • 108 / 112 (India) • 999 (UK) • 000 (Australia)
          </p>
        </div>

        {/* F.A.S.T Protocol Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-black text-lg flex items-center justify-center shrink-0">
              F
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-300">Face Drooping</h4>
              <p className="text-xs text-slate-300 mt-0.5">{t.emergency.f}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-black text-lg flex items-center justify-center shrink-0">
              A
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-300">Arm Weakness</h4>
              <p className="text-xs text-slate-300 mt-0.5">{t.emergency.a}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-black text-lg flex items-center justify-center shrink-0">
              S
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-300">Speech Difficulty</h4>
              <p className="text-xs text-slate-300 mt-0.5">{t.emergency.s}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-rose-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-black text-lg flex items-center justify-center shrink-0">
              T
            </div>
            <div>
              <h4 className="font-bold text-sm text-rose-300">Time to Call</h4>
              <p className="text-xs text-slate-300 mt-0.5">{t.emergency.t}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition"
        >
          Close Emergency Guide
        </button>
      </div>
    </div>
  );
};
