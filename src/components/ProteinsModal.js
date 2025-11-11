import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function ProteinsModal({ 
  proteins, 
  onClose, 
  onRemoveProtein,
  canRemove = true 
}) {
  const { t } = useTranslation();

  if (!proteins || proteins.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800">
          <h3 className="text-white font-semibold text-lg">
            {t('viewAllProteins')} ({proteins.length})
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Protein Cards List */}
        <div className="p-4 space-y-3">
          {proteins.map((protein, idx) => (
            <div
              key={idx}
              className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-mono text-sm text-blue-300 mb-1">
                    {protein.fastaHeader}
                  </div>
                  <div className="text-xs text-slate-400">
                    {protein.length} aa · Signal: 1-{protein.signalPeptideEnd}
                  </div>
                </div>
                
                {canRemove && (
                  <button
                    onClick={() => onRemoveProtein(protein.accession)}
                    className="text-slate-400 hover:text-red-400 transition flex-shrink-0"
                    title={t('removeProtein')}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end sticky bottom-0 bg-slate-800">
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