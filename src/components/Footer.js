import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 pt-8 border-t border-slate-700">
      <div className="flex flex-col items-center gap-4">
        {/* Logo Stanford Medicine */}
        <a
          href="https://www.svenssonlabstanford.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
        >
          <div className="bg-white rounded-lg p-2 inline-block">
            <img
              src="/stanford-logo.svg"
              alt="Stanford Medicine"
              className="h-10 w-auto"
            />
          </div>
        </a>

        {/* Crédits */}
        <div className="text-center text-slate-400 text-sm space-y-1">
          <p className="font-semibold">
            {t('footerDeveloped')}
          </p>
          <a
            href="https://www.svenssonlabstanford.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1"
          >
            {t('footerLabLink')}
          </a>
        </div>

        {/* Référence papier */}
        <p className="text-slate-500 text-xs text-center px-4">
          {t('reference')}
        </p>
      </div>
    </footer>
  );
}