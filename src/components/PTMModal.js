import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function PTMModal({ peptide, onClose }) {
  const { t } = useTranslation();

  if (!peptide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">{t('modifiedPeptide')}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Original Sequence */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              {t('originalSequence')}
            </label>
            <div className="p-3 bg-slate-900 rounded border border-slate-700 font-mono text-sm text-white break-all">
              {peptide.sequence}
            </div>
          </div>

          {/* Modified Sequence */}
          {peptide.modifiedSequence && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                {t('modifiedSequence')}
              </label>
              <div className="p-3 bg-blue-900/20 border border-blue-700 rounded font-mono text-sm text-blue-300 break-all">
                {peptide.modifiedSequence}
              </div>
            </div>
          )}

          {/* PTMs List */}
          {peptide.ptms && peptide.ptms.length > 0 && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                {t('modificationsDetected')} ({peptide.ptms.length})
              </label>
              <div className="space-y-2">
                {peptide.ptms.map((ptm, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900 rounded border border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{ptm.emoji}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">
                          {ptm.type}
                        </div>
                        <div className="text-sm text-slate-400 space-y-1">
                          <div>
                            <span className="text-slate-500">Enzyme:</span>{' '}
                            {ptm.enzyme}
                          </div>
                          <div>
                            <span className="text-slate-500">Modification:</span>{' '}
                            {ptm.description}
                          </div>
                          {ptm.position && (
                            <div>
                              <span className="text-slate-500">Position:</span>{' '}
                              {ptm.position}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}