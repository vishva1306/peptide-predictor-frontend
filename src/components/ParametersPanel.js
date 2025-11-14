import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function ParametersPanel({ 
  mode, 
  setMode, 
  params, 
  setParams,
  signalPeptideLength = null,
  readonly = false,
  isFasta = false
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-white font-semibold mb-4">{t('parametersTitle')}</h3>

      <div className="space-y-4 mb-6">
        {/* Signal Peptide Length */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            {t('signalPeptideLength')}
            {signalPeptideLength && !isFasta && (
              <span className="text-blue-400 text-xs ml-2">
                ({signalPeptideLength} aa Recommended from UniProt)
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={params.signalPeptideLength}
              onChange={(e) => setParams({
                ...params,
                signalPeptideLength: parseInt(e.target.value) || 0
              })}
              disabled={readonly}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <span className="text-slate-400 text-sm w-8">{t('signalPeptideLengthUnit')}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('signalPeptideDesc')}</p>
        </div>

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
              disabled={readonly}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
              disabled={readonly}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
              disabled={readonly}
              className="flex-1 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <span className="text-slate-400 text-sm w-8">{t('maxPeptideLengthUnit')}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('maxPeptideLengthDesc')}</p>
        </div>
      </div>

      {/* Detection Mode */}
      <div className="pt-6 border-t border-slate-700">
        <label className="block text-sm text-slate-300 mb-3">
          <span className="flex items-center gap-2">
            🔬 {t('modeTitle')}
          </span>
        </label>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-900 hover:bg-slate-900/70 rounded-lg transition border border-slate-700 hover:border-slate-600">
            <input
              type="radio"
              checked={mode === 'permissive'}
              onChange={() => setMode('permissive')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="text-white font-medium">{t('modePermissive')}</div>
              <div className="text-xs text-slate-400 mt-1">{t('modePermissiveDesc')}</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-900 hover:bg-slate-900/70 rounded-lg transition border border-slate-700 hover:border-slate-600">
            <input
              type="radio"
              checked={mode === 'strict'}
              onChange={() => setMode('strict')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="text-white font-medium">{t('modeStrict')}</div>
              <div className="text-xs text-slate-400 mt-1">{t('modeStrictDesc')}</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-900 hover:bg-slate-900/70 rounded-lg transition border border-slate-700 hover:border-slate-600">
            <input
              type="radio"
              checked={mode === 'ultra-permissive'}
              onChange={() => setMode('ultra-permissive')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="text-white font-medium">Ultra-Permissive</div>
              <div className="text-xs text-slate-400 mt-1">
                Detects RFamide peptides (NPFF/QRFP/26RFa) and single basic cleavage sites. Includes confidence scoring.
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}