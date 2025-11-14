import React, { useState } from 'react';
import { Search, Loader, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import BatchUpload from './BatchUpload';
import FASTAInput from './FASTAInput';

export default function ProteinSearch({ 
  onProteinSelect, 
  onBatchUpload, 
  onFASTAValidated,
  onSearchTypeChange,
  apiUrl, 
  mode,
  uploadedProteins,
  uploadedFileName,
  onChangeFile,
  onClearConfirm,
  hasResults
}) {
  const { t } = useTranslation();
  
  const [searchType, setSearchType] = useState('gene_name');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [selectedFromList, setSelectedFromList] = useState(null);
  const [showSequence, setShowSequence] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [batchError, setBatchError] = useState('');

  // Notifier App.js du changement de searchType
  const handleSearchTypeChange = (newType) => {
    setSearchType(newType);
    if (onSearchTypeChange) {
      onSearchTypeChange(newType);
    }
  };

  // Handler : Search
  const handleSearch = async () => {
    if (query.length < 2) return;

    setLoading(true);
    setResults([]);
    setSelectedFromList(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/proteins/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        
        if (data.length === 1) {
          handleValidate(data[0]);
        }
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler : Validate selection
  const handleValidate = async (protein) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/proteins/${protein.accession}`
      );
      
      if (response.ok) {
        const fullProtein = await response.json();
        setSelectedProtein(fullProtein);
        onProteinSelect(fullProtein);
      }
    } catch (error) {
      console.error('Protein fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handler : Clear
  const handleClear = () => {
    // Si des résultats existent, demander confirmation
    if (hasResults) {
      onClearConfirm();
    } else {
      // Sinon clear directement
      setQuery('');
      setResults([]);
      setSelectedProtein(null);
      setSelectedFromList(null);
      setShowSequence(false);
      setHasSearched(false);
      onProteinSelect(null);
    }
  };

  // Handler : Batch File Upload
  const handleBatchFileUpload = async (file) => {
    setBatchError('');

    // Vérifier extension
    if (!file.name.endsWith('.txt')) {
      setBatchError(t('errorFileFormat'));
      return;
    }

    try {
      const text = await file.text();
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (lines.length === 0) {
        setBatchError(t('errorFileEmpty'));
        return;
      }

      if (lines.length > 15) {
        setBatchError(t('errorTooManyProteins'));
        return;
      }

      // Vérifier que ce sont des IDs UniProt valides (format basique)
      const validIdPattern = /^[OPQ][0-9][A-Z0-9]{3}[0-9]$|^[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/;
      const validIds = lines.filter(line => validIdPattern.test(line));

      if (validIds.length === 0) {
        setBatchError(t('errorFileEmpty'));
        return;
      }

      // Dédupliquer les IDs
      const uniqueIds = [...new Set(validIds)];
      
      if (uniqueIds.length < validIds.length) {
        const duplicatesCount = validIds.length - uniqueIds.length;
        console.log(`⚠️ Removed ${duplicatesCount} duplicate ID(s)`);
      }

      console.log('📄 Unique protein IDs found:', uniqueIds);

      // Vérifier existence des protéines
      setLoading(true);
      const foundProteins = [];
      const notFoundIds = [];

      for (const proteinId of uniqueIds) {
        try {
          const response = await fetch(`${apiUrl}/api/proteins/${proteinId}`);
          if (response.ok) {
            const protein = await response.json();
            foundProteins.push(protein);
          } else {
            notFoundIds.push(proteinId);
          }
        } catch (error) {
          console.error(`Error fetching ${proteinId}:`, error);
          notFoundIds.push(proteinId);
        }
      }

      setLoading(false);

      if (foundProteins.length === 0) {
        setBatchError(t('noProteinsFound'));
        return;
      }

      // Afficher warning si certaines protéines non trouvées
      if (notFoundIds.length > 0) {
        setBatchError(
          `${notFoundIds.length} ${t('errorSomeNotFound')} ${notFoundIds.join(', ')}`
        );
      }

      // Callback avec les protéines trouvées ET le nom du fichier
      onBatchUpload(foundProteins, file.name);

    } catch (error) {
      console.error('File processing error:', error);
      setBatchError(t('errorFileEmpty'));
    }
  };

  const getPlaceholder = () => {
    if (searchType === 'gene_name') {
      return t('proteinSearchPlaceholderGeneName');
    } else {
      return t('proteinSearchPlaceholderAccession');
    }
  };

  // Si mode batch, afficher BatchUpload
  if (mode === 'batch') {
    return (
      <BatchUpload
        onFileUpload={handleBatchFileUpload}
        uploadedProteins={uploadedProteins}
        uploadedFileName={uploadedFileName}
        onChangeFile={onChangeFile}
        error={batchError}
        hasResults={hasResults}
      />
    );
  }

  // Si mode FASTA
  if (searchType === 'fasta') {
    return (
      <div className="space-y-4">
        {/* ⭐ Toggle 3 boutons - RESPONSIVE MOBILE */}
        <div className="flex justify-start overflow-x-auto">
          <div className="inline-flex bg-slate-900 rounded-lg p-1 border border-slate-700 min-w-min">
            <button
              onClick={() => handleSearchTypeChange('gene_name')}
              className={`w-32 sm:w-40 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                searchType === 'gene_name'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧬 Gene Name
            </button>
            <button
              onClick={() => handleSearchTypeChange('accession')}
              className={`w-32 sm:w-40 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                searchType === 'accession'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔑 UniProt ID
            </button>
            <button
              onClick={() => handleSearchTypeChange('fasta')}
              className={`w-32 sm:w-40 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                searchType === 'fasta'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧬 FASTA
            </button>
          </div>
        </div>

        {/* FASTA Input */}
        <FASTAInput
          onSequenceValidated={onFASTAValidated}
          onClear={() => onFASTAValidated(null)}
        />
      </div>
    );
  }

  // Mode single (Gene Name / UniProt ID)
  return (
    <div className="space-y-4">
      {/* ⭐ Toggle 3 boutons - RESPONSIVE MOBILE */}
      {!selectedProtein && (
        <div className="flex justify-start overflow-x-auto">
          <div className="inline-flex bg-slate-900 rounded-lg p-1 border border-slate-700 min-w-min">
            <button
              onClick={() => handleSearchTypeChange('gene_name')}
              className={`w-32 sm:w-40 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                searchType === 'gene_name'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧬 Gene Name
            </button>
            <button
              onClick={() => handleSearchTypeChange('accession')}
              className={`w-32 sm:w-40 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                searchType === 'accession'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔑 UniProt ID
            </button>
            <button
              onClick={() => handleSearchTypeChange('fasta')}
              className={`w-32 sm:w-40 py-2 rounded-lg transition text-xs sm:text-sm whitespace-nowrap ${
                searchType === 'fasta'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🧬 FASTA
            </button>
          </div>
        </div>
      )}

      {/* Search Input + Button */}
      {!selectedProtein && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={getPlaceholder()}
              className="w-full pl-4 pr-4 py-3 bg-slate-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading || query.length < 2}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                {t('searching')}
              </>
            ) : (
              <>
                <Search size={18} />
                {t('searchButton')}
              </>
            )}
          </button>
        </div>
      )}

      {/* Results List */}
      {!selectedProtein && results.length > 1 && (
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
          <h4 className="text-white text-sm font-semibold mb-3">
            {t('selectCorrectProtein')} ({results.length} {t('resultsFound')})
          </h4>
          
          <div className="space-y-2">
            {results.map((protein) => (
              <label
                key={protein.accession}
                className="flex items-start gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition"
              >
                <input
                  type="radio"
                  name="protein-selection"
                  checked={selectedFromList?.accession === protein.accession}
                  onChange={() => setSelectedFromList(protein)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="text-white font-mono text-sm">
                    {protein.fastaHeader}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    {protein.length} aa · Signal: 1-{protein.signalPeptideEnd}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => selectedFromList && handleValidate(selectedFromList)}
            disabled={!selectedFromList || loading}
            className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            {t('validateSelection')}
          </button>
        </div>
      )}

      {/* No results */}
      {!selectedProtein && !loading && results.length === 0 && hasSearched && (
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-center text-slate-400 text-sm">
          {t('proteinSearchNoResults', { query })}
        </div>
      )}

      {/* Selected Protein Card */}
      {selectedProtein && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-400" size={20} />
              <span className="text-white font-semibold">
                {t('proteinSearchSelected')}
              </span>
            </div>
            
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-white transition text-sm"
            >
              {t('clearButton')}
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="text-blue-300 font-mono text-sm">
              {selectedProtein.fastaHeader}
            </div>
            
            <div className="text-slate-400 text-xs">
              {selectedProtein.length} aa · Signal: 1-{selectedProtein.signalPeptideEnd}
            </div>

            <button
              onClick={() => setShowSequence(!showSequence)}
              className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              {showSequence ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showSequence ? t('hideSequence') : t('viewSequence')}
            </button>

            {showSequence && (
              <div className="mt-2 p-3 bg-slate-900 rounded border border-slate-600">
                <div className="text-slate-300 font-mono text-xs break-all leading-relaxed">
                  {selectedProtein.sequence}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}