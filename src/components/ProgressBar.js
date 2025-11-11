import React from 'react';
import { Loader } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function ProgressBar({ current, total, currentProtein }) {
  const { t } = useTranslation();
  
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <Loader className="animate-spin text-blue-400" size={24} />
        <div>
          <p className="text-white font-semibold">
            {t('analyzingProteins')}
          </p>
          <p className="text-slate-400 text-sm">
            {t('analyzingProtein')} {current}/{total}
            {currentProtein && ` - ${currentProtein}`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="text-right text-slate-400 text-sm mt-2">
        {Math.round(percentage)}%
      </p>
    </div>
  );
}