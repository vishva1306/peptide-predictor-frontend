import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 pt-8 border-t border-slate-700">
      <div className="flex flex-col items-center gap-4">
        {/* Logo Stanford Medicine */}
        <div className="bg-white rounded-lg p-2 inline-block">
          <img
            src="/stanford-logo.svg"
            alt="Stanford Medicine"
            className="h-10 w-auto"
          />
        </div>

        {/* Badge Builder */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg text-xs font-medium">
          Developed by Valentin Vishva Venkatesan
        </span>

        {/* Référence papier */}
        <p className="text-slate-500 text-xs text-center px-4">
          {t('reference')}
        </p>
      </div>
    </footer>
  );
}