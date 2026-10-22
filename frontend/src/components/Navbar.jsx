import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Moon,
  Sun,
  Globe,
  Type,
  Eye,
  Volume2,
  VolumeX,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, onOpenEmergency, onOpenDesignThinking }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { fontSize, cycleFontSize, highContrast, toggleHighContrast, isSpeaking, stopSpeaking } = useAccessibility();
  const { user, loginGuest, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [a11yMenuOpen, setA11yMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'tests', label: t.nav.assessmentHub },
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'report', label: t.nav.analytics },
    { id: 'disorders', label: t.nav.disorders },
    { id: 'lifestyle', label: t.nav.lifestyle },
    { id: 'doctor', label: t.nav.doctorPrep },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/90 dark:bg-neuro-dark/95 border-b border-neuro-border/60 transition-colors">
      {/* Top University & Emergency Quick Strip */}
      <div className="bg-gradient-to-r from-neuro-navy via-neuro-deep to-neuro-card px-4 py-1.5 border-b border-neuro-border/40 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onOpenDesignThinking}
            className="flex items-center gap-1.5 text-neuro-purple-light hover:text-white transition font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-neuro-teal" />
            <span>{t.universityProjectTag}</span>
          </button>

          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold transition"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.emergency.bannerText}</span>
            <span className="underline ml-1">{t.emergency.actNow}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neuro-teal via-neuro-purple to-indigo-500 p-0.5 shadow-lg shadow-neuro-teal/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-neuro-teal animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-neuro-teal bg-clip-text text-transparent">
                  NeuroSense
                </span>
                <span className="hidden md:inline px-1.5 py-0.5 text-[10px] font-bold rounded bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/30">
                  AI
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 -mt-0.5 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'text-neuro-teal bg-neuro-teal/10 border border-neuro-teal/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-neuro-border text-xs font-bold text-slate-200 flex items-center gap-1.5 transition"
              title="Change Language / மொழியை மாற்று"
            >
              <Globe className="w-3.5 h-3.5 text-neuro-teal" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Accessibility Quick Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setA11yMenuOpen(!a11yMenuOpen)}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center transition ${
                  a11yMenuOpen
                    ? 'bg-neuro-purple/20 text-neuro-purple-light border-neuro-purple/50'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-neuro-border text-slate-300'
                }`}
                title="Accessibility Options"
              >
                <Type className="w-4 h-4" />
              </button>

              {/* A11y Popup Dropdown */}
              {a11yMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-neuro-border p-3 shadow-2xl z-50 text-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1.5">
                    {t.a11y.title}
                  </div>
                  
                  {/* Text Size */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                    <span className="text-xs font-medium">{t.a11y.textSize}</span>
                    <button
                      onClick={cycleFontSize}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-neuro-teal border border-slate-700"
                    >
                      {fontSize.toUpperCase()}
                    </button>
                  </div>

                  {/* Contrast */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                    <span className="text-xs font-medium">{t.a11y.contrast}</span>
                    <button
                      onClick={toggleHighContrast}
                      className={`px-2 py-1 rounded text-xs font-bold border transition ${
                        highContrast
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Speech Audio Active */}
                  {isSpeaking && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-neuro-teal font-medium flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        Speaking...
                      </span>
                      <button
                        onClick={stopSpeaking}
                        className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/40"
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-neuro-border text-slate-300 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neuro-purple-light" />
              )}
            </button>

            {/* User Session / Guest Login Button */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-neuro-purple/20 hover:bg-neuro-purple/30 border border-neuro-purple/40 text-xs font-bold text-neuro-purple-light flex items-center gap-1.5 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{user.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                  title={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginGuest}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-neuro-teal to-cyan-500 hover:from-cyan-400 hover:to-neuro-teal text-black text-xs font-bold shadow-md shadow-neuro-teal/20 transition-all hover:scale-105 active:scale-95"
              >
                {t.nav.guestMode}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neuro-dark/95 border-b border-neuro-border px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                activePage === item.id
                  ? 'text-neuro-teal bg-neuro-teal/10 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
