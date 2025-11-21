import React, { useRef, useState } from "react";
import { Mic, MicOff, Check, X } from "lucide-react";

interface VoiceRecognitionProps {
  isDarkMode: boolean;
  selectedDocuments: number[];
  onAcceptTranscript: (text: string) => void;
  onRejectTranscript: () => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const supportedLanguages = [
  { code: "en-US", name: "English" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "it-IT", name: "Italian" },
  { code: "pt-PT", name: "Portuguese" },
  { code: "nl-NL", name: "Dutch" },
  { code: "ru-RU", name: "Russian" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ar-SA", name: "Arabic" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "hi-IN", name: "Hindi" },
  { code: "bn-IN", name: "Bengali" },
  { code: "ta-IN", name: "Tamil" },
  { code: "te-IN", name: "Telugu" },
  { code: "mr-IN", name: "Marathi" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "pa-IN", name: "Punjabi" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "kn-IN", name: "Kannada" },
  { code: "or-IN", name: "Odia" },
  { code: "ur-IN", name: "Urdu" },
];

export const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  isDarkMode,
  selectedDocuments,
  onAcceptTranscript,
  onRejectTranscript,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "speech.webm");
        formData.append("language", selectedLanguage);

        try {
          const res = await fetch("http://localhost:5000/api/users/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.transcript) {
            setFinalTranscript(data.transcript);
            setShowConfirmation(true);
          }
        } catch (err) {
          console.error("Transcription error:", err);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleAccept = () => {
    onAcceptTranscript(finalTranscript);
    setShowConfirmation(false);
    setFinalTranscript("");
  };

  const handleReject = () => {
    onRejectTranscript();
    setShowConfirmation(false);
    setFinalTranscript("");
  };

  return (
    <div className="space-y-3">
      {/* Language Selector */}
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={`p-1 text-sm rounded ${
            isDarkMode ? "bg-[#23232a] text-[#e4e4e4]" : "bg-white text-gray-900"
          }`}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Input Button */}
      <button
        onClick={toggleRecording}
        disabled={selectedDocuments.length === 0 || isProcessing}
        className={`p-2 rounded-full transition-colors ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "hover:bg-[#18181b]"
        }`}
        title={isRecording ? "Stop voice input" : "Start voice input"}
      >
        {isRecording ? (
          <MicOff size={20} className="text-white" />
        ) : (
          <Mic size={20} className="text-[#a6adc8]" />
        )}
      </button>

      {/* Confirmation UI */}
      {showConfirmation && (
        <div
          className={`mb-3 p-3 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } flex items-center justify-between`}
        >
          <div className="flex-1">
            <p className="text-sm mb-1">Voice input detected:</p>
            <p
              className={`font-medium ${
                isProcessing ? "text-gray-400" : ""
              }`}
            >
              {finalTranscript || "Processing..."}
            </p>
          </div>
          <div className="flex space-x-2 ml-3">
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 rounded-full transition-colors"
              title="Accept transcription"
            >
              <Check size={16} className="text-white" />
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 rounded-full transition-colors"
              title="Reject transcription"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
