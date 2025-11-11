import React, { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { LanguageProvider, useTranslation } from './i18n/useTranslation';
import Header from './components/Header';
import Footer from './components/Footer';
import ProteinSearch from './components/ProteinSearch';
import ParametersPanel from './components/ParametersPanel';
import ResultsPanel from './components/ResultsPanel';
import PeptidesTable from './components/PeptidesTable';
import ProteinsModal from './components/ProteinsModal';
import ProteinSelector from './components/ProteinSelector';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full">
        <div className="p-6">
          <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
          <p className="text-slate-300 text-sm mb-6">{message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              {t('cancel')}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeptidePredictor() {
  const { t } = useTranslation();
  
  // Mode : 'single' ou 'batch'
  const [analysisMode, setAnalysisMode] = useState('single');
  
  // Single mode states
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [results, setResults] = useState(null);
  
  // FASTA mode states
  const [fastaData, setFastaData] = useState(null);
  const [searchType, setSearchType] = useState('gene_name');
  
  // Batch mode states
  const [batchProteins, setBatchProteins] = useState([]);
  const [batchResults, setBatchResults] = useState(null);
  const [selectedBatchProtein, setSelectedBatchProtein] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('permissive');
  const [params, setParams] = useState({
    signalPeptideLength: 20,
    minCleavageSites: 1,
    minCleavageSpacing: 2,
    maxPeptideLength: 300
  });
  
  // UI states
  const [showProteinsModal, setShowProteinsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  console.log('🔗 API_URL:', API_URL);

  // ==================== SINGLE MODE HANDLERS (UniProt) ====================

  const handleProteinSelect = (protein) => {
    setSelectedProtein(protein);
    setResults(null);
    setError('');
    
    if (protein && protein.recommendedParams) {
      setParams(protein.recommendedParams);
      console.log('📊 Auto-populated parameters:', protein.recommendedParams);
    }
  };

  // ==================== FASTA MODE HANDLERS ====================

  const handleFASTAValidated = (validated) => {
    setFastaData(validated);
    setResults(null);
    setError('');
    
    // Paramètres par défaut FASTA
    setParams({
      signalPeptideLength: 20,
      minCleavageSites: 1,
      minCleavageSpacing: 2,
      maxPeptideLength: 300
    });
  };

  const handleAnalyzeFASTA = async () => {
    setError('');
    setResults(null);

    if (!fastaData) {
      setError('Please enter a valid FASTA sequence');
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        fastaSequence: fastaData.sequence,
        fastaHeader: fastaData.header,
        mode: mode,
        signalPeptideLength: params.signalPeptideLength,
        minCleavageSites: params.minCleavageSites,
        minCleavageSpacing: params.minCleavageSpacing,
        maxPeptideLength: params.maxPeptideLength
      };
      
      console.log('🚀 FASTA REQUEST:', requestBody);

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
      
      console.log('🔍 FASTA API Response:', data);
      
      setResults({
        sequenceLength: data.sequenceLength,
        cleavageSitesCount: data.cleavageSitesCount,
        peptides: data.peptides,
        peptidesInRange: data.peptidesInRange,
        proteinId: data.proteinId,
        geneName: data.geneName,
        proteinName: data.proteinName,
        isFasta: true,
        fastaHeader: data.fastaHeader,
        mode: data.mode,
        cleavageMotifCounts: data.peptides.reduce((acc, p) => {
          acc[p.cleavageMotif] = (acc[p.cleavageMotif] || 0) + 1;
          return acc;
        }, {})
      });
    } catch (err) {
      console.error('FASTA analysis error:', err);
      
      if (err.message.includes('Failed to fetch')) {
        setError(`${t('errorServer')} Cannot reach API server. Check your connection.`);
      } else {
        setError(`${t('errorServer')} ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSingle = async () => {
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
      
      console.log('🚀 SINGLE REQUEST:', requestBody);

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
        isFasta: false,
        mode: data.mode,
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

  // ==================== BATCH MODE HANDLERS ====================

  const handleBatchUpload = (proteins, fileName) => {
    console.log('📦 Batch proteins uploaded:', proteins);
    console.log('📄 File name:', fileName);
    setBatchProteins(proteins);
    setUploadedFileName(fileName);
    setBatchResults(null);
    setError('');
  };

  const handleChangeFile = () => {
    setBatchProteins([]);
    setUploadedFileName('');
    setError('');
    setBatchResults(null);
  };

  const handleRemoveProtein = (accession) => {
    const filtered = batchProteins.filter(p => p.accession !== accession);
    setBatchProteins(filtered);
    
    if (filtered.length === 0) {
      setError('');
      setUploadedFileName('');
    }
  };

  const handleAnalyzeBatch = async () => {
    if (batchProteins.length === 0) {
      setError(t('errorSelectProtein'));
      return;
    }

    setError('');
    setBatchResults(null);
    setLoading(true);

    try {
      const proteinIds = batchProteins.map(p => p.accession);
      
      const requestBody = {
        proteinId: proteinIds,
        mode: mode
      };
      
      console.log('🚀 BATCH REQUEST:', requestBody);

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
      
      console.log('🔍 BATCH API Response:', data);
      
      // Filtrer les résultats success
      const successfulResults = data.results.filter(r => r.status === 'success');
      
      if (successfulResults.length === 0) {
        throw new Error('No proteins were successfully analyzed');
      }

      setBatchResults(successfulResults);
      
      // Sélectionner la première protéine par défaut
      if (successfulResults.length > 0) {
        setSelectedBatchProtein(successfulResults[0].accession);
      }

      // Afficher warning si certaines ont échoué
      if (data.failedProteins > 0) {
        const failedProteins = data.results
          .filter(r => r.status === 'error')
          .map(r => r.proteinId)
          .join(', ');
        
        setError(`⚠️ ${data.successfulProteins}/${data.totalProteins} proteins analyzed successfully. Failed: ${failedProteins}`);
      }

    } catch (err) {
      console.error('Batch analysis error:', err);
      
      if (err.message.includes('Failed to fetch')) {
        setError(`${t('errorServer')} Cannot reach API server. Check your connection.`);
      } else {
        setError(`${t('errorServer')} ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== DOWNLOAD HANDLERS ====================

  const downloadSingleCSV = () => {
    if (!results) return;

    const getSizeCategory = (length) => {
      if (length < 3) return 'Tiny (<3 aa)';
      else if (length >= 3 && length <= 20) return 'Small (3-20 aa)';
      else if (length >= 21 && length <= 50) return 'Medium (21-50 aa)';
      else if (length >= 51 && length <= 100) return 'Large (51-100 aa)';
      else return 'X-Large (>100 aa)';
    };

    const formatPTMs = (ptms) => {
      if (!ptms || ptms.length === 0) return 'None';
      return ptms.map(p => p.shortName).join('; ');
    };

    const idGeneName = results.proteinId || "N/A";
    const cleanFileName = idGeneName.replace(/\|/g, '_').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanFileName}_peptides.csv`;

    // Headers adaptés selon FASTA ou UniProt
    const headers = results.isFasta
      ? ['#', 'Sequence', 'Position', 'Length (aa)', 'Bioactivity Score', 'Bioactivity Source', 'Size', 'PTMs Detected', 'Modified Sequence', 'Cleavage Motif', 'Detection Mode']
      : ['#', 'ID - Gene Name', 'Sequence', 'Position', 'Length (aa)', 'Bioactivity Score', 'Bioactivity Source', 'Size', 'UniProt Status', 'UniProt Name', 'PTMs Detected', 'Modified Sequence', 'Cleavage Motif', 'Detection Mode'];

    const rows = [
      headers,
      ...results.peptides.map((p, idx) => {
        const baseRow = [
          idx + 1,
          p.sequence,
          `${p.start}-${p.end}`,
          p.length,
          p.bioactivityScore.toFixed(1),
          p.bioactivitySource === 'api' ? 'PeptideRanker API' : 'Lab ML Bioactivity Model',
          getSizeCategory(p.length),
        ];

        if (!results.isFasta) {
          // UniProt: ajouter ID et UniProt info
          return [
            idx + 1,
            idGeneName,
            ...baseRow.slice(1, 7),
            p.uniprotStatus === 'exact' ? 'Exact' : p.uniprotStatus === 'partial' ? 'Partial' : 'Unknown',
            p.uniprotName || 'N/A',
            formatPTMs(p.ptms),
            p.modifiedSequence || p.sequence,
            p.cleavageMotif,
            mode === 'strict' ? 'STRICT' : 'PERMISSIVE'
          ];
        } else {
          // FASTA: pas de colonne UniProt
          return [
            ...baseRow,
            formatPTMs(p.ptms),
            p.modifiedSequence || p.sequence,
            p.cleavageMotif,
            mode === 'strict' ? 'STRICT' : 'PERMISSIVE'
          ];
        }
      }),
    ];

    const csv = rows
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadBatchCSV = () => {
    if (!batchResults || batchResults.length === 0) return;

    const getSizeCategory = (length) => {
      if (length < 3) return 'Tiny (<3 aa)';
      else if (length >= 3 && length <= 20) return 'Small (3-20 aa)';
      else if (length >= 21 && length <= 50) return 'Medium (21-50 aa)';
      else if (length >= 51 && length <= 100) return 'Large (51-100 aa)';
      else return 'X-Large (>100 aa)';
    };

    const formatPTMs = (ptms) => {
      if (!ptms || ptms.length === 0) return 'None';
      return ptms.map(p => p.shortName).join('; ');
    };

    // Générer nom de fichier
    let fileName;
    if (batchResults.length <= 3) {
      const names = batchResults.map(r => r.geneName).join('_');
      fileName = `${names}_batch.csv`;
    } else {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      fileName = `batch_analysis_${randomNum}.csv`;
    }

    const allRows = [];
    let peptideCounter = 1;

    // Header une seule fois
    allRows.push([
      '#',
      'ID - Gene Name',
      'Sequence',
      'Position',
      'Length (aa)',
      'Bioactivity Score',
      'Bioactivity Source',
      'Size',
      'UniProt Status',
      'UniProt Name',
      'PTMs Detected',
      'Modified Sequence',
      'Cleavage Motif',
      'Detection Mode'
    ]);

    // Toutes les données de toutes les protéines à la suite
    batchResults.forEach((proteinResult) => {
      const idGeneName = `${proteinResult.accession}|${proteinResult.geneName}_HUMAN`;
      
      proteinResult.peptides.forEach((p) => {
        allRows.push([
          peptideCounter++,
          idGeneName,
          p.sequence,
          `${p.start}-${p.end}`,
          p.length,
          p.bioactivityScore.toFixed(1),
          p.bioactivitySource === 'api' ? 'PeptideRanker API' : 'Lab ML Bioactivity Model',
          getSizeCategory(p.length),
          p.uniprotStatus === 'exact' ? 'Exact' : p.uniprotStatus === 'partial' ? 'Partial' : 'Unknown',
          p.uniprotName || 'N/A',
          formatPTMs(p.ptms),
          p.modifiedSequence || p.sequence,
          p.cleavageMotif,
          mode === 'strict' ? 'STRICT' : 'PERMISSIVE'
        ]);
      });
    });

    // Convertir en CSV
    const csv = allRows
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ==================== NEW ANALYSIS HANDLER ====================

  const handleNewAnalysis = () => {
    setShowConfirmModal(true);
  };

  const confirmNewAnalysis = () => {
    // Reset tout et retourner au mode single
    setAnalysisMode('single');
    setSelectedProtein(null);
    setFastaData(null);
    setSearchType('gene_name');
    setResults(null);
    setBatchProteins([]);
    setBatchResults(null);
    setSelectedBatchProtein(null);
    setUploadedFileName('');
    setError('');
    setMode('permissive');
    setParams({
      signalPeptideLength: 20,
      minCleavageSites: 1,
      minCleavageSpacing: 2,
      maxPeptideLength: 300
    });
    setShowConfirmModal(false);
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==================== CLEAR HANDLER ====================

  const handleClearConfirm = () => {
    setShowClearConfirmModal(true);
  };

  const confirmClear = () => {
    if (analysisMode === 'single') {
      setSelectedProtein(null);
      setFastaData(null);
      setResults(null);
      setError('');
    } else {
      setBatchProteins([]);
      setBatchResults(null);
      setSelectedBatchProtein(null);
      setUploadedFileName('');
      setError('');
    }
    setShowClearConfirmModal(false);
  };

  // ==================== MODE TOGGLE ====================

  const toggleMode = (newMode) => {
    if (newMode === analysisMode) return;
    
    // Reset states
    setAnalysisMode(newMode);
    setSelectedProtein(null);
    setFastaData(null);
    setSearchType('gene_name');
    setResults(null);
    setBatchProteins([]);
    setBatchResults(null);
    setSelectedBatchProtein(null);
    setUploadedFileName('');
    setError('');
  };

  // ==================== RENDER ====================

  const hasResults = analysisMode === 'single' ? results : batchResults;
  const canAnalyze = analysisMode === 'single' 
    ? (selectedProtein || fastaData)
    : batchProteins.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />

        {/* Mode Toggle - EN DEHORS du rectangle */}
        <div className="mb-6">
          <div className="inline-flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => toggleMode('single')}
              className={`px-6 py-2 rounded-lg transition ${
                analysisMode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔬 Single Protein
            </button>
            <button
              onClick={() => toggleMode('batch')}
              className={`px-6 py-2 rounded-lg transition ${
                analysisMode === 'batch'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 {t('batchUpload')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Protein Search / Batch Upload / FASTA */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-3">
                {analysisMode === 'single' 
                  ? t('proteinSearchTitle')
                  : t('batchUpload')
                }
              </h3>
              
              <ProteinSearch 
                onProteinSelect={handleProteinSelect}
                onBatchUpload={handleBatchUpload}
                onFASTAValidated={handleFASTAValidated}
                onSearchTypeChange={(type) => setSearchType(type)}
                apiUrl={API_URL}
                mode={analysisMode}
                uploadedProteins={batchProteins}
                uploadedFileName={uploadedFileName}
                onChangeFile={handleChangeFile}
                onClearConfirm={handleClearConfirm}
                hasResults={hasResults}
              />
            </div>

            {/* Batch: View All Proteins Button */}
            {analysisMode === 'batch' && batchProteins.length > 0 && !batchResults && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowProteinsModal(true)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  {t('viewAllProteins')}
                </button>
              </div>
            )}

            {/* Parameters Panel (Single mode - visible immédiatement pour FASTA) */}
            {analysisMode === 'single' && (selectedProtein || searchType === 'fasta') && !results && (
              <ParametersPanel 
                mode={mode}
                setMode={setMode}
                params={params}
                setParams={setParams}
                recommendedParams={selectedProtein ? selectedProtein.recommendedParams : null}
                isFasta={searchType === 'fasta'}
              />
            )}

            {/* Mode Selection (Batch only) */}
            {analysisMode === 'batch' && batchProteins.length > 0 && !batchResults && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <label className="block text-sm text-slate-300 mb-3">
                  <span className="flex items-center gap-2">
                    🔬 {t('modeTitle')}
                  </span>
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-900 hover:bg-slate-900/70 rounded-lg transition border border-slate-700 hover:border-slate-600">
                    <input
                      type="radio"
                      checked={mode === 'permissive'}
                      onChange={() => setMode('permissive')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{t('modePermissive')}</div>
                      <div className="text-xs text-slate-400 mt-1">{t('modePermissiveDesc')}</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-900 hover:bg-slate-900/70 rounded-lg transition border border-slate-700 hover:border-slate-600">
                    <input
                      type="radio"
                      checked={mode === 'strict'}
                      onChange={() => setMode('strict')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{t('modeStrict')}</div>
                      <div className="text-xs text-slate-400 mt-1">{t('modeStrictDesc')}</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            {canAnalyze && !loading && !hasResults && (
              <button
                onClick={
                  analysisMode === 'single' 
                    ? (fastaData ? handleAnalyzeFASTA : handleAnalyzeSingle)
                    : handleAnalyzeBatch
                }
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {t('analyzeButton')}
              </button>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader size={24} className="animate-spin text-blue-400" />
                <span className="text-white">{t('analyzing')}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <ResultsPanel 
              results={analysisMode === 'single' ? results : batchResults}
              onDownload={analysisMode === 'single' ? downloadSingleCSV : downloadBatchCSV}
              isBatch={analysisMode === 'batch'}
            />
          </div>
        </div>

        {/* Protein Selector (Batch only) */}
        {analysisMode === 'batch' && batchResults && (
          <ProteinSelector
            proteins={batchResults}
            selectedProtein={selectedBatchProtein}
            onSelectProtein={setSelectedBatchProtein}
          />
        )}

        {/* Peptides Table */}
        {analysisMode === 'single' && results && (
          <PeptidesTable results={results} />
        )}

        {analysisMode === 'batch' && batchResults && selectedBatchProtein && (
          <PeptidesTable 
            results={batchResults.find(r => r.accession === selectedBatchProtein)}
          />
        )}

        {/* New Analysis Button */}
        {hasResults && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleNewAnalysis}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition shadow-lg flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              {t('newAnalysisButton')}
            </button>
          </div>
        )}

        <Footer />
      </div>

      {/* Modals */}
      {showProteinsModal && (
        <ProteinsModal
          proteins={batchProteins}
          onClose={() => setShowProteinsModal(false)}
          onRemoveProtein={handleRemoveProtein}
          canRemove={!batchResults}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmNewAnalysis}
        title={t('newAnalysisConfirmTitle')}
        message={t('newAnalysisConfirmMessage')}
      />

      <ConfirmModal
        isOpen={showClearConfirmModal}
        onClose={() => setShowClearConfirmModal(false)}
        onConfirm={confirmClear}
        title={t('clearConfirmTitle')}
        message={t('clearConfirmMessage')}
      />
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