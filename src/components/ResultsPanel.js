import React from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function ResultsPanel({ results, onDownload, isBatch = false }) {
  const { t } = useTranslation();

  if (!results) return null;

  // Batch mode - Stats globales
  if (isBatch) {
    const totalPeptides = results.reduce((sum, r) => sum + r.peptides.length, 0);
    const avgPeptides = Math.round(totalPeptides / results.length);

    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 sticky top-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-semibold text-white">{t('batchResultsTitle')}</h2>
        </div>
        
        <div>
          <p className="text-slate-400 text-sm">{t('totalProteins')}</p>
          <p className="text-2xl font-bold text-blue-400">{results.length}</p>
        </div>
        
        <div>
          <p className="text-slate-400 text-sm">{t('totalPeptides')}</p>
          <p className="text-2xl font-bold text-green-400">{totalPeptides}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">{t('avgPeptidesPerProtein')}</p>
          <p className="text-2xl font-bold text-purple-400">{avgPeptides}</p>
        </div>

        <button
          onClick={onDownload}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-2 transition text-sm"
        >
          <Download size={16} />
          {t('downloadAllProteins')}
        </button>
      </div>
    );
  }

  // Single mode - Stats individuelles
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 sticky top-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-semibold text-white">{t('resultsTitle')}</h2>
      </div>
      
      <div>
        <p className="text-slate-400 text-sm">{t('sequenceLength')}</p>
        <p className="text-2xl font-bold text-blue-400">{results.sequenceLength} aa</p>
      </div>
      
      <div>
        <p className="text-slate-400 text-sm">{t('cleavageSitesDetected')}</p>
        <p className="text-2xl font-bold text-green-400">{results.cleavageSitesCount}</p>
      </div>

      <div>
        <p className="text-slate-400 text-sm">{t('peptidesIdentified')}</p>
        <p className="text-2xl font-bold text-purple-400">{results.peptides.length}</p>
      </div>

      <div className="bg-slate-900 rounded p-3">
        <p className="text-slate-400 text-xs mb-2">{t('peptidesInRange')}</p>
        <p className="text-xl font-bold text-yellow-400">{results.peptidesInRange}</p>
        <p className="text-xs text-slate-500 mt-1">{t('optimalRangeNote')}</p>
      </div>

      {results.cleavageMotifCounts && Object.keys(results.cleavageMotifCounts).length > 0 && (
        <div className="bg-slate-900 rounded p-3">
          <p className="text-slate-400 text-xs mb-2">{t('cleavageMotifs')}</p>
          <div className="space-y-1">
            {Object.entries(results.cleavageMotifCounts).map(([motif, count]) => (
              <div key={motif} className="flex justify-between text-xs">
                <span className="text-slate-300 font-mono">{motif}</span>
                <span className="text-slate-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onDownload}
        disabled={results.peptides.length === 0}
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
      >
        <Download size={16} />
        {t('downloadCSV')}
      </button>
    </div>
  );
}