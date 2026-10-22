import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Stethoscope,
  Printer,
  FileCheck,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const DoctorConsultationPage = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  const questionsForDoctor = [
    {
      q: "Could my symptoms or screening variations be caused by reversible conditions?",
      context: "Thyroid disorders, severe vitamin B12 deficiency, normal pressure hydrocephalus, sleep apnea, or medication interactions can mimic dementia symptoms."
    },
    {
      q: "What diagnostic tests (MRI, PET, blood biomarker p-tau217) do you recommend?",
      context: "Modern high-resolution structural MRI and blood-based amyloid/tau biomarkers can distinguish between Alzheimer's, vascular changes, and typical aging."
    },
    {
      q: "Is a formal neuropsychological assessment indicated at this stage?",
      context: "A comprehensive 2-3 hour paper-and-pencil neuropsychological battery provides formal clinical standardization of memory, attention, and executive domains."
    },
    {
      q: "Are there disease-modifying therapies, clinical trials, or targeted medications appropriate for my profile?",
      context: "Recent anti-amyloid monoclonal antibodies (like lecanemab or donanemab) and acetylcholinesterase inhibitors are approved for early or mild stages."
    },
    {
      q: "What specific physical therapy, balance training, or speech exercises would you recommend?",
      context: "Early targeted motor rehabilitation and cognitive stimulation therapy show robust benefits in delaying disability."
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteData = async () => {
    if (!user) return;
    await api.deleteUserData(user.id);
    setDeletedSuccess(true);
    setTimeout(() => {
      logout();
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neuro-border pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
            Clinical Preparation Guide
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Neurologist Consultation Guidance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            How to prepare for a productive, structured conversation with a neurologist or primary care physician.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Question Guide</span>
        </button>
      </div>

      {/* 3 Step Preparation Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-neuro-border space-y-3">
          <div className="w-8 h-8 rounded-lg bg-neuro-teal/20 text-neuro-teal font-black text-sm flex items-center justify-center">
            01
          </div>
          <h3 className="font-bold text-base text-white">Gather Objective Records</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Download your NeuroSense PDF summary showing multi-domain screening trends. Bring a timeline of when memory or motor changes were first noticed.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-neuro-border space-y-3">
          <div className="w-8 h-8 rounded-lg bg-neuro-purple/20 text-neuro-purple-light font-black text-sm flex items-center justify-center">
            02
          </div>
          <h3 className="font-bold text-base text-white">Bring a Close Companion</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            A spouse, adult child, or trusted close friend can provide invaluable collateral history regarding everyday driving, budgeting, or mood observations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-neuro-border space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center">
            03
          </div>
          <h3 className="font-bold text-base text-white">List All Medications</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Include all prescription medications, over-the-counter sleep aids (anticholinergics like diphenhydramine), and herbal supplements that can cause cognitive fog.
          </p>
        </div>
      </div>

      {/* Printable Questions to Ask Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Questions to Bring to Your Neurologist
            </h2>
            <p className="text-xs text-slate-400">
              Doctors appreciate organized, structured questions. Feel free to print or bookmark these.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {questionsForDoctor.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-neuro-teal shrink-0 mt-0.5" />
                <h4 className="font-bold text-sm text-white">{item.q}</h4>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                <strong className="text-slate-300">Why this matters: </strong>{item.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Controls & Data Deletion (Item 10) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-neuro-teal" />
          <div>
            <h3 className="font-bold text-sm text-white">Privacy Controls & Right to Be Forgotten</h3>
            <p className="text-xs text-slate-400">
              NeuroSense adheres to strict data privacy principles. You can purge all your assessments and account data at any time.
            </p>
          </div>
        </div>

        {deletedSuccess ? (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            ✓ All screening records and user data permanently deleted from local storage and backend database.
          </div>
        ) : !deleteConfirmOpen ? (
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All My Screening Data</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 space-y-3">
            <p className="text-xs text-rose-200">
              Are you sure? This action will permanently remove all test history, profile details, and baseline scores. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteData}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                Yes, Permanently Delete Everything
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
