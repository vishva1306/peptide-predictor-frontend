import React, { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { LanguageProvider, useTranslation } from './i18n/useTranslation';
import Header from './components/Header';
import Footer from './components/Footer';
import ProteinSearch from './components/ProteinSearch';
import ParametersPanel from './components/ParametersPanel';
import ResultsPanel from './components/ResultsPanel';
import PeptidesTable from './components/PeptidesTable';

function PeptidePredictor() {
  const { t } = useTranslation();
  
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('permissive');
  const [params, setParams] = useState({
    signalPeptideLength: 20,
    minCleavageSites: 4,
    minCleavageSpacing: 5,
    maxPeptideLength: 100
  });

  const API_URL =  'http://localhost:8000';

  console.log('🔗 API_URL:', API_URL);

  const handleProteinSelect = (protein) => {
    setSelectedProtein(protein);
    setResults(null);
    setError('');
    
    if (protein && protein.recommendedParams) {
      setParams(protein.recommendedParams);
      console.log('📊 Auto-populated parameters:', protein.recommendedParams);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setResults(null);

    if (!selectedProtein) {
      setError(t('errorSelectProtein'));
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        proteinId: selectedProtein.accession,
        mode: mode,
        signalPeptideLength: params.signalPeptideLength,
        minCleavageSites: params.minCleavageSites,
        minCleavageSpacing: params.minCleavageSpacing,
        maxPeptideLength: params.maxPeptideLength
      };
      
      console.log('🚀 REQUEST BODY:', requestBody);

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
      
      console.log('🔍 API Response:', data);
      
      setResults({
        sequenceLength: data.sequenceLength,
        cleavageSitesCount: data.cleavageSitesCount,
        peptides: data.peptides,
        peptidesInRange: data.peptidesInRange,
        proteinId: `${data.proteinId}|${data.geneName}_HUMAN`,
        geneName: data.geneName,
        proteinName: data.proteinName,
        cleavageMotifCounts: data.peptides.reduce((acc, p) => {
          acc[p.cleavageMotif] = (acc[p.cleavageMotif] || 0) + 1;
          return acc;
        }, {})
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

  const extractIdGeneName = (proteinId) => {
    if (!proteinId || proteinId === "N/A") {
      return "N/A";
    }
    return proteinId;
  };

  const downloadResults = () => {
    if (!results) return;

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

    const idGeneName = extractIdGeneName(results.proteinId);

    let fileName = 'peptides';
    
    if (idGeneName !== "N/A") {
      const cleanFileName = idGeneName.replace(/\|/g, '_');
      fileName = `${cleanFileName}_peptides`;
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      fileName = `peptides_${randomNum}`;
    }

    const csv = [
      [
        'ID - Gene Name',
        'Peptide',
        'Start', 
        'End', 
        'Length (aa)', 
        'Size', 
        'Bioactivity Score',
        'Bioactivity Source',
        'UniProt Status',
        'UniProt Name',
        'UniProt Note',
        'UniProt Accession',
        'Cleavage Motif', 
        'Peptide Detection Mode'
      ],
      ...results.peptides.map(p => [
        idGeneName,
        p.sequence,
        p.start, 
        p.end, 
        p.length,
        getSizeCategory(p.length),
        p.bioactivityScore.toFixed(1),
        p.bioactivitySource === 'api' ? 'PeptideRanker API' : 'Lab ML Bioactivity Model',
        p.uniprotStatus === 'exact' ? 'Exact match' : 
        p.uniprotStatus === 'partial' ? 'Partial match' : 'Unknown',
        p.uniprotName || 'N/A',
        p.uniprotNote || 'N/A',
        p.uniprotAccession || 'N/A',
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
    a.download = `${fileName}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-3">
                {t('proteinSearchTitle')}
              </h3>
              <ProteinSearch 
                onProteinSelect={handleProteinSelect}
                apiUrl={API_URL}
              />
            </div>

            {selectedProtein && (
              <>
                <ParametersPanel 
                  mode={mode}
                  setMode={setMode}
                  params={params}
                  setParams={setParams}
                  recommendedParams={selectedProtein.recommendedParams}
                />

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
              </>
            )}

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <ResultsPanel 
              results={results}
              onDownload={downloadResults}
            />
          </div>
        </div>

        <PeptidesTable results={results} />

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