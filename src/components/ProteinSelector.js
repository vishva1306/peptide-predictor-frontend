import React, { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function ProteinSelector({ proteins, selectedProtein, onSelectProtein }) {
  const { t } = useTranslation();
  const [showFasta, setShowFasta] = useState(false);

  if (!proteins || proteins.length === 0) return null;

  const selected = proteins.find(p => p.accession === selectedProtein);

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Dropdown Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-slate-400 mb-2">
            {t('selectProtein')}
          </label>
          <div className="relative">
            <select
              value={selectedProtein}
              onChange={(e) => onSelectProtein(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 appearance-none cursor-pointer pr-10"
            >
              {proteins.map((protein) => (
                <option key={protein.accession} value={protein.accession}>
                  {protein.geneName} ({protein.accession}) - {protein.peptides.length} peptides
                </option>
              ))}
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
              size={20} 
            />
          </div>
        </div>

        {/* View FASTA Button */}
        <div className="flex-shrink-0">
          <label className="block text-sm text-slate-400 mb-2 invisible">
            Action
          </label>
          <button
            onClick={() => setShowFasta(!showFasta)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2"
          >
            <FileText size={18} />
            {t('viewFasta')}
          </button>
        </div>
      </div>

      {/* FASTA Display */}
      {showFasta && selected && (
        <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-mono text-sm font-semibold">
              FASTA Sequence
            </span>
            <button
              onClick={() => setShowFasta(false)}
              className="text-slate-400 hover:text-white text-sm"
            >
              {t('hideSequence')}
            </button>
          </div>
          
          <div className="font-mono text-xs text-slate-400 break-all leading-relaxed space-y-2">
            <div className="text-blue-400">{selected.fastaHeader}</div>
            <div className="whitespace-pre-wrap">{selected.sequence}</div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
            {selected.length} aa · Signal: 1-{selected.signalPeptideEnd}
          </div>
        </div>
      )}
    </div>
  );
}