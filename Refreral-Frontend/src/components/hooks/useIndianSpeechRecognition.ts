import { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Supported Indian languages
export const INDIAN_LANGUAGES = {
  'bn-IN': 'Bengali (India)',
  'hi-IN': 'Hindi',
  'ta-IN': 'Tamil', 
  'te-IN': 'Telugu',
  'kn-IN': 'Kannada',
  'ml-IN': 'Malayalam',
  'mr-IN': 'Marathi',
  'gu-IN': 'Gujarati',
  'pa-IN': 'Punjabi',
  'or-IN': 'Odia',
  'as-IN': 'Assamese',
  'kok-IN': 'Konkani',
  'doi-IN': 'Dogri',
  'ks-IN': 'Kashmiri',
  'mai-IN': 'Maithili',
  'mni-IN': 'Manipuri',
  'sat-IN': 'Santali',
  'sd-IN': 'Sindhi',
  'ur-IN': 'Urdu',
  'en-IN': 'English (India)'
};

interface SpeechState {
  transcript: string;
  isListening: boolean;
  language: string;
  isSupported: boolean;
  error: string;
}

export const useIndianSpeechRecognition = () => {
  const [language, setLanguage] = useState('en-IN');
  const [error, setError] = useState('');
  
  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Check if specific Indian languages are supported
  const checkLanguageSupport = (lang: string) => {
    // Chrome has best support for Indian languages in Web Speech API
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = userAgent.includes('chrome');
    return isChrome; // Conservative approach
  };

  const startListening = async (lang = language) => {
    try {
      setError('');
      
      // Try Web Speech API first (free)
      if (browserSupportsSpeechRecognition && checkLanguageSupport(lang)) {
        await SpeechRecognition.startListening({
          continuous: true,
          language: lang
        });
      } else {
        throw new Error('Browser does not support Indian language speech recognition. Try Chrome browser for best support.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start speech recognition');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const changeLanguage = (newLang: string) => {
    setLanguage(newLang);
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(newLang), 100);
    }
  };

  return {
    transcript,
    isListening,
    language,
    isSupported: browserSupportsSpeechRecognition,
    error,
    startListening,
    stopListening,
    resetTranscript,
    changeLanguage,
    supportedLanguages: INDIAN_LANGUAGES
  };
};