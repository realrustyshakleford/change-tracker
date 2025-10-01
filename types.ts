
export interface AnalysisResult {
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smogIndex: number;
  daleChall: number;
  lexicalDensity: number;
  lexicalDiversity: number;
  wordFrequency: { word: string; count: number }[];
  passiveVoiceCount: number;
  sentenceStructure: {
    simple: number;
    compound: number;
    complex: number;
    compoundComplex: number;
  };
  weakWordCount: number;
}

export interface AnalysisComparison {
  original: AnalysisResult;
  revised: AnalysisResult;
}
