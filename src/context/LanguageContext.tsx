import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, TranslationDictionary } from '../i18n/types';
import { en } from '../i18n/locales/en';
import { mr } from '../i18n/locales/mr';
import { hi } from '../i18n/locales/hi';

const STORAGE_KEY = 'krishimitra_language';

const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  mr,
  hi,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  languages: typeof SUPPORTED_LANGUAGES;
  isMarathi: boolean;
  isHindi: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language;
      if (stored && ['en', 'mr', 'hi'].includes(stored)) {
        return stored;
      }
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    return 'mr'; // Default to Marathi for Maharashtra agricultural context
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    
    // Attempt lookup in current language
    let currentDict: any = dictionaries[language];
    let found = true;
    for (const k of keys) {
      if (currentDict && typeof currentDict === 'object' && k in currentDict) {
        currentDict = currentDict[k];
      } else {
        found = false;
        break;
      }
    }

    // Fallback to English if not found
    if (!found || typeof currentDict !== 'string') {
      let fallbackDict: any = dictionaries.en;
      found = true;
      for (const k of keys) {
        if (fallbackDict && typeof fallbackDict === 'object' && k in fallbackDict) {
          fallbackDict = fallbackDict[k];
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof fallbackDict === 'string') {
        currentDict = fallbackDict;
      } else {
        // Return keyPath if entirely missing
        return keyPath;
      }
    }

    let text: string = currentDict;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        isMarathi: language === 'mr',
        isHindi: language === 'hi',
        isEnglish: language === 'en',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

