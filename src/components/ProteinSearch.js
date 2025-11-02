import React, { useState } from 'react';
import { Search, Loader, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import ToggleSwitch from './ToggleSwitch';

export default function ProteinSearch({ onProteinSelect, apiUrl }) {
  const { t } = useTranslation();
  
  const [searchType, setSearchType] = useState('gene_name'); // 'gene_name' ou 'accession'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [selectedFromList, setSelectedFromList] = useState(null);
  const [showSequence, setShowSequence] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
        
        // Validation auto si 1 seul résultat
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
    setQuery('');
    setResults([]);
    setSelectedProtein(null);
    setSelectedFromList(null);
    setShowSequence(false);
    setHasSearched(false);
    onProteinSelect(null);
  };

  const getPlaceholder = () => {
    if (searchType === 'gene_name') {
      return t('proteinSearchPlaceholderGeneName');
    } else {
      return t('proteinSearchPlaceholderAccession');
    }
  };

  // Options pour le toggle
  const toggleOptions = [
    { value: 'gene_name', label: t('searchByGeneName') },
    { value: 'accession', label: t('searchByAccession') }
  ];

  return (
    <div className="space-y-4">
      
      {/* ⭐ NOUVEAU : Toggle Switch stylisé */}
      {!selectedProtein && (
        <div className="flex justify-start">
          <ToggleSwitch
            options={toggleOptions}
            selected={searchType}
            onChange={setSearchType}
            leftIcon="🧬"
            rightIcon="🔑"
          />
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

      {/* Results List (for multiple results) */}
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

            {/* Sequence collapsible */}
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