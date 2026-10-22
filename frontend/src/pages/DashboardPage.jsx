import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from 'recharts';
import {
  Brain,
  TrendingUp,
  Activity,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';

export const DashboardPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  const { user, completedTests } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const res = await api.getAnalytics(user?.id || 1);
      setAnalytics(res);
      setLoading(false);
    };
    fetchAnalytics();
  }, [user, completedTests]);

  const defaultRadar = [
    { domain: 'Memory', score: 80, baseline: 75 },
    { domain: 'Executive', score: 85, baseline: 75 },
    { domain: 'Attention', score: 82, baseline: 75 },
    { domain: 'Processing Speed', score: 88, baseline: 75 },
    { domain: 'Motor Control', score: 78, baseline: 75 },
    { domain: 'Language', score: 82, baseline: 75 }
  ];

  const radarData = analytics?.radar_data || defaultRadar;
  const historyTrend = analytics?.history_trend || [
    { date: 'Oct 01', score: 74.0, is_simulated: true },
    { date: 'Oct 12', score: 78.5, is_simulated: true },
    { date: 'Oct 22', score: 82.5, is_simulated: false }
  ];

  const overallScore = analytics?.latest_score || 82.5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Top Profile Summary Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neuro-navy via-neuro-deep to-neuro-card border border-neuro-border shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-neuro-teal to-neuro-purple p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <User className="w-7 h-7 text-neuro-teal" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {user ? user.username : 'Guest Explorer'}
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30">
                  {user?.is_guest ? 'Guest Session' : 'Active Account'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Age: 58 • Sleep: ~6.5 hrs • Lifestyle: Moderate Aerobic • Baseline Status: Calibrated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('tests')}
              className="px-5 py-2.5 rounded-xl bg-neuro-teal hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Assessment</span>
            </button>

            <button
              onClick={() => setActivePage('report')}
              className="px-5 py-2.5 rounded-xl bg-neuro-purple hover:bg-violet-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Full AI Report</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Composite Vitality
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neuro-teal mt-1">
              {overallScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              Healthy Baseline Range
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Screenings
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {analytics?.total_assessments || 3}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Recorded in history
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Top Domain
            </div>
            <div className="text-lg sm:text-xl font-bold text-neuro-purple-light mt-1 truncate">
              Processing Speed
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Reaction time: 290 ms
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Battery
            </div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">
              {Object.keys(completedTests).length} / 8
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Completed today
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Radar Chart: 6 Cognitive Domains */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-neuro-teal" />
                Multi-Domain Cognitive Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current performance vs standard population baseline (75)
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/30">
              6 Domains
            </span>
          </div>

          <div className="w-full h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="domain" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                <Radar name="Baseline" dataKey="baseline" stroke="#64748B" fill="#64748B" fillOpacity={0.2} />
                <Radar name="Your Score" dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.5} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E2F5D', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-neuro-teal"></span>
              <span>Your Current Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-500"></span>
              <span>Standard Baseline (75)</span>
            </div>
          </div>
        </div>

        {/* Longitudinal Trend Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neuro-purple-light" />
                Longitudinal Screening Trends
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Weekly & monthly performance trajectory over time
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              +4.5% Stability
            </span>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyTrend} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#1E2F5D', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Historical points labeled with * are calibrated demonstration records.</span>
            <button
              onClick={() => setActivePage('report')}
              className="text-neuro-teal font-bold hover:underline"
            >
              View Full PDF Report ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
