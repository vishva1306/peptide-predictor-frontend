import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function FASTAInput({ onSequenceValidated, onClear }) {
  const [fastaText, setFastaText] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateFASTA = (text) => {
    if (!text || text.trim().length === 0) {
      setError('');
      setIsValid(false);
      return null;
    }

    const lines = text.trim().split('\n');
    let header = null;
    let sequence = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('>')) {
        header = trimmed.substring(1).trim();
      } else {
        sequence += trimmed.toUpperCase();
      }
    }

    // Validation : uniquement lettres A-Z
    const invalidChars = sequence.match(/[^A-Z]/g);
    if (invalidChars) {
      const uniqueInvalid = [...new Set(invalidChars)].join(', ');
      setError(`Invalid characters found: ${uniqueInvalid}. Only amino acids (A-Z) are allowed.`);
      setIsValid(false);
      return null;
    }

    // Validation : longueur minimale
    if (sequence.length < 30) {
      setError(`Sequence too short (${sequence.length} aa). Minimum 30 amino acids required.`);
      setIsValid(false);
      return null;
    }

    setError('');
    setIsValid(true);

    return {
      sequence,
      header,
      length: sequence.length
    };
  };

  const handleChange = (e) => {
    const text = e.target.value;
    setFastaText(text);

    const validated = validateFASTA(text);
    if (validated) {
      onSequenceValidated(validated);
    } else {
      onSequenceValidated(null);
    }
  };

  const handleClearClick = () => {
    setFastaText('');
    setError('');
    setIsValid(false);
    onClear();
  };

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={fastaText}
          onChange={handleChange}
          placeholder="Paste FASTA sequence here"
          className={`w-full p-4 bg-slate-900 text-white border rounded-lg focus:outline-none font-mono text-sm resize-none ${
            error 
              ? 'border-red-500 focus:border-red-500' 
              : isValid 
              ? 'border-green-500 focus:border-green-500'
              : 'border-slate-600 focus:border-blue-500'
          }`}
          rows={5}
          spellCheck={false}
        />
        
        {/* Clear button (si texte présent) */}
        {fastaText && (
          <button
            onClick={handleClearClick}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 flex gap-2">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {isValid && !error && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 flex gap-2">
          <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-green-300 text-sm">
            <p className="font-medium">Valid sequence ({fastaText.split('\n').filter(l => l.trim() && !l.startsWith('>')).join('').length} amino acids)</p>
            {fastaText.trim().startsWith('>') && (
              <p className="text-green-400 text-xs mt-1">Header detected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}