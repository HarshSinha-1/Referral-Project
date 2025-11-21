// components/VoiceRecording.tsx
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Check, X, Loader } from 'lucide-react';

interface VoiceRecordingProps {
  onTranscriptAccepted: (transcript: string) => void;
  onCancel: () => void;
  isDarkMode: boolean;
  currentLanguage: string;
  supportedLanguages: Record<string, string>;
  onLanguageChange: (language: string) => void;
}

export const VoiceRecording: React.FC<VoiceRecordingProps> = ({
  onTranscriptAccepted,
  onCancel,
  isDarkMode,
  currentLanguage,
  supportedLanguages,
  onLanguageChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = currentLanguage;

        recognitionInstance.onstart = () => {
          setIsRecording(true);
          setIsProcessing(false);
          setTranscript('');
        };

        recognitionInstance.onresult = (event: any) => {
          let final = '';
          let interim = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript;
            } else {
              interim += transcript;
            }
          }

          if (final) {
            setTranscript(prev => prev + ' ' + final);
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsProcessing(false);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
          setIsProcessing(true);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [currentLanguage]);

  const startRecording = () => {
    if (recognition) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const handleAccept = () => {
    onTranscriptAccepted(transcript.trim());
    setTranscript('');
    setIsProcessing(false);
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    setTranscript('');
    setIsProcessing(false);
    onCancel();
  };

  const handleRetry = () => {
    setTranscript('');
    setIsProcessing(false);
    startRecording();
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isRecording 
        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
        : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    } transition-all duration-300`}>
      {/* Language Selector */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={`p-2 rounded-lg text-sm border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          disabled={isRecording}
        >
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          {isRecording && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 dark:text-red-400">
                Recording...
              </span>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center space-x-2">
              <Loader size={16} className="animate-spin text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Processing...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        {!isRecording && !isProcessing && (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
          >
            <Mic size={20} />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          >
            <MicOff size={20} />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className={`p-4 rounded-lg mb-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } border ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h4 className={`font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Speech:
          </h4>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {transcript}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {(isProcessing || transcript) && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleAccept}
            disabled={!transcript.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Check size={18} />
            <span>Accept Text</span>
          </button>

          <button
            onClick={handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Volume2 size={18} />
            <span>Record Again</span>
          </button>

          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className={`text-center mt-4 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {!isRecording && !isProcessing && (
          <p>Click "Start Recording" and speak in {supportedLanguages[currentLanguage]}</p>
        )}
        {isRecording && (
          <p>🔴 Speak now... Click "Stop Recording" when finished</p>
        )}
        {isProcessing && (
          <p>Processing your speech... Please wait</p>
        )}
      </div>
    </div>
  );
};