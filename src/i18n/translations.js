export const translations = {
  en: {
    // Header
    title: "Peptide Predictor",
    subtitle: "Analyze protein sequences with PCSK1/3 cleavage detection (Coassolo et al. Nature 2025)",
    
    // Detection modes
    modeTitle: "Detection Mode",
    modeStrict: "STRICT Mode (Recommended)",
    modeStrictDesc: "Complete regex from Nature paper. Fewer results but more reliable.",
    modeStrictNote: "Constraints: lookbehind (?<!K|R), strict spacing verification",
    modePermissive: "PERMISSIVE Mode",
    modePermissiveDesc: "Simplified regex. More results but may include false positives.",
    modePermissiveNote: "Reduced constraints: sensitive detection",
    
    // Sequence input
    sequenceTitle: "Protein Sequence",
    sequencePlaceholder: "Paste your FASTA or protein sequence here...",
    uploadButton: "Upload",
    clearButton: "Clear",
    
    // Parameters
    parametersTitle: "Parameters",
    signalPeptideLength: "Signal peptide length",
    signalPeptideLengthUnit: "aa",
    signalPeptideDesc: "Cleavage sites before this position are ignored",
    minCleavageSites: "Min. cleavage sites",
    minCleavageSitesDesc: "Minimum number of KK/KR/RR/RK motifs required",
    minCleavageSpacing: "Min. spacing",
    minCleavageSpacingUnit: "aa",
    minCleavageSpacingDesc: "Minimum distance between two cleavage sites",
    
    // Actions
    analyzeButton: "Analyze",
    analyzing: "Analysis in progress...",
    
    // Results
    resultsTitle: "Results",
    sequenceLength: "Sequence length",
    cleavageSitesDetected: "Cleavage sites detected",
    peptidesIdentified: "Peptides identified",
    peptidesInRange: "Peptides in optimal range",
    optimalRangeNote: "Optimal range for bioactivity",
    cleavageMotifs: "Cleavage motifs",
    downloadCSV: "Download CSV",
    
    // Peptides table
    peptidesTableTitle: "Predicted Peptides",
    peptidesInRangeNote: "peptides in optimal range (5-25 aa)",
    tableHeaderNumber: "#",
    tableHeaderSequence: "Sequence",
    tableHeaderPosition: "Position",
    tableHeaderLength: "aa",
    tableHeaderBioactivity: "Bioactivity",
    tableHeaderRange: "Range",
    tableHeaderMotif: "Motif",
    optimal: "✓ Optimal",
    outOfRange: "Out of range",
    
    // Errors
    errorEnterSequence: "Please enter a protein sequence",
    errorInvalidCharacters: "The sequence contains invalid characters.",
    errorServer: "Error:",
    
    // Footer
    reference: "Based on: Coassolo et al. Nature 2025 - doi:10.1038/s41586-025-08683-y"
  },
  
  fr: {
    // Header
    title: "Prédicteur de Peptides",
    subtitle: "Analysez les séquences protéiques avec détection PCSK1/3 (Coassolo et al. Nature 2025)",
    
    // Modes de détection
    modeTitle: "Mode de détection",
    modeStrict: "Mode STRICT (Recommandé)",
    modeStrictDesc: "Regex complète du papier Nature. Moins de résultats mais plus fiables.",
    modeStrictNote: "Contraintes: lookbehind (?<!K|R), vérification espacement stricte",
    modePermissive: "Mode PERMISSIF",
    modePermissiveDesc: "Regex simplifiée. Plus de résultats mais peut inclure des faux positifs.",
    modePermissiveNote: "Contraintes réduites: détection sensible",
    
    // Saisie séquence
    sequenceTitle: "Séquence Protéique",
    sequencePlaceholder: "Collez votre séquence FASTA ou protéique ici...",
    uploadButton: "Télécharger",
    clearButton: "Effacer",
    
    // Paramètres
    parametersTitle: "Paramètres",
    signalPeptideLength: "Longueur du peptide signal",
    signalPeptideLengthUnit: "aa",
    signalPeptideDesc: "Sites de clivage avant cette position sont ignorés",
    minCleavageSites: "Min. sites de clivage",
    minCleavageSitesDesc: "Nombre minimum de motifs KK/KR/RR/RK requis",
    minCleavageSpacing: "Min. espacement",
    minCleavageSpacingUnit: "aa",
    minCleavageSpacingDesc: "Distance minimum entre deux sites de clivage",
    
    // Actions
    analyzeButton: "Analyser",
    analyzing: "Analyse en cours...",
    
    // Résultats
    resultsTitle: "Résultats",
    sequenceLength: "Longueur de séquence",
    cleavageSitesDetected: "Sites de clivage détectés",
    peptidesIdentified: "Peptides identifiés",
    peptidesInRange: "Peptides dans la gamme optimale",
    optimalRangeNote: "Gamme optimale pour bioactivité",
    cleavageMotifs: "Motifs de clivage",
    downloadCSV: "Télécharger CSV",
    
    // Tableau peptides
    peptidesTableTitle: "Peptides Prédits",
    peptidesInRangeNote: "peptides dans la gamme optimale (5-25 aa)",
    tableHeaderNumber: "#",
    tableHeaderSequence: "Séquence",
    tableHeaderPosition: "Position",
    tableHeaderLength: "aa",
    tableHeaderBioactivity: "Bioactivité",
    tableHeaderRange: "Gamme",
    tableHeaderMotif: "Motif",
    optimal: "✓ Optimal",
    outOfRange: "Hors gamme",
    
    // Erreurs
    errorEnterSequence: "Veuillez entrer une séquence protéique",
    errorInvalidCharacters: "La séquence contient des caractères invalides.",
    errorServer: "Erreur:",
    
    // Pied de page
    reference: "Basé sur: Coassolo et al. Nature 2025 - doi:10.1038/s41586-025-08683-y"
  }
};