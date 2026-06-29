import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '../store';

// Helper to speak text in English
export const speakEnglish = (text: string, isMuted: boolean) => {
  if (isMuted) return;
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.8; // friendly, slightly slower pace for learners
  utterance.pitch = 1.15; // warm, cheerful tone

  const voices = window.speechSynthesis.getVoices();
  
  // Prioritize premium, friendly English voices (e.g. Google US English, Microsoft Zira)
  const friendlyVoice = voices.find(voice => 
    voice.lang.startsWith('en-US') && 
    (voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('natural'))
  ) || voices.find(voice => 
    voice.lang.startsWith('en-US')
  ) || voices.find(voice => 
    voice.lang.startsWith('en')
  );

  if (friendlyVoice) {
    utterance.voice = friendlyVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Synthesize play sound for correct answer
export const playCorrectSound = (isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    // Arpeggio chime: C5 -> E5 -> G5
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.error("Failed to play correct sound", e);
  }
};

// Synthesize play sound for incorrect answer
export const playIncorrectSound = (isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    const now = ctx.currentTime;
    // Disappointment slides: A3 -> D3
    osc.frequency.setValueAtTime(220.00, now); // A3
    osc.frequency.setValueAtTime(146.83, now + 0.12); // D3
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.error("Failed to play incorrect sound", e);
  }
};

interface SoundButtonProps {
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const SoundButton: React.FC<SoundButtonProps> = ({
  textToSpeak,
  label,
  size = 'md',
  className = "",
  children
}) => {
  const audioMuted = useAppStore(state => state.audioMuted);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card clicks triggering twice
    speakEnglish(textToSpeak, audioMuted);
  };

  const getButtonSizeClasses = () => {
    if (size === 'sm') return 'w-8 h-8';
    if (size === 'lg') return 'w-16 h-16';
    return 'w-12 h-12';
  };

  const getIconSize = () => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 32;
    return 24;
  };

  return (
    <button
      onClick={handleSpeak}
      className={`speaker-button ${getButtonSizeClasses()} flex-center ${className}`}
      title={`Dengarkan: "${textToSpeak}"`}
      type="button"
    >
      {audioMuted ? (
        <VolumeX size={getIconSize()} />
      ) : (
        <Volume2 size={getIconSize()} />
      )}
      {label && <span className="ml-2 font-bold font-din uppercase text-sm">{label}</span>}
      {children}
    </button>
  );
};
