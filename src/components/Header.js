import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { Globe, ExternalLink } from 'lucide-react';

export default function Header() {
  const { language, t, toggleLanguage } = useTranslation();

  return (
    <div className="mb-8 relative">
      {/* Toggle langue en haut à droite */}
      <button
        onClick={toggleLanguage}
        className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition shadow-lg z-10"
        aria-label="Toggle language"
      >
        <Globe size={18} />
        <span className="font-semibold text-sm">
          {language === 'en' ? 'FR' : 'EN'}
        </span>
      </button>

      {/* Header principal avec logo Stanford */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-4 pr-20 md:pr-0">
        {/* Logo Stanford Medicine */}
        <a
          href="https://www.svenssonlabstanford.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 hover:opacity-80 transition"
        >
          <div className="bg-white rounded-lg p-2 inline-block">
            <img
              src="/stanford-logo.svg"
              alt="Stanford Medicine"
              className="h-10 md:h-12 w-auto"
            />
          </div>
        </a>

        {/* Titre principal */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">
            {t('title')}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm">{t('subtitle')}</p>
        </div>
      </div>

      {/* Lien Lab Website */}
      <div className="flex items-center gap-2 text-sm">
        <a
          href="https://www.svenssonlabstanford.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-xs md:text-sm"
        >
          <ExternalLink size={14} />
          <span>{t('labWebsite')}</span>
        </a>
      </div>
    </div>
  );
}