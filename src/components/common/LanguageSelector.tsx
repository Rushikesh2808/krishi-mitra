import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'compact' | 'pills' | 'cards';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = languages.find((l) => l.code === language) || languages[1];

  // 1. Pills Variant (Segmented Control for Settings or Sidebar)
  if (variant === 'pills') {
    return (
      <div className={`inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-bold ${className}`}>
        {languages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                isSelected
                  ? 'bg-white text-agri-900 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className="text-[10px] text-slate-400 uppercase">({lang.code})</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Cards Variant (Detailed selection for Profile and Settings)
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {languages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-agri-50/70 border-agri-600 text-agri-950 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-base font-bold block">{lang.nativeName}</span>
                <span className="text-xs text-slate-500 block">{lang.name}</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-agri-700 text-white' : 'border border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. Compact Header Dropdown Variant (Default)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-agri-700/60 hover:bg-agri-700 text-white text-xs font-bold border border-agri-600/50 transition-colors shadow-xs cursor-pointer"
        title="Change Language / भाषा बदला"
      >
        <Globe className="w-4 h-4 text-emerald-300" />
        <span className="tracking-wide">{activeOption.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-agri-200" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            Select Language / भाषा
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setDropdownOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-agri-50 text-agri-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col">
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-agri-700 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

