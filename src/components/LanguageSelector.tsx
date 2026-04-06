import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' }
];

export default function LanguageSelector({ position = 'bottom' }: { position?: 'top' | 'bottom' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const currentLangName = LANGUAGES.find(l => l.code === i18n.language)?.name || 'English';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors text-text-primary border border-border-base"
        aria-label="Select Language"
      >
        <Globe size={18} />
        <span className="text-sm font-medium uppercase">{i18n.language}</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} w-48 max-h-96 overflow-y-auto bg-surface rounded-xl border border-border-base shadow-2xl z-50`}>
          <div className="p-2 flex flex-col gap-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  i18n.language === lang.code 
                    ? 'bg-brand-primary/20 text-brand-primary font-medium' 
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
