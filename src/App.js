import React, { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { LanguageProvider, useTranslation } from './i18n/useTranslation';
import Header from './components/Header';
import SequenceInput from './components/SequenceInput';
import ParametersPanel from './components/ParametersPanel';
import ResultsPanel from './components/ResultsPanel';
import PeptidesTable from './components/PeptidesTable';

function PeptidePredictor() {
  const { t } = useTranslation();
  
  // États
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

  // API URL (utilisera les variables d'environnement Vercel)
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  console.log('🔗 API_URL:', API_URL);


  // Fonctions utilitaires
  const parseSequence = (input) => {
    let cleanSeq = input.trim();
    if (cleanSeq.startsWith('>')) {
      cleanSeq = cleanSeq.split('\n').slice(1).join('');
    }
    return cleanSeq.replace(/\s/g, '').toUpperCase();
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

  const handleAnalyze = async () => {
  setError('');
  setResults(null);

  if (!sequence.trim()) {
    setError(t('errorEnterSequence'));
    return;
  }

  setLoading(true);

  try {
    const cleanSeq = parseSequence(sequence);

    if (!/^[ACDEFGHIKLMNPQRSTVWY*]+$/.test(cleanSeq)) {
      setError(t('errorInvalidCharacters'));
      setLoading(false);
      return;
    }

    const response = await fetch(`${API_URL}/analyze`, {
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

    // ⭐ AMÉLIORATION : Gestion d'erreur robuste
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // Si pas de JSON, utiliser le status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
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
    // ⭐ AMÉLIORATION : Erreur plus détaillée
    console.error('Analysis error:', err);
    
    if (err.message.includes('Failed to fetch')) {
      setError(`${t('errorServer')} Cannot reach API server. Check your connection.`);
    } else {
      setError(`${t('errorServer')} ${err.message}`);
    }
  } finally {
    setLoading(false);
  }
};

  const downloadResults = () => {
    if (!results) return;

    const csv = [
      ['Peptide', 'Start', 'End', 'Length (aa)', 'In Range (5-25aa)', 'Bioactivity', 'Cleavage Motif', 'Mode'],
      ...results.peptides.map(p => [
        p.sequence, 
        p.start, 
        p.end, 
        p.length,
        p.inRange ? 'YES' : 'NO',
        p.bioactivityScore.toFixed(1),
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
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche : Input + Paramètres */}
          <div className="lg:col-span-2 space-y-6">
            <SequenceInput 
              sequence={sequence}
              setSequence={setSequence}
              onFileUpload={handleFileUpload}
            />

            <ParametersPanel 
              mode={mode}
              setMode={setMode}
              params={params}
              setParams={setParams}
            />

            {/* Bouton Analyser */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  {t('analyzing')}
                </>
              ) : (
                t('analyzeButton')
              )}
            </button>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Colonne droite : Résultats */}
          <div className="lg:col-span-1">
            <ResultsPanel 
              results={results}
              onDownload={downloadResults}
            />
          </div>
        </div>

        {/* Tableau des peptides */}
        <PeptidesTable results={results} />

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          {t('reference')}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PeptidePredictor />
    </LanguageProvider>
  );
}