import React, { useRef } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

export default function BatchUpload({ 
  onFileUpload, 
  uploadedProteins,
  uploadedFileName,
  onChangeFile,
  error,
  hasResults
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  // Si fichier déjà uploadé ET pas encore de résultats, afficher le résumé
  if (uploadedProteins && uploadedProteins.length > 0 && !hasResults) {
    return (
      <div className="space-y-4">
        {/* File Info */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-400" size={20} />
            <div>
              <p className="text-white font-medium text-sm">{uploadedFileName}</p>
              <p className="text-slate-400 text-xs">{uploadedProteins.length} proteins</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            <span className="text-white font-medium">
              {uploadedProteins.length} {t('proteinsRecognized')}
            </span>
          </div>
        </div>

        {/* Error Message (if any) */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
            <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Si résultats existent (analyse terminée), afficher juste le nom du fichier
  if (hasResults && uploadedFileName) {
    return (
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-center gap-3">
        <FileText className="text-blue-400" size={20} />
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{uploadedFileName}</p>
          <p className="text-slate-400 text-xs">{uploadedProteins?.length || 0} proteins analyzed</p>
        </div>
      </div>
    );
  }

  // Sinon, afficher la zone d'upload
  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-900/50 transition"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload className="mx-auto mb-4 text-slate-400" size={48} />
        
        <p className="text-white font-medium mb-2">
          {t('dropFileHere')}
        </p>
        
        <p className="text-red-400 text-sm font-medium">
          One UniProt ID per line (max 15) · .txt files only
        </p>
      </div>

      {/* Example Format */}
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
        <div className="flex items-start gap-3">
          <FileText className="text-blue-400 flex-shrink-0 mt-1" size={20} />
          <div className="flex-1">
            <p className="text-slate-300 text-sm font-medium mb-2">
              {t('exampleFormat')}
            </p>
            <div className="bg-slate-800 rounded p-3 font-mono text-xs text-slate-400">
              {t('exampleIds').split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
          <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}