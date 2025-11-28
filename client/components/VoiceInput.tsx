import { useState } from "react";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, X } from "lucide-react";
import { announceToScreenReader } from "@/hooks/use-accessibility";

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showVoiceButton?: boolean;
  onTranscriptComplete?: (transcript: string) => void;
}

export function VoiceInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  showVoiceButton = true,
  onTranscriptComplete,
}: VoiceInputProps) {
  const {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
  } = useVoiceInput((text) => {
    onChange(value + (value ? " " : "") + text);
    onTranscriptComplete?.(text);
  });

  const [showError, setShowError] = useState(false);

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative w-full">
      {/* Main Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isListening}
          className={`flex-1 ${isListening ? "ring-2 ring-blue-500" : ""} ${className}`}
          aria-label={placeholder}
          aria-live="polite"
          aria-describedby={error ? "voice-error" : undefined}
        />

        {/* Clear button */}
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            disabled={disabled || isListening}
            aria-label="Clear input"
            className="hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </Button>
        )}

        {/* Voice Input Button */}
        {showVoiceButton && isSupported && (
          <>
            <Button
              type="button"
              variant={isListening ? "default" : "outline"}
              size="icon"
              onClick={handleVoiceButtonClick}
              disabled={disabled}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              aria-pressed={isListening}
              title={isListening ? "Stop listening (Esc)" : "Click to speak"}
              className={
                isListening
                  ? "bg-blue-600 hover:bg-blue-700 text-white animate-pulse"
                  : "hover:bg-blue-50"
              }
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            {/* Keyboard shortcut hint */}
            <span className="sr-only">
              Keyboard shortcut: Press Alt+M to toggle voice input
            </span>
          </>
        )}
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm text-blue-700 font-medium">
              Listening... (Press Esc to stop)
            </span>
          </div>
          {transcript && (
            <p className="text-sm text-gray-700 mt-2" aria-live="polite">
              <strong>You said:</strong> {transcript}
            </p>
          )}
        </div>
      )}

      {/* Transcript Display */}
      {transcript && !isListening && (
        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-700">
              <strong>Transcript:</strong> {transcript}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearTranscript}
              aria-label="Clear transcript"
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          id="voice-error"
          className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-700">
            <strong>Error:</strong> {error}
          </p>
          {error.includes("microphone") || error.includes("not-allowed") && (
            <p className="text-xs text-red-600 mt-1">
              Please check your browser settings and grant microphone permissions.
            </p>
          )}
        </div>
      )}

      {/* Not Supported Message */}
      {!isSupported && showVoiceButton && (
        <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            Voice input is not supported in your browser. Try Chrome, Edge, or Safari.
          </p>
        </div>
      )}
    </div>
  );
}
