import React, { useState } from 'react';
import { Upload, Download, AlertCircle, Loader } from 'lucide-react';

export default function PeptidePredictor() {
  const [sequence, setSequence] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('strict');
  const [params, setParams] = useState({
    signalPeptideLength: 20,
    minCleavageSites: 4,
    minCleavageSpacing: 5,
  });

  const parseSequence = (input) => {
    let cleanSeq = input.trim();
    if (cleanSeq.startsWith('>')) {
      cleanSeq = cleanSeq.split('\n').slice(1).join('');
    }
    return cleanSeq.replace(/\s/g, '').toUpperCase();
  };

  const handleAnalyze = async () => {
    setError('');
    setResults(null);

    if (!sequence.trim()) {
      setError('Veuillez entrer une séquence protéique');
      return;
    }

    setLoading(true);

    try {
      const cleanSeq = parseSequence(sequence);

      if (!/^[ACDEFGHIKLMNPQRSTVWY*]+$/.test(cleanSeq)) {
        setError('La séquence contient des caractères invalides. Utilisez uniquement les codes standard des acides aminés.');
        setLoading(false);
        return;
      }

      if (cleanSeq.length < params.signalPeptideLength + 10) {
        setError('La séquence est trop courte pour l\'analyse');
        setLoading(false);
        return;
      }

      // Appeler le backend Railway
      const API_URL = 'https://peptide-predictor-api-production.up.railway.app/analyze';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequence: cleanSeq,
          mode: mode,
          signalPeptideLength: params.signalPeptideLength,
          minCleavageSites: params.minCleavageSites,
          minCleavageSpacing: params.minCleavageSpacing
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur serveur');
      }

      const data = await response.json();
      
      // Transformer les résultats
      setResults({
        sequenceLength: data.sequenceLength,
        cleavageSitesCount: data.cleavageSitesCount,
        peptides: data.peptides,
        peptidesInRange: data.peptidesInRange,
        cleavageMotifCounts: data.peptides.reduce((acc, p) => {
          acc[p.cleavageMotif] = (acc[p.cleavageMotif] || 0) + 1;
          return acc;
        }, {}),
        originalSequence: cleanSeq
      });
    } catch (err) {
      setError('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSequence(event.target?.result || '');
      };
      reader.readAsText(file);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const csv = [
      ['Peptide', 'Start', 'End', 'Length (aa)', 'In Range (5-25aa)', 'Cleavage Motif', 'Mode'],
      ...results.peptides.map(p => [
        p.sequence, 
        p.start, 
        p.end, 
        p.length,
        p.inRange ? 'YES' : 'NO',
        p.cleavageMotif,
        mode === 'strict' ? 'STRICT' : 'PERMISSIVE'
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'peptides_results.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Prédicteur de Peptides</h1>
          <p className="text-slate-400">
            Analysez les séquences protéiques avec détection REGEX (Coassolo et al. Nature 2025)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selection */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-white font-semibold mb-4">Mode de détection</label>
              <div className="space-y-3">
                {/* STRICT Mode */}
                <label className="flex items-start gap-3 p-4 border border-slate-600 rounded cursor-pointer hover:bg-slate-700/50 transition"
                  style={{backgroundColor: mode === 'strict' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', borderColor: mode === 'strict' ? 'rgb(59, 130, 246)' : 'rgb(71, 85, 105)'}}>
                  <input
                    type="radio"
                    name="mode"
                    value="strict"
                    checked={mode === 'strict'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-white font-semibold">Mode STRICT (Recommandé)</p>
                    <p className="text-sm text-slate-400">
                      Regex complète du papier Nature. Moins de résultats mais plus fiables.
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Contraintes: lookbehind (?&lt;!K|R), vérification espacement stricte
                    </p>
                  </div>
                </label>

                {/* PERMISSIVE Mode */}
                <label className="flex items-start gap-3 p-4 border border-slate-600 rounded cursor-pointer hover:bg-slate-700/50 transition"
                  style={{backgroundColor: mode === 'permissive' ? 'rgba(168, 85, 247, 0.1)' : 'transparent', borderColor: mode === 'permissive' ? 'rgb(168, 85, 247)' : 'rgb(71, 85, 105)'}}>
                  <input
                    type="radio"
                    name="mode"
                    value="permissive"
                    checked={mode === 'permissive'}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-white font-semibold">Mode PERMISSIF</p>
                    <p className="text-sm text-slate-400">
                      Regex simplifiée. Plus de résultats mais peut inclure des faux positifs.
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">
                      Contraintes réduites: détection sensible
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Sequence Input */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-white font-semibold mb-3">Séquence Protéique</label>
              <textarea
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="Collez votre séquence FASTA ou protéique ici..."
                className="w-full h-40 bg-slate-900 text-white border border-slate-600 rounded p-3 font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <div className="mt-3 flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition">
                  <Upload size={18} />
                  Télécharger
                  <input
                    type="file"
                    accept=".fasta,.fa,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setSequence('')}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition"
                >
                  Effacer
                </button>
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-white font-semibold mb-4">Paramètres</label>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Longueur du peptide signal: <span className="font-mono text-blue-400">{params.signalPeptideLength} aa</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={params.signalPeptideLength}
                    onChange={(e) =>
                      setParams({ ...params, signalPeptideLength: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Sites de clivage avant cette position sont ignorés</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Min. sites de clivage: <span className="font-mono text-green-400">{params.minCleavageSites}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={params.minCleavageSites}
                    onChange={(e) =>
                      setParams({ ...params, minCleavageSites: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum de motifs KK/KR/RR/RK requis</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Min. espacement (aa): <span className="font-mono text-purple-400">{params.minCleavageSpacing}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={params.minCleavageSpacing}
                    onChange={(e) =>
                      setParams({ ...params, minCleavageSpacing: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Distance minimum entre deux sites de clivage</p>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {results ? (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 sticky top-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-white">Résultats</h2>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${mode === 'strict' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                    {mode === 'strict' ? 'STRICT' : 'PERMISSIF'}
                  </span>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm">Longueur de séquence</p>
                  <p className="text-2xl font-bold text-blue-400">{results.sequenceLength} aa</p>
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm">Sites de clivage détectés</p>
                  <p className="text-2xl font-bold text-green-400">{results.cleavageSitesCount}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Peptides identifiés</p>
                  <p className="text-2xl font-bold text-purple-400">{results.peptides.length}</p>
                </div>

                <div className="bg-slate-900 rounded p-3">
                  <p className="text-slate-400 text-xs mb-2">Peptides dans la gamme 5-25 aa</p>
                  <p className="text-xl font-bold text-yellow-400">{results.peptidesInRange}</p>
                  <p className="text-xs text-slate-500 mt-1">Gamme optimale pour bioactivité</p>
                </div>

                {Object.keys(results.cleavageMotifCounts).length > 0 && (
                  <div className="bg-slate-900 rounded p-3">
                    <p className="text-slate-400 text-xs mb-2">Motifs de clivage</p>
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
                  onClick={downloadResults}
                  disabled={results.peptides.length === 0}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
                >
                  <Download size={16} />
                  Télécharger CSV
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Peptides Table */}
        {results && (
          <div className="mt-6 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Peptides Prédits ({results.peptides.length})</h2>
              <p className="text-sm text-slate-400 mt-1">
                {results.peptidesInRange} peptides dans la gamme optimale (5-25 aa)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">#</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Séquence</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Position</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">aa</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Gamme</th>
                    <th className="px-4 py-3 text-left text-slate-300 font-semibold">Motif</th>
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
                          {peptide.inRange ? (
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                              ✓ Optimal
                            </span>
                          ) : (
                            <span className="text-xs bg-slate-700/30 text-slate-400 px-2 py-1 rounded">
                              Hors gamme
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
                      <td colSpan="6" className="px-4 py-4 text-center text-slate-500">
                        Aucun peptide trouvé avec ces paramètres
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}