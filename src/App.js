import React, { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { LanguageProvider, useTranslation } from './i18n/useTranslation';
import Header from './components/Header';
import Footer from './components/Footer';
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
      // ⭐ Validation côté client (juste pour vérifier les caractères)
      const tempClean = parseSequence(sequence);
      
      if (!/^[ACDEFGHIKLMNPQRSTVWY*]+$/.test(tempClean)) {
        setError(t('errorInvalidCharacters'));
        setLoading(false);
        return;
      }

      const requestBody = {
        sequence: sequence,  // ✅ Séquence originale avec header
        mode: mode,
        signalPeptideLength: params.signalPeptideLength,
        minCleavageSites: params.minCleavageSites,
        minCleavageSpacing: params.minCleavageSpacing
      };
      
      // ⭐ DEBUG : Voir ce qu'on envoie
      console.log('🚀 REQUEST BODY:', requestBody);
      console.log('🚀 SEQUENCE (premiers 100 chars):', sequence.substring(0, 100));

      // ⭐ IMPORTANT : Envoyer la séquence ORIGINALE (avec header FASTA si présent)
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // ⭐ DEBUG : Vérifier ce que retourne l'API
      console.log('🔍 API Response:', data);
      console.log('🔍 Protein ID reçu:', data.proteinId);
      
      setResults({
        sequenceLength: data.sequenceLength,
        cleavageSitesCount: data.cleavageSitesCount,
        peptides: data.peptides,
        peptidesInRange: data.peptidesInRange,
        proteinId: data.proteinId || "N/A",
        cleavageMotifCounts: data.peptides.reduce((acc, p) => {
          acc[p.cleavageMotif] = (acc[p.cleavageMotif] || 0) + 1;
          return acc;
        }, {}),
        originalSequence: tempClean
      });
    } catch (err) {
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

    // Fonction pour déterminer la catégorie de taille
    const getSizeCategory = (length) => {
      if (length < 3) {
        return 'Tiny (<3 aa)';
      } else if (length >= 3 && length <= 20) {
        return 'Small (3-20 aa)';
      } else if (length >= 21 && length <= 50) {
        return 'Medium (21-50 aa)';
      } else if (length >= 51 && length <= 100) {
        return 'Large (51-100 aa)';
      } else {
        return 'X-Large (>100 aa)';
      }
    };

    // ⭐ GÉNÉRATION DU NOM DE FICHIER
    let fileName = 'peptides';
    
    if (results.proteinId && results.proteinId !== "N/A") {
      // Extraire une partie significative du Protein ID
      // Exemple: "sp|Q96PX8|SLIK1_HUMAN ..." → "Q96PX8_SLIK1_HUMAN"
      let cleanId = results.proteinId;
      
      // Si format UniProt (sp|ID|NAME ...), extraire ID et NAME
      const uniprotMatch = cleanId.match(/[a-z]{2}\|([A-Z0-9]+)\|([A-Z0-9_]+)/i);
      if (uniprotMatch) {
        // Format: ID_NAME
        cleanId = `${uniprotMatch[1]}_${uniprotMatch[2]}`;
      } else {
        // Sinon, prendre les 30 premiers caractères et nettoyer
        cleanId = cleanId.substring(0, 30)
          .replace(/[^a-zA-Z0-9_-]/g, '_')  // Remplacer caractères spéciaux
          .replace(/_+/g, '_')  // Supprimer underscores multiples
          .replace(/^_|_$/g, '');  // Supprimer underscores au début/fin
      }
      
      fileName = `${cleanId}_peptides`;
    } else {
      // Pas de Protein ID → générer un nombre aléatoire de 4 chiffres
      const randomNum = Math.floor(1000 + Math.random() * 9000);  // 1000-9999
      fileName = `peptides_${randomNum}`;
    }

    const csv = [
      // ⭐ Ordre CSV : Peptide → Protein ID → Reste
      ['Peptide', 'Protein ID', 'Start', 'End', 'Length (aa)', 'Size', 'Bioactivity', 'Source', 'Cleavage Motif', 'Mode'],
      ...results.peptides.map(p => [
        p.sequence,
        results.proteinId || 'N/A',  // ⭐ PROTEIN ID EN 2ème POSITION
        p.start, 
        p.end, 
        p.length,
        getSizeCategory(p.length),
        p.bioactivityScore.toFixed(1),
        p.bioactivitySource === 'api' ? 'PeptideRanker API' : 'Heuristic Model',
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
    a.download = `${fileName}.csv`;  // ⭐ NOM DYNAMIQUE
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
        <Footer />
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