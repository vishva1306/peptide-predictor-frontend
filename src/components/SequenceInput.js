import React from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function SequenceInput({ sequence, setSequence, onFileUpload }) {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <label className="block text-white font-semibold mb-3">
        {t('sequenceTitle')}
      </label>
      
      <textarea
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        placeholder={t('sequencePlaceholder')}
        className="w-full h-40 bg-slate-900 text-white border border-slate-600 rounded p-3 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
      />
      
      <div className="mt-3 flex gap-2">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition">
          <Upload size={18} />
          {t('uploadButton')}
          <input
            type="file"
            accept=".fasta,.fa,.txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
        
        <button
          onClick={() => setSequence('')}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition"
        >
          {t('clearButton')}
        </button>
      </div>
    </div>
  );
}