import React from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { ExternalLink } from 'lucide-react';

export default function PeptidesTable({ results }) {
  const { t } = useTranslation();

  if (!results || !results.peptides) return null;

  const getSizeCategory = (length) => {
    if (length < 3) {
      return {
        label: t('sizeTiny'),
        range: '<3 aa',
        color: 'bg-slate-700/30 text-slate-400',
      };
    } else if (length >= 3 && length <= 20) {
      return {
        label: t('sizeSmall'),
        range: '3-20 aa',
        color: 'bg-green-900/30 text-green-400',
      };
    } else if (length >= 21 && length <= 50) {
      return {
        label: t('sizeMedium'),
        range: '21-50 aa',
        color: 'bg-blue-900/30 text-blue-400',
      };
    } else if (length >= 51 && length <= 100) {
      return {
        label: t('sizeLarge'),
        range: '51-100 aa',
        color: 'bg-purple-900/30 text-purple-400',
      };
    } else {
      return {
        label: t('sizeXLarge'),
        range: '>100 aa',
        color: 'bg-orange-900/30 text-orange-400',
      };
    }
  };

  // ⭐ Extraire ID - Gene Name du proteinId
  const getIdGeneName = () => {
    if (!results.proteinId || results.proteinId === 'N/A') {
      return 'N/A';
    }

    // Format attendu : SP|P01189|POMC_HUMAN PRO-OPIOMELANOCORTIN
    // On veut : P01189|POMC_HUMAN
    const match = results.proteinId.match(/[a-z]{2}\|([A-Z0-9]+)\|([A-Z0-9_]+)/i);

    if (match) {
      return `${match[1]}|${match[2]}`; // P01189|POMC_HUMAN
    }

    return results.proteinId; // Fallback si format différent
  };

  const idGeneName = getIdGeneName();

  return (
    <div className="mt-6 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">
          {t('peptidesTableTitle')} ({results.peptides.length})
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {results.peptidesInRange} {t('peptidesInRangeNote')}
        </p>
        {idGeneName !== 'N/A' && (
          <p className="text-xs text-slate-500 mt-2 font-mono">
            {t('tableHeaderIdGeneName')}: {idGeneName}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderNumber')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderIdGeneName')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderSequence')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderPosition')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderLength')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                <div>
                  <div>{t('tableHeaderBioactivity')}</div>
                  <div className="text-xs font-normal text-slate-500 mt-0.5">
                    {t('tableHeaderBioactivitySource')}
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderSize')}</th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                <div>
                  <div>{t('tableHeaderUniProt')}</div>
                  <div className="text-xs font-normal text-slate-500 mt-0.5">
                    {t('tableHeaderUniProtSubtitle')}
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">{t('tableHeaderMotif')}</th>
            </tr>
          </thead>

          <tbody>
            {results.peptides.length > 0 ? (
              results.peptides.map((peptide, idx) => {
                const sizeCategory = getSizeCategory(peptide.length);
                const bioScore = typeof peptide.bioactivityScore === 'number' ? peptide.bioactivityScore : 0;

                return (
                  <tr
                    key={idx}
                    className={`border-b border-slate-700 hover:bg-slate-700/50 ${
                      peptide.inRange ? 'bg-slate-800/50' : 'bg-slate-800/20'
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-400">{idx + 1}</td>

                    <td className="px-4 py-3 font-mono text-blue-300 text-xs">{idGeneName}</td>

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
                        <span className="text-sm">
                          {peptide.bioactivitySource === 'api' ? '🤖' : '📊'}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {bioScore.toFixed(1)}/100
                        </span>
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              bioScore >= 70
                                ? 'bg-green-500'
                                : bioScore >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${bioScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${sizeCategory.color}`}>
                        {sizeCategory.label}
                        <span className="ml-1 opacity-70">({sizeCategory.range})</span>
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {peptide.uniprotStatus === 'exact' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-green-400 text-xs font-semibold">✅ Exact match</span>
                          </div>
                          <div className="text-xs text-slate-300 font-semibold">
                            {peptide.uniprotName}
                          </div>
                          {peptide.uniprotAccession && (
                            <a
                              href={`https://www.uniprot.org/uniprotkb/${peptide.uniprotAccession}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1"
                            >
                              {peptide.uniprotAccession}
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      ) : peptide.uniprotStatus === 'partial' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-xs font-semibold">⚠️ Partial match</span>
                          </div>
                          {peptide.uniprotNote && (
                            <div className="text-xs text-slate-400 italic">{peptide.uniprotNote}</div>
                          )}
                          <div className="text-xs text-slate-300 font-semibold">
                            {peptide.uniprotName}
                          </div>
                          {peptide.uniprotAccession && (
                            <a
                              href={`https://www.uniprot.org/uniprotkb/${peptide.uniprotAccession}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1"
                            >
                              {peptide.uniprotAccession}
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">❌ Unknown</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                      {peptide.cleavageMotif}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-slate-500">
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
