import React, { useState, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextInputPanel from './components/TextInputPanel';
import Dashboard from './components/Dashboard';
import { ScaleIcon } from './components/icons';
import { AnalysisComparison } from './types';
import { analyzeText } from './services/textAnalysisService';
import { getAIAnalysis } from './services/geminiService';
import { extractTextFromFile, extractTextFromUrl } from './services/contentExtractorService';
import DashboardSkeleton from './components/DashboardSkeleton';
import { ThemeContext } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import ProgressBar from './components/ProgressBar';

const App: React.FC = () => {
  const [originalText, setOriginalText] = useState('');
  const [revisedText, setRevisedText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisComparison | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState({ original: false, revised: false });
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const { theme } = useContext(ThemeContext);

  const handleCompare = useCallback(async () => {
    if (!process.env.API_KEY) {
      setError('A Gemini API key is not configured. Please set the API_KEY environment variable.');
      return;
    }
    if (!originalText || !revisedText) {
      setError('Please provide both original and revised text to compare.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysis(null);
    setAiSummary('');
    
    const setProgressState = async (p: number, m: string) => {
        setProgress(p);
        setProgressMessage(m);
        // Yield to event loop to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 50));
    };

    try {
      await setProgressState(0, 'Preparing for analysis...');

      // Step 1: Data Pre-processing & Synthesis
      await setProgressState(10, 'Data Pre-processing & Synthesis...');
      const originalAnalysis = analyzeText(originalText);
      const revisedAnalysis = analyzeText(revisedText);
      const comparison: AnalysisComparison = { original: originalAnalysis, revised: revisedAnalysis };
      setAnalysis(comparison);
      await setProgressState(30, 'Data Pre-processing & Synthesis...');
      
      // Step 2: Strategic Prompt Engineering
      await setProgressState(35, 'Strategic Prompt Engineering...');
      const getDelta = (original: number, revised: number): string => {
          if (original === 0) return revised > 0 ? '+100.0%' : '0.0%';
          const change = ((revised - original) / original) * 100;
          return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
      };
      
      const { original, revised } = comparison;
      const prompt = `
        You are an expert editor providing a qualitative analysis of changes between two text documents.
        Based on the provided texts and the statistical analysis below, generate a concise, human-readable "High-Level Overview" of the changes.
        Synthesize the data into an executive summary. Use Markdown for formatting (e.g., headers, bold text, lists).
        Describe the key shifts in structure, readability, vocabulary, and style.
        Explain *how* and *why* the changes matter.

        **Statistical Deltas:**
        - Total Word Count: ${getDelta(original.wordCount, revised.wordCount)}
        - Average Sentence Length: ${getDelta(original.avgSentenceLength, revised.avgSentenceLength)}
        - Flesch Reading Ease: ${getDelta(original.fleschReadingEase, revised.fleschReadingEase)} (Higher is easier)
        - Flesch-Kincaid Grade Level: ${getDelta(original.fleschKincaidGrade, revised.fleschKincaidGrade)}
        - Passive Voice Sentences: ${getDelta(original.passiveVoiceCount, revised.passiveVoiceCount)}
        - Lexical Density: ${getDelta(original.lexicalDensity, revised.lexicalDensity)} (Higher is more informative)
        - Lexical Diversity: ${getDelta(original.lexicalDiversity, revised.lexicalDiversity)} (Higher is richer vocabulary)

        **Original Text:**
        ---
        ${originalText}
        ---

        **Revised Text:**
        ---
        ${revisedText}
        ---

        **Your High-Level Overview (in Markdown):**
      `;

      // Step 3-7: The Gemini API call with simulated internal progress steps
      const geminiPromise = getAIAnalysis(prompt);

      // This promise runs in parallel to the API call to simulate Gemini's internal steps
      const progressSimulationPromise = (async () => {
          await setProgressState(40, "Contacting Gemini with Context...");
          await new Promise(r => setTimeout(r, 500));
          await setProgressState(50, "Waiting for Gemini's Analysis...");
          await new Promise(r => setTimeout(r, 1000));
          await setProgressState(70, "Gemini Correlating Statistical Deltas with Texts...");
          await new Promise(r => setTimeout(r, 1000));
          await setProgressState(90, "Gemini Synthesizing Information into Coherent Summary...");
      })();

      // Wait for both the real API call and the progress simulation to complete
      const [summary] = await Promise.all([geminiPromise, progressSimulationPromise]);
      setAiSummary(summary);
      
      // Step 7: Receiving and preparing the response
      await setProgressState(95, "Receiving Markdown Text from Gemini...");
      
      // Step 8: Finalize and display
      await setProgressState(100, "Displaying Results as Styled HTML...");
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Keep final message visible briefly

    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [originalText, revisedText]);
  
  const handleFileChange = async (file: File, panel: 'original' | 'revised') => {
    setIsProcessing(p => ({ ...p, [panel]: true }));
    setError(null);
    try {
      const text = await extractTextFromFile(file);
      if (panel === 'original') setOriginalText(text);
      else setRevisedText(text);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(p => ({ ...p, [panel]: false }));
    }
  };
  
  const handleUrlSubmit = async (url: string, panel: 'original' | 'revised') => {
    setIsProcessing(p => ({ ...p, [panel]: true }));
    setError(null);
    try {
        const text = await extractTextFromUrl(url);
        if (panel === 'original') setOriginalText(text);
        else setRevisedText(text);
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setIsProcessing(p => ({ ...p, [panel]: false }));
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-300 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text`}>
       <div className="fixed inset-0 -z-10 h-full w-full bg-light-bg dark:bg-dark-bg bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       <div className="fixed inset-0 -z-20 h-full w-full bg-gradient-to-br from-indigo-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-950 dark:to-black animate-aurora"></div>

      <div className="max-w-7xl mx-auto">
        <header className="relative text-center py-4 md:py-8 mb-8">
            <div className="absolute top-1/2 -translate-y-1/2 right-0">
              <ThemeToggle />
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    <ScaleIcon className="w-12 h-12 md:w-16 md:h-16 text-light-accent dark:text-dark-accent" />
                    <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wide text-light-text dark:text-dark-text">
                    Change Tracker
                    </h1>
                </div>
                <p className="max-w-3xl text-base md:text-lg text-light-text/80 dark:text-dark-text/80 leading-relaxed">
                    Welcome to the world's best change tracker for writers, editors and other text enjoyers, offering you a full suite of modern, advanced features, all for free.
                </p>
            </div>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[50vh] lg:min-h-[450px] mb-6">
            <div className="lg:col-span-3 h-full">
              <TextInputPanel
                title="Original Text"
                text={originalText}
                onTextChange={setOriginalText}
                onFileChange={(file) => handleFileChange(file, 'original')}
                onUrlSubmit={(url) => handleUrlSubmit(url, 'original')}
                isProcessing={isProcessing.original}
                placeholder="Paste the original text here..."
              />
            </div>
             <div className="lg:col-span-2 h-full">
              <TextInputPanel
                title="Revised Text"
                text={revisedText}
                onTextChange={setRevisedText}
                onFileChange={(file) => handleFileChange(file, 'revised')}
                onUrlSubmit={(url) => handleUrlSubmit(url, 'revised')}
                isProcessing={isProcessing.revised}
                placeholder="Paste the newer text here..."
              />
            </div>
          </div>

          <div className="text-center">
            <motion.button
              onClick={handleCompare}
              disabled={isLoading || isProcessing.original || isProcessing.revised}
              className="font-display bg-light-accent dark:bg-dark-accent text-white font-bold py-3 px-10 rounded-lg border-3 border-light-border dark:border-dark-border shadow-brutal dark:shadow-brutal-light transition-all duration-200 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
              whileHover={{ y: -2, x: -2, boxShadow: theme === 'dark' ? '8px 8px 0 0 #fff' : '8px 8px 0 0 #000' }}
              whileTap={{ y: 1, x: 1, boxShadow: theme === 'dark' ? '3px 3px 0 0 #fff' : '3px 3px 0 0 #000' }}
            >
              {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
              ) : (
                'Compare Texts'
              )}
            </motion.button>
          </div>
          
          <div className="h-20">
            <AnimatePresence>
                {isLoading && (
                    <ProgressBar progress={progress} message={progressMessage} />
                )}
            </AnimatePresence>
          </div>


          <AnimatePresence>
            {error && (
              <motion.div 
                role="alert" 
                className="mt-4 text-center text-red-800 dark:text-red-200 bg-red-500/20 border-2 border-red-500/50 p-3 rounded-lg max-w-2xl mx-auto font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                  {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10">
            <AnimatePresence>
                {isLoading && <DashboardSkeleton />}
                {!isLoading && analysis && aiSummary && (
                    <Dashboard 
                        analysis={analysis} 
                        aiSummary={aiSummary}
                        originalText={originalText}
                        revisedText={revisedText}
                    />
                )}
            </AnimatePresence>
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400/50 text-sm">
            <p>Powered by Gemini & Advanced Stylistic Metrics</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
