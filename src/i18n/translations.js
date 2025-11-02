export const translations = {
  en: {
    // Header
    title: "Peptide Predictor - Svensson Lab",
    subtitle: "Analyze protein sequences with PCSK1/3 cleavage detection",
    labWebsite: "Svensson Lab Website",
    
    // Protein Search
    proteinSearchTitle: "Add Human Secreted Protein",
    proteinSearchPlaceholderGeneName: "Example: POMC, INS, GCG",
    proteinSearchPlaceholderAccession: "Example: P01189, P01308",
    proteinSearchNoResults: "No secreted proteins found for \"{query}\"",
    proteinSearchSelected: "Selected Protein",
    searchByGeneName: "Gene Name",
    searchByAccession: "UniProt ID",
    searchButton: "Search",
    searching: "Searching...",
    selectCorrectProtein: "Select the correct protein",
    resultsFound: "results",
    validateSelection: "Validate Selection",
    viewSequence: "View Sequence",
    hideSequence: "Hide Sequence",
    
    // Detection modes
    modeTitle: "Peptide Detection Mode",
    modeStrict: "STRICT Mode",
    modeStrictDesc: "Complete regex from Nature paper. Fewer results but more reliable.",
    modeStrictNote: "Constraints: lookbehind (?<!K|R), strict spacing verification",
    modePermissive: "PERMISSIVE Mode",
    modePermissiveDesc: "Simplified regex. More results but may include false positives.",
    modePermissiveNote: "Reduced constraints: sensitive detection",
    
    // Parameters
    parametersTitle: "Analysis Parameters",
    recommendedParametersNote: "Recommended parameters based on UniProt annotation",
    resetToRecommended: "Reset to Recommended",
    signalPeptideLength: "Signal peptide length",
    signalPeptideLengthUnit: "aa",
    signalPeptideDesc: "Cleavage sites before this position are ignored",
    minCleavageSites: "Min. cleavage sites",
    minCleavageSitesDesc: "Minimum number of KK/KR/RR/RK motifs required",
    minCleavageSpacing: "Min. spacing",
    minCleavageSpacingUnit: "aa",
    minCleavageSpacingDesc: "Minimum distance between two cleavage sites",
    maxPeptideLength: "Max. peptide length",
    maxPeptideLengthUnit: "aa",
    maxPeptideLengthDesc: "Maximum length of predicted peptides (filter out longer ones)",
    
    // Actions
    analyzeButton: "Analyze",
    analyzing: "Analysis in progress...",
    uploadButton: "Upload",
    clearButton: "Clear",
    
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
    tableHeaderIdGeneName: "ID - Gene Name",
    tableHeaderSequence: "Sequence",
    tableHeaderPosition: "Position",
    tableHeaderLength: "aa",
    tableHeaderBioactivity: "Bioactivity Score",
    tableHeaderBioactivitySource: "(Source: PeptideRanker API / Lab ML Bioactivity Model)",
    tableHeaderSize: "Size",
    tableHeaderUniProt: "UniProt Status",
    tableHeaderUniProtSubtitle: "(Known peptide annotation)",
    tableHeaderMotif: "Motif",
    
    // Size categories
    sizeTiny: "Tiny",
    sizeSmall: "Small",
    sizeMedium: "Medium",
    sizeLarge: "Large",
    sizeXLarge: "X-Large",
    
    optimal: "✓ Optimal",
    outOfRange: "Out of range",
    
    // Errors
    errorSelectProtein: "Please select a protein",
    errorInvalidCharacters: "The sequence contains invalid characters.",
    errorServer: "Error:",
    
    // Footer
    footerDeveloped: "Developed at Svensson Lab, Stanford Medicine",
    footerLabLink: "Visit Svensson Lab Website",
    reference: "Based on: Coassolo et al. Nature 2025 - doi:10.1038/s41586-025-08683-y"
  },
  
  fr: {
    // Header
    title: "Prédicteur de Peptides - Svensson Lab",
    subtitle: "Analysez les séquences protéiques avec détection PCSK1/3",
    labWebsite: "Site du Svensson Lab",
    
    // Recherche Protéine
    proteinSearchTitle: "Ajouter Protéine Sécrétée Humaine",
    proteinSearchPlaceholderGeneName: "Exemple: POMC, INS, GCG",
    proteinSearchPlaceholderAccession: "Exemple: P01189, P01308",
    proteinSearchNoResults: "Aucune protéine sécrétée trouvée pour \"{query}\"",
    proteinSearchSelected: "Protéine Sélectionnée",
    searchByGeneName: "Nom du Gène",
    searchByAccession: "ID UniProt",
    searchButton: "Rechercher",
    searching: "Recherche...",
    selectCorrectProtein: "Sélectionnez la bonne protéine",
    resultsFound: "résultats",
    validateSelection: "Valider la Sélection",
    viewSequence: "Voir la Séquence",
    hideSequence: "Masquer la Séquence",
    
    // Modes de détection
    modeTitle: "Mode de Détection de Peptides",
    modeStrict: "Mode STRICT",
    modeStrictDesc: "Regex complète du papier Nature. Moins de résultats mais plus fiables.",
    modeStrictNote: "Contraintes: lookbehind (?<!K|R), vérification espacement stricte",
    modePermissive: "Mode PERMISSIF",
    modePermissiveDesc: "Regex simplifiée. Plus de résultats mais peut inclure des faux positifs.",
    modePermissiveNote: "Contraintes réduites: détection sensible",
    
    // Paramètres
    parametersTitle: "Paramètres d'Analyse",
    recommendedParametersNote: "Paramètres recommandés basés sur l'annotation UniProt",
    resetToRecommended: "Réinitialiser aux Recommandés",
    signalPeptideLength: "Longueur du peptide signal",
    signalPeptideLengthUnit: "aa",
    signalPeptideDesc: "Sites de clivage avant cette position sont ignorés",
    minCleavageSites: "Min. sites de clivage",
    minCleavageSitesDesc: "Nombre minimum de motifs KK/KR/RR/RK requis",
    minCleavageSpacing: "Min. espacement",
    minCleavageSpacingUnit: "aa",
    minCleavageSpacingDesc: "Distance minimum entre deux sites de clivage",
    maxPeptideLength: "Max. longueur peptide",
    maxPeptideLengthUnit: "aa",
    maxPeptideLengthDesc: "Longueur maximale des peptides prédits (filtrer les plus longs)",
    
    // Actions
    analyzeButton: "Analyser",
    analyzing: "Analyse en cours...",
    uploadButton: "Télécharger",
    clearButton: "Effacer",
    
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
    tableHeaderIdGeneName: "ID - Nom du Gène",
    tableHeaderSequence: "Séquence",
    tableHeaderPosition: "Position",
    tableHeaderLength: "aa",
    tableHeaderBioactivity: "Score de Bioactivité",
    tableHeaderBioactivitySource: "(Source : API PeptideRanker / Modèle ML Lab Bioactivité)",
    tableHeaderSize: "Taille",
    tableHeaderUniProt: "Statut UniProt",
    tableHeaderUniProtSubtitle: "(Annotation peptide connu)",
    tableHeaderMotif: "Motif",
    
    // Catégories de taille
    sizeTiny: "Minuscule",
    sizeSmall: "Petite",
    sizeMedium: "Moyenne",
    sizeLarge: "Grande",
    sizeXLarge: "Très Grande",
    
    optimal: "✓ Optimal",
    outOfRange: "Hors gamme",
    
    // Erreurs
    errorSelectProtein: "Veuillez sélectionner une protéine",
    errorInvalidCharacters: "La séquence contient des caractères invalides.",
    errorServer: "Erreur:",
    
    // Pied de page
    footerDeveloped: "Développé au Svensson Lab, Stanford Medicine",
    footerLabLink: "Visiter le site du Svensson Lab",
    reference: "Basé sur: Coassolo et al. Nature 2025 - doi:10.1038/s41586-025-08683-y"
  }
};