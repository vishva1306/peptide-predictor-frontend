import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export default function PeptidesTable({ results }) {
  const { t } = useTranslation();

  if (!results) return null;

  return (
    <div className="mt-6 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">
          {t('peptidesTableTitle')} ({results.peptides.length})
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {results.peptidesInRange} {t('peptidesInRangeNote')}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderNumber')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderSequence')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderPosition')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderLength')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderBioactivity')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderRange')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderMotif')}</th>
            </tr>
          </thead>
          <tbody>
            {results.peptides.length > 0 ? (
              results.peptides.map((peptide, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-slate-700 hover:bg-slate-700/50 ${
                    peptide.inRange ? 'bg-slate-800/50' : 'bg-slate-800/20'
                  }`}
                >
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-mono text-blue-300 text-xs break-all">
                    {peptide.sequence}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {peptide.start}-{peptide.end}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-semibold">
                    {peptide.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {peptide.bioactivityScore.toFixed(1)}/100
                      </span>
                      <div className="w-16 bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            peptide.bioactivityScore >= 70 ? 'bg-green-500' :
                            peptide.bioactivityScore >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${peptide.bioactivityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {peptide.bioactivitySource === 'api' ? '🤖' : '📊'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {peptide.inRange ? (
                      <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                        {t('optimal')}
                      </span>
                    ) : (
                      <span className="text-xs bg-slate-700/30 text-slate-400 px-2 py-1 rounded">
                        {t('outOfRange')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                    {peptide.cleavageMotif}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-slate-500">
                  No peptides found with these parameters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}