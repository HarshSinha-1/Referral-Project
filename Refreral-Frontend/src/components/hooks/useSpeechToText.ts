// hooks/useSpeechToText.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechToTextState {
  isRecording: boolean;
  transcript: string;
  isSupported: boolean;
  error: string;
  isProcessing: boolean;
  language: string;
}

export const useSpeechToText = () => {
  const [state, setState] = useState<SpeechToTextState>({
    isRecording: false,
    transcript: '',
    isSupported: false,
    error: '',
    isProcessing: false,
    language: 'en-IN'
  });

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  // Supported Indian languages
  const supportedLanguages = {
    'en-IN': 'English (India)',
    'hi-IN': 'Hindi',
    'bn-IN': 'Bengali',
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
    'ur-IN': 'Urdu'
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: false }));
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = state.language;

    recognition.onstart = () => {
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        error: '',
        isProcessing: false 
      }));
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript with both final and interim results
      setState(prev => ({
        ...prev,
        transcript: finalTranscriptRef.current + interimTranscript
      }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
        isProcessing: false
      }));
    };

    recognition.onend = () => {
      setState(prev => ({ 
        ...prev, 
        isRecording: false,
        isProcessing: true
      }));
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [state.language]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || !state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Speech recognition not supported in this browser' 
      }));
      return;
    }

    try {
      setState(prev => ({ 
        ...prev, 
        transcript: '',
        error: '',
        isProcessing: false
      }));
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start recording. Please try again.',
        isRecording: false
      }));
    }
  }, [state.isSupported]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && state.isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  }, [state.isRecording]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
    finalTranscriptRef.current = '';
  }, []);

  const setLanguage = useCallback((newLanguage: string) => {
    setState(prev => ({ ...prev, language: newLanguage }));
  }, []);

  const getFinalTranscript = useCallback(() => {
    return finalTranscriptRef.current.trim();
  }, []);

  return {
    // State
    isRecording: state.isRecording,
    transcript: state.transcript,
    isSupported: state.isSupported,
    error: state.error,
    isProcessing: state.isProcessing,
    language: state.language,
    
    // Methods
    startRecording,
    stopRecording,
    resetTranscript,
    setLanguage,
    getFinalTranscript,
    
    // Constants
    supportedLanguages
  };
};