import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function ParametersPanel({ mode, setMode, params, setParams }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <label className="block text-white font-semibold mb-4">
          {t('modeTitle')}
        </label>
        
        <div className="space-y-3">
          {/* STRICT Mode */}
          <label 
            className="flex items-start gap-3 p-4 border border-slate-600 rounded cursor-pointer hover:bg-slate-700/50 transition"
            style={{
              backgroundColor: mode === 'strict' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              borderColor: mode === 'strict' ? 'rgb(59, 130, 246)' : 'rgb(71, 85, 105)'
            }}
          >
            <input
              type="radio"
              name="mode"
              value="strict"
              checked={mode === 'strict'}
              onChange={(e) => setMode(e.target.value)}
              className="mt-1"
            />
            <div>
              <p className="text-white font-semibold">{t('modeStrict')}</p>
              <p className="text-sm text-slate-400">{t('modeStrictDesc')}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">{t('modeStrictNote')}</p>
            </div>
          </label>

          {/* PERMISSIVE Mode */}
          <label 
            className="flex items-start gap-3 p-4 border border-slate-600 rounded cursor-pointer hover:bg-slate-700/50 transition"
            style={{
              backgroundColor: mode === 'permissive' ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
              borderColor: mode === 'permissive' ? 'rgb(168, 85, 247)' : 'rgb(71, 85, 105)'
            }}
          >
            <input
              type="radio"
              name="mode"
              value="permissive"
              checked={mode === 'permissive'}
              onChange={(e) => setMode(e.target.value)}
              className="mt-1"
            />
            <div>
              <p className="text-white font-semibold">{t('modePermissive')}</p>
              <p className="text-sm text-slate-400">{t('modePermissiveDesc')}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">{t('modePermissiveNote')}</p>
            </div>
          </label>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <label className="block text-white font-semibold mb-4">
          {t('parametersTitle')}
        </label>
        
        <div className="space-y-4">
          {/* Signal Peptide Length - TOUJOURS VISIBLE */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              {t('signalPeptideLength')}: <span className="font-mono text-blue-400">{params.signalPeptideLength} {t('signalPeptideLengthUnit')}</span>
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={params.signalPeptideLength}
              onChange={(e) => setParams({ ...params, signalPeptideLength: parseInt(e.target.value) })}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">{t('signalPeptideDesc')}</p>
          </div>

          {/* Min Cleavage Sites - TOUJOURS VISIBLE */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              {t('minCleavageSites')}: <span className="font-mono text-green-400">{params.minCleavageSites}</span>
            </label>
            <input
              type="range"
              min="2"
              max="10"
              value={params.minCleavageSites}
              onChange={(e) => setParams({ ...params, minCleavageSites: parseInt(e.target.value) })}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">{t('minCleavageSitesDesc')}</p>
          </div>

          {/* Min Cleavage Spacing - UNIQUEMENT EN MODE STRICT */}
          {mode === 'strict' && (
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                {t('minCleavageSpacing')}: <span className="font-mono text-purple-400">{params.minCleavageSpacing} {t('minCleavageSpacingUnit')}</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={params.minCleavageSpacing}
                onChange={(e) => setParams({ ...params, minCleavageSpacing: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-slate-500 mt-1">{t('minCleavageSpacingDesc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}