import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Check, X, Star } from 'lucide-react';
import { useAppStore } from '../store';
import type { Scene, QuizOption } from '../data/modules';
import { SoundButton, speakEnglish, playCorrectSound, playIncorrectSound } from './SoundButton';
import { Mascot } from './Mascot';

interface ModuleRendererProps {
  scene: Scene;
  nextScene: () => void;
  prevScene: () => void;
  isFirst: boolean;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  scene,
  nextScene,
  prevScene,
  isFirst
}) => {
  const { 
    audioMuted, 
    addCorrect, 
    addIncorrect, 
    setMascot, 
    mascotState, 
    mascotSpeech,
    sessionScore,
    calculateStars
  } = useAppStore();

  // Local game states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [incorrectSelections, setIncorrectSelections] = useState<number[]>([]);
  const [shakeActive, setShakeActive] = useState(false);

  // Word Builder states
  const [wordLetters, setWordLetters] = useState<{ id: number; letter: string; used: boolean }[]>([]);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [wordSuccess, setWordSuccess] = useState(false);

  // Sentence Builder states
  const [sentenceWords, setSentenceWords] = useState<{ id: number; word: string; used: boolean }[]>([]);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [sentenceSuccess, setSentenceSuccess] = useState(false);

  // Styling helper lists
  const backgroundTints = [
    'bg-emerald-50/30 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50',
    'bg-blue-50/30 border-blue-200 hover:border-blue-400 hover:bg-blue-50/50',
    'bg-amber-50/30 border-amber-200 hover:border-amber-400 hover:bg-amber-50/50',
    'bg-purple-50/30 border-purple-200 hover:border-purple-400 hover:bg-purple-50/50',
    'bg-rose-50/30 border-rose-200 hover:border-rose-400 hover:bg-rose-50/50',
    'bg-sky-50/30 border-sky-200 hover:border-sky-400 hover:bg-sky-50/50'
  ];

  const vowelStyles = [
    { bg: 'bg-[#fff5e6]/40', border: 'border-[#ff9600]', text: 'text-[#ff9600]', badge: 'bg-[#ff9600]/10' }, // A
    { bg: 'bg-[#ffebf5]/40', border: 'border-[#cc348d]', text: 'text-[#cc348d]', badge: 'bg-[#cc348d]/10' }, // E
    { bg: 'bg-[#eef8ff]/40', border: 'border-[#1cb0f6]', text: 'text-[#1cb0f6]', badge: 'bg-[#1cb0f6]/10' }, // I
    { bg: 'bg-[#f5eefc]/40', border: 'border-[#a570ff]', text: 'text-[#a570ff]', badge: 'bg-[#a570ff]/10' }, // O
    { bg: 'bg-[#f0fbe8]/40', border: 'border-[#58cc02]', text: 'text-[#58cc02]', badge: 'bg-[#58cc02]/10' }  // U
  ];

  // Reset local state on scene change
  useEffect(() => {
    setSelectedOption(null);
    setAnsweredCorrectly(false);
    setIncorrectSelections([]);
    setShakeActive(false);

    // Initialize Word Builder
    if (scene.type === 'game-word' && scene.wordBuilder) {
      const word = scene.wordBuilder.word.toUpperCase();
      const scrambled = word.split('').map((letter, index) => ({
        id: index,
        letter,
        used: false
      })).sort(() => Math.random() - 0.5);
      
      setWordLetters(scrambled);
      setBuiltWord([]);
      setWordSuccess(false);
    }

    // Initialize Sentence Builder
    if (scene.type === 'game-sentence' && scene.sentenceBuilder) {
      const target = scene.sentenceBuilder.targetSentence.toUpperCase();
      const words = target.split(' ').map((word, index) => ({
        id: index,
        word,
        used: false
      })).sort(() => Math.random() - 0.5);

      setSentenceWords(words);
      setBuiltSentence([]);
      setSentenceSuccess(false);
    }

    // Set mascot default message
    if (scene.mascotMessage) {
      setMascot('talking', scene.mascotMessage);
    } else {
      if (scene.type === 'intro') {
        setMascot('talking', scene.mascotMessage || 'Mari kita mulai pertemuan kali ini!');
      } else if (scene.type === 'outro') {
        setMascot('happy', scene.mascotMessage || 'Kerja bagus semuanya! Sesi telah selesai.');
      } else {
        setMascot('idle', null);
      }
    }
  }, [scene, setMascot]);

  // Trigger confetti effect
  const triggerConfettiEffect = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle option selection in Quiz
  const handleOptionClick = (index: number, option: QuizOption) => {
    if (answeredCorrectly) return;
    if (incorrectSelections.includes(index)) return;

    setSelectedOption(index);

    if (option.isCorrect) {
      setAnsweredCorrectly(true);
      addCorrect();
      playCorrectSound(audioMuted);
      triggerConfettiEffect();
      setMascot('happy', 'Hore! Jawabanmu betul!');
      speakEnglish(option.text, audioMuted);
    } else {
      setIncorrectSelections([...incorrectSelections, index]);
      addIncorrect();
      playIncorrectSound(audioMuted);
      setShakeActive(true);
      setMascot('sad', 'Oh no! Coba lagi yuk!');
      setTimeout(() => setShakeActive(false), 500);
    }
  };

  // Word Builder letter click
  const handleLetterClick = (letterObj: { id: number; letter: string; used: boolean }) => {
    if (wordSuccess || letterObj.used) return;

    setWordLetters(prev => prev.map(item => item.id === letterObj.id ? { ...item, used: true } : item));
    const newBuilt = [...builtWord, letterObj.letter];
    setBuiltWord(newBuilt);

    speakEnglish(letterObj.letter, audioMuted);

    const targetWord = scene.wordBuilder!.word.toUpperCase();
    if (newBuilt.length === targetWord.length) {
      const joined = newBuilt.join('');
      if (joined === targetWord) {
        setWordSuccess(true);
        addCorrect();
        playCorrectSound(audioMuted);
        triggerConfettiEffect();
        setMascot('happy', `Hebat! Kamu berhasil menyusun kata ${targetWord}!`);
        speakEnglish(targetWord, audioMuted);
      } else {
        setShakeActive(true);
        playIncorrectSound(audioMuted);
        addIncorrect();
        setMascot('sad', 'Tatanan hurufnya belum tepat, ayo coba lagi!');
        setTimeout(() => {
          setShakeActive(false);
          setBuiltWord([]);
          setWordLetters(prev => prev.map(item => ({ ...item, used: false })));
        }, 800);
      }
    }
  };

  // Reset Word Builder
  const resetWordBuilder = () => {
    setBuiltWord([]);
    setWordLetters(prev => prev.map(item => ({ ...item, used: false })));
    setWordSuccess(false);
    setMascot('idle', 'Mari susun ulang hurufnya!');
  };

  // Sentence Builder word click
  const handleWordClick = (wordObj: { id: number; word: string; used: boolean }) => {
    if (sentenceSuccess || wordObj.used) return;

    setSentenceWords(prev => prev.map(item => item.id === wordObj.id ? { ...item, used: true } : item));
    const newBuilt = [...builtSentence, wordObj.word];
    setBuiltSentence(newBuilt);

    speakEnglish(wordObj.word, audioMuted);

    const targetSentence = scene.sentenceBuilder!.targetSentence.toUpperCase();
    const targetLength = targetSentence.split(' ').length;

    if (newBuilt.length === targetLength) {
      const joined = newBuilt.join(' ');
      if (joined === targetSentence) {
        setSentenceSuccess(true);
        addCorrect();
        playCorrectSound(audioMuted);
        triggerConfettiEffect();
        setMascot('happy', 'Mantap! Kalimat yang kamu susun sempurna!');
        speakEnglish(targetSentence, audioMuted);
      } else {
        setShakeActive(true);
        playIncorrectSound(audioMuted);
        addIncorrect();
        setMascot('sad', 'Kalimatnya belum tepat. Yuk kita susun ulang!');
        setTimeout(() => {
          setShakeActive(false);
          setBuiltSentence([]);
          setSentenceWords(prev => prev.map(item => ({ ...item, used: false })));
        }, 800);
      }
    }
  };

  // Reset Sentence Builder
  const resetSentenceBuilder = () => {
    setBuiltSentence([]);
    setSentenceWords(prev => prev.map(item => ({ ...item, used: false })));
    setSentenceSuccess(false);
    setMascot('idle', 'Mari susun ulang kata-katanya!');
  };

  // Render components according to scene type
  const renderSceneContent = () => {
    switch (scene.type) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center py-10 text-center scene-fade-in">
            <h2 className="text-4xl font-feather text-gray-800 mb-4">{scene.title}</h2>
            {scene.instruction && (
              <p className="text-lg text-gray-500 font-din max-w-xl leading-relaxed mb-10">
                {scene.instruction}
              </p>
            )}
            <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-dashed border-[#58cc02]/30 relative">
              <span className="text-8xl animate-bounce">🎒</span>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md animate-pulse">⭐</div>
              <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">🔔</div>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="flex flex-col gap-6 py-2 scene-fade-in">
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            {scene.instruction && (
              <p className="text-base text-gray-500 text-center -mt-2 mb-2 font-din">{scene.instruction}</p>
            )}

            {/* Alphabet presentation cards */}
            {scene.alphabetGroup && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-h-[440px] overflow-y-auto p-3">
                {scene.alphabetGroup.map((item, idx) => {
                  const tint = backgroundTints[idx % backgroundTints.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => speakEnglish(item.word, audioMuted)}
                      className={`card-3d flex flex-col items-center justify-center p-6 text-center select-none active:scale-95 ${tint}`}
                    >
                      {/* Medallion letter holder */}
                      <div className="w-16 h-16 rounded-full flex items-center justify-center font-feather text-3xl bg-white border-2 border-gray-100 shadow-sm text-gray-800 mb-2">
                        {item.letter}
                      </div>
                      
                      {/* Emoji illustration frame */}
                      <div className="w-24 h-24 rounded-xl bg-white/80 flex items-center justify-center text-6xl my-2 border-2 border-gray-100/30">
                        {item.emoji}
                      </div>
                      
                      <span className="text-xl font-extrabold font-din text-gray-800 mt-2">{item.word}</span>
                      <span className="text-sm font-din text-gray-500 font-bold italic">({item.indonesian})</span>
                      
                      <div className="mt-4">
                        <SoundButton textToSpeak={item.word} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Phonics vowels */}
            {scene.phonicsVowels && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
                {scene.phonicsVowels.map((item, idx) => {
                  const style = vowelStyles[idx % vowelStyles.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => speakEnglish(item.vowel, audioMuted)}
                      className={`card-3d flex flex-col items-center justify-center p-5 text-center active:scale-95 ${style.bg} ${style.border}`}
                    >
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-feather text-6xl ${style.text} bg-white shadow-sm mb-4`}>
                        {item.vowel}
                      </div>
                      <span className={`text-xs font-bold ${style.text} ${style.badge} rounded-full px-3 py-1 font-din mb-4 uppercase tracking-wider`}>
                        {item.sound}
                      </span>
                      <div className="text-left w-full text-sm font-din text-gray-600 bg-white/70 p-3 rounded-xl border border-gray-100">
                        <p className="font-extrabold text-gray-700 text-center mb-1 text-xs border-b border-gray-200/50 pb-1 uppercase">Contoh</p>
                        {item.examples.map((ex, exIdx) => (
                          <p key={exIdx} className="text-xs truncate font-semibold text-gray-700 mt-1">✨ {ex}</p>
                        ))}
                      </div>
                      <div className="mt-4">
                        <SoundButton textToSpeak={item.vowel} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Greetings / Phrases Alternating Dialogues */}
            {scene.phrases && (
              <div className="flex flex-col gap-4 max-w-xl mx-auto w-full p-6 bg-gray-50 rounded-xl border-2 border-gray-200/60 min-h-[300px] justify-center shadow-inner relative">
                <div className="absolute top-2.5 left-4 text-[10px] text-gray-400 font-bold font-din uppercase tracking-wider">
                  Kartu Percakapan
                </div>
                
                {scene.phrases.map((phrase, idx) => {
                  const isA = phrase.english.startsWith('A:');
                  const isB = phrase.english.startsWith('B:');
                  const displayEnglish = phrase.english.replace(/^[AB]:\s*/, '');
                  const displayIndonesian = phrase.indonesian.replace(/^[AB]:\s*/, '');
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => speakEnglish(phrase.audioText, audioMuted)}
                      className={`flex flex-col gap-1 p-4 max-w-[85%] border-2 cursor-pointer transition-all duration-150 relative shadow-sm hover:scale-[1.02] active:scale-98
                        ${isA 
                          ? 'dialogue-left bg-[#eef8ff] border-[#84d8ff] text-[#1cb0f6] align-self-start' 
                          : isB 
                          ? 'dialogue-right bg-[#f0fbe8] border-[#a2e048] text-[#3f8f01] align-self-end' 
                          : 'align-self-center bg-white border-gray-200 text-gray-800 rounded-xl'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold font-din">{displayEnglish}</span>
                        <span className="opacity-60 text-xs">🔊</span>
                      </div>
                      <span className="text-xs font-din opacity-80 border-t border-current/20 pt-0.5 mt-0.5">
                        {displayIndonesian}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'game-quiz':
        if (!scene.quizQuestion) return null;
        const q = scene.quizQuestion;
        return (
          <div className={`flex flex-col gap-5 py-2 scene-fade-in ${shakeActive ? 'anim-shake' : ''}`}>
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            <p className="text-base text-gray-500 text-center font-din -mt-2 mb-2">{scene.instruction}</p>

            <div className="card-3d max-w-2xl mx-auto w-full p-6 bg-white border-2 border-gray-200 shadow-none cursor-default hover:border-gray-200 hover:transform-none hover:shadow-none flex flex-col items-center">
              {q.isAudioOnly ? (
                <div className="flex flex-col items-center justify-center p-8 gap-4 bg-sky-50/50 rounded-xl border border-sky-100/50 w-full">
                  <p className="text-lg font-bold font-din text-sky-600 uppercase tracking-wider">Dengar dan Tebak Katanya</p>
                  <SoundButton textToSpeak={q.audioText || ""} size="lg" className="scale-125 my-4" />
                  <p className="text-xs font-din text-gray-400">Klik tombol speaker untuk memutar ulang suara</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center w-full bg-emerald-50/20 rounded-xl border border-emerald-100/40">
                  <h3 className="text-2xl font-feather text-gray-800 mb-4">{q.question}</h3>
                  {/* Visual Icons to match question context */}
                  {q.question.includes("(Buku / Book)") && <span className="text-8xl mb-2 animate-bounce">📘</span>}
                  {q.question.includes("🐰") && <span className="text-8xl mb-2 animate-[wiggle_1.5s_infinite]">🐰</span>}
                  {q.question.includes("MERAH") && <span className="text-8xl mb-2 text-rose-500 animate-pulse">🎈</span>}
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                {q.options.map((option, idx) => {
                  const isIncorrect = incorrectSelections.includes(idx);
                  const isCorrect = answeredCorrectly && option.isCorrect;
                  const isSelected = selectedOption === idx;
                  
                  let cardClass = "";
                  if (isCorrect) cardClass = "correct";
                  else if (isIncorrect) cardClass = "incorrect";
                  else if (isSelected) cardClass = "selected";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx, option)}
                      disabled={answeredCorrectly || isIncorrect}
                      className={`card-3d text-left p-4 flex items-center justify-between font-din w-full ${cardClass}`}
                      style={option.color ? { borderLeft: `8px solid ${option.color}` } : {}}
                      type="button"
                    >
                      <div className="flex items-center gap-4">
                        {/* 3D Keycap block marker */}
                        <span className="w-10 h-10 rounded-xl border-b-4 border-2 border-gray-200 bg-white flex items-center justify-center font-bold text-gray-400 font-feather text-base shadow-sm">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div>
                          <p className="text-xl font-extrabold text-gray-800">{option.text}</p>
                          {option.indonesian && (
                            <p className="text-sm text-gray-500 font-semibold">{option.indonesian}</p>
                          )}
                        </div>
                      </div>
                      
                      {option.emoji && <span className="text-4xl mr-1">{option.emoji}</span>}
                      {isCorrect && <Check className="text-emerald-500 stroke-[3]" size={24} />}
                      {isIncorrect && <X className="text-rose-500 stroke-[3]" size={24} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'game-word':
        if (!scene.wordBuilder) return null;
        const wb = scene.wordBuilder;
        return (
          <div className={`flex flex-col gap-5 py-2 scene-fade-in ${shakeActive ? 'anim-shake' : ''}`}>
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            <p className="text-base text-gray-500 text-center font-din -mt-2 mb-2">{scene.instruction}</p>

            <div className="card-3d max-w-2xl mx-auto w-full p-8 bg-white border-2 border-gray-200 shadow-none cursor-default hover:border-gray-200 hover:transform-none hover:shadow-none flex flex-col items-center">
              {/* Image Hint Container */}
              <div className="flex flex-col items-center mb-6 bg-amber-50/30 p-5 rounded-xl border border-amber-100/50 w-full max-w-sm">
                <span className="text-8xl mb-2 animate-[wiggle_2s_infinite]">{wb.emoji}</span>
                <h3 className="text-2xl font-feather text-gray-700">{wb.indonesian}</h3>
              </div>

              {/* Built Word Slots (puzzle boxes) */}
              <div className="flex gap-3 mb-8 items-center justify-center">
                {wb.word.split('').map((_, idx) => {
                  const filledLetter = builtWord[idx];
                  return (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-feather transition-all duration-200 shadow-inner
                        ${filledLetter 
                          ? 'border-[#58cc02] bg-[#d7ffb8]/30 text-[#3f8f01]' 
                          : 'border-dashed border-gray-300 bg-gray-50/50 text-transparent'
                        }`}
                    >
                      {filledLetter || ''}
                    </div>
                  );
                })}
              </div>

              {/* Letter Pool (3D raised keycaps) */}
              <div className="flex gap-4 mb-8 flex-wrap justify-center">
                {wordLetters.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLetterClick(item)}
                    disabled={item.used || wordSuccess}
                    className="btn-3d btn-3d-outline w-16 h-16 text-3xl font-feather flex items-center justify-center disabled:opacity-10 disabled:top-1 disabled:box-shadow-none"
                    type="button"
                  >
                    {item.letter}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={resetWordBuilder}
                  disabled={wordSuccess || builtWord.length === 0}
                  className="btn-3d btn-3d-gray px-6 py-2.5 text-sm flex items-center gap-2"
                  type="button"
                >
                  <RotateCcw size={16} /> Reset
                </button>

              </div>
            </div>
          </div>
        );

      case 'game-sentence':
        if (!scene.sentenceBuilder) return null;
        const sb = scene.sentenceBuilder;
        return (
          <div className={`flex flex-col gap-5 py-2 scene-fade-in ${shakeActive ? 'anim-shake' : ''}`}>
            <h2 className="text-3xl text-gray-800 text-center font-feather">{scene.title}</h2>
            <p className="text-base text-gray-500 text-center font-din -mt-2 mb-2">{scene.instruction}</p>

            <div className="card-3d max-w-3xl mx-auto w-full p-8 bg-white border-2 border-gray-200 shadow-none cursor-default hover:border-gray-200 hover:transform-none hover:shadow-none flex flex-col items-center">
              
              {/* Target Phrase Box */}
              <div className="flex items-center gap-5 bg-sky-50/50 rounded-xl px-8 py-5 border border-sky-100/50 mb-8 max-w-md w-full justify-center">
                {sb.hintEmoji && <span className="text-6xl animate-pulse">{sb.hintEmoji}</span>}
                <div className="text-left">
                  <p className="text-[10px] text-sky-500 font-din font-bold uppercase tracking-wider mb-0.5">Bahasa Indonesia</p>
                  <p className="text-2xl font-extrabold font-din text-gray-700 leading-tight">"{sb.indonesian}"</p>
                </div>
              </div>

              {/* Built Sentence Slots */}
              <div className="flex flex-wrap gap-3 mb-8 items-center justify-center min-h-[64px] w-full border-b-2 border-dashed border-gray-200 pb-4">
                {builtSentence.length === 0 ? (
                  <span className="text-gray-300 font-din font-semibold italic text-base">Klik kata di bawah untuk menyusun kalimat...</span>
                ) : (
                  builtSentence.map((word, idx) => (
                    <div
                      key={idx}
                      className="bg-[#d7ffb8] border-2 border-[#58cc02] text-[#3f8f01] font-extrabold font-din rounded-xl px-5 py-3 text-lg shadow-sm"
                    >
                      {word}
                    </div>
                  ))
                )}
              </div>

              {/* Word Blocks Pool */}
              <div className="flex gap-4 mb-8 flex-wrap justify-center">
                {sentenceWords.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleWordClick(item)}
                    disabled={item.used || sentenceSuccess}
                    className="btn-3d btn-3d-outline text-xl font-extrabold font-din px-6 py-3 disabled:opacity-10 disabled:top-1 disabled:box-shadow-none"
                    type="button"
                  >
                    {item.word}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={resetSentenceBuilder}
                  disabled={sentenceSuccess || builtSentence.length === 0}
                  className="btn-3d btn-3d-gray px-6 py-2.5 text-sm flex items-center gap-2"
                  type="button"
                >
                  <RotateCcw size={16} /> Susun Ulang
                </button>

              </div>
            </div>
          </div>
        );

      case 'outro':
        const stars = calculateStars(3);

        return (
          <div className="flex flex-col items-center justify-center py-6 text-center scene-fade-in max-w-xl mx-auto">
            <h2 className="text-4xl text-[#58cc02] font-feather mb-2">Selamat! Kamu Lolos!</h2>
            <p className="text-lg text-gray-500 font-din mb-8">Modul ini telah berhasil diselesaikan bersama-sama.</p>

            {/* Glowing Reward Stars */}
            <div className="flex gap-6 mb-8 justify-center items-center">
              {[1, 2, 3].map((starIdx) => {
                const isActive = starIdx <= stars;
                return (
                  <div
                    key={starIdx}
                    className={`transition-all duration-500 transform ${isActive ? 'scale-115 animate-[wiggle_2.5s_infinite]' : 'opacity-25 scale-90'}`}
                    style={{ animationDelay: `${starIdx * 0.25}s` }}
                  >
                    <Star
                      fill={isActive ? "#ffc700" : "none"}
                      stroke={isActive ? "#d0a200" : "#afafaf"}
                      size={starIdx === 2 ? 96 : 72}
                      className={isActive ? "drop-shadow-[0_6px_12px_rgba(255,199,0,0.6)]" : ""}
                    />
                  </div>
                );
              })}
            </div>

            {/* Statistics Cards */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 w-full max-w-sm mb-6 font-din text-gray-700 shadow-none">
              <h3 className="font-feather text-gray-800 text-lg mb-4 border-b border-gray-100 pb-2">Statistik Belajar</h3>
              <div className="flex justify-between border-b border-gray-100 pb-3 mb-3">
                <span className="font-bold text-gray-500">Jawaban Betul:</span>
                <span className="font-extrabold text-emerald-600 text-lg">{sessionScore.correct} ✅</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3 mb-3">
                <span className="font-bold text-gray-500">Jawaban Salah:</span>
                <span className="font-extrabold text-rose-500 text-lg">{sessionScore.incorrect} ❌</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-gray-500">Bintang Didapat:</span>
                <span className="font-extrabold text-yellow-600 text-lg">{stars} / 3 ⭐</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isGameScene = scene.type === 'game-quiz' || scene.type === 'game-word' || scene.type === 'game-sentence';
  const isGameSolved = 
    (scene.type === 'game-quiz' && answeredCorrectly) ||
    (scene.type === 'game-word' && wordSuccess) ||
    (scene.type === 'game-sentence' && sentenceSuccess);
  
  const canGoNext = !isGameScene || isGameSolved;

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start justify-center py-6 w-full">
      {/* Mascot Side Panel */}
      <div className="w-full md:w-1/3 flex flex-col items-center">
        <Mascot state={mascotState} speechText={mascotSpeech} />
      </div>

      {/* Main Slide Card Container */}
      <div className="w-full md:w-2/3 flex flex-col min-h-[500px]">
        <div className="flex-1 bg-white rounded-xl border-2 border-cloud-gray p-6 md:p-8 flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center">
            {renderSceneContent()}
          </div>

          {/* Bottom Slide Navigation */}
          <div className="flex justify-between border-t border-gray-100 pt-6 mt-6">
            <button
              onClick={prevScene}
              disabled={isFirst || answeredCorrectly || wordSuccess || sentenceSuccess || scene.type === 'outro'}
              className="btn-3d btn-3d-gray px-6 py-2.5 text-sm"
              type="button"
            >
              Kembali
            </button>

            {scene.type !== 'outro' ? (
              <button
                onClick={nextScene}
                disabled={!canGoNext}
                className={`btn-3d px-10 py-3 text-sm transition-all duration-150 ${canGoNext ? (isGameScene ? 'btn-3d-green animate-pulse' : 'btn-3d-blue') : 'btn-3d-gray'}`}
                type="button"
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={() => useAppStore.getState().setModule(null)}
                className="btn-3d btn-3d-green px-10 py-3 text-sm"
                type="button"
              >
                Selesai Kelas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
