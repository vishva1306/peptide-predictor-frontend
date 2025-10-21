import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { Globe } from 'lucide-react';

export default function Header() {
  const { language, t, toggleLanguage } = useTranslation();

  return (
    <div className="mb-8 relative">
      {/* Toggle langue en haut à droite */}
      <button
        onClick={toggleLanguage}
        className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition shadow-lg"
        aria-label="Toggle language"
      >
        <Globe size={18} />
        <span className="font-semibold text-sm">
          {language === 'en' ? 'FR' : 'EN'}
        </span>
      </button>

      <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
      <p className="text-slate-400">{t('subtitle')}</p>
    </div>
  );
}
