import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('neurosense_font_size') || 'normal';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('neurosense_high_contrast') === 'true';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('neurosense_font_size', fontSize);
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('neurosense_high_contrast', highContrast);
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const cycleFontSize = () => {
    const sizes = ['normal', 'medium', 'large', 'xlarge'];
    const nextIdx = (sizes.indexOf(fontSize) + 1) % sizes.length;
    setFontSize(sizes[nextIdx]);
  };

  const speakText = (text, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!text) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // comfortable pace for elderly users
    utterance.pitch = 1.0;
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        cycleFontSize,
        highContrast,
        toggleHighContrast,
        speakText,
        stopSpeaking,
        isSpeaking
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
