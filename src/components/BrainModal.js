import React from 'react';
import { X } from 'lucide-react';

export default function BrainModal({ peptide, onClose }) {
  if (!peptide || !peptide.brainPeptide || !peptide.brainPeptide.found) return null;

  const { brainPeptide } = peptide;

  const formatProteinName = (name) => {
    if (!name) return 'Unknown';
    let cleaned = name.replace(/^"|"$/g, '');
    if (cleaned.length > 100) cleaned = cleaned.substring(0, 100) + '...';
    return cleaned;
  };

  const getConfidenceBadge = (count) => {
    if (count >= 100) return { text: 'Very High', color: 'green', emoji: '⭐' };
    if (count >= 50) return { text: 'High', color: 'green', emoji: '🟢' };
    if (count >= 10) return { text: 'Medium', color: 'yellow', emoji: '🟡' };
    return { text: 'Low', color: 'gray', emoji: '⚪' };
  };

  const confidence = getConfidenceBadge(brainPeptide.msmsCount);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold text-lg">🧠 Brain Peptide Detection</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">

          {/* Peptide Sequence */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Peptide Sequence</label>
            <div className="p-3 bg-slate-900 rounded border border-slate-700 font-mono text-sm text-white break-all">
              {peptide.sequence}
            </div>
          </div>

          {/* Detection Status */}
          <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-green-300 font-semibold text-lg">
                Experimentally Detected in Human Brain
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              This peptide was identified via LC-MS/MS mass spectrometry in human brain tissue.
            </p>
          </div>

          {/* Source Protein */}
          {brainPeptide.proteinName && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Source Protein</label>
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="text-white text-sm">
                  {formatProteinName(brainPeptide.proteinName)}
                </div>

                {brainPeptide.isProhormone && (
                  <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-blue-900/30 border border-blue-700 rounded text-xs text-blue-300">
                    🧬 Pro-hormone Precursor
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UniProt */}
          {brainPeptide.uniprot && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">UniProt Accession</label>
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                {brainPeptide.uniprot.split(';').map((acc, idx) => (
                  <a
                    key={idx}
                    href={`https://www.uniprot.org/uniprotkb/${acc.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm mr-3"
                  >
                    {acc.trim()}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Detection Confidence */}
          <div>
            <label className="block text-sm text-slate-400 mb-3">Detection Confidence</label>
            <div className="space-y-3">

              {/* MS/MS Count */}
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium text-sm">MS/MS Detections</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-${confidence.color}-400 font-semibold text-lg`}>
                      {brainPeptide.msmsCount}
                    </span>
                    <span className="text-slate-400 text-xs">detections</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{confidence.emoji}</span>
                  <span className={`text-${confidence.color}-400 text-xs font-medium`}>
                    {confidence.text} Confidence
                  </span>
                </div>
              </div>

              {/* Mascot Score */}
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium text-sm">Mascot Score</div>
                  <div className="text-blue-400 font-semibold">
                    {brainPeptide.mascotScore} / 100
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Confidence of peptide identification
                </div>
              </div>
            </div>
          </div>

          {/* PTM */}
          {brainPeptide.isAmidated && (
            <div className="p-3 bg-blue-900/20 border border-blue-700 rounded">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔵</span>
                <div className="flex-1">
                  <div className="text-blue-300 font-medium text-sm">C-terminal Amidation</div>
                  <div className="text-slate-400 text-xs mt-1">Common PTM in bioactive peptides</div>
                </div>
              </div>
            </div>
          )}

          {/* Reference */}
          <div className="pt-4 border-t border-slate-700">
            <label className="block text-sm text-slate-400 mb-2">Scientific Reference</label>
            <div className="p-3 bg-slate-900 rounded border border-slate-700 text-sm">
              <div className="text-white font-medium mb-1">
                Zougman et al., Nature Communications 2016
              </div>
              <div className="text-slate-400 text-xs mb-2">DOI: 10.1038/ncomms11436</div>

              <a
                href="https://www.nature.com/articles/ncomms11436"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-xs"
              >
                View Publication →
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
