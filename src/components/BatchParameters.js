import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function BatchParameters({ params, setParams }) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">{t('parametersTitle')}</h3>

      <div className="space-y-4">
        {/* Minimum Cleavage Sites */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            {t('minCleavageSites')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={params.minCleavageSites}
              onChange={(e) => setParams({
                ...params,
                minCleavageSites: parseInt(e.target.value) || 1
              })}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 text-sm w-8 invisible">{t('signalPeptideLengthUnit')}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('minCleavageSitesDesc')}</p>
        </div>

        {/* Minimum Spacing */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            {t('minCleavageSpacing')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={params.minCleavageSpacing}
              onChange={(e) => setParams({
                ...params,
                minCleavageSpacing: parseInt(e.target.value) || 1
              })}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 text-sm w-8">{t('minCleavageSpacingUnit')}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('minCleavageSpacingDesc')}</p>
        </div>

        {/* Maximum Peptide Length */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            {t('maxPeptideLength')}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={params.maxPeptideLength}
              onChange={(e) => setParams({
                ...params,
                maxPeptideLength: parseInt(e.target.value) || 100
              })}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400 text-sm w-8">{t('maxPeptideLengthUnit')}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('maxPeptideLengthDesc')}</p>
        </div>
      </div>
    </div>
  );
}