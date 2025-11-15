import React from 'react';
import { X } from 'lucide-react';

export default function AmphipathicModal({ peptide, onClose }) {
  // ⭐ Ligne retirée : const { t } = useTranslation();

  if (!peptide || !peptide.amphipathicData) return null;

  const { amphipathicData } = peptide;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">🧬 Amphipathic Properties</h3>
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
              Original Sequence
            </label>
            <div className="p-3 bg-slate-900 rounded border border-slate-700 font-mono text-sm text-white break-all">
              {peptide.sequence}
            </div>
          </div>

          {/* Amphipathic Score */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Amphipathic Score
            </label>
            <div className="p-3 bg-blue-900/20 border border-blue-700 rounded">
              <div className="text-3xl font-bold text-blue-300 mb-1">
                {amphipathicData.amphipathicScore}%
              </div>
              <div className="text-sm text-slate-400">
                {amphipathicData.basicCount + amphipathicData.lipophilicCount}/{peptide.length} residues
              </div>
            </div>
          </div>

          {/* Composition Breakdown */}
          <div>
            <label className="block text-sm text-slate-400 mb-3">
              Composition Breakdown
            </label>
            
            <div className="space-y-3">
              {/* Basic */}
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">
                    ⚡ Basic (K, R, H)
                  </div>
                  <div className="text-blue-400 font-semibold">
                    {amphipathicData.basicCount} ({amphipathicData.basicRatio}%)
                  </div>
                </div>
                {Object.keys(amphipathicData.basicDetails).length > 0 && (
                  <div className="text-sm text-slate-400 space-x-3">
                    {Object.entries(amphipathicData.basicDetails).map(([aa, count]) => (
                      <span key={aa}>
                        {aa}: {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Lipophilic */}
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">
                    💧 Lipophilic (A, V, L, I, M, F, W, Y)
                  </div>
                  <div className="text-green-400 font-semibold">
                    {amphipathicData.lipophilicCount} ({amphipathicData.lipophilicRatio}%)
                  </div>
                </div>
                {Object.keys(amphipathicData.lipophilicDetails).length > 0 && (
                  <div className="text-sm text-slate-400 space-x-3">
                    {Object.entries(amphipathicData.lipophilicDetails).map(([aa, count]) => (
                      <span key={aa}>
                        {aa}: {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Other */}
              <div className="p-3 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">
                    ⚪ Other
                  </div>
                  <div className="text-slate-400 font-semibold">
                    {amphipathicData.otherCount} ({amphipathicData.otherRatio}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Bar */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Visual Distribution
            </label>
            <div className="flex h-8 rounded overflow-hidden border border-slate-700">
              {amphipathicData.basicRatio > 0 && (
                <div 
                  className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${amphipathicData.basicRatio}%` }}
                >
                  {amphipathicData.basicRatio >= 10 && `${amphipathicData.basicRatio}%`}
                </div>
              )}
              {amphipathicData.lipophilicRatio > 0 && (
                <div 
                  className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${amphipathicData.lipophilicRatio}%` }}
                >
                  {amphipathicData.lipophilicRatio >= 10 && `${amphipathicData.lipophilicRatio}%`}
                </div>
              )}
              {amphipathicData.otherRatio > 0 && (
                <div 
                  className="bg-slate-600 flex items-center justify-center text-xs text-white font-semibold"
                  style={{ width: `${amphipathicData.otherRatio}%` }}
                >
                  {amphipathicData.otherRatio >= 10 && `${amphipathicData.otherRatio}%`}
                </div>
              )}
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