import { useState, useEffect, useCallback, useRef } from 'react';
import { announceToScreenReader } from './use-accessibility';

interface VoiceInputState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
  isFinal: boolean;
}

export function useVoiceInput(onTranscript?: (text: string) => void) {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    isSupported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    transcript: '',
    error: null,
    isFinal: false,
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!state.isSupported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = localStorage.getItem('language') || 'en-US';

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));
      announceToScreenReader('Voice input started. Speak now.', 'polite');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript || interimTranscript,
        isFinal: finalTranscript.length > 0,
      }));

      if (finalTranscript) {
        onTranscript?.(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        'network': 'Network error. Please check your connection.',
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone found. Please check permissions.',
        'not-allowed': 'Microphone access denied. Please allow permissions.',
      };

      const errorMsg = errorMessages[event.error] || `Error: ${event.error}`;
      setState(prev => ({ ...prev, error: errorMsg, isListening: false }));
      announceToScreenReader(errorMsg, 'assertive');
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
      if (state.transcript) {
        announceToScreenReader(`You said: ${state.transcript}`, 'polite');
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [state.isSupported, onTranscript]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      recognitionRef.current.start();
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', error: null }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
  };
}
